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
   * - 'slide': Dynamic vertical slide-up with a subtle scale and blur effect.
   * - 'fade': Classic opacity transition.
   * - 'zoom': High-impact scale-up with an elastic feel.
   * - 'fadeSlideIn': Subtle fade with minimal vertical lift.
   */
  transition?: ModalTransition;
  footer?: React.ReactNode;
}

/** 
 * Animation Configuration Map
 * Maps the transition prop to the corresponding CSS animation classes defined in index.html.
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
 * Implements a high-performance transition system that supports multiple 
 * entrance effects while maintaining strict WAI-ARIA compliance.
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

  // Memoize the animation classes to prevent unnecessary recalculations during re-renders
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
      // Capture the element that triggered the modal to restore focus when it closes
      triggerElementRef.current = document.activeElement as HTMLElement;
      
      // Prevent background scrolling while the modal is open
      document.body.style.overflow = 'hidden';
      
      window.addEventListener('keydown', handleEscape);
      window.addEventListener('keydown', handleTabKey);
      
      // Move focus into the modal for keyboard accessibility
      const focusTimer = setTimeout(() => {
        modalRef.current?.focus();
      }, 50);

      return () => {
        // Restore background scroll and cleanup listeners
        document.body.style.overflow = '';
        window.removeEventListener('keydown', handleEscape);
        window.removeEventListener('keydown', handleTabKey);
        clearTimeout(focusTimer);
        
        // Restore focus to the element that opened the modal
        triggerElementRef.current?.focus();
      };
    }
  }, [isOpen, handleEscape, handleTabKey]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-6 sm:p-16 overflow-hidden"
      role="presentation"
    >
      {/* Dynamic Backdrop with Fade In Transition */}
      <div
        className={`fixed inset-0 bg-black/98 backdrop-blur-3xl cursor-pointer ${activeAnimations.backdrop}`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Surface with User-defined Transition Class */}
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="neural-modal-title"
        tabIndex={-1}
        className={`relative w-full max-w-2xl bg-[#080808] border border-[#111] rounded-[3rem] shadow-[0_0_150px_rgba(0,0,0,1)] flex flex-col focus:outline-none overflow-hidden gold-glow border-gold-subtle ${activeAnimations.surface}`}
      >
        <header className="flex items-center justify-between px-12 py-8 border-b border-[#111] bg-black/60">
          <h2
            id="neural-modal-title"
            className="text-[10px] font-black text-[#BF953F] uppercase tracking-[0.6em] opacity-90"
          >
            {title}
          </h2>
          <button
            onClick={onClose}
            className="text-[#222] hover:text-[#BF953F] transition-all p-3 rounded-2xl hover:bg-white/5 outline-none focus:ring-1 focus:ring-[#BF953F]/40"
            aria-label="Close dialog"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="square">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </header>

        <div className="px-12 py-14 text-[12px] font-black text-[#444] leading-relaxed max-h-[60vh] overflow-y-auto custom-scrollbar uppercase tracking-[0.2em]">
          {content}
        </div>

        <footer className="px-12 py-10 border-t border-[#111] bg-black/40 flex justify-end items-center gap-6">
          {footer ? (
            footer
          ) : (
            <button
              onClick={onClose}
              className="px-14 py-4 bg-gold-gradient text-black text-[10px] font-black uppercase tracking-[0.5em] rounded-2xl transition-all shadow-2xl active:scale-95 hover:brightness-110 outline-none"
            >
              Confirm Synchronization
            </button>
          )}
        </footer>
      </div>
    </div>
  );
};