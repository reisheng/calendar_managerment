# 📅 行事曆管理系統

一個現代化的日程管理應用，幫助用戶高效地創建、管理和追蹤個人及團隊行程安排。

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![React](https://img.shields.io/badge/React-18.3.1-blue.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.6.2-blue.svg)
![Vite](https://img.shields.io/badge/Vite-6.0.1-purple.svg)

## ✨ 功能特色

### 📅 核心功能
- **月曆視圖**：直觀的月曆界面，清晰顯示所有行程
- **行程管理**：創建、編輯、刪除個人行程
- **全天行程**：支援全天活動設定
- **提醒設置**：多種提醒選項（15分鐘前、1小時前、1天前）
- **今日概覽**：快速查看今日行程摘要

### 🔍 進階功能
- **智能搜尋**：按關鍵字快速搜尋行程
- **多重篩選**：按日期、狀態、類型篩選行程
- **行程列表**：詳細的行程列表視圖
- **個人設定**：自訂個人偏好和通知選項
- **響應式設計**：完美支援桌面和行動裝置

### 📖 使用手冊
- **完整文檔**：內建詳細的使用手冊
- **截圖功能**：一鍵截取當前頁面
- **PDF 導出**：將使用手冊導出為 PDF 文件

## 🛠️ 技術棧

### 前端框架
- **React 18.3.1** - 現代化的前端框架
- **TypeScript 5.6.2** - 類型安全的 JavaScript
- **Vite 6.0.1** - 快速的建構工具

### UI 與樣式
- **Tailwind CSS 3.4.14** - 實用優先的 CSS 框架
- **Heroicons** - 美觀的 SVG 圖標庫
- **Headless UI** - 無樣式的 UI 組件

### 狀態管理與工具
- **Zustand** - 輕量級狀態管理
- **React Hook Form** - 高效能表單處理
- **Zod** - TypeScript 優先的模式驗證
- **date-fns** - 現代化的日期工具庫

### 其他工具
- **React Router v7** - 聲明式路由
- **Sonner** - 優雅的通知組件
- **html2canvas** - 頁面截圖功能
- **html2pdf.js** - PDF 生成工具

## 🚀 快速開始

### 環境要求
- Node.js 18.0.0 或更高版本
- npm 或 pnpm 包管理器

### 安裝步驟

1. **克隆專案**
```bash
git clone <repository-url>
cd calendar-management-system
```

2. **安裝依賴**
```bash
npm install
# 或
pnpm install
```

3. **啟動開發服務器**
```bash
npm run dev
# 或
pnpm dev
```

4. **開啟瀏覽器**
訪問 [http://localhost:5173](http://localhost:5173) 查看應用

### 其他指令

```bash
# 建構生產版本
npm run build

# 預覽生產版本
npm run preview

# 代碼檢查
npm run lint

# 類型檢查
npm run check
```

## 📁 專案結構

```
src/
├── components/          # 可重用組件
│   ├── Calendar.tsx     # 月曆組件
│   ├── EventForm.tsx    # 行程表單
│   ├── EventModal.tsx   # 行程詳情彈窗
│   ├── Layout.tsx       # 頁面佈局
│   ├── Navigation.tsx   # 導航組件
│   └── ...
├── pages/              # 頁面組件
│   ├── Home.tsx        # 首頁
│   ├── EventList.tsx   # 行程列表
│   ├── Settings.tsx    # 設定頁面
│   └── UserManual.tsx  # 使用手冊
├── lib/                # 核心邏輯
│   ├── store.ts        # Zustand 狀態管理
│   ├── types.ts        # TypeScript 類型定義
│   └── utils.ts        # 工具函數
├── hooks/              # 自定義 Hooks
└── assets/             # 靜態資源
```

## 📱 使用說明

### 創建新行程
1. 點擊右下角的「+」浮動按鈕
2. 填寫行程標題（必填）
3. 設定開始和結束時間
4. 選擇是否為全天行程
5. 填寫地點和描述（選填）
6. 設定提醒時間
7. 點擊「保存」按鈕完成創建

### 編輯行程
1. 在月曆或行程列表中點擊要編輯的行程
2. 在行程詳情頁面點擊「編輯」按鈕
3. 修改行程資訊
4. 點擊「保存」按鈕確認修改

### 查看行程
- **月曆視圖**：在首頁查看當月所有行程
- **今日概覽**：查看今日行程摘要
- **行程列表**：查看所有行程的詳細列表
- **搜尋功能**：使用關鍵字搜尋特定行程

## 🖼️ 功能截圖

### 主要界面
- 📅 **月曆視圖**：清晰的月曆界面，顯示所有行程
- 📋 **今日概覽**：快速查看今日重要行程
- ➕ **行程創建**：簡潔的行程創建表單
- 📝 **行程列表**：完整的行程管理界面

### 特色功能
- 🔍 **智能搜尋**：快速找到所需行程
- ⚙️ **個人設定**：自訂個人偏好
- 📖 **使用手冊**：完整的操作指南
- 📄 **PDF 導出**：將手冊導出為 PDF

## 🌐 部署指南

### Vercel 部署（推薦）

1. **連接 GitHub**
   - 將代碼推送到 GitHub 倉庫
   - 在 Vercel 中導入專案

2. **自動部署**
   - Vercel 會自動檢測 Vite 專案
   - 每次推送都會自動重新部署

3. **自訂域名**
   - 在 Vercel 控制台設定自訂域名
   - 支援 HTTPS 和 CDN 加速

### 其他部署選項

- **Netlify**：拖拽 `dist` 資料夾即可部署
- **GitHub Pages**：適合靜態網站部署
- **自建服務器**：使用 nginx 或 apache 託管

## 🤝 貢獻指南

我們歡迎所有形式的貢獻！

### 如何貢獻

1. **Fork 專案**
2. **創建功能分支** (`git checkout -b feature/AmazingFeature`)
3. **提交更改** (`git commit -m 'Add some AmazingFeature'`)
4. **推送到分支** (`git push origin feature/AmazingFeature`)
5. **開啟 Pull Request**

### 開發規範

- 遵循 ESLint 和 TypeScript 規範
- 編寫清晰的提交訊息
- 為新功能添加適當的測試
- 更新相關文檔

### 問題回報

如果您發現 bug 或有功能建議，請：
1. 檢查是否已有相關 issue
2. 創建新的 issue 並詳細描述問題
3. 提供重現步驟和環境資訊

## 📄 許可證

本專案採用 MIT 許可證 - 查看 [LICENSE](LICENSE) 文件了解詳情。

## 🙏 致謝

感謝以下開源專案的支持：

- [React](https://reactjs.org/) - 用戶界面庫
- [TypeScript](https://www.typescriptlang.org/) - JavaScript 的超集
- [Vite](https://vitejs.dev/) - 下一代前端工具
- [Tailwind CSS](https://tailwindcss.com/) - CSS 框架
- [Zustand](https://github.com/pmndrs/zustand) - 狀態管理
- [date-fns](https://date-fns.org/) - 日期工具庫

## 📞 聯絡資訊

- **專案維護者**：[您的姓名]
- **Email**：[your.email@example.com]
- **GitHub**：[https://github.com/yourusername]

---

⭐ 如果這個專案對您有幫助，請給我們一個星星！

📅 **立即開始管理您的行程安排！**
