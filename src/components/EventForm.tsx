import React, { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { format } from 'date-fns';
import { XMarkIcon, CalendarIcon, ClockIcon, MapPinIcon, BellIcon } from '@heroicons/react/24/outline';
import { useEventStore } from '@/lib/store';
import { EventFormData, REMINDER_OPTIONS } from '@/lib/types';
import { cn } from '@/lib/utils';

// 表單驗證 schema
const eventSchema = z.object({
  title: z.string().min(1, '請輸入行程標題').max(200, '標題不能超過200字'),
  description: z.string().max(1000, '描述不能超過1000字').optional(),
  startTime: z.string().min(1, '請選擇開始時間'),
  endTime: z.string().min(1, '請選擇結束時間'),
  location: z.string().max(200, '地點不能超過200字').optional(),
  isAllDay: z.boolean(),
  reminderMinutes: z.array(z.number())
}).refine((data) => {
  if (!data.isAllDay) {
    const start = new Date(data.startTime);
    const end = new Date(data.endTime);
    return start < end;
  }
  return true;
}, {
  message: '結束時間必須晚於開始時間',
  path: ['endTime']
});

type EventFormValues = z.infer<typeof eventSchema>;

interface EventFormProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function EventForm({ isOpen, onClose }: EventFormProps) {
  const {
    selectedEvent,
    isEditMode,
    addEvent,
    updateEvent,
    closeEventModal
  } = useEventStore();

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    reset,
    formState: { errors, isSubmitting }
  } = useForm<EventFormValues>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      title: '',
      description: '',
      startTime: '',
      endTime: '',
      location: '',
      isAllDay: false,
      reminderMinutes: [15]
    }
  });

  const isAllDay = watch('isAllDay');
  const reminderMinutes = watch('reminderMinutes');

  // 當選中的行程改變時，填充表單
  useEffect(() => {
    if (selectedEvent && isEditMode) {
      const formatDateTime = (date: Date) => {
        return format(date, "yyyy-MM-dd'T'HH:mm");
      };

      reset({
        title: selectedEvent.title,
        description: selectedEvent.description || '',
        startTime: formatDateTime(selectedEvent.startTime),
        endTime: formatDateTime(selectedEvent.endTime),
        location: selectedEvent.location || '',
        isAllDay: selectedEvent.isAllDay,
        reminderMinutes: selectedEvent.reminderMinutes
      });
    } else {
      // 新增模式，設置默認時間
      const now = new Date();
      const oneHourLater = new Date(now.getTime() + 60 * 60 * 1000);
      
      reset({
        title: '',
        description: '',
        startTime: format(now, "yyyy-MM-dd'T'HH:mm"),
        endTime: format(oneHourLater, "yyyy-MM-dd'T'HH:mm"),
        location: '',
        isAllDay: false,
        reminderMinutes: [15]
      });
    }
  }, [selectedEvent, isEditMode, reset]);

  // 處理全天行程切換
  useEffect(() => {
    if (isAllDay) {
      const startTime = watch('startTime');
      if (startTime) {
        const date = startTime.split('T')[0];
        setValue('startTime', `${date}T00:00`);
        setValue('endTime', `${date}T23:59`);
      }
    }
  }, [isAllDay, setValue, watch]);

  // 提交表單
  const onSubmit = (data: EventFormValues) => {
    const eventData = {
      title: data.title,
      description: data.description || '',
      startTime: new Date(data.startTime),
      endTime: new Date(data.endTime),
      location: data.location || '',
      isAllDay: data.isAllDay,
      reminderMinutes: data.reminderMinutes
    };

    if (isEditMode && selectedEvent) {
      updateEvent(selectedEvent.id, eventData);
    } else {
      addEvent(eventData);
    }

    handleClose();
  };

  // 處理提醒選項變更
  const handleReminderChange = (value: number, checked: boolean) => {
    const current = reminderMinutes || [];
    if (checked) {
      setValue('reminderMinutes', [...current, value].sort((a, b) => a - b));
    } else {
      setValue('reminderMinutes', current.filter(v => v !== value));
    }
  };

  const handleClose = () => {
    reset();
    closeEventModal();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        {/* 背景遮罩 */}
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
          onClick={handleClose}
        />

        {/* 表單容器 */}
        <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
          {/* 標題欄 */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">
              {isEditMode ? '編輯行程' : '新增行程'}
            </h3>
            <button
              onClick={handleClose}
              className="p-2 hover:bg-gray-100 rounded-md transition-colors"
            >
              <XMarkIcon className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {/* 表單內容 */}
          <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
            {/* 行程標題 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                行程標題 *
              </label>
              <input
                {...register('title')}
                type="text"
                className={cn(
                  'w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent',
                  errors.title && 'border-red-300 focus:ring-red-500'
                )}
                placeholder="輸入行程標題"
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
              )}
            </div>

            {/* 全天行程切換 */}
            <div className="flex items-center space-x-2">
              <input
                {...register('isAllDay')}
                type="checkbox"
                id="isAllDay"
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor="isAllDay" className="text-sm font-medium text-gray-700">
                全天行程
              </label>
            </div>

            {/* 時間選擇 */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  開始時間 *
                </label>
                <input
                  {...register('startTime')}
                  type={isAllDay ? 'date' : 'datetime-local'}
                  className={cn(
                    'w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent',
                    errors.startTime && 'border-red-300 focus:ring-red-500'
                  )}
                />
                {errors.startTime && (
                  <p className="mt-1 text-sm text-red-600">{errors.startTime.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  結束時間 *
                </label>
                <input
                  {...register('endTime')}
                  type={isAllDay ? 'date' : 'datetime-local'}
                  className={cn(
                    'w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent',
                    errors.endTime && 'border-red-300 focus:ring-red-500'
                  )}
                />
                {errors.endTime && (
                  <p className="mt-1 text-sm text-red-600">{errors.endTime.message}</p>
                )}
              </div>
            </div>

            {/* 地點 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                地點
              </label>
              <input
                {...register('location')}
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="輸入地點"
              />
            </div>

            {/* 描述 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                描述
              </label>
              <textarea
                {...register('description')}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="輸入行程描述"
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
              )}
            </div>

            {/* 提醒設置 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                提醒設置
              </label>
              <div className="space-y-2">
                {REMINDER_OPTIONS.map((option) => (
                  <label key={option.value} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={reminderMinutes?.includes(option.value) || false}
                      onChange={(e) => handleReminderChange(option.value, e.target.checked)}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">{option.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* 按鈕組 */}
            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={handleClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
              >
                取消
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-md transition-colors"
              >
                {isSubmitting ? '儲存中...' : (isEditMode ? '更新' : '新增')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}