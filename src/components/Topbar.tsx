import { Menu, Building2 } from 'lucide-react';

interface TopbarProps {
  onMenuClick: () => void;
  title: string;
  subtitle: string;
}

export default function Topbar({ onMenuClick, title, subtitle }: TopbarProps) {
  return (
    <header className="sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b border-gray-200 px-4 lg:px-8 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <Menu className="w-6 h-6 text-gray-700" />
          </button>
          <div>
            <h2 className="text-lg lg:text-xl font-bold text-gray-900">{title}</h2>
            <p className="text-xs lg:text-sm text-gray-500">{subtitle}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-medium text-emerald-700">System Online</span>
          </div>
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center">
            <Building2 className="w-5 h-5 text-white" />
          </div>
        </div>
      </div>
    </header>
  );
}
