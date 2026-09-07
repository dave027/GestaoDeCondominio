import { motion } from 'motion/react';
import { Card, Button } from '../components/ui';
import { Modal } from '../components/Modal';
import { useToast } from '../components/Toast';
import { User, Mail, Phone, Home, Building2, Key, Shield } from 'lucide-react';
import { useState } from 'react';

export function PerfilView() {
  const { showToast } = useToast();
  const [isEditDataOpen, setIsEditDataOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

  const [userData, setUserData] = useState({
    name: 'Carlos Silva e Oliveira',
    condo: 'Condomínio Residencial Parque das Flores',
    email: 'carlos.silva@email.com',
    phone: '(11) 98765-4321',
    unit: 'Bloco A - Apartamento 102',
    vagas: 'Vagas 14 e 15 (Subsolo 1)'
  });

  const [editForm, setEditForm] = useState({ ...userData });
  const [passwordForm, setPasswordForm] = useState({ current: '', next: '', confirm: '' });

  const handleSaveData = (e: React.FormEvent) => {
    e.preventDefault();
    setUserData({ ...editForm });
    setIsEditDataOpen(false);
    showToast('Dados cadastrais atualizados com sucesso!', 'success');
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordForm.next !== passwordForm.confirm) {
      showToast('A nova senha e a confirmação não conferem', 'error');
      return;
    }
    setIsPasswordModalOpen(false);
    setPasswordForm({ current: '', next: '', confirm: '' });
    showToast('Senha de acesso alterada com sucesso!', 'success');
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <header>
        <h2 className="text-2xl font-bold flex items-center gap-2 text-content">
          <User className="text-primary" size={24} /> Meu Perfil
        </h2>
        <p className="text-content-muted mt-1">Seus dados cadastrais e preferências de segurança</p>
      </header>

      <Card>
        <div className="p-6 space-y-6">
          {/* Avatar e Identificação */}
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-primary/10 text-primary text-xl font-bold flex items-center justify-center border-2 border-primary/20">
              CS
            </div>
            <div>
              <h3 className="text-lg font-bold text-content">{userData.name}</h3>
              <p className="text-xs text-content-muted">{userData.condo}</p>
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
                <span>{userData.email}</span>
              </div>
            </div>

            <div>
              <label className="text-xs text-content-muted font-medium block mb-1">Telefone / WhatsApp</label>
              <div className="flex items-center gap-2 p-2.5 bg-surface-subtle border border-border-subtle rounded-lg text-content">
                <Phone size={16} className="text-content-muted" />
                <span>{userData.phone}</span>
              </div>
            </div>

            <div>
              <label className="text-xs text-content-muted font-medium block mb-1">Unidade Principal</label>
              <div className="flex items-center gap-2 p-2.5 bg-surface-subtle border border-border-subtle rounded-lg text-content">
                <Home size={16} className="text-content-muted" />
                <span>{userData.unit}</span>
              </div>
            </div>

            <div>
              <label className="text-xs text-content-muted font-medium block mb-1">Vagas de Garagem</label>
              <div className="flex items-center gap-2 p-2.5 bg-surface-subtle border border-border-subtle rounded-lg text-content">
                <Building2 size={16} className="text-content-muted" />
                <span>{userData.vagas}</span>
              </div>
            </div>
          </div>

          {/* Ações */}
          <div className="pt-4 border-t border-border-subtle flex flex-wrap gap-3">
            <Button size="sm" onClick={() => {
              setEditForm({ ...userData });
              setIsEditDataOpen(true);
            }}>
              Editar dados
            </Button>
            <Button variant="outline" size="sm" onClick={() => setIsPasswordModalOpen(true)} className="gap-1.5">
              <Key size={14} /> Alterar senha
            </Button>
          </div>
        </div>
      </Card>

      {/* Modal de Edição de Dados */}
      <Modal
        isOpen={isEditDataOpen}
        onClose={() => setIsEditDataOpen(false)}
        title="Editar Dados de Contato"
        description="Mantenha seus telefones e e-mails sempre atualizados."
      >
        <form onSubmit={handleSaveData} className="space-y-4">
          <div>
            <label className="text-xs font-medium text-content block mb-1">Nome completo</label>
            <input
              type="text"
              required
              value={editForm.name}
              onChange={e => setEditForm({ ...editForm, name: e.target.value })}
              className="w-full px-3 py-2 text-sm bg-surface border border-border-subtle rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 text-content"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-content block mb-1">E-mail</label>
            <input
              type="email"
              required
              value={editForm.email}
              onChange={e => setEditForm({ ...editForm, email: e.target.value })}
              className="w-full px-3 py-2 text-sm bg-surface border border-border-subtle rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 text-content"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-content block mb-1">Telefone / WhatsApp</label>
            <input
              type="text"
              required
              value={editForm.phone}
              onChange={e => setEditForm({ ...editForm, phone: e.target.value })}
              className="w-full px-3 py-2 text-sm bg-surface border border-border-subtle rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 text-content"
            />
          </div>

          <div className="pt-3 border-t border-border-subtle flex justify-end gap-2">
            <Button type="button" variant="outline" size="sm" onClick={() => setIsEditDataOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" size="sm">
              Salvar dados
            </Button>
          </div>
        </form>
      </Modal>

      {/* Modal Alterar Senha */}
      <Modal
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
        title="Alterar Senha de Acesso"
        description="Escolha uma senha forte com letras e números."
      >
        <form onSubmit={handleChangePassword} className="space-y-4">
          <div>
            <label className="text-xs font-medium text-content block mb-1">Senha atual</label>
            <input
              type="password"
              required
              value={passwordForm.current}
              onChange={e => setPasswordForm({ ...passwordForm, current: e.target.value })}
              className="w-full px-3 py-2 text-sm bg-surface border border-border-subtle rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 text-content"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-content block mb-1">Nova senha</label>
            <input
              type="password"
              required
              value={passwordForm.next}
              onChange={e => setPasswordForm({ ...passwordForm, next: e.target.value })}
              className="w-full px-3 py-2 text-sm bg-surface border border-border-subtle rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 text-content"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-content block mb-1">Confirmar nova senha</label>
            <input
              type="password"
              required
              value={passwordForm.confirm}
              onChange={e => setPasswordForm({ ...passwordForm, confirm: e.target.value })}
              className="w-full px-3 py-2 text-sm bg-surface border border-border-subtle rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 text-content"
            />
          </div>

          <div className="pt-3 border-t border-border-subtle flex justify-end gap-2">
            <Button type="button" variant="outline" size="sm" onClick={() => setIsPasswordModalOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" size="sm">
              Atualizar senha
            </Button>
          </div>
        </form>
      </Modal>
    </motion.div>
  );
}
