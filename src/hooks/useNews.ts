import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { NewsItem } from '@/types';
import { API_URLS } from '@/config/api';

export const useNews = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const { toast } = useToast();

  const loadNews = async () => {
    try {
      const response = await fetch(API_URLS.news);
      const data = await response.json();
      setNews(data);
    } catch (error) {
      console.error('Ошибка загрузки новостей:', error);
    }
  };

  const handleCreateNews = async (newsData: { title: string; content: string; image_url?: string; video_url?: string }, userId?: number) => {
    if (!userId) return;
    
    try {
      const response = await fetch(API_URLS.news, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'X-User-Id': userId.toString()
        },
        body: JSON.stringify(newsData)
      });
      
      const data = await response.json();
      
      if (data.success) {
        toast({ title: 'Новость опубликована!' });
        loadNews();
      }
    } catch (error) {
      toast({ title: 'Ошибка', description: 'Не удалось опубликовать новость', variant: 'destructive' });
    }
  };

  return {
    news,
    loadNews,
    handleCreateNews
  };
};
