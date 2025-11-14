import React, { useState, useEffect, useCallback } from 'react';
import { Camera, Image as ImageIcon } from 'lucide-react';
import { EarthMap } from './components/EarthMap';
import { GalleryModal } from './components/GalleryModal';
import { Snapshot } from './types';

type Theme = 'dark' | 'light';

export default function App() {
  const [isFlashing, setIsFlashing] = useState(false);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [snapshots, setSnapshots] = useState<Snapshot[]>([]);
  const [theme, setTheme] = useState<Theme>('dark');

  // Load snapshots and theme from local storage on mount
  useEffect(() => {
    const savedSnapshots = localStorage.getItem('earth_inspires_snapshots');
    if (savedSnapshots) {
      try {
        setSnapshots(JSON.parse(savedSnapshots));
      } catch (e) {
        console.error("Failed to parse saved snapshots", e);
      }
    }
    const savedTheme = localStorage.getItem('earth_inspires_theme') as Theme;
    if (savedTheme) {
      setTheme(savedTheme);
    }
  }, []);

  // Save snapshots and theme to local storage whenever they change
  useEffect(() => {
    localStorage.setItem('earth_inspires_snapshots', JSON.stringify(snapshots));
  }, [snapshots]);
  
  useEffect(() => {
    localStorage.setItem('earth_inspires_theme', theme);
    const body = document.body;
    if (theme === 'light') {
      body.classList.remove('bg-space-950', 'text-white');
      body.classList.add('bg-slate-100', 'text-slate-800');
    } else {
      body.classList.remove('bg-slate-100', 'text-slate-800');
      body.classList.add('bg-space-950', 'text-white');
    }
  }, [theme]);

  const handleCapture = useCallback(() => {
    setIsFlashing(true);
    
    const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3');
    audio.volume = 0.5;
    audio.play().catch(e => console.log("Audio play blocked", e));

    setTimeout(() => setIsFlashing(false), 500);
    
    const randomId = Date.now();
    const randomSeed = Math.floor(Math.random() * 1000);
    const mockImageUrl = `https://picsum.photos/seed/${randomSeed}/800/800`;

    const newSnapshot: Snapshot = {
      id: randomId,
      thumbnailDataURL: mockImageUrl,
      timestamp: new Date().toLocaleString(),
      zoom: 2,
      lat: 0,
      lng: 0,
    };

    setSnapshots(prev => [newSnapshot, ...prev]);
  }, []);

  const handleDelete = (id: number) => {
    setSnapshots(prev => prev.filter(s => s.id !== id));
  };
  
  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'dark' ? 'light' : 'dark');
  };
  
  const isLight = theme === 'light';

  return (
    <div className="relative min-h-screen w-full flex flex-col overflow-hidden">
      
      {/* Background Ambient Effects */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-30 animate-pulse"></div>
      <div className={`absolute top-[-20%] left-[-10%] w-[50%] h-[50%] blur-[120px] rounded-full transition-all duration-4000 ${isLight ? 'bg-blue-200/30' : 'bg-blue-900/20'}`}></div>
      <div className={`absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] blur-[120px] rounded-full transition-all duration-4000 ${isLight ? 'bg-purple-200/30' : 'bg-purple-900/20'}`}></div>

      {/* Header */}
      <header className="relative z-20 w-full flex items-center justify-between px-6 py-6 lg:px-12">
        <button onClick={toggleTheme} className="text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 rounded-md p-1 -m-1">
          <h1 className={`text-2xl font-bold tracking-tighter transition-colors duration-2000 ${isLight ? 'text-slate-700' : 'text-slate-400'}`}>Earth Inspires</h1>
          <p className={`text-xs tracking-wide uppercase transition-colors duration-2000 text-slate-500`}>Satellite Explorer</p>
        </button>
      </header>

      {/* Main Content - The Earth */}
      <main className="flex-1 relative z-10 flex flex-col items-center justify-center min-h-[60vh]">
        <EarthMap isFlashing={isFlashing} theme={theme} />
      </main>

      {/* Controls Bar */}
      <footer className="relative z-30 w-full pb-12 pt-6 px-6 flex justify-center items-center gap-8">
          {/* Capture Button */}
          <button 
            onClick={handleCapture}
            aria-label="Capture snapshot"
            className={`w-16 h-16 rounded-full flex items-center justify-center transition-colors duration-4000 ease-in-out hover:duration-300 shadow-lg ${isLight ? 'bg-white border border-slate-300 text-blue-500 hover:bg-blue-500 hover:text-white' : 'bg-slate-800 border border-slate-600 text-blue-400 hover:bg-blue-600 hover:border-blue-500 hover:text-white'}`}
          >
            <Camera className="w-8 h-8 fill-current" />
          </button>

          <div className={`w-px h-12 transition-colors duration-4000 ${isLight ? 'bg-slate-300' : 'bg-slate-700'}`}></div>

          {/* Gallery Button */}
          <button 
            onClick={() => setIsGalleryOpen(true)}
            aria-label="Open gallery"
            className={`relative w-16 h-16 rounded-full flex items-center justify-center transition-colors duration-4000 ease-in-out hover:duration-300 shadow-lg ${isLight ? 'bg-white border border-slate-300 text-blue-500 hover:bg-blue-500 hover:text-white' : 'bg-slate-800 border border-slate-600 text-blue-400 hover:bg-blue-600 hover:border-blue-500 hover:text-white'}`}
          >
            <ImageIcon className="w-6 h-6" />
            {snapshots.length > 0 && (
              <span className={`absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full border-2 transition-colors duration-4000 ${isLight ? 'border-white' : 'border-slate-900'}`}>
                {snapshots.length}
              </span>
            )}
          </button>
      </footer>

      {/* Gallery Modal */}
      <GalleryModal 
        isOpen={isGalleryOpen} 
        onClose={() => setIsGalleryOpen(false)} 
        snapshots={snapshots}
        onDelete={handleDelete}
        theme={theme}
      />
    </div>
  );
}