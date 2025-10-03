import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { User, RoleHistoryRecord } from '@/types';
import { API_URLS } from '@/config/api';

export const useMembers = () => {
  const [members, setMembers] = useState<User[]>([]);
  const [deletedMembers, setDeletedMembers] = useState<User[]>([]);
  const [roleHistory, setRoleHistory] = useState<RoleHistoryRecord[]>([]);
  const { toast } = useToast();

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

  const loadDeletedMembers = async () => {
    try {
      const response = await fetch(`${API_URLS.members}?show_deleted=true`, {
        headers: { 'X-User-Role': 'admin' }
      });
      const data = await response.json();
      setDeletedMembers(data);
    } catch (error) {
      console.error('Ошибка загрузки удалённых участников:', error);
    }
  };

  const loadRoleHistory = async () => {
    try {
      const response = await fetch(`${API_URLS.members}?history=true`, {
        headers: { 'X-User-Role': 'admin' }
      });
      const data = await response.json();
      setRoleHistory(data);
    } catch (error) {
      console.error('Ошибка загрузки истории:', error);
    }
  };

  const handleRemoveMember = async (id: number) => {
    const member = members.find(m => m.id === id);
    const memberName = member?.full_name || 'этого участника';
    
    if (!confirm(`Вы уверены, что хотите исключить ${memberName}? Участника можно будет восстановить позже.`)) return;
    
    try {
      const response = await fetch(`${API_URLS.members}?id=${id}`, {
        method: 'DELETE',
        headers: { 'X-User-Role': 'admin' }
      });
      const data = await response.json();
      if (data.success) {
        toast({ title: 'Участник исключён', description: `${memberName} перемещён в архив. Вы можете восстановить участника.` });
        loadMembers();
        loadDeletedMembers();
      } else {
        toast({ title: 'Ошибка', description: data.error || 'Не удалось исключить участника', variant: 'destructive' });
      }
    } catch (error) {
      toast({ title: 'Ошибка', description: 'Не удалось исключить участника', variant: 'destructive' });
    }
  };

  const handleRestoreMember = async (id: number) => {
    const member = deletedMembers.find(m => m.id === id);
    const memberName = member?.full_name || 'участника';
    
    try {
      const response = await fetch(API_URLS.members, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-User-Role': 'admin'
        },
        body: JSON.stringify({ action: 'restore_user', user_id: id })
      });
      const data = await response.json();
      if (data.success) {
        toast({ title: 'Участник восстановлен', description: `${memberName} снова активен в системе` });
        await loadMembers();
        await loadDeletedMembers();
      } else {
        toast({ title: 'Ошибка', description: 'Не удалось восстановить участника', variant: 'destructive' });
      }
    } catch (error) {
      toast({ title: 'Ошибка', description: 'Не удалось восстановить участника', variant: 'destructive' });
    }
  };

  const handlePromoteToAdmin = async (id: number, adminId?: number) => {
    if (!confirm('Вы уверены, что хотите назначить этого пользователя администратором?')) return;
    
    try {
      const response = await fetch(API_URLS.members, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'X-User-Role': 'admin' 
        },
        body: JSON.stringify({ id, role: 'admin', admin_id: adminId })
      });
      const data = await response.json();
      if (data.success) {
        toast({ title: 'Пользователь назначен администратором' });
        await loadMembers();
        await loadRoleHistory();
      }
    } catch (error) {
      toast({ title: 'Ошибка', description: 'Не удалось изменить роль', variant: 'destructive' });
    }
  };

  const handleDemoteToMember = async (id: number, adminId?: number) => {
    if (!confirm('Вы уверены, что хотите снять права администратора?')) return;
    
    try {
      const response = await fetch(API_URLS.members, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'X-User-Role': 'admin' 
        },
        body: JSON.stringify({ id, role: 'member', admin_id: adminId })
      });
      const data = await response.json();
      if (data.success) {
        toast({ title: 'Права администратора сняты' });
        await loadMembers();
        await loadRoleHistory();
      }
    } catch (error) {
      toast({ title: 'Ошибка', description: 'Не удалось изменить роль', variant: 'destructive' });
    }
  };

  return {
    members,
    deletedMembers,
    roleHistory,
    loadMembers,
    loadDeletedMembers,
    loadRoleHistory,
    handleRemoveMember,
    handleRestoreMember,
    handlePromoteToAdmin,
    handleDemoteToMember
  };
};