import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

interface AdminControlsProps {
  viewMode: 'all' | 'my';
  isAddingGrade: boolean;
  onViewModeChange: (mode: 'all' | 'my') => void;
  onToggleAddGrade: () => void;
}

export default function AdminControls({
  viewMode,
  isAddingGrade,
  onViewModeChange,
  onToggleAddGrade
}: AdminControlsProps) {
  return (
    <div className="mb-6 flex gap-4 flex-wrap items-center">
      <div className="flex gap-2">
        <Button
          variant={viewMode === 'all' ? 'default' : 'outline'}
          onClick={() => onViewModeChange('all')}
        >
          <Icon name="Users" size={16} className="mr-2" />
          Все оценки
        </Button>
        <Button
          variant={viewMode === 'my' ? 'default' : 'outline'}
          onClick={() => onViewModeChange('my')}
        >
          <Icon name="User" size={16} className="mr-2" />
          Мои оценки
        </Button>
      </div>
      
      <Button onClick={onToggleAddGrade} className="ml-auto">
        <Icon name={isAddingGrade ? 'X' : 'Plus'} size={16} className="mr-2" />
        {isAddingGrade ? 'Отменить' : 'Добавить оценку'}
      </Button>
    </div>
  );
}
