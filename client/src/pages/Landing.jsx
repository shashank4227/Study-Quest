import Hero from '../components/landing/Hero';
import Stats from '../components/landing/Stats';
import Features from '../components/landing/Features';
import Pillars from '../components/landing/Pillars';
import RoadmapPreview from '../components/landing/RoadmapPreview';
import HowItWorks from '../components/landing/HowItWorks';
import AIMentorShowcase from '../components/landing/AIMentorShowcase';
import Achievements from '../components/landing/Achievements';
import ProgressShowcase from '../components/landing/ProgressShowcase';
import Testimonials from '../components/landing/Testimonials';
import CTA from '../components/landing/CTA';
import Footer from '../components/landing/Footer';

const Landing = () => {
  return (
    <div className="min-h-screen bg-[#050505] text-slate-50 selection:bg-[#1591DC]/30">
      <Hero />
      <Pillars />
      <Stats />
      <Features />
      <RoadmapPreview />
      <HowItWorks />
      <AIMentorShowcase />
      <Achievements />
      <ProgressShowcase />
      <Testimonials />
      <CTA />
      <Footer />
    </div>
  );
};

export default Landing;
