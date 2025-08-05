// 行程數據類型定義
export interface Event {
  id: string;
  title: string;
  description?: string;
  startTime: Date;
  endTime: Date;
  location?: string;
  isAllDay: boolean;
  reminderMinutes: number[];
  createdAt: Date;
  updatedAt: Date;
}

// 行程表單數據類型
export interface EventFormData {
  title: string;
  description: string;
  startTime: string;
  endTime: string;
  location: string;
  isAllDay: boolean;
  reminderMinutes: number[];
}

// 日曆視圖類型
export type CalendarView = 'month' | 'week' | 'day';

// 提醒選項
export const REMINDER_OPTIONS = [
  { value: 0, label: '準時' },
  { value: 15, label: '15分鐘前' },
  { value: 60, label: '1小時前' },
  { value: 1440, label: '1天前' },
  { value: 10080, label: '1週前' }
] as const;