import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';

interface RoleHistoryRecord {
  id: number;
  user_id: number;
  user_name: string;
  user_email: string;
  old_role: string;
  new_role: string;
  changed_by_admin_id: number | null;
  admin_name: string | null;
  changed_at: string;
  reason: string | null;
}

interface RoleHistorySectionProps {
  history: RoleHistoryRecord[];
}

const RoleHistorySection = ({ history }: RoleHistorySectionProps) => {
  const getRoleBadge = (role: string) => {
    return role === 'admin' ? (
      <Badge variant="default">Администратор</Badge>
    ) : (
      <Badge variant="secondary">Участник</Badge>
    );
  };

  return (
    <div className="max-w-4xl mx-auto animate-fade-in mt-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2">
            <Icon name="History" className="text-primary" />
            История изменений ролей
          </CardTitle>
        </CardHeader>
        <CardContent>
          {history.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">История пуста</p>
          ) : (
            <div className="space-y-4">
              {history.map((record) => (
                <div key={record.id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="font-medium">{record.user_name}</p>
                      <p className="text-sm text-muted-foreground">{record.user_email}</p>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {new Date(record.changed_at).toLocaleString('ru')}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 mt-3">
                    {getRoleBadge(record.old_role)}
                    <Icon name="ArrowRight" size={16} className="text-muted-foreground" />
                    {getRoleBadge(record.new_role)}
                  </div>
                  {record.admin_name && (
                    <p className="text-sm text-muted-foreground mt-2">
                      Изменено: {record.admin_name}
                    </p>
                  )}
                  {record.reason && (
                    <p className="text-sm text-muted-foreground mt-1">
                      Причина: {record.reason}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default RoleHistorySection;
