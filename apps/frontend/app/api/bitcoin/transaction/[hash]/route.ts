import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

// 트랜잭션 상세 데이터 생성 함수
const generateMockTransactionDetail = (hash: string) => {
  const inputCount = Math.floor(Math.random() * 5) + 1;
  const outputCount = Math.floor(Math.random() * 5) + 1;

  // Input 생성
  const inputs = [];
  for (let i = 0; i < inputCount; i++) {
    if (i === 0 && Math.random() > 0.8) {
      // Coinbase transaction (block reward)
      inputs.push({
        index: 0,
        previousTxHash: "N/A - Block Reward",
        outputIndex: "N/A",
        scriptSig: "N/A",
        sequence: "N/A",
        address: "N/A",
        value: "N/A",
      });
    } else {
      inputs.push({
        index: i,
        previousTxHash: Array.from({ length: 64 }, () =>
          Math.floor(Math.random() * 16).toString(16)
        ).join(""),
        outputIndex: Math.floor(Math.random() * 10).toString(),
        scriptSig: `${Math.random().toString(16).substr(2, 20)}...`,
        sequence: "4294967295",
        address: `1${Math.random().toString(16).substr(2, 26)}`,
        value: `${(Math.random() * 5).toFixed(8)} BTC`,
      });
    }
  }

  // Output 생성
  const outputs = [];
  let totalOutput = 0;
  for (let i = 0; i < outputCount; i++) {
    const value = Math.random() * 3;
    totalOutput += value;

    outputs.push({
      index: i,
      value: `${value.toFixed(8)} BTC`,
      scriptPubKey: `OP_DUP OP_HASH160 ${Math.random()
        .toString(16)
        .substr(2, 20)} OP_EQUALVERIFY OP_CHECKSIG`,
      address:
        i === outputCount - 1 && Math.random() > 0.7
          ? "N/A"
          : `1${Math.random().toString(16).substr(2, 26)}`,
      type:
        i === outputCount - 1 && Math.random() > 0.7 ? "OP_RETURN" : "P2PKH",
    });
  }

  const totalInput = inputs.reduce((sum, input) => {
    return input.value === "N/A"
      ? sum
      : sum + parseFloat(input.value.replace(" BTC", ""));
  }, 0);

  const fee = Math.max(0, totalInput - totalOutput);

  return {
    // 기본 트랜잭션 정보
    hash: hash,
    status: "Confirmed",
    blockHash: `000000000000000${Math.random()
      .toString(16)
      .substr(2, 20)}`.substr(0, 26),
    blockHeight: Math.floor(Math.random() * 1000) + 909000,
    timestamp: `11. 08. 2024 - 06:43:05 UTC`,
    size: `${Math.floor(Math.random() * 500) + 200} bytes`,

    // 거래 세부 정보
    version: 1,
    lockTime: 0,
    inputCount: inputCount,
    outputCount: outputCount,

    // 금액 정보
    totalInput: totalInput > 0 ? `${totalInput.toFixed(8)} BTC` : "N/A",
    totalOutput: `${totalOutput.toFixed(8)} BTC`,
    fee: fee > 0 ? `${fee.toFixed(8)} BTC` : "0 BTC",
    feeRate:
      fee > 0
        ? `${(
            (fee * 100000000) /
            (Math.floor(Math.random() * 500) + 200)
          ).toFixed(2)} sat/byte`
        : "0 sat/byte",

    // Input/Output 데이터
    inputs: inputs,
    outputs: outputs,

    // 추가 정보
    confirmations: Math.floor(Math.random() * 100) + 1,
    weight: Math.floor(Math.random() * 1000) + 500,
    virtualSize: Math.floor(Math.random() * 300) + 150,
  };
};

export async function GET(
  request: NextRequest,
  { params }: { params: { hash: string } }
): Promise<NextResponse> {
  try {
    const { hash } = params;

    if (!hash) {
      return NextResponse.json(
        {
          success: false,
          error: "트랜잭션 해시가 필요합니다.",
        },
        { status: 400 }
      );
    }

    if (hash.length !== 64) {
      return NextResponse.json(
        {
          success: false,
          error: "올바르지 않은 트랜잭션 해시 형식입니다.",
        },
        { status: 400 }
      );
    }

    // 트랜잭션 상세 데이터 생성
    const transactionDetail = generateMockTransactionDetail(hash);

    // 실제 API 호출을 시뮬레이션하기 위한 지연
    await new Promise((resolve) => setTimeout(resolve, 300));

    return NextResponse.json({
      success: true,
      data: transactionDetail,
      message: "트랜잭션 상세 정보를 성공적으로 조회했습니다.",
    });
  } catch (error) {
    console.error("트랜잭션 상세 조회 중 오류 발생:", error);
    return NextResponse.json(
      {
        success: false,
        error: "트랜잭션 상세 정보를 조회하는 중 오류가 발생했습니다.",
      },
      { status: 500 }
    );
  }
}
