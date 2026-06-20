import { TrendingUp, TrendingDown } from "lucide-react";
import { ResponsiveContainer, AreaChart, Area } from "recharts";

export const StatCard = ({ title, value, trend, trendUp = true, chartData = [] }) => {
  return (
    <div className="bg-[#ffffff] border border-[#efefef] rounded-xl p-6 sm:p-8 space-y-6 shadow-sm">
      <div className="space-y-3">
        <p className="text-[10px] font-black uppercase tracking-widest text-[#cccccc]">{title}</p>
        <p className="text-3xl sm:text-4xl font-serif font-black text-[#18181b] tracking-tight">{value}</p>
        <div className="flex items-center gap-1.5">
          {trendUp ? (
            <TrendingUp size={12} className="text-emerald-500" />
          ) : (
            <TrendingDown size={12} className="text-red-400" />
          )}
          <span className={`text-[10px] font-bold uppercase tracking-wider ${trendUp ? 'text-emerald-500' : 'text-red-400'}`}>
            {trend}
          </span>
        </div>
      </div>
      {chartData.length > 0 && (
        <div className="h-12">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <Area
                type="monotone"
                dataKey="v"
                stroke={trendUp ? "#10b981" : "#ef4444"}
                fill={trendUp ? "#10b98110" : "#ef444410"}
                strokeWidth={1.5}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};
