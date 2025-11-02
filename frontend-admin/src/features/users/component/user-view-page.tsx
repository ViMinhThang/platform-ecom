import UserForm from './user-form';

type TUserViewPageProps = {
  userId: string;
};

export default async function UserViewPage({
  userId
}: TUserViewPageProps) {
  let user = null;
  let pageTitle = 'Create New User';

  if (userId !== 'new') {
    // const data = await fakeProducts.getProductById(Number(categoryId));
    // category = data.category as Product;
    // if (!category) {
    //   notFound();
    // }
    // pageTitle = `Edit Category`;
  }

  return <UserForm initialData={user} pageTitle={pageTitle} />;
}
