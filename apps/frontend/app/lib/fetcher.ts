// SWR을 위한 fetcher 함수
export const fetcher = (url: string) => fetch(url).then((res) => res.json());

// 비트코인 API 엔드포인트들 (예시 - 실제 사용시에는 실제 API로 교체)
export const API_ENDPOINTS = {
  bitcoinPrice: '/api/bitcoin/price',
  marketData: '/api/bitcoin/market',
  latestBlocks: '/api/bitcoin/blocks/latest',
  blockchainInfo: '/api/bitcoin/info',
};

// Mock 데이터 (개발용)
export const mockBitcoinData = {
  price: 108965.33,
  currency: 'USD',
  difficulty: '120.4k TH',
  blockHeight: 909522,
  change24h: 0.88,
  change1w: -1.29,
};

export const mockMarketData = {
  marketCap: 2467006416.36,
  supply: 19888888.00,
  maxSupply: 21000000.00,
  change1h: -0.01,
  change1d: 0.88,
  change1w: -1.29,
};

// 더 많은 mock 블록 데이터 생성 (페이지네이션용)
export const generateMockBlocks = (page: number, pageSize: number = 15) => {
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

export const mockBlocksData = generateMockBlocks(1);

// 페이지네이션된 블록 데이터를 가져오는 함수
export const fetchBlocksData = async (page: number): Promise<{ data: any[], totalPages: number, currentPage: number }> => {
  // 실제 API 호출을 시뮬레이션하기 위한 지연
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const pageSize = 15;
  const totalBlocks = 1000; // 가정: 총 1000개의 블록
  const totalPages = Math.ceil(totalBlocks / pageSize);
  
  return {
    data: generateMockBlocks(page, pageSize),
    totalPages,
    currentPage: page
  };
};
