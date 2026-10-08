"use server";

import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { updateTag } from "next/cache";
import {
  ADMIN_COOKIE,
  createSessionToken,
  getAdminConfig,
  verifyPassword,
  verifySessionToken,
} from "@/lib/admin-auth";
import { loginAllowed, recordLoginAttempt } from "@/lib/rate-limit";
import {
  readOverrides,
  writeOverrides,
  type ContentOverrides,
} from "@/lib/content";

/* ------------------------------ session ------------------------------ */

async function currentSessionValid(): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_COOKIE)?.value;
  if (!token) return false;
  const { secret, enabled } = getAdminConfig();
  if (!enabled) return false;
  return verifySessionToken(token, secret).catch(() => false);
}

export async function requireAdmin(): Promise<void> {
  if (!(await currentSessionValid())) redirect("/admin/login");
}

function safeRedirectTarget(from: string | null): string {
  if (from && from.startsWith("/admin") && !from.startsWith("//")) return from;
  return "/admin";
}

/* ------------------------------- login ------------------------------- */

export type LoginState = { ok: boolean; error?: string };

export async function loginAction(
  _prev: LoginState,
  formData: FormData
): Promise<LoginState> {
  const config = getAdminConfig();
  const headerStore = await headers();
  const ip =
    headerStore.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";

  if (!config.enabled) {
    return {
      ok: false,
      error:
        "Admin access is not configured. Set EUNAS_ADMIN_PASSWORD (min 8 characters) in the environment.",
    };
  }
  if (!loginAllowed(ip)) {
    return {
      ok: false,
      error: "Too many attempts. Please wait a few minutes and try again.",
    };
  }
  recordLoginAttempt(ip);

  const password = String(formData.get("password") ?? "");
  if (!(await verifyPassword(password, config))) {
    return { ok: false, error: "Incorrect password." };
  }

  const token = await createSessionToken(config.secret);
  const cookieStore = await cookies();
  cookieStore.set(ADMIN_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 12 * 60 * 60,
  });

  redirect(safeRedirectTarget(String(formData.get("from") ?? null)));
}

export async function logoutAction(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(ADMIN_COOKIE);
  redirect("/admin/login");
}

/* ---------------------------- validation ----------------------------- */

type V<T> = { value: T } | { error: string };

function bad(r: V<unknown>): r is { error: string } {
  return "error" in r;
}

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}

function vText(v: unknown, min: number, max: number, field: string): V<string> {
  if (typeof v !== "string") return { error: `${field} must be text.` };
  const t = v.trim();
  if (t.length < min || t.length > max)
    return { error: `${field} must be ${min}–${max} characters.` };
  return { value: t };
}

function vNum(v: unknown, min: number, max: number, field: string): V<number> {
  if (typeof v !== "number" || !Number.isFinite(v))
    return { error: `${field} must be a number.` };
  if (v < min || v > max)
    return { error: `${field} must be between ${min} and ${max}.` };
  return { value: v };
}

function vBool(v: unknown, field: string): V<boolean> {
  if (typeof v !== "boolean") return { error: `${field} must be yes/no.` };
  return { value: v };
}

function vId(v: unknown, field: string): V<string> {
  if (typeof v !== "string" || !/^[A-Za-z0-9-_]{1,60}$/.test(v))
    return { error: `${field} has an invalid id.` };
  return { value: v };
}

function vImage(v: unknown, field: string): V<string> {
  if (typeof v !== "string") return { error: `${field} must be a URL.` };
  const t = v.trim();
  if (!(t.startsWith("https://") || t.startsWith("/")) || t.length > 500)
    return { error: `${field} must be an https:// or /local-path URL.` };
  return { value: t };
}

type Ok = { ok: true; value: ContentOverrides };
type Fail = { ok: false; error: string };
function fail(error: string): Fail {
  return { ok: false, error };
}

