# CLAUDE.md

**Dev Blog**는 Notion을 CMS로 활용하여 글 작성 즉시 블로그에 자동 반영되는 개인 기술 블로그입니다.

상세 요구사항은 
- PRD 문서: @docs/PRD.md
- 개발 로드맵: @docs/ROADMAP.md 참조

@AGENTS.md

## 명령어

```bash
npm run dev      # 개발 서버 시작 (http://localhost:3000)
npm run build    # 프로덕션 빌드
npm run lint     # ESLint 검사
```

테스트 설정은 없습니다.

## 아키텍처

Next.js 16 App Router 기반 개인 기술 블로그입니다. **`node_modules/next/dist/docs/`** 에 이 버전의 공식 문서가 있으며, API나 컨벤션 작성 전 반드시 참조해야 합니다.

### 레이아웃 계층

- `app/layout.tsx` — 루트 레이아웃. `ThemeProvider`, `Header`, `Footer`, `Toaster`를 전역 래핑

### 라우트 구조

| 경로 | 설명 |
|------|------|
| `/` | 홈 (발행된 글 목록, 카테고리 탭 필터, 키워드 검색) |
| `/posts/[slug]` | 글 상세 페이지 (Notion 블록 렌더링) |
| `/category/[name]` | 카테고리별 글 목록 |

페이지 전용 컴포넌트는 해당 라우트 폴더 내 `_components/`에 위치합니다.

### Notion 연동

- `@notionhq/client` — 공식 Notion SDK (글 목록, 블록 조회)
- `notion-to-md` — Notion 블록을 Markdown으로 변환
- `react-markdown` + `rehype-highlight` — Markdown 렌더링 및 코드 하이라이팅
- 환경변수: `NOTION_TOKEN`, `NOTION_DATABASE_ID` (`.env.local.example` 참조)

### UI 컴포넌트

shadcn/ui(style: `radix-nova`) 기반이며, 컴포넌트는 `components/ui/`에 위치합니다. 새 컴포넌트 추가 시:

```bash
npx shadcn add <component-name>
```

### 경로 별칭

`@/`는 프로젝트 루트를 가리킵니다 (`tsconfig.json`의 `paths` 설정).

### 핵심 유틸리티

- `lib/utils.ts` — `cn()` 함수: `clsx` + `tailwind-merge` 조합으로 Tailwind 클래스 병합
- `components/layout/container.tsx` — `max-w-7xl` 중앙 정렬 래퍼, 모든 페이지 콘텐츠에 사용
- `components/providers/theme-provider.tsx` — `next-themes` 기반 다크모드
