import FormCardSkeleton from '@/components/form-card-skeleton';
import PageContainer from '@/components/layout/page-container';
import { Suspense } from 'react';
import ProductViewPage from '@/features/products/components/product-view-page';
import CategoryViewPage from '@/features/categories/category-view-page';

export const metadata = {
  title: 'Dashboard : Category View'
};

type PageProps = { params: Promise<{ categoryId: string }> };

export default async function Page(props: PageProps) {
  const params = await props.params;
  return (
    <PageContainer scrollable>
      <div className='flex-1 space-y-4'>
        <Suspense fallback={<FormCardSkeleton />}>
          <CategoryViewPage categoryId={params.categoryId} />
        </Suspense>
      </div>
    </PageContainer>
  );
}
