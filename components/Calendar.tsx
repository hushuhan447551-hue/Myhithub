
import React, { useState } from 'react';
import { LogEntry } from '../types';

interface CalendarProps {
  entries: LogEntry[];
  selectedDate: string;
  onSelectDate: (date: string) => void;
}

const Calendar: React.FC<CalendarProps> = ({ entries, selectedDate, onSelectDate }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const daysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  const totalDays = daysInMonth(year, month);
  const offset = firstDayOfMonth(year, month);

  const prevMonth = () => setCurrentMonth(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentMonth(new Date(year, month + 1, 1));

  const getEntry = (d: number) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    return entries.find(e => e.date === dateStr);
  };

  const dayLabels = ['日', '一', '二', '三', '四', '五', '六'];

  return (
    <div className="bg-white/40 backdrop-blur-md rounded-[2.5rem] p-8 border border-white soft-shadow">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-serif font-bold text-gray-700">
            {year}年 <span className="text-pink-500">{month + 1}月</span>
          </h2>
        </div>
        <div className="flex gap-2">
          <button onClick={prevMonth} className="w-10 h-10 flex items-center justify-center bg-white rounded-full border border-pink-50 text-gray-400 hover:text-pink-500 transition-all">
            <i className="fas fa-chevron-left text-xs"></i>
          </button>
          <button onClick={nextMonth} className="w-10 h-10 flex items-center justify-center bg-white rounded-full border border-pink-50 text-gray-400 hover:text-pink-500 transition-all">
            <i className="fas fa-chevron-right text-xs"></i>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center mb-4">
        {dayLabels.map(label => (
          <div key={label} className="text-[10px] font-bold text-gray-300 uppercase tracking-[0.2em]">{label}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-y-4 gap-x-2">
        {Array.from({ length: offset }).map((_, i) => (
          <div key={`empty-${i}`} />
        ))}
        {Array.from({ length: totalDays }).map((_, i) => {
          const d = i + 1;
          const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
          const entry = getEntry(d);
          const isSelected = selectedDate === dateStr;

          return (
            <button
              key={d}
              onClick={() => onSelectDate(dateStr)}
              className={`
                relative h-20 w-full flex flex-col items-center justify-center rounded-3xl transition-all duration-300 group
                ${isSelected ? 'bg-white scale-110 shadow-lg ring-1 ring-pink-100' : 'hover:bg-white/50'}
              `}
            >
              {/* Large sunflower for recorded days */}
              <div className={`text-4xl mb-1 transition-all ${entry ? 'opacity-100 scale-100 drop-shadow-md' : 'opacity-5 scale-75 group-hover:opacity-20'}`}>
                 🌻
              </div>
              <span className={`text-[10px] font-bold ${isSelected ? 'text-pink-500' : 'text-gray-400'}`}>
                {d}
              </span>
              
              {isSelected && (
                <div className="absolute -bottom-1 w-1.5 h-1.5 bg-sky-400 rounded-full"></div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default Calendar;
