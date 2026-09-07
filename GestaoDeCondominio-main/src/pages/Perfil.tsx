import { motion } from 'motion/react';
import { Card, Button } from '../components/ui';
import { User, Mail, Phone, Home, Building2, Key, Shield } from 'lucide-react';

export function PerfilView() {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <header>
        <h2 className="text-2xl font-bold flex items-center gap-2 text-content">
          <User className="text-primary" size={24} /> Meu Perfil
        </h2>
        <p className="text-content-muted mt-1">Seus dados cadastrais e preferências de notificação</p>
      </header>

      <Card>
        <div className="p-6 space-y-6">
          {/* Avatar e Identificação */}
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-primary/10 text-primary text-xl font-bold flex items-center justify-center border-2 border-primary/20">
              CS
            </div>
            <div>
              <h3 className="text-lg font-bold text-content">Carlos Silva e Oliveira</h3>
              <p className="text-xs text-content-muted">Condomínio Residencial Parque das Flores</p>
              <span className="inline-flex items-center gap-1 mt-1 text-[11px] font-semibold px-2 py-0.5 rounded bg-primary/10 text-primary">
                <Shield size={12} /> Morador Proprietário / Síndico
              </span>
            </div>
          </div>

          {/* Dados Pessoais */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-border-subtle text-sm">
            <div>
              <label className="text-xs text-content-muted font-medium block mb-1">E-mail de Acesso</label>
              <div className="flex items-center gap-2 p-2.5 bg-surface-subtle border border-border-subtle rounded-lg text-content">
                <Mail size={16} className="text-content-muted" />
                <span>carlos.silva@email.com</span>
              </div>
            </div>

            <div>
              <label className="text-xs text-content-muted font-medium block mb-1">Telefone / WhatsApp</label>
              <div className="flex items-center gap-2 p-2.5 bg-surface-subtle border border-border-subtle rounded-lg text-content">
                <Phone size={16} className="text-content-muted" />
                <span>(11) 98765-4321</span>
              </div>
            </div>

            <div>
              <label className="text-xs text-content-muted font-medium block mb-1">Unidade Principal</label>
              <div className="flex items-center gap-2 p-2.5 bg-surface-subtle border border-border-subtle rounded-lg text-content">
                <Home size={16} className="text-content-muted" />
                <span>Bloco A - Apartamento 102</span>
              </div>
            </div>

            <div>
              <label className="text-xs text-content-muted font-medium block mb-1">Vagas de Garagem</label>
              <div className="flex items-center gap-2 p-2.5 bg-surface-subtle border border-border-subtle rounded-lg text-content">
                <Building2 size={16} className="text-content-muted" />
                <span>Vagas 14 e 15 (Subsolo 1)</span>
              </div>
            </div>
          </div>

          {/* Ações */}
          <div className="pt-4 border-t border-border-subtle flex flex-wrap gap-3">
            <Button size="sm">Editar dados</Button>
            <Button variant="outline" size="sm" className="gap-1.5">
              <Key size={14} /> Alterar senha
            </Button>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
