import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
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
}

const NewsListSection = ({ news }: NewsListSectionProps) => {
  return (
    <div className="space-y-6 animate-fade-in">
      <h2 className="text-3xl font-bold flex items-center gap-2">
        <Icon name="Newspaper" className="text-primary" />
        Все новости
      </h2>
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
