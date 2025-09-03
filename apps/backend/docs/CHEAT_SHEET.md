# 나만의 비트코인 익스플로러 만들기: NestJS 백엔드 설계 가이드 🚀

## 기술 스택 개요

- **Backend**: NestJS + TypeScript
- **Database**: PostgreSQL (블록체인 데이터) + Redis (캐싱)
- **Search**: Elasticsearch (트랜잭션/주소 검색)
- **Queue**: Bull Queue (ETL 처리)
- **Development**: Windows 환경에서 미니PC 서비스 연결
- **풀노드**: Ubuntu Server에서 Bitcoin Core 운영

## 0단계: 프로젝트 설정 및 환경 구축

### [ ] 개발 환경 설정

#### NestJS 프로젝트 생성 및 기본 설정

```bash
# NestJS CLI 전역 설치
npm i -g @nestjs/cli

# 새 프로젝트 생성
nest new bitcoin-explorer-backend
cd bitcoin-explorer-backend
```

**💡 NestJS를 선택한 이유:**

- **TypeScript 네이티브 지원**: 타입 안전성으로 블록체인 데이터 구조 관리
- **모듈 시스템**: 복잡한 비트코인 익스플로러 기능을 체계적으로 관리
- **데코레이터 기반**: API 문서화, 유효성 검사, 캐싱이 직관적
- **마이크로서비스 지원**: 향후 확장성 고려

#### 핵심 라이브러리 설치 및 설정

```bash
# 🗄️ 데이터베이스 관련 (PostgreSQL + TypeORM)
npm install @nestjs/typeorm typeorm pg
npm install --save-dev @types/pg

# 📦 캐싱 및 세션 (Redis)
npm install @nestjs/cache-manager cache-manager
npm install cache-manager-redis-store redis
npm install --save-dev @types/redis

# 🔍 검색 엔진 (Elasticsearch)
npm install @nestjs/elasticsearch @elastic/elasticsearch

# 📋 작업 큐 (Bull Queue)
npm install @nestjs/bull bull
npm install --save-dev @types/bull

# ⚙️ 환경 변수 관리
npm install @nestjs/config

# 🔒 보안 및 유효성 검사
npm install @nestjs/throttler
npm install class-validator class-transformer

# 🌐 WebSocket (실시간 통신)
npm install @nestjs/websockets @nestjs/platform-socket.io

# 🔗 비트코인 노드 통신
npm install zeromq axios
npm install --save-dev @types/zeromq

# 📊 모니터링 및 헬스체크
npm install @nestjs/terminus

# 🧪 테스팅
npm install --save-dev jest @nestjs/testing
```

#### 라이브러리 선택 이유 상세 설명

| 라이브러리        | 사용 목적        | 선택 이유                                                                                        |
| ----------------- | ---------------- | ------------------------------------------------------------------------------------------------ |
| **TypeORM**       | PostgreSQL ORM   | • 복잡한 블록체인 데이터 관계 모델링<br>• 마이그레이션 자동화<br>• 타입스크립트 완벽 호환        |
| **Redis**         | 캐싱 및 세션     | • 자주 조회되는 주소/거래 정보 캐싱<br>• Bull Queue의 백엔드로 활용<br>• 실시간 데이터 임시 저장 |
| **Elasticsearch** | 검색 엔진        | • 트랜잭션 해시 부분 검색<br>• 주소 검색 자동완성<br>• 대용량 블록체인 데이터 빠른 검색          |
| **Bull Queue**    | 백그라운드 작업  | • 블록 동기화 작업 스케줄링<br>• ETL 파이프라인 구축<br>• 메모리 효율적인 대용량 처리            |
| **ZeroMQ**        | 실시간 블록 알림 | • Bitcoin Core의 ZMQ 발행자와 연결<br>• 새 블록/거래 실시간 수신<br>• 폴링 방식보다 효율적       |
| **Socket.IO**     | WebSocket        | • 프론트엔드에 실시간 업데이트 전송<br>• 새 블록 알림, 거래 상태 변화<br>• 크로스 플랫폼 호환성  |

#### 환경변수 설정 (@nestjs/config)

```typescript
// .env 파일 예시
NODE_ENV=development

# 데이터베이스 설정 (미니PC)
DATABASE_HOST=192.168.1.100
DATABASE_PORT=5432
DATABASE_NAME=bitcoin_explorer
DATABASE_USER=postgres
DATABASE_PASSWORD=your_password

# Redis 설정
REDIS_HOST=192.168.1.100
REDIS_PORT=6379
REDIS_PASSWORD=

# Elasticsearch 설정
ELASTICSEARCH_HOST=http://192.168.1.100:9200
ELASTICSEARCH_USERNAME=
ELASTICSEARCH_PASSWORD=

# Bitcoin Node 설정
BITCOIN_RPC_HOST=192.168.1.100
BITCOIN_RPC_PORT=8332
BITCOIN_RPC_USER=bitcoinrpc
BITCOIN_RPC_PASSWORD=your_rpc_password
BITCOIN_ZMQ_PORT=28332

# API 설정
API_PORT=3000
CORS_ORIGINS=http://localhost:3001,https://your-frontend.com

# Rate Limiting
THROTTLE_TTL=60
THROTTLE_LIMIT=100
```

#### 프로젝트 구조 설정

```bash
# 모듈 생성
nest generate module blockchain
nest generate module cache
nest generate module search
nest generate module queue
nest generate module websocket

# 서비스 생성
nest generate service blockchain/bitcoin-rpc
nest generate service blockchain/block-processor
nest generate service search/elasticsearch
```

### [ ] MVP 정의

**선택지 A**: 트랜잭션 해시 → 거래 상세 정보 조회 (단순함)
**선택지 B**: 지갑 주소 → 잔액 + 거래 내역 조회 (실용적)

💡 **추천**: B부터 시작 (사용자가 더 자주 사용하는 기능)

### [ ] 개발 단계별 데이터 소스 전략

1. **초기 개발**: 외부 API (Blockchain.info, Blockchair)
2. **중간 개발**: Bitcoin Testnet (빠른 동기화)
3. **최종 개발**: 실제 Bitcoin Mainnet 풀노드

## 1단계: 핵심 데이터 파이프라인 구축

### [ ] 다단계 데이터 소스 구현

#### 데이터 소스 추상화 패턴 구현

