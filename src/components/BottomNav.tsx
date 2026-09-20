import React from 'react';
import { 
  Home, 
  Layers, 
  BookMarked, 
  DownloadCloud, 
  User,
  Building2
} from 'lucide-react';

interface BottomNavProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
  activeBorrowCount: number;
  downloadCount: number;
  pendingRequestsCount?: number;
  isAdmin?: boolean;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  currentTab,
  onTabChange,
  activeBorrowCount,
  downloadCount,
  pendingRequestsCount = 0,
  isAdmin = false,
}) => {
  const navItems = [
    {
      id: 'home',
      label: 'Beranda',
      icon: Home,
      badge: null,
    },
    {
      id: 'collection',
      label: 'Koleksi',
      icon: Layers,
      badge: null,
    },
    {
      id: 'borrowing',
      label: 'Pinjaman',
      icon: BookMarked,
      badge: activeBorrowCount > 0 ? activeBorrowCount : null,
    },
    {
      id: 'downloads',
      label: 'Unduhan',
      icon: DownloadCloud,
      badge: downloadCount > 0 ? downloadCount : null,
    },
    {
      id: 'profile',
      label: 'Profil',
      icon: User,
      badge: null,
    },
    ...(isAdmin ? [{ id: 'admin', label: 'Admin', icon: Building2, badge: pendingRequestsCount > 0 ? pendingRequestsCount : null }] : []),

  ];

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-lg border-t border-stone-200/90 shadow-[0_-4px_16px_rgba(0,0,0,0.06)] px-1 pb-[max(env(safe-area-inset-bottom),8px)] pt-1.5">
      <div className="flex items-center justify-around max-w-lg mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`flex-1 min-h-[48px] flex flex-col items-center justify-center py-1 px-1 rounded-xl transition-all relative ${
                isActive 
                  ? 'text-emerald-900 font-bold' 
                  : 'text-stone-500 hover:text-stone-800'
              }`}
            >
              {/* Active Indicator Top Dot or Background */}
              <div className="relative">
                <div className={`p-1.5 rounded-xl transition ${
                  isActive 
                    ? item.id === 'admin' 
                      ? 'bg-amber-100 text-amber-900 scale-105 shadow-xs'
                      : 'bg-emerald-100/90 text-emerald-800 scale-105 shadow-xs' 
                    : 'text-stone-600'
                }`}>
                  <Icon className="w-5 h-5" />
                </div>

                {/* Badge if any */}
                {item.badge !== null && (
                  <span className={`absolute -top-1 -right-1.5 min-w-[18px] h-[18px] text-white text-[10px] font-extrabold rounded-full flex items-center justify-center px-1 border-2 border-white shadow-xs ${
                    item.id === 'admin' ? 'bg-amber-600' : 'bg-emerald-600'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </div>

              <span className={`text-[10px] sm:text-[11px] mt-0.5 tracking-tight whitespace-nowrap ${
                isActive ? (item.id === 'admin' ? 'text-amber-950 font-bold' : 'text-emerald-950 font-bold') : 'text-stone-600 font-medium'
              }`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
