import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import Icon from '@/components/ui/icon';

interface ChartDataPoint {
  date: string;
  score: number;
  category: string;
  index: number;
}

interface GradesProgressChartProps {
  chartData: ChartDataPoint[];
  chartFilter: string;
  availableCategories: string[];
  getCategoryColor: (category: string) => string;
  onFilterChange: (filter: string) => void;
}

export default function GradesProgressChart({
  chartData,
  chartFilter,
  availableCategories,
  getCategoryColor,
  onFilterChange
}: GradesProgressChartProps) {
  return (
    <Card className="mb-6">
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <CardTitle className="flex items-center gap-2">
            <Icon name="TrendingUp" size={20} />
            График прогресса
          </CardTitle>
          <div className="flex gap-2 flex-wrap">
            <Button
              size="sm"
              variant={chartFilter === 'all' ? 'default' : 'outline'}
              onClick={() => onFilterChange('all')}
            >
              Все
            </Button>
            {availableCategories.map(cat => (
              <Button
                key={cat}
                size="sm"
                variant={chartFilter === cat ? 'default' : 'outline'}
                onClick={() => onFilterChange(cat)}
                style={
                  chartFilter === cat 
                    ? { backgroundColor: getCategoryColor(cat), borderColor: getCategoryColor(cat) }
                    : {}
                }
              >
                {cat}
              </Button>
            ))}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="date" 
                style={{ fontSize: '12px' }}
              />
              <YAxis 
                domain={[0, 100]} 
                style={{ fontSize: '12px' }}
              />
              <Tooltip 
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-white p-3 border rounded-lg shadow-lg">
                        <p className="font-semibold">{data.category}</p>
                        <p className="text-sm text-muted-foreground">{data.date}</p>
                        <p className="text-lg font-bold mt-1">Оценка: {data.score}</p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Line 
                type="monotone" 
                dataKey="score" 
                stroke={chartFilter === 'all' ? '#8b5cf6' : getCategoryColor(chartFilter)} 
                strokeWidth={3}
                dot={{ fill: chartFilter === 'all' ? '#8b5cf6' : getCategoryColor(chartFilter), r: 5 }}
                activeDot={{ r: 7 }}
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-[300px] flex items-center justify-center text-muted-foreground">
            <div className="text-center">
              <Icon name="LineChart" size={48} className="mx-auto mb-2 opacity-50" />
              <p>Нет данных для отображения</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
