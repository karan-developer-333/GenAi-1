'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface CreateCollectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (name: string, description: string, icon: string, color: string) => void;
}

const icons = ['📚', '💡', '🚀', '🎯', '⚡', '🎨', '🤖', '💼', '🔬', '📝', '🎓', '🌟'];
const colors = [
  { name: 'Gold', value: '#b8860b' },
  { name: 'Rose', value: '#c9707d' },
  { name: 'Sage', value: '#7d9a78' },
  { name: 'Navy', value: '#34495e' },
  { name: 'Amber', value: '#d4a853' },
  { name: 'Pink', value: '#d4a0a8' },
];

export default function CreateCollectionModal({ isOpen, onClose, onCreate }: CreateCollectionModalProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedIcon, setSelectedIcon] = useState('📚');
  const [selectedColor, setSelectedColor] = useState('#b8860b');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onCreate(name, description, selectedIcon, selectedColor);
      setName('');
      setDescription('');
      setSelectedIcon('📚');
      setSelectedColor('#b8860b');
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-md p-6 rounded-2xl bg-white border border-[var(--border-light)] shadow-xl"
          >
            <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-6">Create Collection</h2>
            
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                  Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="My awesome collection"
                  className={cn(
                    'w-full px-4 py-3 rounded-xl',
                    'bg-white border border-[var(--border-light)]',
                    'text-[var(--text-primary)] placeholder-[var(--text-muted)]',
                    'focus:outline-none focus:border-[var(--amber-primary)]',
                    'transition-colors'
                  )}
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                  Description (optional)
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="What's this collection about?"
                  rows={3}
                  className={cn(
                    'w-full px-4 py-3 rounded-xl resize-none',
                    'bg-white border border-[var(--border-light)]',
                    'text-[var(--text-primary)] placeholder-[var(--text-muted)]',
                    'focus:outline-none focus:border-[var(--amber-primary)]',
                    'transition-colors'
                  )}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                  Icon
                </label>
                <div className="flex flex-wrap gap-2">
                  {icons.map((icon) => (
                    <motion.button
                      key={icon}
                      type="button"
                      onClick={() => setSelectedIcon(icon)}
                      className={cn(
                        'w-10 h-10 rounded-xl flex items-center justify-center text-xl',
                        'transition-all duration-200',
                        selectedIcon === icon
                          ? 'bg-[var(--amber-primary)] text-white scale-110'
                          : 'bg-gray-50 hover:bg-gray-100'
                      )}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {icon}
                    </motion.button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                  Color
                </label>
                <div className="flex flex-wrap gap-3">
                  {colors.map((color) => (
                    <motion.button
                      key={color.value}
                      type="button"
                      onClick={() => setSelectedColor(color.value)}
                      className={cn(
                        'w-10 h-10 rounded-full',
                        'transition-all duration-200',
                        'flex items-center justify-center',
                        selectedColor === color.value && 'ring-2 ring-offset-2 ring-[var(--amber-primary)]'
                      )}
                      style={{ backgroundColor: color.value }}
                      whileHover={{ scale: 1.15 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {selectedColor === color.value && (
                        <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </motion.button>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <motion.button
                  type="button"
                  onClick={onClose}
                  className="flex-1 btn-secondary"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Cancel
                </motion.button>
                <motion.button
                  type="submit"
                  disabled={!name.trim()}
                  className={cn(
                    'flex-1 btn-primary',
                    !name.trim() && 'opacity-50 cursor-not-allowed'
                  )}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Create
                </motion.button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
