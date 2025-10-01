import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Icon from '@/components/ui/icon';

const ContactsSection = () => {
  return (
    <div className="max-w-2xl mx-auto animate-fade-in">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl flex items-center gap-2">
            <Icon name="Mail" className="text-primary" />
            Контакты
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
              <Icon name="Mail" className="text-primary" size={24} />
            </div>
            <div>
              <p className="font-medium">Email</p>
              <p className="text-muted-foreground">sashafetisov2010@ro.ru</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-secondary/10 rounded-full flex items-center justify-center">
              <Icon name="Phone" className="text-secondary" size={24} />
            </div>
            <div>
              <p className="font-medium">Телефон</p>
              <p className="text-muted-foreground">+7 (999) 123-45-67</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center">
              <Icon name="MapPin" className="text-accent" size={24} />
            </div>
            <div>
              <p className="font-medium">Адрес</p>
              <p className="text-muted-foreground">г. Москва, ул. Школьная, д. 1</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ContactsSection;