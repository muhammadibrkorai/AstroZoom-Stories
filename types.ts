
export interface Story {
  id: string;
  title: string;
  author: string;
  content: string;
  category: string;
  coverImage: string;
  createdAt: number;
}

export interface AudioState {
  isPlaying: boolean;
  isBuffering: boolean;
  currentStoryId: string | null;
  progress: number;
}

export enum Category {
  Fantasy = 'Fantasy',
  SciFi = 'Sci-Fi',
  Mystery = 'Mystery',
  Horror = 'Horror',
  Adventure = 'Adventure',
  Romance = 'Romance'
}
