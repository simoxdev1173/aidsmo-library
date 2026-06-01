import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../lib/generated/prisma/client";
import { hashPassword } from "../lib/password";

const adapter = new PrismaPg({
  connectionString:
    process.env.DATABASE_URL ?? "postgresql://invalid:invalid@localhost:5432/invalid",
});

const prisma = new PrismaClient({ adapter });

const initialDescription =
  "يهدف النظام الاسترشادي التعديني للدول العربية إلى توفير إطار مرجعي موحّد يساعد الحكومات على تطوير تشريعات حديثة ومتناغمة لقطاع التعدين، بما يعزز الشفافية والاستثمار المسؤول. انطلق إعداد النظام من دراسة استقصائية شاملة للأنظمة القائمة وتحليل فجواتها، إضافة إلى مقارنة دولية لبناء رؤية عربية مشتركة. ويتناول النظام مراحل النشاط التعديني من الاستطلاع إلى الاستغلال، ويحدّد الحقوق والالتزامات، وآليات منح التراخيص، والضوابط البيئية والاقتصادية والاجتماعية، مع التركيز على حماية الموارد والبيئة وحقوق المجتمعات. ويوفر إطاراً قانونياً مرناً يعزز التكامل الإقليمي، ويرفع جاذبية القطاع للاستثمار، ويسهم في تنمية اقتصادات الدول العربية بشكل مستدام.";

const categories = [
  { name: "الصناعة", slug: "industry", order: 10, navHref: "/industry/advisory-committee" },
  { name: "التقييس", slug: "standardization", order: 20, navHref: "/standardization/studies" },
  { name: "التعدين", slug: "mining", order: 30, navHref: "/catalog/mining" },
  { name: "المعلومات الصناعية", slug: "industrial-info", order: 40, navHref: "/info/statistics" },
  { name: "التدريب والاستشارات", slug: "training", order: 50, navHref: "/training/about" },
  { name: "الأرشيف", slug: "archive", order: 60, navHref: "/archive/org/founding" },
];

const children = [
  { parentSlug: "industry", name: "الدراسات والأدلة", slug: "industry-studies", order: 11, navHref: "/industry/studies" },
  { parentSlug: "standardization", name: "دراسات", slug: "standardization-studies", order: 21, navHref: "/standardization/studies" },
  { parentSlug: "standardization", name: "معاجم", slug: "standardization-glossaries", order: 22, navHref: "/standardization/glossaries" },
  { parentSlug: "standardization", name: "أدلة", slug: "standardization-guides", order: 23, navHref: "/standardization/guides" },
  { parentSlug: "mining", name: "جيولوجيا", slug: "geology", order: 31, navHref: "/catalog/geology" },
  { parentSlug: "geology", name: "الصناعة التعدينية", slug: "mining-industry", order: 32, navHref: "/catalog/mining-industry" },
  { parentSlug: "industrial-info", name: "الإصدارات", slug: "publications", order: 41, navHref: "/info/publications" },
  { parentSlug: "industrial-info", name: "مجلة التنمية الصناعية", slug: "industrial-development-magazine", order: 42, navHref: "/info/magazine" },
];

async function seedAdmin() {
  const email = (process.env.ADMIN_EMAIL ?? "admin@aidsmo.local").trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD ?? "ChangeMe123!";
  const passwordHash = hashPassword(password);

  await prisma.adminUser.upsert({
    where: { email },
    update: { name: "AIDSMO Admin", passwordHash },
    create: {
      email,
      name: "AIDSMO Admin",
      passwordHash,
    },
  });
}

async function seedCategories() {
  for (const category of categories) {
    await prisma.category.upsert({
      where: { slug: category.slug },
      update: category,
      create: category,
    });
  }

  for (const child of children) {
    const parent = await prisma.category.findUniqueOrThrow({
      where: { slug: child.parentSlug },
      select: { id: true },
    });

    await prisma.category.upsert({
      where: { slug: child.slug },
      update: {
        name: child.name,
        order: child.order,
        navHref: child.navHref,
        parentId: parent.id,
      },
      create: {
        name: child.name,
        slug: child.slug,
        order: child.order,
        navHref: child.navHref,
        parentId: parent.id,
      },
    });
  }
}

async function seedEntries() {
  const category = await prisma.category.findUniqueOrThrow({
    where: { slug: "mining-industry" },
    select: { id: true },
  });

  await prisma.libraryEntry.upsert({
    where: { slug: "النظام-الاسترشادي-التعديني-للدول-العربية" },
    update: {
      title: "الـنـظـام االسـترشـادي التعديني للدول العربية",
      description: initialDescription,
      publisher: "المنظمة العربية للتنمية الصناعية والتقييس والتعدين",
      author: "إدارة الثروة المعدنية",
      categoryId: category.id,
      year: 2026,
      language: "العربية",
      pageCount: 352,
      status: "PUBLISHED",
      featured: true,
      publishedAt: new Date("2026-01-01T00:00:00.000Z"),
    },
    create: {
      title: "الـنـظـام االسـترشـادي التعديني للدول العربية",
      slug: "النظام-الاسترشادي-التعديني-للدول-العربية",
      description: initialDescription,
      publisher: "المنظمة العربية للتنمية الصناعية والتقييس والتعدين",
      author: "إدارة الثروة المعدنية",
      categoryId: category.id,
      year: 2026,
      language: "العربية",
      pageCount: 352,
      status: "PUBLISHED",
      featured: true,
      publishedAt: new Date("2026-01-01T00:00:00.000Z"),
    },
  });
}

async function main() {
  await seedAdmin();
  await seedCategories();
  await seedEntries();
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
