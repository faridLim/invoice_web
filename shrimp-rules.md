# Development Guidelines

## Project Overview

- **목적**: Notion을 CMS로 사용하는 개인 기술 블로그 (글 작성 즉시 자동 반영)
- **스택**: Next.js 16 (App Router), TypeScript 5.6+, React 19, Tailwind CSS v4, shadcn/ui (radix-nova), Notion SDK

## Project Architecture

```
app/
  layout.tsx              # 루트 레이아웃 (ThemeProvider, Header, Footer, Toaster)
  page.tsx                # 홈 (글 목록, 카테고리 탭, 키워드 검색)
  posts/[slug]/
    page.tsx              # 글 상세 (Notion 블록 렌더링)
    _components/          # 글 상세 전용 컴포넌트
  category/[name]/
    page.tsx              # 카테고리별 글 목록
    _components/          # 카테고리 페이지 전용 컴포넌트
components/
  layout/                 # Header, Footer, Container 등 레이아웃 공유 컴포넌트
  providers/              # ThemeProvider 등 전역 Provider
  ui/                     # shadcn/ui 컴포넌트 (npx shadcn add로만 추가)
lib/
  notion.ts               # Notion API 호출 함수 모음
  utils.ts                # cn() 유틸리티 함수
types/                    # TypeScript 타입 정의
```

## Code Standards

### 명명 규칙
- 변수·함수: `camelCase`
- 컴포넌트·클래스·인터페이스: `PascalCase`
- 상수: `UPPER_SNAKE_CASE`
- 파일: 컴포넌트는 `PascalCase.tsx`, 유틸/훅은 `camelCase.ts`

### 포맷
- 경로 별칭 `@/`를 항상 사용 (상대 경로 `../../` 금지)
- Tailwind 클래스 병합 시 반드시 `cn()` 함수 사용 (`@/lib/utils`)
- 인라인 스타일(`style={{}}`) 사용 금지 — Tailwind 클래스로 대체

## Functionality Implementation Standards

### 새 라우트 추가
1. `app/<route>/page.tsx` 생성
2. 해당 라우트 전용 컴포넌트는 `app/<route>/_components/` 안에 생성
3. 여러 라우트에서 공유되는 컴포넌트는 `components/` 하위에 생성

### Notion 데이터 패칭
- Notion API 호출은 반드시 `lib/notion.ts` 함수를 통해서만 수행
- 직접 `@notionhq/client`를 페이지/컴포넌트에서 import 금지
- ISR 캐싱: Notion 데이터를 패칭하는 모든 페이지에 `export const revalidate = 60` 적용

### Markdown 렌더링
- Notion 블록 → Markdown 변환: `notion-to-md`
- Markdown → HTML 렌더링: `react-markdown` + `rehype-highlight`
- 코드 하이라이팅 커스텀이 필요하면 `rehype-highlight` 옵션으로 처리

### UI 컴포넌트 추가
- shadcn/ui 컴포넌트 추가 시 반드시 `npx shadcn add <component-name>` 명령 사용
- 직접 `components/ui/`에 파일을 수동으로 생성하지 않음

## Framework/Library Usage Standards

### Next.js 16
- **⚠️ 중요**: Next.js API와 컨벤션 작성 전 반드시 `node_modules/next/dist/docs/` 참조
- 학습 데이터와 실제 API가 다를 수 있음 — 추측 금지, 문서 확인 필수
- App Router 방식 사용 (Pages Router 패턴 혼용 금지)
- Server Component 기본, Client Component 필요 시 `"use client"` 명시

### 환경변수
- Notion 연동 필수 환경변수: `NOTION_TOKEN`, `NOTION_DATABASE_ID`
- 환경변수는 `.env.local`에서 관리 (`.env.local.example` 참조)
- 환경변수를 하드코딩하거나 소스에 노출 금지

## Key File Interaction Standards

| 작업 | 수정해야 할 파일 |
|------|----------------|
| Notion API 로직 변경 | `lib/notion.ts` |
| 전역 레이아웃 변경 (헤더/푸터/테마) | `app/layout.tsx`, `components/layout/` |
| 새 타입 정의 추가 | `types/` 하위 파일 |
| 새 라우트 추가 | `app/<route>/page.tsx` + `app/<route>/_components/` |
| shadcn/ui 컴포넌트 추가 | `npx shadcn add` 명령 실행 후 `components/ui/` 자동 생성 |
| 전역 스타일 변경 | `app/globals.css` |

## AI Decision-making Standards

### 컴포넌트 위치 결정
```
컴포넌트가 특정 라우트에서만 사용되는가?
  YES → app/<route>/_components/ 에 생성
  NO  → components/ 하위 적절한 폴더에 생성
```

### 데이터 패칭 방식 결정
```
Notion 데이터가 필요한가?
  YES → lib/notion.ts에 함수 추가 또는 기존 함수 사용
      → 페이지에서 async Server Component로 호출
      → revalidate = 60 설정
  NO  → 일반 컴포넌트 로직으로 처리
```

### Next.js API 사용 전
```
사용하려는 Next.js API/컨벤션이 있는가?
  → 반드시 node_modules/next/dist/docs/ 에서 해당 API 문서 확인 후 작성
  → 훈련 데이터 기반 추측 금지
```

## Prohibited Actions

- `node_modules/next/dist/docs/` 확인 없이 Next.js API 작성
- 인라인 스타일(`style={{}}`) 사용
- `@notionhq/client`를 페이지/컴포넌트에서 직접 import
- `components/ui/`에 shadcn 컴포넌트를 수동으로 생성 (반드시 `npx shadcn add` 사용)
- Notion 데이터 패칭 페이지에 `revalidate` 누락
- 환경변수(`NOTION_TOKEN` 등) 소스 코드에 하드코딩
- 상대 경로(`../../`) 사용 (`@/` 별칭 사용)
- Pages Router 패턴(`getServerSideProps`, `getStaticProps`) 혼용
- `cn()` 없이 Tailwind 클래스 문자열 직접 연결
