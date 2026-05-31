# Dev Blog 개발 로드맵

> PRD 기준일: 2026-05-31 | 로드맵 생성일: 2026-05-31

## 프로젝트 개요

Notion을 CMS로 활용하여 글 작성 즉시 블로그에 자동 반영되는 개인 기술 블로그입니다.  
별도 배포 없이 Notion에서 발행 상태를 변경하는 것만으로 콘텐츠를 관리합니다.

**개발 원칙: 골격 → 공통 → 개별 기능**

---

## Phase 1: 프로젝트 초기 설정 (1~2일)

**목표**: 이후 모든 개발의 기반이 되는 프로젝트 골격 완성  
**완료 기준**: 로컬에서 `npm run dev` 실행 시 레이아웃이 정상 렌더링되고, Notion API 호출이 성공하는 상태

> 견고한 기반 없이는 이후 기능 개발이 어렵고 나중에 수정 비용이 커집니다.

### 체크리스트

- [ ] Next.js App Router 디렉토리 구조 확정 (`app/`, `components/`, `lib/`, `types/`)
- [ ] Tailwind CSS v4 + shadcn/ui 설정 확인
- [ ] `.env.local` 생성 및 `NOTION_TOKEN`, `NOTION_DATABASE_ID` 설정
- [ ] Notion API 연결 테스트 (단일 쿼리 실행 후 응답 확인)
- [ ] 루트 레이아웃 (`app/layout.tsx`) — `ThemeProvider`, `Header`, `Footer` 골격 배치
- [ ] 경로 별칭 `@/` 동작 확인 (`tsconfig.json`)

---

## Phase 2: 공통 모듈 개발 (2~3일)

**목표**: 모든 페이지에서 재사용되는 API 함수, 타입, 공통 컴포넌트 완성  
**완료 기준**: Notion에서 글 목록을 가져와 콘솔에 출력할 수 있고, 공통 컴포넌트가 독립적으로 렌더링되는 상태

> 공통 모듈을 먼저 만들어야 이후 개별 페이지에서 중복 코드 없이 조립할 수 있습니다.

### 체크리스트

**타입 정의**
- [ ] `types/post.ts` — `Post`, `NotionBlock`, `PostStatus` 타입 정의

**Notion API 공통 함수** (`lib/notion.ts`)
- [ ] `getPosts()` — 발행된 글 전체 목록 조회
- [ ] `getPostsByCategory(category)` — 카테고리별 글 목록 조회
- [ ] `getPostBySlug(slug)` — 슬러그로 단일 글 조회
- [ ] `getPostMarkdown(pageId)` — 글 본문을 Markdown으로 변환
- [ ] `getCategories()` — 카테고리 목록 조회

**공통 레이아웃 컴포넌트**
- [ ] `components/layout/header.tsx` — 로고, 홈/카테고리 네비게이션, 다크모드 토글
- [ ] `components/layout/footer.tsx` — 블로그 소개 한 줄
- [ ] `components/layout/container.tsx` — `max-w-7xl` 중앙 정렬 래퍼

**공통 블로그 컴포넌트**
- [ ] `components/blog/post-card.tsx` — 제목, 카테고리 Badge, 태그, 발행일 표시
- [ ] `components/blog/post-card-skeleton.tsx` — 로딩 중 Skeleton UI

---

## Phase 3: 핵심 기능 개발 (3~4일)

**목표**: 블로그의 핵심 사용자 여정(글 목록 → 글 상세) 완성  
**완료 기준**: Notion에서 발행된 글이 홈 페이지에 표시되고, 글 카드 클릭 시 본문을 읽을 수 있는 상태

> Phase 2의 공통 모듈을 조립하여 실제 동작하는 페이지를 만드는 단계입니다.

### 체크리스트

**홈 페이지** (`app/page.tsx`)
- [ ] `getPosts()` Server Component로 호출 + `revalidate = 60` ISR 설정
- [ ] `app/_components/post-list.tsx` — `PostCard` 목록 렌더링 + 빈 상태 처리
- [ ] 홈 페이지 완성 (PostCard 목록 정상 출력)

**글 상세 페이지** (`app/posts/[slug]/page.tsx`)
- [ ] `getPostBySlug()`, `getPostMarkdown()` 호출 + `revalidate = 60` ISR 설정
- [ ] 슬러그 없을 때 `notFound()` 처리
- [ ] `app/posts/[slug]/_components/post-header.tsx` — 제목, 카테고리, 태그, 발행일
- [ ] `app/posts/[slug]/_components/post-body.tsx` — `react-markdown` + `rehype-highlight` 렌더링
- [ ] `app/posts/[slug]/_components/back-button.tsx` — 홈으로 돌아가기 링크
- [ ] `generateMetadata` — 글 제목을 `<title>`로 설정

