import React, { useEffect, useRef, useCallback, useMemo } from 'react';
import { createPortal } from 'react-dom';

export type ModalTransition = 'slide' | 'fade' | 'zoom' | 'fadeSlideIn';
export type ModalSize = 'sm' | 'md' | 'lg' | 'xl' | 'full';

const SIZE_MAP: Record<ModalSize, string> = {
  sm: 'max-w-md',
  md: 'max-w-2xl',
  lg: 'max-w-4xl',
  xl: 'max-w-6xl',
  full: 'max-w-[95vw] h-[92vh]',
};

const TRANSITION_MAP: Record<ModalTransition, string> = {
  slide: 'animate-modal-slide',
  fade: 'animate-modal-fade',
  zoom: 'animate-modal-zoom',
  fadeSlideIn: 'animate-modal-fade-slide-in',
};

export const NeuralModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  transition?: ModalTransition;
  size?: ModalSize;
}> = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
  transition = 'fade',
  size = 'md',
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const portalRoot = useRef<HTMLElement | null>(null);

  useEffect(() => {
    portalRoot.current = document.getElementById('modal-root');
  }, []);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') onClose();
    if (e.key === 'Tab' && modalRef.current) {
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
    }
  }, [onClose]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
      // Accessibility: Focus the modal surface on open
      setTimeout(() => modalRef.current?.focus(), 50);
      return () => {
        document.body.style.overflow = 'unset';
        window.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [isOpen, handleKeyDown]);

  const transitionClass = useMemo(() => TRANSITION_MAP[transition], [transition]);
  const sizeClass = useMemo(() => SIZE_MAP[size], [size]);

  if (!isOpen || !portalRoot.current) return null;

  return createPortal(
    <div className="fixed inset-0 z-[5000] flex items-center justify-center p-4 md:p-12 pointer-events-none">
      <div 
        className="fixed inset-0 animate-backdrop backdrop-blur-2xl bg-black/40 cursor-pointer pointer-events-auto" 
        onClick={onClose} 
        aria-hidden="true"
      />
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="neural-modal-title"
        tabIndex={-1}
        className={`relative w-full ${sizeClass} bg-[#020420] border border-[#1a1e43] rounded-3xl md:rounded-[3rem] shadow-2xl flex flex-col overflow-hidden outline-none pointer-events-auto max-h-[90vh] ${transitionClass}`}
      >
        <header className="flex items-center justify-between px-6 md:px-10 py-6 md:py-8 border-b border-[#1a1e43] bg-black/50 z-20 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-[#00DC82] shadow-[0_0_12px_#00DC82] animate-pulse" />
            <h2 id="neural-modal-title" className="text-[10px] md:text-[12px] font-black text-[#00DC82] uppercase tracking-[0.3em] md:tracking-[0.6em] truncate">
              {title}
            </h2>
          </div>
          <button 
            onClick={onClose} 
            className="text-white/20 hover:text-[#00DC82] p-2 transition-colors rounded-lg hover:bg-white/5"
            aria-label="Close modal"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4"><path d="M18 6L6 18M6 6l12 12" /></svg>
          </button>
        </header>
        <div className="flex-1 p-6 md:p-12 text-sm text-slate-400 overflow-y-auto custom-scrollbar bg-[#020420]/80">
          {children}
        </div>
        {footer && (
          <footer className="px-6 md:px-10 py-6 md:py-8 border-t border-[#1a1e43] bg-black/50 shrink-0">
            {footer}
          </footer>
        )}
      </div>
    </div>,
    portalRoot.current
  );
};