```typescript
// src/blockchain/interfaces/blockchain-data-source.interface.ts
export interface BlockchainDataSource {
  getBlock(height: number): Promise<Block>;
  getTransaction(txid: string): Promise<Transaction>;
  getAddressInfo(address: string): Promise<AddressInfo>;
  getCurrentBlockHeight(): Promise<number>;
}

// src/blockchain/services/bitcoin-rpc.service.ts
@Injectable()
export class BitcoinRpcService implements BlockchainDataSource {
  constructor(private configService: ConfigService) {}

  async getBlock(height: number): Promise<Block> {
    const response = await axios.post(
      `${this.getRpcUrl()}`,
      {
        jsonrpc: "2.0",
        id: 1,
        method: "getblockhash",
        params: [height],
      },
      {
        auth: {
          username: this.configService.get("BITCOIN_RPC_USER"),
          password: this.configService.get("BITCOIN_RPC_PASSWORD"),
        },
      }
    );

    const blockHash = response.data.result;
    // 블록 상세 정보 조회 로직...
  }
}

// src/blockchain/services/external-api.service.ts
@Injectable()
export class ExternalApiService implements BlockchainDataSource {
  // BlockStream API, Blockchain.info 등 외부 API 활용
}
```

**💡 추상화 패턴을 사용하는 이유:**

- **개발 단계별 전환**: 외부 API → Testnet → Mainnet 순서로 쉽게 전환
- **테스트 용이성**: Mock 데이터 소스로 쉽게 교체 가능
- **장애 대응**: 주 데이터 소스 장애 시 백업 소스로 자동 전환
- **코드 재사용**: 동일한 인터페이스로 여러 블록체인 지원 가능

### [ ] Bull Queue를 이용한 ETL 파이프라인 구축

#### Bull Queue 모듈 설정

```typescript
// src/app.module.ts
import { BullModule } from "@nestjs/bull";

@Module({
  imports: [
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        redis: {
          host: configService.get("REDIS_HOST"),
          port: configService.get("REDIS_PORT"),
          password: configService.get("REDIS_PASSWORD"),
        },
      }),
      inject: [ConfigService],
    }),

    // 큐 등록
    BullModule.registerQueue(
      { name: "block-processing" },
      { name: "transaction-indexing" },
      { name: "address-balance-update" }
    ),
  ],
})
export class AppModule {}
```

#### ETL 작업 프로세서 구현

```typescript
// src/queue/processors/block.processor.ts
@Processor("block-processing")
export class BlockProcessor {
  private readonly logger = new Logger(BlockProcessor.name);

  constructor(
    @InjectRepository(Block) private blockRepository: Repository<Block>,
    @Inject("ELASTICSEARCH_SERVICE")
    private elasticsearchService: ElasticsearchService,
    @Inject("CACHE_MANAGER") private cacheManager: Cache
  ) {}

  @Process("new-block")
  async processNewBlock(job: Job<{ blockHeight: number; blockHash?: string }>) {
    const { blockHeight, blockHash } = job.data;

    try {
      // 1. 블록 데이터 수집
      const blockData = await this.bitcoinRpcService.getBlock(blockHeight);

      // 2. PostgreSQL 저장
      const savedBlock = await this.blockRepository.save({
        height: blockData.height,
        hash: blockData.hash,
        timestamp: new Date(blockData.time * 1000),
        // ... 기타 블록 정보
      });

      // 3. 트랜잭션별 처리 작업 큐에 추가
      for (const txid of blockData.tx) {
        await this.transactionQueue.add("index-transaction", {
          txid,
          blockHeight: blockData.height,
        });
      }

      // 4. Elasticsearch 블록 인덱싱
      await this.elasticsearchService.index({
        index: "bitcoin-blocks",
        id: blockData.hash,
        body: {
          height: blockData.height,
          hash: blockData.hash,
          timestamp: blockData.time,
          transactionCount: blockData.tx.length,
        },
      });

      // 5. Redis 캐시 업데이트
      await this.cacheManager.set(
        `latest-blocks`,
        await this.getLatestBlocks(10),
        300 // 5분 TTL
      );

      this.logger.log(`Block ${blockHeight} processed successfully`);
    } catch (error) {
      this.logger.error(`Failed to process block ${blockHeight}:`, error);
      throw error; // Bull Queue가 재시도 처리
    }
  }

  @Process("sync-historical-blocks")
  async syncHistoricalBlocks(
    job: Job<{ startHeight: number; endHeight: number }>
  ) {
    const { startHeight, endHeight } = job.data;

    for (let height = startHeight; height <= endHeight; height++) {
      // 배치 처리로 메모리 효율성 확보
      await this.processNewBlock({ data: { blockHeight: height } } as Job);

      // 진행률 업데이트
      const progress =
        ((height - startHeight) / (endHeight - startHeight)) * 100;
      job.progress(progress);

      // CPU 부하 방지를 위한 지연
      if (height % 100 === 0) {
        await new Promise((resolve) => setTimeout(resolve, 100));
      }
    }
  }
}
```

**💡 Bull Queue 사용 이유:**

- **확장성**: Redis 기반으로 여러 워커 프로세스에서 작업 분산 처리
- **신뢰성**: 작업 실패 시 자동 재시도, 작업 상태 추적
- **우선순위**: 실시간 블록 vs 히스토리컬 동기화 작업 우선순위 관리
- **모니터링**: Bull Dashboard로 큐 상태 실시간 모니터링

### [ ] 실시간 데이터 수집 (풀노드 연결 시)

```typescript
// ZMQ를 이용한 실시간 블록 알림
@Injectable()
export class BitcoinZmqService {
  private zmq = require("zeromq");

  async subscribeToBlocks() {
    const sock = this.zmq.socket("sub");
    sock.connect("tcp://192.168.1.100:28332");
    sock.subscribe("hashblock");

    sock.on("message", (topic, message) => {
      // 새 블록 처리 큐에 추가
      this.blockQueue.add("new-block", { blockHash: message });
    });
  }
}
```

### [ ] 초기 동기화 전략

- [ ] 진행상황 추적 테이블 생성
- [ ] 배치 처리로 대용량 데이터 수집
- [ ] 중단/재시작 기능

## 2단계: 데이터베이스 모델링 (PostgreSQL + TypeORM)

### [ ] TypeORM 설정 및 데이터베이스 연결

#### TypeORM 모듈 설정

