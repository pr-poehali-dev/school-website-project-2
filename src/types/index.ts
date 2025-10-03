export interface User {
  id: number;
  email: string;
  full_name: string;
  role: string;
}

export interface NewsItem {
  id: number;
  title: string;
  content: string;
  author_name: string;
  image_url?: string;
  video_url?: string;
  created_at: string;
}

export interface Application {
  id: number;
  full_name: string;
  email: string;
  phone: string;
  message: string;
  status: string;
  created_at: string;
}

export interface AttendanceRecord {
  id: number;
  full_name: string;
  email: string;
  present: boolean;
  notes: string;
}

export interface RoleHistoryRecord {
  id: number;
  user_id: number;
  user_name: string;
  user_email: string;
  old_role: string;
  new_role: string;
  changed_by_admin_id: number | null;
  admin_name: string | null;
  changed_at: string;
  reason: string | null;
}
