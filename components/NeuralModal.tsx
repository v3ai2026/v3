import React, { useEffect, useRef, useCallback, useMemo } from 'react';

/** Available transition effects for the modal appearance */
export type ModalTransition = 'slide' | 'fade' | 'zoom' | 'fadeSlideIn';

interface NeuralModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  content: React.ReactNode;
  /** 
   * Transition style: 
   * - 'slide': Dynamic vertical slide-up with a soft blur.
   * - 'fade': Classic opacity transition.
   * - 'zoom': High-impact scale-up with an elastic feel.
   * - 'fadeSlideIn': Subtle fade with minimal vertical lift.
   */
  transition?: ModalTransition;
  footer?: React.ReactNode;
}

/** 
 * Animation Configuration Map
 * Maps the transition prop to the corresponding CSS animation classes.
 */
const ANIMATION_CONFIG: Record<ModalTransition, { surface: string; backdrop: string }> = {
  slide: {
    surface: 'animate-modal-slide',
    backdrop: 'animate-backdrop',
  },
  fade: {
    surface: 'animate-modal-fade',
    backdrop: 'animate-backdrop',
  },
  zoom: {
    surface: 'animate-modal-zoom',
    backdrop: 'animate-backdrop',
  },
  fadeSlideIn: {
    surface: 'animate-modal-fade-slide-in',
    backdrop: 'animate-backdrop',
  },
};

/**
 * NeuralModal - A studio-grade accessible modal component.
 * 
 * Features:
 * - WAI-ARIA 1.2 Compliant (role="dialog", aria-modal="true").
 * - Dynamic Transition logic for high-end UI/UX.
 * - Robust Focus Trap & Focus Restoration.
 * - Optimized for hardware-accelerated animations.
 */
export const NeuralModal: React.FC<NeuralModalProps> = ({
  isOpen,
  onClose,
  title,
  content,
  transition = 'slide',
  footer,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const triggerElementRef = useRef<HTMLElement | null>(null);

  // Memoize active animation classes based on the transition prop
  const activeAnimations = useMemo(() => ANIMATION_CONFIG[transition], [transition]);

  const handleEscape = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') onClose();
  }, [onClose]);

  const handleTabKey = useCallback((e: KeyboardEvent) => {
    if (e.key !== 'Tab' || !modalRef.current) return;

    const focusableNodes = modalRef.current.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    if (focusableNodes.length === 0) return;

    const firstNode = focusableNodes[0] as HTMLElement;
    const lastNode = focusableNodes[focusableNodes.length - 1] as HTMLElement;

    if (e.shiftKey) {
      if (document.activeElement === firstNode) {
        lastNode.focus();
        e.preventDefault();
      }
    } else {
      if (document.activeElement === lastNode) {
        firstNode.focus();
        e.preventDefault();
      }
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      // Store current focus for restoration on close
      triggerElementRef.current = document.activeElement as HTMLElement;
      
      // Lock scrolling
      document.body.style.overflow = 'hidden';
      
      window.addEventListener('keydown', handleEscape);
      window.addEventListener('keydown', handleTabKey);
      
      // Focus the modal after a short delay to allow the DOM to ready
      const focusTimer = setTimeout(() => {
        modalRef.current?.focus();
      }, 50);

      return () => {
        document.body.style.overflow = '';
        window.removeEventListener('keydown', handleEscape);
        window.removeEventListener('keydown', handleTabKey);
        clearTimeout(focusTimer);
        // Restore focus
        triggerElementRef.current?.focus();
      };
    }
  }, [isOpen, handleEscape, handleTabKey]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-12 overflow-hidden"
      role="presentation"
    >
      {/* Dynamic Backdrop */}
      <div
        className={`fixed inset-0 bg-black/95 backdrop-blur-2xl cursor-pointer ${activeAnimations.backdrop}`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Surface Container */}
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="neural-modal-title"
        tabIndex={-1}
        className={`relative w-full max-w-xl bg-[#080808] border border-[#1A1A1A] rounded-[2.5rem] shadow-[0_0_120px_rgba(0,0,0,1)] flex flex-col focus:outline-none overflow-hidden gold-glow border-gold-subtle ${activeAnimations.surface}`}
      >
        <header className="flex items-center justify-between px-10 py-7 border-b border-[#1A1A1A] bg-black/40">
          <h2
            id="neural-modal-title"
            className="text-[10px] font-black text-[#D4AF37] uppercase tracking-[0.5em] opacity-90"
          >
            {title}
          </h2>
          <button
            onClick={onClose}
            className="text-[#444] hover:text-[#D4AF37] transition-all p-2.5 rounded-2xl hover:bg-white/5 outline-none focus:ring-1 focus:ring-[#D4AF37]/50"
            aria-label="Close dialog"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="square">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </header>

        <div className="px-10 py-12 text-[11px] font-bold text-[#999] leading-relaxed max-h-[60vh] overflow-y-auto custom-scrollbar uppercase tracking-[0.15em]">
          {content}
        </div>

        <footer className="px-10 py-8 border-t border-[#1A1A1A] bg-black/30 flex justify-end items-center gap-5">
          {footer ? (
            footer
          ) : (
            <button
              onClick={onClose}
              className="px-12 py-3.5 bg-gold-gradient text-black text-[10px] font-black uppercase tracking-[0.4em] rounded-2xl transition-all shadow-2xl active:scale-95 hover:brightness-110 outline-none"
            >
              Acknowledge
            </button>
          )}
        </footer>
      </div>
    </div>
  );
};