import { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';

interface Grade {
  id: number;
  category: string;
  score: number;
  comment: string;
  graded_at: string;
  graded_by_name: string;
}

interface MemberGradesModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: number;
  userName: string;
  apiUrl: string;
}

const MemberGradesModal = ({ isOpen, onClose, userId, userName, apiUrl }: MemberGradesModalProps) => {
  const [grades, setGrades] = useState<Grade[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && userId) {
      loadGrades();
    }
  }, [isOpen, userId]);

  const loadGrades = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${apiUrl}?grades=true&user_id=${userId}`, {
        headers: { 'X-User-Role': 'admin' }
      });
      const data = await response.json();
      setGrades(data);
    } catch (error) {
      console.error('Ошибка загрузки оценок:', error);
    } finally {
      setLoading(false);
    }
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'дисциплина': 'bg-blue-100 text-blue-800',
      'техника': 'bg-green-100 text-green-800',
      'теория': 'bg-purple-100 text-purple-800',
      'физподготовка': 'bg-orange-100 text-orange-800',
      'спарринг': 'bg-red-100 text-red-800',
      'ката': 'bg-indigo-100 text-indigo-800'
    };
    return colors[category.toLowerCase()] || 'bg-gray-100 text-gray-800';
  };

  const getScoreColor = (score: number) => {
    if (score >= 4.5) return 'text-green-600';
    if (score >= 3.5) return 'text-blue-600';
    if (score >= 2.5) return 'text-yellow-600';
    return 'text-red-600';
  };

  const averageScore = grades.length > 0
    ? (grades.reduce((sum, g) => sum + g.score, 0) / grades.length).toFixed(1)
    : '0.0';

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <Icon name="Award" className="text-primary" />
            Оценки: {userName}
          </DialogTitle>
        </DialogHeader>

        {loading ? (
          <div className="flex justify-center py-8">
            <Icon name="Loader2" className="animate-spin text-primary" size={32} />
          </div>
        ) : (
          <div className="space-y-4">
            <Card className="bg-gradient-to-br from-primary/10 to-secondary/10">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center">
                      <Icon name="Star" className="text-white" size={32} />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Средняя оценка</p>
                      <p className={`text-4xl font-bold ${getScoreColor(parseFloat(averageScore))}`}>
                        {averageScore}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">Всего оценок</p>
                    <p className="text-3xl font-bold text-primary">{grades.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {grades.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Icon name="FileQuestion" className="mx-auto mb-2" size={48} />
                <p>Оценок пока нет</p>
              </div>
            ) : (
              <div className="space-y-3">
                <h3 className="font-semibold text-lg flex items-center gap-2">
                  <Icon name="History" size={20} />
                  История оценок
                </h3>
                {grades.map((grade) => (
                  <Card key={grade.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge className={getCategoryColor(grade.category)}>
                              {grade.category}
                            </Badge>
                            <span className={`text-2xl font-bold ${getScoreColor(grade.score)}`}>
                              {grade.score.toFixed(1)}
                            </span>
                          </div>
                          {grade.comment && (
                            <p className="text-sm text-muted-foreground mt-2">
                              <Icon name="MessageSquare" size={14} className="inline mr-1" />
                              {grade.comment}
                            </p>
                          )}
                        </div>
                        <div className="text-right text-sm text-muted-foreground">
                          <div className="flex items-center gap-1 justify-end">
                            <Icon name="User" size={14} />
                            {grade.graded_by_name || 'Администратор'}
                          </div>
                          <div className="flex items-center gap-1 justify-end mt-1">
                            <Icon name="Calendar" size={14} />
                            {new Date(grade.graded_at).toLocaleDateString('ru')}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default MemberGradesModal;
