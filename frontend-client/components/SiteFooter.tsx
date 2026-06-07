import Link from "next/link"
import { Send } from "lucide-react"

export function SiteFooter() {
  return (
    <footer className="bg-surface-container py-20">
      <div className="max-w-[1600px] mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-20">
          {/* Logo & Description */}
          <div className="space-y-6">
            <Link href="/" className="flex items-center gap-1.5">
                <span className="font-labels text-lg font-extrabold tracking-tighter text-foreground">
                    ACME
                </span>
                <span className="font-labels text-lg font-extrabold tracking-tighter text-primary">
                    Việt Nam
                </span>
            </Link>
            <p className="text-[13px] font-medium text-foreground/60 leading-relaxed max-w-[240px]">
                Kiến tạo lại thị trường kỹ thuật số với sự tinh tế của biên tập và thiết kế năng động. 
                Tuyển chọn những vật phẩm độc đáo nhất thế giới cho những nhà khám phá hiện đại.
            </p>
          </div>

          {/* Links 1 */}
          <div className="space-y-6">
            <h4 className="text-[11px] font-semibold uppercase tracking-widest text-foreground">Thị trường</h4>
            <ul className="space-y-3">
              {[
                { label: "Về chúng tôi", href: "/about" },
                { label: "Phát triển bền vững", href: "/sustainability" },
                { label: "Tạp chí Biên tập", href: "/journal" },
                { label: "Tiếp thị liên kết", href: "/affiliate" }
              ].map(item => (
                <li key={item.label}>
                  <Link href={item.href} className="text-[13px] font-medium text-foreground/50 hover:text-primary transition-colors">{item.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Links 2 */}
          <div className="space-y-6">
            <h4 className="text-[11px] font-semibold uppercase tracking-widest text-foreground">Hỗ trợ</h4>
            <ul className="space-y-3">
              {[
                { label: "Chính sách vận chuyển", href: "/shipping" },
                { label: "Đổi trả & Hoàn tiền", href: "/returns" },
                { label: "Liên hệ hỗ trợ", href: "/contact" },
                { label: "Trung tâm trợ giúp", href: "/help" }
              ].map(item => (
                <li key={item.label}>
                  <Link href={item.href} className="text-[13px] font-medium text-foreground/50 hover:text-primary transition-colors">{item.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div className="space-y-6">
            <h4 className="text-[11px] font-semibold uppercase tracking-widest text-foreground">Tham gia Bản tin</h4>
            <p className="text-[13px] font-medium text-foreground/50">Nhận những xu hướng mới nhất và các đợt phát hành độc quyền trực tiếp vào hộp thư của bạn.</p>
            <div className="flex items-center gap-0">
                <input 
                    type="email" 
                    placeholder="Địa chỉ Email" 
                    className="flex-1 bg-white/50 border-none outline-none px-5 py-2.5 text-xs font-medium rounded-l-md placeholder:text-foreground/30 focus:bg-white transition-all shadow-none ring-0"
                />
                <button className="bg-primary text-white p-2.5 rounded-r-md hover:brightness-110 transition-all shadow-sm">
                    <Send className="size-4" />
                </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-10 border-t border-foreground/5 flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-[11px] font-medium text-foreground/30">
            © 2024 Sàn thương mại ACME. Bảo lưu mọi quyền.
          </p>
          <div className="flex items-center gap-8">
            <Link href="/privacy" className="text-[11px] font-medium text-foreground/30 hover:text-primary transition-colors">Bảo mật</Link>
            <Link href="/terms" className="text-[11px] font-medium text-foreground/30 hover:text-primary transition-colors">Điều khoản dịch vụ</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