```typescript
// src/app.module.ts
import { TypeOrmModule } from "@nestjs/typeorm";

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: "postgres",
        host: configService.get("DATABASE_HOST"),
        port: configService.get("DATABASE_PORT"),
        username: configService.get("DATABASE_USER"),
        password: configService.get("DATABASE_PASSWORD"),
        database: configService.get("DATABASE_NAME"),

        // 엔티티 자동 로드
        entities: [__dirname + "/**/*.entity{.ts,.js}"],

        // 마이그레이션 설정
        migrations: [__dirname + "/migrations/*{.ts,.js}"],
        migrationsRun: false, // 수동으로 마이그레이션 실행

        // 개발 환경 설정
        synchronize: false, // 프로덕션에서는 절대 true 금지
        logging: configService.get("NODE_ENV") === "development",

        // 연결 풀 설정 (블록체인 대용량 데이터 처리)
        extra: {
          max: 20,
          min: 5,
          acquire: 60000,
          idle: 10000,
        },
      }),
      inject: [ConfigService],
    }),
  ],
})
export class AppModule {}
```

#### 마이그레이션 설정

```typescript
// src/database/data-source.ts (CLI 용)
import { DataSource } from "typeorm";
import { config } from "dotenv";

config();

export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DATABASE_HOST,
  port: parseInt(process.env.DATABASE_PORT),
  username: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  entities: ["src/**/*.entity.ts"],
  migrations: ["src/database/migrations/*.ts"],
  synchronize: false,
});
```

```bash
# 마이그레이션 명령어 (package.json scripts 추가)
npm run migration:generate -- -n CreateBlockchainTables
npm run migration:run
npm run migration:revert
```

**💡 TypeORM 설정 요점:**

- **마이그레이션 기반**: `synchronize: false`로 설정하여 스키마 변경을 안전하게 관리
- **연결 풀**: 대용량 블록체인 데이터 처리를 위한 최적화된 연결 설정
- **로깅**: 개발 환경에서만 SQL 로깅 활성화

### [ ] 엔티티 설계

#### 블록체인 핵심 엔티티

```typescript
// src/blockchain/entities/block.entity.ts
@Entity("blocks")
@Index(["height"])
@Index(["hash"])
@Index(["timestamp"])
export class Block {
  @PrimaryColumn()
  height: number;

  @Column({ length: 64, unique: true })
  hash: string;

  @Column({ name: "previous_block_hash", length: 64, nullable: true })
  previousBlockHash: string;

  @Column({ name: "merkle_root", length: 64 })
  merkleRoot: string;

  @Column({ type: "timestamp" })
  timestamp: Date;

  @Column({ type: "bigint" })
  nonce: number;

  @Column({ type: "int" })
  difficulty: number;

  @Column({ name: "transaction_count", type: "int" })
  transactionCount: number;

  @Column({ type: "bigint", name: "block_size" })
  blockSize: number;

  @OneToMany(() => Transaction, (tx) => tx.block, { cascade: true })
  transactions: Transaction[];

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: Date;
}

// src/blockchain/entities/transaction.entity.ts
@Entity("transactions")
@Index(["txid"])
@Index(["block_height"])
@Index(["fee"])
export class Transaction {
  @PrimaryColumn({ length: 64 })
  txid: string;

  @Column({ name: "block_height" })
  blockHeight: number;

  @ManyToOne(() => Block, (block) => block.transactions, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "block_height", referencedColumnName: "height" })
  block: Block;

  @Column({ type: "int", name: "tx_index" })
  txIndex: number; // 블록 내 거래 순서

  @Column({ type: "bigint" })
  fee: number; // satoshi 단위

  @Column({ type: "int" })
  size: number; // 거래 크기 (bytes)

  @Column({ type: "int", name: "virtual_size" })
  virtualSize: number; // SegWit 고려한 가상 크기

  @Column({ type: "boolean", name: "is_coinbase" })
  isCoinbase: boolean;

  @OneToMany(() => TxInput, (input) => input.transaction, { cascade: true })
  inputs: TxInput[];

  @OneToMany(() => TxOutput, (output) => output.transaction, { cascade: true })
  outputs: TxOutput[];

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;
}

// src/blockchain/entities/tx-input.entity.ts
@Entity("tx_inputs")
@Index(["txid"])
@Index(["previous_output_txid", "previous_output_index"])
export class TxInput {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 64 })
  txid: string;

  @ManyToOne(() => Transaction, (tx) => tx.inputs, { onDelete: "CASCADE" })
  @JoinColumn({ name: "txid" })
  transaction: Transaction;

  @Column({ type: "int", name: "input_index" })
  inputIndex: number;

  @Column({ length: 64, name: "previous_output_txid", nullable: true })
  previousOutputTxid: string;

  @Column({ type: "int", name: "previous_output_index", nullable: true })
  previousOutputIndex: number;

  @Column({ type: "text", name: "script_sig" })
  scriptSig: string;

  @Column({ type: "bigint" })
  sequence: number;
}

// src/blockchain/entities/tx-output.entity.ts
@Entity("tx_outputs")
@Index(["txid", "output_index"])
@Index(["address"])
@Index(["is_spent"])
@Index(["value"])
export class TxOutput {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 64 })
  txid: string;

  @ManyToOne(() => Transaction, (tx) => tx.outputs, { onDelete: "CASCADE" })
  @JoinColumn({ name: "txid" })
  transaction: Transaction;

  @Column({ type: "int", name: "output_index" })
  outputIndex: number;

  @Column({ length: 62, nullable: true })
  address: string;

  @Column({ type: "bigint" })
  value: number; // satoshi 단위

  @Column({ type: "text", name: "script_pubkey" })
  scriptPubkey: string;

  @Column({ type: "boolean", name: "is_spent", default: false })
  isSpent: boolean;

  @Column({ length: 64, name: "spent_in_txid", nullable: true })
  spentInTxid: string;

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;
}
```

**💡 엔티티 설계 핵심 포인트:**

- **복합 인덱스**: 자주 함께 조회되는 컬럼들을 복합 인덱스로 최적화
- **UTXO 추적**: `isSpent`, `spentInTxid` 필드로 UTXO 상태 관리
- **캐스케이드**: 블록 삭제 시 관련 거래들 자동 삭제
- **타입 최적화**: `bigint`로 큰 숫자값 안전하게 저장

### [ ] UTXO 모델 구현

```typescript
@Entity("address_balances")
export class AddressBalance {
  @PrimaryColumn()
  address: string;

  @Column({ type: "bigint" })
  balance: number;

  @UpdateDateColumn()
  lastUpdated: Date;
}
```

### [ ] 인덱싱 전략

- [ ] 트랜잭션 해시 인덱스
- [ ] 주소별 인덱스
- [ ] 블록 높이/타임스탬프 복합 인덱스

