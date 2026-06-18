import { useState, useEffect } from 'react';
import { barberAPI } from '../services/barberService';
import { serviceAPI } from '../services/serviceMenu';

// Mock testimonials as fallback
const MOCK_TESTIMONIALS = [
  {
    id: 1,
    quote: 'Ginoong Barbero transformed my grooming routine. The precision and attention to detail is unmatched.',
    author: 'Carlos M.',
    role: 'Business Executive'
  },
  {
    id: 2,
    quote: 'Every visit feels like a celebration of craftsmanship. They understand the art of barbering on another level.',
    author: 'Juan D.',
    role: 'Entrepreneur'
  },
  {
    id: 3,
    quote: 'Best haircut experience in Manila. The team is professional, skilled, and genuinely passionate about their work.',
    author: 'Miguel R.',
    role: 'Creative Director'
  }
];

// Mock gallery images as fallback
const MOCK_GALLERY = [
  {
    id: 1,
    url: 'https://images.unsplash.com/photo-1599351431202-1e0f0137899a?auto=format&fit=crop&q=80&w=600',
    title: 'Classic Fade',
    category: 'Haircuts'
  },
  {
    id: 2,
    url: 'https://images.unsplash.com/photo-1512690118334-a16999335607?auto=format&fit=crop&q=80&w=600',
    title: 'Textured Crop',
    category: 'Styles'
  },
  {
    id: 3,
    url: 'https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?auto=format&fit=crop&q=80&w=600',
    title: 'Modern Cut',
    category: 'Barbering'
  },
  {
    id: 4,
    url: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?q=80&w=1200&auto=format&fit=crop',
    title: 'Precision Work',
    category: 'Details'
  },
  {
    id: 5,
    url: 'https://images.unsplash.com/photo-1599351431202-1e0f0137899a?auto=format&fit=crop&q=80&w=600',
    title: 'Sharp Lines',
    category: 'Cuts'
  },
  {
    id: 6,
    url: 'https://images.unsplash.com/photo-1512690118334-a16999335607?auto=format&fit=crop&q=80&w=600',
    title: 'Signature Style',
    category: 'Portfolio'
  }
];

/**
 * Hook to fetch testimonials
 * Fetches from API or uses mock data as fallback
 */
export const useFetchTestimonials = () => {
  const [testimonials, setTestimonials] = useState(MOCK_TESTIMONIALS);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        setLoading(true);
        // For now, using mock data since testimonials endpoint doesn't exist yet
        // When available, uncomment the API call:
        // const response = await api.get('/testimonials');
        // setTestimonials(response.data?.data || MOCK_TESTIMONIALS);
        setTestimonials(MOCK_TESTIMONIALS);
      } catch (err) {
        console.error('Error fetching testimonials:', err);
        setError(err);
        setTestimonials(MOCK_TESTIMONIALS);
      } finally {
        setLoading(false);
      }
    };

    fetchTestimonials();
  }, []);

  return { testimonials, loading, error };
};

/**
 * Hook to fetch gallery/portfolio images
 * Fetches from API or uses mock data as fallback
 */
export const useFetchGallery = () => {
  const [gallery, setGallery] = useState(MOCK_GALLERY);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        setLoading(true);
        // For now, using mock data since gallery endpoint doesn't exist yet
        // When available, uncomment the API call:
        // const response = await api.get('/gallery');
        // setGallery(response.data?.data || MOCK_GALLERY);
        setGallery(MOCK_GALLERY);
      } catch (err) {
        console.error('Error fetching gallery:', err);
        setError(err);
        setGallery(MOCK_GALLERY);
      } finally {
        setLoading(false);
      }
    };

    fetchGallery();
  }, []);

  return { gallery, loading, error };
};

/**
 * Hook to fetch barbers for landing page display
 * Fetches active barbers from API
 */
export const useFetchBarbers = () => {
  const [barbers, setBarbers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBarbers = async () => {
      try {
        setLoading(true);
        const data = await barberAPI.getActiveBarbers({ limit: 6 });
        setBarbers(data?.data || []);
      } catch (err) {
        console.error('Error fetching barbers:', err);
        setError(err);
        setBarbers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBarbers();
  }, []);

  return { barbers, loading, error };
};

/**
 * Hook to fetch services for landing page display
 * Fetches services from API
 */
export const useFetchServices = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);
        const data = await serviceAPI.getServices({ limit: 10 });
        setServices(data?.data || []);
      } catch (err) {
        console.error('Error fetching services:', err);
        setError(err);
        setServices([]);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  return { services, loading, error };
};
