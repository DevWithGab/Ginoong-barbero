import { ResponsiveContainer, AreaChart, Area } from "recharts";

export const SimpleStatCard = ({
  icon: Icon,
  label,
  value,
  trend,
  chartData,
  trendUp = true
}) => (
  <div className="bg-[#ffffff] border border-[#efefef] rounded-lg p-8 relative overflow-hidden group shadow-sm" id={`stat-card-${label.toLowerCase().replace(/\s+/g, '-')}`}>
     <div className="flex flex-col h-full justify-between relative z-10">
        <div className="w-12 h-12 bg-[#fbfcfa] rounded-xl flex items-center justify-center border border-[#efefef] mb-8 shadow-sm">
           <Icon size={20} className="text-[#a1a1aa] group-hover:text-vintage-tan transition-colors" />
        </div>
        <div className="space-y-2">
           <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#cccccc]">{label}</p>
           <h3 className="text-4xl font-serif font-black text-[#18181b] leading-none">{value}</h3>
           <p className={`text-[11px] font-bold ${trendUp ? 'text-emerald-600' : 'text-rose-600'}`}>
             {trend} <span className="text-[#cccccc] font-bold ml-1">vs yesterday</span>
           </p>
        </div>
     </div>
     <div className="absolute bottom-0 left-0 right-0 h-14 opacity-10 pointer-events-none">
        <ResponsiveContainer width="100%" height="100%">
           <AreaChart data={chartData}>
              <Area 
                type="monotone" 
                dataKey="v" 
                stroke={trendUp ? "#10b981" : "#ef4444"} 
                strokeWidth={1.5} 
                fill={trendUp ? "#10b981" : "#ef4444"} 
                fillOpacity={0.1} 
                animationDuration={2000}
              />
           </AreaChart>
        </ResponsiveContainer>
     </div>
  </div>
);
