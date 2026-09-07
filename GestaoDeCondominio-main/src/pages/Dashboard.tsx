import { motion } from 'motion/react';
import { Card, Badge, Button } from '../components/ui';
import { AlertCircle, QrCode, ArrowRight, Package, ChevronRight } from 'lucide-react';
import { ViewState } from '../types';

export function DashboardView({ onNavigate }: { onNavigate: (v: ViewState) => void }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <header className="mb-6 hidden lg:block">
        <h2 className="text-2xl font-bold">Olá, João</h2>
        <p className="text-content-muted">Acompanhe as novidades do seu condomínio</p>
      </header>

      {/* Alertas Importantes - Mural de Avisos */}
      <Card className="border-info/30 bg-info-bg cursor-pointer hover:border-info transition-colors" onClick={() => onNavigate('avisos')}>
        <div className="p-4 flex gap-4 items-start">
          <AlertCircle className="text-info shrink-0 mt-0.5" size={20} />
          <div>
            <h3 className="font-semibold text-info">Nova ata de reunião disponível</h3>
            <p className="text-sm text-info/80 mt-1">
              A ata da assembleia ordinária já está publicada no mural de avisos.
            </p>
          </div>
        </div>
      </Card>

      {/* Financeiro Resumo */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-content">Sua Taxa Condominial</h3>
          <button onClick={() => onNavigate('financeiro')} className="text-sm font-medium text-primary hover:underline flex items-center">
            Ver todas <ArrowRight size={16} className="ml-1" />
          </button>
        </div>
        <Card>
          <div className="p-5">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-sm text-content-muted font-medium">Vencimento em 10/11</p>
                <p className="text-3xl font-bold mt-1">R$ 540,00</p>
              </div>
              <Badge status="A vencer" />
            </div>
            <div className="flex gap-3">
              <Button fullWidth className="gap-2">
                <QrCode size={18} /> Copiar Pix
              </Button>
              <Button variant="outline" className="px-4">
                Baixar boleto
              </Button>
            </div>
          </div>
        </Card>
      </section>

      {/* Assembleia e Pesquisas */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h3 className="font-semibold text-content mb-3">Próxima Assembleia</h3>
          <Card className="hover:border-primary cursor-pointer transition-colors" onClick={() => onNavigate('assembleias')}>
            <div className="p-4 flex items-center justify-between">
              <div>
                <p className="font-semibold">Votação: Pintura da Fachada</p>
                <p className="text-sm text-content-muted">Encerra hoje às 18:00</p>
              </div>
              <ChevronRight className="text-content-muted" size={20} />
            </div>
          </Card>
        </div>
        <div>
          <h3 className="font-semibold text-content mb-3">Pesquisas</h3>
          <Card className="hover:border-primary cursor-pointer transition-colors" onClick={() => onNavigate('pesquisas')}>
            <div className="p-4 flex items-center justify-between">
              <div>
                <p className="font-semibold">Melhoria no playground</p>
                <p className="text-sm text-content-muted">Deixe sua opinião</p>
              </div>
              <ChevronRight className="text-content-muted" size={20} />
            </div>
          </Card>
        </div>
      </section>

    </motion.div>
  );
}

