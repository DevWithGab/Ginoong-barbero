import { motion } from "framer-motion";
import { TrendingUp, TrendingDown } from "lucide-react";
import { ResponsiveContainer, AreaChart, Area } from "recharts";

export const StatCard = ({
  title,
  value,
  trend,
  chartData,
  trendUp = true
}) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      className="bg-[#ffffff] border border-[#efefef] p-8 rounded-xl space-y-4 relative overflow-hidden group hover:border-vintage-tan/20 transition-all duration-500 shadow-sm"
      id={`stat-card-${title.toLowerCase().replace(/\s+/g, '-')}`}
    >
      <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#cccccc]">{title}</p>
      <div className="space-y-1 relative z-10">
        <h3 className="text-4xl font-serif font-black text-[#18181b] tracking-tight">{value}</h3>
        <div className={`flex items-center gap-1.5 text-[11px] font-bold ${trendUp ? 'text-vintage-tan' : 'text-[#a1a1aa]'}`}>
           {trendUp ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
           <span>{trend} vs yesterday</span>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-10 opacity-10">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData}>
            <Area 
              type="monotone" 
              dataKey="v" 
              stroke="#C9A84C" 
              strokeWidth={1.5} 
              fill="#C9A84C"
              fillOpacity={0.1}
              animationDuration={2000}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};
