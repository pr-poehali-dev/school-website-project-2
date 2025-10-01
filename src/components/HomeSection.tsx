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
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-400 via-cyan-300 to-teal-200 p-12 text-white">
        <div className="absolute inset-0">
          <img 
            src="https://cdn.poehali.dev/files/448c6e36-61cb-4881-a227-527535576bb9.jpg" 
            alt="Клуб рисования" 
            className="h-full w-full object-cover opacity-30"
          />
        </div>
        <div className="relative z-10 max-w-2xl">
          <h1 className="text-5xl font-bold mb-4 animate-slide-up drop-shadow-lg">Клуб по рисованию</h1>
          <p className="text-xl mb-6 opacity-95 drop-shadow">
            Раскройте свой творческий потенциал и научитесь создавать произведения искусства вместе с опытными художниками!
          </p>
          <Button 
            onClick={() => onNavigate('application')} 
            size="lg" 
            className="bg-white text-blue-600 hover:bg-white/90 shadow-lg"
          >
            <Icon name="Palette" size={20} className="mr-2" />
            Вступить в клуб
          </Button>
        </div>
      </section>

      <section>
        <h2 className="text-3xl font-bold mb-6 flex items-center gap-2">
          <Icon name="Sparkles" className="text-primary" />
          Почему стоит вступить в клуб
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-2">
                <Icon name="Brain" className="text-purple-600" size={24} />
              </div>
              <CardTitle>Развитие творческих способностей</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p>• Улучшение моторики и работы мозга</p>
              <p>• Развитие памяти и визуального мышления</p>
              <p>• Креативное мышление и нестандартные решения</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center mb-2">
                <Icon name="Heart" className="text-pink-600" size={24} />
              </div>
              <CardTitle>Личностный рост</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p>• Эмоциональная устойчивость и снятие стресса</p>
              <p>• Целеустремленность и умение завершать дела</p>
              <p>• Пространственное мышление и перспектива</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-2">
                <Icon name="Users" className="text-blue-600" size={24} />
              </div>
              <CardTitle>Практические преимущества</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p>• Профессиональные художники-преподаватели</p>
              <p>• Творческое сообщество единомышленников</p>
              <p>• Новые техники и создание портфолио</p>
            </CardContent>
          </Card>
        </div>

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