"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

// 타입 정의
interface BitcoinData {
  price: number;
  currency: string;
  difficulty: string;
  blockHeight: number;
  change24h: number;
  change1w: number;
}

interface MarketData {
  marketCap: number;
  supply: number;
  maxSupply: number;
  change1h: number;
  change1d: number;
  change1w: number;
}

interface BlockData {
  hash: string;
  height: string;
  size: string;
  transactions: string;
  reward: string;
  time: string;
  ago: string;
}

interface BlocksResponse {
  data: BlockData[];
  totalPages: number;
  currentPage: number;
}

interface BitcoinExplorerContextType {
  // 데이터 상태
  bitcoinData: BitcoinData | null;
  marketData: MarketData | null;
  blocksData: BlocksResponse | null;
  currentPage: number;
  loading: boolean;
  error: string | null;

  // 액션 함수들 (한국어 동사형)
  비트코인_정보를_조회_한다: () => Promise<void>;
  마켓_데이터를_조회_한다: () => Promise<void>;
  블록_목록을_조회_한다: (page: number) => Promise<void>;
  페이지를_변경_한다: (page: number) => void;

  // 상태 업데이트 함수들
  setBitcoinData: React.Dispatch<React.SetStateAction<BitcoinData | null>>;
  setMarketData: React.Dispatch<React.SetStateAction<MarketData | null>>;
  setBlocksData: React.Dispatch<React.SetStateAction<BlocksResponse | null>>;
}

const BitcoinExplorerContext = createContext<
  BitcoinExplorerContextType | undefined
>(undefined);

export interface BitcoinExplorerProviderProps {
  children: React.ReactNode;
}

export const BitcoinExplorerProvider: React.FC<
  BitcoinExplorerProviderProps
> = ({ children }) => {
  // 데이터 상태
  const [bitcoinData, setBitcoinData] = useState<BitcoinData | null>(null);
  const [marketData, setMarketData] = useState<MarketData | null>(null);
  const [blocksData, setBlocksData] = useState<BlocksResponse | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 액션 함수들 (API 호출)
  const 비트코인_정보를_조회_한다 = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/bitcoin/info");
      const result = await response.json();

      if (result.success) {
        setBitcoinData(result.data);
      } else {
        throw new Error(result.message || "비트코인 정보 조회에 실패했습니다.");
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "알 수 없는 오류가 발생했습니다."
      );
      console.error("비트코인 정보 조회 오류:", err);
    } finally {
      setLoading(false);
    }
  };

  const 마켓_데이터를_조회_한다 = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/bitcoin/market");
      const result = await response.json();

      if (result.success) {
        setMarketData(result.data);
      } else {
        throw new Error(result.message || "마켓 데이터 조회에 실패했습니다.");
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "알 수 없는 오류가 발생했습니다."
      );
      console.error("마켓 데이터 조회 오류:", err);
    } finally {
      setLoading(false);
    }
  };

  const 블록_목록을_조회_한다 = async (page: number) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/bitcoin/blocks?page=${page}`);
      const result = await response.json();

      if (result.success) {
        setBlocksData(result.data);
        setCurrentPage(page);
      } else {
        throw new Error(result.message || "블록 목록 조회에 실패했습니다.");
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "알 수 없는 오류가 발생했습니다."
      );
      console.error("블록 목록 조회 오류:", err);
    } finally {
      setLoading(false);
    }
  };

  const 페이지를_변경_한다 = (page: number) => {
    블록_목록을_조회_한다(page);
  };

  // 컴포넌트 마운트 시 초기 데이터 로드
  useEffect(() => {
    비트코인_정보를_조회_한다();
    마켓_데이터를_조회_한다();
    블록_목록을_조회_한다(1);
  }, []);

  // Context value
  const contextValue: BitcoinExplorerContextType = {
    // 데이터 상태
    bitcoinData,
    marketData,
    blocksData,
    currentPage,
    loading,
    error,

    // 액션 함수들
    비트코인_정보를_조회_한다,
    마켓_데이터를_조회_한다,
    블록_목록을_조회_한다,
    페이지를_변경_한다,

    // 상태 업데이트 함수들
    setBitcoinData,
    setMarketData,
    setBlocksData,
  };

  return (
    <BitcoinExplorerContext.Provider value={contextValue}>
      {children}
    </BitcoinExplorerContext.Provider>
  );
};

// 커스텀 훅들 (기존 use-bitcoin-explorer.ts의 내용을 통합)
export const useBitcoinExplorer = () => {
  const context = useContext(BitcoinExplorerContext);
  if (context === undefined) {
    throw new Error(
      "useBitcoinExplorer must be used within a BitcoinExplorerProvider"
    );
  }
  return context;
};

// 비트코인 익스플로러 데이터 커스텀 훅
export const useBitcoinData = () => {
  const { bitcoinData, 비트코인_정보를_조회_한다 } = useBitcoinExplorer();
  return { bitcoinData, 비트코인_정보를_조회_한다 };
};

// 마켓 데이터 커스텀 훅
export const useMarketData = () => {
  const { marketData, 마켓_데이터를_조회_한다 } = useBitcoinExplorer();
  return { marketData, 마켓_데이터를_조회_한다 };
};

// 블록 데이터 및 페이지네이션 커스텀 훅
export const useBlocksData = () => {
  const { blocksData, currentPage, 블록_목록을_조회_한다, 페이지를_변경_한다 } =
    useBitcoinExplorer();

  return {
    blocksData,
    currentPage,
    블록_목록을_조회_한다,
    페이지를_변경_한다,
  };
};

// 로딩 및 에러 상태 커스텀 훅
export const useLoadingState = () => {
  const { loading, error } = useBitcoinExplorer();
  return { loading, error };
};
