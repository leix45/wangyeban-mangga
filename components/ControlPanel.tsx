
import React, { useRef } from 'react';
import { TransitionType, FitMode, ViewerSettings } from '../types';

interface ControlPanelProps {
  settings: ViewerSettings;
  updateSettings: (newSettings: Partial<ViewerSettings>) => void;
  onFilesSelected: (files: FileList) => void;
  imageCount: number;
}

const ControlPanel: React.FC<ControlPanelProps> = ({
  settings,
  updateSettings,
  onFilesSelected,
  imageCount,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onFilesSelected(e.target.files);
    }
  };

  return (
    <div className="fixed top-6 right-6 z-50 w-72 bg-black/80 backdrop-blur-xl border border-white/10 rounded-2xl p-5 shadow-2xl transition-all duration-300 hover:border-white/20">
      <div className="flex flex-col gap-5">
        <header>
          <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
            Seamless View
          </h1>
          <p className="text-xs text-zinc-500 mt-1 uppercase tracking-tighter">
            Offline Mode • {imageCount > 0 ? `${imageCount} images` : 'Waiting for files'}
          </p>
        </header>

        <section className="space-y-3">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="w-full py-2.5 bg-white text-black font-bold rounded-xl hover:bg-zinc-200 transition-colors flex items-center justify-center gap-2 text-sm shadow-lg shadow-white/5"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
            选择图片文件夹
          </button>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
        </section>

        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-wider text-zinc-500 font-bold">过渡效果 (Transitions)</label>
            <select
              value={settings.transitionType}
              onChange={(e) => updateSettings({ transitionType: e.target.value as TransitionType })}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 text-zinc-200 cursor-pointer"
            >
              {Object.values(TransitionType).map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-wider text-zinc-500 font-bold">适应模式 (Fit Mode)</label>
            <div className="grid grid-cols-2 gap-2">
              {Object.values(FitMode).map((m) => (
                <button
                  key={m}
                  onClick={() => updateSettings({ fitMode: m })}
                  className={`py-1.5 px-2 text-[10px] rounded-md border transition-all duration-200 font-bold ${
                    settings.fitMode === m 
                      ? 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-500/20' 
                      : 'bg-zinc-900 border-zinc-800 text-zinc-500 hover:border-zinc-600'
                  }`}
                >
                  {m.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between">
              <label className="text-[10px] uppercase tracking-wider text-zinc-500 font-bold">过渡速度</label>
              <span className="text-[10px] text-zinc-400 font-mono">{settings.transitionSpeed}ms</span>
            </div>
            <input
              type="range"
              min="0"
              max="2000"
              step="50"
              value={settings.transitionSpeed}
              onChange={(e) => updateSettings({ transitionSpeed: parseInt(e.target.value) })}
              className="w-full h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
            />
          </div>
        </div>

        <footer className="pt-2 border-t border-zinc-800/50 flex items-center justify-between">
          <span className="text-[9px] text-zinc-600 uppercase tracking-widest">Local Privacy Encrypted</span>
          <div className={`w-1.5 h-1.5 rounded-full ${imageCount > 0 ? 'bg-emerald-500' : 'bg-zinc-800'}`} />
        </footer>
      </div>
    </div>
  );
};

export default ControlPanel;
