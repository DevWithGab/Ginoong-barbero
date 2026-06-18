import { motion } from 'framer-motion';
import { MapPin, Phone, Clock, Scissors } from 'lucide-react';

const InstagramIcon = ({ size = 18, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

const FacebookIcon = ({ size = 18, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

export function LocationHours() {
  return (
    <section id="location" className="bg-vintage-bg text-white py-40 px-6 relative overflow-hidden">
      {/* Decorative Top Separator */}
      <div className="absolute top-0 left-12 right-12 h-px bg-gradient-to-r from-transparent via-white/5 to-transparent"></div>

      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-12 gap-16 lg:gap-24 relative z-10 items-stretch">
          
          {/* Details and Hours Column */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-12">
            <div className="space-y-10">
              <div className="space-y-4">
                <div className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-[0.6em] text-vintage-tan font-slab italic">
                  <div className="w-8 h-px bg-vintage-tan/40"></div>
                  <span>Find Us</span>
                </div>
                <h2 className="font-serif font-bold text-4xl md:text-5xl uppercase tracking-tighter leading-none">
                  Location & <span className="text-outline italic font-normal opacity-40">Hours</span>
                </h2>
              </div>

              {/* Location Card */}
              <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-6 sm:p-8 space-y-6 hover:border-white/10 transition-colors duration-500 relative group overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-vintage-tan/[0.01] rounded-bl-full pointer-events-none group-hover:bg-vintage-tan/[0.02] transition-colors duration-500"></div>
                
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-vintage-tan/10 flex items-center justify-center text-vintage-tan shrink-0 border border-vintage-tan/20">
                    <MapPin size={18} />
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-serif font-black text-lg uppercase tracking-wider text-white">Our Sanctuary</h4>
                    <p className="font-slab text-sm leading-relaxed italic text-white/70">
                      2nd Floor, beside Kartel Shop<br/>
                      In front of One Ilocos Sur Hotel, Tamag,<br/>
                      Vigan City — near Fine Clothing
                    </p>
                  </div>
                </div>

                <div className="h-px bg-white/5"></div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-vintage-tan/10 flex items-center justify-center text-vintage-tan shrink-0 border border-vintage-tan/20">
                    <Phone size={18} />
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-serif font-black text-lg uppercase tracking-wider text-white">Direct Line</h4>
                    <p className="font-slab text-sm leading-relaxed italic text-white/70">
                      0915 926 2361
                    </p>
                  </div>
                </div>
              </div>

              {/* Operating Hours (Compact and Sleek) */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-[9px] font-bold uppercase tracking-[0.3em] text-white/40">
                  <Clock size={12} className="text-vintage-tan" />
                  <span>Operating Hours</span>
                </div>
                <div className="space-y-3">
                  {[
                    { day: 'Everyday', time: '9:00 AM - 6:00 PM' }
                  ].map(sched => (
                    <div key={sched.day} className="flex justify-between items-center py-2.5 border-b border-white/5 group/row">
                      <span className="font-slab italic text-md text-white/60 group-hover/row:text-white transition-colors duration-300">{sched.day}</span>
                      <span className="text-vintage-tan text-[11px] font-bold uppercase tracking-widest">{sched.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Social Channels */}
            <div className="space-y-4 pt-4">
              <span className="text-[9px] font-bold uppercase tracking-[0.3em] text-white/40">Follow Ginoong Barbero</span>
              <div className="flex gap-4">
                  {[
                    { Icon: InstagramIcon, label: "Instagram", href: "https://instagram.com" },
                    { Icon: FacebookIcon, label: "Facebook", href: "https://facebook.com" },
                    { Icon: Phone, label: "Call us", href: "tel:+639159262361" }
                  ].map(({ Icon, label, href }, i) => (
                  <motion.a 
                    key={i}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ y: -4, borderColor: "rgba(201, 168, 76, 0.5)" }}
                    aria-label={label}
                    className="w-12 h-12 border border-white/5 flex items-center justify-center transition-all bg-white/[0.02] text-white hover:bg-vintage-tan hover:text-vintage-bg rounded-xl outline-none"
                  >
                    <Icon size={18} aria-hidden="true" />
                  </motion.a>
                ))}
              </div>
            </div>
          </div>

          {/* Embedded Live Map Column */}
          <div className="lg:col-span-7 flex flex-col justify-center h-full">
            <div className="relative w-full h-[380px] sm:h-[450px] lg:h-full min-h-[380px] lg:min-h-[500px] border border-white/10 rounded-2xl overflow-hidden shadow-2xl p-1.5 bg-white/[0.02] group">
              
              {/* Corner Ornaments */}
              <div className="absolute top-4 left-4 w-4 h-4 border-t border-l border-vintage-tan/20 z-10 pointer-events-none"></div>
              <div className="absolute bottom-4 right-4 w-4 h-4 border-b border-r border-vintage-tan/20 z-10 pointer-events-none"></div>

              {/* Map Wrapper with Border Offset Effect */}
              <div className="relative w-full h-full rounded-xl overflow-hidden">
                <iframe 
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3808.2!2d120.3855652!3d17.5608724!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x338e65005bc3670d%3A0x90817cabed39dc2!2sBarastea+Coffee+Shop+-+Tamag!5e0!3m2!1sen!2sph!4v1750000000000!5m2!1sen!2sph"
                  className="w-full h-full border-0 grayscale invert opacity-80 group-hover:opacity-100 transition-opacity duration-700 filter brightness-[0.7] contrast-[1.15] saturate-[0.7]"
                  allowFullScreen={true}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Ginoong Barbero Location Map"
                ></iframe>

                {/* Glassmorphic Get Directions Badge */}
                <div className="absolute bottom-6 left-6 right-6 sm:right-auto bg-black/80 backdrop-blur-md border border-white/10 p-4 rounded-xl flex items-center justify-between gap-6 pointer-events-auto shadow-2xl transition-all duration-300 group-hover:border-vintage-tan/30 z-[11]">
                  <div className="flex flex-col text-left">
                    <span className="text-[8px] font-bold uppercase tracking-[0.2em] text-vintage-tan mb-1">Find Us On Maps</span>
                    <span className="text-[10px] font-bold text-white/80 max-w-[150px] sm:max-w-xs truncate">Vigan City, Ilocos Sur</span>
                  </div>
                  <motion.a 
                    href="https://maps.google.com/?q=17.5608724,120.3855652"
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-vintage-tan text-vintage-charcoal text-[9px] font-black uppercase tracking-wider py-2 px-4 rounded-lg hover:bg-white transition-colors cursor-pointer select-none"
                  >
                    Directions
                  </motion.a>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
      
      {/* Watermark bg */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.02] pointer-events-none scale-150">
        <Scissors size={800} strokeWidth={0.5} />
      </div>
    </section>
  );
}
