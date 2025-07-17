import React from 'react';
import Header from '../../components/ui/Header';
import HeroSection from './components/HeroSection';
import TemplateGallery from './components/TemplateGallery';
import LiveDemo from './components/LiveDemo';
import TestimonialsSection from './components/TestimonialsSection';
import FAQSection from './components/FAQSection';
import Footer from './components/Footer';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main>
        <HeroSection />
        <TemplateGallery />
        <LiveDemo />
        <TestimonialsSection />
        <FAQSection />
      </main>
      
      <Footer />
    </div>
  );
};

export default LandingPage;