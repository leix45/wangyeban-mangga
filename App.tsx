
import React, { useState, useCallback, useEffect } from 'react';
import { ImageFile, ViewerSettings, TransitionType, FitMode } from './types';
import Viewer from './components/Viewer';
import ControlPanel from './components/ControlPanel';

const App: React.FC = () => {
  const [images, setImages] = useState<ImageFile[]>([]);
  const [settings, setSettings] = useState<ViewerSettings>({
    transitionType: TransitionType.SEAMLESS,
    transitionSpeed: 500,
    fitMode: FitMode.CONTAIN,
    autoScroll: false,
    autoScrollSpeed: 1,
  });

  const handleFilesSelected = useCallback((files: FileList) => {
    const fileArray = Array.from(files);
    // 过滤并排序图片
    const imageFiles = fileArray.filter(file => file.type.startsWith('image/'));
    
    // 自然排序 (1.jpg, 2.jpg, 10.jpg)
    imageFiles.sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true, sensitivity: 'base' }));

    const mappedImages: ImageFile[] = imageFiles.map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      name: file.name,
      url: URL.createObjectURL(file),
      type: file.type,
      lastModified: file.lastModified,
    }));

    setImages(prev => {
      // 清除旧的 URL 内存
      prev.forEach(img => URL.revokeObjectURL(img.url));
      return mappedImages;
    });
  }, []);

  const updateSettings = (newSettings: Partial<ViewerSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  return (
    <main className="relative w-full h-screen bg-black overflow-hidden select-none">
      <Viewer 
        images={images} 
        settings={settings} 
      />

      <ControlPanel 
        settings={settings} 
        updateSettings={updateSettings} 
        onFilesSelected={handleFilesSelected}
        imageCount={images.length}
      />

      {/* 底部状态条 */}
      <div className="fixed bottom-6 left-6 flex items-center gap-4 z-40 bg-black/40 backdrop-blur-md px-4 py-2 rounded-full border border-white/5 pointer-events-none transition-opacity duration-500 opacity-0 hover:opacity-100 group">
        <span className="text-[10px] text-zinc-400 font-medium tracking-tight">
          {settings.transitionType} • {settings.fitMode.toUpperCase()} • {images.length} FILES
        </span>
      </div>
    </main>
  );
};

export default App;
