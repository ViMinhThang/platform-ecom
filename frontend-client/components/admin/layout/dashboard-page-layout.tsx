import PageContainer from '@/components/admin/layout/page-container';
import { Breadcrumbs } from '@/components/admin/breadcrumbs';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { ReactNode } from 'react';

interface DashboardPageLayoutProps {
    /**
     * The title displayed in the page heading
     */
    title: string;

    /**
     * The description displayed below the title
     */
    description: string;

    /**
     * Optional action button or component displayed on the right side of the heading
     */
    action?: ReactNode;

    /**
     * The main content of the page
     */
    children: ReactNode;

    /**
     * Whether the page container should be scrollable (default: true)
     */
    scrollable?: boolean;

    /**
     * Whether to show breadcrumbs (default: true)
     */
    showBreadcrumbs?: boolean;

    /**
     * Additional content to render between the separator and main children
     * Useful for filters, stats, or other intermediate content
     */
    beforeContent?: ReactNode;
}

/**
 * A standardized layout component for dashboard pages.
 * Provides consistent structure with breadcrumbs, heading, separator, and content area.
 * 
 * @example
 * ```tsx
 * <DashboardPageLayout
 *   title="Sản phẩm"
 *   description="Quản lý danh mục sản phẩm"
 *   action={<CreateProductButton />}
 * >
 *   <ProductTable {...tableProps} />
 * </DashboardPageLayout>
 * ```
 */
export function DashboardPageLayout({
    title,
    description,
    action,
    children,
    scrollable = true,
    showBreadcrumbs = true,
    beforeContent,
}: DashboardPageLayoutProps) {
    return (
        <PageContainer scrollable={scrollable}>
            <div className="flex flex-1 flex-col gap-y-4">
                {showBreadcrumbs && <Breadcrumbs />}

                <div className="flex items-start justify-between">
                    <Heading title={title} description={description} />
                    {action}
                </div>

                <Separator />

                {beforeContent}

                {children}
            </div>
        </PageContainer>
    );
}
