
import { QuizResult } from "../types";

const STORAGE_KEY_URL = 'google_sheet_webapp_url';
const STORAGE_KEY_HISTORY = 'quiz_history';

// Link mặc định do người dùng cung cấp
const DEFAULT_SHEET_URL = 'https://script.google.com/macros/s/AKfycbxBF4Un5n20YMQB_kzZjGSerxs4X8Au-hOR0nLR-4uMOuK-Jo-IEYKEhA5BmaNIVZMcNw/exec';

export const saveSheetUrl = (url: string) => {
  if (url && url.trim() !== "") {
    localStorage.setItem(STORAGE_KEY_URL, url.trim());
  }
};

export const getSheetUrl = () => {
  // Ưu tiên link trong localStorage, nếu chưa có thì dùng link mặc định
  return localStorage.getItem(STORAGE_KEY_URL) || DEFAULT_SHEET_URL;
};

export const saveToGoogleSheets = async (result: QuizResult): Promise<boolean> => {
  const webAppUrl = getSheetUrl();
  
  // Lưu local để hiển thị tức thời nếu mạng chậm
  const localHistory = getHistory();
  const isDuplicate = localHistory.some(h => h.timestamp === result.timestamp && h.studentId === result.studentId);
  if (!isDuplicate) {
    localHistory.unshift(result);
    localStorage.setItem(STORAGE_KEY_HISTORY, JSON.stringify(localHistory.slice(0, 100)));
  }

  if (!webAppUrl) return false;

  try {
    // Gửi lên Google Sheet
    await fetch(webAppUrl, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'text/plain' },
      body: JSON.stringify(result)
    });
    return true;
  } catch (error) {
    console.error("Lỗi gửi dữ liệu lên Sheet:", error);
    return false;
  }
};

export const fetchHistoryFromSheet = async (): Promise<QuizResult[]> => {
  const webAppUrl = getSheetUrl();
  const localData = getHistory();
  
  if (!webAppUrl) {
    console.warn("Chưa cấu hình Web App URL cho Google Sheets");
    return localData;
  }

  try {
    const response = await fetch(webAppUrl);
    if (!response.ok) throw new Error("Không thể kết nối tới Google Sheet");
    
    const remoteData: QuizResult[] = await response.json();
    if (!Array.isArray(remoteData)) return localData;

    // Lọc trùng giữa Local và Remote (ưu tiên Remote từ Sheet)
    const combined = [...remoteData, ...localData];
    const unique = combined.filter((item, index, self) =>
      index === self.findIndex((t) => (
        t.timestamp === item.timestamp && t.studentId === item.studentId
      ))
    );

    return unique;
  } catch (error) {
    console.error("Lỗi đồng bộ từ Sheet:", error);
    return localData;
  }
};

export const getHistory = (): QuizResult[] => {
  const data = localStorage.getItem(STORAGE_KEY_HISTORY);
  return data ? JSON.parse(data) : [];
};
