// 공통 타입 정의
export interface BlockData {
  hash: string;
  height: string;
  size: string;
  transactions: string;
  reward: string;
  time: string;
  ago: string;
}

export interface BitcoinData {
  price: number;
  currency: string;
  difficulty: string;
  blockHeight: number;
  change24h: number;
  change1w: number;
}

export interface MarketData {
  marketCap: number;
  supply: number;
  maxSupply: number;
  change1h: number;
  change1d: number;
  change1w: number;
}

export interface TransactionInput {
  index: number;
  previousTxHash: string;
  outputIndex: string;
  scriptSig: string;
  sequence: string;
  address: string;
  value: string;
  valueUSD?: string;
}

export interface TransactionOutput {
  index: number;
  value: string;
  scriptPubKey: string;
  address: string;
  type: string;
  valueUSD?: string;
}

export interface TransactionDetail {
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
  totalInputUSD?: string;
  totalOutputUSD?: string;
  feeUSD?: string;
}

export interface MempoolSummary {
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

export interface FeeDistribution {
  feeRange: string;
  count: number;
  percentage: number;
  color: string;
}

export interface SizeDistribution {
  sizeRange: string;
  count: number;
  percentage: number;
}

export interface AgeDistribution {
  ageRange: string;
  count: number;
  percentage: number;
}

export interface Transaction {
  hash: string;
  fee: number;
  feeRate: number;
  size: number;
  age: number;
  inputs: number;
  outputs: number;
}

export interface TransactionLists {
  highFee: Transaction[];
  mediumFee: Transaction[];
  lowFee: Transaction[];
}

export interface MempoolData {
  summary: MempoolSummary;
  feeDistribution: FeeDistribution[];
  sizeDistribution: SizeDistribution[];
  ageDistribution: AgeDistribution[];
  transactionLists: TransactionLists;
}

export interface BlockTransaction {
  hash: string;
  from: string;
  to: string;
  amount: string;
  fee: string;
  time: string;
}

export interface BlockDetail {
  hash: string;
  height: string;
  timestamp: string;
  size: string;
  difficulty: string;
  nonce: string;
  transactionCount: string;
  transactions: BlockTransaction[];
  version: string;
  previousBlockHash: string;
  merkleRoot: string;
  target: string;
  blockReward: string;
  totalFees: string;
  totalOutput: string;
  prevBlock: string | null;
  nextBlock: string | null;
}

export interface BlocksResponse {
  data: BlockData[];
  totalPages: number;
  currentPage: number;
}

// 차트 데이터 타입
export interface ChartData {
  height: number;
  blockNumber: string;
  transactions: number;
}

// API 응답 타입
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}
