import { NextResponse } from "next/server";

// 멤풀 데이터 타입 정의
interface MempoolSummary {
  transactionCount: number;
  totalSize: number;
  feeRange: {
    min: number;
    max: number;
  };
  estimatedWaitTime: {
    nextBlock: number;
    hour: number;
  };
}

interface FeeDistribution {
  feeRange: string;
  count: number;
  percentage: number;
  color: string;
}

interface SizeDistribution {
  sizeRange: string;
  count: number;
  percentage: number;
}

interface AgeDistribution {
  ageRange: string;
  count: number;
  percentage: number;
}

interface Transaction {
  hash: string;
  fee: number;
  feeRate: number;
  size: number;
  age: number;
  inputs: number;
  outputs: number;
}

interface TransactionLists {
  highFee: Transaction[];
  mediumFee: Transaction[];
  lowFee: Transaction[];
}

interface MempoolData {
  summary: MempoolSummary;
  feeDistribution: FeeDistribution[];
  sizeDistribution: SizeDistribution[];
  ageDistribution: AgeDistribution[];
  transactionLists: TransactionLists;
}

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

  // 크기 분포 데이터
  const sizeDistribution: SizeDistribution[] = [
    { sizeRange: "0-250", count: 1400, percentage: 33.7 },
    { sizeRange: "250-500", count: 850, percentage: 20.4 },
    { sizeRange: "500-750", count: 650, percentage: 15.6 },
    { sizeRange: "750-1000", count: 450, percentage: 10.8 },
    { sizeRange: "1000-1250", count: 300, percentage: 7.2 },
    { sizeRange: "1250-1500", count: 200, percentage: 4.8 },
    { sizeRange: "1500+", count: 308, percentage: 7.4 },
  ];

  // 연령 분포 데이터
  const ageDistribution: AgeDistribution[] = [
    { ageRange: "0-10", count: 1200, percentage: 28.9 },
    { ageRange: "10-20", count: 950, percentage: 22.9 },
    { ageRange: "20-30", count: 750, percentage: 18.0 },
    { ageRange: "30-40", count: 500, percentage: 12.0 },
    { ageRange: "40-50", count: 350, percentage: 8.4 },
    { ageRange: "50-60", count: 250, percentage: 6.0 },
    { ageRange: "60+", count: 153, percentage: 3.7 },
  ];

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

// 랜덤 해시 생성 함수
function generateRandomHash(): string {
  const chars = "0123456789abcdef";
  let hash = "";
  for (let i = 0; i < 64; i++) {
    hash += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return hash;
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
