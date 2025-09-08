export function capitalizeWords(str: string) {
  return str.replace(/\b\w/g, (char) => char.toUpperCase());
}
export function getProductNameFromPath(pathname: string): string | null {
  const slug = pathname.split("/").pop();
  if (!slug) return null;
  return slug.replace(/-/g, " ");
}
export function getSlugFromProductName(productName: string): string {
  return productName
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-");
}
