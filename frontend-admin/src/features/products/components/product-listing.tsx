import { cookies } from 'next/headers';
import { getServerSession } from 'next-auth/next';
import axios from 'axios';
import { ProductTable } from './product-tables';
import { columns } from './product-tables/columns';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { PaginatedProducts } from '@/types/product';

interface ProductListingPageProps {
  searchParams?: {
    page?: string;
    perPage?: string;
    name?: string;
    category?: string;
  };
}

export default async function ProductListingPage({ searchParams }: ProductListingPageProps) {
  const session = await getServerSession(authOptions);

  if (!session?.accessToken) {
    return <div>You must be signed in to view products.</div>;
  }

  const page = searchParams?.page ?? '0';
  const perPage = searchParams?.perPage ?? '10';
  const name = searchParams?.name;
  const category = searchParams?.category;

  let paginatedProducts: PaginatedProducts = {
    content: [],
    pageNumber: 0,
    pageSize: 10,
    totalElements: 0,
    totalPages: 0,
    lastPage: true,
  };

  try {
    const res = await axios.get<PaginatedProducts>(
      'http://localhost:8080/api/products/seller',
      {
        headers: {
          Authorization: `Bearer ${session.accessToken}`,
        },
        params: {
          page,
          perPage,
          ...(name && { name }),
          ...(category && { category }),
        },
      }
    );
    console.log('Fetched products:', res.data);
    paginatedProducts = res.data;
  } catch (err) {
    console.error('Failed to fetch products', err);
  }

  return <ProductTable data={paginatedProducts.content} totalItems={paginatedProducts.totalElements} columns={columns} />;
}
