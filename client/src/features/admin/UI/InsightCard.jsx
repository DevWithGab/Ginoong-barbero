import { TrendingUp } from "lucide-react";
import { ResponsiveContainer, AreaChart, Area } from "recharts";

export const InsightCard = ({
  icon: Icon,
  label,
  value,
  trend,
  chartData
}) => (
  <div className="bg-[#ffffff] border border-[#efefef] rounded-lg p-6 relative overflow-hidden group hover:border-vintage-tan/20 transition-colors shadow-sm" id={`insight-card-${label.toLowerCase().replace(/\s+/g, '-')}`}>
     <div className="flex items-center gap-6 relative z-10">
        <div className="w-10 h-10 bg-[#fbfcfa] rounded-lg flex items-center justify-center border border-[#efefef]">
           <Icon size={18} className="text-[#cccccc] group-hover:text-vintage-tan transition-colors" />
        </div>
        <div className="flex-1 space-y-1">
           <p className="text-[8px] font-bold uppercase tracking-[0.2em] text-[#cccccc]">{label}</p>
           <h3 className="text-2xl font-serif font-black text-[#18181b]">{value}</h3>
           <p className="text-[9px] font-bold text-vintage-tan opacity-60 flex items-center gap-2">
             <TrendingUp size={10} className={trend.includes('-') ? 'rotate-180' : ''} />
             {trend}
           </p>
        </div>
        <div className="w-20 h-10 opacity-30">
           <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                 <Area 
                   type="monotone" 
                   dataKey="v" 
                   stroke="#C9A84C" 
                   strokeWidth={1.5} 
                   fill="#C9A84C" 
                   fillOpacity={0.05} 
                   animationDuration={2000}
                 />
              </AreaChart>
           </ResponsiveContainer>
        </div>
     </div>
  </div>
);
