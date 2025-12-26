/**
 * Enhanced Shadcn/UI components with luxury dark theme and glassmorphism effects
 * These components wrap Shadcn/UI with custom styling to match the Nuxt green theme
 */

import React from 'react';
import { Button as ShadcnButton, ButtonProps } from '@/components/ui/button';
import { Input as ShadcnInput, InputProps } from '@/components/ui/input';
import { Textarea as ShadcnTextarea, TextareaProps } from '@/components/ui/textarea';
import { Card as ShadcnCard } from '@/components/ui/card';
import { Badge as ShadcnBadge, BadgeProps } from '@/components/ui/badge';
import { Switch as ShadcnSwitch } from '@/components/ui/switch';
import { Progress as ShadcnProgress } from '@/components/ui/progress';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

// Enhanced Button with loading state and luxury styles
interface NeuralButtonProps extends Omit<ButtonProps, 'size'> {
  loading?: boolean;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
}

export const NeuralButton: React.FC<NeuralButtonProps> = ({ 
  children, 
  loading = false, 
  size = 'md',
  variant = 'default',
  className,
  disabled,
  ...props 
}) => {
  const sizeClasses = {
    xs: 'px-3 py-1.5 text-[8px] rounded-lg h-7',
    sm: 'px-4 py-2 text-[10px] rounded-xl h-8',
    md: 'px-6 py-3 text-[11px] rounded-2xl h-10',
    lg: 'px-8 py-4 text-[13px] rounded-3xl h-12',
    xl: 'px-10 py-5 text-[15px] rounded-[2rem] h-14'
  };

  const variantClasses = {
    default: 'bg-gradient-to-r from-[#00DC82] to-[#00C16A] text-black font-black uppercase tracking-widest shadow-[0_0_20px_rgba(0,220,130,0.3)] hover:shadow-[0_0_30px_#00DC82] transition-all duration-300',
    secondary: 'bg-white/5 text-white border border-white/10 hover:bg-white/10 font-black uppercase tracking-widest',
    outline: 'border-2 border-[#00DC82] text-[#00DC82] hover:bg-[#00DC82]/10 font-black uppercase tracking-widest',
    ghost: 'text-slate-400 hover:text-white hover:bg-white/5 font-black uppercase tracking-widest',
    destructive: 'bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500/20 font-black uppercase tracking-widest',
    link: ''
  };

  return (
    <ShadcnButton
      disabled={disabled || loading}
      className={cn(
        sizeClasses[size],
        variantClasses[variant],
        'active:scale-95',
        className
      )}
      {...props}
    >
      {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {children}
    </ShadcnButton>
  );
};

// Enhanced Input with label and luxury styling
interface NeuralInputProps extends InputProps {
  label?: string;
}

export const NeuralInput: React.FC<NeuralInputProps> = ({ 
  label, 
  className,
  ...props 
}) => (
  <div className="space-y-2 w-full">
    {label && (
      <Label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-2">
        {label}
      </Label>
    )}
    <ShadcnInput
      className={cn(
        'bg-black/40 border-[#1a1e43] rounded-2xl px-5 py-4 h-12',
        'text-sm text-white placeholder-slate-600',
        'focus:border-[#00DC82]/50 focus-visible:ring-[#00DC82]/50',
        className
      )}
      {...props}
    />
  </div>
);

// Enhanced Textarea with label and luxury styling
interface NeuralTextAreaProps extends TextareaProps {
  label?: string;
}

export const NeuralTextArea: React.FC<NeuralTextAreaProps> = ({ 
  label, 
  className,
  ...props 
}) => (
  <div className="space-y-2 w-full">
    {label && (
      <Label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-2">
        {label}
      </Label>
    )}
    <ShadcnTextarea
      className={cn(
        'bg-black/40 border-[#1a1e43] rounded-3xl px-6 py-5',
        'text-sm text-white placeholder-slate-600',
        'focus:border-[#00DC82]/50 focus-visible:ring-[#00DC82]/50',
        'resize-none custom-scrollbar',
        className
      )}
      {...props}
    />
  </div>
);

// GlassCard with glassmorphism effect
export const GlassCard: React.FC<{ 
  children: React.ReactNode; 
  className?: string; 
  hover?: boolean;
  onClick?: () => void;
  ariaLabel?: string;
}> = ({ children, className = '', hover = false, onClick, ariaLabel }) => (
  <ShadcnCard 
    onClick={onClick}
    aria-label={ariaLabel}
    className={cn(
      'bg-[#020420]/60 backdrop-blur-xl border-[#1a1e43] rounded-[2rem] p-6',
      hover && 'hover:border-[#00DC82]/30 hover:bg-[#00DC82]/5 transition-all duration-500',
      onClick && 'cursor-pointer active:scale-[0.98]',
      className
    )}
  >
    {children}
  </ShadcnCard>
);

// Enhanced Badge with pulse animation support
interface NeuralBadgeProps extends BadgeProps {
  pulse?: boolean;
  children: React.ReactNode;
}

export const NeuralBadge: React.FC<NeuralBadgeProps> = ({ 
  children, 
  variant = 'default', 
  pulse = false,
  className 
}) => {
  const variantClasses = {
    default: 'bg-[#00DC82]/10 text-[#00DC82] border-[#00DC82]/30',
    secondary: 'bg-white/5 text-slate-400 border-white/10',
    outline: 'border-current',
    destructive: 'bg-red-500/10 text-red-500 border-red-500/20'
  };

  return (
    <ShadcnBadge 
      variant={variant}
      className={cn(
        'inline-flex items-center gap-2 px-3 py-1 rounded-full',
        'text-[9px] font-black uppercase tracking-widest',
        variantClasses[variant],
        className
      )}
    >
      {pulse && (
        <span className="flex h-1.5 w-1.5 relative">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00DC82] opacity-75"></span>
          <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#00DC82]"></span>
        </span>
      )}
      {children}
    </ShadcnBadge>
  );
};

