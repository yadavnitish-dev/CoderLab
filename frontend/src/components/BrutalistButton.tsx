import React from 'react';
import { Link } from 'react-router-dom';
import { LucideIcon } from 'lucide-react';

interface BrutalistButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  to?: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'danger';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  disabled?: boolean;
  isLoading?: boolean;
  icon?: LucideIcon;
  type?: 'button' | 'submit';
}

const BrutalistButton: React.FC<BrutalistButtonProps> = ({
  children,
  onClick,
  to,
  variant = 'primary',
  size = 'md',
  className = '',
  disabled = false,
  isLoading = false,
  icon: Icon,
  type = 'button',
}) => {
  const baseStyles = "relative inline-flex items-center justify-center gap-2 rounded-none font-mono font-bold uppercase tracking-[0.2em] transition-none disabled:opacity-50 disabled:pointer-events-none active:translate-y-[2px] active:border-b-0 border-b-[3px] focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-black";
  
  const sizeStyles = {
    sm: "px-4 py-1.5 text-[10px]",
    md: "px-6 py-2.5 text-[10px]",
    lg: "px-8 py-3.5 text-xs",
    xl: "px-12 py-4 text-sm",
  };

  const variantStyles = {
    primary: "bg-white border-zinc-400 text-black hover:bg-zinc-200",
    secondary: "bg-zinc-900 border-black text-white hover:bg-zinc-800",
    outline: "bg-black border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-600",
    danger: "bg-rose-950 border-black text-rose-400 hover:bg-rose-900 hover:text-white",
  };

  const content = (
    <div className="relative z-10 flex items-center gap-2">
      {isLoading ? <span className="animate-blink font-mono font-bold text-emerald-500">_</span> : Icon && <Icon className="size-4" />}
      {children}
    </div>
  );

  const fullClassName = `${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`;

  if (to) {
    return (
      <Link to={to} className={fullClassName}>
        {content}
      </Link>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || isLoading}
      className={fullClassName}
    >
      {content}
    </button>
  );
};

export default BrutalistButton;
