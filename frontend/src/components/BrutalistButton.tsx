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
  const baseStyles = "group relative border border-transparent overflow-hidden rounded-sm font-bold uppercase tracking-widest transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2";
  
  const sizeStyles = {
    sm: "px-4 py-1.5 text-[10px]",
    md: "px-6 py-2.5 text-xs",
    lg: "px-8 py-4 text-sm",
    xl: "px-12 py-5 text-sm",
  };

  const variantStyles = {
    primary: "bg-white text-black hover:scale-[1.02]",
    secondary: "bg-zinc-900 border-zinc-800 text-white hover:border-zinc-700",
    outline: "bg-transparent border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-600",
    danger: "bg-rose-500/10 border-rose-500/20 text-rose-500 hover:bg-rose-500 hover:text-white hover:border-transparent",
  };

  const slideBgStyles = {
    primary: "bg-emerald-500",
    secondary: "bg-zinc-800",
    outline: "bg-zinc-900",
    danger: "bg-rose-600",
  };

  const content = (
    <>
      <div className="relative z-10 flex items-center gap-2">
        {isLoading ? <span className="animate-blink font-mono font-bold">_</span> : Icon && <Icon className="size-4" />}
        {children}
      </div>
      <div className={`absolute inset-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ${slideBgStyles[variant]}`}></div>
    </>
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
