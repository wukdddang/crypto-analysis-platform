import { NextResponse } from 'next/server';

export async function GET(): Promise<NextResponse> {
  try {
    // 마켓 데이터 Mock 데이터
    const marketData = {
      marketCap: 2467006416.36,
      supply: 19888888.00,
      maxSupply: 21000000.00,
      change1h: -0.01,
      change1d: 0.88,
      change1w: -1.29,
    };

    // 실제 API 호출을 시뮬레이션하기 위한 지연
    await new Promise(resolve => setTimeout(resolve, 200));

    return NextResponse.json({
      success: true,
      data: marketData,
      message: '마켓 데이터를 성공적으로 조회했습니다.'
    });
  } catch (error) {
    console.error('마켓 데이터 조회 중 오류 발생:', error);
    return NextResponse.json(
      { 
        success: false,
        error: '마켓 데이터를 조회하는 중 오류가 발생했습니다.' 
      },
      { status: 500 }
    );
  }
}
