import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

export function NavLinks({ layout = 'desktop' }) {
  const location = useLocation();

  const leftLinks = [
    { name: 'Our Story', href: '/our-story' },
    { name: 'Services', href: '/services' },
    { name: 'Barbers', href: '/barbers' },
  ];

  const rightLinks = [
    { name: 'Gallery', href: '/gallery' },
  ];

  const allLinks = [...leftLinks, ...rightLinks];

  const isActive = (href) => {
    if (href === '/') return location.pathname === '/';
    return location.pathname.startsWith(href);
  };

  if (layout === 'mobile') {
    return (
      <div className="space-y-2">
        <span className="text-[8px] font-bold text-white/15 uppercase tracking-[0.5em] block mb-6">
          Menu
        </span>
        {allLinks.map((link, idx) => (
          <motion.div
            key={link.name}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.05 * idx, ease: [0.19, 1, 0.22, 1] }}
          >
            <Link 
              to={link.href}
              className="relative flex items-center gap-4 py-3 group"
            >
              {/* Active Indicator */}
              <div className={`w-1 h-1 rounded-full transition-all duration-500 ${
                isActive(link.href) 
                  ? 'bg-vintage-tan scale-100' 
                  : 'bg-white/20 scale-75 group-hover:scale-100 group-hover:bg-vintage-tan/60'
              }`}></div>
              
              <span className={`text-4xl font-serif font-black uppercase tracking-tighter transition-all duration-500 ${
                isActive(link.href)
                  ? 'text-vintage-tan'
                  : 'text-white/80 group-hover:text-white group-hover:translate-x-1'
              }`}>
                {link.name}
              </span>

              {/* Active Line */}
              {isActive(link.href) && (
                <motion.div
                  layoutId="mobile-active"
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-6 h-px bg-vintage-tan"
                />
              )}
            </Link>
          </motion.div>
        ))}
      </div>
    );
  }

  return (
    <div className="hidden lg:flex gap-1 items-center">
      {leftLinks.map((link, idx) => {
        const active = isActive(link.href);
        return (
          <motion.div
            key={link.name}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + idx * 0.05, duration: 0.6, ease: [0.19, 1, 0.22, 1] }}
          >
            <Link 
              to={link.href}
              className={`relative flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-500 group/link ${
                active
                  ? 'bg-white/[0.04]'
                  : 'hover:bg-white/[0.03]'
              }`}
            >
              {/* Active Dot */}
              {active && (
                <motion.div
                  layoutId="nav-active-dot"
                  className="w-1 h-1 rounded-full bg-vintage-tan"
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
              )}
              
              <span className={`text-[9px] font-bold uppercase tracking-[0.4em] transition-all duration-500 ${
                active
                  ? 'text-vintage-tan'
                  : 'text-white/60 hover:text-white'
              }`}>
                {link.name}
              </span>

              {/* Hover Underline */}
              {!active && (
                <span className="absolute bottom-1 left-4 right-4 h-px bg-vintage-tan/0 group-hover/link:bg-vintage-tan/40 transition-all duration-500 rounded-full"></span>
              )}
            </Link>
          </motion.div>
        );
      })}
    </div>
  );
}
