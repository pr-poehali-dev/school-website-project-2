import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

interface HeaderProps {
  onAuthClick: () => void;
  onAttendanceClick: () => void;
  isLoggedIn: boolean;
  isAdmin: boolean;
}

const Header = ({ onAuthClick, onAttendanceClick, isLoggedIn, isAdmin }: HeaderProps) => {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-50 backdrop-blur-lg bg-white/80 border-b border-purple-200 shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center">
              <Icon name="GraduationCap" className="text-white" size={24} />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Школьный Клуб
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-6">
            <button
              onClick={() => scrollToSection('hero')}
              className="text-foreground hover:text-primary transition-colors font-medium"
            >
              Главная
            </button>
            {isLoggedIn && (
              <button
                onClick={onAttendanceClick}
                className="text-foreground hover:text-primary transition-colors font-medium"
              >
                Посещаемость
              </button>
            )}
            <button
              onClick={() => scrollToSection('news')}
              className="text-foreground hover:text-primary transition-colors font-medium"
            >
              Новости
            </button>
            <button
              onClick={() => scrollToSection('contacts')}
              className="text-foreground hover:text-primary transition-colors font-medium"
            >
              Контакты
            </button>
          </nav>

          <Button
            onClick={onAuthClick}
            className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 transition-opacity"
          >
            {isLoggedIn ? (
              <>
                <Icon name="User" size={18} />
                {isAdmin ? 'Админ' : 'Профиль'}
              </>
            ) : (
              <>
                <Icon name="LogIn" size={18} />
                Войти
              </>
            )}
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
