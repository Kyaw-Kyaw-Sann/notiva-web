import { AiPreviewSection } from "@/components/landing/ai-preview-section";
import { CtaSection } from "@/components/landing/cta-section";
import { FeaturesSection } from "@/components/landing/features-section";
import { HeroSection } from "@/components/landing/hero-section";
import { LandingFooter } from "@/components/landing/landing-footer";
import { LandingNavbar } from "@/components/landing/landing-navbar";
import { NotesPreviewSection } from "@/components/landing/notes-preview-section";
import { ProductPreview } from "@/components/landing/product-preview";
import { WhyNotivaSection } from "@/components/landing/why-notiva-section";

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <LandingNavbar />
      <main>
        <HeroSection />
        <ProductPreview />
        <FeaturesSection />
        <AiPreviewSection />
        <NotesPreviewSection />
        <WhyNotivaSection />
        <CtaSection />
      </main>
      <LandingFooter />
    </div>
  );
}
