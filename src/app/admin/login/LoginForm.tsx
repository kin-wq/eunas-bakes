"use client";

import { useActionState } from "react";
import { loginAction, type LoginState } from "@/app/admin/actions";

const initial: LoginState = { ok: false };

export function LoginForm({ from }: { from: string }) {
  const [state, submit, pending] = useActionState(loginAction, initial);
  return (
    <form
      action={submit}
      className="rounded-3xl bg-white/5 p-6 ring-1 ring-white/10 sm:p-8"
    >
      <h1 className="font-display text-2xl font-bold">Admin sign in</h1>
      <p className="mt-2 text-sm text-white/60">
        Only the bakery owner should be here. Customers can order on the main
        website.
      </p>
      <input type="hidden" name="from" value={from} />
      <label className="mt-6 block text-sm font-bold">
        Password
        <input
          type="password"
          name="password"
          required
          autoComplete="current-password"
          placeholder="Enter admin password"
          className="mt-2 min-h-[52px] w-full rounded-2xl bg-white/10 px-4 text-[15px] text-white ring-1 ring-white/15 placeholder:text-white/35 focus:ring-2 focus:ring-blush-300 focus:outline-none"
        />
      </label>
      {state.error ? (
        <p role="alert" className="mt-3 rounded-xl bg-red-500/15 px-4 py-3 text-sm font-semibold text-red-200">
          {state.error}
        </p>
      ) : null}
      <button
        type="submit"
        disabled={pending}
        className="mt-5 inline-flex min-h-[52px] w-full items-center justify-center rounded-full bg-blush-400 px-8 text-sm font-bold text-plum-900 transition-opacity hover:opacity-90 disabled:opacity-50"
      >
        {pending ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
