'use client';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { IconAlertCircle } from '@tabler/icons-react';

export default function OverviewError({ error }: { error: Error }) {
  return (
    <Alert variant='destructive'>
      <IconAlertCircle className='size-4' />
      <AlertTitle>Lỗi</AlertTitle>
      <AlertDescription>
        Không thể tải số liệu thống kê: {error.message}
      </AlertDescription>
    </Alert>
  );
}
