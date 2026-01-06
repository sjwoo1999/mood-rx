# 💊 Mood Rx (감정 처방전)

> AI 기반 감정 정리 도우미 - 복잡한 감정을 정리하고, 24시간 내 실행할 구체적인 행동을 처방받으세요.

![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-38bdf8?logo=tailwindcss)
![Supabase](https://img.shields.io/badge/Supabase-Database-3ecf8e?logo=supabase)
![Claude AI](https://img.shields.io/badge/Claude-AI-orange?logo=anthropic)

## ✨ 주요 기능

| 기능 | 설명 |
|------|------|
| 🎯 **감정 분석** | 상황과 감정을 입력하면 AI가 핵심 원인을 파악 |
| 💡 **행동 처방** | 24시간 내 실행 가능한 구체적인 행동 제안 |
| 🚫 **금지 문장** | 피해야 할 부정적인 자기대화 패턴 안내 |
| 🛡️ **위기 감지** | 위기 상황 감지 시 전문 기관 안내 |
| 📁 **보관함** | 과거 처방전 저장 및 조회 |
| 🔗 **공유** | 처방전을 이미지로 저장하거나 링크로 공유 |

## 🚀 빠른 시작

### 1. 의존성 설치
```bash
npm install
```

### 2. 환경 변수 설정
```bash
cp .env.local.example .env.local
```

`.env.local` 파일에서 **Mock 모드** 또는 **프로덕션 모드**를 선택하세요:

#### 🧪 Mock 모드 (DB/AI 연결 없이 테스트)
```env
NEXT_PUBLIC_MOCK_MODE=true
```

#### 🏭 프로덕션 모드
```env
NEXT_PUBLIC_MOCK_MODE=false
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
CLAUDE_API_KEY=your-claude-api-key
```

### 3. 개발 서버 실행
```bash
npm run dev
```

http://localhost:3000 에서 확인하세요.

## 📁 프로젝트 구조

```
src/
├── app/                    # Next.js App Router
│   ├── page.tsx           # 랜딩 페이지
│   ├── rx/new/            # 새 처방전 입력
│   ├── rx/result/[id]/    # 처방 결과 페이지
│   ├── vault/             # 보관함
│   ├── share/[token]/     # 공유 페이지
│   ├── login/             # 로그인
│   └── api/               # API 라우트
├── components/
│   ├── layout/            # Header, Footer
│   ├── rx/                # 처방전 관련 컴포넌트
│   ├── vault/             # 보관함 컴포넌트
│   └── mock/              # Mock 모드 UI
├── lib/
│   ├── ai/                # Claude API 연동
│   ├── supabase/          # Supabase 클라이언트
│   ├── safety/            # 위기 감지 시스템
│   ├── rateLimit/         # 사용량 제한
│   └── mock/              # Mock 데이터
└── types/                 # TypeScript 타입
```

## 🛠️ 기술 스택

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: Supabase (PostgreSQL + Auth)
- **AI**: Claude API (Anthropic)
- **Image Generation**: @vercel/og (Satori)
- **Validation**: Zod
- **Testing**: Vitest

## 🔐 보안

- **RLS (Row Level Security)**: 사용자별 데이터 격리
- **위기 감지**: AI 호출 전 위험 키워드 사전 차단
- **Rate Limiting**: 익명 5회/일, 인증 10회/일
- **Service Role Key**: 서버 사이드에서만 사용

## 📋 스크립트

```bash
npm run dev      # 개발 서버
npm run build    # 프로덕션 빌드
npm run start    # 프로덕션 서버
npm run test     # 테스트 실행
npm run lint     # 린트 검사
```

## 🗄️ 데이터베이스 설정 (프로덕션)

Supabase SQL Editor에서 `supabase/schema.sql` 실행:
- `mood_rx` 테이블 생성
- `rate_limits` 테이블 생성
- RLS 정책 설정

## ⚠️ 면책 조항

이 서비스는 **의료 서비스가 아닙니다**. 심각한 정신건강 문제가 있으시면 전문가와 상담하세요.

**위기 상황 연락처:**
- 자살예방상담전화: 1393
- 정신건강위기상담전화: 1577-0199

## 📄 라이선스

MIT License

---

Made with 💙 for emotional wellness
