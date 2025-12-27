
import React, { useState } from 'react';
import { LogEntry, FlowColor, FlowVolume } from '../types';
import { COLOR_MAP } from '../constants';

interface MonthlyStatsProps {
  entries: LogEntry[];
}

const MonthlyStats: React.FC<MonthlyStatsProps> = ({ entries }) => {
  const [expandedMonths, setExpandedMonths] = useState<string[]>([]);

  // Group entries by Year-Month
  const groupedByMonth = entries.reduce((acc, entry) => {
    const monthKey = entry.date.substring(0, 7); // YYYY-MM
    if (!acc[monthKey]) acc[monthKey] = [];
    acc[monthKey].push(entry);
    return acc;
  }, {} as Record<string, LogEntry[]>);

  // Sorting by year and month (Reverse chronological to keep recent records accessible)
  const monthKeys = Object.keys(groupedByMonth).sort((a, b) => b.localeCompare(a));

  if (monthKeys.length === 0) {
    return (
      <div className="bg-white/40 backdrop-blur-md rounded-[2.5rem] p-8 border border-white soft-shadow text-center">
        <div className="text-4xl mb-3">☀️</div>
        <p className="text-xs text-gray-400 font-serif italic">暂无记录，点击下方日期开始记录吧。</p>
      </div>
    );
  }

  // Helper to find date ranges (continuous days)
  const getDateRanges = (monthEntries: LogEntry[]) => {
    if (monthEntries.length === 0) return [];
    const sorted = [...monthEntries].sort((a, b) => a.date.localeCompare(b.date));
    const ranges: { start: string; end: string }[] = [];
    
    let currentStart = sorted[0].date;
    let currentEnd = sorted[0].date;

    for (let i = 1; i < sorted.length; i++) {
      const prevDate = new Date(sorted[i - 1].date);
      const currDate = new Date(sorted[i].date);
      const diffDays = (currDate.getTime() - prevDate.getTime()) / (1000 * 3600 * 24);

      if (diffDays === 1) {
        currentEnd = sorted[i].date;
      } else {
        ranges.push({ start: currentStart, end: currentEnd });
        currentStart = sorted[i].date;
        currentEnd = sorted[i].date;
      }
    }
    ranges.push({ start: currentStart, end: currentEnd });
    return ranges;
  };

  const toggleMonth = (key: string) => {
    setExpandedMonths(prev => 
      prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between px-2">
        <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em]">月度数据概览</h3>
        <div className="h-[1px] flex-1 mx-4 bg-gray-200"></div>
        <span className="text-[10px] text-pink-500 font-bold italic">History</span>
      </div>
      
      <div className="space-y-3">
        {monthKeys.map((monthKey) => {
          const monthEntries = groupedByMonth[monthKey];
          const [year, month] = monthKey.split('-');
          const isOpen = expandedMonths.includes(monthKey);
          const ranges = getDateRanges(monthEntries);
          
          // Find dominant color
          const colorCounts = monthEntries.reduce((acc, e) => {
            acc[e.color] = (acc[e.color] || 0) + 1;
            return acc;
          }, {} as Record<string, number>);
          const dominantColor = (Object.keys(colorCounts) as FlowColor[]).reduce((a, b) => colorCounts[a] > colorCounts[b] ? a : b);

          // Find dominant volume
          const volumeCounts = monthEntries.reduce((acc, e) => {
            acc[e.volume] = (acc[e.volume] || 0) + 1;
            return acc;
          }, {} as Record<string, number>);
          const dominantVolume = (Object.keys(volumeCounts) as FlowVolume[]).reduce((a, b) => volumeCounts[a] > volumeCounts[b] ? a : b);

          // Get first and last dates of the whole recorded month period
          const firstDay = ranges[0]?.start.split('-').slice(1).join('/');
          const lastDay = ranges[ranges.length - 1]?.end.split('-').slice(1).join('/');

          return (
            <div 
              key={monthKey} 
              className={`bg-white/70 backdrop-blur-lg rounded-[2rem] border border-white soft-shadow overflow-hidden transition-all duration-300 ${isOpen ? 'ring-2 ring-pink-100' : ''}`}
            >
              <button 
                onClick={() => toggleMonth(monthKey)}
                className="w-full px-5 py-4 flex flex-col text-left group"
              >
                <div className="flex items-center justify-between w-full mb-1">
                   <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-pink-50 rounded-xl flex items-center justify-center font-serif font-bold text-pink-500 text-lg">
                        {month}
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-gray-700">{year}年 {month}月</h4>
                        <p className="text-[10px] text-gray-400 font-medium">
                          {firstDay} - {lastDay}
                        </p>
                      </div>
                   </div>
                   <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${COLOR_MAP[dominantColor]} shadow-sm`}></div>
                      <i className={`fas fa-chevron-down text-[10px] text-gray-300 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}></i>
                   </div>
                </div>
                
                <div className="flex items-center gap-4 mt-2 px-1">
                   <div className="flex items-center gap-1.5">
                      <span className="text-[9px] font-black text-sky-400 uppercase tracking-tighter">天数:</span>
                      <span className="text-[10px] font-bold text-gray-600">{monthEntries.length}天</span>
                   </div>
                   <div className="flex items-center gap-1.5">
                      <span className="text-[9px] font-black text-pink-400 uppercase tracking-tighter">流量:</span>
                      <span className="text-[10px] font-bold text-gray-600">{dominantVolume}</span>
                   </div>
                </div>
              </button>

              {isOpen && (
                <div className="px-6 pb-6 pt-2 animate-in fade-in slide-in-from-top-2 duration-300">
                  <div className="h-[1px] w-full bg-gray-50 mb-4"></div>
                  
                  <div className="space-y-4">
                    <div>
                      <p className="text-[9px] font-black text-sky-400 uppercase tracking-widest mb-2">详细周期分布</p>
                      <div className="space-y-2">
                        {ranges.map((range, idx) => (
                          <div key={idx} className="flex items-center gap-3 text-xs font-bold text-gray-600 bg-white/40 p-2 rounded-xl border border-white/50">
                            <span className="w-2 h-2 rounded-full bg-pink-300"></span>
                            <div className="flex-1 flex justify-between items-center">
                               <span>{range.start.replace(/-/g, '/')}</span>
                               <i className="fas fa-arrow-right-long text-[9px] text-gray-300"></i>
                               <span>{range.end.replace(/-/g, '/')}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-green-50/50 rounded-2xl p-3">
                        <p className="text-[8px] font-bold text-green-600 uppercase mb-1">体感关键词</p>
                        <div className="flex flex-wrap gap-1">
                          {Array.from(new Set(monthEntries.flatMap(e => e.symptoms || []))).slice(0, 3).map(s => (
                            <span key={s} className="text-[9px] text-green-700 font-medium">#{s}</span>
                          ))}
                          {monthEntries.flatMap(e => e.symptoms || []).length === 0 && <span className="text-[8px] text-gray-300">无记录</span>}
                        </div>
                      </div>
                      <div className="bg-pink-50/50 rounded-2xl p-3">
                        <p className="text-[8px] font-bold text-pink-600 uppercase mb-1">情绪轨迹</p>
                        <div className="flex flex-wrap gap-1">
                          {Array.from(new Set(monthEntries.flatMap(e => e.moods || []))).slice(0, 3).map(m => (
                            <span key={m} className="text-[9px] text-pink-700 font-medium">#{m}</span>
                          ))}
                          {monthEntries.flatMap(e => e.moods || []).length === 0 && <span className="text-[8px] text-gray-300">无记录</span>}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MonthlyStats;
