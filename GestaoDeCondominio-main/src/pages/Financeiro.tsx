import { motion } from 'motion/react';
import { Card, Badge, Button } from '../components/ui';
import { Copy, Download, FileText } from 'lucide-react';
import { Bill } from '../types';

const MOCK_BILLS: Bill[] = [
  {
    id: '1',
    title: 'Taxa Condominial - Novembro',
    amount: 540.00,
    dueDate: '2023-11-10',
    status: 'pending',
    barcode: '34191.09008 61718.151740 60057.440003 1 95310000054000',
    pixCode: '00020101021126580014br.gov.bcb.pix...'
  },
  {
    id: '2',
    title: 'Taxa Condominial - Outubro',
    amount: 540.00,
    dueDate: '2023-10-10',
    status: 'paid',
    barcode: '',
    pixCode: ''
  },
  {
    id: '3',
    title: 'Taxa Condominial - Setembro',
    amount: 540.00,
    dueDate: '2023-09-10',
    status: 'paid',
    barcode: '',
    pixCode: ''
  }
];

export function FinanceiroView() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <header className="mb-6">
        <h2 className="text-2xl font-bold">Financeiro</h2>
        <p className="text-content-muted mt-1">Gerencie suas taxas e pagamentos</p>
      </header>

      <div className="space-y-4">
        {MOCK_BILLS.map(bill => (
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
                <div className="flex gap-3 pt-4 border-t border-border-subtle mt-4">
                  <Button fullWidth className="gap-2">
                    <Copy size={16} /> Copiar Pix
                  </Button>
                  <Button variant="outline" className="gap-2">
                    <FileText size={16} /> Baixar boleto
                  </Button>
                </div>
              )}
              
              {bill.status === 'paid' && (
                <div className="flex justify-end pt-3">
                  <Button variant="ghost" size="sm" className="gap-2 text-primary">
                    <Download size={16} /> Recibo
                  </Button>
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>
    </motion.div>
  );
}
