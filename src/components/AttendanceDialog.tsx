import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';

interface Student {
  id: number;
  name: string;
  class: string;
  attended: boolean;
}

interface AttendanceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isAdmin: boolean;
}

const AttendanceDialog = ({ open, onOpenChange, isAdmin }: AttendanceDialogProps) => {
  const [students, setStudents] = useState<Student[]>([
    { id: 1, name: 'Иванов Иван', class: '9А', attended: true },
    { id: 2, name: 'Петрова Мария', class: '9Б', attended: true },
    { id: 3, name: 'Сидоров Петр', class: '10А', attended: false },
    { id: 4, name: 'Козлова Анна', class: '9А', attended: true },
    { id: 5, name: 'Смирнов Алексей', class: '10Б', attended: false },
    { id: 6, name: 'Новикова Елена', class: '11А', attended: true },
    { id: 7, name: 'Морозов Дмитрий', class: '9Б', attended: true },
    { id: 8, name: 'Васильева Ольга', class: '10А', attended: false },
  ]);

  const { toast } = useToast();

  const toggleAttendance = (id: number) => {
    if (!isAdmin) {
      toast({
        title: 'Доступ запрещен',
        description: 'Только администратор может изменять посещаемость',
        variant: 'destructive'
      });
      return;
    }
    
    setStudents(students.map(student =>
      student.id === id ? { ...student, attended: !student.attended } : student
    ));
  };

  const attendedCount = students.filter(s => s.attended).length;
  const attendanceRate = Math.round((attendedCount / students.length) * 100);

  const handleSave = () => {
    if (!isAdmin) return;
    
    toast({
      title: 'Сохранено',
      description: 'Посещаемость успешно обновлена',
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Посещаемость клуба
          </DialogTitle>
        </DialogHeader>

        <Card className="bg-gradient-to-br from-purple-50 to-cyan-50 border-2 border-purple-200">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold text-primary">{attendedCount}/{students.length}</div>
                <div className="text-sm text-foreground/70">Участников присутствует</div>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-secondary">{attendanceRate}%</div>
                <div className="text-sm text-foreground/70">Посещаемость</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-2 mt-4">
          {students.map((student) => (
            <div
              key={student.id}
              className="flex items-center justify-between p-4 rounded-lg border-2 border-purple-100 hover:border-purple-300 transition-colors bg-white"
            >
              <div className="flex items-center gap-3">
                <Checkbox
                  checked={student.attended}
                  onCheckedChange={() => toggleAttendance(student.id)}
                  disabled={!isAdmin}
                  className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                />
                <div>
                  <div className="font-semibold">{student.name}</div>
                  <div className="text-sm text-foreground/60">{student.class} класс</div>
                </div>
              </div>
              <div className={`px-3 py-1 rounded-full text-sm font-semibold ${
                student.attended
                  ? 'bg-green-100 text-green-700'
                  : 'bg-red-100 text-red-700'
              }`}>
                {student.attended ? (
                  <span className="flex items-center gap-1">
                    <Icon name="Check" size={14} />
                    Присутствует
                  </span>
                ) : (
                  <span className="flex items-center gap-1">
                    <Icon name="X" size={14} />
                    Отсутствует
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

        {!isAdmin && (
          <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-4 flex items-start gap-3">
            <Icon name="Info" className="text-yellow-600 mt-0.5" size={20} />
            <div className="text-sm text-yellow-800">
              Вы можете только просматривать посещаемость. Для редактирования войдите как администратор.
            </div>
          </div>
        )}

        {isAdmin && (
          <Button
            onClick={handleSave}
            className="w-full bg-gradient-to-r from-primary to-secondary hover:opacity-90"
          >
            <Icon name="Save" size={18} />
            Сохранить изменения
          </Button>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AttendanceDialog;
