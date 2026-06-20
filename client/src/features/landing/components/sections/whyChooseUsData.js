import { Scissors, Award, Shield, Clock, Users, Sparkles } from 'lucide-react';
import communication from '../../../../assets/why-choose-us/communication.jpg';
import quality from '../../../../assets/why-choose-us/premium-quality.jpg';
import punctuality from '../../../../assets/why-choose-us/panctual-service.jpg';
import sanitation from '../../../../assets/why-choose-us/sanitized.jpg';
import clientFirst from '../../../../assets/why-choose-us/client-first.jpg';
import signatureExperience from '../../../../assets/why-choose-us/signature.jpg';

export const reasons = [
  {
    title: "Communication",
    description: "Clear consultation from start to finish — we explain every step so you always know exactly what you're getting.",
    icon: Scissors,
    image: communication
  },
  {
    title: "Premium Quality",
    description: "We use only top-tier grooming products and tools to ensure every cut meets the highest standard of excellence.",
    icon: Award,
    image: quality
  },
  {
    title: "Punctual Service",
    description: "We value your time. Our efficient booking system and dedicated staff ensure minimal wait and maximum results.",
    icon: Clock,
    image: punctuality
  },
  {
    title: "Sanitized Space",
    description: "Every tool is sterilized and every station is cleaned between appointments for your safety and comfort.",
    icon: Shield,
    image: sanitation
  },
  {
    title: "Client-First Approach",
    description: "We listen to your vision and collaborate with you to craft a look that reflects your personality and lifestyle.",
    icon: Users,
    image: clientFirst
  },
  {
    title: "Signature Experience",
    description: "From the hot towel finish to the finishing touches, every visit is a premium grooming experience from start to finish.",
    icon: Sparkles,
    image: signatureExperience
  }
];
