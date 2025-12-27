import React from 'react';

// --- SHARED TYPES ---
type ComponentVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
type ComponentSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

// --- LAYOUT COMPONENTS ---

export const Container: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ${className}`}>{children}</div>
);

/**
 * GlassCard: A luxury frosted glass container.
 */
export const GlassCard: React.FC<{ 
  children: React.ReactNode; 
  className?: string; 
  hover?: boolean;
  onClick?: () => void;
  ariaLabel?: string;
}> = ({ children, className = '', hover = false, onClick, ariaLabel }) => (
  <div 
    onClick={onClick}
    aria-label={ariaLabel}
    className={`
      bg-[#020420]/60 backdrop-blur-xl border border-[#1a1e43] rounded-[2rem] p-6
      ${hover ? 'hover:border-[#00DC82]/30 hover:bg-[#00DC82]/5 transition-all duration-500' : ''}
      ${onClick ? 'cursor-pointer active:scale-[0.98]' : ''}
      ${className}
    `}
  >
    {children}
  </div>
);

/**
 * NeuralButton: High-fidelity button with loading states and luxury gradients.
 */
export const NeuralButton: React.FC<{
  children: React.ReactNode;
  onClick?: () => void;
  variant?: ComponentVariant;
  size?: ComponentSize;
  loading?: boolean;
  disabled?: boolean;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
}> = ({ children, onClick, variant = 'primary', size = 'md', loading = false, disabled = false, className = '', type = 'button' }) => {
  const baseStyles = "inline-flex items-center justify-center font-black uppercase tracking-widest transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95";
  
  const variants = {
    primary: "bg-nuxt-gradient text-black shadow-[0_0_20px_rgba(0,220,130,0.3)] hover:shadow-[0_0_30px_#00DC82]",
    secondary: "bg-white/5 text-white border border-white/10 hover:bg-white/10",
    outline: "border-2 border-[#00DC82] text-[#00DC82] hover:bg-[#00DC82]/10",
    ghost: "text-slate-400 hover:text-white hover:bg-white/5",
    danger: "bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500/20"
  };

  const sizes = {
    xs: "px-3 py-1.5 text-[8px] rounded-lg",
    sm: "px-4 py-2 text-[10px] rounded-xl",
    md: "px-6 py-3 text-[11px] rounded-2xl",
    lg: "px-8 py-4 text-[13px] rounded-3xl",
    xl: "px-10 py-5 text-[15px] rounded-[2rem]"
  };

  return (
    <button 
      type={type}
      onClick={onClick} 
      disabled={disabled || loading} 
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {loading ? <NeuralSpinner size="xs" className="mr-2" /> : null}
      {children}
    </button>
  );
};

/**
 * NeuralInput: Themed text input with semantic labeling.
 */
export const NeuralInput: React.FC<{
  label?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  type?: string;
  className?: string;
  required?: boolean;
  disabled?: boolean;
}> = ({ label, value, onChange, placeholder, type = 'text', className = '', required = false, disabled = false }) => (
  <div className="space-y-2 w-full">
    {label && <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-2">{label}</label>}
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      disabled={disabled}
      className={`
        w-full bg-black/40 border border-[#1a1e43] rounded-2xl px-5 py-4
        text-sm text-white placeholder-slate-600 focus:outline-none focus:border-[#00DC82]/50
        transition-all disabled:opacity-50 disabled:cursor-not-allowed ${className}
      `}
    />
  </div>
);

/**
 * NeuralTextArea: Themed textarea for large directives.
 */
export const NeuralTextArea: React.FC<{
  label?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
  className?: string;
}> = ({ label, value, onChange, placeholder, className = '' }) => (
  <div className="space-y-2 w-full">
    {label && <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-2">{label}</label>}
    <textarea
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={`
        w-full bg-black/40 border border-[#1a1e43] rounded-3xl px-6 py-5
        text-sm text-white placeholder-slate-600 focus:outline-none focus:border-[#00DC82]/50
        transition-all resize-none custom-scrollbar ${className}
      `}
    />
  </div>
);

/**
 * SidebarItem: Icon-based navigation item with active/collapsed states.
 */
export const SidebarItem: React.FC<{
  icon: string;
  label: string;
  active: boolean;
  onClick: () => void;
  collapsed?: boolean;
}> = ({ icon, label, active, onClick, collapsed = false }) => (
  <button
    onClick={onClick}
    className={`
      flex flex-col items-center justify-center transition-all duration-300
      ${collapsed ? 'w-12 h-12' : 'w-16 h-20'}
      ${active ? 'text-[#00DC82]' : 'text-slate-600 hover:text-slate-400'}
    `}
  >
    <span className={`text-2xl mb-1 ${active ? 'scale-110 drop-shadow-[0_0_8px_rgba(0,220,130,0.5)]' : ''}`}>{icon}</span>
    {!collapsed && <span className="text-[8px] font-black uppercase tracking-widest">{label}</span>}
    {active && <div className="absolute left-0 w-1 h-6 bg-[#00DC82] rounded-r-full shadow-[0_0_12px_#00DC82]" />}
  </button>
);

/**
 * NeuralBadge: Small status or classification indicator.
 */
export const NeuralBadge: React.FC<{
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
  pulse?: boolean;
  className?: string;
}> = ({ children, variant = 'primary', pulse = false, className = '' }) => (
  <div className={`
    inline-flex items-center gap-2 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest
    ${variant === 'primary' ? 'bg-[#00DC82]/10 text-[#00DC82] border border-[#00DC82]/30' : 'bg-white/5 text-slate-400 border border-white/10'}
    ${className}
  `}>
    {pulse && <span className="flex h-1.5 w-1.5 relative">
      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00DC82] opacity-75"></span>
      <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#00DC82]"></span>
    </span>}
    {children}
  </div>
);

/**
 * NeuralSwitch: Luxury toggle switch.
 */
export const NeuralSwitch: React.FC<{
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  description?: string;
}> = ({ checked, onChange, label, description }) => (
  <div className="flex items-center justify-between gap-4 p-2">
    {(label || description) && (
      <div className="flex flex-col">
        {label && <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{label}</span>}
        {description && <span className="text-[8px] text-slate-600 uppercase">{description}</span>}
      </div>
    )}
    <button
      onClick={() => onChange(!checked)}
      className={`
        relative w-12 h-6 rounded-full transition-all duration-300 p-1
        ${checked ? 'bg-[#00DC82]/20 border border-[#00DC82]/40' : 'bg-white/5 border border-white/10'}
      `}
    >
      <div className={`
        w-4 h-4 rounded-full transition-all duration-300 shadow-lg
        ${checked ? 'translate-x-6 bg-[#00DC82]' : 'translate-x-0 bg-slate-600'}
      `} />
    </button>
  </div>
);

/**
 * NeuralSpinner: Cinematic loading indicator.
 */
export const NeuralSpinner: React.FC<{ size?: 'xs' | 'sm' | 'md' | 'lg', className?: string }> = ({ size = 'md', className = '' }) => {
  const sizes = {
    xs: "w-3 h-3 border-2",
    sm: "w-6 h-6 border-2",
    md: "w-10 h-10 border-3",
    lg: "w-16 h-16 border-4"
  };
  return (
    <div className={`
      ${sizes[size]} rounded-full border-t-transparent border-[#00DC82] animate-spin
      ${className}
    `} />
  );
};

/**
 * ProgressBar: Visualization for generation or deployment progress.
 */
export const ProgressBar: React.FC<{ progress: number; className?: string }> = ({ progress, className = '' }) => (
  <div className={`w-full h-1.5 bg-white/5 rounded-full overflow-hidden ${className}`}>
    <div 
      className="h-full bg-nuxt-gradient transition-all duration-500 shadow-[0_0_12px_#00DC82]" 
      style={{ width: `${Math.min(100, Math.max(0, progress))}%` }} 
    />
  </div>
);
