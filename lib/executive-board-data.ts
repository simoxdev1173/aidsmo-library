export const executiveBoardSourcePage =
  'https://aidsmo.org/aidmo-whois-ar/aidmo-vip/aidmo-vip-executive-board-ar.html';

const profileBase =
  'https://aidsmo.org/aidmo-whois-ar/aidmo-vip/aidmo-vip-executive-board-ar/';

type BoardSeedMember = {
  slug: string;
  name: string;
  sourceProfileName?: string;
  role?: string;
  ministry: string;
  country: string;
  flag: string;
  phone?: string;
  fax?: string;
  profilePath?: string;
  sourceNote?: string;
};

type ExecutiveBoardMemberSeed = BoardSeedMember & {
  websiteUrl: string;
  vCardUrl: string | null;
  imageUrl: string;
};

const boardSeedMembers: BoardSeedMember[] = [
  {
    slug: 'jordan-dana-al-zaabi',
    name: 'سعادة الأستاذة دانا الزعبي',
    role: 'الأمين العام',
    ministry: 'وزارة الصناعة والتجارة والتموين',
    country: 'المملكة الأردنية الهاشمية',
    flag: 'jordan-jo',
    profilePath: '188-سعادة-الأستاذة-دانا-الزعبي.html',
  },
  {
    slug: 'uae-hassan-jassim-al-nuwais',
    name: 'سعادة الأستاذ حسن جاسم النويس',
    sourceProfileName: 'سعادة الأستاذ عمر أحمد صوينع السويدي',
    role: 'وكيل الوزارة',
    ministry: 'وزارة الصناعة والتكنولوجيا المتقدمة',
    country: 'دولة الإمارات العربية المتحدة',
    flag: 'uae-ae',
    phone: '0097126190000',
    fax: '0097126190007',
    profilePath: '66-aidmo-exec-ae.html',
    sourceNote: 'اسم قائمة المجلس يختلف عن عنوان الملف المرتبط به على الموقع. راجع اسم الشخص قبل تحديثه.',
  },
  {
    slug: 'bahrain-eiman-ahmed-aldosari',
    name: 'سعادة الأستاذة ايمان أحمد الدوسري',
    role: 'وكيل الوزارة',
    ministry: 'وزارة الصناعة والتجارة',
    country: 'مملكة البحرين',
    flag: 'bahrain-bh',
    phone: '0097317568009',
    fax: '0097317581408',
    profilePath: '29-aidmo-exec-bh.html',
  },
  {
    slug: 'tunisia-executive-board-member',
    name: 'غير مذكور في المصدر',
    ministry: 'وزارة الصناعة والمناجم والطاقة',
    country: 'الجمهورية التونسية',
    flag: 'tunisia-tn',
    phone: '0021671900619',
    fax: '0021671902947',
    profilePath: '30-aidmo-exec-tn.html',
    sourceNote: 'قائمة المجلس تعرض الرمز __ مكان الاسم.',
  },
  {
    slug: 'saudi-arabia-ali-alamoudi',
    name: 'سعادة الأستاذ علي بن محمد العامودي',
    role: 'وكيل الوزارة المساعد للشؤون التعدينية',
    ministry: 'وزارة الصناعة والثروة المعدنية',
    country: 'المملكة العربية السعودية',
    flag: 'saudi-arabia-sa',
    phone: '00966112945522',
    fax: '00966114775228',
    profilePath: '169-aidmo-exec-ksa.html',
  },
  {
    slug: 'sudan-awad-salam-adam',
    name: 'سعادة الدكتور عوض سلام موسى آدم',
    role: 'وكيل الوزارة',
    ministry: 'وزارة الصناعة والتجارة',
    country: 'جمهورية السودان',
    flag: 'sudan-sd',
    phone: '00249183783123',
    profilePath: '33-aidmo-exec-sd.html',
  },
  {
    slug: 'syria-murhaf-aldaks',
    name: 'سعادة المهندس مرهف الدقس',
    ministry: 'وزارة الاقتصاد والصناعة',
    country: 'الجمهورية العربية السورية',
    flag: 'syria-sy',
    profilePath: '115-aidsmo-exec-sy.html',
  },
  {
    slug: 'oman-jassim-aljadidi',
    name: 'سعادة المهندس جاسم بن سيف الجديدي',
    sourceProfileName: 'سعادة الدكتور صالح بن سعيد بن سالم مسن',
    role: 'مدير المكتب الفني بالوزارة',
    ministry: 'وزارة التجارة والصناعة وترويج الاستثمار',
    country: 'سلطنة عمان',
    flag: 'oman-om',
    profilePath: '189-aidmo-exec-om.html',
    sourceNote: 'اسم ومنصب القائمة يختلفان عن عنوان وبيانات الملف المرتبط به على الموقع. راجع السجل قبل تصحيح الاسم.',
  },
  {
    slug: 'palestine-haidar-jahha',
    name: 'سعادة المهندس حيدر جحه',
    role: 'الرئيس التنفيذي لمؤسسة المواصفات والمقاييس الفلسطينية',
    ministry: 'وزارة الصناعة',
    country: 'دولة فلسطين',
    flag: 'palestine-ps',
    phone: '00249183766186',
    fax: '00249183796921',
    profilePath: '156-aidmo-exec-ps.html',
    sourceNote: 'رقما الهاتف والفاكس منقولان كما ظهرا في القائمة؛ رمز الاتصال +249 يبدو غير متوافق مع الدولة ويحتاج إلى تحقق.',
  },
  {
    slug: 'qatar-saleh-alkhalif',
    name: 'سعادة الأستاذ صالح بن ماجد الخليف',
    role: 'وكيل الوزارة المساعد لشؤون الصناعة وتنمية الأعمال',
    ministry: 'وزارة التجارة والصناعة',
    country: 'دولة قطر',
    flag: 'qatar-qa',
    phone: '0097455513270',
    fax: '0097444837575',
    profilePath: '35-aidmo-exec-qa.html',
  },
  {
    slug: 'kuwait-shamlan-aljuhaidli',
    name: 'سعادة السيد شملان حمود الجحيدلي',
    role: 'المدير العام',
    ministry: 'الهيئة العامة للصناعة',
    country: 'دولة الكويت',
    flag: 'kuwait-kw',
    phone: '0096525302001',
    fax: '0096525302112',
    profilePath: '146-aidmo-exec-kw.html',
  },
  {
    slug: 'libya-hussein-faraj-alshatiwi',
    name: 'سعادة الدكتور حسين فرج الشتيوي',
    role: 'مدير مكتب التعاون الدولي والفني والمكلف بإدارة الدراسات والبحوث الصناعية بالوزارة',
    ministry: 'وزارة الصناعة والمعادن',
    country: 'دولة ليبيا',
    flag: 'libya-ly',
    profilePath: '140-aidmo-exec-ly-5.html',
  },
  {
    slug: 'egypt-khaled-soufi',
    name: 'سعادة الدكتور المهندس خالد حسن صوفي',
    role: 'رئيس مجلس إدارة الهيئة المصرية العامة للمواصفات والجودة',
    ministry: 'وزارة التجارة والصناعة',
    country: 'جمهورية مصر العربية',
    flag: 'egypt-eg',
    phone: '00201111530000',
    fax: '0020222845504',
    profilePath: '38-aidmo-exec-eg.html',
  },
  {
    slug: 'morocco-tawfiq-musharraf',
    name: 'سعادة الأستاذ توفيق مشرف',
    role: 'الكاتب العام',
    ministry: 'وزارة الصناعة والتجارة',
    country: 'المملكة المغربية',
    flag: 'morocco-ma',
    phone: '00212537669648',
    fax: '00212537739354',
    profilePath: '39-aidmo-exec-ma.html',
  },
  {
    slug: 'mauritania-executive-board-member',
    name: 'غير مذكور في المصدر',
    ministry: 'وزارة المعادن والصناعة',
    country: 'الجمهورية الإسلامية الموريتانية',
    flag: 'mauritania-mr',
    sourceNote: 'قائمة المجلس تعرض شرطة (-) مكان الاسم ولا تعرض بيانات اتصال.',
  },
];

export const executiveBoardMembers: ExecutiveBoardMemberSeed[] = boardSeedMembers.map((member) => ({
  ...member,
  websiteUrl: member.profilePath ? `${profileBase}${member.profilePath}` : executiveBoardSourcePage,
  vCardUrl: member.profilePath
    ? `${profileBase}${member.profilePath.replace(/\.html$/, '.vcf')}`
    : null,
  imageUrl: `https://aidsmo.org/images/flags/${member.flag}-flag.jpg`,
}));
