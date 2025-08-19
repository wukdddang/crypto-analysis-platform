import { NextResponse } from "next/server";
import {
  MempoolSummary,
  FeeDistribution,
  SizeDistribution,
  AgeDistribution,
  Transaction,
  TransactionLists,
  MempoolData,
} from "@/types";
import { generateRandomHash } from "@/lib/utils";
// 모의 데이터 생성 함수
function generateMockMempoolData(): MempoolData {
  // 멤풀 요약 정보
  const summary: MempoolSummary = {
    transactionCount: 4158,
    totalSize: 12,
    feeRange: {
      min: 0.00249,
      max: 0.00001,
    },
    estimatedWaitTime: {
      nextBlock: 2.79,
      hour: 0.00001,
    },
  };

  // 수수료 분포 데이터
  const feeDistribution: FeeDistribution[] = [
    { feeRange: "1-2", count: 15, percentage: 2.3, color: "#ef4444" },
    { feeRange: "2-3", count: 29, percentage: 4.5, color: "#f97316" },
    { feeRange: "3-4", count: 0, percentage: 0, color: "#eab308" },
    { feeRange: "4-5", count: 0, percentage: 0, color: "#84cc16" },
    { feeRange: "5-6", count: 0, percentage: 0, color: "#22c55e" },
    { feeRange: "6-7", count: 0, percentage: 0, color: "#10b981" },
    { feeRange: "7-8", count: 0, percentage: 0, color: "#06b6d4" },
    { feeRange: "8-9", count: 0, percentage: 0, color: "#3b82f6" },
    { feeRange: "9-10", count: 0, percentage: 0, color: "#6366f1" },
    { feeRange: "10-11", count: 1, percentage: 0.2, color: "#8b5cf6" },
    { feeRange: "11-12", count: 11, percentage: 1.7, color: "#a855f7" },
    { feeRange: "12+", count: 4102, percentage: 91.3, color: "#ec4899" },
  ];

  // 크기 분포 데이터 (연속값 40개) - 랜덤 생성
  const sizeDistribution: SizeDistribution[] = [];
  for (let i = 0; i < 40; i++) {
    // 더 랜덤한 크기 값 (50B ~ 4000B 범위)
    const size = Math.round((Math.random() * 3950 + 50) * 10) / 10;
    // 더 랜덤한 트랜잭션 수 (10 ~ 1200개)
    const count = Math.floor(Math.random() * 1190 + 10);
    const percentage = Math.round((count / 25000) * 100 * 10) / 10;
    sizeDistribution.push({ size, count, percentage });
  }
  // 크기 순으로 정렬
  sizeDistribution.sort((a, b) => a.size - b.size);

  // 연령 분포 데이터 (연속값 40개) - 랜덤 생성
  const ageDistribution: AgeDistribution[] = [];
  for (let i = 0; i < 40; i++) {
    // 더 랜덤한 나이 값 (0.1분 ~ 150분 범위)
    const age = Math.round((Math.random() * 149.9 + 0.1) * 10) / 10;
    // 더 랜덤한 트랜잭션 수 (5 ~ 1500개)
    const count = Math.floor(Math.random() * 1495 + 5);
    const percentage = Math.round((count / 30000) * 100 * 10) / 10;
    ageDistribution.push({ age, count, percentage });
  }
  // 나이 순으로 정렬
  ageDistribution.sort((a, b) => a.age - b.age);

  // 트랜잭션 리스트 생성
  const generateTransactions = (
    count: number,
    feeRange: [number, number]
  ): Transaction[] => {
    const transactions: Transaction[] = [];
    for (let i = 0; i < count; i++) {
      const fee = Math.random() * (feeRange[1] - feeRange[0]) + feeRange[0];
      transactions.push({
        hash: generateRandomHash(),
        fee: Math.round(fee * 100000) / 100000,
        feeRate:
          Math.round((fee / (Math.random() * 500 + 250)) * 100000000) / 100,
        size: Math.floor(Math.random() * 1000 + 200),
        age: Math.floor(Math.random() * 120 + 1),
        inputs: Math.floor(Math.random() * 5 + 1),
        outputs: Math.floor(Math.random() * 5 + 1),
      });
    }
    return transactions.sort((a, b) => b.feeRate - a.feeRate);
  };

  const transactionLists: TransactionLists = {
    highFee: generateTransactions(50, [0.001, 0.01]),
    mediumFee: generateTransactions(50, [0.0005, 0.001]),
    lowFee: generateTransactions(50, [0.0001, 0.0005]),
  };

  return {
    summary,
    feeDistribution,
    sizeDistribution,
    ageDistribution,
    transactionLists,
  };
}

export async function GET(): Promise<NextResponse> {
  try {
    // 실제 환경에서는 비트코인 노드나 외부 API에서 데이터를 가져와야 합니다
    const mempoolData = generateMockMempoolData();

    return NextResponse.json({
      success: true,
      data: mempoolData,
      lastUpdated: new Date().toISOString(),
    });
  } catch (error) {
    console.error("멤풀 데이터 조회 오류:", error);
    return NextResponse.json(
      {
        error: "멤풀 데이터를 조회하는 중 오류가 발생했습니다.",
        success: false,
      },
      { status: 500 }
    );
  }
}
