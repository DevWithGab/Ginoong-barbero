import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Phone, MapPin, Clock, Calendar, ArrowRight, Scissors } from 'lucide-react';

const contactDetails = [
  {
    icon: Phone,
    label: 'Call Us Directly',
    value: '0915 926 2361',
    href: 'tel:+639159262361',
    sublabel: 'Tap to call now'
  },
  {
    icon: MapPin,
    label: 'Visit Our Shop',
    value: 'Tamag, Vigan City',
    href: 'https://maps.google.com/?q=17.5608724,120.3855652',
    sublabel: '2nd Floor, beside Kartel Shop'
  },
  {
    icon: Clock,
    label: 'Operating Hours',
    value: '9:00 AM — 6:00 PM',
    href: null,
    sublabel: 'Open everyday'
  }
];

export function MakeAppointment({ onBookNow }) {
  const navigate = useNavigate();

  return (
    <section id="appointment" className="relative overflow-hidden">
      {/* Top Divider */}
      <div className="h-px bg-gradient-to-r from-transparent via-vintage-tan/20 to-transparent"></div>

      <div className="grid lg:grid-cols-2 min-h-[600px]">
        {/* Left — Visual Panel */}
        <div className="relative bg-vintage-charcoal flex items-center justify-center p-8 md:p-16 overflow-hidden group">
          {/* Background Pattern */}
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/pinstriped-suit.png')] opacity-[0.03] pointer-events-none"></div>
          
          {/* Decorative Orbs */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-vintage-tan/[0.04] blur-[120px] rounded-full pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-vintage-tan/[0.04] blur-[120px] rounded-full pointer-events-none"></div>

          {/* Large Decorative Scissors */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.02] pointer-events-none">
            <Scissors size={600} strokeWidth={0.3} />
          </div>

          {/* Corner Ornaments */}
          <div className="absolute top-8 left-8 w-16 h-16 border-t-2 border-l-2 border-vintage-tan/20 pointer-events-none"></div>
          <div className="absolute bottom-8 right-8 w-16 h-16 border-b-2 border-r-2 border-vintage-tan/20 pointer-events-none"></div>

          {/* Content */}
          <div className="relative z-10 text-center max-w-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="mb-8"
            >
              <div className="w-20 h-20 mx-auto rounded-full bg-vintage-tan/10 border border-vintage-tan/30 flex items-center justify-center mb-8 group-hover:bg-vintage-tan/20 transition-all duration-700">
                <Calendar size={32} className="text-vintage-tan" strokeWidth={1.5} />
              </div>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-5xl md:text-6xl lg:text-7xl font-serif font-black uppercase tracking-tighter mb-6 text-white leading-[0.9]"
            >
              Reserve <br />
              <span className="italic text-vintage-tan font-normal">Your</span> Chair
            </motion.h2>

            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-sm font-slab italic text-white/60 leading-relaxed mb-10 max-w-sm mx-auto"
            >
              Your perfect look is just one appointment away. Walk in or book ahead — we'll make sure you leave looking your absolute best.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="flex items-center justify-center gap-2 text-[9px] font-bold uppercase tracking-[0.3em] text-white/20"
            >
              <div className="w-8 h-px bg-white/10"></div>
              <span>Vigan City's Finest</span>
              <div className="w-8 h-px bg-white/10"></div>
            </motion.div>
          </div>

          {/* Floating Badge */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
            className="absolute bottom-8 left-8 right-8 md:bottom-12 md:left-12 md:right-auto bg-black/60 backdrop-blur-xl border border-white/10 p-4 rounded-xl flex items-center gap-4 z-10"
          >
            <div className="relative">
              <div className="w-3 h-3 bg-vintage-tan rounded-full"></div>
              <div className="absolute inset-0 w-3 h-3 bg-vintage-tan rounded-full animate-ping opacity-50"></div>
            </div>
            <div className="flex flex-col">
              <span className="text-[8px] font-bold uppercase tracking-[0.2em] text-white/40">Status</span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-white">Accepting Bookings</span>
            </div>
          </motion.div>
        </div>

        {/* Right — Details & CTA Panel */}
        <div className="relative bg-vintage-bg flex flex-col justify-center p-8 md:p-16 lg:p-20">
          {/* Subtle Background */}
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')] opacity-[0.03] pointer-events-none"></div>

          <div className="relative z-10 space-y-12">
            {/* Section Label */}
            <div>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-[0.6em] text-vintage-tan font-slab italic mb-6"
              >
                <div className="w-8 h-px bg-vintage-tan/40"></div>
                <span>Get in Touch</span>
              </motion.div>

              <motion.h3
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="text-3xl md:text-4xl font-serif font-black uppercase tracking-tighter text-white mb-4"
              >
                Make an <span className="italic text-vintage-tan font-normal">Appointment</span>
              </motion.h3>

              <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.15 }}
                className="text-sm font-slab italic text-white/50 max-w-md"
              >
                Whether you prefer to book online or speak with us directly, we're here to accommodate your schedule.
              </motion.p>
            </div>

            {/* Contact Cards */}
            <div className="space-y-4">
              {contactDetails.map((contact, i) => {
                const Icon = contact.icon;
                const Wrapper = contact.href ? 'a' : 'div';
                const wrapperProps = contact.href
                  ? { href: contact.href, target: contact.href.startsWith('http') ? '_blank' : undefined, rel: contact.href.startsWith('http') ? 'noopener noreferrer' : undefined }
                  : {};

                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 + i * 0.08 }}
                  >
                    <Wrapper
                      {...wrapperProps}
                      className="group flex items-start gap-5 p-5 bg-white/[0.02] border border-white/5 rounded-xl hover:border-vintage-tan/30 hover:bg-vintage-tan/[0.02] transition-all duration-500 cursor-pointer block"
                    >
                      <div className="w-12 h-12 rounded-xl bg-vintage-tan/10 border border-vintage-tan/20 flex items-center justify-center text-vintage-tan shrink-0 group-hover:bg-vintage-tan/20 group-hover:border-vintage-tan/40 transition-all duration-500">
                        <Icon size={20} strokeWidth={1.5} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="text-[9px] font-bold uppercase tracking-[0.3em] text-white/40 block mb-1">{contact.label}</span>
                        <span className="font-serif font-black text-lg text-white group-hover:text-vintage-tan transition-colors duration-500 block">{contact.value}</span>
                        <span className="text-[10px] font-slab italic text-white/30">{contact.sublabel}</span>
                      </div>
                      {contact.href && (
                        <ArrowRight size={16} className="text-white/20 group-hover:text-vintage-tan group-hover:translate-x-1 transition-all duration-500 shrink-0 mt-3" />
                      )}
                    </Wrapper>
                  </motion.div>
                );
              })}
            </div>

            {/* CTA Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
            >
              <button
                onClick={() => onBookNow ? onBookNow() : navigate('/book')}
                className="group relative w-full bg-vintage-tan text-vintage-charcoal px-10 py-6 text-[10px] font-bold uppercase tracking-[0.4em] hover:bg-white transition-all duration-500 flex items-center justify-center gap-4"
              >
                Book Your Appointment
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform duration-500" />
                <div className="absolute -inset-1 border border-vintage-tan/20 z-0 translate-x-1 translate-y-1 group-hover:translate-x-0 group-hover:translate-y-0 transition-transform duration-500 pointer-events-none"></div>
              </button>
            </motion.div>

            {/* Bottom Note */}
            <div className="flex items-center gap-3 pt-4">
              <div className="w-2 h-2 rounded-full bg-vintage-tan/40"></div>
              <span className="text-[9px] font-slab italic text-white/30">
                Walk-ins welcome, but booking guarantees your preferred time slot.
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Divider */}
      <div className="h-px bg-gradient-to-r from-transparent via-vintage-tan/20 to-transparent"></div>
    </section>
  );
}
