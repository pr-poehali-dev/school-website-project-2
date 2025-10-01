import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';

interface Article {
  title: string;
  content: string;
  image: string;
  date: string;
  category: string;
}

interface CreateArticleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateArticle: (article: Article) => void;
}

const CreateArticleDialog = ({ open, onOpenChange, onCreateArticle }: CreateArticleDialogProps) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState('');
  const [category, setCategory] = useState('');
  const { toast } = useToast();

  const handleCreate = () => {
    if (!title || !content || !category) {
      toast({
        title: 'Ошибка',
        description: 'Заполните все обязательные поля',
        variant: 'destructive'
      });
      return;
    }

    const article: Article = {
      title,
      content,
      image: image || 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800',
      date: new Date().toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' }),
      category
    };

    onCreateArticle(article);
    
    toast({
      title: 'Статья создана!',
      description: 'Новая статья успешно опубликована',
    });

    setTitle('');
    setContent('');
    setImage('');
    setCategory('');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Создать новую статью
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="article-title">
              Заголовок <span className="text-destructive">*</span>
            </Label>
            <Input
              id="article-title"
              placeholder="Введите заголовок статьи"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="article-category">
              Категория <span className="text-destructive">*</span>
            </Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Выберите категорию" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Спорт">Спорт</SelectItem>
                <SelectItem value="Достижения">Достижения</SelectItem>
                <SelectItem value="Мероприятия">Мероприятия</SelectItem>
                <SelectItem value="Наука">Наука</SelectItem>
                <SelectItem value="Творчество">Творчество</SelectItem>
                <SelectItem value="Объявления">Объявления</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="article-content">
              Содержание <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="article-content"
              placeholder="Напишите содержание статьи..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={8}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="article-image">URL изображения</Label>
            <Input
              id="article-image"
              placeholder="https://example.com/image.jpg (необязательно)"
              value={image}
              onChange={(e) => setImage(e.target.value)}
            />
            <p className="text-sm text-muted-foreground">
              Если не указано, будет использовано изображение по умолчанию
            </p>
          </div>
        </div>

        <Button
          onClick={handleCreate}
          className="w-full bg-gradient-to-r from-primary to-secondary hover:opacity-90"
        >
          <Icon name="Plus" size={18} />
          Опубликовать статью
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default CreateArticleDialog;
