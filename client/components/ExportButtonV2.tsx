'use client';

import React, { useState } from 'react';
import { Download, Loader2, Settings, Sparkles, FileText, LayoutGrid, Clock, BookOpen } from 'lucide-react';
import { useExportV2, ExportOptions } from '@/hooks/useExportV2';
import { motion, AnimatePresence } from 'framer-motion';

interface ExportButtonProps {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  showOptions?: boolean;
  className?: string;
}

export const ExportButtonV2: React.FC<ExportButtonProps> = ({
  variant = 'primary',
  size = 'md',
  showOptions = true,
  className = '',
}) => {
  const [showOptionsPanel, setShowOptionsPanel] = useState(false);
  const [options, setOptions] = useState<ExportOptions>({
    useAI: true,
    includeTOC: true,
    includeNarrative: true,
    layoutFlow: 'mixed',
    featuredCount: 3,
  });

  const { exportToPDF, isExporting, progress, error, isAvailable } = useExportV2();

  const handleExport = async () => {
    await exportToPDF(options);
    setShowOptionsPanel(false);
  };

  const handleOptionChange = (key: keyof ExportOptions, value: any) => {
    setOptions(prev => ({ ...prev, [key]: value }));
  };

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-xs gap-1.5',
    md: 'px-4 py-2 text-sm gap-2',
    lg: 'px-5 py-2.5 text-sm gap-2',
  };

  const variantClasses = {
    primary: 'bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/20',
    secondary: 'bg-secondary text-secondary-foreground border border-border hover:border-accent/50',
    ghost: 'bg-transparent text-foreground hover:bg-muted/50',
  };

  const progressColors: Record<string, string> = {
    idle: 'text-muted-foreground',
    processing: 'text-accent',
    generating: 'text-purple-400',
    downloading: 'text-green-400',
    complete: 'text-green-500',
    error: 'text-red-400',
  };

  const layoutOptions = [
    { value: 'mixed', label: 'Smart Mix', icon: LayoutGrid },
    { value: 'chronological', label: 'By Date', icon: Clock },
    { value: 'thematic', label: 'By Topic', icon: BookOpen },
    { value: 'importance', label: 'By Priority', icon: Sparkles },
  ] as const;

  return (
    <div className={`relative ${className}`}>
      <div className="flex items-center gap-2">
        <motion.button
          onClick={handleExport}
          disabled={isExporting || !isAvailable}
          whileHover={{ scale: isExporting ? 1 : 1.02 }}
          whileTap={{ scale: isExporting ? 1 : 0.98 }}
          className={`
            inline-flex items-center justify-center rounded-xl font-medium 
            transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed
            ${variantClasses[variant]}
            ${sizeClasses[size]}
          `}
        >
          {isExporting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span className={progressColors[progress.stage]}>{progress.message}</span>
            </>
          ) : (
            <>
              <Download className="w-4 h-4" />
              <span>Export PDF</span>
            </>
          )}
        </motion.button>

        {showOptions && (
          <motion.button
            onClick={() => setShowOptionsPanel(!showOptionsPanel)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`
              p-2 rounded-xl transition-all duration-200 backdrop-blur-sm
              ${variant === 'primary' 
                ? 'bg-primary/20 text-primary-foreground hover:bg-primary/30' 
                : 'bg-muted/50 text-muted-foreground hover:text-foreground hover:bg-muted'}
            `}
            title="Customize export"
          >
            <Settings className={`w-4 h-4 ${showOptionsPanel ? 'animate-spin' : ''}`} style={{ animationDuration: '2s' }} />
          </motion.button>
        )}
      </div>

      <AnimatePresence>
        {showOptionsPanel && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40" 
              onClick={() => setShowOptionsPanel(false)} 
            />
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="absolute top-full right-0 mt-2 w-80 bg-card/95 backdrop-blur-xl border border-border rounded-2xl shadow-2xl z-50 overflow-hidden"
            >
              <div className="p-4 border-b border-border/50 bg-gradient-to-r from-primary/5 to-accent/5">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Sparkles className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-foreground">Export Settings</h3>
                    <p className="text-xs text-muted-foreground">Customize your PDF output</p>
                  </div>
                </div>
              </div>

              <div className="p-4 space-y-5">
                <div className="flex items-center justify-between p-3 rounded-xl bg-muted/30">
                  <div className="flex items-center gap-3">
                    <div className="p-1.5 rounded-lg bg-accent/10">
                      <Sparkles className="w-4 h-4 text-accent" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">AI Narrative</p>
                      <p className="text-xs text-muted-foreground">Generate story intro</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleOptionChange('useAI', !options.useAI)}
                    className={`
                      relative w-11 h-6 rounded-full transition-colors duration-200
                      ${options.useAI ? 'bg-primary' : 'bg-muted'}
                    `}
                  >
                    <div className={`
                      absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-md transition-transform duration-200
                      ${options.useAI ? 'translate-x-5' : 'translate-x-0.5'}
                    `} />
                  </button>
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl bg-muted/30">
                  <div className="flex items-center gap-3">
                    <div className="p-1.5 rounded-lg bg-accent/10">
                      <FileText className="w-4 h-4 text-accent" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">Table of Contents</p>
                      <p className="text-xs text-muted-foreground">Add article index</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleOptionChange('includeTOC', !options.includeTOC)}
                    className={`
                      relative w-11 h-6 rounded-full transition-colors duration-200
                      ${options.includeTOC ? 'bg-primary' : 'bg-muted'}
                    `}
                  >
                    <div className={`
                      absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-md transition-transform duration-200
                      ${options.includeTOC ? 'translate-x-5' : 'translate-x-0.5'}
                    `} />
                  </button>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <LayoutGrid className="w-4 h-4 text-muted-foreground" />
                    <label className="text-sm font-medium text-foreground">Layout Style</label>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {layoutOptions.map(({ value, label, icon: Icon }) => (
                      <button
                        key={value}
                        onClick={() => handleOptionChange('layoutFlow', value)}
                        className={`
                          flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-medium transition-all duration-200
                          ${options.layoutFlow === value 
                            ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20' 
                            : 'bg-muted/30 text-muted-foreground hover:bg-muted/50'}
                        `}
                      >
                        <Icon className="w-3.5 h-3.5" />
                        {label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-muted-foreground" />
                      <label className="text-sm font-medium text-foreground">Featured Articles</label>
                    </div>
                    <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-semibold">
                      {options.featuredCount}
                    </span>
                  </div>
                  <div className="relative">
                    <div className="h-2 bg-muted/30 rounded-full overflow-hidden">
                    <motion.div 
                      className="h-full bg-gradient-to-r from-primary to-accent rounded-full"
                      initial={{ width: '60%' }}
                      animate={{ width: `${((options.featuredCount || 3) / 5) * 100}%` }}
                      transition={{ duration: 0.3 }}
                    />
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="5"
                      value={options.featuredCount}
                      onChange={(e) => handleOptionChange('featuredCount', parseInt(e.target.value))}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>None</span>
                    <span>5 max</span>
                  </div>
                </div>
              </div>

              <div className="p-4 border-t border-border/50 bg-muted/20">
                <motion.button
                  onClick={handleExport}
                  disabled={isExporting}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-2.5 px-4 bg-gradient-to-r from-primary to-accent text-primary-foreground rounded-xl text-sm font-semibold shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-shadow disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isExporting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Generating PDF...
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4" />
                      Generate & Download
                    </>
                  )}
                </motion.button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full right-0 mt-2 px-4 py-3 bg-red-500/10 border border-red-500/20 rounded-xl z-50"
          >
            <p className="text-xs text-red-400">{error}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ExportButtonV2;
