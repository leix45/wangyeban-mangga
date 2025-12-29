
import React, { useEffect, useState, useRef } from 'react';
import { ImageFile, ViewerSettings, TransitionType, FitMode } from '../types';

interface ViewerProps {
  images: ImageFile[];
  settings: ViewerSettings;
}

const Viewer: React.FC<ViewerProps> = ({ images, settings }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // 离散翻页逻辑
  const handleScroll = (e: React.WheelEvent) => {
    if (settings.transitionType === TransitionType.SEAMLESS) return;
    const delta = e.deltaY;
    if (Math.abs(delta) > 30) {
      if (delta > 0 && currentIndex < images.length - 1) {
        setCurrentIndex(prev => prev + 1);
      } else if (delta < 0 && currentIndex > 0) {
        setCurrentIndex(prev => prev - 1);
      }
    }
  };

  // 键盘导航
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (settings.transitionType === TransitionType.SEAMLESS) return;
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        setCurrentIndex(p => Math.min(images.length - 1, p + 1));
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        setCurrentIndex(p => Math.max(0, p - 1));
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [images.length, settings.transitionType]);

  // 核心响应式自适应 CSS 类
  const getFitClass = () => {
    switch (settings.fitMode) {
      case FitMode.CONTAIN: 
        return 'max-w-full max-h-screen object-contain w-auto h-auto m-auto';
      case FitMode.COVER: 
        return 'w-full h-screen object-cover';
      case FitMode.WIDTH: 
        return 'w-full h-auto object-center';
      case FitMode.ORIGINAL: 
        return 'max-w-none h-auto';
      default: 
        return 'max-w-full max-h-screen object-contain';
    }
  };

  const getTransitionStyle = (index: number) => {
    const isActive = index === currentIndex;
    const isNext = index === currentIndex + 1;
    const isPrev = index === currentIndex - 1;

    const baseStyle: React.CSSProperties = {
      transition: `all ${settings.transitionSpeed}ms cubic-bezier(0.25, 0.1, 0.25, 1)`,
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      pointerEvents: isActive ? 'auto' : 'none',
      overflow: 'hidden',
      zIndex: isActive ? 10 : 0,
    };

    switch (settings.transitionType) {
      case TransitionType.FADE:
        return { ...baseStyle, opacity: isActive ? 1 : 0 };
      case TransitionType.SLIDE:
        return { 
          ...baseStyle, 
          transform: isActive ? 'translateX(0)' : (isNext ? 'translateX(100%)' : 'translateX(-100%)') 
        };
      case TransitionType.WIPE:
        return { 
          ...baseStyle, 
          clipPath: isActive ? 'inset(0 0 0 0)' : 'inset(0 100% 0 0)' 
        };
      case TransitionType.DISSOLVE:
        return { 
          ...baseStyle, 
          opacity: isActive ? 1 : 0, 
          transform: isActive ? 'scale(1)' : 'scale(1.1)',
          filter: isActive ? 'blur(0px)' : 'blur(20px)' 
        };
      default:
        return baseStyle;
    }
  };

  if (images.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-screen w-full text-zinc-600 gap-4 bg-black">
        <div className="w-20 h-20 border border-zinc-800 rounded-3xl flex items-center justify-center animate-pulse bg-zinc-900/20">
          <svg className="w-8 h-8 opacity-40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
        <p className="text-sm font-light tracking-widest uppercase opacity-40">请拖入文件夹或点击上传图片</p>
      </div>
    );
  }

  // 无缝长图模式
  if (settings.transitionType === TransitionType.SEAMLESS) {
    return (
      <div ref={containerRef} className="w-full h-screen overflow-y-auto overflow-x-hidden scroll-smooth hide-scrollbar bg-black">
        <div className="flex flex-col items-center w-full">
          {images.map((img) => (
            <div key={img.id} className="w-full flex justify-center bg-black leading-[0] overflow-hidden">
              <img
                src={img.url}
                alt={img.name}
                loading="lazy"
                className={`select-none block transition-opacity duration-1000 ${getFitClass()}`}
              />
            </div>
          ))}
        </div>
      </div>
    );
  }

  // 离散过渡模式
  return (
    <div className="relative w-full h-screen bg-black overflow-hidden flex items-center justify-center" onWheel={handleScroll}>
      {images.map((img, idx) => (
        <div key={img.id} style={getTransitionStyle(idx)}>
          <img src={img.url} alt={img.name} className={`select-none ${getFitClass()}`} />
        </div>
      ))}
      <div className="fixed bottom-10 left-1/2 -translate-x-1/2 flex gap-1.5 z-30 px-3 py-2 bg-white/5 backdrop-blur-xl rounded-full border border-white/5">
        {images.map((_, idx) => (
          <div key={idx} onClick={() => setCurrentIndex(idx)} className={`h-1 cursor-pointer transition-all duration-300 rounded-full ${idx === currentIndex ? 'w-8 bg-blue-500' : 'w-1.5 bg-white/20 hover:bg-white/40'}`} />
        ))}
      </div>
      <div className="absolute inset-0 pointer-events-none z-40 flex items-center justify-between px-6">
        <button className={`pointer-events-auto p-4 bg-white/5 hover:bg-white/10 backdrop-blur-xl rounded-full text-white/30 hover:text-white transition-all group ${currentIndex === 0 ? 'opacity-0 invisible' : 'opacity-100'}`} onClick={() => setCurrentIndex(p => Math.max(0, p - 1))}>
          <svg className="w-6 h-6 transform group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
        </button>
        <button className={`pointer-events-auto p-4 bg-white/5 hover:bg-white/10 backdrop-blur-xl rounded-full text-white/30 hover:text-white transition-all group ${currentIndex === images.length - 1 ? 'opacity-0 invisible' : 'opacity-100'}`} onClick={() => setCurrentIndex(p => Math.min(images.length - 1, p + 1))}>
          <svg className="w-6 h-6 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
        </button>
      </div>
    </div>
  );
};

export default Viewer;
