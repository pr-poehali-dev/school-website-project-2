import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

interface HeroProps {
  onJoinClick: () => void;
}

const Hero = ({ onJoinClick }: HeroProps) => {
  return (
    <section id="hero" className="relative overflow-hidden py-20 md:py-32">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-200/30 via-cyan-200/30 to-pink-200/30 animate-pulse"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-block mb-6 px-6 py-2 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-full border-2 border-primary/20">
            <span className="text-primary font-semibold">🚀 Новый учебный сезон 2024-2025</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold mb-6 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent leading-tight">
            Школьный Клуб Активностей
          </h1>
          
          <p className="text-xl md:text-2xl text-foreground/80 mb-10 leading-relaxed">
            Присоединяйся к нашему сообществу! Участвуй в мероприятиях, развивайся вместе с нами и находи новых друзей
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={onJoinClick}
              size="lg"
              className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 transition-opacity text-lg px-8 py-6"
            >
              <Icon name="Users" size={22} />
              Подать заявку в клуб
            </Button>
            
            <Button
              onClick={() => document.getElementById('news')?.scrollIntoView({ behavior: 'smooth' })}
              size="lg"
              variant="outline"
              className="border-2 border-primary text-primary hover:bg-primary/10 text-lg px-8 py-6"
            >
              <Icon name="Newspaper" size={22} />
              Наши новости
            </Button>
          </div>

          <div className="grid grid-cols-3 gap-8 mt-16 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">250+</div>
              <div className="text-sm text-foreground/70">Участников</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-secondary mb-2">50+</div>
              <div className="text-sm text-foreground/70">Мероприятий</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-accent mb-2">15</div>
              <div className="text-sm text-foreground/70">Направлений</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
