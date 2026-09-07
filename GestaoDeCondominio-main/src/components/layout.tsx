import { 
  Home, 
  Wallet, 
  Bell, 
  PieChart, 
  MessageSquare,
  Users,
  Shield,
  FileText,
  Gavel,
  Briefcase,
  Menu, 
  User as UserIcon,
  X
} from 'lucide-react';
import { ViewState } from '../types';
import { cn } from './ui';
import { useState } from 'react';

interface LayoutProps {
  currentView: ViewState;
  onNavigate: (view: ViewState) => void;
  children: React.ReactNode;
}

const NAV_MOBILE = [
  { id: 'inicio', label: 'Início', icon: Home },
  { id: 'avisos', label: 'Avisos', icon: Bell },
  { id: 'pesquisas', label: 'Pesquisas', icon: PieChart },
  { id: 'financeiro', label: 'Financeiro', icon: Wallet },
  { id: 'assembleias', label: 'Assembleias', icon: Gavel },
] as const;

const NAV_GROUPS = [
  {
    title: 'Comunicação',
    items: [
      { id: 'avisos', label: 'Mural de Avisos', icon: Bell },
      { id: 'pesquisas', label: 'Pesquisas de Opinião', icon: PieChart },
      { id: 'classificados', label: 'Classificados', icon: MessageSquare },
    ]
  },
  {
    title: 'Financeiro',
    items: [
      { id: 'financeiro', label: 'Financeiro e Cobrança', icon: Wallet },
    ]
  },
  {
    title: 'Governança',
    items: [
      { id: 'assembleias', label: 'Assembleias', icon: Gavel },
      { id: 'documentos', label: 'Documentos', icon: FileText },
    ]
  },
  {
    title: 'Administração',
    items: [
      { id: 'fornecedores', label: 'Fornecedores', icon: Briefcase },
      { id: 'moradores', label: 'Cadastro Único', icon: Users },
      { id: 'acessos', label: 'Acessos', icon: Shield },
    ]
  }
];

