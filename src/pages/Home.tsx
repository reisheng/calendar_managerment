import React, { useState } from 'react';
import Calendar from '@/components/Calendar';
import TodayEvents from '@/components/TodayEvents';
import EventForm from '@/components/EventForm';
import EventModal from '@/components/EventModal';
import FloatingActionButton from '@/components/FloatingActionButton';
import { useEventStore } from '@/lib/store';
import { Event } from '@/lib/types';

export default function Home() {
  const {
    isEventModalOpen,
    selectedEvent,
    isEditMode,
    closeEventModal
  } = useEventStore();

  const [isEventFormOpen, setIsEventFormOpen] = useState(false);
  const [isEventDetailOpen, setIsEventDetailOpen] = useState(false);

  // 處理日期點擊
  const handleDateClick = (date: Date) => {
    console.log('Date clicked:', date);
    // 可以在這裡添加日期點擊的邏輯，比如跳轉到該日期的詳細視圖
  };

  // 處理行程點擊
  const handleEventClick = (event: Event) => {
    setIsEventDetailOpen(true);
  };

  // 處理編輯行程
  const handleEditEvent = (event: Event) => {
    setIsEventDetailOpen(false);
    setIsEventFormOpen(true);
  };

  // 處理刪除行程
  const handleDeleteEvent = (event: Event) => {
    setIsEventDetailOpen(false);
  };

  // 關閉表單
  const handleCloseForm = () => {
    setIsEventFormOpen(false);
    closeEventModal();
  };

  // 關閉詳情
  const handleCloseDetail = () => {
    setIsEventDetailOpen(false);
    closeEventModal();
  };

  // 監聽 store 中的模態框狀態
  React.useEffect(() => {
    if (isEventModalOpen) {
      if (isEditMode) {
        setIsEventFormOpen(true);
        setIsEventDetailOpen(false);
      } else if (selectedEvent) {
        setIsEventDetailOpen(true);
        setIsEventFormOpen(false);
      } else {
        setIsEventFormOpen(true);
        setIsEventDetailOpen(false);
      }
    }
  }, [isEventModalOpen, isEditMode, selectedEvent]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 頂部信息 */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-12">
            <h2 className="text-lg font-medium text-gray-900">
              今日行程
            </h2>
            
            <div className="text-sm text-gray-600">
              {new Date().toLocaleDateString('zh-TW')}
            </div>
          </div>
        </div>
      </header>

      {/* 主要內容區域 */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* 月曆視圖 */}
          <div className="lg:col-span-3">
            <Calendar 
              onDateClick={handleDateClick}
              onEventClick={handleEventClick}
            />
          </div>

          {/* 今日行程側邊欄 */}
          <div className="lg:col-span-1">
            <TodayEvents onEventClick={handleEventClick} />
          </div>
        </div>
      </main>

      {/* 浮動新增按鈕 */}
      <FloatingActionButton />

      {/* 行程表單模態框 */}
      <EventForm 
        isOpen={isEventFormOpen}
        onClose={handleCloseForm}
      />

      {/* 行程詳情模態框 */}
      <EventModal 
        isOpen={isEventDetailOpen}
        onClose={handleCloseDetail}
        onEdit={handleEditEvent}
        onDelete={handleDeleteEvent}
      />
    </div>
  );
}