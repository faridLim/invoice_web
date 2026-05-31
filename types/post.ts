/**
 * Notion 데이터베이스 페이지를 블로그 Post로 매핑하는 타입 정의
 */

/** 글 발행 상태 */
export type PostStatus = "draft" | "published"

/** Notion 페이지를 매핑한 블로그 글 타입 */
export interface Post {
  /** Notion 페이지 ID (UUID) */
  id: string
  /** 글 제목 */
  title: string
  /** 카테고리 (단일 선택) */
  category: string
  /** 태그 목록 */
  tags: string[]
  /** 발행일 */
  publishedAt: Date
  /** 초안 / 발행됨 */
  status: PostStatus
  /** URL용 식별자 (Notion 페이지 ID 기반) */
  slug: string
}

/** Notion 본문 블록 타입 */
export interface NotionBlock {
  /** 블록 ID */
  id: string
  /** 블록 종류 (paragraph, heading_1, heading_2, bulleted_list_item 등) */
  type: string
  /** 텍스트 또는 하위 블록 내용 */
  content: object
  /** 부모 블록 ID */
  parentId: string | null
}
