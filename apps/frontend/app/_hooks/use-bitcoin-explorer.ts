import { useBitcoinExplorer } from '../_context/bitcoin-explorer.context';

// 비트코인 익스플로러 데이터 커스텀 훅
export const useBitcoinData = () => {
  const { bitcoinData, 비트코인_정보를_조회_한다 } = useBitcoinExplorer();
  return { bitcoinData, 비트코인_정보를_조회_한다 };
};

// 마켓 데이터 커스텀 훅
export const useMarketData = () => {
  const { marketData, 마켓_데이터를_조회_한다 } = useBitcoinExplorer();
  return { marketData, 마켓_데이터를_조회_한다 };
};

// 블록 데이터 및 페이지네이션 커스텀 훅
export const useBlocksData = () => {
  const { 
    blocksData, 
    currentPage, 
    블록_목록을_조회_한다, 
    페이지를_변경_한다 
  } = useBitcoinExplorer();
  
  return { 
    blocksData, 
    currentPage, 
    블록_목록을_조회_한다, 
    페이지를_변경_한다 
  };
};

// 로딩 및 에러 상태 커스텀 훅
export const useLoadingState = () => {
  const { loading, error } = useBitcoinExplorer();
  return { loading, error };
};

// 통합 비트코인 익스플로러 훅 (메인 훅)
export { useBitcoinExplorer } from '../_context/bitcoin-explorer.context';