## 3단계: REST API + WebSocket 구현

### [ ] API 문서화 설정 (Swagger)

#### Swagger 설정

```bash
# API 문서화 라이브러리 설치
npm install @nestjs/swagger swagger-ui-express
```

```typescript
// src/main.ts
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Swagger 설정
  const config = new DocumentBuilder()
    .setTitle("Bitcoin Explorer API")
    .setDescription("비트코인 블록체인 익스플로러 API")
    .setVersion("1.0")
    .addTag("blocks", "블록 정보 조회")
    .addTag("transactions", "거래 정보 조회")
    .addTag("addresses", "주소 정보 조회")
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api-docs", app, document);

  await app.listen(3000);
}
```

**💡 Swagger를 사용하는 이유:**

- **자동 문서화**: 데코레이터 기반으로 API 스펙 자동 생성
- **테스트 도구**: 브라우저에서 직접 API 테스트 가능
- **타입 안전성**: 프론트엔드 코드 생성 시 타입 정보 활용

### [ ] DTO 및 유효성 검사 설정

#### 유효성 검사 파이프 설정

```typescript
// src/common/dto/pagination.dto.ts
import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsOptional, IsPositive, Max } from "class-validator";
import { Transform } from "class-transformer";

export class PaginationDto {
  @ApiPropertyOptional({
    description: "페이지 번호 (1부터 시작)",
    minimum: 1,
    default: 1,
  })
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsPositive()
  page: number = 1;

  @ApiPropertyOptional({
    description: "페이지 크기",
    minimum: 1,
    maximum: 100,
    default: 20,
  })
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsPositive()
  @Max(100)
  limit: number = 20;
}

// src/blockchain/dto/address-param.dto.ts
export class AddressParamDto {
  @ApiProperty({
    description: "비트코인 주소",
    example: "1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa",
  })
  @IsString()
  @Matches(/^[13][a-km-zA-HJ-NP-Z1-9]{25,34}$|^bc1[a-z0-9]{39,59}$/, {
    message: "유효하지 않은 비트코인 주소 형식입니다.",
  })
  address: string;
}

// src/blockchain/dto/transaction-param.dto.ts
export class TransactionParamDto {
  @ApiProperty({
    description: "트랜잭션 해시",
    example: "4a5e1e4baab89f3a32518a88c31bc87f618f76673e2cc77ab2127b7afdeda33b",
  })
  @IsString()
  @Length(64, 64, { message: "트랜잭션 해시는 64자여야 합니다." })
  @Matches(/^[a-fA-F0-9]{64}$/, {
    message: "유효하지 않은 트랜잭션 해시 형식입니다.",
  })
  txid: string;
}
```

### [ ] RESTful API 설계

```typescript
// src/blockchain/controllers/explorer.controller.ts
@ApiTags("blockchain")
@Controller("api/v1")
@UseFilters(AllExceptionsFilter)
@UseInterceptors(ClassSerializerInterceptor)
export class ExplorerController {
  constructor(
    private readonly explorerService: ExplorerService,
    private readonly cacheService: CacheService
  ) {}

  @Get("addresses/:address")
  @ApiOperation({
    summary: "주소 정보 조회",
    description: "지정된 비트코인 주소의 잔액과 거래 내역을 조회합니다.",
  })
  @ApiResponse({
    status: 200,
    description: "주소 정보 조회 성공",
    type: AddressInfoResponseDto,
  })
  @ApiResponse({ status: 400, description: "잘못된 주소 형식" })
  @ApiResponse({ status: 404, description: "주소를 찾을 수 없음" })
  @UseInterceptors(CacheInterceptor)
  @CacheTTL(300) // 5분 캐시
  async getAddressInfo(
    @Param() { address }: AddressParamDto,
    @Query() paginationDto: PaginationDto
  ): Promise<AddressInfoResponseDto> {
    return this.explorerService.getAddressInfo(address, paginationDto);
  }

  @Get("transactions/:txid")
  @ApiOperation({
    summary: "거래 정보 조회",
    description: "트랜잭션 해시로 거래 상세 정보를 조회합니다.",
  })
  @UseInterceptors(CacheInterceptor)
  @CacheTTL(3600) // 1시간 캐시 (확정된 거래는 변경되지 않음)
  async getTransaction(
    @Param() { txid }: TransactionParamDto
  ): Promise<TransactionDetailResponseDto> {
    return this.explorerService.getTransaction(txid);
  }

  @Get("blocks/latest")
  @ApiOperation({
    summary: "최신 블록 목록",
    description: "최근 생성된 블록 목록을 조회합니다.",
  })
  @UseInterceptors(CacheInterceptor)
  @CacheTTL(60) // 1분 캐시 (빠르게 업데이트되는 데이터)
  async getLatestBlocks(
    @Query() paginationDto: PaginationDto
  ): Promise<BlockListResponseDto> {
    return this.explorerService.getLatestBlocks(paginationDto);
  }

  @Get("blocks/:height")
  @ApiOperation({
    summary: "특정 높이 블록 조회",
    description: "블록 높이로 블록 정보를 조회합니다.",
  })
  async getBlockByHeight(
    @Param("height", ParseIntPipe) height: number
  ): Promise<BlockDetailResponseDto> {
    return this.explorerService.getBlockByHeight(height);
  }

  @Get("stats")
  @ApiOperation({
    summary: "블록체인 통계",
    description: "현재 블록체인의 전체 통계 정보를 조회합니다.",
  })
  @UseInterceptors(CacheInterceptor)
  @CacheTTL(300) // 5분 캐시
  async getBlockchainStats(): Promise<BlockchainStatsResponseDto> {
    return this.explorerService.getBlockchainStats();
  }

  @Get("search")
  @ApiOperation({
    summary: "통합 검색",
    description: "블록 해시, 트랜잭션 해시, 주소를 통합 검색합니다.",
  })
  async search(@Query("q") query: string): Promise<SearchResultResponseDto> {
    return this.explorerService.search(query);
  }
}
```

**💡 API 설계 핵심 원칙:**

- **RESTful**: 리소스 기반 URL 구조 사용
- **유효성 검사**: DTO와 ValidationPipe로 입력값 검증
- **캐시 전략**: 데이터 특성에 따른 차별화된 TTL 설정
- **에러 처리**: 일관된 에러 응답 구조

### [ ] WebSocket 실시간 업데이트

