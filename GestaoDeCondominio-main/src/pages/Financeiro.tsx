import { motion } from 'motion/react';
import { Card, Badge, Button } from '../components/ui';
import { Modal } from '../components/Modal';
import { useToast } from '../components/Toast';
import { Copy, Download, FileText, CheckCircle2, TrendingUp, TrendingDown, DollarSign, Plus, Eye } from 'lucide-react';
import { Bill } from '../types';
import { useState } from 'react';

interface Balancete {
  id: string;
  competencia: string;
  receitas: number;
  despesas: number;
  saldo: number;
  inadimplencia: string;
  statusAprovacao: 'Aprovado pelo Conselho' | 'Em Análise';
  dataPublicacao: string;
}

const MOCK_BILLS: Bill[] = [
  {
    id: '1',
    title: 'Taxa Condominial - Novembro',
    amount: 540.00,
    dueDate: '2023-11-10',
    status: 'pending',
    barcode: '34191.09008 61718.151740 60057.440003 1 95310000054000',
    pixCode: '00020101021126580014br.gov.bcb.pix2536gestao-condominio-chavelocal5204000053039865405540.005802BR5925Condominio Parque Flores6009Sao Paulo62070503***6304E8A2'
  },
  {
    id: '2',
    title: 'Taxa Condominial - Outubro',
    amount: 540.00,
    dueDate: '2023-10-10',
    status: 'paid',
    barcode: '34191.09008 61718.151740 60057.440003 1 95310000054000',
    pixCode: ''
  },
  {
    id: '3',
    title: 'Taxa Condominial - Setembro',
    amount: 540.00,
    dueDate: '2023-09-10',
    status: 'paid',
    barcode: '34191.09008 61718.151740 60057.440003 1 95310000054000',
    pixCode: ''
  }
];

const MOCK_BALANCETES: Balancete[] = [
  {
    id: 'b1',
    competencia: 'Outubro / 2023',
    receitas: 42800.00,
    despesas: 38450.00,
    saldo: 4350.00,
    inadimplencia: '3.8%',
    statusAprovacao: 'Aprovado pelo Conselho',
    dataPublicacao: '05/11/2023'
  },
  {
    id: 'b2',
    competencia: 'Setembro / 2023',
    receitas: 41900.00,
    despesas: 39100.00,
    saldo: 2800.00,
    inadimplencia: '4.2%',
    statusAprovacao: 'Aprovado pelo Conselho',
    dataPublicacao: '06/10/2023'
  }
];

