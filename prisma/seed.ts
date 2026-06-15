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
  "يهدف النظام الاسترشادي التعديني للدول العربية إلى توفير إطار مرجعي موحد يساعد الحكومات على تطوير تشريعات حديثة ومتناغمة لقطاع التعدين، بما يعزز الشفافية والاستثمار المسؤول. انطلق إعداد النظام من دراسة استقصائية شاملة للأنظمة القائمة وتحليل فجواتها، إضافة إلى مقارنة دولية لبناء رؤية عربية مشتركة. ويتناول النظام مراحل النشاط التعديني من الاستطلاع إلى الاستغلال، ويحدد الحقوق والالتزامات، وآليات منح التراخيص، والضوابط البيئية والاقتصادية والاجتماعية، مع التركيز على حماية الموارد والبيئة وحقوق المجتمعات. ويوفر إطارا قانونيا مرنا يعزز التكامل الإقليمي، ويرفع جاذبية القطاع للاستثمار، ويسهم في تنمية اقتصادات الدول العربية بشكل مستدام.";

const categories = [
  { name: "الصناعة", slug: "industry", order: 10, navHref: "/industry" },
  { name: "التقييس", slug: "standardization", order: 20, navHref: "/standardization" },
  { name: "التعدين", slug: "mining", order: 30, navHref: "/catalog/mining" },
  { name: "المعلومات الصناعية", slug: "industrial-info", order: 40, navHref: "/info" },
  { name: "التدريب والاستشارات", slug: "training", order: 50, navHref: "/training/about" },
  { name: "الأرشيف", slug: "archive", order: 60, navHref: "/archive/org/founding" },
];

