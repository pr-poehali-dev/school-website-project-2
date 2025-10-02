import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';

interface DeletedMember {
  id: number;
  email: string;
  full_name: string;
  role: string;
  created_at: string;
}

interface DeletedMembersSectionProps {
  deletedMembers: DeletedMember[];
  onRestoreMember: (id: number) => void;
}

export default function DeletedMembersSection({ deletedMembers, onRestoreMember }: DeletedMembersSectionProps) {
  if (deletedMembers.length === 0) {
    return null;
  }

  return (
    <div className="max-w-4xl mx-auto mt-8 animate-fade-in">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2">
            <Icon name="UserX" className="text-muted-foreground" />
            Удалённые участники
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {deletedMembers.map((member) => (
              <div key={member.id} className="border rounded-lg p-4 flex items-center justify-between bg-muted/30">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center">
                    <Icon name="User" className="text-muted-foreground" size={24} />
                  </div>
                  <div>
                    <p className="font-medium text-muted-foreground">{member.full_name}</p>
                    <p className="text-sm text-muted-foreground">{member.email}</p>
                    <p className="text-xs text-muted-foreground">
                      Присоединился: {new Date(member.created_at).toLocaleDateString('ru')}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant="outline" className="text-muted-foreground">
                    Удалён
                  </Badge>
                  <Button
                    onClick={() => onRestoreMember(member.id)}
                    variant="default"
                    size="sm"
                  >
                    <Icon name="RotateCcw" size={16} className="mr-1" />
                    Восстановить
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
