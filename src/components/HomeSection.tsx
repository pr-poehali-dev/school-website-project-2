import { Button } from '@/components/ui/button';
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

interface HomeSectionProps {
  news: NewsItem[];
  onNavigate: (section: string) => void;
}

const HomeSection = ({ news, onNavigate }: HomeSectionProps) => {
  return (
    <div className="space-y-12 animate-fade-in">
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-primary via-secondary to-accent p-12 text-white">
        <div className="relative z-10 max-w-2xl">
          <h1 className="text-5xl font-bold mb-4 animate-slide-up">Добро пожаловать в наш клуб!</h1>
          <p className="text-xl mb-6 opacity-90">
            Присоединяйся к самому активному школьному сообществу. Новые друзья, события и возможности!
          </p>
          <Button 
            onClick={() => onNavigate('application')} 
            size="lg" 
            className="bg-white text-primary hover:bg-white/90"
          >
            <Icon name="Rocket" size={20} className="mr-2" />
            Подать заявку
          </Button>
        </div>
        <div className="absolute right-0 top-0 h-full w-1/2 opacity-20">
          <img src="/img/e3ccce7c-59d8-4853-af26-9b6971bbf48a.jpg" alt="hero" className="h-full w-full object-cover" />
        </div>
      </section>

      <section>
        <h2 className="text-3xl font-bold mb-6 flex items-center gap-2">
          <Icon name="Newspaper" className="text-primary" />
          Последние новости
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {news.slice(0, 3).map((item) => (
            <Card key={item.id} className="hover:shadow-lg transition-shadow animate-scale-in">
              {item.image_url && (
                <img src={item.image_url} alt={item.title} className="w-full h-48 object-cover rounded-t-lg" />
              )}
              <CardHeader>
                <CardTitle className="line-clamp-2">{item.title}</CardTitle>
                <CardDescription className="flex items-center gap-2">
                  <Icon name="User" size={14} />
                  {item.author_name}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground line-clamp-3">{item.content}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
};

export default HomeSection;