export function FinanceiroView() {
  const [activeTab, setActiveTab] = useState<'minhas_taxas' | 'transparencia'>('minhas_taxas');
  const [bills, setBills] = useState<Bill[]>(MOCK_BILLS);
  const [balancetes, setBalancetes] = useState<Balancete[]>(MOCK_BALANCETES);
  const [receiptBill, setReceiptBill] = useState<Bill | null>(null);
  const [boletoBill, setBoletoBill] = useState<Bill | null>(null);
  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);
  const { showToast } = useToast();

  // Simulação de permissão: Síndico / Administradora
  const userRole: 'sindico' | 'administradora' | 'morador' = 'sindico';

  // Form State para Balancete
  const [newBalancete, setNewBalancete] = useState({
    competencia: '',
    receitas: '',
    despesas: '',
    inadimplencia: '3.5%'
  });

  const handleCopyPix = (pixCode: string) => {
    navigator.clipboard.writeText(pixCode);
    showToast('Código Pix Copia-e-Cola copiado com sucesso!', 'success');
  };

  const handleCopyBarcode = (barcode: string) => {
    navigator.clipboard.writeText(barcode);
    showToast('Linha digitável do boleto copiada!', 'success');
  };

  const handlePublishBalancete = (e: React.FormEvent) => {
    e.preventDefault();
    const receitas = Number(newBalancete.receitas) || 0;
    const despesas = Number(newBalancete.despesas) || 0;

    const item: Balancete = {
      id: Date.now().toString(),
      competencia: newBalancete.competencia,
      receitas,
      despesas,
      saldo: receitas - despesas,
      inadimplencia: newBalancete.inadimplencia,
      statusAprovacao: 'Aprovado pelo Conselho',
      dataPublicacao: new Date().toLocaleDateString('pt-BR')
    };

    setBalancetes([item, ...balancetes]);
    setIsPublishModalOpen(false);
    setNewBalancete({ competencia: '', receitas: '', despesas: '', inadimplencia: '3.5%' });
    showToast('Balancete e prestação de contas publicados com sucesso!', 'success');
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">Financeiro e Cobrança</h2>
          <p className="text-content-muted mt-1">Cobranças da unidade e transparência das contas do condomínio</p>
        </div>

        {activeTab === 'transparencia' && (userRole === 'sindico' || userRole === 'administradora') && (
          <Button size="sm" onClick={() => setIsPublishModalOpen(true)} className="gap-1.5 self-start sm:self-auto">
            <Plus size={16} /> Publicar balancete
          </Button>
        )}
      </header>

      {/* Navegação entre Cobranças e Transparência */}
      <div className="flex gap-2 border-b border-border-subtle pb-3">
        <button
          onClick={() => setActiveTab('minhas_taxas')}
          className={`px-4 py-2 text-sm font-semibold rounded-lg transition-colors ${
            activeTab === 'minhas_taxas'
              ? 'bg-primary text-white'
              : 'bg-surface-subtle text-content-muted hover:text-content'
          }`}
        >
          Minhas Cobranças
        </button>
        <button
          onClick={() => setActiveTab('transparencia')}
          className={`px-4 py-2 text-sm font-semibold rounded-lg transition-colors ${
            activeTab === 'transparencia'
              ? 'bg-primary text-white'
              : 'bg-surface-subtle text-content-muted hover:text-content'
          }`}
        >
          Transparência & Balancetes
        </button>
      </div>

      {/* ABA 1: MINHAS TAXAS E COBRANÇAS */}
      {activeTab === 'minhas_taxas' && (
        <div className="space-y-4">
          {bills.map(bill => (
            <Card key={bill.id} className={bill.status === 'pending' ? 'border-primary/30 ring-1 ring-primary/10' : ''}>
              <div className="p-5">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-semibold text-content">{bill.title}</h3>
                    <p className="text-sm text-content-muted mt-0.5">Vencimento: {new Date(bill.dueDate).toLocaleDateString('pt-BR')}</p>
                  </div>
                  <Badge status={bill.status === 'paid' ? 'Pago' : bill.status === 'pending' ? 'A vencer' : 'Vencido'} />
                </div>
                
                <div className="flex items-center justify-between mb-4">
                  <span className="text-2xl font-bold text-content">
                    R$ {bill.amount.toFixed(2).replace('.', ',')}
                  </span>
                </div>

                {bill.status === 'pending' && (
                  <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-border-subtle mt-4">
                    <Button fullWidth className="gap-2" onClick={() => handleCopyPix(bill.pixCode)}>
                      <Copy size={16} /> Copiar Pix
                    </Button>
                    <Button variant="outline" fullWidth className="gap-2" onClick={() => setBoletoBill(bill)}>
                      <FileText size={16} /> Ver boleto e linha digitável
                    </Button>
                  </div>
                )}
                
                {bill.status === 'paid' && (
                  <div className="flex justify-end pt-3 border-t border-border-subtle">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => setReceiptBill(bill)} 
                      className="gap-2 text-primary"
                    >
                      <Download size={16} /> Ver Recibo / Comprovante
                    </Button>
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* ABA 2: TRANSPARÊNCIA CONDOMINIAL E PRESTAÇÃO DE CONTAS */}
      {activeTab === 'transparencia' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card>
              <div className="p-4 space-y-1">
                <span className="text-xs text-content-muted font-medium flex items-center gap-1">
                  <TrendingUp size={14} className="text-success" /> Receitas Arrecadadas (Último mês)
                </span>
                <p className="text-xl font-bold text-content">R$ 42.800,00</p>
              </div>
            </Card>
            <Card>
              <div className="p-4 space-y-1">
                <span className="text-xs text-content-muted font-medium flex items-center gap-1">
                  <TrendingDown size={14} className="text-danger" /> Despesas Operacionais
                </span>
                <p className="text-xl font-bold text-content">R$ 38.450,00</p>
              </div>
            </Card>
            <Card>
              <div className="p-4 space-y-1">
                <span className="text-xs text-content-muted font-medium flex items-center gap-1">
                  <DollarSign size={14} className="text-primary" /> Índice de Inadimplência
                </span>
                <p className="text-xl font-bold text-primary">3.8%</p>
              </div>
            </Card>
          </div>

          <div className="space-y-3">
            <h3 className="font-bold text-content text-base">Demonstrativos Mensais Publicados</h3>
            {balancetes.map(bal => (
              <Card key={bal.id}>
                <div className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-content">{bal.competencia}</h4>
                      <span className="text-xs px-2 py-0.5 rounded bg-success-bg text-success font-medium">
                        {bal.statusAprovacao}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-content-muted flex-wrap">
                      <span>Receitas: R$ {bal.receitas.toLocaleString('pt-BR')}</span>
                      <span>Despesas: R$ {bal.despesas.toLocaleString('pt-BR')}</span>
                      <span className="font-bold text-content">Saldo: +R$ {bal.saldo.toLocaleString('pt-BR')}</span>
                      <span>Publicado em: {bal.dataPublicacao}</span>
                    </div>
                  </div>

                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => showToast(`Baixando balancete contábil de ${bal.competencia}...`, 'info')}
                    className="gap-1 text-xs self-end sm:self-auto"
                  >
                    <Download size={14} /> Baixar balancete (PDF)
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Modal de Boleto / Linha Digitável */}
      <Modal
        isOpen={Boolean(boletoBill)}
        onClose={() => setBoletoBill(null)}
        title="Boleto Bancário"
        description="Pague pelo aplicativo do seu banco com o código de barras ou Pix."
      >
        {boletoBill && (
          <div className="space-y-4">
            <div className="p-4 bg-surface-subtle rounded-lg border border-border-subtle space-y-2 text-center">
              <span className="text-xs text-content-muted">Valor a pagar:</span>
              <p className="text-3xl font-bold text-content">R$ {boletoBill.amount.toFixed(2).replace('.', ',')}</p>
              <p className="text-xs text-content-muted">Vencimento em {new Date(boletoBill.dueDate).toLocaleDateString('pt-BR')}</p>
            </div>

            <div>
              <label className="text-xs text-content-muted font-medium block mb-1">Linha Digitável:</label>
              <div className="flex items-center justify-between p-2.5 bg-surface border border-border-subtle rounded-lg">
                <span className="font-mono text-xs font-semibold text-content break-all">{boletoBill.barcode}</span>
                <Button size="sm" variant="ghost" onClick={() => handleCopyBarcode(boletoBill.barcode)} className="gap-1 text-xs shrink-0 ml-2">
                  <Copy size={13} /> Copiar
                </Button>
              </div>
            </div>

            <div className="pt-2 flex flex-col gap-2">
              <Button fullWidth onClick={() => handleCopyPix(boletoBill.pixCode)} className="gap-2">
                <Copy size={16} /> Copiar chave Pix
              </Button>
              <Button variant="outline" fullWidth onClick={() => showToast('Iniciando download do boleto bancário (PDF)...', 'info')}>
                <Download size={16} /> Baixar boleto em PDF
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Modal de Recibo / Comprovante */}
      <Modal
        isOpen={Boolean(receiptBill)}
        onClose={() => setReceiptBill(null)}
        title="Comprovante de Quitação"
        description="Autenticação digital do condomínio."
      >
        {receiptBill && (
          <div className="space-y-4">
            <div className="p-4 bg-success-bg border border-success/30 rounded-lg flex items-center gap-3">
              <CheckCircle2 size={24} className="text-success shrink-0" />
              <div>
                <h4 className="font-bold text-success text-sm">Taxa liquidada com sucesso</h4>
                <p className="text-xs text-success/80">Pagamento registrado no sistema contábil do condomínio.</p>
              </div>
            </div>

            <div className="p-4 bg-surface-subtle border border-border-subtle rounded-lg space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-content-muted">Competência:</span>
                <span className="font-semibold text-content">{receiptBill.title}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-content-muted">Valor pago:</span>
                <span className="font-semibold text-content">R$ {receiptBill.amount.toFixed(2).replace('.', ',')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-content-muted">Autenticação eletrônica:</span>
                <span className="font-mono text-content">AUT-{Date.now()}-CXB992</span>
              </div>
            </div>

            <Button fullWidth variant="outline" onClick={() => showToast('Comprovante exportado com sucesso!', 'success')}>
              <Download size={16} className="mr-1.5" /> Baixar via impressa
            </Button>
          </div>
        )}
      </Modal>

      {/* Modal de Publicação de Balancete (Síndico/Admin) */}
      <Modal
        isOpen={isPublishModalOpen}
        onClose={() => setIsPublishModalOpen(false)}
        title="Publicar Prestação de Contas / Balancete"
        description="Disponibilize os números e a contabilidade para todos os moradores."
      >
        <form onSubmit={handlePublishBalancete} className="space-y-4">
          <div>
            <label className="text-xs font-medium text-content block mb-1">Mês / Ano de Referência *</label>
            <input
              type="text"
              required
              placeholder="Ex: Novembro / 2023"
              value={newBalancete.competencia}
              onChange={e => setNewBalancete({ ...newBalancete, competencia: e.target.value })}
              className="w-full px-3 py-2 text-sm bg-surface border border-border-subtle rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 text-content"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-content block mb-1">Receitas Totais (R$) *</label>
              <input
                type="number"
                required
                placeholder="40000"
                value={newBalancete.receitas}
                onChange={e => setNewBalancete({ ...newBalancete, receitas: e.target.value })}
                className="w-full px-3 py-2 text-sm bg-surface border border-border-subtle rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 text-content"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-content block mb-1">Despesas Totais (R$) *</label>
              <input
                type="number"
                required
                placeholder="35000"
                value={newBalancete.despesas}
                onChange={e => setNewBalancete({ ...newBalancete, despesas: e.target.value })}
                className="w-full px-3 py-2 text-sm bg-surface border border-border-subtle rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 text-content"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-content block mb-1">Taxa de Inadimplência do Mês</label>
            <input
              type="text"
              value={newBalancete.inadimplencia}
              onChange={e => setNewBalancete({ ...newBalancete, inadimplencia: e.target.value })}
              className="w-full px-3 py-2 text-sm bg-surface border border-border-subtle rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 text-content"
            />
          </div>

          <div className="pt-3 border-t border-border-subtle flex justify-end gap-2">
            <Button type="button" variant="outline" size="sm" onClick={() => setIsPublishModalOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" size="sm">
              Publicar balancete
            </Button>
          </div>
        </form>
      </Modal>
    </motion.div>
  );
}
