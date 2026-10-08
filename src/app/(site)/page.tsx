import { Hero } from "@/components/home/Hero";
import { PromoBanner } from "@/components/home/PromoBanner";
import { BrandPresentation } from "@/components/home/BrandPresentation";
import { FeaturedCakes } from "@/components/home/FeaturedCakes";
import { WhyChooseUs } from "@/components/home/WhyChooseUs";
import { CakeCategories } from "@/components/home/CakeCategories";
import { OrderCta } from "@/components/home/OrderCta";
import { GalleryPreview, Testimonials } from "@/components/home/SocialProof";
import { WhatsAppCta } from "@/components/home/WhatsAppCta";
import { getSiteContent } from "@/lib/content";

export default async function Home() {
  const content = await getSiteContent();
  return (
    <>
      <PromoBanner promotions={content.promotions} />
      <Hero />
      <BrandPresentation />
      <FeaturedCakes />
      <WhyChooseUs />
      <CakeCategories />
      <OrderCta />
      <Testimonials />
      <GalleryPreview />
      <WhatsAppCta />
    </>
  );
}
