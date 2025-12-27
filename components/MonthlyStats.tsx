
import React from 'react';
import { LogEntry, FlowColor, FlowVolume } from '../types';
import { COLOR_MAP } from '../constants';

interface MonthlyStatsProps {
  entries: LogEntry[];
}

const MonthlyStats: React.FC<MonthlyStatsProps> = ({ entries }) => {
  // Group entries by Year-Month
  const groupedByMonth = entries.reduce((acc, entry) => {
    const monthKey = entry.date.substring(0, 7); // YYYY-MM
    if (!acc[monthKey]) acc[monthKey] = [];
    acc[monthKey].push(entry);
    return acc;
  }, {} as Record<string, LogEntry[]>);

  const monthKeys = Object.keys(groupedByMonth).sort((a, b) => b.localeCompare(a));

  if (monthKeys.length === 0) {
    return (
      <div className="bg-white/40 backdrop-blur-md rounded-[2.5rem] p-10 border border-white soft-shadow text-center">
        <div className="text-4xl mb-4">🌻</div>
        <p className="text-sm text-gray-500 font-serif italic">暂无月度数据，开始记录你的第一天吧。</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between px-2">
        <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em]">月度花期统计</h3>
        <span className="text-[10px] text-pink-400 font-bold">往期回顾</span>
      </div>
      
      <div className="flex gap-4 overflow-x-auto pb-4 px-2 snap-x no-scrollbar">
        {monthKeys.map((monthKey) => {
          const monthEntries = groupedByMonth[monthKey];
          const [year, month] = monthKey.split('-');
          
          // Calculate stats
          const daysCount = monthEntries.length;
          
          // Find dominant color
          const colorCounts = monthEntries.reduce((acc, e) => {
            acc[e.color] = (acc[e.color] || 0) + 1;
            return acc;
          }, {} as Record<string, number>);
          const dominantColor = (Object.keys(colorCounts) as FlowColor[]).reduce((a, b) => colorCounts[a] > colorCounts[b] ? a : b);

          // Get all symptoms
          const allSymptoms = Array.from(new Set(monthEntries.flatMap(e => e.symptoms || [])));

          return (
            <div key={monthKey} className="min-w-[280px] snap-center bg-white/70 backdrop-blur-lg rounded-[2.5rem] p-6 border border-white soft-shadow flex flex-col justify-between h-56">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="text-2xl font-serif font-bold text-gray-700">{month}<span className="text-sm text-gray-400 ml-1">月</span></h4>
                  <p className="text-[10px] text-gray-400 uppercase tracking-widest">{year} YEAR</p>
                </div>
                <div className={`w-8 h-8 rounded-full ${COLOR_MAP[dominantColor]} border-2 border-white shadow-sm`}></div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <div className="text-[10px] text-gray-400 font-bold uppercase mb-1">记录天数</div>
                    <div className="text-lg font-bold text-pink-500">{daysCount} <span className="text-xs text-gray-400 font-normal">天</span></div>
                  </div>
                  <div className="flex-1">
                    <div className="text-[10px] text-gray-400 font-bold uppercase mb-1">主要状态</div>
                    <div className="text-xs font-bold text-gray-600 truncate">{dominantColor}</div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1">
                  {allSymptoms.slice(0, 3).map(s => (
                    <span key={s} className="text-[9px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">#{s}</span>
                  ))}
                  {allSymptoms.length > 3 && <span className="text-[9px] text-gray-300">...</span>}
                  {allSymptoms.length === 0 && <span className="text-[9px] text-gray-300 italic">无明显症状</span>}
                </div>
              </div>

              <div className="h-1 w-full bg-gray-100 rounded-full overflow-hidden mt-4">
                <div 
                  className="h-full bg-gradient-to-r from-pink-300 to-sky-300 transition-all duration-1000" 
                  style={{ width: `${Math.min((daysCount / 7) * 100, 100)}%` }}
                ></div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MonthlyStats;
