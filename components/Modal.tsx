
import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

/**
 * Reusable Modal Component
 * Features:
 * - createPortal for DOM isolation
 * - Focus management and Escape key closing
 * - Tailwind CSS for luxury styling
 * - Integrated animations from the global stylesheet
 */
const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, footer }) => {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const modalRoot = document.getElementById('modal-root');
  if (!modalRoot) return null;

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8">
      {/* Backdrop with existing backdrop-in animation */}
      <div 
        className="fixed inset-0 animate-backdrop backdrop-blur-md bg-black/60" 
        onClick={onClose}
        aria-hidden="true"
      />
      
      {/* Modal Surface with modal-fade-slide-in animation */}
      <div 
        className="relative w-full max-w-2xl bg-[#020420] border border-[#1a1e43] rounded-[2rem] shadow-[0_0_80px_rgba(0,0,0,0.8)] overflow-hidden animate-modal-fade-slide-in flex flex-col max-h-[90vh]"
        role="dialog"
        aria-modal="true"
      >
        <header className="flex items-center justify-between px-8 py-6 border-b border-[#1a1e43] bg-black/40">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-[#00DC82] shadow-[0_0_8px_#00DC82]" />
            <h3 className="text-sm font-black text-white uppercase tracking-[0.3em]">{title}</h3>
          </div>
          <button 
            onClick={onClose}
            className="text-slate-500 hover:text-[#00DC82] transition-all p-2 rounded-lg hover:bg-white/5"
            aria-label="Close modal"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </header>

        <div className="flex-1 p-8 overflow-y-auto custom-scrollbar text-slate-300 leading-relaxed">
          {children}
        </div>

        {footer && (
          <footer className="px-8 py-6 border-t border-[#1a1e43] bg-black/40 flex justify-end gap-4">
            {footer}
          </footer>
        )}
      </div>
    </div>,
    modalRoot
  );
};

export default Modal;
