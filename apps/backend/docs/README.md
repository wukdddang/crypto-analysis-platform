# 비트코인 익스플로러 백엔드 문서 📖

이 폴더는 비트코인 익스플로러 백엔드 개발에 필요한 모든 문서를 포함합니다.

## 📚 문서 목록

### 1. 🔍 [BITCOIN_BACKGROUND.md](./BITCOIN_BACKGROUND.md)
**비트코인 익스플로러 개발 배경지식**
- 비트코인 블록체인 기본 구조 이해
- 블록, 트랜잭션, UTXO 모델 상세 설명
- 엔티티 설계 배경과 이유
- 인덱싱 전략의 근거
- 주소 체계와 네트워크 통신

**👨‍💻 대상**: 비트코인 생태계가 처음인 개발자, 엔티티 설계 이유를 알고 싶은 개발자

### 2. 🚀 [CHEAT_SHEET.md](./CHEAT_SHEET.md)
**NestJS 백엔드 설계 가이드**
- 라이브러리 설치부터 완전한 구현까지
- 단계별 개발 가이드 (외부 API → Testnet → Mainnet)
- 실전 코드 예시와 설정
- Docker, 환경 설정, 스크립트

**👨‍💻 대상**: 실제 구현에 바로 들어가고 싶은 개발자

### 3. 📋 [GUIDE_LINE.md](./GUIDE_LINE.md)
**프로젝트 개발 가이드라인**
- 코딩 컨벤션과 프로젝트 규칙
- 아키텍처 설계 원칙
- 팀 협업 가이드라인

**👨‍💻 대상**: 팀 개발자, 프로젝트 아키텍처를 이해하고 싶은 개발자

## 🎯 읽는 순서 추천

### 초보자 코스
1. **BITCOIN_BACKGROUND.md** ← 필수! 비트코인 기초 이해
2. **GUIDE_LINE.md** ← 프로젝트 구조 파악
3. **CHEAT_SHEET.md** ← 실제 구현

### 경험자 코스
1. **CHEAT_SHEET.md** ← 바로 구현 시작
2. **BITCOIN_BACKGROUND.md** ← 필요시 참고

## 🔧 개발 환경 설정

```bash
# 1. 개발 서비스 시작
cd apps/backend
npm run dev:services

# 2. 환경 변수 설정
cp .env.development.example .env.development

# 3. 데이터베이스 마이그레이션
npm run migration:run

# 4. Elasticsearch 설정
npm run elasticsearch:setup

# 5. 개발 서버 시작
npm run start:dev
```

## 🌟 핵심 개념 요약

| 개념 | 설명 | 관련 문서 |
|------|------|-----------|
| **UTXO** | 비트코인의 핵심 모델, 잔액 계산 방식 | BITCOIN_BACKGROUND.md |
| **Bull Queue** | 블록 동기화 작업 큐, 대용량 데이터 처리 | CHEAT_SHEET.md |
| **ZeroMQ** | 실시간 블록 알림 수신 | BITCOIN_BACKGROUND.md |
| **TypeORM** | 데이터베이스 ORM, 마이그레이션 관리 | CHEAT_SHEET.md |
| **Elasticsearch** | 빠른 검색, 자동완성 | CHEAT_SHEET.md |

## 🤔 자주 묻는 질문

### Q: 왜 height를 Primary Key로 사용하나요?
A: `BITCOIN_BACKGROUND.md`의 "Block 엔티티 설계 배경" 섹션 참고

### Q: UTXO 모델이 뭔가요?
A: `BITCOIN_BACKGROUND.md`의 "UTXO 모델의 핵심" 섹션 참고

### Q: 어떤 라이브러리를 왜 선택했나요?
A: `CHEAT_SHEET.md`의 "라이브러리 선택 이유 상세 설명" 표 참고

### Q: 개발 단계는 어떻게 나누나요?
A: `CHEAT_SHEET.md`의 "개발 단계별 우선순위" 섹션 참고

## 📞 추가 도움

- **이슈**: GitHub Issues에 등록
- **질문**: 프로젝트 Discussions 활용
- **긴급**: 팀 Slack 채널 이용

---

> 💡 **Tip**: 각 문서는 독립적으로 읽을 수 있도록 구성되어 있지만, 전체적인 이해를 위해서는 순서대로 읽는 것을 권장합니다!
