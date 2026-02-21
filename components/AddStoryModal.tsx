import React, { useState, useRef } from 'react';
import { X, Upload, Link as LinkIcon, Image as ImageIcon } from 'lucide-react';
import { Button } from './Button';
import { Story, Category } from '../types';

interface AddStoryModalProps {
  onClose: () => void;
  onAdd: (story: Omit<Story, 'id' | 'createdAt'>) => void;
}

export const AddStoryModal: React.FC<AddStoryModalProps> = ({ onClose, onAdd }) => {
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    content: '',
    category: Category.Fantasy,
    coverImage: 'https://picsum.photos/seed/' + Math.random() + '/800/600',
  });
  const [uploadMode, setUploadMode] = useState<'url' | 'file'>('url');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.content || !formData.author) return;
    onAdd(formData);
    onClose();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, coverImage: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-sm">
      <div className="bg-slate-950 border border-slate-900 w-full max-w-xl rounded-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between p-6 border-b border-slate-900">
          <h2 className="text-lg font-medium">
            New Story
          </h2>
          <button onClick={onClose} className="text-slate-600 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          {/* Image Preview Section */}
          <div className="space-y-3">
            <label className="text-[10px] uppercase tracking-wider font-medium text-slate-500">
              Cover Image
            </label>
            <div className="relative aspect-[16/9] rounded-md overflow-hidden bg-slate-900 border border-slate-800 group">
              {formData.coverImage ? (
                <img 
                  src={formData.coverImage} 
                  alt="Preview" 
                  className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-slate-700">
                  <ImageIcon size={48} strokeWidth={1} />
                </div>
              )}
              <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <button 
                  type="button"
                  onClick={() => setUploadMode('url')}
                  className={`p-2 rounded-full transition-colors ${uploadMode === 'url' ? 'bg-white text-black' : 'bg-slate-900 text-white hover:bg-slate-800'}`}
                  title="Use URL"
                >
                  <LinkIcon size={16} />
                </button>
                <button 
                  type="button"
                  onClick={() => {
                    setUploadMode('file');
                    fileInputRef.current?.click();
                  }}
                  className={`p-2 rounded-full transition-colors ${uploadMode === 'file' ? 'bg-white text-black' : 'bg-slate-900 text-white hover:bg-slate-800'}`}
                  title="Upload File"
                >
                  <Upload size={16} />
                </button>
              </div>
            </div>
            
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
              accept="image/*" 
              className="hidden" 
            />

            {uploadMode === 'url' && (
              <input
                className="w-full bg-transparent border-b border-slate-900 px-0 py-2 outline-none text-xs text-slate-400 focus:text-white transition-colors"
                placeholder="Paste image URL..."
                value={formData.coverImage}
                onChange={e => setFormData({ ...formData, coverImage: e.target.value })}
              />
            )}
          </div>

          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase tracking-wider font-medium text-slate-500">
                Title
              </label>
              <input
                required
                className="w-full bg-transparent border-b border-slate-900 px-0 py-2 focus:border-white outline-none transition-all text-sm"
                placeholder="The Whispering Woods..."
                value={formData.title}
                onChange={e => setFormData({ ...formData, title: e.target.value })}
              />
            </div>
            
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase tracking-wider font-medium text-slate-500">
                Author
              </label>
              <input
                required
                className="w-full bg-transparent border-b border-slate-900 px-0 py-2 focus:border-white outline-none transition-all text-sm"
                placeholder="Your name"
                value={formData.author}
                onChange={e => setFormData({ ...formData, author: e.target.value })}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] uppercase tracking-wider font-medium text-slate-500">
                Category
              </label>
              <select
                className="w-full bg-transparent border-b border-slate-900 px-0 py-2 outline-none text-sm appearance-none"
                value={formData.category}
                onChange={e => setFormData({ ...formData, category: e.target.value as Category })}
              >
                {Object.values(Category).map(cat => (
                  <option key={cat} value={cat} className="bg-slate-950">{cat}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] uppercase tracking-wider font-medium text-slate-500">Content</label>
              <textarea
                required
                rows={6}
                className="w-full bg-transparent border border-slate-900 rounded-md p-3 focus:border-white outline-none transition-all resize-none text-sm leading-relaxed"
                placeholder="Write your narrative..."
                value={formData.content}
                onChange={e => setFormData({ ...formData, content: e.target.value })}
              />
            </div>
          </div>

          <div className="pt-4 flex justify-end gap-4">
            <button type="button" onClick={onClose} className="text-xs text-slate-500 hover:text-white transition-colors">Cancel</button>
            <Button variant="primary" size="sm" type="submit">Publish</Button>
          </div>
        </form>
      </div>
    </div>
  );
};
