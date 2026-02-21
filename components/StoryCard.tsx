
import React from 'react';
import { Story } from '../types';
import { Play, BookOpen } from 'lucide-react';

interface StoryCardProps {
  story: Story;
  onPlay: (story: Story) => void;
  onRead: (story: Story) => void;
}

export const StoryCard: React.FC<StoryCardProps> = ({ story, onPlay, onRead }) => {
  return (
    <div className="group flex flex-col bg-transparent border border-slate-900 rounded-lg overflow-hidden hover:border-slate-700 transition-all duration-300">
      <div className="aspect-[16/10] relative overflow-hidden bg-slate-900">
        <img 
          src={story.coverImage} 
          alt={story.title}
          className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-500"
        />
        <div className="absolute top-3 right-3">
          <span className="text-[10px] uppercase tracking-wider font-medium px-2 py-0.5 bg-slate-950/50 backdrop-blur-sm text-slate-300 border border-slate-800 rounded">
            {story.category}
          </span>
        </div>
      </div>
      
      <div className="p-4 flex-1 flex flex-col">
        <h3 className="text-base font-medium text-slate-100 line-clamp-1 mb-1">
          {story.title}
        </h3>
        <p className="text-xs text-slate-500 mb-6 font-serif italic">by {story.author}</p>
        
        <div className="mt-auto flex items-center justify-between gap-4">
          <button 
            onClick={() => onPlay(story)}
            className="flex items-center gap-2 text-xs font-medium text-slate-400 hover:text-white transition-colors"
          >
            <Play size={14} />
            Listen
          </button>
          <button 
            onClick={() => onRead(story)}
            className="text-slate-500 hover:text-white transition-colors"
          >
            <BookOpen size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};
