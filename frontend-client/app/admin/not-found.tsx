'use client';

import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';

export default function NotFound() {
  const { push, back } = useRouter();

  return (
    <div className='absolute top-1/2 left-1/2 mb-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center text-center'>
      <span className='from-foreground bg-linear-to-b to-transparent bg-clip-text text-[10rem] leading-none font-extrabold text-transparent'>
        404
      </span>
      <h2 className='font-heading my-2 text-2xl font-semibold'>
        Không tìm thấy trang
      </h2>
      <p>
        Trang bạn đang tìm không tồn tại hoặc đã được di chuyển.
      </p>
      <div className='mt-8 flex justify-center gap-2'>
        <Button onClick={() => back()} variant='default' size='lg'>
          Quay lại
        </Button>
        <Button
          onClick={() => push('/admin/dashboard')}
          variant='ghost'
          size='lg'
        >
          Về trang chủ
        </Button>
      </div>
    </div>
  );
}
