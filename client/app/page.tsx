
import HeroSection from '@/components/sections/HeroSection';
import FeatureCards from '@/components/sections/FeatureCards';
import Footer from '@/components/sections/Footer';
import Navbar from '@/components/Navbar';

export default function Home() {
  return (
    <>
        <Navbar  />

      {/* ── Sections in scroll order ─────────────────── */}
      <HeroSection />
      <FeatureCards />
      <Footer />
    </>
  );
}