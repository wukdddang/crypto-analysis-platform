import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';

// 블록 데이터 생성 함수
const generateMockBlocks = (page: number, pageSize: number = 15) => {
  const blocks = [];
  const startHeight = 909522 - ((page - 1) * pageSize);
  
  for (let i = 0; i < pageSize; i++) {
    const height = startHeight - i;
    const randomHash = `000000000000000${Math.random().toString(16).substr(2, 20)}`;
    const randomSize = Math.floor(Math.random() * 1000000) + 500000;
    const randomTx = Math.floor(Math.random() * 5000) + 1000;
    const minutesAgo = (page - 1) * pageSize * 10 + i * 10 + Math.floor(Math.random() * 10);
    
    blocks.push({
      hash: randomHash.substr(0, 26),
      height: height.toString(),
      size: randomSize.toLocaleString(),
      transactions: randomTx.toString(),
      reward: '3.138 BTC',
      time: `11. 08. 2024 - ${String(16 - Math.floor(minutesAgo / 60)).padStart(2, '0')}:${String(60 - (minutesAgo % 60)).padStart(2, '0')}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}`,
      ago: `${minutesAgo} minutes ago`
    });
  }
  
  return blocks;
};

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    
    if (isNaN(page) || page < 1) {
      return NextResponse.json(
        { 
          success: false,
          error: '유효하지 않은 페이지 번호입니다.' 
        },
        { status: 400 }
      );
    }

    const pageSize = 15;
    const totalBlocks = 1000; // 가정: 총 1000개의 블록
    const totalPages = Math.ceil(totalBlocks / pageSize);

    // 블록 데이터 생성
    const blocks = generateMockBlocks(page, pageSize);

    // 실제 API 호출을 시뮬레이션하기 위한 지연
    await new Promise(resolve => setTimeout(resolve, 500));

    const responseData = {
      data: blocks,
      totalPages,
      currentPage: page,
      totalBlocks,
      pageSize
    };

    return NextResponse.json({
      success: true,
      data: responseData,
      message: '블록 목록을 성공적으로 조회했습니다.'
    });
  } catch (error) {
    console.error('블록 목록 조회 중 오류 발생:', error);
    return NextResponse.json(
      { 
        success: false,
        error: '블록 목록을 조회하는 중 오류가 발생했습니다.' 
      },
      { status: 500 }
    );
  }
}
