import React, { useState } from 'react';
import { 
  Smartphone, 
  Tablet, 
  Monitor, 
  Layers, 
  Wifi, 
  Battery, 
  Signal, 
  Volume2,
  RotateCcw
} from 'lucide-react';
import { DeviceViewMode } from '../types';

interface DeviceFrameWrapperProps {
  viewMode: DeviceViewMode;
  onViewModeChange: (mode: DeviceViewMode) => void;
  children: React.ReactNode;
  villageName: string;
}

export const DeviceFrameWrapper: React.FC<DeviceFrameWrapperProps> = ({
  viewMode,
  onViewModeChange,
  children,
  villageName,
}) => {
  const [scaleFactor, setScaleFactor] = useState<number>(100);
  const currentTime = '09:41';

  // If responsive, render children directly with the floating device control bar
  if (viewMode === 'responsive') {
    return (
      <div className="min-h-screen bg-[#F8FAF8] text-[#1E2922]">
        {/* Device Mode Switcher Floating Bar */}
        <div className="sticky top-0 z-50 bg-emerald-900 text-white px-4 py-2 text-xs flex flex-wrap items-center justify-between border-b border-emerald-800/80 shadow-sm backdrop-blur-md">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-semibold tracking-wide">Pratinjau UI Desa:</span>
            <span className="text-emerald-200 hidden sm:inline">{villageName}</span>
          </div>

          <div className="flex items-center gap-1.5 bg-emerald-950/60 p-1 rounded-lg border border-emerald-700/50">
            <button
              onClick={() => onViewModeChange('responsive')}
              className="flex items-center gap-1 px-2.5 py-1 rounded-md transition font-medium bg-emerald-600 text-white shadow-sm"
              title="Tampilan Responsif Penuh"
            >
              <Monitor className="w-3.5 h-3.5" />
              <span>Penuh</span>
            </button>
            <button
              onClick={() => onViewModeChange('smartphone')}
              className="flex items-center gap-1 px-2.5 py-1 rounded-md transition font-medium text-emerald-300 hover:text-white hover:bg-emerald-800/40"
              title="Mockup Smartphone Fotorealistik"
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>HP (Mobile)</span>
            </button>
            <button
              onClick={() => onViewModeChange('tablet')}
              className="flex items-center gap-1 px-2.5 py-1 rounded-md transition font-medium text-emerald-300 hover:text-white hover:bg-emerald-800/40"
              title="Mockup Tablet Fotorealistik"
            >
              <Tablet className="w-3.5 h-3.5" />
              <span>Tablet</span>
            </button>
            <button
              onClick={() => onViewModeChange('showcase')}
              className="flex items-center gap-1 px-2.5 py-1 rounded-md transition font-medium text-amber-300 hover:text-white hover:bg-emerald-800/40"
              title="Mockup Studio Multi-Perangkat (HP + Tablet)"
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Studio Mockup</span>
            </button>
          </div>
        </div>

        {/* Content */}
        {children}
      </div>
    );
  }

  // Device Showcase Studio (Multi-device photorealistic rendering)
  if (viewMode === 'showcase') {
    return (
      <div className="min-h-screen bg-stone-900 text-white flex flex-col">
        {/* Switcher Header */}
        <div className="sticky top-0 z-50 bg-stone-950/90 text-white px-4 py-2.5 text-xs flex flex-wrap items-center justify-between border-b border-stone-800 shadow-md backdrop-blur-md">
          <div className="flex items-center gap-3">
            <span className="font-semibold text-amber-400 flex items-center gap-1.5">
              <Layers className="w-4 h-4" /> Studio Render Mockup Fotorealistik
            </span>
            <span className="text-stone-400 hidden md:inline">
              Menampilkan mockup aplikasi pada Smartphone & Tablet dengan rasio asli
            </span>
          </div>

          <div className="flex items-center gap-1.5 bg-stone-900 p-1 rounded-lg border border-stone-700">
            <button
              onClick={() => onViewModeChange('responsive')}
              className="flex items-center gap-1 px-2.5 py-1 rounded-md text-stone-300 hover:text-white hover:bg-stone-800"
            >
              <Monitor className="w-3.5 h-3.5" />
              <span>Penuh</span>
            </button>
            <button
              onClick={() => onViewModeChange('smartphone')}
              className="flex items-center gap-1 px-2.5 py-1 rounded-md text-stone-300 hover:text-white hover:bg-stone-800"
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>HP</span>
            </button>
            <button
              onClick={() => onViewModeChange('tablet')}
              className="flex items-center gap-1 px-2.5 py-1 rounded-md text-stone-300 hover:text-white hover:bg-stone-800"
            >
              <Tablet className="w-3.5 h-3.5" />
              <span>Tablet</span>
            </button>
            <button
              onClick={() => onViewModeChange('showcase')}
              className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-amber-500 text-stone-900 font-bold"
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Studio</span>
            </button>
          </div>
        </div>

        {/* Studio Canvas with Ambient Shadow & Realistic Devices */}
        <div className="flex-1 p-6 md:p-12 overflow-x-auto overflow-y-auto flex items-center justify-center bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-stone-800 via-stone-900 to-black">
          <div className="flex flex-col lg:flex-row items-center justify-center gap-12 max-w-7xl mx-auto py-8">
            
            {/* 1. Photorealistic Smartphone Frame */}
            <div className="flex flex-col items-center">
              <div className="text-xs text-stone-400 font-medium mb-3 flex items-center gap-1.5">
                <Smartphone className="w-4 h-4 text-emerald-400" />
                <span>Mobile View (Handphone Warga Desa - 390 x 844 px)</span>
              </div>
              
              {/* Phone Hardware Chassis */}
              <div className="relative w-[375px] h-[780px] bg-[#1a1b1e] rounded-[52px] p-[11px] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9),0_0_0_1px_rgba(255,255,255,0.15),inset_0_0_0_2px_rgba(0,0,0,0.8)] ring-1 ring-stone-700/50">
                {/* Outer bezel reflections */}
                <div className="absolute inset-0 rounded-[52px] pointer-events-none border border-white/10" />
                
                {/* Physical buttons */}
                <div className="absolute -left-[14px] top-28 w-[3px] h-10 bg-stone-700 rounded-l-sm" />
                <div className="absolute -left-[14px] top-42 w-[3px] h-12 bg-stone-700 rounded-l-sm" />
                <div className="absolute -left-[14px] top-56 w-[3px] h-12 bg-stone-700 rounded-l-sm" />
                <div className="absolute -right-[14px] top-36 w-[3px] h-16 bg-stone-700 rounded-r-sm" />

                {/* Glass Screen */}
                <div className="w-full h-full bg-[#F8FAF8] rounded-[42px] overflow-hidden flex flex-col relative shadow-inner">
                  {/* Status Bar */}
                  <div className="h-10 bg-emerald-900 text-white px-6 flex items-center justify-between text-xs z-30 select-none">
                    <span className="font-semibold text-[11px]">{currentTime}</span>
                    {/* Dynamic Island / Notch */}
                    <div className="w-24 h-4 bg-black rounded-full mx-auto flex items-center justify-center">
                      <div className="w-2.5 h-2.5 rounded-full bg-stone-900 border border-stone-800" />
                    </div>
                    <div className="flex items-center gap-1.5 text-[10px]">
                      <Signal className="w-3 h-3 text-emerald-300" />
                      <Wifi className="w-3 h-3 text-emerald-300" />
                      <Battery className="w-3.5 h-3.5 text-emerald-300" />
                    </div>
                  </div>

                  {/* App Screen Content Scrollable */}
                  <div className="flex-1 overflow-y-auto bg-[#F8FAF8] text-[#1E2922]">
                    {children}
                  </div>

                  {/* Home Indicator Bar */}
                  <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-32 h-1 bg-stone-400/80 rounded-full pointer-events-none z-30" />
                </div>
              </div>
            </div>

            {/* 2. Photorealistic Tablet Frame */}
            <div className="flex flex-col items-center">
              <div className="text-xs text-stone-400 font-medium mb-3 flex items-center gap-1.5">
                <Tablet className="w-4 h-4 text-sky-400" />
                <span>Tablet / Ruang Baca Desa View (640 x 820 px)</span>
              </div>
              
              {/* Tablet Chassis */}
              <div className="relative w-[540px] h-[780px] bg-[#1a1b1e] rounded-[38px] p-[12px] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9),0_0_0_1px_rgba(255,255,255,0.15)] ring-1 ring-stone-700/50">
                {/* Front Camera */}
                <div className="absolute top-3 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-stone-900 border border-stone-700/80 z-20" />

                {/* Screen */}
                <div className="w-full h-full bg-[#F8FAF8] rounded-[28px] overflow-hidden flex flex-col relative shadow-inner">
                  {/* Tablet Status Bar */}
                  <div className="h-7 bg-emerald-900 text-white px-5 flex items-center justify-between text-[11px] z-30 select-none border-b border-emerald-800">
                    <span className="font-semibold">{currentTime} - Perpustakaan Desa</span>
                    <div className="flex items-center gap-2 text-[10px]">
                      <span className="text-emerald-300">Mode Layar Sentuh Tab</span>
                      <Wifi className="w-3 h-3 text-emerald-300" />
                      <Battery className="w-3.5 h-3.5 text-emerald-300" />
                    </div>
                  </div>

                  {/* App Screen Content Scrollable */}
                  <div className="flex-1 overflow-y-auto bg-[#F8FAF8] text-[#1E2922]">
                    {children}
                  </div>

                  {/* Tablet Home Bar */}
                  <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-36 h-1 bg-stone-400/80 rounded-full pointer-events-none z-30" />
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Footer info in showcase */}
        <div className="p-3 bg-stone-950 text-center text-xs text-stone-400 border-t border-stone-800">
          Tip: Klik mode <strong>"Penuh"</strong> di pojok kanan atas untuk navigasi interaktif tanpa bingkai perangkat.
        </div>
      </div>
    );
  }

  // Single Device View (Smartphone or Tablet)
  const isTablet = viewMode === 'tablet';

  return (
    <div className="min-h-screen bg-stone-900 text-white flex flex-col">
      {/* Switcher Header */}
      <div className="sticky top-0 z-50 bg-stone-950/90 text-white px-4 py-2.5 text-xs flex flex-wrap items-center justify-between border-b border-stone-800 shadow-md backdrop-blur-md">
        <div className="flex items-center gap-3">
          <span className="font-semibold text-emerald-400 flex items-center gap-1.5">
            {isTablet ? <Tablet className="w-4 h-4" /> : <Smartphone className="w-4 h-4" />}
            {isTablet ? 'Mockup Tablet Ruang Baca' : 'Mockup Handphone Warga'}
          </span>
          <span className="text-stone-400 hidden sm:inline">
            Rendering fotorealistik layar sentuh portabel
          </span>
        </div>

        <div className="flex items-center gap-1.5 bg-stone-900 p-1 rounded-lg border border-stone-700">
          <button
            onClick={() => onViewModeChange('responsive')}
            className="flex items-center gap-1 px-2.5 py-1 rounded-md text-stone-300 hover:text-white hover:bg-stone-800"
          >
            <Monitor className="w-3.5 h-3.5" />
            <span>Penuh</span>
          </button>
          <button
            onClick={() => onViewModeChange('smartphone')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-md transition ${
              viewMode === 'smartphone' ? 'bg-emerald-600 text-white font-semibold' : 'text-stone-300 hover:bg-stone-800'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>HP</span>
          </button>
          <button
            onClick={() => onViewModeChange('tablet')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-md transition ${
              viewMode === 'tablet' ? 'bg-emerald-600 text-white font-semibold' : 'text-stone-300 hover:bg-stone-800'
            }`}
          >
            <Tablet className="w-3.5 h-3.5" />
            <span>Tablet</span>
          </button>
          <button
            onClick={() => onViewModeChange('showcase')}
            className="flex items-center gap-1 px-2.5 py-1 rounded-md text-amber-300 hover:bg-stone-800"
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Studio</span>
          </button>
        </div>
      </div>

      {/* Realistic Device Screen Canvas */}
      <div className="flex-1 p-4 sm:p-8 flex items-center justify-center overflow-auto bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-stone-800 via-stone-900 to-black">
        <div 
          className={`relative bg-[#18191c] rounded-[48px] p-2.5 sm:p-3 shadow-[0_30px_70px_-10px_rgba(0,0,0,0.85),0_0_0_1px_rgba(255,255,255,0.12)] ring-1 ring-stone-700/60 my-auto ${
            isTablet 
              ? 'w-full max-w-[620px] h-[840px] rounded-[36px]' 
              : 'w-full max-w-[390px] h-[820px] rounded-[52px]'
          }`}
        >
          {/* Edge glare highlight */}
          <div className="absolute inset-0 rounded-[48px] pointer-events-none border border-white/10" />

          {/* Device Speaker & Camera */}
          {!isTablet && (
            <div className="absolute top-5 left-1/2 -translate-x-1/2 w-24 h-4 bg-black rounded-full flex items-center justify-center z-40">
              <div className="w-2.5 h-2.5 rounded-full bg-stone-900 border border-stone-800 mr-2" />
              <div className="w-10 h-1 bg-stone-800 rounded-full" />
            </div>
          )}

          {/* Screen */}
          <div className={`w-full h-full bg-[#F8FAF8] overflow-hidden flex flex-col relative shadow-inner ${
            isTablet ? 'rounded-[26px]' : 'rounded-[42px]'
          }`}>
            {/* Status Bar */}
            <div className="h-9 bg-emerald-900 text-white px-5 flex items-center justify-between text-xs z-30 select-none">
              <span className="font-semibold text-[11px]">{currentTime}</span>
              <div className="flex items-center gap-1.5 text-[10px]">
                <Signal className="w-3 h-3 text-emerald-300" />
                <Wifi className="w-3 h-3 text-emerald-300" />
                <Battery className="w-3.5 h-3.5 text-emerald-300" />
              </div>
            </div>

            {/* Scrollable Inside View */}
            <div className="flex-1 overflow-y-auto bg-[#F8FAF8] text-[#1E2922]">
              {children}
            </div>

            {/* Home Bar */}
            <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-32 h-1 bg-stone-400/80 rounded-full pointer-events-none z-30" />
          </div>
        </div>
      </div>
    </div>
  );
};
