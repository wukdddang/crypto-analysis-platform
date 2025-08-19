// API 엔드포인트
export const API_ENDPOINTS = {
  bitcoin: {
    info: "/api/bitcoin/info",
    market: "/api/bitcoin/market",
    blocks: "/api/bitcoin/blocks",
    block: (id: string) => `/api/bitcoin/block/${id}`,
    transaction: (hash: string) => `/api/bitcoin/transaction/${hash}`,
    mempool: "/api/bitcoin/mempool",
  },
} as const;

// 페이지네이션 설정
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 15,
  MAX_PAGES: 1000,
} as const;

// 차트 설정
export const CHART = {
  DEFAULT_BAR_COUNT: 15,
  MIN_BAR_HEIGHT: 20,
  MAX_BAR_HEIGHT: 100,
  TOOLTIP_DELAY: 300,
  BAR_WIDTH: 8,
  CONTAINER_HEIGHT: 110,
  MIN_BAR_PERCENT: 10,
  MAX_BAR_PERCENT: 80,
  DEFAULT_BAR_PERCENT: 50,
} as const;

// 멤풀 설정
export const MEMPOOL = {
  FEE_RANGES: [
    "1-2",
    "2-3",
    "3-4",
    "4-5",
    "5-6",
    "6-7",
    "7-8",
    "8-9",
    "9-10",
    "10-11",
    "11-12",
    "12+",
  ],
  SIZE_RANGES: [
    "0-250",
    "250-500",
    "500-750",
    "750-1000",
    "1000-1250",
    "1250-1500",
    "1500+",
  ],
  AGE_RANGES: ["0-10", "10-20", "20-30", "30-40", "40-50", "50-60", "60+"],
} as const;

// 색상 팔레트
export const COLORS = {
  primary: {
    blue: "#3b82f6",
    orange: "#f97316",
    green: "#22c55e",
    red: "#ef4444",
  },
  status: {
    confirmed: "#22c55e",
    pending: "#f59e0b",
    failed: "#ef4444",
  },
  fee: {
    low: "#ef4444",
    medium: "#f97316",
    high: "#22c55e",
  },
} as const;

// 테마 설정
export const THEME = {
  STORAGE_KEY: "blockexplorer-theme",
  DEFAULT: "light",
  OPTIONS: ["light", "dark", "system"] as const,
} as const;

// 로컬 스토리지 키
export const STORAGE_KEYS = {
  THEME: "blockexplorer-theme",
  USER_PREFERENCES: "blockexplorer-preferences",
} as const;

// 에러 메시지
export const ERROR_MESSAGES = {
  FETCH_FAILED: "데이터를 가져오는데 실패했습니다.",
  NETWORK_ERROR: "네트워크 오류가 발생했습니다.",
  UNKNOWN_ERROR: "알 수 없는 오류가 발생했습니다.",
  INVALID_HASH: "유효하지 않은 해시입니다.",
  INVALID_BLOCK: "유효하지 않은 블록입니다.",
} as const;

// 성공 메시지
export const SUCCESS_MESSAGES = {
  COPIED: "클립보드에 복사되었습니다.",
  SAVED: "저장되었습니다.",
} as const;
