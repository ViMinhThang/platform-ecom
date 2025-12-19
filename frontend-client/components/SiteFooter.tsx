import Link from "next/link"
import { Separator } from "@/components/ui/separator"

export function SiteFooter() {
  return (
    <footer className="bg-zinc-50 dark:bg-zinc-900 border-t">
      <div className="container mx-auto py-12 md:py-16 px-4 md:px-6">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-foreground">Giới thiệu</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/about" className="hover:text-primary transition-colors">Về chúng tôi</Link>
              </li>
              <li>
                <Link href="/careers" className="hover:text-primary transition-colors">Tuyển dụng</Link>
              </li>
              <li>
                <Link href="/news" className="hover:text-primary transition-colors">Tin tức</Link>
              </li>
            </ul>
          </div>
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-foreground">Chăm sóc khách hàng</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/help" className="hover:text-primary transition-colors">Trung tâm trợ giúp</Link>
              </li>
              <li>
                <Link href="/returns" className="hover:text-primary transition-colors">Đổi trả & Hoàn tiền</Link>
              </li>
              <li>
                <Link href="/shipping" className="hover:text-primary transition-colors">Vận chuyển</Link>
              </li>
            </ul>
          </div>
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-foreground">Pháp lý</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/privacy" className="hover:text-primary transition-colors">Chính sách bảo mật</Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-primary transition-colors">Điều khoản dịch vụ</Link>
              </li>
            </ul>
          </div>
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-foreground">Kết nối</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="#" className="hover:text-primary transition-colors">Facebook</Link>
              </li>
              <li>
                <Link href="#" className="hover:text-primary transition-colors">Instagram</Link>
              </li>
              <li>
                <Link href="#" className="hover:text-primary transition-colors">Twitter</Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} ACME Store. Bảo lưu mọi quyền.</p>
        </div>
      </div>
    </footer>
  )
}
