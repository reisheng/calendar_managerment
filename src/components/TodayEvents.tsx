import React from 'react';
import { format } from 'date-fns';
import { zhTW } from 'date-fns/locale';
import { ClockIcon, MapPinIcon, CalendarIcon } from '@heroicons/react/24/outline';
import { useEventStore } from '@/lib/store';
import { Event } from '@/lib/types';
import { cn } from '@/lib/utils';

interface TodayEventsProps {
  onEventClick?: (event: Event) => void;
}

export default function TodayEvents({ onEventClick }: TodayEventsProps) {
  const { getTodayEvents, openEventModal } = useEventStore();
  const todayEvents = getTodayEvents();

  // 按時間排序
  const sortedEvents = todayEvents.sort((a, b) => {
    if (a.isAllDay && !b.isAllDay) return -1;
    if (!a.isAllDay && b.isAllDay) return 1;
    return a.startTime.getTime() - b.startTime.getTime();
  });

  const handleEventClick = (event: Event) => {
    onEventClick?.(event);
    openEventModal(event);
  };

  const handleCreateEvent = () => {
    openEventModal();
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 h-fit">
      {/* 標題 */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className="flex items-center space-x-2">
          <CalendarIcon className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900">
            今日行程
          </h3>
        </div>
        <span className="text-sm text-gray-500">
          {format(new Date(), 'M月d日', { locale: zhTW })}
        </span>
      </div>

      {/* 行程列表 */}
      <div className="p-4">
        {sortedEvents.length === 0 ? (
          <div className="text-center py-8">
            <CalendarIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 text-sm mb-4">今天沒有安排行程</p>
            <button
              onClick={handleCreateEvent}
              className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors"
            >
              新增行程
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {sortedEvents.map((event) => (
              <div
                key={event.id}
                onClick={() => handleEventClick(event)}
                className="p-3 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 cursor-pointer transition-all group"
              >
                {/* 行程標題 */}
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-medium text-gray-900 group-hover:text-blue-700 transition-colors">
                    {event.title}
                  </h4>
                  <div
                    className={cn(
                      'w-3 h-3 rounded-full flex-shrink-0 ml-2',
                      event.isAllDay ? 'bg-blue-400' : 'bg-green-400'
                    )}
                  />
                </div>

                {/* 時間資訊 */}
                <div className="flex items-center space-x-2 text-sm text-gray-600 mb-1">
                  <ClockIcon className="w-4 h-4" />
                  <span>
                    {event.isAllDay
                      ? '全天'
                      : `${format(event.startTime, 'HH:mm')} - ${format(event.endTime, 'HH:mm')}`
                    }
                  </span>
                </div>

                {/* 地點資訊 */}
                {event.location && (
                  <div className="flex items-center space-x-2 text-sm text-gray-600 mb-1">
                    <MapPinIcon className="w-4 h-4" />
                    <span>{event.location}</span>
                  </div>
                )}

                {/* 描述 */}
                {event.description && (
                  <p className="text-sm text-gray-500 mt-2 line-clamp-2">
                    {event.description}
                  </p>
                )}

                {/* 提醒標示 */}
                {event.reminderMinutes.length > 0 && (
                  <div className="flex items-center space-x-1 mt-2">
                    <div className="w-2 h-2 bg-yellow-400 rounded-full" />
                    <span className="text-xs text-gray-500">
                      已設定 {event.reminderMinutes.length} 個提醒
                    </span>
                  </div>
                )}
              </div>
            ))}

            {/* 新增行程按鈕 */}
            <button
              onClick={handleCreateEvent}
              className="w-full p-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-blue-400 hover:text-blue-600 transition-colors text-sm font-medium"
            >
              + 新增今日行程
            </button>
          </div>
        )}
      </div>
    </div>
  );
}