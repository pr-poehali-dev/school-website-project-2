import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Toaster } from '@/components/ui/toaster';
import SchoolHeader from '@/components/SchoolHeader';
import AuthModal from '@/components/AuthModal';
import HomeSection from '@/components/HomeSection';
import NewsListSection from '@/components/NewsListSection';
import AttendanceSection from '@/components/AttendanceSection';
import ApplicationSection from '@/components/ApplicationSection';
import ContactsSection from '@/components/ContactsSection';
import MembersSection from '@/components/MembersSection';
import SchoolFooter from '@/components/SchoolFooter';

const API_URLS = {
  auth: 'https://functions.poehali.dev/a056130a-20c0-4b35-827b-30e2d6a56a84',
  applications: 'https://functions.poehali.dev/d850ccdf-cc95-4cc6-a01a-ec3e479b3384',
  news: 'https://functions.poehali.dev/679d9f94-3b9e-446a-9587-43a330e48688',
  attendance: 'https://functions.poehali.dev/d2c26821-fa04-492f-9f68-d1903cb00009',
  members: 'https://functions.poehali.dev/a70ff833-b468-4226-a121-9cbb3519504c'
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
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [news, setNews] = useState<NewsItem[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [attendanceDate, setAttendanceDate] = useState(new Date().toISOString().split('T')[0]);
  const [members, setMembers] = useState<User[]>([]);
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
    if (activeSection === 'members' && user?.role === 'admin') {
      loadMembers();
    }
  }, [activeSection, attendanceDate, user]);

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
        setIsAuthModalOpen(false);
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
        setIsAuthModalOpen(false);
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

  const handleApproveApplication = async (id: number) => {
    try {
      const response = await fetch(API_URLS.applications, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: 'approved' })
      });
      const data = await response.json();
      if (data.success) {
        toast({ title: 'Заявка одобрена' });
        loadApplications();
      }
    } catch (error) {
      toast({ title: 'Ошибка', description: 'Не удалось одобрить заявку', variant: 'destructive' });
    }
  };

  const handleRejectApplication = async (id: number) => {
    try {
      const response = await fetch(API_URLS.applications, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: 'rejected' })
      });
      const data = await response.json();
      if (data.success) {
        toast({ title: 'Заявка отклонена' });
        loadApplications();
      }
    } catch (error) {
      toast({ title: 'Ошибка', description: 'Не удалось отклонить заявку', variant: 'destructive' });
    }
  };

  const loadMembers = async () => {
    try {
      const response = await fetch(API_URLS.members, {
        headers: { 'X-User-Role': 'admin' }
      });
      const data = await response.json();
      setMembers(data);
    } catch (error) {
      console.error('Ошибка загрузки участников:', error);
    }
  };

  const handleRemoveMember = async (id: number) => {
    if (!confirm('Вы уверены, что хотите исключить этого участника?')) return;
    
    try {
      const response = await fetch(`${API_URLS.members}?id=${id}`, {
        method: 'DELETE',
        headers: { 'X-User-Role': 'admin' }
      });
      const data = await response.json();
      if (data.success) {
        toast({ title: 'Участник исключён' });
        loadMembers();
      }
    } catch (error) {
      toast({ title: 'Ошибка', description: 'Не удалось исключить участника', variant: 'destructive' });
    }
  };

  const handlePromoteToAdmin = async (id: number) => {
    if (!confirm('Вы уверены, что хотите назначить этого пользователя администратором?')) return;
    
    try {
      const response = await fetch(API_URLS.members, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'X-User-Role': 'admin' 
        },
        body: JSON.stringify({ id, role: 'admin' })
      });
      const data = await response.json();
      if (data.success) {
        toast({ title: 'Пользователь назначен администратором' });
        loadMembers();
      }
    } catch (error) {
      toast({ title: 'Ошибка', description: 'Не удалось изменить роль', variant: 'destructive' });
    }
  };

  const handleDemoteToMember = async (id: number) => {
    if (!confirm('Вы уверены, что хотите снять права администратора?')) return;
    
    try {
      const response = await fetch(API_URLS.members, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'X-User-Role': 'admin' 
        },
        body: JSON.stringify({ id, role: 'member' })
      });
      const data = await response.json();
      if (data.success) {
        toast({ title: 'Права администратора сняты' });
        loadMembers();
      }
    } catch (error) {
      toast({ title: 'Ошибка', description: 'Не удалось изменить роль', variant: 'destructive' });
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
      <SchoolHeader
        user={user}
        onNavigate={setActiveSection}
        onLogout={handleLogout}
        onOpenAuth={() => setIsAuthModalOpen(true)}
      />

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLogin={handleLogin}
        onRegister={handleRegister}
      />

      <main className="container mx-auto px-4 py-8">
        {activeSection === 'home' && (
          <HomeSection news={news} onNavigate={setActiveSection} />
        )}

        {activeSection === 'news' && (
          <NewsListSection news={news} />
        )}

        {activeSection === 'attendance' && user?.role === 'admin' && (
          <AttendanceSection
            attendance={attendance}
            attendanceDate={attendanceDate}
            onDateChange={setAttendanceDate}
            onToggle={handleAttendanceToggle}
          />
        )}

        {activeSection === 'application' && (
          <ApplicationSection
            applications={applications}
            isAdmin={user?.role === 'admin'}
            onSubmit={handleApplicationSubmit}
            onApprove={handleApproveApplication}
            onReject={handleRejectApplication}
          />
        )}

        {activeSection === 'members' && user?.role === 'admin' && (
          <MembersSection
            members={members}
            onRemoveMember={handleRemoveMember}
            onPromoteToAdmin={handlePromoteToAdmin}
            onDemoteToMember={handleDemoteToMember}
          />
        )}

        {activeSection === 'contacts' && <ContactsSection />}
      </main>

      <SchoolFooter onNavigate={setActiveSection} />

      <Toaster />
    </div>
  );
}

export default App;