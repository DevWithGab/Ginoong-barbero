import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export function NavLinks({ layout = 'desktop' }) {
  const leftLinks = [
    { name: 'Our Story', href: '/our-story' },
    { name: 'Services', href: '/services' },
    { name: 'Barbers', href: '/barbers' },
  ];

  const rightLinks = [
    { name: 'Gallery', href: '/gallery' },
  ];

  if (layout === 'mobile') {
    return (
      <div className="space-y-6">
        <span className="text-[9px] font-bold text-white/20 uppercase tracking-[0.4em] block mb-4 border-b border-white/5 pb-2">
          Main Menu
        </span>
        {[...leftLinks, ...rightLinks].map((link, idx) => (
          <motion.div
            key={link.name}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 * idx }}
          >
            <Link 
              to={link.href}
              className="text-3xl font-serif font-black text-white hover:text-vintage-tan transition-all duration-500 uppercase tracking-tighter block group"
            >
              <span className="inline-block group-hover:translate-x-2 transition-transform duration-500">
                {link.name}
              </span>
            </Link>
          </motion.div>
        ))}
      </div>
    );
  }

  return (
    <div className="hidden lg:flex gap-12 items-center">
      {leftLinks.map((link, idx) => (
        <motion.div
          key={link.name}
          initial={{ opacity: 0, x: -15 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 * idx, duration: 0.8 }}
        >
          <Link 
            to={link.href}
            className="text-[9px] font-bold uppercase tracking-[0.5em] text-white/50 hover:text-white transition-all relative group/link py-2"
          >
            <span className="relative z-10">{link.name}</span>
            <span className="absolute bottom-0 left-0 w-0 h-px bg-vintage-tan transition-all duration-500 ease-expo group-hover/link:w-full"></span>
          </Link>
        </motion.div>
      ))}
    </div>
  );
}
