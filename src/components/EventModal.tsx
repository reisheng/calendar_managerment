import React from 'react';
import { format } from 'date-fns';
import { zhTW } from 'date-fns/locale';
import {
  XMarkIcon,
  CalendarIcon,
  ClockIcon,
  MapPinIcon,
  DocumentTextIcon,
  BellIcon,
  PencilIcon,
  TrashIcon
} from '@heroicons/react/24/outline';
import { useEventStore } from '@/lib/store';
import { Event, REMINDER_OPTIONS } from '@/lib/types';
import { cn } from '@/lib/utils';

interface EventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEdit?: (event: Event) => void;
  onDelete?: (event: Event) => void;
}

export default function EventModal({ isOpen, onClose, onEdit, onDelete }: EventModalProps) {
  const {
    selectedEvent,
    deleteEvent,
    closeEventModal,
    openEventModal
  } = useEventStore();

  if (!isOpen || !selectedEvent) return null;

  const handleEdit = () => {
    onEdit?.(selectedEvent);
    openEventModal(selectedEvent);
  };

  const handleDelete = () => {
    if (window.confirm('確定要刪除這個行程嗎？')) {
      deleteEvent(selectedEvent.id);
      onDelete?.(selectedEvent);
      handleClose();
    }
  };

  const handleClose = () => {
    closeEventModal();
    onClose();
  };

  // 獲取提醒文字
  const getReminderText = (minutes: number[]) => {
    if (minutes.length === 0) return '無提醒';
    
    return minutes
      .map(min => REMINDER_OPTIONS.find(opt => opt.value === min)?.label || `${min}分鐘前`)
      .join('、');
  };

  // 格式化時間顯示
  const formatEventTime = (event: Event) => {
    if (event.isAllDay) {
      return '全天';
    }
    
    const startDate = format(event.startTime, 'yyyy年M月d日', { locale: zhTW });
    const endDate = format(event.endTime, 'yyyy年M月d日', { locale: zhTW });
    const startTime = format(event.startTime, 'HH:mm');
    const endTime = format(event.endTime, 'HH:mm');
    
    if (startDate === endDate) {
      return `${startDate} ${startTime} - ${endTime}`;
    } else {
      return `${startDate} ${startTime} - ${endDate} ${endTime}`;
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        {/* 背景遮罩 */}
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
          onClick={handleClose}
        />

        {/* 模態框容器 */}
        <div className="relative bg-white rounded-lg shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
          {/* 標題欄 */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div
                className={cn(
                  'w-4 h-4 rounded-full',
                  selectedEvent.isAllDay ? 'bg-blue-500' : 'bg-green-500'
                )}
              />
              <h3 className="text-xl font-semibold text-gray-900 line-clamp-2">
                {selectedEvent.title}
              </h3>
            </div>
            <button
              onClick={handleClose}
              className="p-2 hover:bg-gray-100 rounded-md transition-colors flex-shrink-0"
            >
              <XMarkIcon className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {/* 內容區域 */}
          <div className="p-6 space-y-6">
            {/* 時間資訊 */}
            <div className="flex items-start space-x-3">
              <ClockIcon className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-gray-900 mb-1">時間</p>
                <p className="text-sm text-gray-600">
                  {formatEventTime(selectedEvent)}
                </p>
              </div>
            </div>

            {/* 地點資訊 */}
            {selectedEvent.location && (
              <div className="flex items-start space-x-3">
                <MapPinIcon className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-gray-900 mb-1">地點</p>
                  <p className="text-sm text-gray-600">{selectedEvent.location}</p>
                </div>
              </div>
            )}

            {/* 描述 */}
            {selectedEvent.description && (
              <div className="flex items-start space-x-3">
                <DocumentTextIcon className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-gray-900 mb-1">描述</p>
                  <p className="text-sm text-gray-600 whitespace-pre-wrap">
                    {selectedEvent.description}
                  </p>
                </div>
              </div>
            )}

            {/* 提醒設置 */}
            <div className="flex items-start space-x-3">
              <BellIcon className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-gray-900 mb-1">提醒</p>
                <p className="text-sm text-gray-600">
                  {getReminderText(selectedEvent.reminderMinutes)}
                </p>
              </div>
            </div>

            {/* 建立時間 */}
            <div className="flex items-start space-x-3">
              <CalendarIcon className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-gray-900 mb-1">建立時間</p>
                <p className="text-sm text-gray-600">
                  {format(selectedEvent.createdAt, 'yyyy年M月d日 HH:mm', { locale: zhTW })}
                </p>
                {selectedEvent.updatedAt.getTime() !== selectedEvent.createdAt.getTime() && (
                  <p className="text-xs text-gray-500 mt-1">
                    最後更新：{format(selectedEvent.updatedAt, 'yyyy年M月d日 HH:mm', { locale: zhTW })}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* 操作按鈕 */}
          <div className="flex justify-end space-x-3 p-6 border-t border-gray-200 bg-gray-50">
            <button
              onClick={handleDelete}
              className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors"
            >
              <TrashIcon className="w-4 h-4" />
              <span>刪除</span>
            </button>
            <button
              onClick={handleEdit}
              className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors"
            >
              <PencilIcon className="w-4 h-4" />
              <span>編輯</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}