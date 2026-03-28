import { useState, useCallback } from 'react';
import { useAuth } from '@clerk/nextjs';

export const useExport = () => {
  const { isLoaded, isSignedIn } = useAuth();
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const exportToPDF = useCallback(async () => {
    if (!isLoaded || !isSignedIn) {
      setError('Please sign in to export your knowledge');
      return false;
    }

    setIsExporting(true);
    setExportProgress('Generating PDF...');
    setError(null);

    try {
      const response = await fetch('/api/items/export-pdf');
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate PDF');
      }

      setExportProgress('Downloading...');

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `mnemoai-export-${new Date().toISOString().split('T')[0]}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      setExportProgress('');
      setIsExporting(false);
      return true;
    } catch (err: any) {
      console.error('Export error:', err);
      setError(err.message || 'Failed to export PDF');
      setIsExporting(false);
      setExportProgress('');
      return false;
    }
  }, [isLoaded, isSignedIn]);

  return {
    exportToPDF,
    isExporting,
    exportProgress,
    error,
    clearError: () => setError(null),
  };
};
