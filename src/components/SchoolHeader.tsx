import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

interface User {
  id: number;
  email: string;
  full_name: string;
  role: string;
}

interface SchoolHeaderProps {
  user: User | null;
  onNavigate: (section: string) => void;
  onLogout: () => void;
  onOpenAuth: () => void;
}

const SchoolHeader = ({ user, onNavigate, onLogout, onOpenAuth }: SchoolHeaderProps) => {
  return (
    <nav className="bg-white/80 backdrop-blur-md border-b border-purple-200 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
              <Icon name="Sparkles" className="text-white" size={24} />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Школьный Клуб
            </span>
          </div>
          
          <div className="hidden md:flex gap-6">
            <button onClick={() => onNavigate('home')} className="text-foreground hover:text-primary transition-colors">
              Главная
            </button>
            <button onClick={() => onNavigate('news')} className="text-foreground hover:text-primary transition-colors">
              Новости
            </button>
            {user && (
              <button onClick={() => onNavigate('grades')} className="text-foreground hover:text-primary transition-colors">
                Оценки
              </button>
            )}
            {user?.role === 'admin' && (
              <>
                <button onClick={() => onNavigate('attendance')} className="text-foreground hover:text-primary transition-colors">
                  Посещаемость
                </button>
                <button onClick={() => onNavigate('members')} className="text-foreground hover:text-primary transition-colors">
                  Участники
                </button>
              </>
            )}
            <button onClick={() => onNavigate('contacts')} className="text-foreground hover:text-primary transition-colors">
              Контакты
            </button>
          </div>

          <div className="flex items-center gap-2">
            {user ? (
              <div className="flex items-center gap-3">
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-medium">{user.full_name}</p>
                  <p className="text-xs text-muted-foreground">{user.role === 'admin' ? 'Администратор' : 'Участник'}</p>
                </div>
                <Button onClick={onLogout} variant="outline" size="sm">
                  <Icon name="LogOut" size={16} />
                </Button>
              </div>
            ) : (
              <Button onClick={onOpenAuth} className="bg-gradient-to-r from-primary to-secondary hover:opacity-90">
                <Icon name="UserPlus" size={16} className="mr-2" />
                Войти
              </Button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default SchoolHeader;