---

## Phase 4: 추가 기능 개발 (2~3일)

**목표**: 콘텐츠 탐색 경험 개선 및 검색 기능 추가  
**완료 기준**: 카테고리 탭과 키워드 검색으로 원하는 글을 빠르게 찾을 수 있는 상태

> 핵심 기능이 동작한 뒤 부가 기능을 얹어야 검증이 쉽습니다.

### 체크리스트

**카테고리 탭 + 검색 (홈 페이지 확장)**
- [ ] `app/_components/category-tabs.tsx` — shadcn Tabs 기반, URL 쿼리(`?category=...`) 변경
- [ ] `app/_components/search-input.tsx` — 키워드 검색창, URL 쿼리(`?q=...`) 변경
- [ ] `app/_components/post-list.tsx` — `searchParams`로 카테고리/키워드 필터 적용

**카테고리 전용 페이지** (`app/category/[name]/page.tsx`)
- [ ] `getPostsByCategory()` 호출 + `revalidate = 60` ISR 설정
- [ ] 카테고리명, 글 개수 표시 + `PostCard` 목록
- [ ] `generateStaticParams` — 빌드 시 카테고리별 페이지 사전 생성

**SEO**
- [ ] `app/layout.tsx` — `openGraph`, `twitter` 기본 메타데이터 설정
- [ ] `app/posts/[slug]/page.tsx` — 글별 `openGraph` 메타데이터 설정

---

## Phase 5: 최적화 및 배포 (1~2일)

**목표**: 성능 개선 및 실제 서비스 배포  
**완료 기준**: Vercel에서 ISR이 정상 동작하고 Notion 글이 60초 내 블로그에 반영되는 상태

> 기능이 완성된 후 품질을 높이는 단계입니다. 미리 최적화하면 오히려 개발이 느려집니다.

### 체크리스트

**성능 최적화**
- [ ] `app/posts/[slug]/page.tsx` — `generateStaticParams`로 빌드 시 전체 글 사전 생성
- [ ] 홈·카테고리 페이지 — `Suspense` + Skeleton UI 적용 (초기 로딩 경험 개선)
- [ ] 코드 블록 언어별 하이라이팅 스타일 적용 (`highlight.js` CSS 테마 임포트)

**배포**
- [ ] Vercel 프로젝트 생성 및 `NOTION_TOKEN`, `NOTION_DATABASE_ID` 환경변수 설정
- [ ] Vercel 배포 후 ISR 재검증 동작 확인 (Notion 글 발행 → 60초 내 반영 검증)

---

## 향후 고려 기능 (Phase 5 이후)

핵심 기능이 안정된 후 운영 중 필요성이 확인된 것부터 순차 추가합니다.

| 기능 | 설명 |
|------|------|
| 목차(TOC) 자동 생성 | 글 상세 페이지 사이드바에 heading 기반 목차 |
| 관련 글 추천 | 같은 카테고리/공통 태그 기준 하단 추천 |
| RSS 피드 | `/feed.xml` 라우트로 RSS 2.0 제공 |
| 소셜 공유 버튼 | 트위터/링크드인 공유 링크 |
| 조회수 카운터 | Vercel KV 또는 외부 서비스 연동 |

---

## 기술 결정 사항

| 항목 | 결정 | 이유 |
|------|------|------|
| 카테고리/검색 상태 | URL 쿼리 파라미터 (`searchParams`) | Server Component에서 직접 읽을 수 있어 `useState` 불필요, 공유 가능한 URL |
| Notion 블록 렌더링 | `notion-to-md` → `react-markdown` + `rehype-highlight` | 블록 타입별 커스텀 렌더러 작성 비용 없이 Markdown 경유로 처리 |
| ISR 주기 | 60초 | Notion API 무료 플랜 rate limit 대응 및 실시간성 균형 |
| 슬러그 방식 | Notion 페이지 ID (하이픈 제거) | 별도 slug 컬럼 관리 불필요, 충돌 없음 |
| 타이포그래피 | Tailwind `prose` 클래스 | Markdown 렌더링 결과에 일관된 스타일 적용 |

## 리스크 및 주의사항

- **Notion DB 속성명 불일치**: `lib/notion.ts`의 속성명(`제목`, `카테고리`, `상태` 등)이 실제 Notion DB와 다를 경우 모든 데이터가 기본값으로 반환됩니다. Phase 1에서 실제 DB와 대조 필수
- **`@notionhq/client` API 호출 방식**: 올바른 메서드는 `notion.databases.query`입니다. Phase 1 환경 설정 시 실제 API 호출로 검증 필요
- **`@tailwindcss/typography` 플러그인**: `prose` 클래스 사용을 위해 Phase 3 글 상세 구현 전 설치 필요
