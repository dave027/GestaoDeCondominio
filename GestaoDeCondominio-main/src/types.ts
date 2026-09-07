export type ViewState = 'login' | 'inicio' | 'avisos' | 'pesquisas' | 'classificados' | 'financeiro' | 'assembleias' | 'documentos' | 'fornecedores' | 'moradores' | 'acessos' | 'perfil';

export interface User {
  id: string;
  name: string;
  role: 'morador' | 'sindico' | 'administradora' | 'portaria';
  condominioId: string;
  condominioName: string;
  unidade: string;
}

export interface Bill {
  id: string;
  title: string;
  amount: number;
  dueDate: string;
  status: 'paid' | 'pending' | 'overdue';
  barcode: string;
  pixCode: string;
}

export interface Notice {
  id: string;
  title: string;
  content: string;
  date: string;
  isUrgent: boolean;
  author: string;
}
