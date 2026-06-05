import { prisma } from "@/lib/prisma";
import { createPdfCoverFromPublicPath } from "@/lib/pdf-cover";
import { resolvePublicUploadFilePath } from "@/lib/uploads";

async function main() {
  const entries = await prisma.libraryEntry.findMany({
    where: {
      coverImagePath: null,
      filePath: { not: null },
    },
    select: {
      id: true,
      title: true,
      filePath: true,
    },
    orderBy: { updatedAt: "desc" },
  });

  let generated = 0;
  let skipped = 0;

  for (const entry of entries) {
    const absolutePdfPath = await resolvePublicUploadFilePath(entry.filePath);

    if (!absolutePdfPath) {
      skipped += 1;
      console.log(`Skipped missing PDF: ${entry.title}`);
      continue;
    }

    try {
      const coverImagePath = await createPdfCoverFromPublicPath(entry.filePath);

      if (!coverImagePath) {
        skipped += 1;
        console.log(`Skipped unsupported path: ${entry.title}`);
        continue;
      }

      await prisma.libraryEntry.update({
        where: { id: entry.id },
        data: { coverImagePath },
      });

      generated += 1;
      console.log(`Generated cover: ${entry.title} -> ${coverImagePath}`);
    } catch (error) {
      skipped += 1;
      const message = error instanceof Error ? error.message : "unknown error";
      console.log(`Failed cover generation: ${entry.title} (${message})`);
    }
  }

  console.log(`Done. Generated ${generated} cover(s), skipped ${skipped}.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
