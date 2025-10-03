import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { User } from '@/types';
import { API_URLS } from '@/config/api';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const { toast } = useToast();

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
        return { success: true, user: data.user };
      } else {
        toast({ title: 'Ошибка', description: data.error, variant: 'destructive' });
        return { success: false };
      }
    } catch (error) {
      toast({ title: 'Ошибка', description: 'Не удалось войти', variant: 'destructive' });
      return { success: false };
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
        return { success: true, user: data.user };
      }
    } catch (error) {
      toast({ title: 'Ошибка', description: 'Не удалось зарегистрироваться', variant: 'destructive' });
    }
    return { success: false };
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    toast({ title: 'Выход выполнен' });
  };

  const loadUserFromStorage = () => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      const userData = JSON.parse(savedUser);
      setUser(userData);
      return userData;
    }
    return null;
  };

  return {
    user,
    setUser,
    handleLogin,
    handleRegister,
    handleLogout,
    loadUserFromStorage
  };
};
