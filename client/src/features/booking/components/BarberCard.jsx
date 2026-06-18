import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Star } from "lucide-react";

export function BarberCard({ barber, onClick, index = 0 }) {
  const navigate = useNavigate();

  return (
    <motion.div
      key={barber._id}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{
        duration: 0.8,
        delay: index * 0.1,
        ease: [0.16, 1, 0.3, 1]
      }}
      className="group cursor-pointer w-full max-w-sm sm:max-w-none mx-auto"
      onClick={() => onClick?.(barber)}
    >
      <div className="relative mb-6 sm:mb-10">
        <div className="aspect-[4/5] overflow-hidden bg-stone-900 border border-white/5 shadow-2xl relative">
          <img
            src={barber.photo}
            alt={barber.name}
            className="w-full h-full object-cover transition-all duration-[2s] grayscale-0 brightness-75 md:grayscale md:brightness-50 md:group-hover:grayscale-0 md:group-hover:brightness-90 md:group-hover:scale-105"
            referrerPolicy="no-referrer"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-vintage-bg via-transparent to-transparent opacity-80 group-hover:opacity-40 transition-opacity duration-1000" />

          <div className="absolute top-4 left-4 sm:top-6 sm:left-6 px-3 py-1.5 sm:px-4 sm:py-2 border border-vintage-tan/30 bg-vintage-charcoal/85 backdrop-blur-md">
            <span className="text-[8px] font-black uppercase tracking-[0.3em] text-vintage-tan">
              {barber.role}
            </span>
          </div>
        </div>

        <div className="hidden sm:block absolute -inset-4 border border-white/5 -z-10 translate-x-4 translate-y-4 group-hover:translate-x-0 group-hover:translate-y-0 transition-all duration-1000 opacity-60" />

        <div className="absolute bottom-6 right-6 sm:bottom-8 sm:right-8 w-8 h-8 sm:w-10 sm:h-10 border-r border-b border-white/10 group-hover:border-vintage-tan/30 transition-all duration-1000" />
      </div>

      <div className="space-y-4 sm:space-y-6">
        <div className="flex items-center justify-between gap-4">
          <h3 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold uppercase text-white tracking-tight leading-none group-hover:text-vintage-tan transition-colors">
            {barber.name.split(" ")[1] ? (
              <>
                {barber.name.split(" ")[0]}{" "}
                <span className="italic text-outline-white">
                  {barber.name.split(" ")[1]}
                </span>
              </>
            ) : (
              barber.name
            )}
          </h3>
          <div className="flex gap-0.5 shrink-0">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={10}
                className="fill-vintage-tan text-vintage-tan opacity-40"
              />
            ))}
          </div>
        </div>

        <p className="text-white/40 font-slab italic text-sm sm:text-base md:text-lg leading-relaxed border-l-2 border-vintage-tan/10 pl-4 sm:pl-6 h-auto min-h-[4rem] sm:min-h-[5rem] overflow-hidden">
          {barber.bio}
        </p>

        <div className="grid grid-cols-2 gap-4 py-4 sm:py-6 border-y border-white/5">
          <div className="flex flex-col">
            <span className="text-[8px] font-bold uppercase tracking-[0.2em] text-white/20 mb-1">
              Experience
            </span>
            <span className="text-lg sm:text-xl font-serif font-black text-white">
              {barber.appointmentsCompleted}+
            </span>
          </div>
          <div className="flex flex-col text-right">
            <span className="text-[8px] font-bold uppercase tracking-[0.2em] text-white/20 mb-1">
              Languages
            </span>
            <span className="text-[8px] sm:text-[10px] font-serif font-bold text-vintage-tan uppercase tracking-wider">
              {barber.languages?.join(" / ")}
            </span>
          </div>
        </div>

        <div className="pt-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              navigate("/book");
            }}
            className="w-full relative py-4 sm:py-5 bg-white/5 border border-white/10 text-white text-[9px] font-black uppercase tracking-[0.4em] overflow-hidden group/btn transition-all rounded-full"
          >
            <span className="relative z-10 transition-colors duration-500 group-hover/btn:text-vintage-charcoal">
              Book Now
            </span>
            <div className="absolute inset-0 bg-vintage-tan translate-y-full group-hover/btn:translate-y-0 transition-transform duration-700 ease-expo rounded-full" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
