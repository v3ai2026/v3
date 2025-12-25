import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// --- SHARED TYPES ---
type ComponentVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
type ComponentSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

// --- LAYOUT COMPONENTS ---

export const Container: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ${className}`}>{children}</div>
);

/**
 * GlassCard: A luxury frosted glass container with enhanced animations.
 */
export const GlassCard: React.FC<{ 
  children: React.ReactNode; 
  className?: string; 
  hover?: boolean;
  onClick?: () => void;
  ariaLabel?: string;
}> = ({ children, className = '', hover = false, onClick, ariaLabel }) => (
  <motion.div 
    onClick={onClick}
    aria-label={ariaLabel}
    className={`
      bg-[#020420]/60 backdrop-blur-xl border border-[#1a1e43] rounded-[2rem] p-6
      ${onClick ? 'cursor-pointer' : ''}
      ${className}
    `}
    whileHover={hover || onClick ? { 
      y: -4, 
      scale: 1.01,
      borderColor: 'rgba(0, 220, 130, 0.3)',
      boxShadow: '0 10px 40px rgba(0, 220, 130, 0.15)',
      transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] }
    } : undefined}
    whileTap={onClick ? { scale: 0.98 } : undefined}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
  >
    {children}
  </motion.div>
);

/**
 * NeuralButton: High-fidelity button with loading states, luxury gradients, and ripple effects.
 */
export const NeuralButton: React.FC<{
  children: React.ReactNode;
  onClick?: () => void;
  variant?: ComponentVariant;
  size?: ComponentSize;
  loading?: boolean;
  disabled?: boolean;
  className?: string;
}> = ({ children, onClick, variant = 'primary', size = 'md', loading = false, disabled = false, className = '' }) => {
  const [ripples, setRipples] = useState<{ id: number; x: number; y: number }[]>([]);
  const MAX_RIPPLES = 3; // Limit concurrent ripples

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (onClick && !disabled && !loading) {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const newRipple = { id: Date.now(), x, y };
      
      setRipples(prev => {
        const updated = [...prev, newRipple];
        // Keep only the most recent ripples
        return updated.slice(-MAX_RIPPLES);
      });
      
      setTimeout(() => {
        setRipples(prev => prev.filter(r => r.id !== newRipple.id));
      }, 600);
      
      onClick();
    }
  };

  const baseStyles = "relative inline-flex items-center justify-center font-black uppercase tracking-widest transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden";
  
  const variants = {
    primary: "bg-nuxt-gradient text-black shadow-[0_0_20px_rgba(0,220,130,0.3)]",
    secondary: "bg-white/5 text-white border border-white/10",
    outline: "border-2 border-[#00DC82] text-[#00DC82]",
    ghost: "text-slate-400",
    danger: "bg-red-500/10 text-red-500 border border-red-500/20"
  };

  const sizes = {
    xs: "px-3 py-1.5 text-[8px] rounded-lg",
    sm: "px-4 py-2 text-[10px] rounded-xl",
    md: "px-6 py-3 text-[11px] rounded-2xl",
    lg: "px-8 py-4 text-[13px] rounded-3xl",
    xl: "px-10 py-5 text-[15px] rounded-[2rem]"
  };

  return (
    <motion.button 
      onClick={handleClick} 
      disabled={disabled || loading} 
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      whileHover={!disabled && !loading ? { 
        scale: 1.05,
        boxShadow: variant === 'primary' ? '0 0 40px rgba(0, 220, 130, 0.6)' : '0 4px 20px rgba(255, 255, 255, 0.1)',
      } : undefined}
      whileTap={!disabled && !loading ? { scale: 0.95 } : undefined}
    >
      {loading ? <NeuralSpinner size="xs" className="mr-2" /> : null}
      {children}
      
      <AnimatePresence>
        {ripples.map(ripple => (
          <motion.span
            key={ripple.id}
            className="absolute rounded-full bg-white/30"
            style={{
              left: ripple.x,
              top: ripple.y,
              width: 10,
              height: 10,
              transform: 'translate(-50%, -50%)',
            }}
            initial={{ scale: 0, opacity: 1 }}
            animate={{ scale: 8, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          />
        ))}
      </AnimatePresence>
    </motion.button>
  );
};

/**
 * NeuralInput: Themed text input with semantic labeling and focus glow.
 */
export const NeuralInput: React.FC<{
  label?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  type?: string;
  className?: string;
}> = ({ label, value, onChange, placeholder, type = 'text', className = '' }) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className="space-y-2 w-full">
      {label && <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-2">{label}</label>}
      <motion.input
        type={type}
        value={value}
        onChange={onChange}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder={placeholder}
        className={`
          w-full bg-black/40 border border-[#1a1e43] rounded-2xl px-5 py-4
          text-sm text-white placeholder-slate-600 focus:outline-none
          transition-all ${className}
        `}
        animate={{
          borderColor: isFocused ? 'rgba(0, 220, 130, 0.5)' : 'rgba(26, 30, 67, 1)',
          boxShadow: isFocused ? '0 0 20px rgba(0, 220, 130, 0.3)' : '0 0 0 rgba(0, 220, 130, 0)',
        }}
        transition={{ duration: 0.3 }}
      />
    </div>
  );
};

/**
 * NeuralTextArea: Themed textarea for large directives with focus glow.
 */
export const NeuralTextArea: React.FC<{
  label?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
  className?: string;
}> = ({ label, value, onChange, placeholder, className = '' }) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className="space-y-2 w-full">
      {label && <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-2">{label}</label>}
      <motion.textarea
        value={value}
        onChange={onChange}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder={placeholder}
        className={`
          w-full bg-black/40 border border-[#1a1e43] rounded-3xl px-6 py-5
          text-sm text-white placeholder-slate-600 focus:outline-none
          transition-all resize-none custom-scrollbar ${className}
        `}
        animate={{
          borderColor: isFocused ? 'rgba(0, 220, 130, 0.5)' : 'rgba(26, 30, 67, 1)',
          boxShadow: isFocused ? '0 0 20px rgba(0, 220, 130, 0.3)' : '0 0 0 rgba(0, 220, 130, 0)',
        }}
        transition={{ duration: 0.3 }}
      />
    </div>
  );
};

/**
 * SidebarItem: Icon-based navigation item with active/collapsed states and animations.
 */
export const SidebarItem: React.FC<{
  icon: string;
  label: string;
  active: boolean;
  onClick: () => void;
  collapsed?: boolean;
}> = ({ icon, label, active, onClick, collapsed = false }) => (
  <motion.button
    onClick={onClick}
    className={`
      flex flex-col items-center justify-center transition-all duration-300 relative
      ${collapsed ? 'w-12 h-12' : 'w-16 h-20'}
      ${active ? 'text-[#00DC82]' : 'text-slate-600'}
    `}
    whileHover={{ 
      scale: 1.1,
      color: active ? '#00DC82' : '#94a3b8',
    }}
    whileTap={{ scale: 0.95 }}
  >
    <motion.span 
      className={`text-2xl mb-1`}
      animate={{
        scale: active ? [1, 1.2, 1] : 1,
        rotate: active ? [0, 5, -5, 0] : 0,
        filter: active ? 'drop-shadow(0 0 8px rgba(0, 220, 130, 0.5))' : 'drop-shadow(0 0 0 rgba(0, 220, 130, 0))',
      }}
      transition={{
        scale: { duration: 0.6, repeat: active ? Infinity : 0, repeatDelay: 3 },
        rotate: { duration: 0.4, repeat: active ? Infinity : 0, repeatDelay: 3 },
      }}
    >
      {icon}
    </motion.span>
    {!collapsed && <span className="text-[8px] font-black uppercase tracking-widest">{label}</span>}
    {active && (
      <motion.div 
        className="absolute left-0 w-1 h-6 bg-[#00DC82] rounded-r-full"
        initial={{ scaleY: 0, boxShadow: '0 0 0 #00DC82' }}
        animate={{ scaleY: 1, boxShadow: '0 0 12px #00DC82' }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      />
    )}
  </motion.button>
);

/**
 * NeuralBadge: Small status or classification indicator with pulse animation.
 */
export const NeuralBadge: React.FC<{
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
  pulse?: boolean;
  className?: string;
}> = ({ children, variant = 'primary', pulse = false, className = '' }) => (
  <motion.div 
    className={`
      inline-flex items-center gap-2 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest
      ${variant === 'primary' ? 'bg-[#00DC82]/10 text-[#00DC82] border border-[#00DC82]/30' : 'bg-white/5 text-slate-400 border border-white/10'}
      ${className}
    `}
    initial={{ scale: 0.8, opacity: 0 }}
    animate={{ scale: 1, opacity: 1 }}
    transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
  >
    {pulse && (
      <span className="flex h-1.5 w-1.5 relative">
        <motion.span 
          className="absolute inline-flex h-full w-full rounded-full bg-[#00DC82]"
          animate={{ scale: [1, 2, 2], opacity: [0.75, 0, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeOut' }}
        />
        <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#00DC82]" />
      </span>
    )}
    {children}
  </motion.div>
);

/**
 * NeuralSwitch: Luxury toggle switch with smooth animations.
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
    <motion.button
      onClick={() => onChange(!checked)}
      className={`
        relative w-12 h-6 rounded-full p-1
        ${checked ? 'bg-[#00DC82]/20 border border-[#00DC82]/40' : 'bg-white/5 border border-white/10'}
      `}
      animate={{
        backgroundColor: checked ? 'rgba(0, 220, 130, 0.2)' : 'rgba(255, 255, 255, 0.05)',
      }}
      transition={{ duration: 0.3 }}
    >
      <motion.div 
        className={`w-4 h-4 rounded-full shadow-lg ${checked ? 'bg-[#00DC82]' : 'bg-slate-600'}`}
        animate={{
          x: checked ? 24 : 0,
          backgroundColor: checked ? '#00DC82' : '#475569',
          boxShadow: checked ? '0 0 10px rgba(0, 220, 130, 0.5)' : '0 2px 4px rgba(0, 0, 0, 0.2)',
        }}
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
      />
    </motion.button>
  </div>
);

/**
 * NeuralSpinner: Cinematic loading indicator with enhanced animations.
 */
export const NeuralSpinner: React.FC<{ size?: 'xs' | 'sm' | 'md' | 'lg', className?: string }> = ({ size = 'md', className = '' }) => {
  const sizes = {
    xs: "w-3 h-3 border-2",
    sm: "w-6 h-6 border-2",
    md: "w-10 h-10 border-3",
    lg: "w-16 h-16 border-4"
  };
  return (
    <motion.div 
      className={`${sizes[size]} rounded-full border-t-transparent border-[#00DC82] ${className}`}
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
      style={{
        boxShadow: '0 0 10px rgba(0, 220, 130, 0.3)',
      }}
    />
  );
};

/**
 * ProgressBar: Visualization for generation or deployment progress with rainbow flow.
 */
export const ProgressBar: React.FC<{ progress: number; className?: string }> = ({ progress, className = '' }) => (
  <div className={`w-full h-1.5 bg-white/5 rounded-full overflow-hidden ${className}`}>
    <motion.div 
      className="h-full rounded-full" 
      style={{ 
        width: `${Math.min(100, Math.max(0, progress))}%`,
        background: 'linear-gradient(90deg, #00DC82, #00C16A, #00DC82)',
        backgroundSize: '200% 100%',
      }}
      animate={{
        backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
        boxShadow: [
          '0 0 10px rgba(0, 220, 130, 0.5)',
          '0 0 20px rgba(0, 220, 130, 0.7)',
          '0 0 10px rgba(0, 220, 130, 0.5)',
        ],
      }}
      transition={{
        backgroundPosition: { duration: 2, repeat: Infinity, ease: 'linear' },
        boxShadow: { duration: 1.5, repeat: Infinity, ease: 'easeInOut' },
      }}
    />
  </div>
);
