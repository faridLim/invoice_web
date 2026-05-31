import Link from "next/link"
import { BookOpen } from "lucide-react"
import { Container } from "@/components/layout/container"
import { ThemeToggle, MobileMenu } from "@/components/layout/header-actions"
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"

const navLinks = [
  { href: "/", label: "홈" },
  { href: "/category/all", label: "카테고리" },
]

/** 모든 페이지 상단에 공통으로 표시되는 헤더 */
export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <Container>
        <div className="flex h-16 items-center justify-between">
          {/* 블로그 로고 */}
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <BookOpen className="size-5" />
            <span>Dev Blog</span>
          </Link>

          {/* 데스크탑 네비게이션 */}
          <NavigationMenu className="hidden md:flex">
            <NavigationMenuList>
              {navLinks.map((link) => (
                <NavigationMenuItem key={link.href}>
                  <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                    <Link href={link.href}>{link.label}</Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>

          {/* 우측 액션 버튼 */}
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <MobileMenu />
          </div>
        </div>
      </Container>
    </header>
  )
}
