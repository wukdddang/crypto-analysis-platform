// 공통 유틸리티 함수들
import { ApiResponse } from "@/types";

// 랜덤 해시 생성
export const generateRandomHash = (): string => {
  const chars = "0123456789abcdef";
  let hash = "";
  for (let i = 0; i < 64; i++) {
    hash += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return hash;
};

// 해시 자르기 (truncate)
export const truncateHash = (hash: string, length: number = 12): string => {
  if (
    hash === "N/A" ||
    hash === "N/A - Block Reward" ||
    hash.length <= length * 2
  ) {
    return hash;
  }
  return `${hash.slice(0, length)}...${hash.slice(-length)}`;
};

// 숫자 포맷팅
export const formatNumber = (num: number): string => {
  return num.toLocaleString();
};

// BTC 포맷팅
export const formatBTC = (btc: number | string): string => {
  const num = typeof btc === "string" ? parseFloat(btc) : btc;
  return `${num.toFixed(8)} BTC`;
};

// USD 포맷팅
export const formatUSD = (usd: number | string): string => {
  const num = typeof usd === "string" ? parseFloat(usd) : usd;
  return `$${num.toLocaleString()}`;
};

// 시간 포맷팅
export const formatTime = (timestamp: string | number): string => {
  const date = new Date(timestamp);
  return date.toLocaleString();
};

// 상대적 시간 (예: "2 minutes ago")
export const formatRelativeTime = (timestamp: string | number): string => {
  const now = new Date();
  const date = new Date(timestamp);
  const diffInMinutes = Math.floor(
    (now.getTime() - date.getTime()) / (1000 * 60)
  );

  if (diffInMinutes < 1) return "just now";
  if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`;

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours} hours ago`;

  const diffInDays = Math.floor(diffInHours / 24);
  return `${diffInDays} days ago`;
};

// 클립보드 복사
export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    console.error("Failed to copy: ", err);
    return false;
  }
};

// 색상 유틸리티
export const getStatusColor = (status: string): string => {
  switch (status.toLowerCase()) {
    case "confirmed":
      return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400";
    case "pending":
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400";
    case "failed":
      return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400";
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400";
  }
};

// API 에러 처리
export const handleApiError = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message;
  }
  return "알 수 없는 오류가 발생했습니다.";
};

// API 응답 타입 재export
export type { ApiResponse };