const children = [
  { parentSlug: "industry", name: "إستراتيجيات", slug: "industry-integration-strategy", order: 11, navHref: "/industry/integration-strategy" },
  { parentSlug: "industry", name: "الصناعات الصغيرة والمتوسطة", slug: "industry-sme", order: 12, navHref: "/industry/sme" },
  { parentSlug: "industry", name: "فعاليات وأنشطة", slug: "industry-events", order: 13, navHref: "/industry/events" },
  { parentSlug: "industry", name: "الدراسات والأدلة", slug: "industry-studies", order: 14, navHref: "/industry/studies" },
  { parentSlug: "industry-studies", name: "الدراسات", slug: "industry-studies-studies", order: 141, navHref: "/industry/studies/studies" },
  { parentSlug: "industry-studies", name: "الأدلة", slug: "industry-studies-guides", order: 142, navHref: "/industry/studies/guides" },
  { parentSlug: "standardization", name: "دراسات", slug: "standardization-studies", order: 21, navHref: "/standardization/studies" },
  { parentSlug: "standardization", name: "معاجم", slug: "standardization-glossaries", order: 22, navHref: "/standardization/glossaries" },
  { parentSlug: "standardization", name: "أدلة", slug: "standardization-guides", order: 23, navHref: "/standardization/guides" },
  { parentSlug: "standardization", name: "توجيهات", slug: "standardization-directives", order: 24, navHref: "/standardization/directives" },
  { parentSlug: "standardization", name: "إستراتيجيات", slug: "standardization-strategies", order: 25, navHref: "/standardization/strategies" },
  { parentSlug: "standardization", name: "ورش ودورات تدريبية", slug: "standardization-workshops", order: 26, navHref: "/standardization/workshops" },
  { parentSlug: "standardization", name: "دورات تدريبية", slug: "standardization-training-courses", order: 261, navHref: "/standardization/training-courses" },
  { parentSlug: "standardization", name: "ورش عمل", slug: "standardization-workshops-events", order: 262, navHref: "/standardization/workshops" },
  { parentSlug: "standardization", name: "ندوات", slug: "standardization-seminars", order: 263, navHref: "/standardization/seminars" },
  { parentSlug: "standardization", name: "إجتماعات", slug: "standardization-meetings", order: 264, navHref: "/standardization/meetings" },
  { parentSlug: "mining", name: "المكتبة الرقمية للدراسات التعدينية العربية", slug: "arab-mining-library", order: 30, navHref: "https://arabmininglibrary.org/" },
  { parentSlug: "mining", name: "جيولوجيا", slug: "geology", order: 31, navHref: "/catalog/geology" },
  { parentSlug: "geology", name: "الصناعة التعدينية", slug: "mining-industry", order: 32, navHref: "/catalog/mining-industry" },
  { parentSlug: "industrial-info", name: "الإحصاءات الصناعية", slug: "industrial-statistics", order: 40, navHref: "/info/statistics" },
  { parentSlug: "industrial-statistics", name: "تقرير الصناعة العربية", slug: "arab-industry-report", order: 401, navHref: "/info/statistics/arab-industry-report" },
  { parentSlug: "industrial-statistics", name: "كتيب المؤشرات الاقتصادية والصناعية", slug: "indicators-booklet", order: 402, navHref: "/info/statistics/indicators-booklet" },
  { parentSlug: "industrial-statistics", name: "نشرة الإحصاءات الصناعية", slug: "statistics-bulletin", order: 403, navHref: "/info/statistics/bulletin" },
  { parentSlug: "industrial-statistics", name: "الانفوجرافيك", slug: "infographics", order: 404, navHref: "/info/statistics/infographics" },
  { parentSlug: "infographics", name: "2023", slug: "infographics-2023", order: 4041, navHref: "/info/statistics/infographics/2023" },
  { parentSlug: "infographics", name: "2024", slug: "infographics-2024", order: 4042, navHref: "/info/statistics/infographics/2024" },
  { parentSlug: "infographics", name: "2025", slug: "infographics-2025", order: 4043, navHref: "/info/statistics/infographics/2025" },
  { parentSlug: "infographics", name: "2026", slug: "infographics-2026", order: 4044, navHref: "/info/statistics/infographics/2026" },
  { parentSlug: "industrial-info", name: "مؤتمرات وندوات", slug: "conferences", order: 41, navHref: "/info/conferences" },
  { parentSlug: "industrial-info", name: "مجلة التنمية الصناعية", slug: "industrial-development-magazine", order: 42, navHref: "/info/magazine" },
  { parentSlug: "industrial-info", name: "النشرة الدورية", slug: "newsletter", order: 43, navHref: "/info/newsletter" },
  { parentSlug: "industrial-info", name: "الإصدارات", slug: "publications", order: 44, navHref: "/info/publications" },
  { parentSlug: "training", name: "حول المعهد", slug: "training-about", order: 51, navHref: "/training/about" },
  { parentSlug: "training", name: "الخطة التدريبية", slug: "training-plan", order: 52, navHref: "/training/plan" },
  { parentSlug: "training-plan", name: "2024", slug: "training-plan-2024", order: 521, navHref: "/training/plan/2024" },
  { parentSlug: "training-plan", name: "2025", slug: "training-plan-2025", order: 522, navHref: "/training/plan/2025" },
  { parentSlug: "training-plan", name: "2026", slug: "training-plan-2026", order: 523, navHref: "/training/plan/2026" },
  { parentSlug: "archive", name: "المنظمة العربية للتنمية الصناعية والتقييس والتعدين", slug: "archive-org", order: 61, navHref: "/archive/org/founding" },
  { parentSlug: "archive-org", name: "تأسيس المنظمة", slug: "archive-org-founding", order: 611, navHref: "/archive/org/founding" },
  { parentSlug: "archive-org", name: "اتفاقيات الانشاء", slug: "archive-org-agreements", order: 612, navHref: "/archive/org/agreements" },
  { parentSlug: "archive-org", name: "النظام الداخلي", slug: "archive-org-bylaws", order: 613, navHref: "/archive/org/bylaws" },
  { parentSlug: "archive-org", name: "اللوائح الداخلية", slug: "archive-org-regulations", order: 614, navHref: "/archive/org/regulations" },
  { parentSlug: "archive-org", name: "مذكرات التفاهم واتفاقيات", slug: "archive-org-mou", order: 615, navHref: "/archive/org/mou" },
  { parentSlug: "archive-org", name: "المجلس التنفيذي", slug: "archive-org-executive-board", order: 616, navHref: "/archive/org/executive-board" },
  { parentSlug: "archive-org", name: "الجمعية العامة", slug: "archive-org-general-assembly", order: 617, navHref: "/archive/org/general-assembly" },
  { parentSlug: "archive", name: "جامعة الدول العربية", slug: "archive-league", order: 62, navHref: "/archive/league/summit" },
  { parentSlug: "archive-league", name: "القمة العربية", slug: "archive-league-summit", order: 621, navHref: "/archive/league/summit" },
  { parentSlug: "archive-league-summit", name: "قرارات مجلس الجامعة على المستوى الوزاري", slug: "archive-league-summit-council", order: 6211, navHref: "/archive/league/summit/council" },
  { parentSlug: "archive-league-summit", name: "مجلس الجامعة على مستوى القمة", slug: "archive-league-summit-council-summit", order: 6212, navHref: "/archive/league/summit/summit-council" },
  { parentSlug: "archive-league-summit", name: "القمة العربية الاقتصادية والاجتماعية", slug: "archive-league-summit-economic-social", order: 6213, navHref: "/archive/league/summit/economic-social" },
  { parentSlug: "archive-league", name: "المجلس الاقتصادي والاجتماعي", slug: "archive-league-ecosoc", order: 622, navHref: "/archive/league/ecosoc" },
  { parentSlug: "archive-league", name: "لجنة المنظمات والتنسيق", slug: "archive-league-coordination", order: 623, navHref: "/archive/league/coordination" },
  { parentSlug: "archive-league", name: "لجنة التنسيق العليا للعمل العربي المشترك", slug: "archive-league-joint-action", order: 624, navHref: "/archive/league/joint-action" },
  { parentSlug: "archive-league", name: "اللوائح والأنظمة", slug: "archive-league-regulations", order: 625, navHref: "/archive/league/regulations" },
];

