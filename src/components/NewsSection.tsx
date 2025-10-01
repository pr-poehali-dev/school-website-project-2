import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import CreateArticleDialog from '@/components/CreateArticleDialog';

interface Article {
  id: number;
  title: string;
  content: string;
  image: string;
  date: string;
  category: string;
}

interface NewsSectionProps {
  isAdmin: boolean;
}

const NewsSection = ({ isAdmin }: NewsSectionProps) => {
  const [articles, setArticles] = useState<Article[]>([
    {
      id: 1,
      title: 'Открытие нового спортивного зала',
      content: 'В нашей школе появился современный спортивный зал с новым оборудованием для всех видов активности!',
      image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800',
      date: '15 сентября 2024',
      category: 'Спорт'
    },
    {
      id: 2,
      title: 'Победа в городской олимпиаде',
      content: 'Наша команда заняла первое место в городской олимпиаде по математике. Поздравляем победителей!',
      image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800',
      date: '10 сентября 2024',
      category: 'Достижения'
    },
    {
      id: 3,
      title: 'Творческий фестиваль "Краски осени"',
      content: 'Приглашаем всех на ежегодный творческий фестиваль! Выставки, концерты и мастер-классы.',
      image: 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=800',
      date: '5 сентября 2024',
      category: 'Мероприятия'
    }
  ]);

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const handleCreateArticle = (newArticle: Omit<Article, 'id'>) => {
    const article = {
      ...newArticle,
      id: articles.length + 1
    };
    setArticles([article, ...articles]);
  };

  return (
    <section id="news" className="py-20 bg-white/50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Новости и события
            </h2>
            <p className="text-lg text-foreground/70">Следите за последними новостями нашего клуба</p>
          </div>
          
          {isAdmin && (
            <Button
              onClick={() => setIsCreateDialogOpen(true)}
              className="bg-gradient-to-r from-primary to-secondary hover:opacity-90"
            >
              <Icon name="Plus" size={18} />
              Создать статью
            </Button>
          )}
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles.map((article) => (
            <Card key={article.id} className="overflow-hidden hover:shadow-2xl transition-shadow border-2 border-purple-100 group">
              <div className="relative overflow-hidden h-48">
                <img
                  src={article.image}
                  alt={article.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute top-4 right-4 px-3 py-1 bg-primary text-primary-foreground rounded-full text-sm font-semibold">
                  {article.category}
                </div>
              </div>
              <CardHeader>
                <div className="flex items-center gap-2 text-sm text-foreground/60 mb-2">
                  <Icon name="Calendar" size={16} />
                  {article.date}
                </div>
                <CardTitle className="text-xl group-hover:text-primary transition-colors">
                  {article.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-foreground/80 line-clamp-3">{article.content}</p>
                <Button variant="link" className="mt-4 p-0 h-auto text-primary font-semibold">
                  Читать далее
                  <Icon name="ArrowRight" size={16} />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <CreateArticleDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onCreateArticle={handleCreateArticle}
      />
    </section>
  );
};

export default NewsSection;
