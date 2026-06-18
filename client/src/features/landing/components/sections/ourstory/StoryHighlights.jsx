import { motion } from 'framer-motion';

const STORY_HIGHLIGHTS = [
  {
    id: '01',
    title: 'Expert Skill',
    description: 'We only work with master barbers who have spent years perfecting their craft.'
  },
  {
    id: '02',
    title: 'Shop Rules',
    description: 'A quiet, relaxing space designed for good conversation and style.'
  }
];

export function StoryHighlights() {
  return (
    <div className="grid md:grid-cols-2 gap-8">
      {STORY_HIGHLIGHTS.map((highlight) => (
        <motion.div
          key={highlight.id}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="space-y-3 group text-white"
        >
          <div className="w-6 h-6 rounded-full border border-vintage-tan/30 flex items-center justify-center text-[9px] font-bold text-vintage-tan group-hover:bg-vintage-tan group-hover:text-vintage-bg transition-all">
            {highlight.id}
          </div>
          <h4 className="font-serif font-black text-lg uppercase tracking-tight text-white">
            {highlight.title}
          </h4>
          <p className="text-[11px] font-slab italic text-white/70 leading-relaxed">
            {highlight.description}
          </p>
        </motion.div>
      ))}
    </div>
  );
}
