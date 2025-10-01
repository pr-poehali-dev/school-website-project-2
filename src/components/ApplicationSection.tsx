import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';

interface Application {
  id: number;
  full_name: string;
  email: string;
  phone: string;
  message: string;
  status: string;
  created_at: string;
}

interface ApplicationSectionProps {
  applications: Application[];
  isAdmin: boolean;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  onApprove?: (id: number) => void;
  onReject?: (id: number) => void;
}

const ApplicationSection = ({ applications, isAdmin, onSubmit, onApprove, onReject }: ApplicationSectionProps) => {
  return (
    <div className="max-w-2xl mx-auto animate-fade-in">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl flex items-center gap-2">
            <Icon name="FileText" className="text-primary" />
            Заявка на вступление
          </CardTitle>
          <CardDescription>Заполните форму, чтобы присоединиться к нашему клубу</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <Label htmlFor="app-name">Полное имя</Label>
              <Input id="app-name" name="full_name" required />
            </div>
            <div>
              <Label htmlFor="app-email">Email</Label>
              <Input id="app-email" name="email" type="email" required />
            </div>
            <div>
              <Label htmlFor="app-phone">Телефон</Label>
              <Input id="app-phone" name="phone" type="tel" />
            </div>
            <div>
              <Label htmlFor="app-message">Почему вы хотите вступить?</Label>
              <Textarea id="app-message" name="message" rows={5} required />
            </div>
            <Button type="submit" className="w-full" size="lg">
              <Icon name="Send" size={20} className="mr-2" />
              Отправить заявку
            </Button>
          </form>
        </CardContent>
      </Card>

      {isAdmin && applications.length > 0 && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Заявки на рассмотрении</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {applications.map((app) => (
                <div key={app.id} className="border p-4 rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-medium">{app.full_name}</p>
                      <p className="text-sm text-muted-foreground">{app.email} • {app.phone}</p>
                    </div>
                    <Badge variant={app.status === 'pending' ? 'secondary' : app.status === 'approved' ? 'default' : 'destructive'}>
                      {app.status === 'pending' ? 'На рассмотрении' : app.status === 'approved' ? 'Одобрено' : 'Отклонено'}
                    </Badge>
                  </div>
                  <p className="text-sm mt-2">{app.message}</p>
                  <p className="text-xs text-muted-foreground mt-2">
                    {new Date(app.created_at).toLocaleString('ru')}
                  </p>
                  {app.status === 'pending' && (
                    <div className="flex gap-2 mt-4">
                      <Button onClick={() => onApprove?.(app.id)} size="sm" variant="default">
                        <Icon name="Check" size={16} className="mr-1" />
                        Одобрить
                      </Button>
                      <Button onClick={() => onReject?.(app.id)} size="sm" variant="destructive">
                        <Icon name="X" size={16} className="mr-1" />
                        Отклонить
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ApplicationSection;