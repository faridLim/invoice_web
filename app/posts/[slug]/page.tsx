import { Container } from "@/components/layout/container"

interface PostPageProps {
  params: Promise<{ slug: string }>
}

/** Notion 글 상세 페이지 */
export default async function PostPage({ params }: PostPageProps) {
  const { slug } = await params

  return (
    <Container>
      <article className="py-16">
        <p className="text-muted-foreground">글 준비 중: {slug}</p>
      </article>
    </Container>
  )
}
