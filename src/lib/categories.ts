import { Category } from "@prisma/client";

export function getCategoryName(
  category: Category,
  categories: Category[]
): string {
  if (!category.parentId) {
    return category.name;
  }

  const parent = categories.find((c) => c.id === category.parentId);
  if (!parent) {
    return category.name;
  }

  return `${getCategoryName(parent, categories)} > ${category.name}`;
}

export function sortCategory(a: Category, b: Category, categories: Category[]) {
  const aName = getCategoryName(a, categories);
  const bName = getCategoryName(b, categories);

  return aName.localeCompare(bName);
}
