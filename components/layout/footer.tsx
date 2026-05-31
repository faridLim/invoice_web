import { Container } from "@/components/layout/container"

/** 모든 페이지 하단에 공통으로 표시되는 푸터 */
export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t py-8">
      <Container>
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <p className="text-sm text-muted-foreground">
            © {currentYear} Dev Blog. Notion으로 작성하고 자동으로 발행되는 개인 기술 블로그입니다.
          </p>
        </div>
      </Container>
    </footer>
  )
}
