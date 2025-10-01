import { Card, CardContent } from '@/components/ui/card';
import Icon from '@/components/ui/icon';

const ContactSection = () => {
  return (
    <section id="contacts" className="py-20 bg-gradient-to-br from-purple-100 via-cyan-100 to-pink-100">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Контакты
          </h2>
          <p className="text-lg text-foreground/70">Свяжитесь с нами любым удобным способом</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <Card className="text-center hover:shadow-xl transition-shadow border-2 border-purple-200">
            <CardContent className="pt-8">
              <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                <Icon name="MapPin" className="text-white" size={28} />
              </div>
              <h3 className="font-bold text-lg mb-2">Адрес</h3>
              <p className="text-foreground/70">ул. Школьная, д. 15<br />г. Москва, 123456</p>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-xl transition-shadow border-2 border-cyan-200">
            <CardContent className="pt-8">
              <div className="w-16 h-16 bg-gradient-to-br from-secondary to-accent rounded-full flex items-center justify-center mx-auto mb-4">
                <Icon name="Phone" className="text-white" size={28} />
              </div>
              <h3 className="font-bold text-lg mb-2">Телефон</h3>
              <p className="text-foreground/70">+7 (495) 123-45-67<br />+7 (495) 765-43-21</p>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-xl transition-shadow border-2 border-pink-200">
            <CardContent className="pt-8">
              <div className="w-16 h-16 bg-gradient-to-br from-accent to-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <Icon name="Mail" className="text-white" size={28} />
              </div>
              <h3 className="font-bold text-lg mb-2">Email</h3>
              <p className="text-foreground/70">info@schoolclub.ru<br />support@schoolclub.ru</p>
            </CardContent>
          </Card>
        </div>

        <div className="mt-12 text-center">
          <p className="text-foreground/70 mb-4">Мы в социальных сетях:</p>
          <div className="flex justify-center gap-4">
            <a href="#" className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center hover:opacity-80 transition-opacity">
              <Icon name="Instagram" className="text-white" size={22} />
            </a>
            <a href="#" className="w-12 h-12 bg-gradient-to-br from-secondary to-accent rounded-full flex items-center justify-center hover:opacity-80 transition-opacity">
              <Icon name="Facebook" className="text-white" size={22} />
            </a>
            <a href="#" className="w-12 h-12 bg-gradient-to-br from-accent to-primary rounded-full flex items-center justify-center hover:opacity-80 transition-opacity">
              <Icon name="Youtube" className="text-white" size={22} />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
