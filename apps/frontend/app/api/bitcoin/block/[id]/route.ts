import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

// 블록 상세 데이터 생성 함수
const generateMockBlockDetail = (id: string) => {
  const isHeight = /^\d+$/.test(id);
  const height = isHeight ? parseInt(id) : 909522;
  const hash = isHeight
    ? `000000000000000${Math.random().toString(16).substr(2, 20)}${Math.random()
        .toString(16)
        .substr(2, 16)}${Math.random().toString(16).substr(2, 11)}`
    : id;

  // 트랜잭션 목록 생성
  const transactions = [];
  const txCount = Math.floor(Math.random() * 20) + 5;

  for (let i = 0; i < txCount; i++) {
    const txHash = `${Math.random().toString(16).substr(2, 16)}${Math.random()
      .toString(16)
      .substr(2, 16)}${Math.random().toString(16).substr(2, 16)}${Math.random()
      .toString(16)
      .substr(2, 16)}`;
    const amount = (Math.random() * 10).toFixed(8);
    transactions.push({
      hash: txHash,
      from:
        i === 0
          ? "N/A - Block Reward"
          : `1${Math.random().toString(16).substr(2, 26)}`,
      to: `1${Math.random().toString(16).substr(2, 26)}`,
      amount: `${amount} BTC`,
      fee:
        i === 0
          ? "0 BTC"
          : `0.${String(Math.floor(Math.random() * 1000)).padStart(
              3,
              "0"
            )} BTC`,
      time: `11. 08. 2024 - ${String(Math.floor(Math.random() * 24)).padStart(
        2,
        "0"
      )}:${String(Math.floor(Math.random() * 60)).padStart(2, "0")}:${String(
        Math.floor(Math.random() * 60)
      ).padStart(2, "0")}`,
    });
  }

  return {
    // 기본 블록 정보
    hash: hash,
    height: height.toString(),
    timestamp: `11. 08. 2024 - 06:43:05 UTC`,
    size: `${Math.floor(
      Math.random() * 1000000 + 500000
    ).toLocaleString()} bytes`,
    difficulty: "120.56 TH",
    nonce: Math.floor(Math.random() * 1000000000).toString(),

    // 트랜잭션 정보
    transactionCount: txCount.toString(),
    transactions: transactions,

    // 블록 헤더 정보
    version: "1",
    previousBlockHash: `000000000000000${Math.random()
      .toString(16)
      .substr(2, 20)}`.substr(0, 26),
    merkleRoot: `${Math.random().toString(16).substr(2, 16)}${Math.random()
      .toString(16)
      .substr(2, 16)}`,
    target:
      "000000000000000000000000000000000000000000000000000000000000000000",

    // 리워드 정보
    blockReward: "3.125 BTC",
    totalFees: `0.${String(Math.floor(Math.random() * 1000)).padStart(
      3,
      "0"
    )} BTC`,
    totalOutput: `${(3.125 + Math.random()).toFixed(8)} BTC`,

    // 네비게이션
    prevBlock: height > 1 ? (height - 1).toString() : null,
    nextBlock: height < 909522 ? (height + 1).toString() : null,
  };
};

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
): Promise<NextResponse> {
  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          error: "블록 ID 또는 높이가 필요합니다.",
        },
        { status: 400 }
      );
    }

    // 블록 상세 데이터 생성
    const blockDetail = generateMockBlockDetail(id);

    // 실제 API 호출을 시뮬레이션하기 위한 지연
    await new Promise((resolve) => setTimeout(resolve, 300));

    return NextResponse.json({
      success: true,
      data: blockDetail,
      message: "블록 상세 정보를 성공적으로 조회했습니다.",
    });
  } catch (error) {
    console.error("블록 상세 조회 중 오류 발생:", error);
    return NextResponse.json(
      {
        success: false,
        error: "블록 상세 정보를 조회하는 중 오류가 발생했습니다.",
      },
      { status: 500 }
    );
  }
}
