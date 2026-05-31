# Dev Blog

Notion을 CMS로 활용하여 글 작성 즉시 블로그에 자동 반영되는 개인 기술 블로그입니다.

## 프로젝트 개요

**목적**: Notion API로 글 작성 즉시 블로그에 자동 반영
**사용자**: Notion으로 기술 글을 작성하고 별도 배포 없이 블로그를 운영하려는 개인 개발자

## 주요 페이지

1. **홈 (`/`)** — 발행된 글 목록 (최신순), 카테고리 탭 필터, 키워드 검색
2. **글 상세 (`/posts/[slug]`)** — Notion 블록 렌더링, 제목/카테고리/태그/발행일 표시
3. **카테고리 (`/category/[name]`)** — 해당 카테고리 글 목록

## 핵심 기능

- Notion API에서 발행 상태 글만 필터링하여 목록 표시
- 카테고리 탭 UI 필터링
- 제목/태그 키워드 검색
- Notion 페이지 블록을 Markdown으로 변환하여 렌더링
- ISR 캐싱으로 Notion API 요청 최소화

## 기술 스택

- **Framework**: Next.js 16 (App Router)
- **Runtime**: React 19
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn/ui (radix-nova style)
- **Icons**: Lucide React
- **Notion 연동**: @notionhq/client, notion-to-md
- **Markdown 렌더링**: react-markdown, rehype-highlight

## 시작하기

### 1. 의존성 설치

```bash
npm install
```

### 2. 환경변수 설정

```bash
cp .env.local.example .env.local
```

`.env.local` 파일을 열고 Notion Integration 토큰과 데이터베이스 ID를 입력합니다:

```
NOTION_TOKEN=your_notion_integration_token
NOTION_DATABASE_ID=your_notion_database_id
```

### 3. 개발 서버 실행

```bash
npm run dev
```

http://localhost:3000 에서 확인합니다.

### 4. 빌드

```bash
npm run build
```

## 개발 상태

- 기본 프로젝트 구조 설정 완료
- Notion 패키지 설치 완료
- 라우트 구조 생성 완료 (`/`, `/posts/[slug]`, `/category/[name]`)
- Notion API 연동 구현 예정
- 홈 페이지 글 목록/검색/필터 UI 구현 예정
- 글 상세 페이지 Notion 블록 렌더링 구현 예정

## 문서

- [PRD 문서](./docs/PRD.md) — 상세 요구사항
- [개발 가이드](./CLAUDE.md) — 개발 지침
