
import HeroSection from '@/components/sections/HeroSection';
import MarqueeSection from '@/components/sections/MarqueeSection';
import ProblemSolutionSection from '@/components/sections/ProblemSolutionSection';
import FeaturesSection from '@/components/sections/FeaturesSection';
import FeatureCards from '@/components/sections/FeatureCards';
import WorkflowSection from '@/components/sections/WorkflowSection';
import KnowledgeGraphSection from '@/components/sections/KnowledgeGraphSection';
import TestimonialsSection from '@/components/sections/TestimonialsSection';
import PricingSection from '@/components/sections/PricingSection';
import CTASection from '@/components/sections/CTASection';
import Footer from '@/components/sections/Footer';
import Navbar from '@/components/Navbar';

export default function Home() {
  return (
    <>
        <Navbar  />

      {/* ── Sections in scroll order ─────────────────── */}
      <HeroSection />
      <MarqueeSection />
      <ProblemSolutionSection />
      <FeaturesSection />
      <FeatureCards />
      <WorkflowSection />
      <KnowledgeGraphSection />
      <TestimonialsSection />
      <PricingSection />
      <CTASection />
      <Footer />
    </>
  );
}