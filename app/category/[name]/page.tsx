import { Container } from "@/components/layout/container"

interface CategoryPageProps {
  params: Promise<{ name: string }>
}

/** 카테고리별 글 목록 페이지 */
export default async function CategoryPage({ params }: CategoryPageProps) {
  const { name } = await params

  return (
    <Container>
      <section className="py-16">
        <h1 className="text-3xl font-bold">{decodeURIComponent(name)}</h1>
        <p className="mt-4 text-muted-foreground">카테고리 글 목록 준비 중</p>
      </section>
    </Container>
  )
}
