
import React from 'react';
import { Play, Pause, SkipForward, SkipBack, Volume2, X, Loader2 } from 'lucide-react';
import { Story } from '../types';

interface AudioPlayerProps {
  story: Story | null;
  isPlaying: boolean;
  isBuffering: boolean;
  onTogglePlay: () => void;
  onClose: () => void;
}

export const AudioPlayer: React.FC<AudioPlayerProps> = ({ 
  story, 
  isPlaying, 
  isBuffering,
  onTogglePlay, 
  onClose 
}) => {
  if (!story) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40">
      <div className="bg-slate-950 border-t border-slate-900 px-6 py-3 flex items-center justify-between gap-4 animate-in slide-in-from-bottom-full duration-300">
        <div className="flex items-center gap-4 min-w-0">
          <div className="flex-1 min-w-0">
            <h4 className="text-slate-100 text-sm font-medium truncate">{story.title}</h4>
            <p className="text-slate-500 text-[10px] uppercase tracking-wider">{story.author}</p>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <button 
            onClick={onTogglePlay}
            className="text-slate-300 hover:text-white transition-colors"
          >
            {isBuffering ? (
              <Loader2 className="animate-spin" size={18} />
            ) : isPlaying ? (
              <Pause size={18} />
            ) : (
              <Play size={18} />
            )}
          </button>
          
          <button onClick={onClose} className="text-slate-600 hover:text-white transition-colors">
            <X size={16} />
          </button>
        </div>

        <div className="absolute top-0 left-0 right-0 h-[1px] bg-slate-900">
          <div className={`h-full bg-white transition-all duration-300 ${isPlaying ? 'w-1/3' : 'w-0'}`} />
        </div>
      </div>
    </div>
  );
};
