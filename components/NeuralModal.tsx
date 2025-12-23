import React, { useEffect, useRef, useCallback, useMemo } from 'react';

/** Available transition protocols for the modal surface entrance */
export type ModalTransition = 'slide' | 'fade' | 'zoom' | 'fadeSlideIn';

/** Modal size configurations for varied content density */
export type ModalSize = 'sm' | 'md' | 'lg' | 'xl' | 'full';

interface NeuralModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  transition?: ModalTransition;
  size?: ModalSize;
}

/** Registry for surface dimensions mapped to Tailwind max-width utility classes */
const SIZE_REGISTRY: Record<ModalSize, string> = {
  sm: 'max-w-md',
  md: 'max-w-2xl',
  lg: 'max-w-4xl',
  xl: 'max-w-6xl',
  full: 'max-w-[95vw] h-[90vh]',
};

/** Registry for motion protocols (mapped to custom CSS keyframes defined in index.html) */
const TRANSITION_REGISTRY: Record<ModalTransition, string> = {
  slide: 'animate-modal-slide',
  fade: 'animate-modal-fade',
  zoom: 'animate-modal-zoom',
  fadeSlideIn: 'animate-modal-fade-slide-in',
};

/**
 * NeuralModal: An enterprise-grade, accessible dialogue component.
 * Features centralized transition orchestration, robust focus trapping, and studio aesthetics.
 * Complies with WAI-ARIA Authoring Practices for Dialog (Modal).
 */
export const NeuralModal: React.FC<NeuralModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
  transition = 'fade',
  size = 'md',
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const triggerSourceRef = useRef<HTMLElement | null>(null);

  const activeTransition = useMemo(() => TRANSITION_REGISTRY[transition] || TRANSITION_REGISTRY.fade, [transition]);
  const activeSize = useMemo(() => SIZE_REGISTRY[size] || SIZE_REGISTRY.md, [size]);

  /** 
   * Focus Trap Orchestrator:
   * Prevents focus leakage and ensures keyboard navigation cycle remains 
   * contained within the modal surface, including the header and footer.
   */
  const handleKeyboardInteraction = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
      return;
    }

    if (e.key === 'Tab' && modalRef.current) {
      // Find all focusable elements within the modal boundary
      const focusableSelector = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
      const focusableElements = Array.from(modalRef.current.querySelectorAll<HTMLElement>(focusableSelector))
        .filter(el => !el.hasAttribute('disabled') && el.offsetParent !== null);
      
      if (focusableElements.length === 0) {
        e.preventDefault();
        return;
      }
      
      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (e.shiftKey) { 
        // Backward Tab: wrap to last if on first
        if (document.activeElement === firstElement || document.activeElement === modalRef.current) {
          lastElement.focus();
          e.preventDefault();
        }
      } else { 
        // Forward Tab: wrap to first if on last
        if (document.activeElement === lastElement) {
          firstElement.focus();
          e.preventDefault();
        }
      }
    }
  }, [onClose]);

  useEffect(() => {
    if (isOpen) {
      // 1. Capture the element that triggered the modal for focus restoration on close
      triggerSourceRef.current = document.activeElement as HTMLElement;
      
      // 2. Prevent document body overflow to lock scrolling
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      
      // 3. Register high-level keyboard listener
      window.addEventListener('keydown', handleKeyboardInteraction);
      
      // 4. Set initial focus to the modal surface or the first focusable child
      const timer = setTimeout(() => {
        if (modalRef.current) {
          const focusableSelector = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
          const firstFocusable = modalRef.current.querySelector<HTMLElement>(focusableSelector);
          if (firstFocusable) {
            firstFocusable.focus();
          } else {
            modalRef.current.focus();
          }
        }
      }, 100);
      
      return () => {
        document.body.style.overflow = originalOverflow;
        window.removeEventListener('keydown', handleKeyboardInteraction);
        clearTimeout(timer);
        
        // 5. Restore focus to the trigger element
        if (triggerSourceRef.current) {
          triggerSourceRef.current.focus();
        }
      };
    }
  }, [isOpen, handleKeyboardInteraction]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-10 overflow-hidden" 
      role="presentation"
    >
      {/* Backdrop Layer: Cinematic veil with high-fidelity blur */}
      <div 
        className="fixed inset-0 bg-black/95 backdrop-blur-3xl animate-backdrop cursor-pointer transition-opacity" 
        onClick={onClose} 
        aria-hidden="true" 
      />

      {/* Surface Shard: The primary dialog unit with focus management */}
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="neural-modal-title"
        tabIndex={-1}
        className={`relative w-full ${activeSize} bg-[#121212] border border-[#252525] rounded-[2.5rem] shadow-[0_0_120px_rgba(0,0,0,1)] flex flex-col outline-none overflow-hidden gold-glow border-gold-subtle transform-gpu ${activeTransition}`}
      >
        {/* Header Shard */}
        <header className="flex items-center justify-between px-10 py-7 border-b border-[#222] bg-black/60 z-10">
          <h2 id="neural-modal-title" className="text-[12px] font-black text-[#D4AF37] uppercase tracking-[0.4em] leading-none">
            {title}
          </h2>
          <button 
            onClick={onClose} 
            className="text-[#555] hover:text-[#D4AF37] transition-all p-2 rounded-xl hover:bg-white/5 outline-none focus:ring-2 focus:ring-[#D4AF37]/50 focus:ring-offset-2 focus:ring-offset-[#121212]" 
            aria-label="Close dialogue"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="square">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </header>

        {/* Content Body Shard */}
        <div className="flex-1 px-10 py-12 text-[15px] font-medium text-[#c0c0c0] leading-relaxed overflow-y-auto custom-scrollbar scroll-smooth">
          {children}
        </div>

        {/* Action Footer Shard: Ensures explicit accessibility for all provided controls */}
        <footer className="px-10 py-8 border-t border-[#222] bg-black/40 flex justify-end items-center gap-6 z-10">
          {footer ? footer : (
            <button 
              onClick={onClose} 
              className="px-12 py-4 bg-gold-gradient text-black text-[12px] font-black uppercase tracking-[0.2em] rounded-2xl shadow-2xl active:scale-95 hover:brightness-110 transition-all outline-none focus:ring-2 focus:ring-[#D4AF37]/50 focus:ring-offset-2 focus:ring-offset-[#121212]"
            >
              Acknowledge Sync
            </button>
          )}
        </footer>
      </div>
    </div>
  );
};