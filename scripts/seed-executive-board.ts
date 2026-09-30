import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../lib/generated/prisma/client';
import { executiveBoardMembers } from '../lib/executive-board-data';

const connectionString = process.env.DATABASE_URL;
if (!connectionString) throw new Error('DATABASE_URL is required to seed executive board profiles.');

const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString }) });

async function main() {
  const result = await prisma.executiveBoardMember.createMany({
    data: executiveBoardMembers.map((member, index) => ({
      slug: member.slug,
      name: member.name,
      sourceProfileName: member.sourceProfileName ?? null,
      role: member.role ?? null,
      ministry: member.ministry,
      country: member.country,
      imageUrl: member.imageUrl,
      phone: member.phone ?? null,
      fax: member.fax ?? null,
      websiteUrl: member.websiteUrl,
      vCardUrl: member.vCardUrl,
      sourceNote: member.sourceNote ?? null,
      sortOrder: (index + 1) * 10,
      isActive: true,
    })),
    skipDuplicates: true,
  });
  console.log(`Inserted ${result.count} profiles; existing dashboard edits were preserved.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => prisma.$disconnect());
