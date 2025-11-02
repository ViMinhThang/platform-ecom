import CategoryForm from './components/category-form';

type TCategoryViewPageProps = {
  categoryId: string;
};

export default async function ProductViewPage({
  categoryId
}: TCategoryViewPageProps) {
  let category = null;
  let pageTitle = 'Create New Category';

  if (categoryId !== 'new') {
    // const data = await fakeProducts.getProductById(Number(categoryId));
    // category = data.category as Product;
    // if (!category) {
    //   notFound();
    // }
    // pageTitle = `Edit Category`;
  }

  return <CategoryForm initialData={category} pageTitle={pageTitle} />;
}
