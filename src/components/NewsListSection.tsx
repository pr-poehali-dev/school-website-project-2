import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import Icon from '@/components/ui/icon';

interface NewsItem {
  id: number;
  title: string;
  content: string;
  author_name: string;
  image_url?: string;
  video_url?: string;
  created_at: string;
}

interface NewsListSectionProps {
  news: NewsItem[];
  isAdmin: boolean;
  onCreateNews: (data: { title: string; content: string; image_url?: string; video_url?: string }) => void;
}

const NewsListSection = ({ news, isAdmin, onCreateNews }: NewsListSectionProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({ title: '', content: '', image_url: '', video_url: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCreateNews({
      title: formData.title,
      content: formData.content,
      image_url: formData.image_url || undefined,
      video_url: formData.video_url || undefined
    });
    setFormData({ title: '', content: '', image_url: '', video_url: '' });
    setIsDialogOpen(false);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold flex items-center gap-2">
          <Icon name="Newspaper" className="text-primary" />
          Все новости
        </h2>
        {isAdmin && (
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-primary to-secondary">
                <Icon name="Plus" size={18} className="mr-2" />
                Создать новость
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Создать новость</DialogTitle>
                <DialogDescription>Заполните информацию о новости</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="title">Заголовок</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="content">Содержание</Label>
                  <Textarea
                    id="content"
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    rows={6}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="image_url">URL изображения (необязательно)</Label>
                  <Input
                    id="image_url"
                    type="url"
                    value={formData.image_url}
                    onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
                <div>
                  <Label htmlFor="video_url">URL видео (необязательно)</Label>
                  <Input
                    id="video_url"
                    type="url"
                    value={formData.video_url}
                    onChange={(e) => setFormData({ ...formData, video_url: e.target.value })}
                    placeholder="https://example.com/video.mp4"
                  />
                </div>
                <div className="flex gap-2">
                  <Button type="submit" className="flex-1">Опубликовать</Button>
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Отмена</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </div>
      <div className="grid md:grid-cols-2 gap-6">
        {news.map((item) => (
          <Card key={item.id} className="hover:shadow-lg transition-shadow">
            {item.image_url && (
              <img src={item.image_url} alt={item.title} className="w-full h-64 object-cover rounded-t-lg" />
            )}
            {item.video_url && (
              <video src={item.video_url} controls className="w-full h-64 rounded-t-lg" />
            )}
            <CardHeader>
              <CardTitle>{item.title}</CardTitle>
              <CardDescription className="flex items-center gap-2">
                <Icon name="User" size={14} />
                {item.author_name} • {new Date(item.created_at).toLocaleDateString('ru')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground whitespace-pre-wrap">{item.content}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default NewsListSection;