```typescript
@WebSocketGateway({ cors: true })
export class RealtimeGateway {
  @WebSocketServer()
  server: Server;

  // 새 블록 알림
  notifyNewBlock(block: Block) {
    this.server.emit("new-block", {
      height: block.height,
      hash: block.hash,
      transactionCount: block.transactions.length,
    });
  }
}
```

### [ ] Redis 캐싱 전략

```typescript
@Injectable()
export class CacheService {
  // 자주 조회되는 데이터 캐싱
  async cacheAddressInfo(address: string, data: any) {
    await this.redisClient.setex(
      `address:${address}`,
      300, // 5분 TTL
      JSON.stringify(data)
    );
  }
}
```

## 4단계: Elasticsearch 통합

### [ ] Elasticsearch 모듈 설정

#### Elasticsearch 연결 설정

```typescript
// src/app.module.ts
import { ElasticsearchModule } from "@nestjs/elasticsearch";

@Module({
  imports: [
    ElasticsearchModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        node: configService.get("ELASTICSEARCH_HOST"),
        auth: {
          username: configService.get("ELASTICSEARCH_USERNAME"),
          password: configService.get("ELASTICSEARCH_PASSWORD"),
        },
        maxRetries: 10,
        requestTimeout: 60000,
        sniffOnStart: true,
      }),
      inject: [ConfigService],
    }),
  ],
})
export class AppModule {}
```

**💡 Elasticsearch 선택 이유:**

- **빠른 검색**: 대용량 블록체인 데이터에서 밀리세컨드 단위 응답
- **부분 일치**: 트랜잭션 해시, 주소 자동완성 검색 지원
- **집계 기능**: 거래량, 수수료 통계 등 분석 기능
- **확장성**: 데이터 증가에 따른 샤딩, 복제 지원

### [ ] 검색 인덱스 설계 및 매핑

#### 인덱스 템플릿 생성

```typescript
// src/search/services/elasticsearch-setup.service.ts
@Injectable()
export class ElasticsearchSetupService implements OnModuleInit {
  constructor(private readonly elasticsearchService: ElasticsearchService) {}

  async onModuleInit() {
    await this.createIndexTemplates();
  }

  private async createIndexTemplates() {
    // 트랜잭션 인덱스 템플릿
    await this.elasticsearchService.indices.putTemplate({
      name: "bitcoin-transactions-template",
      body: {
        index_patterns: ["bitcoin-transactions-*"],
        settings: {
          number_of_shards: 2,
          number_of_replicas: 1,
          "index.mapping.total_fields.limit": 2000,
          analysis: {
            analyzer: {
              bitcoin_address_analyzer: {
                type: "custom",
                tokenizer: "keyword",
                filter: ["lowercase", "edge_ngram_filter"],
              },
            },
            filter: {
              edge_ngram_filter: {
                type: "edge_ngram",
                min_gram: 3,
                max_gram: 20,
              },
            },
          },
        },
        mappings: {
          properties: {
            txid: { type: "keyword" },
            blockHeight: { type: "long" },
            blockHash: { type: "keyword" },
            timestamp: { type: "date" },
            fee: { type: "long" },
            size: { type: "integer" },
            virtualSize: { type: "integer" },
            isCoinbase: { type: "boolean" },
            inputCount: { type: "integer" },
            outputCount: { type: "integer" },
            totalValue: { type: "long" },
            addresses: {
              type: "text",
              analyzer: "bitcoin_address_analyzer",
              fields: {
                keyword: { type: "keyword" },
              },
            },
            inputAddresses: { type: "keyword" },
            outputAddresses: { type: "keyword" },
          },
        },
      },
    });

    // 주소 인덱스 템플릿
    await this.elasticsearchService.indices.putTemplate({
      name: "bitcoin-addresses-template",
      body: {
        index_patterns: ["bitcoin-addresses-*"],
        settings: {
          number_of_shards: 1,
          number_of_replicas: 1,
        },
        mappings: {
          properties: {
            address: {
              type: "text",
              analyzer: "bitcoin_address_analyzer",
              fields: {
                keyword: { type: "keyword" },
              },
            },
            balance: { type: "long" },
            transactionCount: { type: "long" },
            totalReceived: { type: "long" },
            totalSent: { type: "long" },
            firstSeenBlock: { type: "long" },
            lastSeenBlock: { type: "long" },
            addressType: { type: "keyword" }, // P2PKH, P2SH, Bech32
            isActive: { type: "boolean" },
          },
        },
      },
    });
  }
}
```

### [ ] 검색 서비스 구현

