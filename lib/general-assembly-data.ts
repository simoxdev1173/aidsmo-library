import portraitManifest from './general-assembly-portraits.json';

const portraits: Record<string, { localPath: string }> = portraitManifest;

export const generalAssemblySourcePage =
  'https://aidsmo.org/aidmo-whois-ar/aidmo-vip/aidmo-vip-ministerial-board-ar.html';

const profileBase = 'https://aidsmo.org/aidmo-whois-ar/aidmo-vip/aidmo-vip-ministerial-board-ar/';

type AssemblySeedMember = {
  slug: string; name: string; role: string; ministry: string; country: string;
  phone?: string; fax?: string; flag: string; profile?: string; sourceProfileName?: string; sourceNote?: string;
};

const records: AssemblySeedMember[] = [
  { slug:'jordan-yarab-alqudah', name:'معالي المهندس يعرب فلاح مفلح القضاة', role:'وزير الصناعة والتجارة والتموين', ministry:'وزارة الصناعة والتجارة والتموين', country:'المملكة الأردنية الهاشمية', phone:'0096265629030', fax:'0096265684692', flag:'jordan-jo', profile:'197-معالي-السيد-يعرب-فلاح-مفلح-القضاة.html' },
  { slug:'uae-sultan-aljaber', name:'معالي الدكتور سلطان بن أحمد الجابر', role:'وزير الصناعة والتكنولوجيا المتقدمة', ministry:'وزارة الصناعة والتكنولوجيا المتقدمة', country:'دولة الإمارات العربية المتحدة', phone:'0097126190110', fax:'0097126190001', flag:'uae-ae', profile:'11-ae-ind-min-phd-sultan-ahmed-al-jaber.html' },
  { slug:'bahrain-abdulla-fakhro', name:'سعادة السيد عبدالله بن عادل فخرو', role:'وزير الصناعة والتجارة', ministry:'وزارة الصناعة والتجارة', country:'مملكة البحرين', phone:'0097317568000 / 0097317568002', fax:'0097317581403 / 0097317530455', flag:'bahrain-bh', profile:'12-bh-ind-min-abdulla-fakhro.html' },
  { slug:'tunisia-general-assembly', name:'غير مذكور في قائمة الجمعية العامة', role:'وزير الصناعة والمناجم والطاقة', ministry:'وزارة الصناعة والمناجم والطاقة', country:'الجمهورية التونسية', phone:'0021671905132 / 0021671904216', fax:'0021671902742', flag:'tunisia-tn', profile:'13-tn-ind-min-fatma-thabet.html', sourceProfileName:'معالي الأستاذة فاطمة ثابت', sourceNote:'قائمة الجمعية العامة تعرض شرطة مكان الاسم، بينما صفحة الملف المرتبط تعرض معالي الأستاذة فاطمة ثابت. يرجى التحقق من شاغل المنصب الحالي قبل اعتماد الاسم.' },
  { slug:'algeria-yahia-bachir', name:'معالي الأستاذ يحيى بشير', role:'وزير الصناعة', ministry:'وزارة الصناعة', country:'الجمهورية الجزائرية الديمقراطية الشعبية', fax:'0021321747523', flag:'algeria-dz', profile:'14-dz-ind-min-sayf-gharib.html', sourceNote:'عنوان صفحة الملف المرتبط يختلف عن الاسم المعروض في قائمة الجمعية العامة؛ راجع الاسم قبل التحديث.' },
  { slug:'djibouti-ilyas-doualeh', name:'معالي الأستاذ إلياس موسى دواله', role:'وزير الاقتصاد والمالية المكلف بالصناعة', ministry:'وزارة الاقتصاد والمالية المكلفة بالصناعة', country:'جمهورية جيبوتي', phone:'0025321355045', fax:'0025321354396 / 0025321354909', flag:'djibouti-dj', profile:'15-dj-eco-min-ilias-douali.html' },
  { slug:'saudi-abdulaziz-alsalman', name:'صاحب السمو الملكي الأمير عبد العزيز بن سلمان بن عبد العزيز آل سعود', role:'وزير الطاقة ووزير الصناعة والثروة المعدنية', ministry:'وزارة الطاقة ووزارة الصناعة والثروة المعدنية', country:'المملكة العربية السعودية', phone:'0096614772218 / 0096614775447', fax:'00966114775468 / 00966114056292', flag:'saudi-arabia-sa', profile:'16-sa-ind-min-bandar-alkhorayef.html', sourceNote:'صفحة الملف المرتبط تعرض اسماً مختلفاً عن قائمة الجمعية العامة؛ يلزم التحقق قبل استيراد بيانات الملف الشخصي.' },
  { slug:'sudan-mahasin-yaacoub', name:'معالي الأستاذة محاسن علي يعقوب', role:'وزيرة الصناعة والتجارة', ministry:'وزارة الصناعة والتجارة', country:'جمهورية السودان', phone:'00249183777770 / 00249183778940', fax:'00249183777603 / 00249183781770', flag:'sudan-sd', profile:'17-sd-ind-min-mahasine-ali-yaacoub.html' },
  { slug:'syria-mohammad-alshaar', name:'معالي الدكتور محمد نضال الشعار', role:'وزير الاقتصاد والصناعة', ministry:'وزارة الاقتصاد والصناعة', country:'الجمهورية العربية السورية', phone:'00963112231848', fax:'00963112254957', flag:'syria-sy', profile:'204-sy-ind-min-5.html' },
  { slug:'somalia-jamal-hassan', name:'معالي السفير جمال محمد حسن', role:'وزير التجارة والصناعة', ministry:'وزارة التجارة والصناعة', country:'جمهورية الصومال الفيدرالية', phone:'002521576278', fax:'002521221777', flag:'somalia-so', profile:'207-معالي-السيد-محمود-أحمد-آدم-2.html', sourceNote:'صفحة الملف المرتبط تعرض اسماً مختلفاً عن قائمة الجمعية العامة؛ يرجى مراجعة بياناتها قبل اعتمادها.' },
  { slug:'iraq-mohammed-ahmed', name:'معالي الأستاذ محمد نوري أحمد', role:'وزير الصناعة والمعادن', ministry:'وزارة الصناعة والمعادن', country:'جمهورية العراق', phone:'0096418862006', fax:'0096418166040', flag:'iraq-iq', profile:'19-iq-ind-min-khaled-battal-al-najm.html', sourceNote:'عنوان صفحة الملف المرتبط يعرض اسماً مختلفاً عن قائمة الجمعية العامة.' },
  { slug:'oman-anwar-aljabri', name:'معالي الأستاذ أنور بن هلال الجابري', role:'وزير التجارة والصناعة وترويج الاستثمار', ministry:'وزارة التجارة والصناعة وترويج الاستثمار', country:'سلطنة عمان', phone:'009687714201', fax:'0096824817238', flag:'oman-om', profile:'20-om-ind-min-ali-al-sunaidy.html', sourceNote:'عنوان صفحة الملف المرتبط يعرض اسماً مختلفاً عن قائمة الجمعية العامة.' },
  { slug:'palestine-arafat-asfour', name:'معالي الأستاذ عرفات عصفور', role:'وزير الصناعة', ministry:'وزارة الصناعة', country:'دولة فلسطين', phone:'0097022981217', fax:'0097022981207', flag:'palestine-ps', profile:'21-ps-ind-min-arafat-osfor.html' },
  { slug:'qatar-faisal-althani', name:'سعادة الشيخ فيصل بن ثاني بن فيصل آل ثاني', role:'وزير التجارة والصناعة', ministry:'وزارة التجارة والصناعة', country:'دولة قطر', phone:'009744832121', fax:'0097444832024', flag:'qatar-qa', profile:'22-qa-ind-min-tamim-bin-hamad.html', sourceNote:'عنوان صفحة الملف المرتبط يعرض اسماً مختلفاً عن قائمة الجمعية العامة.' },
  { slug:'kuwait-abdulaziz-almarzouq', name:'معالي الأستاذ عبدالعزيز ناصر عبدالعزيز المرزوق', role:'وزير الدولة للشؤون الاقتصادية والاستثمار ـ وزير التجارة والصناعة بالوكالة', ministry:'وزارة التجارة والصناعة', country:'دولة الكويت', phone:'0096522480000', fax:'0096522411089', flag:'kuwait-kw', sourceNote:'لم أتمكن من تأكيد صفحة الملف الفردية من رابط القائمة.' },
  { slug:'lebanon-joe-issa-khoury', name:'معالي المهندس جو عيسى الخوري', role:'وزير الصناعة', ministry:'وزارة الصناعة', country:'الجمهورية اللبنانية', phone:'009611429141 / 009611427996', fax:'009611427112', flag:'lebanon-lb', profile:'202-lb-ind-min-joe-issa-al-khoury-2.html' },
  { slug:'libya-mohammed-abdelkader', name:'معالي المهندس محمد علي عبد القادر', role:'وزير الصناعة والمعادن', ministry:'وزارة الصناعة والمعادن', country:'دولة ليبيا', phone:'00218925754423', flag:'libya-ly', profile:'215-ly-ind-min-ahmed-mohamad-ali-abdelkader.html' },
  { slug:'egypt-khaled-hashim', name:'معالي المهندس خالد هاشم', role:'وزير الصناعة', ministry:'وزارة الصناعة', country:'جمهورية مصر العربية', fax:'002022610510', flag:'egypt-eg', profile:'174-eg-ind-min-ahmed-samir-2.html', sourceNote:'رقم الهاتف في القائمة يظهر بمحرف تشكيل زائد (00َ2024008260)، لذلك لم يُدرج كرقم قابل للاتصال. عنوان الملف المرتبط يختلف عن الاسم في القائمة.' },
  { slug:'morocco-riad-mezzour', name:'معالي الأستاذ رياض مزور', role:'وزير الصناعة والتجارة', ministry:'وزارة الصناعة والتجارة', country:'المملكة المغربية', phone:'00212537669600 / 00212537765227', fax:'00212537766265 / 00212537768933', flag:'morocco-ma', profile:'26-ma-ind-min-ryad-mezzour.html' },
  { slug:'mauritania-edi-weld-zein', name:'معالي الأستاذ ادي ولد الزين', role:'وزير المعادن والصناعة', ministry:'وزارة المعادن والصناعة', country:'الجمهورية الإسلامية الموريتانية', phone:'0022245242541 / 0022245253083', fax:'0022245251057', flag:'mauritania-mr', profile:'216-mr-ind-min-atiam-tijani-202408-3.html', sourceNote:'عنوان الملف المرتبط يعرض اسماً مختلفاً عن قائمة الجمعية العامة.' },
  { slug:'yemen-mohammed-alashwal', name:'معالي الأستاذ محمد محمد حزام الأشول', role:'وزير الصناعة والتجارة', ministry:'وزارة الصناعة والتجارة', country:'الجمهورية اليمنية', phone:'00967718000401', fax:'009671251557', flag:'yemen-ye', profile:'40-ye-ind-min-muhammad-hezam-al_ashwal.html' },
];

export const generalAssemblyMembers = records.map((member) => ({
  ...member,
  imageUrl: portraits[member.slug]?.localPath ?? null,
  websiteUrl: member.profile ? `${profileBase}${member.profile}` : generalAssemblySourcePage,
  vCardUrl: member.profile ? `${profileBase}${member.profile.replace(/\.html$/, '.vcf')}` : null,
}));
