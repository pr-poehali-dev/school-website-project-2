import { Card, CardContent } from '@/components/ui/card';
import Icon from '@/components/ui/icon';

interface GradesSummaryCardProps {
  average: number;
}

export default function GradesSummaryCard({ average }: GradesSummaryCardProps) {
  return (
    <Card className="mb-6">
      <CardContent className="pt-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Средний балл</p>
            <p className="text-4xl font-bold">{average}</p>
          </div>
          <Icon name="Award" size={48} className="text-primary" />
        </div>
      </CardContent>
    </Card>
  );
}