export function AppLayout({ currentView, onNavigate, children }: LayoutProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="flex h-screen bg-surface-subtle overflow-hidden">
      
      {/* Desktop Sidebar (hidden on mobile, visible on desktop) */}
      <aside className="hidden lg:flex flex-col w-64 bg-surface border-r border-border-subtle overflow-y-auto">
        <div className="p-6 shrink-0">
          <h1 className="text-xl font-bold text-primary">Condo SaaS</h1>
          <p className="text-sm text-content-muted mt-1">Residencial das Águas • Ap 102</p>
        </div>
        
        <nav className="flex-1 px-4 pb-4">
          <button
            onClick={() => onNavigate('inicio')}
            className={cn(
              "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors mb-4",
              (currentView === 'inicio' || currentView === 'dashboard' as string) 
                ? "bg-primary text-white" 
                : "text-content-muted hover:bg-surface-subtle hover:text-content"
            )}
          >
            <Home size={20} />
            Início
          </button>
          
          {NAV_GROUPS.map((group) => (
            <div key={group.title} className="mb-6">
              <h3 className="px-3 text-xs font-semibold text-content-muted uppercase tracking-wider mb-2">
                {group.title}
              </h3>
              <div className="space-y-1">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = currentView === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => onNavigate(item.id as ViewState)}
                      className={cn(
                        "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                        isActive 
                          ? "bg-primary-hover/10 text-primary" 
                          : "text-content-muted hover:bg-surface-subtle hover:text-content"
                      )}
                    >
                      <Icon size={20} />
                      {item.label}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>
        
        <div className="p-4 border-t border-border-subtle shrink-0">
          <button 
            onClick={() => onNavigate('login')}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-danger hover:bg-danger-bg transition-colors"
          >
            Sair
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-full overflow-hidden relative">
        {/* Mobile Header */}
        <header className="lg:hidden flex items-center justify-between px-4 h-16 bg-surface border-b border-border-subtle shrink-0">
          <div>
            <h1 className="font-bold text-primary">Residencial das Águas</h1>
            <p className="text-xs text-content-muted">Ap 102</p>
          </div>
          <button 
            onClick={() => onNavigate('perfil')}
            className="p-2 -mr-2 text-content-muted hover:text-content focus:outline-none focus:ring-[3px] focus:ring-primary/30 rounded-lg"
            aria-label="Meu Perfil"
          >
            <UserIcon size={24} />
          </button>
        </header>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto pb-20 lg:pb-0 scroll-smooth">
          <div className="max-w-4xl mx-auto p-4 lg:p-8">
            {children}
          </div>
        </div>

        {/* Mobile Bottom Navigation */}
        <nav className="lg:hidden absolute bottom-0 left-0 right-0 bg-surface border-t border-border-subtle flex justify-around items-center h-[68px] px-2 pb-safe shrink-0 z-40">
          {NAV_MOBILE.slice(0, 4).map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id || (item.id === 'inicio' && currentView === 'dashboard' as string);
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id as ViewState)}
                className={cn(
                  "flex flex-col items-center justify-center min-w-[64px] min-h-[44px] space-y-1 transition-colors",
                  isActive ? "text-primary" : "text-content-muted"
                )}
              >
                <Icon size={24} className={isActive ? "stroke-[2.5]" : "stroke-[1.5]"} />
                <span className="text-[10px] font-medium">{item.label}</span>
              </button>
            );
          })}
          <button
             onClick={() => setMobileMenuOpen(true)}
             className={cn(
               "flex flex-col items-center justify-center min-w-[64px] min-h-[44px] space-y-1 transition-colors text-content-muted",
               !NAV_MOBILE.slice(0, 4).find(i => i.id === currentView) && (currentView !== 'dashboard' as string) && currentView !== 'login' ? "text-primary" : ""
             )}
          >
            <Menu size={24} className="stroke-[1.5]" />
            <span className="text-[10px] font-medium">Mais</span>
          </button>
        </nav>

        {/* Mobile Side Menu Overlay */}
        {mobileMenuOpen && (
          <div className="lg:hidden fixed inset-0 z-50 flex justify-end">
            <div 
              className="absolute inset-0 bg-content/20 backdrop-blur-sm transition-opacity" 
              onClick={() => setMobileMenuOpen(false)}
            />
            <div className="relative w-4/5 max-w-sm bg-surface h-full shadow-xl flex flex-col animate-in slide-in-from-right">
              <div className="p-4 border-b border-border-subtle flex items-center justify-between">
                <h2 className="font-semibold text-lg">Menu</h2>
                <button onClick={() => setMobileMenuOpen(false)} className="p-2 text-content-muted">
                  <X size={20} />
                </button>
              </div>
              <div className="p-4 flex-1 overflow-y-auto space-y-4">
                 <div className="space-y-1">
                    <p className="px-3 text-xs font-semibold text-content-muted uppercase tracking-wider mb-2">Geral</p>
                    <button
                        onClick={() => {
                          onNavigate('inicio');
                          setMobileMenuOpen(false);
                        }}
                        className="w-full flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium text-content hover:bg-surface-subtle"
                      >
                        <Home size={20} className="text-content-muted" />
                        Início
                      </button>
                 </div>
                 
                 {NAV_GROUPS.map((group) => (
                    <div key={group.title} className="space-y-1 mt-4">
                      <p className="px-3 text-xs font-semibold text-content-muted uppercase tracking-wider mb-2">{group.title}</p>
                      {group.items.map((item) => (
                        <button
                          key={item.id}
                          onClick={() => {
                            onNavigate(item.id as ViewState);
                            setMobileMenuOpen(false);
                          }}
                          className="w-full flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium text-content hover:bg-surface-subtle"
                        >
                          <item.icon size={20} className="text-content-muted" />
                          {item.label}
                        </button>
                      ))}
                    </div>
                 ))}
                 
                 <div className="border-t border-border-subtle pt-4 space-y-1 mt-4">
                    <button
                      onClick={() => {
                        onNavigate('login');
                        setMobileMenuOpen(false);
                      }}
                      className="w-full flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium text-danger hover:bg-danger-bg"
                    >
                      Sair da conta
                    </button>
                 </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
