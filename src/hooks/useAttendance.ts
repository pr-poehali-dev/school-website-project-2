import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { AttendanceRecord } from '@/types';
import { API_URLS } from '@/config/api';

export const useAttendance = () => {
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [attendanceDate, setAttendanceDate] = useState(new Date().toISOString().split('T')[0]);
  const { toast } = useToast();

  const loadAttendance = async () => {
    try {
      const response = await fetch(`${API_URLS.attendance}?date=${attendanceDate}`);
      const data = await response.json();
      setAttendance(data.attendance || []);
    } catch (error) {
      console.error('Ошибка загрузки посещаемости:', error);
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

  return {
    attendance,
    attendanceDate,
    setAttendanceDate,
    loadAttendance,
    handleAttendanceToggle
  };
};
