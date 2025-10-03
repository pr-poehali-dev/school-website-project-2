import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Application } from '@/types';
import { API_URLS } from '@/config/api';

export const useApplications = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const { toast } = useToast();

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

  return {
    applications,
    loadApplications,
    handleApplicationSubmit,
    handleApproveApplication,
    handleRejectApplication
  };
};