```typescript
// src/search/services/search.service.ts
@Injectable()
export class SearchService {
  private readonly logger = new Logger(SearchService.name);

  constructor(
    private readonly elasticsearchService: ElasticsearchService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache
  ) {}

  // 트랜잭션 인덱싱
  async indexTransaction(transaction: Transaction) {
    const currentIndex = `bitcoin-transactions-${new Date().getFullYear()}-${String(
      new Date().getMonth() + 1
    ).padStart(2, "0")}`;

    try {
      await this.elasticsearchService.index({
        index: currentIndex,
        id: transaction.txid,
        body: {
          txid: transaction.txid,
          blockHeight: transaction.blockHeight,
          blockHash: transaction.block?.hash,
          timestamp: transaction.block?.timestamp,
          fee: transaction.fee,
          size: transaction.size,
          virtualSize: transaction.virtualSize,
          isCoinbase: transaction.isCoinbase,
          inputCount: transaction.inputs?.length || 0,
          outputCount: transaction.outputs?.length || 0,
          totalValue:
            transaction.outputs?.reduce((sum, o) => sum + o.value, 0) || 0,
          addresses: [
            ...(transaction.inputs?.map((i) => i.previousOutputTxid) || []),
            ...(transaction.outputs?.map((o) => o.address).filter(Boolean) ||
              []),
          ],
          inputAddresses:
            transaction.inputs
              ?.map((i) => i.previousOutputTxid)
              .filter(Boolean) || [],
          outputAddresses:
            transaction.outputs?.map((o) => o.address).filter(Boolean) || [],
        },
      });

      this.logger.log(`Transaction ${transaction.txid} indexed successfully`);
    } catch (error) {
      this.logger.error(
        `Failed to index transaction ${transaction.txid}:`,
        error
      );
      throw error;
    }
  }

  // 주소 인덱싱
  async indexAddress(addressInfo: AddressBalance) {
    try {
      await this.elasticsearchService.index({
        index: "bitcoin-addresses-current",
        id: addressInfo.address,
        body: {
          address: addressInfo.address,
          balance: addressInfo.balance,
          transactionCount: addressInfo.transactionCount || 0,
          totalReceived: addressInfo.totalReceived || 0,
          totalSent: addressInfo.totalSent || 0,
          firstSeenBlock: addressInfo.firstSeenBlock || null,
          lastSeenBlock: addressInfo.lastSeenBlock || null,
          addressType: this.getAddressType(addressInfo.address),
          isActive: addressInfo.balance > 0,
          lastUpdated: new Date(),
        },
      });
    } catch (error) {
      this.logger.error(
        `Failed to index address ${addressInfo.address}:`,
        error
      );
      throw error;
    }
  }

  // 통합 검색 (트랜잭션, 주소, 블록 해시)
  async search(query: string, options?: SearchOptions): Promise<SearchResult> {
    const cacheKey = `search:${query}:${JSON.stringify(options)}`;

    // 캐시 확인
    const cachedResult = await this.cacheManager.get<SearchResult>(cacheKey);
    if (cachedResult) {
      return cachedResult;
    }

    const searchPromises = [];

    // 트랜잭션 검색
    searchPromises.push(this.searchTransactions(query, options));

    // 주소 검색
    if (this.isValidAddressFormat(query)) {
      searchPromises.push(this.searchAddresses(query, options));
    }

    // 블록 검색 (높이 또는 해시)
    if (this.isValidBlockIdentifier(query)) {
      searchPromises.push(this.searchBlocks(query, options));
    }

    const results = await Promise.allSettled(searchPromises);

    const searchResult: SearchResult = {
      query,
      transactions: this.extractResult(results[0]) || [],
      addresses: this.extractResult(results[1]) || [],
      blocks: this.extractResult(results[2]) || [],
      total: 0,
      took: Date.now() - Date.now(), // 실제 시작 시간 계산 필요
    };

    searchResult.total =
      searchResult.transactions.length +
      searchResult.addresses.length +
      searchResult.blocks.length;

    // 결과 캐시 (5분)
    await this.cacheManager.set(cacheKey, searchResult, 300);

    return searchResult;
  }

  // 트랜잭션 검색
  async searchTransactions(query: string, options?: SearchOptions) {
    const searchBody = {
      size: options?.limit || 20,
      from: ((options?.page || 1) - 1) * (options?.limit || 20),
      query: {
        bool: {
          should: [
            { term: { txid: query } }, // 정확한 매치 (높은 점수)
            { prefix: { txid: query.toLowerCase() } }, // 접두사 매치
            { terms: { "addresses.keyword": [query] } }, // 주소 매치
            {
              multi_match: {
                query: query,
                fields: ["addresses"],
                type: "phrase_prefix",
              },
            },
          ],
          minimum_should_match: 1,
        },
      },
      sort: [
        { blockHeight: { order: "desc" } }, // 최신 블록 우선
        { _score: { order: "desc" } }, // 관련도 높은 순
      ],
    };

    const result = await this.elasticsearchService.search({
      index: "bitcoin-transactions-*",
      body: searchBody,
    });

    return result.body.hits.hits.map((hit) => ({
      ...hit._source,
      score: hit._score,
    }));
  }

  // 자동완성 검색
  async autocomplete(
    query: string,
    type: "address" | "transaction" = "address"
  ): Promise<string[]> {
    if (query.length < 3) {
      return [];
    }

    const cacheKey = `autocomplete:${type}:${query}`;
    const cached = await this.cacheManager.get<string[]>(cacheKey);
    if (cached) {
      return cached;
    }

    const index =
      type === "address" ? "bitcoin-addresses-*" : "bitcoin-transactions-*";
    const field = type === "address" ? "address" : "txid";

    const result = await this.elasticsearchService.search({
      index,
      body: {
        size: 10,
        _source: [field],
        query: {
          prefix: {
            [field]: query.toLowerCase(),
          },
        },
      },
    });

    const suggestions = result.body.hits.hits.map((hit) => hit._source[field]);

    // 30초 캐시
    await this.cacheManager.set(cacheKey, suggestions, 30);

    return suggestions;
  }

  private getAddressType(address: string): string {
    if (address.startsWith("1")) return "P2PKH";
    if (address.startsWith("3")) return "P2SH";
    if (address.startsWith("bc1")) return "Bech32";
    return "Unknown";
  }

  private isValidAddressFormat(query: string): boolean {
    return /^[13][a-km-zA-HJ-NP-Z1-9]{25,34}$|^bc1[a-z0-9]{39,59}$/.test(query);
  }

  private isValidBlockIdentifier(query: string): boolean {
    // 블록 높이 (숫자) 또는 블록 해시 (64자 헥사)
    return /^\d+$/.test(query) || /^[a-fA-F0-9]{64}$/.test(query);
  }

  private extractResult(result: PromiseSettledResult<any>): any[] {
    return result.status === "fulfilled" ? result.value : [];
  }
}

// 검색 옵션 및 결과 타입
interface SearchOptions {
  page?: number;
  limit?: number;
  sortBy?: string;
  order?: "asc" | "desc";
}

interface SearchResult {
  query: string;
  transactions: any[];
  addresses: any[];
  blocks: any[];
  total: number;
  took: number;
}
```

**💡 Elasticsearch 최적화 팁:**

- **인덱스 템플릿**: 월별 인덱스 자동 생성으로 데이터 관리
- **커스텀 분석기**: 비트코인 주소 검색에 최적화된 토크나이저
- **캐싱**: 자주 검색되는 쿼리 결과 Redis 캐싱
- **자동완성**: Edge N-gram 필터로 부분 문자열 매치

## 5단계: 에러 처리 및 보안

### [ ] 글로벌 에러 처리

```typescript
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse();

    const errorResponse = {
      statusCode: 500,
      message: "Internal server error",
      timestamp: new Date().toISOString(),
      path: request.url,
    };

    response.status(500).json(errorResponse);
  }
}
```

### [ ] Rate Limiting

```typescript
// app.module.ts
@Module({
  imports: [
    ThrottlerModule.forRoot({
      ttl: 60,
      limit: 100, // 분당 100회 제한
    }),
  ]
})
```

### [ ] 입력 유효성 검사

```typescript
export class AddressParamDto {
  @IsString()
  @Matches(/^[13][a-km-zA-HJ-NP-Z1-9]{25,34}$|^bc1[a-z0-9]{39,59}$/)
  address: string;
}
```

## 6단계: 테스트 및 모니터링

