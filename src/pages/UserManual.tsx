import React, { useState } from 'react';
import { BookOpenIcon, CameraIcon, DocumentArrowDownIcon } from '@heroicons/react/24/outline';
import html2canvas from 'html2canvas';
import html2pdf from 'html2pdf.js';
import { toast } from 'sonner';

const UserManual: React.FC = () => {
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [isCapturingScreenshot, setIsCapturingScreenshot] = useState(false);

  const captureScreenshot = async () => {
    setIsCapturingScreenshot(true);
    try {
      const element = document.body;
      const canvas = await html2canvas(element, {
        height: window.innerHeight,
        width: window.innerWidth,
        useCORS: true,
        scale: 1
      });
      
      const link = document.createElement('a');
      link.download = `calendar-screenshot-${new Date().toISOString().split('T')[0]}.png`;
      link.href = canvas.toDataURL();
      link.click();
      
      toast.success('截圖已保存到下載資料夾');
    } catch (error) {
      console.error('截圖失敗:', error);
      toast.error('截圖失敗，請重試');
    } finally {
      setIsCapturingScreenshot(false);
    }
  };

  const generatePDF = async () => {
    setIsGeneratingPDF(true);
    try {
      // 創建一個包含手冊內容的元素
      const manualContent = document.querySelector('.manual-content');
      if (!manualContent) {
        throw new Error('找不到手冊內容');
      }

      // 配置 html2pdf 選項
      const options = {
        margin: [10, 10, 10, 10],
        filename: `行事曆管理系統使用手冊-${new Date().toISOString().split('T')[0]}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { 
          scale: 2,
          useCORS: true,
          letterRendering: true
        },
        jsPDF: { 
          unit: 'mm', 
          format: 'a4', 
          orientation: 'portrait'
        }
      };

      // 生成 PDF
      await html2pdf().set(options).from(manualContent).save();
      
      toast.success('PDF使用手冊已生成並下載');
     } catch (error) {
       console.error('PDF生成失敗:', error);
       toast.error('PDF生成失敗，請重試');
     } finally {
       setIsGeneratingPDF(false);
     }
   };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 標題區域 */}
        <div className="text-center mb-8">
          <div className="flex justify-center items-center mb-4">
            <BookOpenIcon className="h-12 w-12 text-blue-600 mr-3" />
            <h1 className="text-4xl font-bold text-gray-900">使用手冊</h1>
          </div>
          <p className="text-xl text-gray-600">
            行事曆管理系統完整操作指南
          </p>
        </div>

        {/* 操作按鈕 */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8 justify-center">
          <button
            onClick={captureScreenshot}
            disabled={isCapturingScreenshot}
            className="flex items-center justify-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <CameraIcon className="h-5 w-5 mr-2" />
            {isCapturingScreenshot ? '截圖中...' : '截取螢幕畫面'}
          </button>
          
          <button
            onClick={generatePDF}
            disabled={isGeneratingPDF}
            className="flex items-center justify-center px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <DocumentArrowDownIcon className="h-5 w-5 mr-2" />
            {isGeneratingPDF ? '生成中...' : '下載PDF手冊'}
          </button>
        </div>

        {/* 使用手冊內容 */}
        <div className="manual-content bg-white rounded-lg shadow-lg p-8">
          {/* 系統介紹 */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 border-b-2 border-blue-600 pb-2">
              1. 系統介紹
            </h2>
            <div className="prose prose-lg text-gray-700">
              <p>
                行事曆管理系統是一個現代化的日程管理應用，幫助用戶高效地創建、管理和追蹤個人及團隊行程安排。
                系統提供直觀的界面讓用戶輕鬆安排會議、提醒事項和重要活動。
              </p>
              <p>
                本系統採用響應式設計，支援桌面和行動裝置使用，讓您隨時隨地管理您的行程。
              </p>
            </div>
          </section>

          {/* 主要功能 */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 border-b-2 border-blue-600 pb-2">
              2. 主要功能
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-blue-900 mb-2">📅 月曆視圖</h3>
                <p className="text-blue-800">顯示當月行程，支援月/週/日視圖切換，點擊日期可查看詳情</p>
              </div>
              
              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-green-900 mb-2">📝 行程管理</h3>
                <p className="text-green-800">創建、編輯、刪除個人行程，支援全天行程設定</p>
              </div>
              
              <div className="bg-yellow-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-yellow-900 mb-2">🔔 提醒設置</h3>
                <p className="text-yellow-800">設定行程提醒時間：15分鐘前、1小時前、1天前等選項</p>
              </div>
              
              <div className="bg-purple-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-purple-900 mb-2">🔍 搜尋篩選</h3>
                <p className="text-purple-800">按關鍵字搜尋行程，按日期、狀態篩選行程</p>
              </div>
              
              <div className="bg-indigo-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-indigo-900 mb-2">📋 今日概覽</h3>
                <p className="text-indigo-800">顯示今日行程摘要，包含時間、標題、重要程度標示</p>
              </div>
              
              <div className="bg-pink-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-pink-900 mb-2">⚙️ 個人設定</h3>
                <p className="text-pink-800">自訂個人偏好、通知設定、顯示選項</p>
              </div>
            </div>
          </section>

          {/* 操作說明 */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 border-b-2 border-blue-600 pb-2">
              3. 操作說明
            </h2>
            
            {/* 創建新行程 */}
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-3">3.1 創建新行程</h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <ol className="list-decimal list-inside space-y-2 text-gray-700">
                  <li>點擊右下角的「+」浮動按鈕</li>
                  <li>填寫行程標題（必填）</li>
                  <li>設定開始和結束時間</li>
                  <li>選擇是否為全天行程</li>
                  <li>填寫地點和描述（選填）</li>
                  <li>設定提醒時間</li>
                  <li>點擊「保存」按鈕完成創建</li>
                </ol>
              </div>
            </div>
            
            {/* 編輯行程 */}
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-3">3.2 編輯行程</h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <ol className="list-decimal list-inside space-y-2 text-gray-700">
                  <li>在月曆或行程列表中點擊要編輯的行程</li>
                  <li>在行程詳情頁面點擊「編輯」按鈕</li>
                  <li>修改行程資訊</li>
                  <li>點擊「保存」按鈕確認修改</li>
                  <li>或點擊「刪除」按鈕刪除行程</li>
                </ol>
              </div>
            </div>
            
            {/* 查看行程 */}
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-3">3.3 查看行程</h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li><strong>首頁月曆視圖：</strong>查看當月所有行程</li>
                  <li><strong>今日概覽：</strong>查看今日行程摘要</li>
                  <li><strong>行程列表：</strong>查看所有行程的詳細列表</li>
                  <li><strong>搜尋功能：</strong>使用關鍵字搜尋特定行程</li>
                  <li><strong>篩選功能：</strong>按日期範圍或狀態篩選行程</li>
                </ul>
              </div>
            </div>
          </section>

          {/* 常見問題 */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 border-b-2 border-blue-600 pb-2">
              4. 常見問題
            </h2>
            
            <div className="space-y-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold text-blue-900 mb-2">Q: 如何設定重複行程？</h4>
                <p className="text-blue-800">A: 目前版本暫不支援重複行程功能，請手動創建多個行程。</p>
              </div>
              
              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-semibold text-green-900 mb-2">Q: 提醒通知不工作怎麼辦？</h4>
                <p className="text-green-800">A: 請檢查瀏覽器通知權限設定，確保允許網站發送通知。</p>
              </div>
              
              <div className="bg-yellow-50 p-4 rounded-lg">
                <h4 className="font-semibold text-yellow-900 mb-2">Q: 如何匯出行程資料？</h4>
                <p className="text-yellow-800">A: 目前可透過此使用手冊的截圖功能保存行程畫面。</p>
              </div>
              
              <div className="bg-purple-50 p-4 rounded-lg">
                <h4 className="font-semibold text-purple-900 mb-2">Q: 支援哪些瀏覽器？</h4>
                <p className="text-purple-800">A: 支援 Chrome、Firefox、Safari、Edge 等現代瀏覽器。</p>
              </div>
              
              <div className="bg-indigo-50 p-4 rounded-lg">
                <h4 className="font-semibold text-indigo-900 mb-2">Q: 資料會保存在哪裡？</h4>
                <p className="text-indigo-800">A: 目前資料保存在瀏覽器本地存儲中，清除瀏覽器資料會導致行程遺失。</p>
              </div>
            </div>
          </section>

          {/* 技術支援 */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 border-b-2 border-blue-600 pb-2">
              5. 技術支援
            </h2>
            <div className="bg-gray-50 p-6 rounded-lg">
              <p className="text-gray-700 mb-4">
                如果您在使用過程中遇到問題，請嘗試以下解決方案：
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li>重新整理頁面</li>
                <li>清除瀏覽器快取</li>
                <li>檢查網路連線</li>
                <li>更新瀏覽器到最新版本</li>
                <li>確認瀏覽器支援 JavaScript</li>
              </ul>
              <p className="text-gray-600 mt-4 text-sm">
                系統版本：v1.0.0 | 最後更新：{new Date().toLocaleDateString('zh-TW')}
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default UserManual;