import { Client } from "@notionhq/client"
import { NotionToMarkdown } from "notion-to-md"
import type { PageObjectResponse } from "@notionhq/client"
import type { Post } from "@/types/post"

/** Notion 공식 SDK 클라이언트 (v5) */
const notion = new Client({
  auth: process.env.NOTION_TOKEN,
})

/** Notion 블록 → Markdown 변환기 */
const n2m = new NotionToMarkdown({ notionClient: notion })

/**
 * Notion 페이지 객체를 Post 타입으로 변환
 * @param page Notion API 응답 페이지 객체
 * @returns Post 타입 객체
 */
function mapPageToPost(page: PageObjectResponse): Post {
  const props = page.properties

  const titleProp = props["제목"] ?? props["Name"] ?? props["title"]
  const title =
    titleProp?.type === "title"
      ? (titleProp.title[0]?.plain_text ?? "제목 없음")
      : "제목 없음"

  const categoryProp = props["카테고리"] ?? props["Category"]
  const category =
    categoryProp?.type === "select"
      ? (categoryProp.select?.name ?? "미분류")
      : "미분류"

  const tagsProp = props["태그"] ?? props["Tags"]
  const tags =
    tagsProp?.type === "multi_select"
      ? tagsProp.multi_select.map((t: { name: string }) => t.name)
      : []

  const dateProp = props["발행일"] ?? props["Published"] ?? props["Date"]
  const publishedAt =
    dateProp?.type === "date" && dateProp.date?.start
      ? new Date(dateProp.date.start)
      : new Date(page.created_time)

  const statusProp = props["상태"] ?? props["Status"]
  const status =
    statusProp?.type === "select" &&
    (statusProp.select?.name === "발행됨" || statusProp.select?.name === "Published")
      ? ("published" as const)
      : ("draft" as const)

  return {
    id: page.id,
    title,
    category,
    tags,
    publishedAt,
    status,
    /** slug: 페이지 ID에서 하이픈 제거 */
    slug: page.id.replace(/-/g, ""),
  }
}

/**
 * Notion 데이터베이스에서 발행된 글 목록을 최신순으로 조회
 * ISR revalidate 60초 적용
 */
export async function getPosts(): Promise<Post[]> {
  const dataSourceId = process.env.NOTION_DATABASE_ID

  if (!dataSourceId) {
    console.warn("NOTION_DATABASE_ID 환경변수가 설정되지 않았습니다.")
    return []
  }

  const response = await notion.dataSources.query({
    data_source_id: dataSourceId,
    filter: {
      or: [
        { property: "상태", select: { equals: "발행됨" }, type: "select" },
        { property: "Status", select: { equals: "Published" }, type: "select" },
      ],
    },
    sorts: [{ property: "발행일", direction: "descending" }],
  })

  return (response.results as PageObjectResponse[]).map(mapPageToPost)
}

/**
 * 특정 카테고리의 발행된 글 목록 조회
 * @param categoryName 카테고리명
 */
export async function getPostsByCategory(categoryName: string): Promise<Post[]> {
  const dataSourceId = process.env.NOTION_DATABASE_ID

  if (!dataSourceId) {
    console.warn("NOTION_DATABASE_ID 환경변수가 설정되지 않았습니다.")
    return []
  }

  const response = await notion.dataSources.query({
    data_source_id: dataSourceId,
    filter: {
      and: [
        {
          or: [
            { property: "상태", select: { equals: "발행됨" }, type: "select" },
            { property: "Status", select: { equals: "Published" }, type: "select" },
          ],
        },
        {
          or: [
            { property: "카테고리", select: { equals: categoryName }, type: "select" },
            { property: "Category", select: { equals: categoryName }, type: "select" },
          ],
        },
      ],
    },
    sorts: [{ property: "발행일", direction: "descending" }],
  })

  return (response.results as PageObjectResponse[]).map(mapPageToPost)
}

/**
 * 슬러그(Notion 페이지 ID 하이픈 제거본)로 단일 글 조회
 * @param slug Notion 페이지 ID (하이픈 제거 형태)
 * @returns Post 또는 null
 */
export async function getPostBySlug(slug: string): Promise<Post | null> {
  try {
    /** slug → UUID 형태(8-4-4-4-12)로 복원 */
    const pageId = slug.replace(
      /^(.{8})(.{4})(.{4})(.{4})(.{12})$/,
      "$1-$2-$3-$4-$5"
    )
    const page = await notion.pages.retrieve({ page_id: pageId })
    return mapPageToPost(page as PageObjectResponse)
  } catch {
    return null
  }
}

/**
 * 특정 Notion 페이지의 본문을 Markdown 문자열로 반환
 * @param pageId Notion 페이지 ID
 * @returns Markdown 문자열
 */
export async function getPostMarkdown(pageId: string): Promise<string> {
  const mdBlocks = await n2m.pageToMarkdown(pageId)
  const mdString = n2m.toMarkdownString(mdBlocks)
  return mdString.parent
}

/**
 * 발행된 글의 카테고리 목록 조회 (중복 제거, 가나다순 정렬)
 */
export async function getCategories(): Promise<string[]> {
  const posts = await getPosts()
  const categories = [...new Set(posts.map((p) => p.category).filter(Boolean))]
  return categories.sort()
}
