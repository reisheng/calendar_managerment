import React, { useState } from 'react';
import {
  CogIcon,
  BellIcon,
  CalendarIcon,
  ClockIcon,
  GlobeAltIcon,
  UserIcon,
  MoonIcon,
  SunIcon
} from '@heroicons/react/24/outline';
import { cn } from '@/lib/utils';

interface SettingsState {
  // 個人偏好
  defaultView: 'month' | 'week' | 'day';
  weekStartsOn: 0 | 1; // 0: 週日, 1: 週一
  timeFormat: '12h' | '24h';
  theme: 'light' | 'dark' | 'system';
  language: 'zh-TW' | 'en-US';
  
  // 通知設定
  enableNotifications: boolean;
  emailReminders: boolean;
  pushNotifications: boolean;
  soundEnabled: boolean;
  defaultReminderMinutes: number;
  
  // 顯示設定
  showWeekends: boolean;
  showDeclinedEvents: boolean;
  compactView: boolean;
}

export default function Settings() {
  const [settings, setSettings] = useState<SettingsState>({
    // 個人偏好預設值
    defaultView: 'month',
    weekStartsOn: 1,
    timeFormat: '24h',
    theme: 'light',
    language: 'zh-TW',
    
    // 通知設定預設值
    enableNotifications: true,
    emailReminders: true,
    pushNotifications: true,
    soundEnabled: true,
    defaultReminderMinutes: 15,
    
    // 顯示設定預設值
    showWeekends: true,
    showDeclinedEvents: false,
    compactView: false
  });

  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  // 更新設定
  const updateSetting = <K extends keyof SettingsState>(key: K, value: SettingsState[K]) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  // 儲存設定
  const handleSave = async () => {
    setIsSaving(true);
    
    // 模擬 API 呼叫
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // 在實際應用中，這裡會呼叫 API 儲存設定
    localStorage.setItem('calendarSettings', JSON.stringify(settings));
    
    setIsSaving(false);
    setSaveMessage('設定已儲存');
    
    // 清除訊息
    setTimeout(() => setSaveMessage(''), 3000);
  };

  // 重置設定
  const handleReset = () => {
    if (window.confirm('確定要重置所有設定為預設值嗎？')) {
      setSettings({
        defaultView: 'month',
        weekStartsOn: 1,
        timeFormat: '24h',
        theme: 'light',
        language: 'zh-TW',
        enableNotifications: true,
        emailReminders: true,
        pushNotifications: true,
        soundEnabled: true,
        defaultReminderMinutes: 15,
        showWeekends: true,
        showDeclinedEvents: false,
        compactView: false
      });
    }
  };

  const SettingSection = ({ title, icon: Icon, children }: {
    title: string;
    icon: React.ComponentType<{ className?: string }>;
    children: React.ReactNode;
  }) => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center space-x-3 mb-6">
        <Icon className="w-5 h-5 text-blue-600" />
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      </div>
      <div className="space-y-4">
        {children}
      </div>
    </div>
  );

  const SettingItem = ({ label, description, children }: {
    label: string;
    description?: string;
    children: React.ReactNode;
  }) => (
    <div className="flex items-center justify-between py-2">
      <div className="flex-1">
        <label className="text-sm font-medium text-gray-900">{label}</label>
        {description && (
          <p className="text-sm text-gray-500 mt-1">{description}</p>
        )}
      </div>
      <div className="ml-4">
        {children}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 頂部工具欄 */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-12">
            <h2 className="text-lg font-medium text-gray-900">
              系統設定
            </h2>
            
            <div className="flex items-center space-x-3">
              {saveMessage && (
                <span className="text-sm text-green-600 font-medium">
                  {saveMessage}
                </span>
              )}
              <button
                onClick={handleReset}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
              >
                重置
              </button>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isSaving ? '儲存中...' : '儲存設定'}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* 主要內容 */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* 個人偏好設定 */}
          <SettingSection title="個人偏好" icon={UserIcon}>
            <SettingItem 
              label="預設視圖" 
              description="開啟應用程式時的預設日曆視圖"
            >
              <select
                value={settings.defaultView}
                onChange={(e) => updateSetting('defaultView', e.target.value as 'month' | 'week' | 'day')}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="month">月視圖</option>
                <option value="week">週視圖</option>
                <option value="day">日視圖</option>
              </select>
            </SettingItem>

            <SettingItem 
              label="週開始日" 
              description="設定一週的開始日期"
            >
              <select
                value={settings.weekStartsOn}
                onChange={(e) => updateSetting('weekStartsOn', parseInt(e.target.value) as 0 | 1)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value={1}>週一</option>
                <option value={0}>週日</option>
              </select>
            </SettingItem>

            <SettingItem 
              label="時間格式" 
              description="選擇時間顯示格式"
            >
              <select
                value={settings.timeFormat}
                onChange={(e) => updateSetting('timeFormat', e.target.value as '12h' | '24h')}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="24h">24小時制</option>
                <option value="12h">12小時制</option>
              </select>
            </SettingItem>

            <SettingItem 
              label="主題" 
              description="選擇應用程式外觀主題"
            >
              <select
                value={settings.theme}
                onChange={(e) => updateSetting('theme', e.target.value as 'light' | 'dark' | 'system')}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="light">淺色主題</option>
                <option value="dark">深色主題</option>
                <option value="system">跟隨系統</option>
              </select>
            </SettingItem>

            <SettingItem 
              label="語言" 
              description="選擇介面語言"
            >
              <select
                value={settings.language}
                onChange={(e) => updateSetting('language', e.target.value as 'zh-TW' | 'en-US')}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="zh-TW">繁體中文</option>
                <option value="en-US">English</option>
              </select>
            </SettingItem>
          </SettingSection>

          {/* 通知設定 */}
          <SettingSection title="通知設定" icon={BellIcon}>
            <SettingItem 
              label="啟用通知" 
              description="允許應用程式發送通知"
            >
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.enableNotifications}
                  onChange={(e) => updateSetting('enableNotifications', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </SettingItem>

            <SettingItem 
              label="電子郵件提醒" 
              description="透過電子郵件接收行程提醒"
            >
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.emailReminders}
                  onChange={(e) => updateSetting('emailReminders', e.target.checked)}
                  disabled={!settings.enableNotifications}
                  className="sr-only peer"
                />
                <div className={cn(
                  "w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600",
                  !settings.enableNotifications && "opacity-50 cursor-not-allowed"
                )}></div>
              </label>
            </SettingItem>

            <SettingItem 
              label="推送通知" 
              description="在瀏覽器中顯示推送通知"
            >
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.pushNotifications}
                  onChange={(e) => updateSetting('pushNotifications', e.target.checked)}
                  disabled={!settings.enableNotifications}
                  className="sr-only peer"
                />
                <div className={cn(
                  "w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600",
                  !settings.enableNotifications && "opacity-50 cursor-not-allowed"
                )}></div>
              </label>
            </SettingItem>

            <SettingItem 
              label="聲音提示" 
              description="播放通知聲音"
            >
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.soundEnabled}
                  onChange={(e) => updateSetting('soundEnabled', e.target.checked)}
                  disabled={!settings.enableNotifications}
                  className="sr-only peer"
                />
                <div className={cn(
                  "w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600",
                  !settings.enableNotifications && "opacity-50 cursor-not-allowed"
                )}></div>
              </label>
            </SettingItem>

            <SettingItem 
              label="預設提醒時間" 
              description="新增行程時的預設提醒時間"
            >
              <select
                value={settings.defaultReminderMinutes}
                onChange={(e) => updateSetting('defaultReminderMinutes', parseInt(e.target.value))}
                disabled={!settings.enableNotifications}
                className={cn(
                  "px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent",
                  !settings.enableNotifications && "opacity-50 cursor-not-allowed"
                )}
              >
                <option value={0}>準時</option>
                <option value={15}>15分鐘前</option>
                <option value={60}>1小時前</option>
                <option value={1440}>1天前</option>
                <option value={10080}>1週前</option>
              </select>
            </SettingItem>
          </SettingSection>

          {/* 顯示設定 */}
          <SettingSection title="顯示設定" icon={CalendarIcon}>
            <SettingItem 
              label="顯示週末" 
              description="在日曆視圖中顯示週末"
            >
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.showWeekends}
                  onChange={(e) => updateSetting('showWeekends', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </SettingItem>

            <SettingItem 
              label="顯示已拒絕的行程" 
              description="在日曆中顯示已拒絕參加的行程"
            >
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.showDeclinedEvents}
                  onChange={(e) => updateSetting('showDeclinedEvents', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </SettingItem>

            <SettingItem 
              label="緊湊視圖" 
              description="使用更緊湊的佈局顯示更多內容"
            >
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.compactView}
                  onChange={(e) => updateSetting('compactView', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </SettingItem>
          </SettingSection>
        </div>
      </main>
    </div>
  );
}