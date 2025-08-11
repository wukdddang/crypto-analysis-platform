import { NextResponse } from 'next/server';

export async function GET(): Promise<NextResponse> {
  try {
    // 비트코인 정보 Mock 데이터
    const bitcoinData = {
      price: 108965.33,
      currency: 'USD',
      difficulty: '120.4k TH',
      blockHeight: 909522,
      change24h: 0.88,
      change1w: -1.29,
    };

    // 실제 API 호출을 시뮬레이션하기 위한 지연
    await new Promise(resolve => setTimeout(resolve, 300));

    return NextResponse.json({
      success: true,
      data: bitcoinData,
      message: '비트코인 정보를 성공적으로 조회했습니다.'
    });
  } catch (error) {
    console.error('비트코인 정보 조회 중 오류 발생:', error);
    return NextResponse.json(
      { 
        success: false,
        error: '비트코인 정보를 조회하는 중 오류가 발생했습니다.' 
      },
      { status: 500 }
    );
  }
}
