import React from 'react';
import { CheckCircle2, Clock, XCircle, AlertCircle, CalendarClock, ChevronRight, Inbox } from 'lucide-react';

export function cn(...classes: (string | undefined | null | false)[]) {
  return classes.filter(Boolean).join(' ');
}

// Button Component
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', fullWidth, isLoading, children, disabled, ...props }, ref) => {
    const baseStyles = 'inline-flex items-center justify-center font-medium rounded-lg transition-colors focus:outline-none focus:ring-[3px] focus:ring-info/35 disabled:opacity-50 disabled:cursor-not-allowed';
    
    const variants = {
      primary: 'bg-primary text-white hover:bg-primary/90',
      secondary: 'bg-secondary text-content hover:bg-secondary/90',
      outline: 'border border-border-subtle text-content hover:bg-surface-subtle',
      ghost: 'text-content-muted hover:text-content hover:bg-surface-subtle',
    };
    
    const sizes = {
      sm: 'text-sm px-3 py-1.5 min-h-[32px]',
      md: 'text-base px-4 py-2.5 min-h-[44px]',
      lg: 'text-lg px-6 py-3 min-h-[56px]',
    };
    
    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(
          baseStyles,
          variants[variant],
          sizes[size],
          fullWidth ? 'w-full' : '',
          className
        )}
        {...props}
      >
        {isLoading ? (
          <span className="mr-2 inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
        ) : null}
        {children}
      </button>
    );
  }
);
Button.displayName = 'Button';

// Card Component
export const Card = ({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('bg-surface rounded-[var(--radius-lg)] border border-border-subtle shadow-sm overflow-hidden', className)} {...props}>
    {children}
  </div>
);

// Badge / Status Badge Component
type StatusType = 'Pago' | 'A vencer' | 'Vencido' | 'Reservado' | 'Em andamento' | 'Resolvido' | 'Arquivado' | 'default';

export const Badge = ({ 
  className, 
  status = 'default',
  children 
}: React.HTMLAttributes<HTMLSpanElement> & { status?: StatusType }) => {
  
  const getStatusConfig = (s: StatusType) => {
    switch (s) {
      case 'Pago':
      case 'Resolvido':
        return { style: 'bg-success-bg text-success border-success/20', icon: <CheckCircle2 size={12} className="mr-1" /> };
      case 'A vencer':
      case 'Em andamento':
        return { style: 'bg-warning-bg text-warning border-warning/20', icon: <Clock size={12} className="mr-1" /> };
      case 'Vencido':
        return { style: 'bg-danger-bg text-danger border-danger/20', icon: <XCircle size={12} className="mr-1" /> };
      case 'Reservado':
        return { style: 'bg-info-bg text-info border-info/20', icon: <CalendarClock size={12} className="mr-1" /> };
      default:
        return { style: 'bg-surface-subtle text-content-muted border-border-subtle', icon: null };
    }
  };

  const config = getStatusConfig(status);

  return (
    <span className={cn('inline-flex items-center px-2 py-0.5 rounded-[var(--radius-sm)] border text-xs font-medium', config.style, className)}>
      {config.icon}
      {children || status}
    </span>
  );
};

// Empty State Component
interface EmptyStateProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  actionLabel?: string;
  onAction?: () => void;
}

export const EmptyState = ({ title, description, icon, actionLabel, onAction }: EmptyStateProps) => (
  <div className="flex flex-col items-center justify-center p-8 text-center bg-surface border border-dashed border-border-subtle rounded-[var(--radius-lg)]">
    <div className="w-12 h-12 flex items-center justify-center rounded-full bg-surface-subtle text-content-muted mb-4">
      {icon || <Inbox size={24} />}
    </div>
    <h3 className="text-base font-semibold text-content mb-1">{title}</h3>
    <p className="text-sm text-content-muted max-w-sm mb-4">{description}</p>
    {actionLabel && onAction && (
      <Button variant="outline" size="sm" onClick={onAction}>
        {actionLabel}
      </Button>
    )}
  </div>
);

// Skeleton Component
export const Skeleton = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('animate-pulse rounded-[var(--radius-sm)] bg-border-subtle/50', className)} {...props} />
);
