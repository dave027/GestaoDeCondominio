import { useState } from 'react';
import { ViewState } from './types';
import { AppLayout } from './components/layout';
import { ToastProvider } from './components/Toast';
import { LoginView } from './pages/Login';
import { DashboardView } from './pages/Dashboard';
import { FinanceiroView } from './pages/Financeiro';
import { AvisosView } from './pages/Avisos';
import { PesquisasView } from './pages/Pesquisas';
import { ClassificadosView } from './pages/Classificados';
import { AssembleiasView } from './pages/Assembleias';
import { DocumentosView } from './pages/Documentos';
import { FornecedoresView } from './pages/Fornecedores';
import { MoradoresView } from './pages/Moradores';
import { AcessosView } from './pages/Acessos';
import { PerfilView } from './pages/Perfil';
import { EmptyState } from './components/ui';

// Módulos desativados explicitamente no MVP
const DEACTIVATED_MODULES = ['reservas', 'chamados', 'portaria', 'encomendas', 'autorizacoes', 'operacional'];

export default function App() {
  const [currentView, setCurrentView] = useState<ViewState | string>('inicio');

  // Simple state router
  if (currentView === 'login') {
    return <LoginView onNavigate={(v) => setCurrentView(v as string)} />;
  }

  return (
    <ToastProvider>
      <AppLayout currentView={currentView as ViewState} onNavigate={(v) => setCurrentView(v as string)}>
        {(currentView === 'inicio' || currentView === 'dashboard') && <DashboardView onNavigate={(v) => setCurrentView(v as string)} />}
        {currentView === 'financeiro' && <FinanceiroView />}
        {currentView === 'avisos' && <AvisosView />}
        {currentView === 'pesquisas' && <PesquisasView />}
        {currentView === 'classificados' && <ClassificadosView />}
        {currentView === 'assembleias' && <AssembleiasView />}
        {currentView === 'documentos' && <DocumentosView />}
        {currentView === 'fornecedores' && <FornecedoresView />}
        {currentView === 'moradores' && <MoradoresView />}
        {currentView === 'acessos' && <AcessosView />}
        {currentView === 'perfil' && <PerfilView />}

        {/* Fallback para módulos desativados (indisponíveis) */}
        {DEACTIVATED_MODULES.includes(currentView) && (
          <div className="pt-10">
            <EmptyState 
              title="Módulo indisponível"
              description="Este recurso ainda não faz parte da versão atual do sistema."
              icon={<span className="text-2xl">🔒</span>}
              actionLabel="Voltar ao início"
              onAction={() => setCurrentView('inicio')}
            />
          </div>
        )}
      </AppLayout>
    </ToastProvider>
  );
}
