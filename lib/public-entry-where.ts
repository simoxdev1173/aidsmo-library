import type { Prisma } from "@/lib/generated/prisma/client";

// Dashboard books are public regardless of their workflow status. Other
// entry types still use the Published status to control public visibility.
export const publicEntryWhere: Prisma.LibraryEntryWhereInput = {
  OR: [{ entryType: "BOOK" }, { status: "PUBLISHED" }],
};
