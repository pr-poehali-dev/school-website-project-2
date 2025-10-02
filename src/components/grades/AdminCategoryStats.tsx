import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Icon from '@/components/ui/icon';

interface CategoryStats {
  [key: string]: {
    total: number;
    count: number;
    avg: number;
  };
}

interface AdminCategoryStatsProps {
  categoryStats: CategoryStats;
  getScoreColor: (score: number) => string;
}

export default function AdminCategoryStats({ categoryStats, getScoreColor }: AdminCategoryStatsProps) {
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Icon name="TrendingUp" size={20} />
          Общая статистика по категориям
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Object.entries(categoryStats).map(([category, stats]) => (
            <div key={category} className="text-center p-3 rounded-lg border bg-card">
              <p className={`text-2xl font-bold mb-1 ${getScoreColor(stats.avg).split(' ')[0]}`}>
                {stats.avg}
              </p>
              <p className="text-xs font-medium mb-1">{category}</p>
              <p className="text-xs text-muted-foreground">
                {stats.count} {stats.count === 1 ? 'оценка' : stats.count < 5 ? 'оценки' : 'оценок'}
              </p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
