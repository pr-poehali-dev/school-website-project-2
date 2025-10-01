import { Button } from '@/components/ui/button';

interface SchoolFooterProps {
  onNavigate: (section: string) => void;
}

const SchoolFooter = ({ onNavigate }: SchoolFooterProps) => {
  return (
    <footer className="bg-white border-t border-purple-200 mt-16">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-muted-foreground">© 2024 Школьный Клуб. Все права защищены.</p>
          <div className="flex gap-4">
            <Button variant="ghost" size="sm" onClick={() => onNavigate('home')}>Главная</Button>
            <Button variant="ghost" size="sm" onClick={() => onNavigate('news')}>Новости</Button>
            <Button variant="ghost" size="sm" onClick={() => onNavigate('application')}>Вступить</Button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default SchoolFooter;