### [ ] 단위 테스트

```typescript
describe("ExplorerService", () => {
  it("should calculate address balance correctly", async () => {
    // UTXO 기반 잔액 계산 로직 테스트
  });
});
```

### [ ] 헬스 체크

```typescript
@Controller("health")
export class HealthController {
  @Get()
  check() {
    return {
      status: "ok",
      database: "connected",
      redis: "connected",
      elasticsearch: "connected",
      bitcoinNode: "synced",
    };
  }
}
```

## 7단계: 배포 및 운영

### [ ] Docker 컨테이너화

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY dist ./dist
EXPOSE 3000
CMD ["node", "dist/main"]
```

### [ ] 미니PC 환경에서의 배포

```yaml
# docker-compose.yml (미니PC에서)
version: "3.8"
services:
  postgres:
    image: postgres:15
    ports:
      - "5432:5432"
    volumes:
      - bitcoin_data:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"

  elasticsearch:
    image: elasticsearch:8.8.0
    ports:
      - "9200:9200"
```

## 개발 단계별 우선순위

### Phase 1: 기본 기능 (1-2주)

- [ ] 외부 API를 이용한 주소 조회 API
- [ ] PostgreSQL 기본 스키마
- [ ] REST API 기본 구조

### Phase 2: 고도화 (2-3주)

- [ ] Bitcoin Testnet 연결
- [ ] Bull Queue ETL 파이프라인
- [ ] Redis 캐싱

### Phase 3: 완성 (2-4주)

- [ ] 실제 풀노드 연결
- [ ] Elasticsearch 검색
- [ ] WebSocket 실시간 업데이트

## 8단계: 개발 환경 최적화

### [ ] package.json 스크립트 설정

```json
{
  "name": "bitcoin-explorer-backend",
  "version": "1.0.0",
  "scripts": {
    "build": "nest build",
    "format": "prettier --write \"src/**/*.ts\" \"test/**/*.ts\"",
    "start": "nest start",
    "start:dev": "nest start --watch",
    "start:debug": "nest start --debug --watch",
    "start:prod": "node dist/main",

    "lint": "eslint \"{src,apps,libs,test}/**/*.ts\" --fix",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:cov": "jest --coverage",
    "test:debug": "node --inspect-brk -r tsconfig-paths/register -r ts-node/register node_modules/.bin/jest --runInBand",
    "test:e2e": "jest --config ./test/jest-e2e.json",

    "typeorm": "typeorm-ts-node-commonjs",
    "migration:generate": "npm run typeorm -- migration:generate",
    "migration:run": "npm run typeorm -- migration:run",
    "migration:revert": "npm run typeorm -- migration:revert",
    "schema:sync": "npm run typeorm -- schema:sync",
    "schema:drop": "npm run typeorm -- schema:drop",

    "queue:ui": "bull-board",
    "elasticsearch:setup": "ts-node src/scripts/setup-elasticsearch.ts",
    "blockchain:sync": "ts-node src/scripts/sync-blockchain.ts",
    "dev:services": "docker-compose -f docker-compose.dev.yml up -d",
    "dev:services:down": "docker-compose -f docker-compose.dev.yml down"
  },
  "dependencies": {
    "@nestjs/bull": "^10.0.1",
    "@nestjs/cache-manager": "^2.1.1",
    "@nestjs/common": "^10.0.0",
    "@nestjs/config": "^3.1.1",
    "@nestjs/core": "^10.0.0",
    "@nestjs/elasticsearch": "^10.0.1",
    "@nestjs/platform-express": "^10.0.0",
    "@nestjs/platform-socket.io": "^10.2.7",
    "@nestjs/swagger": "^7.1.16",
    "@nestjs/terminus": "^10.2.0",
    "@nestjs/throttler": "^5.0.1",
    "@nestjs/typeorm": "^10.0.1",
    "@nestjs/websockets": "^10.2.7",
    "axios": "^1.6.2",
    "bull": "^4.11.5",
    "cache-manager": "^5.2.4",
    "cache-manager-redis-store": "^3.0.1",
    "class-transformer": "^0.5.1",
    "class-validator": "^0.14.0",
    "pg": "^8.11.3",
    "redis": "^4.6.10",
    "reflect-metadata": "^0.1.13",
    "rxjs": "^7.8.1",
    "swagger-ui-express": "^5.0.0",
    "typeorm": "^0.3.17",
    "zeromq": "^6.0.0-beta.20"
  },
  "devDependencies": {
    "@nestjs/cli": "^10.0.0",
    "@nestjs/schematics": "^10.0.0",
    "@nestjs/testing": "^10.0.0",
    "@types/bull": "^4.10.0",
    "@types/express": "^4.17.17",
    "@types/jest": "^29.5.2",
    "@types/node": "^20.3.1",
    "@types/pg": "^8.10.9",
    "@types/redis": "^4.0.11",
    "@types/supertest": "^2.0.12",
    "@types/zeromq": "^5.2.2",
    "@typescript-eslint/eslint-plugin": "^6.0.0",
    "@typescript-eslint/parser": "^6.0.0",
    "eslint": "^8.42.0",
    "eslint-config-prettier": "^9.0.0",
    "eslint-plugin-prettier": "^5.0.0",
    "jest": "^29.5.0",
    "prettier": "^3.0.0",
    "source-map-support": "^0.5.21",
    "supertest": "^6.3.3",
    "ts-jest": "^29.1.0",
    "ts-loader": "^9.4.3",
    "ts-node": "^10.9.1",
    "tsconfig-paths": "^4.2.1",
    "typescript": "^5.1.3"
  }
}
```

### [ ] Docker 개발 환경 구성

#### 개발용 Docker Compose

```yaml
# docker-compose.dev.yml
version: "3.8"

services:
  postgres:
    image: postgres:15-alpine
    container_name: bitcoin-explorer-postgres
    environment:
      POSTGRES_DB: bitcoin_explorer
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres123
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./scripts/init-db.sql:/docker-entrypoint-initdb.d/init-db.sql
    networks:
      - bitcoin-explorer

  redis:
    image: redis:7-alpine
    container_name: bitcoin-explorer-redis
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
    networks:
      - bitcoin-explorer

  elasticsearch:
    image: elasticsearch:8.11.0
    container_name: bitcoin-explorer-elasticsearch
    environment:
      - discovery.type=single-node
      - "ES_JAVA_OPTS=-Xms512m -Xmx512m"
      - xpack.security.enabled=false
      - xpack.security.enrollment.enabled=false
    ports:
      - "9200:9200"
      - "9300:9300"
    volumes:
      - elasticsearch_data:/usr/share/elasticsearch/data
    networks:
      - bitcoin-explorer

  kibana:
    image: kibana:8.11.0
    container_name: bitcoin-explorer-kibana
    environment:
      - ELASTICSEARCH_HOSTS=http://elasticsearch:9200
    ports:
      - "5601:5601"
    depends_on:
      - elasticsearch
    networks:
      - bitcoin-explorer

