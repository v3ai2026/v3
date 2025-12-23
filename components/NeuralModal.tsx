import React, { useEffect, useRef, useCallback } from 'react';

/** Available transition effects for the modal appearance */
export type ModalTransition = 'slide' | 'fade' | 'zoom' | 'fadeSlideIn';

interface NeuralModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  content: React.ReactNode;
  /** 
   * Transition style: 
   * - 'slide': Professional vertical entry (bottom-up) with subtle scaling.
   * - 'fade': Clean opacity-only entry.
   * - 'zoom': Dynamic scale-focused entry with elastic overshoot.
   * - 'fadeSlideIn': Light, rapid fade with minimal vertical movement.
   */
  transition?: ModalTransition;
  footer?: React.ReactNode;
}

/** 
 * Map of transition types to their corresponding Tailwind-driven animation classes.
 * These animations are defined in index.html for high-performance hardware acceleration.
 */
const TRANSITION_MAP: Record<ModalTransition, string> = {
  slide: 'animate-modal-slide',
  fade: 'animate-modal-fade',
  zoom: 'animate-modal-zoom',
  fadeSlideIn: 'animate-modal-fade-slide-in',
};

/**
 * NeuralModal - A studio-grade accessible modal component.
 * 
 * Features:
 * - WAI-ARIA 1.2 Compliance: Uses role="dialog" and aria-modal="true".
 * - Focus Management: Captures initial focus and restores it on close.
 * - Focus Trap: Prevents Tab key from leaving the modal boundaries.
 * - Keyboard Support: Closes on ESC key.
 * - Scroll Lock: Prevents background scrolling when active.
 * - High-performance CSS transitions via the 'transition' prop.
 */
export const NeuralModal: React.FC<NeuralModalProps> = ({
  isOpen,
  onClose,
  title,
  content,
  transition = 'fadeSlideIn',
  footer,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const previousFocus = useRef<HTMLElement | null>(null);

  const handleEscape = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') onClose();
  }, [onClose]);

  // Focus trap logic
  const handleTabKey = useCallback((e: KeyboardEvent) => {
    if (e.key !== 'Tab' || !modalRef.current) return;

    const focusableElements = modalRef.current.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

    if (e.shiftKey) {
      if (document.activeElement === firstElement) {
        lastElement.focus();
        e.preventDefault();
      }
    } else {
      if (document.activeElement === lastElement) {
        firstElement.focus();
        e.preventDefault();
      }
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      // Save current focus to restore it later
      previousFocus.current = document.activeElement as HTMLElement;
      
      // Lock scrolling on the main content
      document.body.style.overflow = 'hidden';
      
      // Event Listeners for accessibility
      window.addEventListener('keydown', handleEscape);
      window.addEventListener('keydown', handleTabKey);
      
      // Shift focus to the modal container (aria-labelledby will handle identifying it)
      const focusTimeout = setTimeout(() => {
        modalRef.current?.focus();
      }, 50);

      return () => {
        document.body.style.overflow = '';
        window.removeEventListener('keydown', handleEscape);
        window.removeEventListener('keydown', handleTabKey);
        clearTimeout(focusTimeout);
        // Restore focus to the element that opened the modal
        previousFocus.current?.focus();
      };
    }
  }, [isOpen, handleEscape, handleTabKey]);

  if (!isOpen) return null;

  // Determine which animation class to apply based on the transition prop
  const animationClass = TRANSITION_MAP[transition];

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 overflow-hidden outline-none"
      role="presentation"
    >
      {/* Backdrop - Frosted glass effect with fade animation */}
      <div
        className="fixed inset-0 bg-black/85 backdrop-blur-sm animate-backdrop cursor-pointer"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Container Surface */}
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="neural-modal-header"
        tabIndex={-1}
        className={`relative w-full max-w-lg bg-[#141414] border border-[#303030] rounded-2xl shadow-2xl flex flex-col focus:outline-none ${animationClass}`}
      >
        {/* Header Section */}
        <header className="flex items-center justify-between px-6 py-4 border-b border-[#262626]">
          <h2
            id="neural-modal-header"
            className="text-[10px] font-bold text-white uppercase tracking-[0.2em] opacity-90"
          >
            {title}
          </h2>
          <button
            onClick={onClose}
            className="text-[#9CA3AF] hover:text-white transition-colors p-2 rounded-full hover:bg-white/5 outline-none focus:ring-1 focus:ring-blue-500"
            aria-label="Close modal"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </header>

        {/* Content Body - Thematic custom scrollbar */}
        <div className="px-6 py-8 text-sm text-[#D1D5DB] leading-relaxed max-h-[60vh] overflow-y-auto custom-scrollbar">
          {content}
        </div>

        {/* Footer Area - Adaptive footer for actions */}
        <footer className="px-6 py-4 border-t border-[#262626] bg-[#0E0E0E] rounded-b-2xl flex justify-end items-center gap-3">
          {footer ? (
            footer
          ) : (
            <button
              onClick={onClose}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white text-[10px] font-bold uppercase tracking-widest rounded-full transition-all shadow-lg active:scale-95 focus:ring-2 focus:ring-blue-500/50 outline-none"
            >
              Close
            </button>
          )}
        </footer>
      </div>
    </div>
  );
};