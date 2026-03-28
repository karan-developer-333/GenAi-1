'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Download, FileText, Loader2, X, AlertCircle, Check } from 'lucide-react';
import { useExport } from '@/hooks/useExport';
import { cn } from '@/lib/utils';

export const ExportButton = ({ variant = 'button' }: { variant?: 'button' | 'dropdown' }) => {
  const { exportToPDF, isExporting, exportProgress, error, clearError } = useExport();

  if (variant === 'dropdown') {
    return (
      <div className="relative">
        <button
          onClick={exportToPDF}
          disabled={isExporting}
          className={cn(
            'w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200',
            'text-sm font-medium',
            isExporting
              ? 'bg-muted/50 text-muted-foreground cursor-not-allowed'
              : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
          )}
        >
          {isExporting ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>{exportProgress || 'Exporting...'}</span>
            </>
          ) : (
            <>
              <FileText className="w-5 h-5" />
              <span>Export to PDF</span>
            </>
          )}
        </button>

        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute bottom-full left-0 right-0 mb-2 p-3 rounded-xl bg-destructive/10 border border-destructive/20"
            >
              <div className="flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-destructive mt-0.5" />
                <div className="flex-1">
                  <p className="text-xs text-destructive">{error}</p>
                  <button
                    onClick={clearError}
                    className="text-xs text-destructive/70 hover:text-destructive mt-1"
                  >
                    Dismiss
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={exportToPDF}
        disabled={isExporting}
        className={cn(
          'btn transition-all',
          isExporting
            ? 'bg-muted/50 text-muted-foreground cursor-not-allowed'
            : 'btn-secondary'
        )}
      >
        {isExporting ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>{exportProgress || 'Exporting...'}</span>
          </>
        ) : (
          <>
            <Download className="w-4 h-4" />
            <span>Export PDF</span>
          </>
        )}
      </button>

      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="absolute top-full right-0 mt-2 p-4 rounded-xl bg-card border border-border shadow-xl min-w-[280px] z-50"
          >
            <button
              onClick={clearError}
              className="absolute top-2 right-2 p-1 rounded-lg hover:bg-muted text-muted-foreground"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="flex items-start gap-3 pr-6">
              <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-foreground font-medium">Export Failed</p>
                <p className="text-xs text-muted-foreground mt-1">{error}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ExportButton;
