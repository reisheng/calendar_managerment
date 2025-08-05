import React from 'react';
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, isSameMonth, isSameDay, isToday } from 'date-fns';
import { zhTW } from 'date-fns/locale';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { useEventStore } from '@/lib/store';
import { Event } from '@/lib/types';
import { cn } from '@/lib/utils';

interface CalendarProps {
  onDateClick?: (date: Date) => void;
  onEventClick?: (event: Event) => void;
}

export default function Calendar({ onDateClick, onEventClick }: CalendarProps) {
  const {
    currentDate,
    setCurrentDate,
    getEventsByDate,
    openEventModal
  } = useEventStore();

  // 獲取月曆顯示範圍
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const startDate = startOfWeek(monthStart, { weekStartsOn: 1 }); // 週一開始
  const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });

  // 生成日期網格
  const generateCalendarDays = () => {
    const days = [];
    let day = startDate;

    while (day <= endDate) {
      days.push(day);
      day = addDays(day, 1);
    }

    return days;
  };

  const calendarDays = generateCalendarDays();
  const weekDays = ['一', '二', '三', '四', '五', '六', '日'];

  // 導航函數
  const goToPreviousMonth = () => {
    setCurrentDate(addDays(startOfMonth(currentDate), -1));
  };

  const goToNextMonth = () => {
    setCurrentDate(addDays(endOfMonth(currentDate), 1));
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  // 處理日期點擊
  const handleDateClick = (date: Date) => {
    onDateClick?.(date);
  };

  // 處理行程點擊
  const handleEventClick = (event: Event, e: React.MouseEvent) => {
    e.stopPropagation();
    onEventClick?.(event);
    openEventModal(event);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      {/* 月曆標題和導航 */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className="flex items-center space-x-4">
          <h2 className="text-xl font-semibold text-gray-900">
            {format(currentDate, 'yyyy年 M月', { locale: zhTW })}
          </h2>
          <button
            onClick={goToToday}
            className="px-3 py-1 text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-md transition-colors"
          >
            今天
          </button>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={goToPreviousMonth}
            className="p-2 hover:bg-gray-100 rounded-md transition-colors"
          >
            <ChevronLeftIcon className="w-5 h-5 text-gray-600" />
          </button>
          <button
            onClick={goToNextMonth}
            className="p-2 hover:bg-gray-100 rounded-md transition-colors"
          >
            <ChevronRightIcon className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>

      {/* 週標題 */}
      <div className="grid grid-cols-7 border-b border-gray-200">
        {weekDays.map((day) => (
          <div
            key={day}
            className="p-3 text-center text-sm font-medium text-gray-500 bg-gray-50"
          >
            {day}
          </div>
        ))}
      </div>

      {/* 日期網格 */}
      <div className="grid grid-cols-7">
        {calendarDays.map((day, index) => {
          const dayEvents = getEventsByDate(day);
          const isCurrentMonth = isSameMonth(day, currentDate);
          const isSelected = isSameDay(day, currentDate);
          const isTodayDate = isToday(day);

          return (
            <div
              key={index}
              className={cn(
                'min-h-[120px] p-2 border-r border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors',
                !isCurrentMonth && 'bg-gray-50 text-gray-400',
                isTodayDate && 'bg-blue-50'
              )}
              onClick={() => handleDateClick(day)}
            >
              {/* 日期數字 */}
              <div className="flex justify-between items-start mb-1">
                <span
                  className={cn(
                    'text-sm font-medium',
                    isTodayDate && 'bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs',
                    !isCurrentMonth && 'text-gray-400'
                  )}
                >
                  {format(day, 'd')}
                </span>
                {dayEvents.length > 0 && (
                  <span className="text-xs text-gray-500">
                    {dayEvents.length}
                  </span>
                )}
              </div>

              {/* 行程列表 */}
              <div className="space-y-1">
                {dayEvents.slice(0, 3).map((event) => (
                  <div
                    key={event.id}
                    onClick={(e) => handleEventClick(event, e)}
                    className={cn(
                      'text-xs p-1 rounded truncate cursor-pointer transition-colors',
                      event.isAllDay
                        ? 'bg-blue-100 text-blue-800 hover:bg-blue-200'
                        : 'bg-green-100 text-green-800 hover:bg-green-200'
                    )}
                    title={event.title}
                  >
                    {event.isAllDay ? (
                      event.title
                    ) : (
                      `${format(event.startTime, 'HH:mm')} ${event.title}`
                    )}
                  </div>
                ))}
                {dayEvents.length > 3 && (
                  <div className="text-xs text-gray-500 text-center">
                    +{dayEvents.length - 3} 更多
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}