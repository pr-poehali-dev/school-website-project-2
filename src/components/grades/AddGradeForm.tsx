import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Icon from '@/components/ui/icon';

interface Member {
  id: number;
  full_name: string;
  email: string;
}

interface AddGradeFormProps {
  members: Member[];
  categories: string[];
  selectedUserId: string;
  category: string;
  score: string;
  comment: string;
  onUserIdChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onScoreChange: (value: string) => void;
  onCommentChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export default function AddGradeForm({
  members,
  categories,
  selectedUserId,
  category,
  score,
  comment,
  onUserIdChange,
  onCategoryChange,
  onScoreChange,
  onCommentChange,
  onSubmit
}: AddGradeFormProps) {
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Новая оценка</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <Label>Участник</Label>
            <Select value={selectedUserId} onValueChange={onUserIdChange}>
              <SelectTrigger>
                <SelectValue placeholder="Выберите участника" />
              </SelectTrigger>
              <SelectContent>
                {members.map((member) => (
                  <SelectItem key={member.id} value={member.id.toString()}>
                    {member.full_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Категория</Label>
            <Select value={category} onValueChange={onCategoryChange}>
              <SelectTrigger>
                <SelectValue placeholder="Выберите категорию" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Оценка (0-100)</Label>
            <Input
              type="number"
              min="0"
              max="100"
              value={score}
              onChange={(e) => onScoreChange(e.target.value)}
              placeholder="Введите оценку"
            />
          </div>

          <div>
            <Label>Комментарий (опционально)</Label>
            <Textarea
              value={comment}
              onChange={(e) => onCommentChange(e.target.value)}
              placeholder="Добавьте комментарий к оценке"
              rows={3}
            />
          </div>

          <Button type="submit" className="w-full">
            <Icon name="Save" size={16} className="mr-2" />
            Сохранить оценку
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
