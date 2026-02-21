
import React from 'react';
import { X } from 'lucide-react';
import { Story } from '../types';

interface ReaderModalProps {
  story: Story;
  onClose: () => void;
}

export const ReaderModal: React.FC<ReaderModalProps> = ({ story, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4 bg-slate-950/95 backdrop-blur-md">
      <div className="bg-slate-950 w-full max-w-3xl h-full sm:h-auto sm:max-h-[90vh] sm:rounded-lg border border-slate-900 flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-300">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-900 sticky top-0 bg-slate-950 z-10">
          <div className="min-w-0">
            <h2 className="text-xl font-medium truncate">{story.title}</h2>
            <p className="text-xs text-slate-500 uppercase tracking-widest mt-1 font-sans">By {story.author}</p>
          </div>
          <button 
            onClick={onClose} 
            className="p-2 text-slate-500 hover:text-white transition-colors"
            aria-label="Close reader"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-8 sm:p-12">
          <div className="max-w-2xl mx-auto">
            <div className="mb-12 aspect-[16/9] rounded-lg overflow-hidden border border-slate-900">
              <img 
                src={story.coverImage} 
                alt={story.title} 
                className="w-full h-full object-cover opacity-90"
              />
            </div>
            
            <article className="prose prose-invert prose-slate max-w-none">
              <div className="font-serif text-lg sm:text-xl leading-relaxed text-slate-300 space-y-6 whitespace-pre-wrap">
                {story.content}
              </div>
            </article>
            
            <div className="mt-16 pt-8 border-t border-slate-900 flex flex-col items-center text-center">
              <div className="w-12 h-1 bg-slate-800 rounded-full mb-4" />
              <p className="text-xs text-slate-600 uppercase tracking-[0.2em]">End of Narrative</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
