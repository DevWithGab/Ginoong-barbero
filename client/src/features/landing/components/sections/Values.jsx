import { motion } from 'framer-motion';
import values1 from '../../../../assets/values-img/values-1.jpg';
import values2 from '../../../../assets/values-img/values-2.jpg';
import values3 from '../../../../assets/values-img/values-3.jpg';

export function ValuesSection() {
  const values = [
    {
      title: 'Precision',
      img: values1
    },
    {
      title: 'Quality',
      img: values2
    },
    {
      title: 'Relaxation',
      img: values3
    }
  ];

  return (
    <section id="values" className="pt-8 pb-32 md:pt-12 md:pb-56 px-6 relative bg-vintage-bg overflow-hidden border-t border-vintage-tan/10">
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')] opacity-[0.08] pointer-events-none"></div>
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-vintage-tan/5 blur-[120px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-vintage-tan/5 blur-[120px] rounded-full pointer-events-none"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
          <div className="max-w-xl">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-[0.6em] text-vintage-tan font-slab italic mb-8"
            >
              <div className="w-8 h-px bg-vintage-tan/40"></div>
              <span>Core Values</span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-5xl md:text-6xl font-serif font-bold uppercase tracking-tighter mb-6 text-white"
            >
              Our <span className="italic text-vintage-tan">Values</span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-sm font-slab italic text-white/80"
            >
              The simple rules that make Ginoong Barbero the best choice for men who demand excellence.
            </motion.p>
          </div>
        </div>

        {/* Values Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {values.map((value, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -10 }}
              className="group relative h-[450px] overflow-hidden"
            >
              <img
                src={value.img}
                alt={value.title}
                className="w-full h-full object-cover brightness-75 group-hover:scale-110 group-hover:brightness-100 transition-all duration-1000"
              />

              {/* Overlay Gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-vintage-charcoal via-transparent to-transparent"></div>

              {/* Content */}
              <div className="absolute bottom-10 left-10 text-white">
                <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-vintage-tan block mb-2">
                  Value {i + 1}
                </span>
                <h3 className="text-4xl font-serif font-black uppercase tracking-tighter">{value.title}</h3>
              </div>

              {/* Border Accent on Hover */}
              <div className="absolute inset-6 border border-white/0 group-hover:border-white/10 transition-all duration-700 pointer-events-none"></div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Subtle Bottom Accent */}
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-vintage-charcoal/[0.03] to-transparent pointer-events-none"></div>
    </section>
  );
}