// Enhanced Switch with label
export const NeuralSwitch: React.FC<{
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  description?: string;
}> = ({ checked, onChange, label, description }) => (
  <div className="flex items-center justify-between gap-4 p-2">
    {(label || description) && (
      <div className="flex flex-col">
        {label && (
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
            {label}
          </span>
        )}
        {description && (
          <span className="text-[8px] text-slate-600 uppercase">
            {description}
          </span>
        )}
      </div>
    )}
    <ShadcnSwitch 
      checked={checked}
      onCheckedChange={onChange}
      className="data-[state=checked]:bg-[#00DC82] data-[state=unchecked]:bg-white/10"
    />
  </div>
);

// Spinner using lucide-react
export const NeuralSpinner: React.FC<{ 
  size?: 'xs' | 'sm' | 'md' | 'lg';
  className?: string;
}> = ({ size = 'md', className = '' }) => {
  const sizes = {
    xs: 'w-3 h-3',
    sm: 'w-6 h-6',
    md: 'w-10 h-10',
    lg: 'w-16 h-16'
  };
  
  return (
    <Loader2 className={cn(sizes[size], 'animate-spin text-[#00DC82]', className)} />
  );
};

// Enhanced Progress Bar
export const ProgressBar: React.FC<{ 
  progress: number; 
  className?: string;
}> = ({ progress, className = '' }) => (
  <ShadcnProgress 
    value={progress}
    className={cn(
      'w-full h-1.5 bg-white/5',
      '[&>div]:bg-gradient-to-r [&>div]:from-[#00DC82] [&>div]:to-[#00C16A]',
      '[&>div]:shadow-[0_0_12px_#00DC82]',
      className
    )}
  />
);

// SidebarItem remains the same
export const SidebarItem: React.FC<{
  icon: string;
  label: string;
  active: boolean;
  onClick: () => void;
  collapsed?: boolean;
}> = ({ icon, label, active, onClick, collapsed = false }) => (
  <button
    onClick={onClick}
    className={cn(
      'flex flex-col items-center justify-center transition-all duration-300 relative',
      collapsed ? 'w-12 h-12' : 'w-16 h-20',
      active ? 'text-[#00DC82]' : 'text-slate-600 hover:text-slate-400'
    )}
  >
    <span className={cn(
      'text-2xl mb-1',
      active && 'scale-110 drop-shadow-[0_0_8px_rgba(0,220,130,0.5)]'
    )}>
      {icon}
    </span>
    {!collapsed && (
      <span className="text-[8px] font-black uppercase tracking-widest">
        {label}
      </span>
    )}
    {active && (
      <div className="absolute left-0 w-1 h-6 bg-[#00DC82] rounded-r-full shadow-[0_0_12px_#00DC82]" />
    )}
  </button>
);

// Container remains the same
export const Container: React.FC<{ 
  children: React.ReactNode; 
  className?: string;
}> = ({ children, className = '' }) => (
  <div className={cn('max-w-7xl mx-auto px-4 sm:px-6 lg:px-8', className)}>
    {children}
  </div>
);
