import { useState, useEffect } from 'react';
import GradesSummaryCard from '@/components/grades/GradesSummaryCard';
import GradesProgressChart from '@/components/grades/GradesProgressChart';
import GradesCategoryStats from '@/components/grades/GradesCategoryStats';
import AdminCategoryStats from '@/components/grades/AdminCategoryStats';
import AdminControls from '@/components/grades/AdminControls';
import AddGradeForm from '@/components/grades/AddGradeForm';
import GradesList from '@/components/grades/GradesList';

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
          <GradesSummaryCard average={calculateAverage()} />
          
          <GradesProgressChart
            chartData={chartData}
            chartFilter={chartFilter}
            availableCategories={availableCategories}
            getCategoryColor={getCategoryColor}
            onFilterChange={setChartFilter}
          />

          <GradesCategoryStats 
            categoryStats={categoryStats}
            getScoreColor={getScoreColor}
          />
        </>
      )}

      {user.role === 'admin' && (
        <>
          {viewMode === 'all' && Object.keys(categoryStats).length > 0 && (
            <AdminCategoryStats 
              categoryStats={categoryStats}
              getScoreColor={getScoreColor}
            />
          )}

          <AdminControls
            viewMode={viewMode}
            isAddingGrade={isAddingGrade}
            onViewModeChange={setViewMode}
            onToggleAddGrade={() => setIsAddingGrade(!isAddingGrade)}
          />
        </>
      )}

      {isAddingGrade && user.role === 'admin' && (
        <AddGradeForm
          members={members}
          categories={CATEGORIES}
          selectedUserId={selectedUserId}
          category={category}
          score={score}
          comment={comment}
          onUserIdChange={setSelectedUserId}
          onCategoryChange={setCategory}
          onScoreChange={setScore}
          onCommentChange={setComment}
          onSubmit={handleAddGrade}
        />
      )}

      <GradesList 
        grades={grades}
        getScoreColor={getScoreColor}
        userRole={user.role}
      />
    </div>
  );
}
