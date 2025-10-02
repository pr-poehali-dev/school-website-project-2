import { Card, CardContent } from '@/components/ui/card';
import Icon from '@/components/ui/icon';

interface Grade {
  id: number;
  user_id: number;
  user_name?: string;
  category: string;
  score: number;
  comment: string;
  graded_at: string;
  graded_by_name: string;
}

interface GradesListProps {
  grades: Grade[];
  getScoreColor: (score: number) => string;
  userRole: string;
}

export default function GradesList({ grades, getScoreColor, userRole }: GradesListProps) {
  if (grades.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <Icon name="FileText" size={48} className="mx-auto mb-4 text-muted-foreground" />
          <p className="text-muted-foreground">
            {userRole === 'admin' ? 'Оценок пока нет. Добавьте первую оценку.' : 'У вас пока нет оценок'}
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-4">
      {grades.map((grade) => (
        <Card key={grade.id}>
          <CardContent className="py-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  {grade.user_name && (
                    <h3 className="font-semibold text-lg">{grade.user_name}</h3>
                  )}
                  <span className="text-sm px-3 py-1 rounded-full bg-secondary">
                    {grade.category}
                  </span>
                </div>
                
                {grade.comment && (
                  <p className="text-sm text-muted-foreground mb-2">{grade.comment}</p>
                )}
                
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Icon name="User" size={12} />
                    {grade.graded_by_name}
                  </span>
                  <span className="flex items-center gap-1">
                    <Icon name="Calendar" size={12} />
                    {new Date(grade.graded_at).toLocaleDateString('ru-RU')}
                  </span>
                </div>
              </div>
              
              <div className={`text-3xl font-bold px-4 py-2 rounded-lg ${getScoreColor(grade.score)}`}>
                {grade.score}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
