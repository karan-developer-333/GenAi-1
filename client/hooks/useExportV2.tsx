import { useState, useCallback } from 'react';
import { useAuth } from '@clerk/nextjs';

export interface ExportOptions {
  useAI?: boolean;
  includeTOC?: boolean;
  includeNarrative?: boolean;
  layoutFlow?: 'chronological' | 'thematic' | 'importance' | 'mixed';
  featuredCount?: number;
}

export interface ExportProgress {
  stage: 'idle' | 'processing' | 'generating' | 'downloading' | 'complete' | 'error';
  message: string;
  progress?: number;
}

export const useExportV2 = () => {
  const { isLoaded, isSignedIn } = useAuth();
  const [isExporting, setIsExporting] = useState(false);
  const [progress, setProgress] = useState<ExportProgress>({
    stage: 'idle',
    message: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [lastExportDate, setLastExportDate] = useState<Date | null>(null);

  const updateProgress = useCallback((
    stage: ExportProgress['stage'],
    message: string,
    progressValue?: number
  ) => {
    setProgress({ stage, message, progress: progressValue });
  }, []);

  const exportToPDF = useCallback(async (options: ExportOptions = {}) => {
    if (!isLoaded || !isSignedIn) {
      setError('Please sign in to export your knowledge');
      return false;
    }

    setIsExporting(true);
    setError(null);

    const {
      useAI = true,
      includeTOC = true,
      includeNarrative = true,
      layoutFlow = 'mixed',
      featuredCount = 3,
    } = options;

    try {
      updateProgress('processing', 'Processing your knowledge items...', 10);

      const params = new URLSearchParams();
      params.set('ai', String(useAI));
      params.set('toc', String(includeTOC));
      params.set('narrative', String(includeNarrative));
      params.set('flow', layoutFlow);
      params.set('featured', String(featuredCount));

      updateProgress('generating', 'Generating AI-powered narrative...', 30);

      const response = await fetch(`/api/items/export-v2?${params.toString()}`);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate PDF');
      }

      updateProgress('downloading', 'Downloading your PDF...', 80);

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `mnemoai-knowledge-${new Date().toISOString().split('T')[0]}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      setLastExportDate(new Date());
      updateProgress('complete', 'Export complete!', 100);
      
      setTimeout(() => {
        setProgress({ stage: 'idle', message: '' });
      }, 2000);

      setIsExporting(false);
      return true;
    } catch (err: any) {
      console.error('Export error:', err);
      setError(err.message || 'Failed to export PDF');
      updateProgress('error', err.message || 'Export failed');
      setIsExporting(false);
      return false;
    }
  }, [isLoaded, isSignedIn, updateProgress]);

  const exportWithDebug = useCallback(async () => {
    if (!isLoaded || !isSignedIn) {
      setError('Please sign in to export your knowledge');
      return false;
    }

    setIsExporting(true);
    setError(null);

    try {
      updateProgress('processing', 'Fetching items for debug report...', 10);

      const response = await fetch('/api/items/export-v2?debug=true&ai=false');

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate debug report');
      }

      const data = await response.json();
      
      console.log('\n' + data.report + '\n');

      updateProgress('complete', 'Debug report generated', 100);
      setIsExporting(false);
      return true;
    } catch (err: any) {
      console.error('Debug export error:', err);
      setError(err.message || 'Failed to generate debug report');
      updateProgress('error', err.message || 'Debug export failed');
      setIsExporting(false);
      return false;
    }
  }, [isLoaded, isSignedIn, updateProgress]);

  const clearError = useCallback(() => {
    setError(null);
    setProgress({ stage: 'idle', message: '' });
  }, []);

  return {
    exportToPDF,
    exportWithDebug,
    isExporting,
    progress,
    error,
    lastExportDate,
    clearError,
    isAvailable: isLoaded && isSignedIn,
  };
};

export type { ExportOptions as PDFExportOptions };
