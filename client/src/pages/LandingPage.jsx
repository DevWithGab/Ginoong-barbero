import { useNavigate } from 'react-router-dom';

// Import all landing page sections
import { LandingNavbar } from '../features/landing/components/navbar/LandingNavbar';
import { HeroSection } from '../features/landing/components/sections/HeroSection';
import { OurStory } from '../features/landing/components/sections/OurStory';
import { ValuesSection } from '../features/landing/components/sections/Values';
import { Testimonials } from '../features/landing/components/sections/Testimonials';
import { VisualLegacy } from '../features/landing/components/sections/VisualLegacy';
import { LocationHours } from '../features/landing/components/sections/LocationHours';
import { Footer } from '../components/Layout/Footer';



export default function LandingPage() {
  const navigate = useNavigate();

  const handleBookNow = (serviceName) => {
    // Navigate to booking wizard with optional service parameter
    navigate('/book', { state: { service: serviceName } });
  };

  return (
    <>
      <LandingNavbar onBookNow={handleBookNow} />
      <HeroSection onBookNow={handleBookNow} />
      <OurStory />
      <ValuesSection />

      {/* Visual Legacy Gallery */}
      <VisualLegacy />
      <LocationHours />

      <Footer onBookNow={() => navigate('/book')} />
    </>
  );
}
