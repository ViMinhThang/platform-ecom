'use client';

import { Button } from '@/components/ui/button';

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center h-[60vh] space-y-4">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-destructive">Đã xảy ra lỗi</h2>
        <p className="text-muted-foreground mt-2">
          {error.message || 'Không thể tải trang. Vui lòng thử lại.'}
        </p>
      </div>
      <Button onClick={reset}>Thử lại</Button>
    </div>
  );
}
