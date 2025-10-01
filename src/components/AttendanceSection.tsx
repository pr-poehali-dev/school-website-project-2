import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import Icon from '@/components/ui/icon';

interface AttendanceRecord {
  id: number;
  full_name: string;
  email: string;
  present: boolean;
  notes: string;
}

interface AttendanceSectionProps {
  attendance: AttendanceRecord[];
  attendanceDate: string;
  onDateChange: (date: string) => void;
  onToggle: (userId: number, present: boolean) => void;
}

const AttendanceSection = ({ attendance, attendanceDate, onDateChange, onToggle }: AttendanceSectionProps) => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold flex items-center gap-2">
          <Icon name="ClipboardCheck" className="text-primary" />
          Посещаемость
        </h2>
        <Input 
          type="date" 
          value={attendanceDate} 
          onChange={(e) => onDateChange(e.target.value)}
          className="w-auto"
        />
      </div>
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            {attendance.map((record) => (
              <div key={record.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                <div>
                  <p className="font-medium">{record.full_name}</p>
                  <p className="text-sm text-muted-foreground">{record.email}</p>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant={record.present ? 'default' : 'secondary'}>
                    {record.present ? 'Присутствует' : 'Отсутствует'}
                  </Badge>
                  <Switch 
                    checked={record.present} 
                    onCheckedChange={(checked) => onToggle(record.id, checked)}
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AttendanceSection;
