import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Icon from '@/components/ui/icon';

interface Grade {
  id: number;
  user_id: number;
  user_name?: string;
  category: string;
  score: number;
  comment: string;
  graded_at: string;
  graded_by_name: string;
}

interface Member {
  id: number;
  full_name: string;
  email: string;
}

interface GradesSectionProps {
  user: { id: number; role: string };
  apiUrl: string;
  onGradeAdded?: () => void;
}

const CATEGORIES = [
  'Техника',
  'Физическая подготовка',
  'Теория',
  'Дисциплина',
  'Посещаемость',
  'Спарринг',
  'Экзамен'
];

export default function GradesSection({ user, apiUrl, onGradeAdded }: GradesSectionProps) {
  const [grades, setGrades] = useState<Grade[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [isAddingGrade, setIsAddingGrade] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string>('');
  const [category, setCategory] = useState<string>('');
  const [score, setScore] = useState<string>('');
  const [comment, setComment] = useState<string>('');
  const [viewMode, setViewMode] = useState<'all' | 'my'>('my');
  const [chartFilter, setChartFilter] = useState<string>('all');

  useEffect(() => {
    loadGrades();
    if (user.role === 'admin') {
      loadMembers();
    }
  }, [viewMode]);

  const loadGrades = async () => {
    try {
      const url = viewMode === 'my' && user.role === 'member'
        ? `${apiUrl}?grades=true&user_id=${user.id}`
        : `${apiUrl}?grades=true`;
      
      const response = await fetch(url, {
        headers: { 'X-User-Role': user.role }
      });
      const data = await response.json();
      setGrades(data);
    } catch (error) {
      console.error('Ошибка загрузки оценок:', error);
    }
  };

  const loadMembers = async () => {
    try {
      const response = await fetch(apiUrl, {
        headers: { 'X-User-Role': 'admin' }
      });
      const data = await response.json();
      setMembers(data.filter((m: Member) => m.id !== user.id));
    } catch (error) {
      console.error('Ошибка загрузки участников:', error);
    }
  };

  const handleAddGrade = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedUserId || !category || !score) {
      return;
    }

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-User-Role': 'admin',
          'X-User-Id': user.id.toString()
        },
        body: JSON.stringify({
          action: 'add_grade',
          user_id: parseInt(selectedUserId),
          category,
          score: parseInt(score),
          comment
        })
      });

      const data = await response.json();
      
      if (data.success) {
        setIsAddingGrade(false);
        setSelectedUserId('');
        setCategory('');
        setScore('');
        setComment('');
        loadGrades();
        onGradeAdded?.();
      }
    } catch (error) {
      console.error('Ошибка добавления оценки:', error);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600 bg-green-50';
    if (score >= 75) return 'text-blue-600 bg-blue-50';
    if (score >= 60) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  const calculateAverage = () => {
    if (grades.length === 0) return 0;
    const sum = grades.reduce((acc, grade) => acc + grade.score, 0);
    return Math.round(sum / grades.length);
  };

  const calculateCategoryStats = () => {
    const stats: { [key: string]: { total: number; count: number; avg: number } } = {};
    
    grades.forEach(grade => {
      if (!stats[grade.category]) {
        stats[grade.category] = { total: 0, count: 0, avg: 0 };
      }
      stats[grade.category].total += grade.score;
      stats[grade.category].count += 1;
    });

    Object.keys(stats).forEach(category => {
      stats[category].avg = Math.round(stats[category].total / stats[category].count);
    });

    return stats;
  };

  const categoryStats = calculateCategoryStats();

  const prepareChartData = () => {
    let filteredGrades = [...grades];
    
    if (chartFilter !== 'all') {
      filteredGrades = filteredGrades.filter(g => g.category === chartFilter);
    }
    
    const sortedGrades = filteredGrades.sort((a, b) => 
      new Date(a.graded_at).getTime() - new Date(b.graded_at).getTime()
    );

    return sortedGrades.map((grade, index) => ({
      date: new Date(grade.graded_at).toLocaleDateString('ru-RU', { 
        day: '2-digit', 
        month: '2-digit' 
      }),
      score: grade.score,
      category: grade.category,
      index: index + 1
    }));
  };

  const chartData = prepareChartData();
  
  const availableCategories = Array.from(new Set(grades.map(g => g.category)));

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      'Техника': '#8b5cf6',
      'Физическая подготовка': '#ec4899',
      'Теория': '#3b82f6',
      'Дисциплина': '#10b981',
      'Посещаемость': '#f59e0b',
      'Спарринг': '#ef4444',
      'Экзамен': '#6366f1'
    };
    return colors[category] || '#6b7280';
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Табель оценок</h1>
        <p className="text-muted-foreground">
          {user.role === 'admin' ? 'Управление оценками участников' : 'Ваши результаты и оценки'}
        </p>
      </div>

      {user.role === 'member' && grades.length > 0 && (
        <>
          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Средний балл</p>
                  <p className="text-4xl font-bold">{calculateAverage()}</p>
                </div>
                <Icon name="Award" size={48} className="text-primary" />
              </div>
            </CardContent>
          </Card>

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
                    onClick={() => setChartFilter('all')}
                  >
                    Все
                  </Button>
                  {availableCategories.map(cat => (
                    <Button
                      key={cat}
                      size="sm"
                      variant={chartFilter === cat ? 'default' : 'outline'}
                      onClick={() => setChartFilter(cat)}
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
        </>
      )}

      {user.role === 'admin' && (
        <>
          {viewMode === 'all' && Object.keys(categoryStats).length > 0 && (
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
          )}

          <div className="mb-6 flex gap-4 flex-wrap items-center">
            <div className="flex gap-2">
              <Button
                variant={viewMode === 'all' ? 'default' : 'outline'}
                onClick={() => setViewMode('all')}
              >
                <Icon name="Users" size={16} className="mr-2" />
                Все оценки
              </Button>
              <Button
                variant={viewMode === 'my' ? 'default' : 'outline'}
                onClick={() => setViewMode('my')}
              >
                <Icon name="User" size={16} className="mr-2" />
                Мои оценки
              </Button>
            </div>
            
            <Button onClick={() => setIsAddingGrade(!isAddingGrade)} className="ml-auto">
              <Icon name={isAddingGrade ? 'X' : 'Plus'} size={16} className="mr-2" />
              {isAddingGrade ? 'Отменить' : 'Добавить оценку'}
            </Button>
          </div>
        </>
      )}

      {isAddingGrade && user.role === 'admin' && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Новая оценка</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAddGrade} className="space-y-4">
              <div>
                <Label>Участник</Label>
                <Select value={selectedUserId} onValueChange={setSelectedUserId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите участника" />
                  </SelectTrigger>
                  <SelectContent>
                    {members.map((member) => (
                      <SelectItem key={member.id} value={member.id.toString()}>
                        {member.full_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Категория</Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите категорию" />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Оценка (0-100)</Label>
                <Input
                  type="number"
                  min="0"
                  max="100"
                  value={score}
                  onChange={(e) => setScore(e.target.value)}
                  placeholder="Введите оценку"
                />
              </div>

              <div>
                <Label>Комментарий (опционально)</Label>
                <Textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Добавьте комментарий к оценке"
                  rows={3}
                />
              </div>

              <Button type="submit" className="w-full">
                <Icon name="Save" size={16} className="mr-2" />
                Сохранить оценку
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4">
        {grades.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Icon name="FileText" size={48} className="mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">
                {user.role === 'admin' ? 'Оценок пока нет. Добавьте первую оценку.' : 'У вас пока нет оценок'}
              </p>
            </CardContent>
          </Card>
        ) : (
          grades.map((grade) => (
            <Card key={grade.id}>
              <CardContent className="py-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      {grade.user_name && (
                        <h3 className="font-semibold text-lg">{grade.user_name}</h3>
                      )}
                      <span className="text-sm px-3 py-1 rounded-full bg-secondary">
                        {grade.category}
                      </span>
                    </div>
                    
                    {grade.comment && (
                      <p className="text-sm text-muted-foreground mb-2">{grade.comment}</p>
                    )}
                    
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Icon name="User" size={12} />
                        {grade.graded_by_name}
                      </span>
                      <span className="flex items-center gap-1">
                        <Icon name="Calendar" size={12} />
                        {new Date(grade.graded_at).toLocaleDateString('ru-RU')}
                      </span>
                    </div>
                  </div>
                  
                  <div className={`text-3xl font-bold px-4 py-2 rounded-lg ${getScoreColor(grade.score)}`}>
                    {grade.score}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}