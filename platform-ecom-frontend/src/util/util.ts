export function capitalizeWords(str: string) {
  return str.replace(/\b\w/g, (char) => char.toUpperCase());
}
export function getProductNameFromPath(pathname: string): string | null {
  const lastSegment = pathname.split("/").pop();
  if (!lastSegment) return null;

  const slug = lastSegment
    .toLowerCase()
    .replace(/\./g, "-") 
    .replace(/\s+/g, "-");

  return slug;
}
export function getSlugFromProductName(productName: string): string {
  return productName.trim().toLowerCase().replace(/\s+/g, "-");
}
