import { create } from 'zustand';
import { Event, CalendarView } from './types';
import { format, startOfMonth, endOfMonth, addDays, isSameDay } from 'date-fns';

interface EventStore {
  // 狀態
  events: Event[];
  currentDate: Date;
  currentView: CalendarView;
  selectedEvent: Event | null;
  isEventModalOpen: boolean;
  isEditMode: boolean;

  // 行程操作
  addEvent: (event: Omit<Event, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateEvent: (id: string, event: Partial<Event>) => void;
  deleteEvent: (id: string) => void;
  getEventsByDate: (date: Date) => Event[];
  getEventsInRange: (startDate: Date, endDate: Date) => Event[];
  getTodayEvents: () => Event[];

  // UI 狀態操作
  setCurrentDate: (date: Date) => void;
  setCurrentView: (view: CalendarView) => void;
  setSelectedEvent: (event: Event | null) => void;
  openEventModal: (event?: Event) => void;
  closeEventModal: () => void;
  setEditMode: (isEdit: boolean) => void;
}

export const useEventStore = create<EventStore>((set, get) => ({
  // 初始狀態
  events: [
    // 示例數據
    {
      id: '1',
      title: '團隊會議',
      description: '討論項目進度和下週計劃',
      startTime: new Date(2024, 11, 20, 10, 0),
      endTime: new Date(2024, 11, 20, 11, 30),
      location: '會議室A',
      isAllDay: false,
      reminderMinutes: [15, 60],
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: '2',
      title: '客戶拜訪',
      description: '與重要客戶討論合作方案',
      startTime: new Date(2024, 11, 22, 14, 0),
      endTime: new Date(2024, 11, 22, 16, 0),
      location: '客戶辦公室',
      isAllDay: false,
      reminderMinutes: [60, 1440],
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: '3',
      title: '年終聚餐',
      description: '公司年終聚餐活動',
      startTime: new Date(2024, 11, 25, 0, 0),
      endTime: new Date(2024, 11, 25, 23, 59),
      location: '餐廳',
      isAllDay: true,
      reminderMinutes: [1440],
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ],
  currentDate: new Date(),
  currentView: 'month',
  selectedEvent: null,
  isEventModalOpen: false,
  isEditMode: false,

  // 行程操作
  addEvent: (eventData) => {
    const newEvent: Event = {
      ...eventData,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    set((state) => ({
      events: [...state.events, newEvent]
    }));
  },

  updateEvent: (id, eventData) => {
    set((state) => ({
      events: state.events.map((event) =>
        event.id === id
          ? { ...event, ...eventData, updatedAt: new Date() }
          : event
      )
    }));
  },

  deleteEvent: (id) => {
    set((state) => ({
      events: state.events.filter((event) => event.id !== id)
    }));
  },

  getEventsByDate: (date) => {
    const { events } = get();
    return events.filter((event) => {
      if (event.isAllDay) {
        return isSameDay(event.startTime, date);
      }
      return isSameDay(event.startTime, date) || isSameDay(event.endTime, date);
    });
  },

  getEventsInRange: (startDate, endDate) => {
    const { events } = get();
    return events.filter((event) => {
      return event.startTime >= startDate && event.startTime <= endDate;
    });
  },

  getTodayEvents: () => {
    const { getEventsByDate } = get();
    return getEventsByDate(new Date());
  },

  // UI 狀態操作
  setCurrentDate: (date) => set({ currentDate: date }),
  setCurrentView: (view) => set({ currentView: view }),
  setSelectedEvent: (event) => set({ selectedEvent: event }),
  
  openEventModal: (event) => {
    set({
      isEventModalOpen: true,
      selectedEvent: event || null,
      isEditMode: !!event
    });
  },

  closeEventModal: () => {
    set({
      isEventModalOpen: false,
      selectedEvent: null,
      isEditMode: false
    });
  },

  setEditMode: (isEdit) => set({ isEditMode: isEdit })
}));