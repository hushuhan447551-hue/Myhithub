
import React, { useState, useEffect } from 'react';
import Calendar from './components/Calendar';
import LogForm from './components/LogForm';
import MonthlyStats from './components/MonthlyStats';
import { LogEntry } from './types';

const App: React.FC = () => {
  const [entries, setEntries] = useState<LogEntry[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    const saved = localStorage.getItem('luna_entries');
    if (saved) {
      try {
        setEntries(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse saved entries");
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('luna_entries', JSON.stringify(entries));
  }, [entries]);

  const handleSaveEntry = (entry: LogEntry) => {
    setEntries(prev => {
      const filtered = prev.filter(e => e.date !== entry.date);
      return [...filtered, entry].sort((a, b) => a.date.localeCompare(b.date));
    });
  };

  const handleDeleteEntry = (date: string) => {
    setEntries(prev => prev.filter(e => e.date !== date));
  };

  const selectedEntry = entries.find(e => e.date === selectedDate);

  return (
    <div className="min-h-screen pb-28 relative bg-[#f0f9ff]">
      {/* Decorative Pastel Bubbles */}
      <div className="fixed top-20 left-10 w-64 h-64 bg-[#fdf2f8] rounded-full blur-[80px] pointer-events-none opacity-60"></div>
      <div className="fixed bottom-40 right-10 w-72 h-72 bg-[#f0fdf4] rounded-full blur-[90px] pointer-events-none opacity-50"></div>

      {/* Elegant Header */}
      <header className="px-8 py-6 flex items-center justify-between sticky top-0 z-30 bg-[#f0f9ff]/80 backdrop-blur-xl">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-pink-400 rounded-full flex items-center justify-center text-white shadow-lg">
             <i className="fas fa-heart text-xs"></i>
          </div>
          <div>
            <h1 className="text-xl font-serif font-bold text-gray-700 tracking-tight">My Menstruation</h1>
            <p className="text-[9px] text-pink-500 font-bold uppercase tracking-[0.2em] leading-none mt-1">Soft & Warm</p>
          </div>
        </div>
        <div className="flex items-center gap-4 text-gray-400">
           <button className="w-8 h-8 rounded-full hover:bg-white transition-all flex items-center justify-center border border-transparent hover:border-blue-100"><i className="fas fa-bell text-sm"></i></button>
           <button className="w-8 h-8 rounded-full hover:bg-white transition-all flex items-center justify-center border border-transparent hover:border-blue-100"><i className="fas fa-gear text-sm"></i></button>
        </div>
      </header>

      <main className="max-w-md mx-auto px-6 pt-6 space-y-10 relative z-10">
        
        {/* New Monthly Statistics Module (Replaces Hero Card and Insights Panel) */}
        <MonthlyStats entries={entries} />

        {/* Calendar Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between px-2">
            <h4 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em]">经期</h4>
            <div className="h-[1px] flex-1 mx-4 bg-gray-200"></div>
            <span className="text-[10px] text-pink-500 font-bold">查看详情</span>
          </div>
          <Calendar 
            entries={entries} 
            selectedDate={selectedDate} 
            onSelectDate={setSelectedDate} 
          />
        </div>

        {/* Log Form Section */}
        <section className="bg-white/60 backdrop-blur-md rounded-[2.5rem] p-10 border border-white soft-shadow transition-all hover:bg-white/80">
          <LogForm 
            date={selectedDate} 
            initialData={selectedEntry} 
            onSave={handleSaveEntry}
            onDelete={handleDeleteEntry}
          />
        </section>

        {/* Clean Footer */}
        <div className="text-center py-12 px-10">
          <p className="text-[12px] font-serif text-gray-400 leading-relaxed italic opacity-80">
            “裹紧小被子，喝杯热牛奶。<br/>在这个粉蓝色的春天里，好好爱自己。”
          </p>
          <div className="flex justify-center items-center gap-6 mt-8">
             <span className="text-pink-300">🌸</span>
             <div className="w-4 h-4 rounded-full border border-blue-200"></div>
             <span className="text-green-300">🌿</span>
          </div>
        </div>
      </main>

      {/* Modern Bottom Navigation */}
      <nav className="fixed bottom-8 left-1/2 -translate-x-1/2 w-[90%] max-w-sm bg-white/90 backdrop-blur-xl border border-white/50 rounded-full px-6 py-4 flex justify-between items-center z-40 soft-shadow">
        <button className="text-pink-400 flex flex-col items-center">
          <i className="fas fa-house-chimney text-lg"></i>
          <span className="text-[7px] font-bold mt-1 uppercase tracking-widest opacity-60">首页</span>
        </button>
        <button className="text-gray-300 hover:text-blue-400 transition-colors flex flex-col items-center">
          <i className="fas fa-calendar-day text-lg"></i>
          <span className="text-[7px] font-bold mt-1 uppercase tracking-widest opacity-0">日历</span>
        </button>
        
        <button 
          onClick={() => setSelectedDate(new Date().toISOString().split('T')[0])}
          className="w-12 h-12 bg-gradient-to-tr from-pink-400 to-sky-300 rounded-full shadow-lg flex items-center justify-center text-white text-xl active:scale-90 transition-all -mt-10 border-4 border-white"
        >
          <i className="fas fa-plus"></i>
        </button>

        <button className="text-gray-300 hover:text-green-400 transition-colors flex flex-col items-center">
          <i className="fas fa-leaf text-lg"></i>
          <span className="text-[7px] font-bold mt-1 uppercase tracking-widest opacity-0">花园</span>
        </button>
        <button className="text-gray-300 hover:text-pink-400 transition-colors flex flex-col items-center">
          <i className="fas fa-user text-lg"></i>
          <span className="text-[7px] font-bold mt-1 uppercase tracking-widest opacity-0">我的</span>
        </button>
      </nav>
    </div>
  );
};

export default App;