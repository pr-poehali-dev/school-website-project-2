import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';

interface ApplicationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ApplicationDialog = ({ open, onOpenChange }: ApplicationDialogProps) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [grade, setGrade] = useState('');
  const [interest, setInterest] = useState('');
  const [message, setMessage] = useState('');
  const { toast } = useToast();

  const handleSubmit = () => {
    if (!name || !email || !phone || !grade || !interest) {
      toast({
        title: 'Ошибка',
        description: 'Заполните все обязательные поля',
        variant: 'destructive'
      });
      return;
    }

    toast({
      title: 'Заявка отправлена!',
      description: 'Администратор получил вашу заявку и свяжется с вами в ближайшее время',
    });

    setName('');
    setEmail('');
    setPhone('');
    setGrade('');
    setInterest('');
    setMessage('');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Заявка на вступление в клуб
          </DialogTitle>
          <DialogDescription>
            Заполните форму, и администратор свяжется с вами для подтверждения
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">
              Ваше имя <span className="text-destructive">*</span>
            </Label>
            <Input
              id="name"
              placeholder="Иван Иванов"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">
              Email <span className="text-destructive">*</span>
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">
              Телефон <span className="text-destructive">*</span>
            </Label>
            <Input
              id="phone"
              type="tel"
              placeholder="+7 (999) 123-45-67"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="grade">
              Класс <span className="text-destructive">*</span>
            </Label>
            <Select value={grade} onValueChange={setGrade}>
              <SelectTrigger>
                <SelectValue placeholder="Выберите класс" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="8">8 класс</SelectItem>
                <SelectItem value="9">9 класс</SelectItem>
                <SelectItem value="10">10 класс</SelectItem>
                <SelectItem value="11">11 класс</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="interest">
              Направление <span className="text-destructive">*</span>
            </Label>
            <Select value={interest} onValueChange={setInterest}>
              <SelectTrigger>
                <SelectValue placeholder="Выберите направление" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sport">Спорт</SelectItem>
                <SelectItem value="art">Творчество</SelectItem>
                <SelectItem value="science">Наука</SelectItem>
                <SelectItem value="tech">Технологии</SelectItem>
                <SelectItem value="volunteer">Волонтерство</SelectItem>
                <SelectItem value="media">СМИ</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="message">Дополнительная информация</Label>
            <Textarea
              id="message"
              placeholder="Расскажите о себе, своих интересах и почему хотите вступить в клуб..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
            />
          </div>

          <div className="bg-purple-50 border-2 border-purple-200 rounded-lg p-4 flex items-start gap-3">
            <Icon name="Lock" className="text-primary mt-0.5" size={20} />
            <div className="text-sm text-foreground/80">
              Ваша заявка будет видна только администратору. Мы свяжемся с вами в течение 2-3 рабочих дней.
            </div>
          </div>
        </div>

        <Button
          onClick={handleSubmit}
          className="w-full bg-gradient-to-r from-primary to-secondary hover:opacity-90"
        >
          <Icon name="Send" size={18} />
          Отправить заявку
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default ApplicationDialog;
