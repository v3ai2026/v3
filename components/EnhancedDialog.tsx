import React, { useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';

export type ModalSize = 'sm' | 'md' | 'lg' | 'xl' | 'full';

const SIZE_MAP: Record<ModalSize, string> = {
  sm: 'max-w-md',
  md: 'max-w-2xl',
  lg: 'max-w-4xl',
  xl: 'max-w-6xl',
  full: 'max-w-[95vw] h-[92vh]',
};

/**
 * Enhanced Dialog component that wraps Shadcn Dialog with luxury styling
 * Compatible with the existing NeuralModal API
 */
export const NeuralModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  size?: ModalSize;
}> = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
  size = 'md',
}) => {
  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent 
        className={cn(
          SIZE_MAP[size],
          'bg-[#020420] border-[#1a1e43] rounded-3xl md:rounded-[3rem]',
          'shadow-[0_0_100px_rgba(0,0,0,0.8)]',
          'max-h-[90vh] flex flex-col',
          'p-0'
        )}
      >
        {/* Custom Header */}
        <DialogHeader className="px-6 md:px-10 py-6 md:py-8 border-b border-[#1a1e43] bg-black/50 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-[#00DC82] shadow-[0_0_12px_#00DC82] animate-pulse" />
            <DialogTitle className="text-[10px] md:text-[12px] font-black text-[#00DC82] uppercase tracking-[0.3em] md:tracking-[0.6em] truncate">
              {title}
            </DialogTitle>
          </div>
        </DialogHeader>

        {/* Content */}
        <div className="flex-1 p-6 md:p-12 text-sm text-slate-400 overflow-y-auto custom-scrollbar bg-[#020420]/80">
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div className="px-6 md:px-10 py-6 md:py-8 border-t border-[#1a1e43] bg-black/50 shrink-0 flex justify-end gap-4">
            {footer}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
