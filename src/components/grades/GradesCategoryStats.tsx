import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Icon from '@/components/ui/icon';

interface CategoryStats {
  [key: string]: {
    total: number;
    count: number;
    avg: number;
  };
}

interface GradesCategoryStatsProps {
  categoryStats: CategoryStats;
  getScoreColor: (score: number) => string;
}

export default function GradesCategoryStats({ categoryStats, getScoreColor }: GradesCategoryStatsProps) {
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Icon name="BarChart3" size={20} />
          Статистика по категориям
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.entries(categoryStats).map(([category, stats]) => (
            <div key={category} className="p-4 rounded-lg border bg-card">
              <div className="flex justify-between items-start mb-2">
                <p className="text-sm font-medium">{category}</p>
                <span className={`text-lg font-bold px-2 py-1 rounded ${getScoreColor(stats.avg)}`}>
                  {stats.avg}
                </span>
              </div>
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
