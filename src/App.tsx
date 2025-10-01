import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';
import { Toaster } from '@/components/ui/toaster';

const API_URLS = {
  auth: 'https://functions.poehali.dev/a056130a-20c0-4b35-827b-30e2d6a56a84',
  applications: 'https://functions.poehali.dev/d850ccdf-cc95-4cc6-a01a-ec3e479b3384',
  news: 'https://functions.poehali.dev/679d9f94-3b9e-446a-9587-43a330e48688',
  attendance: 'https://functions.poehali.dev/d2c26821-fa04-492f-9f68-d1903cb00009'
};

interface User {
  id: number;
  email: string;
  full_name: string;
  role: string;
}

interface NewsItem {
  id: number;
  title: string;
  content: string;
  author_name: string;
  image_url?: string;
  video_url?: string;
  created_at: string;
}

interface Application {
  id: number;
  full_name: string;
  email: string;
  phone: string;
  message: string;
  status: string;
  created_at: string;
}

interface AttendanceRecord {
  id: number;
  full_name: string;
  email: string;
  present: boolean;
  notes: string;
}

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [activeSection, setActiveSection] = useState('home');
  const [news, setNews] = useState<NewsItem[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [attendanceDate, setAttendanceDate] = useState(new Date().toISOString().split('T')[0]);
  const { toast } = useToast();

  useEffect(() => {
    loadNews();
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      const userData = JSON.parse(savedUser);
      setUser(userData);
      if (userData.role === 'admin') {
        loadApplications();
      }
    }
  }, []);

  useEffect(() => {
    if (activeSection === 'attendance') {
      loadAttendance();
    }
  }, [activeSection, attendanceDate]);

  const loadNews = async () => {
    try {
      const response = await fetch(API_URLS.news);
      const data = await response.json();
      setNews(data);
    } catch (error) {
      console.error('Ошибка загрузки новостей:', error);
    }
  };

  const loadApplications = async () => {
    try {
      const response = await fetch(API_URLS.applications, {
        headers: { 'X-User-Role': 'admin' }
      });
      const data = await response.json();
      setApplications(data);
    } catch (error) {
      console.error('Ошибка загрузки заявок:', error);
    }
  };

  const loadAttendance = async () => {
    try {
      const response = await fetch(`${API_URLS.attendance}?date=${attendanceDate}`);
      const data = await response.json();
      setAttendance(data.attendance || []);
    } catch (error) {
      console.error('Ошибка загрузки посещаемости:', error);
    }
  };

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    try {
      const response = await fetch(API_URLS.auth, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'login',
          email: formData.get('email'),
          password: formData.get('password')
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        setUser(data.user);
        localStorage.setItem('user', JSON.stringify(data.user));
        localStorage.setItem('token', data.token);
        toast({ title: 'Вход выполнен!', description: `Добро пожаловать, ${data.user.full_name}` });
        if (data.user.role === 'admin') loadApplications();
      } else {
        toast({ title: 'Ошибка', description: data.error, variant: 'destructive' });
      }
    } catch (error) {
      toast({ title: 'Ошибка', description: 'Не удалось войти', variant: 'destructive' });
    }
  };

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    try {
      const response = await fetch(API_URLS.auth, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'register',
          email: formData.get('email'),
          password: formData.get('password'),
          full_name: formData.get('full_name')
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        setUser(data.user);
        localStorage.setItem('user', JSON.stringify(data.user));
        localStorage.setItem('token', data.token);
        toast({ title: 'Регистрация успешна!', description: 'Добро пожаловать в клуб!' });
      }
    } catch (error) {
      toast({ title: 'Ошибка', description: 'Не удалось зарегистрироваться', variant: 'destructive' });
    }
  };

  const handleApplicationSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    try {
      const response = await fetch(API_URLS.applications, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          full_name: formData.get('full_name'),
          email: formData.get('email'),
          phone: formData.get('phone'),
          message: formData.get('message')
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        toast({ title: 'Заявка отправлена!', description: 'Мы свяжемся с вами в ближайшее время' });
        e.currentTarget.reset();
      }
    } catch (error) {
      toast({ title: 'Ошибка', description: 'Не удалось отправить заявку', variant: 'destructive' });
    }
  };

  const handleAttendanceToggle = async (userId: number, present: boolean) => {
    try {
      await fetch(API_URLS.attendance, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: userId,
          date: attendanceDate,
          present
        })
      });
      loadAttendance();
    } catch (error) {
      toast({ title: 'Ошибка', description: 'Не удалось обновить посещаемость', variant: 'destructive' });
    }
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setActiveSection('home');
    toast({ title: 'Выход выполнен' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50">
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
              <button onClick={() => setActiveSection('home')} className="text-foreground hover:text-primary transition-colors">
                Главная
              </button>
              <button onClick={() => setActiveSection('news')} className="text-foreground hover:text-primary transition-colors">
                Новости
              </button>
              {user?.role === 'admin' && (
                <button onClick={() => setActiveSection('attendance')} className="text-foreground hover:text-primary transition-colors">
                  Посещаемость
                </button>
              )}
              <button onClick={() => setActiveSection('contacts')} className="text-foreground hover:text-primary transition-colors">
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
                  <Button onClick={handleLogout} variant="outline" size="sm">
                    <Icon name="LogOut" size={16} />
                  </Button>
                </div>
              ) : (
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="bg-gradient-to-r from-primary to-secondary hover:opacity-90">
                      <Icon name="UserPlus" size={16} className="mr-2" />
                      Войти
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Вход / Регистрация</DialogTitle>
                    </DialogHeader>
                    <Tabs defaultValue="login">
                      <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="login">Вход</TabsTrigger>
                        <TabsTrigger value="register">Регистрация</TabsTrigger>
                      </TabsList>
                      <TabsContent value="login">
                        <form onSubmit={handleLogin} className="space-y-4">
                          <div>
                            <Label htmlFor="login-email">Email</Label>
                            <Input id="login-email" name="email" type="email" required />
                          </div>
                          <div>
                            <Label htmlFor="login-password">Пароль</Label>
                            <Input id="login-password" name="password" type="password" required />
                          </div>
                          <Button type="submit" className="w-full">Войти</Button>
                        </form>
                      </TabsContent>
                      <TabsContent value="register">
                        <form onSubmit={handleRegister} className="space-y-4">
                          <div>
                            <Label htmlFor="reg-name">Полное имя</Label>
                            <Input id="reg-name" name="full_name" required />
                          </div>
                          <div>
                            <Label htmlFor="reg-email">Email</Label>
                            <Input id="reg-email" name="email" type="email" required />
                          </div>
                          <div>
                            <Label htmlFor="reg-password">Пароль</Label>
                            <Input id="reg-password" name="password" type="password" required />
                          </div>
                          <Button type="submit" className="w-full">Зарегистрироваться</Button>
                        </form>
                      </TabsContent>
                    </Tabs>
                  </DialogContent>
                </Dialog>
              )}
            </div>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-8">
        {activeSection === 'home' && (
          <div className="space-y-12 animate-fade-in">
            <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-primary via-secondary to-accent p-12 text-white">
              <div className="relative z-10 max-w-2xl">
                <h1 className="text-5xl font-bold mb-4 animate-slide-up">Добро пожаловать в наш клуб!</h1>
                <p className="text-xl mb-6 opacity-90">
                  Присоединяйся к самому активному школьному сообществу. Новые друзья, события и возможности!
                </p>
                <Button 
                  onClick={() => setActiveSection('application')} 
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
        )}

        {activeSection === 'news' && (
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
        )}

        {activeSection === 'attendance' && user?.role === 'admin' && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex items-center justify-between">
              <h2 className="text-3xl font-bold flex items-center gap-2">
                <Icon name="ClipboardCheck" className="text-primary" />
                Посещаемость
              </h2>
              <Input 
                type="date" 
                value={attendanceDate} 
                onChange={(e) => setAttendanceDate(e.target.value)}
                className="w-auto"
              />
            </div>
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  {attendance.map((record) => (
                    <div key={record.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                      <div>
                        <p className="font-medium">{record.full_name}</p>
                        <p className="text-sm text-muted-foreground">{record.email}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge variant={record.present ? 'default' : 'secondary'}>
                          {record.present ? 'Присутствует' : 'Отсутствует'}
                        </Badge>
                        <Switch 
                          checked={record.present} 
                          onCheckedChange={(checked) => handleAttendanceToggle(record.id, checked)}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeSection === 'application' && (
          <div className="max-w-2xl mx-auto animate-fade-in">
            <Card>
              <CardHeader>
                <CardTitle className="text-3xl flex items-center gap-2">
                  <Icon name="FileText" className="text-primary" />
                  Заявка на вступление
                </CardTitle>
                <CardDescription>Заполните форму, чтобы присоединиться к нашему клубу</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleApplicationSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="app-name">Полное имя</Label>
                    <Input id="app-name" name="full_name" required />
                  </div>
                  <div>
                    <Label htmlFor="app-email">Email</Label>
                    <Input id="app-email" name="email" type="email" required />
                  </div>
                  <div>
                    <Label htmlFor="app-phone">Телефон</Label>
                    <Input id="app-phone" name="phone" type="tel" />
                  </div>
                  <div>
                    <Label htmlFor="app-message">Почему вы хотите вступить?</Label>
                    <Textarea id="app-message" name="message" rows={5} required />
                  </div>
                  <Button type="submit" className="w-full" size="lg">
                    <Icon name="Send" size={20} className="mr-2" />
                    Отправить заявку
                  </Button>
                </form>
              </CardContent>
            </Card>

            {user?.role === 'admin' && applications.length > 0 && (
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Заявки на рассмотрении</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {applications.map((app) => (
                      <div key={app.id} className="border p-4 rounded-lg">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <p className="font-medium">{app.full_name}</p>
                            <p className="text-sm text-muted-foreground">{app.email} • {app.phone}</p>
                          </div>
                          <Badge variant={app.status === 'pending' ? 'secondary' : 'default'}>
                            {app.status}
                          </Badge>
                        </div>
                        <p className="text-sm mt-2">{app.message}</p>
                        <p className="text-xs text-muted-foreground mt-2">
                          {new Date(app.created_at).toLocaleString('ru')}
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {activeSection === 'contacts' && (
          <div className="max-w-2xl mx-auto animate-fade-in">
            <Card>
              <CardHeader>
                <CardTitle className="text-3xl flex items-center gap-2">
                  <Icon name="Mail" className="text-primary" />
                  Контакты
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <Icon name="Mail" className="text-primary" size={24} />
                  </div>
                  <div>
                    <p className="font-medium">Email</p>
                    <p className="text-muted-foreground">club@school.ru</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-secondary/10 rounded-full flex items-center justify-center">
                    <Icon name="Phone" className="text-secondary" size={24} />
                  </div>
                  <div>
                    <p className="font-medium">Телефон</p>
                    <p className="text-muted-foreground">+7 (999) 123-45-67</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center">
                    <Icon name="MapPin" className="text-accent" size={24} />
                  </div>
                  <div>
                    <p className="font-medium">Адрес</p>
                    <p className="text-muted-foreground">г. Москва, ул. Школьная, д. 1</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </main>

      <footer className="bg-white border-t border-purple-200 mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-muted-foreground">© 2024 Школьный Клуб. Все права защищены.</p>
            <div className="flex gap-4">
              <Button variant="ghost" size="sm" onClick={() => setActiveSection('home')}>Главная</Button>
              <Button variant="ghost" size="sm" onClick={() => setActiveSection('news')}>Новости</Button>
              <Button variant="ghost" size="sm" onClick={() => setActiveSection('application')}>Вступить</Button>
            </div>
          </div>
        </div>
      </footer>

      <Toaster />
    </div>
  );
}

export default App;
