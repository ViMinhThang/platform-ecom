import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function Newsletter() {
  return (
    <section className="container py-24">
      <div className="rounded-3xl bg-zinc-900 px-6 py-16 sm:px-12 sm:py-24 lg:px-16">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            Luôn cập nhật
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-zinc-300">
            Đăng ký bản tin để nhận ưu đãi độc quyền, hàng mới về và gợi ý phong cách.
          </p>
          <div className="mt-10 flex max-w-md mx-auto gap-x-4">
            <Input
              type="email"
              placeholder="Nhập email của bạn"
              className="bg-white/10 border-white/20 text-white placeholder:text-zinc-400 focus-visible:ring-white/30"
            />
            <Button className="bg-white text-black hover:bg-zinc-200">
              Đăng ký
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
