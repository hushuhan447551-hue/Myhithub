
import React, { useState, useEffect } from 'react';
import { FlowVolume, FlowColor, FlowTexture, LogEntry } from '../types';
import { COLOR_MAP, SYMPTOMS, MOODS } from '../constants';

interface LogFormProps {
  date: string;
  initialData?: LogEntry;
  onSave: (entry: LogEntry) => void;
  onDelete: (date: string) => void;
}

const LogForm: React.FC<LogFormProps> = ({ date, initialData, onSave, onDelete }) => {
  const [volume, setVolume] = useState<FlowVolume>(initialData?.volume || FlowVolume.MEDIUM);
  const [color, setColor] = useState<FlowColor>(initialData?.color || FlowColor.BRIGHT_RED);
  const [texture, setTexture] = useState<FlowTexture>(initialData?.texture || FlowTexture.NORMAL);
  const [painLevel, setPainLevel] = useState<number>(initialData?.painLevel || 0);
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>(initialData?.symptoms || []);
  const [selectedMoods, setSelectedMoods] = useState<string[]>(initialData?.moods || []);
  const [note, setNote] = useState<string>(initialData?.note || '');

  useEffect(() => {
    if (initialData) {
      setVolume(initialData.volume);
      setColor(initialData.color);
      setTexture(initialData.texture);
      setPainLevel(initialData.painLevel);
      setSelectedSymptoms(initialData.symptoms || []);
      setSelectedMoods(initialData.moods || []);
      setNote(initialData.note || '');
    } else {
      setVolume(FlowVolume.MEDIUM);
      setColor(FlowColor.BRIGHT_RED);
      setTexture(FlowTexture.NORMAL);
      setPainLevel(0);
      setSelectedSymptoms([]);
      setSelectedMoods([]);
      setNote('');
    }
  }, [initialData, date]);

  const toggleItem = (list: string[], setList: (val: string[]) => void, item: string) => {
    if (list.includes(item)) {
      setList(list.filter(i => i !== item));
    } else {
      setList([...list, item]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ 
      date, 
      volume, 
      color, 
      texture, 
      painLevel, 
      symptoms: selectedSymptoms, 
      moods: selectedMoods, 
      note 
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-10">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold text-gray-700 tracking-tight">今天咋样</h3>
        {initialData && (
          <button 
            type="button" 
            onClick={() => onDelete(date)}
            className="text-xs text-red-300 font-bold hover:text-red-500 transition-colors"
          >
            删除记录
          </button>
        )}
      </div>

      {/* Volume */}
      <div className="space-y-4">
        <label className="text-xs font-black text-sky-400 uppercase tracking-widest">流量</label>
        <div className="grid grid-cols-4 gap-3">
          {Object.values(FlowVolume).map(v => (
            <button
              key={v}
              type="button"
              onClick={() => setVolume(v)}
              className={`py-3 rounded-2xl text-[11px] font-bold transition-all border ${
                volume === v ? 'bg-pink-400 border-pink-400 text-white shadow-lg' : 'bg-white border-pink-50 text-gray-400'
              }`}
            >
              {v}
            </button>
          ))}
        </div>
      </div>

      {/* Color Selection */}
      <div className="space-y-4">
        <label className="text-xs font-black text-pink-400 uppercase tracking-widest">色泽</label>
        <div className="bg-white/50 p-6 rounded-[2rem] border border-white">
          <div className="grid grid-cols-3 gap-6">
            {Object.values(FlowColor).map(c => (
              <button
                key={c}
                type="button"
                onClick={() => setColor(c)}
                className="flex flex-col items-center gap-2"
              >
                <div className={`w-10 h-10 rounded-full ${COLOR_MAP[c]} transition-all duration-300 ${
                  color === c ? 'ring-4 ring-sky-100 scale-110 shadow-md' : 'opacity-30'
                }`} />
                <span className={`text-[9px] font-bold truncate w-full text-center ${color === c ? 'text-gray-600' : 'text-gray-300'}`}>{c}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Symptoms & Moods */}
      <div className="space-y-8">
        <div className="space-y-4">
          <label className="text-xs font-black text-green-400 uppercase tracking-widest">体感</label>
          <div className="flex flex-wrap gap-2">
            {SYMPTOMS.map(s => (
              <button
                key={s.id}
                type="button"
                onClick={() => toggleItem(selectedSymptoms, setSelectedSymptoms, s.label)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-medium transition-all border ${
                  selectedSymptoms.includes(s.label) ? 'bg-green-400 border-green-400 text-white' : 'bg-white border-green-50 text-gray-400'
                }`}
              >
                <i className={`fas ${s.icon} text-[10px]`}></i>
                {s.label}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <label className="text-xs font-black text-sky-400 uppercase tracking-widest">情绪状态</label>
          <div className="flex flex-wrap gap-2">
            {MOODS.map(m => (
              <button
                key={m.id}
                type="button"
                onClick={() => toggleItem(selectedMoods, setSelectedMoods, m.label)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-medium transition-all border ${
                  selectedMoods.includes(m.label) ? 'bg-sky-400 border-sky-400 text-white' : 'bg-white border-sky-50 text-gray-400'
                }`}
              >
                <i className={`fas ${m.icon} text-[10px]`}></i>
                {m.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Notes */}
      <div className="space-y-4">
        <label className="text-xs font-black text-pink-400 uppercase tracking-widest">🤔</label>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="有些什么想对我说的吗？"
          className="w-full p-6 bg-white/60 border border-white rounded-[2rem] text-sm focus:outline-none focus:ring-4 focus:ring-pink-100 resize-none h-32 placeholder:text-gray-300 shadow-inner"
        />
      </div>

      <button
        type="submit"
        className="w-full py-5 bg-gradient-to-tr from-pink-400 to-sky-400 text-white rounded-[2rem] font-bold text-base shadow-xl shadow-pink-200 hover:brightness-110 transition-all active:scale-[0.98]"
      >
        保存这页心情
      </button>
    </form>
  );
};

export default LogForm;
