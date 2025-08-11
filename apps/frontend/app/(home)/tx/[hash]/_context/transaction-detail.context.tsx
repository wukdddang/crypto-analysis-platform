"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import useSWR from "swr";

// 타입 정의
interface TransactionInput {
  index: number;
  previousTxHash: string;
  outputIndex: string;
  scriptSig: string;
  sequence: string;
  address: string;
  value: string;
}

interface TransactionOutput {
  index: number;
  value: string;
  scriptPubKey: string;
  address: string;
  type: string;
}

interface TransactionDetail {
  hash: string;
  status: string;
  blockHash: string;
  blockHeight: number;
  timestamp: string;
  size: string;
  version: number;
  lockTime: number;
  inputCount: number;
  outputCount: number;
  totalInput: string;
  totalOutput: string;
  fee: string;
  feeRate: string;
  inputs: TransactionInput[];
  outputs: TransactionOutput[];
  confirmations: number;
  weight: number;
  virtualSize: number;
}

interface TransactionDetailContextType {
  // 데이터 상태
  transactionDetail: TransactionDetail | null;
  loading: boolean;
  error: string | null;

  // 액션 함수들
  트랜잭션_상세를_조회_한다: (txHash: string) => void;

  // 현재 트랜잭션 해시
  currentTransactionHash: string;
}

const TransactionDetailContext = createContext<
  TransactionDetailContextType | undefined
>(undefined);

export interface TransactionDetailProviderProps {
  children: React.ReactNode;
  transactionHash: string;
}

const fetcher = async (url: string) => {
  const response = await fetch(url);
  const data = await response.json();

  if (!data.success) {
    throw new Error(data.error || "데이터를 가져오는데 실패했습니다.");
  }

  return data.data;
};

export default function TransactionDetailProvider({
  children,
  transactionHash,
}: TransactionDetailProviderProps) {
  const [currentTransactionHash, setCurrentTransactionHash] =
    useState(transactionHash);

  // SWR을 사용하여 트랜잭션 상세 데이터 조회
  const {
    data: transactionDetail,
    error,
    isLoading: loading,
    mutate,
  } = useSWR(
    currentTransactionHash
      ? `/api/bitcoin/transaction/${currentTransactionHash}`
      : null,
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      dedupingInterval: 60000, // 1분간 중복 요청 방지
    }
  );

  // transactionHash prop이 변경되면 currentTransactionHash 업데이트
  useEffect(() => {
    if (transactionHash !== currentTransactionHash) {
      setCurrentTransactionHash(transactionHash);
    }
  }, [transactionHash, currentTransactionHash]);

  // 트랜잭션 상세 조회 함수
  const 트랜잭션_상세를_조회_한다 = (newTxHash: string) => {
    console.log("트랜잭션 상세 조회 요청:", newTxHash);
    setCurrentTransactionHash(newTxHash);
    mutate(); // SWR 캐시 갱신
  };

  const contextValue: TransactionDetailContextType = {
    transactionDetail: transactionDetail || null,
    loading,
    error: error?.message || null,
    트랜잭션_상세를_조회_한다,
    currentTransactionHash,
  };

  return (
    <TransactionDetailContext.Provider value={contextValue}>
      {children}
    </TransactionDetailContext.Provider>
  );
}

// 커스텀 훅
export const useTransactionDetail = () => {
  const context = useContext(TransactionDetailContext);
  if (context === undefined) {
    throw new Error(
      "useTransactionDetail must be used within a TransactionDetailProvider"
    );
  }
  return context;
};
