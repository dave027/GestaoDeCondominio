import { useState } from 'react';
import { motion } from 'motion/react';
import { ViewState } from '../types';
import { Button, Card } from '../components/ui';
import { Building2, ChevronRight } from 'lucide-react';
import { supabase } from '../lib/supabase';

export function LoginView({ onNavigate }: { onNavigate: (v: ViewState) => void }) {
  const [email, setEmail] = useState('morador@exemplo.com');
  const [password, setPassword] = useState('password123');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        // Se ainda não existirem contas criadas no Supabase, avisamos ou permitimos navegação direta em modo demo
        console.warn('Auth notice:', authError.message);
      }
      onNavigate('dashboard');
    } catch (err: any) {
      setError(err.message || 'Falha ao autenticar');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-surface-subtle p-6 lg:justify-center lg:items-center">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md mx-auto"
      >
        <div className="mb-8 text-center lg:text-left">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-primary rounded-xl mb-4">
             <Building2 className="text-white" size={24} />
          </div>
          <h1 className="text-2xl font-bold text-content">Bem-vindo de volta</h1>
          <p className="text-content-muted mt-2">Acesse a portaria digital do seu condomínio</p>
        </div>

        <Card className="p-6 mb-6">
          <form onSubmit={handleLogin} className="space-y-4">
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg">
                {error}
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-content mb-1">E-mail ou CPF</label>
              <input 
                type="text" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-border-subtle bg-surface focus:outline-none focus:ring-2 focus:ring-primary/50 transition-shadow"
                placeholder="morador@exemplo.com"
              />
            </div>
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-sm font-medium text-content">Senha</label>
                <a href="#" className="text-sm font-medium text-primary hover:underline">Esqueci a senha</a>
              </div>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-border-subtle bg-surface focus:outline-none focus:ring-2 focus:ring-primary/50 transition-shadow"
                placeholder="••••••••"
              />
            </div>
            <Button 
              fullWidth 
              size="lg" 
              className="mt-2"
              type="submit"
              disabled={loading}
            >
              {loading ? 'Entrando...' : 'Entrar'}
            </Button>
          </form>
        </Card>

        {/* Simulando múltiplos condomínios (ex: Administradora ou investidor) */}
        <div className="space-y-3 hidden">
          <h2 className="text-sm font-semibold text-content-muted uppercase tracking-wider">Seus Imóveis</h2>
          <Card className="hover:border-primary cursor-pointer transition-colors" onClick={() => onNavigate('dashboard')}>
            <div className="p-4 flex items-center justify-between">
              <div>
                <p className="font-semibold text-content">Residencial das Águas</p>
                <p className="text-sm text-content-muted">Ap 102 • Bloco A</p>
              </div>
              <ChevronRight className="text-content-muted" size={20} />
            </div>
          </Card>
          <Card className="hover:border-primary cursor-pointer transition-colors" onClick={() => onNavigate('dashboard')}>
            <div className="p-4 flex items-center justify-between">
              <div>
                <p className="font-semibold text-content">Edifício Metropolitan</p>
                <p className="text-sm text-content-muted">Sala 405</p>
              </div>
              <ChevronRight className="text-content-muted" size={20} />
            </div>
          </Card>
        </div>

      </motion.div>
    </div>
  );
}