function validateSection(
  section: string,
  data: unknown,
  categoryIds: string[]
): Ok | Fail {
  if (section === "whatsapp") {
    if (!isRecord(data)) return fail("Invalid data.");
    const display = vText(data.displayNumber, 5, 30, "Display number");
    if (bad(display)) return fail(display.error);
    const intl = vText(data.internationalNumber, 7, 15, "WhatsApp number");
    if (bad(intl)) return fail(intl.error);
    const msg = vText(data.defaultMessage, 5, 500, "Default message");
    if (bad(msg)) return fail(msg.error);
    if (!/^\d+$/.test(intl.value))
      return fail("WhatsApp number must be digits only, e.g. 263776594276.");
    return {
      ok: true,
      value: {
        whatsapp: {
          displayNumber: display.value,
          internationalNumber: intl.value,
          defaultMessage: msg.value,
        },
      },
    };
  }

  if (section === "brand") {
    if (!isRecord(data)) return fail("Invalid data.");
    const name = vText(data.name, 2, 60, "Brand name");
    if (bad(name)) return fail(name.error);
    const tagline = vText(data.tagline, 2, 120, "Tagline");
    if (bad(tagline)) return fail(tagline.error);
    const description = vText(data.description, 10, 500, "Description");
    if (bad(description)) return fail(description.error);
    const developer = vText(data.developer, 2, 120, "Developer credit");
    if (bad(developer)) return fail(developer.error);
    return {
      ok: true,
      value: {
        brand: {
          name: name.value,
          tagline: tagline.value,
          description: description.value,
          developer: developer.value,
        },
      },
    };
  }

  if (section === "business") {
    if (!isRecord(data)) return fail("Invalid data.");
    const deposit = vText(data.depositNotice, 5, 300, "Deposit notice");
    if (bad(deposit)) return fail(deposit.error);
    const decor = vText(data.decorationNotice, 5, 300, "Decoration notice");
    if (bad(decor)) return fail(decor.error);
    const loc = vText(data.locationPlaceholder, 5, 300, "Location note");
    if (bad(loc)) return fail(loc.error);
    const hours = vText(data.hoursPlaceholder, 5, 300, "Hours note");
    if (bad(hours)) return fail(hours.error);
    return {
      ok: true,
      value: {
        business: {
          depositNotice: deposit.value,
          decorationNotice: decor.value,
          locationPlaceholder: loc.value,
          hoursPlaceholder: hours.value,
        },
      },
    };
  }

  if (section === "categories") {
    if (!Array.isArray(data) || data.length < 1 || data.length > 12)
      return fail("Provide 1–12 categories.");
    const out: NonNullable<ContentOverrides["categories"]> = [];
    for (const [i, c] of data.entries()) {
      if (!isRecord(c)) return fail(`Category ${i + 1} is invalid.`);
      const cid = vId(c.id, `Category ${i + 1}`);
      if (bad(cid)) return fail(cid.error);
      const name = vText(c.name, 2, 60, `Category ${i + 1} name`);
      if (bad(name)) return fail(name.error);
      const desc = vText(c.shortDescription, 5, 300, `${name.value} description`);
      if (bad(desc)) return fail(desc.error);
      const image = vImage(c.image, `${name.value} image`);
      if (bad(image)) return fail(image.error);

      if (!Array.isArray(c.sizes) || c.sizes.length < 1 || c.sizes.length > 8)
        return fail(`${name.value} needs 1–8 sizes.`);
      const sizes: { label: string; price: number; from?: true }[] = [];
      for (const [j, s] of c.sizes.entries()) {
        if (!isRecord(s)) return fail(`${name.value} size ${j + 1} is invalid.`);
        const label = vText(s.label, 1, 40, `${name.value} size ${j + 1} label`);
        if (bad(label)) return fail(label.error);
        const price = vNum(s.price, 0, 100000, `${name.value} ${label.value} price`);
        if (bad(price)) return fail(price.error);
        const from = vBool(s.from ?? false, `${name.value} size flag`);
        if (bad(from)) return fail(from.error);
        sizes.push({ label: label.value, price: price.value, ...(from.value ? { from: true as const } : {}) });
      }

      if (!Array.isArray(c.flavours) || c.flavours.length < 1 || c.flavours.length > 15)
        return fail(`${name.value} needs 1–15 flavours.`);
      const flavours: string[] = [];
      for (const f of c.flavours) {
        const r = vText(f, 1, 60, `${name.value} flavour`);
        if (bad(r)) return fail(r.error);
        flavours.push(r.value);
      }

      let surcharge: number | undefined;
      if (c.surchargePerOrder !== undefined && c.surchargePerOrder !== null && c.surchargePerOrder !== "") {
        const r = vNum(Number(c.surchargePerOrder), 0, 1000, `${name.value} surcharge`);
        if (bad(r)) return fail(r.error);
        surcharge = r.value;
      }
      let surchargeNote: string | undefined;
      if (typeof c.surchargeNote === "string" && c.surchargeNote.trim() !== "") {
        const r = vText(c.surchargeNote, 1, 120, `${name.value} surcharge note`);
        if (bad(r)) return fail(r.error);
        surchargeNote = r.value;
      }

      out.push({
        id: cid.value,
        name: name.value,
        slug: cid.value,
        shortDescription: desc.value,
        image: image.value,
        sizes,
        flavours,
        ...(surcharge !== undefined ? { surchargePerOrder: surcharge } : {}),
        ...(surchargeNote !== undefined ? { surchargeNote } : {}),
        featured: true,
      });
    }
    const ids = out.map((c) => c.id);
    if (new Set(ids).size !== ids.length) return fail("Category ids must be unique.");
    return { ok: true, value: { categories: out } };
  }

  if (section === "featured") {
    if (!Array.isArray(data) || data.length > 12)
      return fail("Provide up to 12 featured items.");
    const out: NonNullable<ContentOverrides["featured"]> = [];
    for (const [i, f] of data.entries()) {
      if (!isRecord(f)) return fail(`Featured item ${i + 1} is invalid.`);
      const fid = vId(f.id, "Featured item");
      if (bad(fid)) return fail(fid.error);
      const categoryId = vText(f.categoryId, 1, 60, "Featured category");
      if (bad(categoryId)) return fail(categoryId.error);
      const name = vText(f.name, 2, 80, "Featured name");
      if (bad(name)) return fail(name.error);
      const description = vText(f.description, 5, 300, "Featured description");
      if (bad(description)) return fail(description.error);
      const price = vNum(f.startingPrice, 0, 100000, "Featured price");
      if (bad(price)) return fail(price.error);
      const suffix = vText(f.priceSuffix, 1, 80, "Featured price label");
      if (bad(suffix)) return fail(suffix.error);
      const image = vImage(f.image, "Featured image");
      if (bad(image)) return fail(image.error);
      let tag: string | undefined;
      if (typeof f.tag === "string" && f.tag.trim() !== "") {
        const r = vText(f.tag, 1, 30, "Featured tag");
        if (bad(r)) return fail(r.error);
        tag = r.value;
      }
      if (!categoryIds.includes(categoryId.value))
        return fail(`"${name.value}" links to unknown category "${categoryId.value}".`);
      out.push({
        id: fid.value,
        categoryId: categoryId.value,
        name: name.value,
        description: description.value,
        startingPrice: price.value,
        priceSuffix: suffix.value,
        image: image.value,
        ...(tag !== undefined ? { tag } : {}),
      });
    }
    return { ok: true, value: { featured: out } };
  }

  if (section === "gallery") {
    if (!Array.isArray(data) || data.length > 24)
      return fail("Provide up to 24 photos.");
    const out: NonNullable<ContentOverrides["gallery"]> = [];
    for (const [i, g] of data.entries()) {
      if (!isRecord(g)) return fail(`Photo ${i + 1} is invalid.`);
      const gid = vId(g.id, "Photo");
      if (bad(gid)) return fail(gid.error);
      const image = vImage(g.image, "Photo image");
      if (bad(image)) return fail(image.error);
      const alt = vText(g.alt, 5, 200, "Photo description");
      if (bad(alt)) return fail(alt.error);
      out.push({ id: gid.value, image: image.value, alt: alt.value });
    }
    return { ok: true, value: { gallery: out } };
  }

  if (section === "testimonials") {
    if (!Array.isArray(data) || data.length > 24)
      return fail("Provide up to 24 testimonials.");
    const out: NonNullable<ContentOverrides["testimonials"]> = [];
    for (const [i, t] of data.entries()) {
      if (!isRecord(t)) return fail(`Testimonial ${i + 1} is invalid.`);
      const tid = vId(t.id, "Testimonial");
      if (bad(tid)) return fail(tid.error);
      const quote = vText(t.quote, 5, 600, "Testimonial quote");
      if (bad(quote)) return fail(quote.error);
      const name = vText(t.name, 1, 80, "Customer name");
      if (bad(name)) return fail(name.error);
      const occasion = vText(t.occasion, 1, 80, "Occasion");
      if (bad(occasion)) return fail(occasion.error);
      const ph = vBool(t.isPlaceholder ?? false, "Placeholder flag");
      if (bad(ph)) return fail(ph.error);
      out.push({
        id: tid.value,
        quote: quote.value,
        name: name.value,
        occasion: occasion.value,
        isPlaceholder: ph.value,
      });
    }
    return { ok: true, value: { testimonials: out } };
  }

  if (section === "promotions") {
    if (!Array.isArray(data) || data.length > 10)
      return fail("Provide up to 10 promotions.");
    const out: NonNullable<ContentOverrides["promotions"]> = [];
    for (const [i, p] of data.entries()) {
      if (!isRecord(p)) return fail(`Promotion ${i + 1} is invalid.`);
      const pid = vId(p.id, "Promotion");
      if (bad(pid)) return fail(pid.error);
      const title = vText(p.title, 2, 80, "Promotion title");
      if (bad(title)) return fail(title.error);
      const message = vText(p.message, 5, 300, "Promotion message");
      if (bad(message)) return fail(message.error);
      const active = vBool(p.active ?? false, "Promotion active flag");
      if (bad(active)) return fail(active.error);
      out.push({
        id: pid.value,
        title: title.value,
        message: message.value,
        active: active.value,
      });
    }
    return { ok: true, value: { promotions: out } };
  }

  return fail("Unknown section.");
}

/* ------------------------------ saving ------------------------------- */

export type SaveState = { ok: boolean; error?: string };

export async function saveSectionAction(
  section: string,
  json: string
): Promise<SaveState> {
  if (!(await currentSessionValid())) {
    return { ok: false, error: "Not signed in." };
  }
  let data: unknown;
  try {
    data = JSON.parse(json);
  } catch {
    return { ok: false, error: "Invalid data submitted." };
  }

  const current = await readOverrides();
  const categoryIds = (
    current.categories ?? (await import("@/data/products")).cakeCategories
  ).map((c) => c.id);

  const result = validateSection(section, data, categoryIds);
  if (!result.ok) return { ok: false, error: result.error };

  await writeOverrides({ ...current, ...result.value });
  updateTag("site-content");
  return { ok: true };
}