const hiddenCategorySlugs = [
  "industry-advisory-committee",
  "industry-research-coordination",
  "standardization-workshops",
  "training-courses",
  "training-workshops",
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
      update: { ...category, isNavVisible: true },
      create: { ...category, isNavVisible: true },
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
        isNavVisible: true,
      },
      create: {
        name: child.name,
        slug: child.slug,
        order: child.order,
        navHref: child.navHref,
        parentId: parent.id,
        isNavVisible: true,
      },
    });
  }

  await prisma.category.updateMany({
    where: { slug: { in: hiddenCategorySlugs } },
    data: { isNavVisible: false },
  });
}

async function seedEntries() {
  const category = await prisma.category.findUniqueOrThrow({
    where: { slug: "mining-industry" },
    select: { id: true },
  });

  await prisma.libraryEntry.upsert({
    where: { slug: "النظام-الاسترشادي-التعديني-للدول-العربية" },
    update: {
      title: "النظام الاسترشادي التعديني للدول العربية",
      entryType: "BOOK",
      description: initialDescription,
      notes: null,
      contentSections: [],
      tag: "نظام استرشادي",
      publisher: "المنظمة العربية للتنمية الصناعية والتقييس والتعدين",
      author: "إدارة الثروة المعدنية",
      categoryId: category.id,
      year: "2026",
      language: "العربية",
      pageCount: 352,
      status: "PUBLISHED",
      featured: true,
      publishedAt: new Date("2026-01-01T00:00:00.000Z"),
    },
    create: {
      title: "النظام الاسترشادي التعديني للدول العربية",
      slug: "النظام-الاسترشادي-التعديني-للدول-العربية",
      entryType: "BOOK",
      description: initialDescription,
      notes: null,
      contentSections: [],
      tag: "نظام استرشادي",
      publisher: "المنظمة العربية للتنمية الصناعية والتقييس والتعدين",
      author: "إدارة الثروة المعدنية",
      categoryId: category.id,
      year: "2026",
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
