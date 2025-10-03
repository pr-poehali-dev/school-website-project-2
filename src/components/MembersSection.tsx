import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';

interface Member {
  id: number;
  email: string;
  full_name: string;
  role: string;
  created_at: string;
  average_score?: number;
  total_grades?: number;
}

interface MembersSectionProps {
  members: Member[];
  onRemoveMember: (id: number) => void;
  onPromoteToAdmin: (id: number) => void;
  onDemoteToMember: (id: number) => void;
  onViewGrades: (id: number, name: string) => void;
}

const MembersSection = ({ members, onRemoveMember, onPromoteToAdmin, onDemoteToMember, onViewGrades }: MembersSectionProps) => {
  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl flex items-center gap-2">
            <Icon name="Users" className="text-primary" />
            Управление участниками
          </CardTitle>
        </CardHeader>
        <CardContent>
          {members.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">Нет участников</p>
          ) : (
            <div className="space-y-4">
              {members.map((member) => (
                <div key={member.id} className="border rounded-lg p-4 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center">
                      <Icon name="User" className="text-white" size={24} />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{member.full_name}</p>
                      <p className="text-sm text-muted-foreground">{member.email}</p>
                      <div className="flex items-center gap-4 mt-1">
                        <p className="text-xs text-muted-foreground">
                          Присоединился: {new Date(member.created_at).toLocaleDateString('ru')}
                        </p>
                        {member.average_score !== undefined && member.total_grades !== undefined && member.total_grades > 0 && (
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-xs">
                              <Icon name="Star" size={12} className="mr-1 text-yellow-500" />
                              Средняя оценка: {member.average_score.toFixed(1)}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              Оценок: {member.total_grades}
                            </Badge>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant={member.role === 'admin' ? 'default' : 'secondary'}>
                      {member.role === 'admin' ? 'Администратор' : 'Участник'}
                    </Badge>
                    <Button
                      onClick={() => onViewGrades(member.id, member.full_name)}
                      variant="outline"
                      size="sm"
                    >
                      <Icon name="Award" size={16} className="mr-1" />
                      Оценки
                    </Button>
                    {member.role === 'member' ? (
                      <>
                        <Button
                          onClick={() => onPromoteToAdmin(member.id)}
                          variant="default"
                          size="sm"
                        >
                          <Icon name="Shield" size={16} className="mr-1" />
                          Назначить админом
                        </Button>
                        <Button
                          onClick={() => onRemoveMember(member.id)}
                          variant="destructive"
                          size="sm"
                        >
                          <Icon name="UserX" size={16} className="mr-1" />
                          Исключить
                        </Button>
                      </>
                    ) : (
                      <Button
                        onClick={() => onDemoteToMember(member.id)}
                        variant="outline"
                        size="sm"
                      >
                        <Icon name="ShieldOff" size={16} className="mr-1" />
                        Снять права
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default MembersSection;