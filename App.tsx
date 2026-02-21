
import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Plus, Search, Ghost, BookOpen } from 'lucide-react';
import { Story, Category } from './types';
import { Button } from './components/Button';
import { StoryCard } from './components/StoryCard';
import { AddStoryModal } from './components/AddStoryModal';
import { ReaderModal } from './components/ReaderModal';
import { AudioPlayer } from './components/AudioPlayer';
import { Logo } from './components/Logo';
import { generateSpeech, decodeBase64, decodeAudioData } from './services/geminiService';

const INITIAL_STORIES: Story[] = [
  {
    id: '1',
    title: 'The Clockwork Nightingale',
    author: 'Elias Thorne',
    content: 'In the heart of the smog-choked city, a mechanical bird sang a song of ancient forests. It was the only thing that kept Silas awake during the long night shifts at the foundry. One evening, the bird skipped a beat, and in that silence, Silas heard a voice calling from beneath the gears.',
    category: Category.SciFi,
    coverImage: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&q=80&w=800',
    createdAt: Date.now() - 86400000
  },
  {
    id: '2',
    title: 'The Shadow Collector',
    author: 'Mira Valeska',
    content: 'Elara didn’t steal gold or secrets; she stole shadows. In a world where shadows were the weight of a person’s soul, she was the wealthiest person alive—and the loneliest. But when she accidentally took the shadow of a man who was already dead, she realized some shadows shouldn’t be touched.',
    category: Category.Fantasy,
    coverImage: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&q=80&w=800',
    createdAt: Date.now() - 172800000
  },
  {
    id: '3',
    title: 'Whispers in the Mist',
    author: 'Jasper Gray',
    content: 'The lighthouse on Omen Isle hadn’t been lit in fifty years. Yet, every Tuesday, a single beam of violet light swept across the churning bay. Captain Miller knew the legends, but curiosity is a dangerous companion for an old sailor.',
    category: Category.Mystery,
    coverImage: 'https://images.unsplash.com/photo-1475924156734-496f6cac6ec1?auto=format&fit=crop&q=80&w=800',
    createdAt: Date.now() - 259200000
  }
];

const App: React.FC = () => {
  const [stories, setStories] = useState<Story[]>(() => {
    try {
      const saved = localStorage.getItem('astrozoom_stories');
      return saved ? JSON.parse(saved) : INITIAL_STORIES;
    } catch (e) {
      return INITIAL_STORIES;
    }
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [readingStory, setReadingStory] = useState<Story | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<Category | 'All'>('All');
  
  // Audio State
  const [currentStory, setCurrentStory] = useState<Story | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isBuffering, setIsBuffering] = useState(false);
  
  // Audio Web API Refs
  const audioContextRef = useRef<AudioContext | null>(null);
  const sourceRef = useRef<AudioBufferSourceNode | null>(null);

  useEffect(() => {
    localStorage.setItem('astrozoom_stories', JSON.stringify(stories));
  }, [stories]);

  const handleAddStory = (newStory: Omit<Story, 'id' | 'createdAt'>) => {
    const story: Story = {
      ...newStory,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: Date.now()
    };
    setStories(prev => [story, ...prev]);
  };

  const stopAudio = useCallback(() => {
    if (sourceRef.current) {
      try {
        sourceRef.current.stop();
      } catch (e) {}
      sourceRef.current = null;
    }
    setIsPlaying(false);
  }, []);

  const handlePlayStory = async (story: Story) => {
    if (currentStory?.id === story.id && isPlaying) {
      stopAudio();
      return;
    }

    stopAudio();
    setCurrentStory(story);
    setIsBuffering(true);

    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      }
      
      const audioData = await generateSpeech(story.content);
      if (audioData) {
        const decodedBytes = decodeBase64(audioData);
        const audioBuffer = await decodeAudioData(decodedBytes, audioContextRef.current, 24000, 1);
        
        const source = audioContextRef.current.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(audioContextRef.current.destination);
        source.onended = () => setIsPlaying(false);
        
        source.start(0);
        sourceRef.current = source;
        setIsPlaying(true);
      }
    } catch (error) {
      console.error("Audio playback error:", error);
    } finally {
      setIsBuffering(false);
    }
  };

  const filteredStories = useMemo(() => {
    return stories.filter(s => {
      const matchesSearch = searchQuery === '' || 
        s.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        s.author.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = activeTab === 'All' || s.category === activeTab;
      return matchesSearch && matchesCategory;
    });
  }, [stories, searchQuery, activeTab]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500/30">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-slate-950/80 backdrop-blur-md border-b border-slate-900 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-slate-900 p-1.5 rounded-xl border border-slate-800 shadow-xl shadow-slate-950/50">
              <Logo size={32} className="text-white" />
            </div>
            <h1 className="text-xl font-medium tracking-tight">
              Stories
            </h1>
          </div>

          <div className="flex-1 max-w-md relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
            <input 
              className="w-full bg-slate-900/50 border border-slate-800 rounded-lg pl-10 pr-4 py-2 text-sm focus:ring-1 focus:ring-slate-700 outline-none transition-all placeholder:text-slate-600"
              placeholder="Search stories..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>

          <Button 
            onClick={() => setIsModalOpen(true)}
            icon={<Plus size={18} />}
          >
            <span className="hidden sm:inline">Add Story</span>
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-5xl mx-auto w-full px-6 py-8 pb-32">
        {/* Categories / Filter */}
        <div className="flex items-center gap-4 mb-12 overflow-x-auto pb-2 scrollbar-hide border-b border-slate-900">
          <button 
            onClick={() => setActiveTab('All')}
            className={`pb-2 text-sm font-medium transition-all border-b-2 ${activeTab === 'All' ? 'border-indigo-500 text-white' : 'border-transparent text-slate-500 hover:text-slate-300'}`}
          >
            All
          </button>
          {Object.values(Category).map(cat => (
            <button 
              key={cat}
              onClick={() => setActiveTab(cat)}
              className={`pb-2 text-sm font-medium whitespace-nowrap transition-all border-b-2 ${activeTab === cat ? 'border-indigo-500 text-white' : 'border-transparent text-slate-500 hover:text-slate-300'}`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Stories Grid */}
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-lg font-medium text-slate-400">
            Discover
          </h2>
        </div>

        {filteredStories.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredStories.map(story => (
              <StoryCard 
                key={story.id} 
                story={story} 
                onPlay={handlePlayStory}
                onRead={() => setReadingStory(story)}
              />
            ))}
          </div>
        ) : (
          <div className="py-20 flex flex-col items-center text-slate-500">
            <Ghost size={64} className="mb-4 opacity-20" />
            <p className="text-lg">This sector of space is empty.</p>
            <Button variant="ghost" className="mt-4" onClick={() => { setSearchQuery(''); setActiveTab('All'); }}>Reset scanners</Button>
          </div>
        )}
      </main>

      <AudioPlayer 
        story={currentStory} 
        isPlaying={isPlaying} 
        isBuffering={isBuffering}
        onTogglePlay={() => {
          if (isPlaying) stopAudio();
          else if (currentStory) handlePlayStory(currentStory);
        }}
        onClose={() => {
          stopAudio();
          setCurrentStory(null);
        }}
      />

      {readingStory && (
        <ReaderModal 
          story={readingStory} 
          onClose={() => setReadingStory(null)} 
        />
      )}

      {isModalOpen && (
        <AddStoryModal 
          onClose={() => setIsModalOpen(false)} 
          onAdd={handleAddStory} 
        />
      )}

      {/* Remove the AI badge */}
    </div>
  );
};

export default App;