volumes:
  postgres_data:
  redis_data:
  elasticsearch_data:

networks:
  bitcoin-explorer:
    driver: bridge
```

#### 환경별 설정 파일

```bash
# .env.development
NODE_ENV=development
API_PORT=3000

# Database
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_NAME=bitcoin_explorer
DATABASE_USER=postgres
DATABASE_PASSWORD=postgres123

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379

# Elasticsearch
ELASTICSEARCH_HOST=http://localhost:9200

# External APIs (개발 초기)
BLOCKCHAIN_INFO_API=https://blockchain.info/rawapi
BLOCKCHAIR_API=https://api.blockchair.com/bitcoin

# Logging
LOG_LEVEL=debug
```

```bash
# .env.production
NODE_ENV=production
API_PORT=3000

# Database (실제 미니PC IP)
DATABASE_HOST=192.168.1.100
DATABASE_PORT=5432
DATABASE_NAME=bitcoin_explorer
DATABASE_USER=bitcoin_user
DATABASE_PASSWORD=secure_password_here

# Redis
REDIS_HOST=192.168.1.100
REDIS_PORT=6379
REDIS_PASSWORD=redis_password_here

# Elasticsearch
ELASTICSEARCH_HOST=http://192.168.1.100:9200
ELASTICSEARCH_USERNAME=elastic
ELASTICSEARCH_PASSWORD=elastic_password_here

# Bitcoin Node
BITCOIN_RPC_HOST=192.168.1.100
BITCOIN_RPC_PORT=8332
BITCOIN_RPC_USER=bitcoinrpc
BITCOIN_RPC_PASSWORD=rpc_password_here
BITCOIN_ZMQ_PORT=28332

# Security
JWT_SECRET=your_jwt_secret_here
THROTTLE_TTL=60
THROTTLE_LIMIT=100

# Logging
LOG_LEVEL=warn
```

### [ ] 헬퍼 스크립트 작성

#### 블록체인 동기화 스크립트

```typescript
// src/scripts/sync-blockchain.ts
import { NestFactory } from "@nestjs/core";
import { AppModule } from "../app.module";
import { BlockProcessor } from "../queue/processors/block.processor";
import { BitcoinRpcService } from "../blockchain/services/bitcoin-rpc.service";

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);

  const bitcoinRpcService = app.get(BitcoinRpcService);
  const blockProcessor = app.get(BlockProcessor);

  try {
    const currentHeight = await bitcoinRpcService.getCurrentBlockHeight();
    const lastSyncedHeight = await getLastSyncedHeight(); // DB에서 조회

    console.log(`Current network height: ${currentHeight}`);
    console.log(`Last synced height: ${lastSyncedHeight}`);
    console.log(`Blocks to sync: ${currentHeight - lastSyncedHeight}`);

    // 배치 크기로 동기화 (메모리 효율성)
    const batchSize = 100;

    for (
      let start = lastSyncedHeight + 1;
      start <= currentHeight;
      start += batchSize
    ) {
      const end = Math.min(start + batchSize - 1, currentHeight);

      console.log(`Syncing blocks ${start} to ${end}...`);

      // Bull Queue에 배치 작업 추가
      await blockProcessor.syncHistoricalBlocks({
        data: { startHeight: start, endHeight: end },
      } as any);

      // 진행상황 출력
      const progress =
        ((end - lastSyncedHeight) / (currentHeight - lastSyncedHeight)) * 100;
      console.log(`Progress: ${progress.toFixed(2)}%`);
    }

    console.log("Blockchain sync completed successfully!");
  } catch (error) {
    console.error("Blockchain sync failed:", error);
    process.exit(1);
  } finally {
    await app.close();
  }
}

bootstrap();
```

#### Elasticsearch 초기 설정 스크립트

```typescript
// src/scripts/setup-elasticsearch.ts
import { NestFactory } from "@nestjs/core";
import { AppModule } from "../app.module";
import { ElasticsearchSetupService } from "../search/services/elasticsearch-setup.service";

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);

  const elasticsearchSetupService = app.get(ElasticsearchSetupService);

  try {
    console.log("Setting up Elasticsearch indices and templates...");

    await elasticsearchSetupService.createIndexTemplates();

    console.log("Elasticsearch setup completed successfully!");
  } catch (error) {
    console.error("Elasticsearch setup failed:", error);
    process.exit(1);
  } finally {
    await app.close();
  }
}

bootstrap();
```

## 🔥 핵심 개발 팁

### 라이브러리 선택 기준

1. **TypeORM vs Prisma**: 복잡한 관계형 데이터에는 TypeORM이 더 적합
2. **Bull vs Agenda**: Redis 기반 Bull이 성능과 모니터링에서 우수
3. **Elasticsearch vs PostgreSQL FTS**: 대용량 검색에는 Elasticsearch 필수
4. **Socket.IO vs native WebSocket**: 브라우저 호환성과 자동 재연결 기능

### 성능 최적화 전략

1. **점진적 개발**: 외부 API → Testnet → Mainnet 순서로 진행
2. **모듈화**: 데이터 소스를 추상화하여 쉽게 교체 가능하게 설계
3. **성능 최적화**: 인덱스, 캐싱, 페이지네이션을 초기부터 고려
4. **에러 처리**: 블록체인 데이터의 특성상 예외 상황 많음 → 견고한 에러 처리 필수
5. **테스트**: UTXO 계산 로직 등 핵심 비즈니스 로직은 반드시 테스트 작성

### 배포 및 모니터링

1. **로깅**: 구조화된 로그로 디버깅과 모니터링 효율화
2. **헬스체크**: 모든 외부 의존성 상태 실시간 모니터링
3. **캐시 전략**: 데이터 특성별 차별화된 TTL 설정
4. **큐 모니터링**: Bull Dashboard로 작업 진행상황 추적

이 가이드를 따라하면 비트코인 풀노드가 완전히 동기화되지 않아도 개발을 시작할 수 있고, 단계적으로 고도화할 수 있습니다!
