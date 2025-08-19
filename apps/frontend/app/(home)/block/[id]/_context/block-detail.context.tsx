"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import useSWR from "swr";
import { BlockDetail } from "@/types";

interface BlockDetailContextType {
  // 데이터 상태
  blockDetail: BlockDetail | null;
  loading: boolean;
  error: string | null;

  // 액션 함수들
  블록_상세를_조회_한다: (blockId: string) => void;

  // 현재 블록 ID
  currentBlockId: string;
}

const BlockDetailContext = createContext<BlockDetailContextType | undefined>(
  undefined
);

export interface BlockDetailProviderProps {
  children: React.ReactNode;
  blockId: string;
}

const fetcher = async (url: string) => {
  const response = await fetch(url);
  const data = await response.json();

  if (!data.success) {
    throw new Error(data.error || "데이터를 가져오는데 실패했습니다.");
  }

  return data.data;
};

export default function BlockDetailProvider({
  children,
  blockId,
}: BlockDetailProviderProps) {
  const [currentBlockId, setCurrentBlockId] = useState(blockId);

  // SWR을 사용하여 블록 상세 데이터 조회
  const {
    data: blockDetail,
    error,
    isLoading: loading,
    mutate,
  } = useSWR(
    currentBlockId ? `/api/bitcoin/block/${currentBlockId}` : null,
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      dedupingInterval: 60000, // 1분간 중복 요청 방지
    }
  );

  // blockId prop이 변경되면 currentBlockId 업데이트
  useEffect(() => {
    if (blockId !== currentBlockId) {
      setCurrentBlockId(blockId);
    }
  }, [blockId, currentBlockId]);

  // 블록 상세 조회 함수
  const 블록_상세를_조회_한다 = (newBlockId: string) => {
    console.log("블록 상세 조회 요청:", newBlockId);
    setCurrentBlockId(newBlockId);
    mutate(); // SWR 캐시 갱신
  };

  const contextValue: BlockDetailContextType = {
    blockDetail: blockDetail || null,
    loading,
    error: error?.message || null,
    블록_상세를_조회_한다,
    currentBlockId,
  };

  return (
    <BlockDetailContext.Provider value={contextValue}>
      {children}
    </BlockDetailContext.Provider>
  );
}

// 커스텀 훅
export const useBlockDetail = () => {
  const context = useContext(BlockDetailContext);
  if (context === undefined) {
    throw new Error("useBlockDetail must be used within a BlockDetailProvider");
  }
  return context;
};
