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

- [ ] NestJS 프로젝트 생성 및 기본 설정

```bash
npm i -g @nestjs/cli
nest new bitcoin-explorer-backend
```

- [ ] 환경변수 관리 (@nestjs/config)

```typescript
// .env 파일 예시
DATABASE_HOST=192.168.1.100  # 미니PC IP
DATABASE_PORT=5432
REDIS_HOST=192.168.1.100
ELASTICSEARCH_HOST=http://192.168.1.100:9200
BITCOIN_RPC_HOST=192.168.1.100
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

```typescript
// 데이터 소스 추상화
interface BlockchainDataSource {
  getBlock(height: number): Promise<Block>;
  getTransaction(txid: string): Promise<Transaction>;
  getAddressInfo(address: string): Promise<AddressInfo>;
}

// 구현체들
class BitcoinRpcSource implements BlockchainDataSource {}
class BlockchainInfoSource implements BlockchainDataSource {}
class TestDataSource implements BlockchainDataSource {}
```

### [ ] Bull Queue를 이용한 ETL 파이프라인 구축

```typescript
// ETL 작업 큐 설정
@Processor("block-processing")
export class BlockProcessor {
  @Process("new-block")
  async processNewBlock(job: Job<{ blockHeight: number }>) {
    // 1. 블록 데이터 수집
    // 2. PostgreSQL 저장
    // 3. Elasticsearch 인덱싱
    // 4. Redis 캐시 업데이트
  }
}
```

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

### [ ] 엔티티 설계

```typescript
@Entity("blocks")
export class Block {
  @PrimaryColumn()
  height: number;

  @Column()
  hash: string;

  @Column({ type: "timestamp" })
  timestamp: Date;

  @OneToMany(() => Transaction, (tx) => tx.block)
  transactions: Transaction[];
}

@Entity("transactions")
export class Transaction {
  @PrimaryColumn()
  txid: string;

  @ManyToOne(() => Block, (block) => block.transactions)
  block: Block;

  @OneToMany(() => TxOutput, (output) => output.transaction)
  outputs: TxOutput[];
}

@Entity("tx_outputs")
export class TxOutput {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  address: string;

  @Column({ type: "bigint" })
  value: number; // satoshi 단위

  @Index() // 주소별 빠른 조회를 위한 인덱스
  @ManyToOne(() => Transaction, (tx) => tx.outputs)
  transaction: Transaction;
}
```

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

### [ ] RESTful API 설계

```typescript
@Controller("api/v1")
export class ExplorerController {
  // 주소 정보 조회
  @Get("addresses/:address")
  async getAddressInfo(
    @Param("address") address: string,
    @Query() paginationDto: PaginationDto
  ) {
    return this.explorerService.getAddressInfo(address, paginationDto);
  }

  // 트랜잭션 조회
  @Get("transactions/:txid")
  async getTransaction(@Param("txid") txid: string) {
    return this.explorerService.getTransaction(txid);
  }

  // 최신 블록들
  @Get("blocks/latest")
  @UseInterceptors(CacheInterceptor) // Redis 캐싱
  async getLatestBlocks(@Query() paginationDto: PaginationDto) {
    return this.explorerService.getLatestBlocks(paginationDto);
  }
}
```

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

### [ ] 검색 인덱스 설계

```typescript
@Injectable()
export class SearchService {
  // 트랜잭션 검색 인덱싱
  async indexTransaction(transaction: Transaction) {
    await this.elasticsearchService.index({
      index: "bitcoin-transactions",
      id: transaction.txid,
      body: {
        txid: transaction.txid,
        blockHeight: transaction.block.height,
        addresses: transaction.outputs.map((o) => o.address),
        value: transaction.outputs.reduce((sum, o) => sum + o.value, 0),
        timestamp: transaction.block.timestamp,
      },
    });
  }

  // 부분 일치 검색
  async searchTransactions(query: string) {
    return await this.elasticsearchService.search({
      index: "bitcoin-transactions",
      body: {
        query: {
          multi_match: {
            query: query,
            fields: ["txid", "addresses"],
          },
        },
      },
    });
  }
}
```

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

## 🔥 핵심 개발 팁

1. **점진적 개발**: 외부 API → Testnet → Mainnet 순서로 진행
2. **모듈화**: 데이터 소스를 추상화하여 쉽게 교체 가능하게 설계
3. **성능 최적화**: 인덱스, 캐싱, 페이지네이션을 초기부터 고려
4. **에러 처리**: 블록체인 데이터의 특성상 예외 상황 많음 → 견고한 에러 처리 필수
5. **테스트**: UTXO 계산 로직 등 핵심 비즈니스 로직은 반드시 테스트 작성

이 가이드를 따라하면 비트코인 풀노드가 완전히 동기화되지 않아도 개발을 시작할 수 있고, 단계적으로 고도화할 수 있습니다!
