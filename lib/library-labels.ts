export function statusLabel(status: string) {
  if (status === "PUBLISHED") return "منشور";
  if (status === "ARCHIVED") return "مؤرشف";
  return "مسودة";
}

export function categoryPath(category: { name: string; parent?: { name: string; parent?: { name: string } | null } | null }) {
  const names = [category.parent?.parent?.name, category.parent?.name, category.name].filter(Boolean);
  return names.join(" / ");
}
