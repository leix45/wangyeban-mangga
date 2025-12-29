
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
    <div className="fixed top-6 right-6 z-50 w-72 bg-zinc-900/90 backdrop-blur-2xl border border-white/10 rounded-2xl p-5 shadow-[0_20px_50px_rgba(0,0,0,0.5)] transition-all duration-300 hover:border-white/20">
      <div className="flex flex-col gap-5">
        <header className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-black tracking-tighter text-white">
              SEAMLESS<span className="text-blue-500">PRO</span>
            </h1>
            <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Desktop Engine v1.0</p>
          </div>
          <div className="px-2 py-1 bg-zinc-800 rounded text-[10px] text-zinc-400 font-mono">
            {imageCount} PICS
          </div>
        </header>

        <section>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="w-full group relative overflow-hidden py-3 bg-white text-black font-black rounded-xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 text-sm"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-indigo-400 opacity-0 group-hover:opacity-10 transition-opacity" />
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
            载入图片文件夹
          </button>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            // @ts-ignore: webkitdirectory is a non-standard attribute but widely supported
            webkitdirectory=""
            directory=""
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
          <p className="text-[9px] text-center text-zinc-600 mt-2 font-medium">支持拖拽或选择整个目录</p>
        </section>

        <div className="h-px bg-white/5" />

        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-wider text-zinc-500 font-bold flex justify-between">
              过渡动画 <span>TRANSITION</span>
            </label>
            <select
              value={settings.transitionType}
              onChange={(e) => updateSettings({ transitionType: e.target.value as TransitionType })}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 text-zinc-200 cursor-pointer appearance-none"
            >
              {Object.values(TransitionType).map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-wider text-zinc-500 font-bold">画面自适应 (FIT)</label>
            <div className="grid grid-cols-2 gap-1.5">
              {Object.values(FitMode).map((m) => (
                <button
                  key={m}
                  onClick={() => updateSettings({ fitMode: m })}
                  className={`py-2 text-[9px] rounded-lg border transition-all duration-200 font-black uppercase ${
                    settings.fitMode === m 
                      ? 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-500/20' 
                      : 'bg-zinc-950 border-zinc-800 text-zinc-600 hover:text-zinc-400 hover:border-zinc-700'
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2 pt-2">
            <div className="flex justify-between items-center">
              <label className="text-[10px] uppercase tracking-wider text-zinc-500 font-bold">动画速度</label>
              <span className="text-[10px] text-blue-500 font-mono font-bold">{settings.transitionSpeed}ms</span>
            </div>
            <input
              type="range"
              min="0"
              max="1500"
              step="50"
              value={settings.transitionSpeed}
              onChange={(e) => updateSettings({ transitionSpeed: parseInt(e.target.value) })}
              className="w-full h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
            />
          </div>
        </div>

        <footer className="pt-2 flex items-center justify-between opacity-50">
          <span className="text-[8px] text-zinc-500 uppercase tracking-[0.2em]">Hardware Accelerated</span>
          <div className="flex gap-1">
            <div className="w-1 h-1 rounded-full bg-zinc-700" />
            <div className="w-1 h-1 rounded-full bg-zinc-700" />
            <div className={`w-1 h-1 rounded-full ${imageCount > 0 ? 'bg-blue-500' : 'bg-zinc-700'}`} />
          </div>
        </footer>
      </div>
    </div>
  );
};

export default ControlPanel;
