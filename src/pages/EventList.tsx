import React, { useState, useMemo } from 'react';
import { format, isAfter, isBefore, startOfDay, endOfDay } from 'date-fns';
import { zhTW } from 'date-fns/locale';
import {
  MagnifyingGlassIcon,
  FunnelIcon,
  CalendarIcon,
  ClockIcon,
  MapPinIcon,
  PlusIcon,
  ChevronDownIcon
} from '@heroicons/react/24/outline';
import { useEventStore } from '@/lib/store';
import { Event } from '@/lib/types';
import { cn } from '@/lib/utils';
import EventForm from '@/components/EventForm';

type SortOption = 'startTime' | 'title' | 'createdAt';
type FilterOption = 'all' | 'upcoming' | 'past' | 'today';

export default function EventList() {
  const {
    events,
    openEventModal,
    deleteEvent
  } = useEventStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('startTime');
  const [filterBy, setFilterBy] = useState<FilterOption>('all');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isEventFormOpen, setIsEventFormOpen] = useState(false);

  // 篩選和排序邏輯
  const filteredAndSortedEvents = useMemo(() => {
    let filtered = events;

    // 搜尋篩選
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(event => 
        event.title.toLowerCase().includes(query) ||
        event.description?.toLowerCase().includes(query) ||
        event.location?.toLowerCase().includes(query)
      );
    }

    // 時間篩選
    const now = new Date();
    const today = startOfDay(now);
    const endToday = endOfDay(now);

    switch (filterBy) {
      case 'upcoming':
        filtered = filtered.filter(event => isAfter(event.startTime, now));
        break;
      case 'past':
        filtered = filtered.filter(event => isBefore(event.endTime, now));
        break;
      case 'today':
        filtered = filtered.filter(event => 
          (event.startTime >= today && event.startTime <= endToday) ||
          (event.endTime >= today && event.endTime <= endToday) ||
          (event.startTime <= today && event.endTime >= endToday)
        );
        break;
      default:
        // 'all' - 不篩選
        break;
    }

    // 排序
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'title':
          return a.title.localeCompare(b.title);
        case 'createdAt':
          return b.createdAt.getTime() - a.createdAt.getTime();
        case 'startTime':
        default:
          return a.startTime.getTime() - b.startTime.getTime();
      }
    });

    return filtered;
  }, [events, searchQuery, sortBy, filterBy]);

  // 處理行程點擊
  const handleEventClick = (event: Event) => {
    openEventModal(event);
  };

  // 處理刪除行程
  const handleDeleteEvent = (event: Event, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('確定要刪除這個行程嗎？')) {
      deleteEvent(event.id);
    }
  };

  // 格式化時間顯示
  const formatEventTime = (event: Event) => {
    if (event.isAllDay) {
      return {
        date: format(event.startTime, 'M月d日', { locale: zhTW }),
        time: '全天'
      };
    }
    
    const startDate = format(event.startTime, 'M月d日', { locale: zhTW });
    const endDate = format(event.endTime, 'M月d日', { locale: zhTW });
    const startTime = format(event.startTime, 'HH:mm');
    const endTime = format(event.endTime, 'HH:mm');
    
    if (startDate === endDate) {
      return {
        date: startDate,
        time: `${startTime} - ${endTime}`
      };
    } else {
      return {
        date: `${startDate} - ${endDate}`,
        time: `${startTime} - ${endTime}`
      };
    }
  };

  // 判斷行程狀態
  const getEventStatus = (event: Event) => {
    const now = new Date();
    if (isBefore(event.endTime, now)) {
      return { status: 'past', label: '已結束', color: 'text-gray-500 bg-gray-100' };
    } else if (isAfter(event.startTime, now)) {
      return { status: 'upcoming', label: '即將開始', color: 'text-blue-600 bg-blue-100' };
    } else {
      return { status: 'ongoing', label: '進行中', color: 'text-green-600 bg-green-100' };
    }
  };

  const filterOptions = [
    { value: 'all', label: '全部行程' },
    { value: 'today', label: '今日行程' },
    { value: 'upcoming', label: '即將到來' },
    { value: 'past', label: '已結束' }
  ];

  const sortOptions = [
    { value: 'startTime', label: '按時間排序' },
    { value: 'title', label: '按標題排序' },
    { value: 'createdAt', label: '按建立時間排序' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 頂部工具欄 */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-12">
            <h2 className="text-lg font-medium text-gray-900">
              所有行程
            </h2>
            
            <button
              onClick={() => setIsEventFormOpen(true)}
              className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors"
            >
              新增行程
            </button>
          </div>
        </div>
      </header>

      {/* 主要內容 */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 搜尋和篩選欄 */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* 搜尋框 */}
            <div className="flex-1 relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="搜尋行程標題、描述或地點..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* 篩選和排序 */}
            <div className="flex space-x-3">
              {/* 篩選下拉選單 */}
              <div className="relative">
                <button
                  onClick={() => setIsFilterOpen(!isFilterOpen)}
                  className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                >
                  <FunnelIcon className="w-4 h-4" />
                  <span>{filterOptions.find(opt => opt.value === filterBy)?.label}</span>
                  <ChevronDownIcon className="w-4 h-4" />
                </button>
                
                {isFilterOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-10">
                    {filterOptions.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => {
                          setFilterBy(option.value as FilterOption);
                          setIsFilterOpen(false);
                        }}
                        className={cn(
                          'w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors',
                          filterBy === option.value && 'bg-blue-50 text-blue-600'
                        )}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* 排序選擇 */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* 行程統計 */}
        <div className="mb-6">
          <p className="text-sm text-gray-600">
            共找到 <span className="font-medium text-gray-900">{filteredAndSortedEvents.length}</span> 個行程
          </p>
        </div>

        {/* 行程列表 */}
        <div className="space-y-4">
          {filteredAndSortedEvents.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
              <CalendarIcon className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">沒有找到行程</h3>
              <p className="text-gray-500 mb-6">
                {searchQuery ? '請嘗試其他搜尋關鍵字' : '開始建立您的第一個行程吧'}
              </p>
              <button
                onClick={() => openEventModal()}
                className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors"
              >
                新增行程
              </button>
            </div>
          ) : (
            filteredAndSortedEvents.map((event) => {
              const timeInfo = formatEventTime(event);
              const statusInfo = getEventStatus(event);
              
              return (
                <div
                  key={event.id}
                  onClick={() => handleEventClick(event)}
                  className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:border-blue-300 hover:shadow-md cursor-pointer transition-all group"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      {/* 標題和狀態 */}
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-medium text-gray-900 group-hover:text-blue-700 transition-colors truncate">
                          {event.title}
                        </h3>
                        <span className={cn(
                          'px-2 py-1 text-xs font-medium rounded-full',
                          statusInfo.color
                        )}>
                          {statusInfo.label}
                        </span>
                        <div className={cn(
                          'w-3 h-3 rounded-full flex-shrink-0',
                          event.isAllDay ? 'bg-blue-400' : 'bg-green-400'
                        )} />
                      </div>

                      {/* 時間資訊 */}
                      <div className="flex items-center space-x-4 text-sm text-gray-600 mb-2">
                        <div className="flex items-center space-x-1">
                          <CalendarIcon className="w-4 h-4" />
                          <span>{timeInfo.date}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <ClockIcon className="w-4 h-4" />
                          <span>{timeInfo.time}</span>
                        </div>
                      </div>

                      {/* 地點 */}
                      {event.location && (
                        <div className="flex items-center space-x-1 text-sm text-gray-600 mb-2">
                          <MapPinIcon className="w-4 h-4" />
                          <span>{event.location}</span>
                        </div>
                      )}

                      {/* 描述 */}
                      {event.description && (
                        <p className="text-sm text-gray-500 line-clamp-2 mb-2">
                          {event.description}
                        </p>
                      )}

                      {/* 提醒標示 */}
                      {event.reminderMinutes.length > 0 && (
                        <div className="flex items-center space-x-1">
                          <div className="w-2 h-2 bg-yellow-400 rounded-full" />
                          <span className="text-xs text-gray-500">
                            已設定 {event.reminderMinutes.length} 個提醒
                          </span>
                        </div>
                      )}
                    </div>

                    {/* 操作按鈕 */}
                    <div className="flex items-center space-x-2 ml-4">
                      <button
                        onClick={(e) => handleDeleteEvent(event, e)}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors opacity-0 group-hover:opacity-100"
                        title="刪除行程"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </main>

      {/* 行程表單模態框 */}
      <EventForm 
        isOpen={isEventFormOpen}
        onClose={() => setIsEventFormOpen(false)}
      />
    </div>
  );
}