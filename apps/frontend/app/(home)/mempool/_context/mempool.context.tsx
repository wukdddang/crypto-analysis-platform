"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import {
  MempoolSummary,
  FeeDistribution,
  SizeDistribution,
  AgeDistribution,
  TransactionLists,
} from "@/types";

interface MempoolContextType {
  // 데이터 상태
  summary: MempoolSummary | null;
  feeDistribution: FeeDistribution[];
  sizeDistribution: SizeDistribution[];
  ageDistribution: AgeDistribution[];
  transactionLists: TransactionLists | null;
  loading: boolean;
  error: string | null;

  // 액션 함수들
  멤풀_데이터를_조회_한다: () => Promise<void>;

  // 상태 업데이트 함수들
  setSummary: React.Dispatch<React.SetStateAction<MempoolSummary | null>>;
  setFeeDistribution: React.Dispatch<React.SetStateAction<FeeDistribution[]>>;
  setSizeDistribution: React.Dispatch<React.SetStateAction<SizeDistribution[]>>;
  setAgeDistribution: React.Dispatch<React.SetStateAction<AgeDistribution[]>>;
  setTransactionLists: React.Dispatch<
    React.SetStateAction<TransactionLists | null>
  >;
}

const MempoolContext = createContext<MempoolContextType | undefined>(undefined);

export const MempoolProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  // 데이터 상태
  const [summary, setSummary] = useState<MempoolSummary | null>(null);
  const [feeDistribution, setFeeDistribution] = useState<FeeDistribution[]>([]);
  const [sizeDistribution, setSizeDistribution] = useState<SizeDistribution[]>(
    []
  );
  const [ageDistribution, setAgeDistribution] = useState<AgeDistribution[]>([]);
  const [transactionLists, setTransactionLists] =
    useState<TransactionLists | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 멤풀 데이터 조회 함수
  const 멤풀_데이터를_조회_한다 = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/bitcoin/mempool");
      const result = await response.json();

      if (result.success) {
        setSummary(result.data.summary);
        setFeeDistribution(result.data.feeDistribution);
        setSizeDistribution(result.data.sizeDistribution);
        setAgeDistribution(result.data.ageDistribution);
        setTransactionLists(result.data.transactionLists);
      } else {
        throw new Error(result.message || "멤풀 데이터 조회에 실패했습니다.");
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "알 수 없는 오류가 발생했습니다."
      );
      console.error("멤풀 데이터 조회 오류:", err);
    } finally {
      setLoading(false);
    }
  };

  // 컴포넌트 마운트 시 데이터 로드
  useEffect(() => {
    멤풀_데이터를_조회_한다();
  }, []);

  const contextValue: MempoolContextType = {
    // 데이터 상태
    summary,
    feeDistribution,
    sizeDistribution,
    ageDistribution,
    transactionLists,
    loading,
    error,

    // 액션 함수들
    멤풀_데이터를_조회_한다,

    // 상태 업데이트 함수들
    setSummary,
    setFeeDistribution,
    setSizeDistribution,
    setAgeDistribution,
    setTransactionLists,
  };

  return (
    <MempoolContext.Provider value={contextValue}>
      {children}
    </MempoolContext.Provider>
  );
};

export const useMempool = () => {
  const context = useContext(MempoolContext);
  if (context === undefined) {
    throw new Error("useMempool must be used within a MempoolProvider");
  }
  return context;
};
