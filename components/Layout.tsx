
import React, { useState, useEffect } from 'react';
import { 
  Home, 
  Calendar, 
  Users, 
  BarChart3, 
  Upload, 
  Settings, 
  Moon, 
  Sun,
  Menu,
  X,
  MessageSquareQuote
} from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  activeView: string;
  onNavigate: (view: string) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, activeView, onNavigate }) => {
  const [isDarkMode, setIsDarkMode] = useState(false); // Iniciar como Light Mode (Gelo)
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'planner', label: 'Planejador', icon: Calendar },
    { id: 'people', label: 'Pessoas', icon: Users },
    { id: 'feedback', label: 'Feedback', icon: MessageSquareQuote },
    { id: 'reports', label: 'Relatórios', icon: BarChart3 },
    { id: 'import', label: 'Subir Dados', icon: Upload },
    { id: 'settings', label: 'Configurações', icon: Settings },
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-brand-dark">
      {/* Sidebar */}
      <aside className={`
        ${isSidebarOpen ? 'w-64' : 'w-20'} 
        bg-brand-navy border-r border-black/5
        transition-all duration-300 flex flex-col z-50
      `}>
        <div className="p-5 flex items-center justify-between border-b border-white/5">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-10 h-10 bg-brand-yellow rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg shadow-brand-yellow/20 overflow-hidden">
              <img 
                src="https://http2.mlstatic.com/frontend-assets/ui-navigation/5.21.22/mercadolibre/logo__small.png" 
                alt="Mercado Livre" 
                className="w-8 h-8 object-contain"
              />
            </div>
            {isSidebarOpen && <span className="font-black text-sm leading-tight text-brand-yellow tracking-tighter uppercase">Performance<br/>SRS7</span>}
          </div>
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-1.5 hover:bg-white/10 rounded-lg text-white/70"
          >
            {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        <nav className="flex-1 py-6 px-3 space-y-2 overflow-y-auto custom-scrollbar">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`
                  w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all
                  ${isActive 
                    ? 'bg-brand-yellow text-brand-navy font-black shadow-lg shadow-brand-yellow/20' 
                    : 'text-white/60 hover:bg-white/5 hover:text-white'}
                `}
              >
                <Icon size={20} className={isActive ? 'stroke-[3px]' : ''} />
                {isSidebarOpen && <span className="text-xs uppercase tracking-widest font-black">{item.label}</span>}
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/5">
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="w-full flex items-center gap-3 px-4 py-3 text-white/40 hover:bg-white/5 rounded-xl transition-colors"
          >
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            {isSidebarOpen && <span className="text-xs font-black uppercase tracking-widest">{isDarkMode ? 'Modo Claro' : 'Modo Escuro'}</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="h-20 bg-brand-surface/80 backdrop-blur-md border-b border-black/5 flex items-center justify-between px-8 flex-shrink-0 no-print">
          <div className="flex items-center gap-4">
            <div className="w-1 h-8 bg-brand-yellow rounded-full shadow-sm"></div>
            <h2 className="text-2xl font-black uppercase tracking-tighter text-brand-navy">{activeView.replace('-', ' ')}</h2>
          </div>
          
          <div className="flex items-center gap-5">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-black text-brand-navy uppercase tracking-tight">Gestor Operacional</p>
              <p className="text-[10px] text-brand-navy/60 font-black uppercase tracking-widest">SRS7 Logística</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-brand-yellow border-2 border-brand-navy/10 flex items-center justify-center font-black text-brand-navy shadow-lg shadow-brand-yellow/10">
              GO
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
