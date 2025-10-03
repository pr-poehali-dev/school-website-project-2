import { useEffect, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (e: React.FormEvent<HTMLFormElement>) => void;
  onRegister: (e: React.FormEvent<HTMLFormElement>) => void;
  onTelegramLogin?: (user: any) => void;
}

const AuthModal = ({ isOpen, onClose, onLogin, onRegister, onTelegramLogin }: AuthModalProps) => {
  const telegramButtonRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen || !telegramButtonRef.current || !onTelegramLogin) return;

    const script = document.createElement('script');
    script.src = 'https://telegram.org/js/telegram-widget.js?22';
    script.async = true;
    script.setAttribute('data-telegram-login', 'YOUR_BOT_USERNAME');
    script.setAttribute('data-size', 'large');
    script.setAttribute('data-radius', '8');
    script.setAttribute('data-request-access', 'write');
    script.setAttribute('data-onauth', 'onTelegramAuth(user)');

    (window as any).onTelegramAuth = (user: any) => {
      onTelegramLogin(user);
    };

    telegramButtonRef.current.innerHTML = '';
    telegramButtonRef.current.appendChild(script);

    return () => {
      delete (window as any).onTelegramAuth;
    };
  }, [isOpen, onTelegramLogin]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Вход / Регистрация</DialogTitle>
        </DialogHeader>
        
        {onTelegramLogin && (
          <div className="space-y-2">
            <div ref={telegramButtonRef} className="flex justify-center"></div>
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">или</span>
              </div>
            </div>
          </div>
        )}

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