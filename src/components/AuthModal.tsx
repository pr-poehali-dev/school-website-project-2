import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (e: React.FormEvent<HTMLFormElement>) => void;
  onRegister: (e: React.FormEvent<HTMLFormElement>) => void;
}

const AuthModal = ({ isOpen, onClose, onLogin, onRegister }: AuthModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Вход / Регистрация</DialogTitle>
        </DialogHeader>
        <Tabs defaultValue="login">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Вход</TabsTrigger>
            <TabsTrigger value="register">Регистрация</TabsTrigger>
          </TabsList>
          <TabsContent value="login">
            <form onSubmit={onLogin} className="space-y-4">
              <div>
                <Label htmlFor="login-email">Email</Label>
                <Input id="login-email" name="email" type="email" required />
              </div>
              <div>
                <Label htmlFor="login-password">Пароль</Label>
                <Input id="login-password" name="password" type="password" required />
              </div>
              <Button type="submit" className="w-full">Войти</Button>
            </form>
          </TabsContent>
          <TabsContent value="register">
            <form onSubmit={onRegister} className="space-y-4">
              <div>
                <Label htmlFor="reg-name">Полное имя</Label>
                <Input id="reg-name" name="full_name" required />
              </div>
              <div>
                <Label htmlFor="reg-email">Email</Label>
                <Input id="reg-email" name="email" type="email" required />
              </div>
              <div>
                <Label htmlFor="reg-password">Пароль</Label>
                <Input id="reg-password" name="password" type="password" required />
              </div>
              <Button type="submit" className="w-full">Зарегистрироваться</Button>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default AuthModal;
