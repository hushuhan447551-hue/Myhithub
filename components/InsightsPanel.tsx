
import React, { useState } from 'react';
import { LogEntry } from '../types';
import { getHealthInsights } from '../services/geminiService';

interface InsightsPanelProps {
  entries: LogEntry[];
  characterImg: string;
}

const InsightsPanel: React.FC<InsightsPanelProps> = ({ entries, characterImg }) => {
  const [loading, setLoading] = useState(false);
  const [insight, setInsight] = useState<string | null>(null);

  const handleGetInsight = async () => {
    if (entries.length === 0) {
      setInsight("今天还没记录哦？快去记一下吧，我会乖乖等着的~");
      return;
    }
    setLoading(true);
    const result = await getHealthInsights(entries);
    setInsight(result);
    setLoading(false);
  };

  return (
    <div className="bg-white/60 rounded-[2.5rem] p-6 border border-white soft-shadow relative overflow-hidden group">
      <div className="flex items-start gap-4">
        {/* Character Avatar */}
        <div className="relative shrink-0">
          <div className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-pink-100 shadow-sm ring-4 ring-white">
            <img src={characterImg} alt="Cozy Girl" className="w-full h-full object-cover" />
          </div>
          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white animate-pulse"></div>
        </div>
        
        <div className="flex-1 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-black text-pink-500 tracking-[0.2em] uppercase">秘密谈话</h3>
            <span className="text-[9px] text-gray-300 font-bold">在线守护</span>
          </div>
          
          {insight ? (
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-700">
              <p className="text-sm text-gray-600 leading-relaxed font-medium">
                “{insight}”
              </p>
              <div className="flex justify-end mt-4">
                <button 
                  onClick={handleGetInsight} 
                  className="text-[10px] text-pink-400 font-bold hover:text-pink-600 transition-colors"
                >
                  <i className="fas fa-redo mr-1"></i> 再次叮嘱
                </button>
              </div>
            </div>
          ) : (
            <div>
              <p className="text-xs text-gray-400 leading-relaxed mb-4">我会根据你的记录，给你最温柔、最懂你的调理建议。不管是心情还是身体，都有我呢。</p>
              <button
                onClick={handleGetInsight}
                disabled={loading}
                className="w-full py-3 bg-gradient-to-r from-pink-400 to-sky-400 text-white text-[11px] font-bold rounded-xl shadow-lg shadow-pink-200 hover:brightness-105 transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <i className="fas fa-circle-notch animate-spin"></i>
                    正在听你说...
                  </>
                ) : (
                  <>
                    <i className="fas fa-comment-heart text-[10px]"></i>
                    听听我的建议
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InsightsPanel;
