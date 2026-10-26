import { L, MD } from '../helpers'

export const categories = [
  { slug: 'admissions', name: L('القبول والتسجيل', 'Admissions') },
  { slug: 'gulf-students', name: L('طلبة الخليج', 'Gulf students') },
  { slug: 'costs-scholarships', name: L('التكاليف والمنح', 'Costs & scholarships') },
  { slug: 'student-life', name: L('الحياة الطلابية', 'Student life') },
]

export const posts = [
  {
    slug: 'admission-moroccan-public-universities-2026-2027',
    category: 'admissions',
    featured: true,
    publishedAt: '2026-10-14T09:00:00.000Z',
    title: L('القبول في الجامعات العمومية المغربية 2026-2027: ما الذي تغيّر للطالب الدولي؟', 'Admission to Moroccan public universities in 2026–27: what changed for international students'),
    excerpt: L(
      'لا معادلة مسبقة، ولا مباراة ولوج، ولا موافقة مسبقة من المشرف في الدكتوراه. إليك القنوات الثلاث الجديدة وما يجب أن تعرفه قبل الإيداع.',
      'No prior equivalence, no entrance exam, no prior supervisor approval for doctorates. Here are the three new channels and what to know before you apply.',
    ),
    meta: {
      description: L('دليل القبول في الجامعات العمومية المغربية للطلبة الدوليين لموسم 2026-2027: القنوات، الوثائق، الآجال.', 'Guide to admission at Moroccan public universities for international students in 2026–27: channels, documents and deadlines.'),
    },
    content: MD(
      'منذ موسم 2026-2027 أصبح ولوج الجامعات العمومية المغربية أسهل للطالب الدولي. فقد وجّه وزير التعليم العالي مذكرة إلى رؤساء الجامعات مرفقة بدليل مرجعي **تُعفي الطلبة الدوليين الجدد من معادلة شهاداتهم الأجنبية ومن مباريات الولوج الكتابية والشفوية**، مع الاكتفاء بدراسة الملف الأكاديمي.\n\n## ثلاث قنوات بدل قناة واحدة\n\n1. **التعاون الدولي:** عبر السلطات المختصة في بلدك ثم الوكالة المغربية للتعاون الدولي بالقناة الدبلوماسية.\n2. **برامج التبادل:** لطلبة الجامعات الشريكة، عبر مكتب العلاقات الدولية.\n3. **الترشيح المباشر:** مسار جديد لدى الجامعة العمومية مباشرة، في انتظار منصة رقمية موحدة.\n\n## ما الذي لم يتغيّر؟\n\n- القرار الأكاديمي النهائي بيد المؤسسة.\n- الدراسة بالتوقيت العادي مجانية.\n- كل إقامة تتجاوز 90 يومًا تتطلب بطاقة إقامة.\n\n## الوثائق المعتادة\n\n- استمارة الترشيح وصورتان\n- نسخ مصادق عليها من البكالوريا وكشف نقطها\n- شهادة الميلاد وجواز السفر\n- سجل عدلي حديث وشهادة طبية\n- للماستر والدكتوراه: الشهادات العليا وكشوف النقط والبرامج، وبحث التخرج ومشروع الأطروحة\n\n## نصيحتنا\n\nتفاصيل منصة الترشيح المباشر لم تُنشر بعد، والمذكرة صدرت في فترة انتقالية قد تعدّل الحكومة المقبلة تفاصيلها. راسل «مكتب الطالب الدولي» بالجامعة المستهدفة قبل أي إيداع — أو دعنا نقوم بذلك نيابةً عنك.',
      'Since 2026–27, getting into Morocco’s public universities has become easier for international students. The Minister of Higher Education sent university presidents a memo and reference guide that **exempts new international students from foreign diploma equivalence and from written and oral entrance exams**, with admission by academic file review only.\n\n## Three channels instead of one\n\n1. **International cooperation:** through your country’s authorities, then the Moroccan Agency for International Cooperation via diplomatic channels.\n2. **Exchange programmes:** for students of partner universities, through the international relations office.\n3. **Direct application:** a new route straight to the public university, pending a single digital platform.\n\n## What has not changed\n\n- The final academic decision rests with the institution.\n- Regular-track study is free.\n- Any stay over 90 days requires a residence card.\n\n## Usual documents\n\n- Application form and two photos\n- Certified copies of your secondary certificate and transcript\n- Birth certificate and passport\n- A recent police record and a medical certificate\n- For master’s and doctorates: degrees, transcripts and course descriptions, your thesis and a research proposal\n\n## Our advice\n\nDetails of the direct-application platform have not been published yet, and the memo was issued during a transition period, so the next government may adjust it. Contact the target university’s international student office before applying — or let us do it for you.',
    ),
  },
  {
    slug: 'gulf-students-prior-approval-degree-recognition',
    category: 'gulf-students',
    featured: true,
    publishedAt: '2026-10-15T09:00:00.000Z',
    title: L('لطلبة الخليج: الموافقة المسبقة ومعادلة الشهادة قبل التسجيل في المغرب', 'Gulf students: prior approval and degree recognition before you enrol in Morocco'),
    excerpt: L(
      'القبول في المغرب أصبح أسهل، لكن قيمة شهادتك تقررها جهة المعادلة في بلدك. هذه الشروط الحاسمة في عُمان والسعودية وقطر والإمارات.',
      'Admission in Morocco is now easier, but your degree’s value is decided at home. These are the key conditions in Oman, Saudi Arabia, Qatar and the UAE.',
    ),
    meta: {
      description: L('شروط الموافقة المسبقة والمعادلة لطلبة عُمان والسعودية وقطر والإمارات الراغبين في الدراسة بالمغرب.', 'Prior-approval and recognition rules for students from Oman, Saudi Arabia, Qatar and the UAE who want to study in Morocco.'),
    },
    content: MD(
      'الطالب الخليجي يعبر بوابتين: بوابة المغرب، وقد أصبحت أسهل منذ 2026-2027، وبوابة بلده التي تقرر قيمة الشهادة عند العودة. **والثانية هي الأخطر:** أي تسجيل قبل الحصول على الموافقة المسبقة قد ينتهي بشهادة غير معادَلة.\n\n## الشروط حسب البلد\n\n- **سلطنة عُمان** (وزارة التعليم العالي والبحث العلمي والابتكار): «طلب مواصلة دراسة» إلكترونيًا وموافقة كتابية قبل الالتحاق؛ مؤسسة وتخصص ضمن القائمة الموصى بها؛ نظام دراسة معتمد.\n- **السعودية** (وزارة التعليم): موافقة مسبقة لمن يدرس على حسابه؛ المؤسسة والبرنامج ضمن قائمة الوزارة؛ انتظام حضوري.\n- **قطر** (وزارة التربية والتعليم والتعليم العالي): موافقة مسبقة قبل بدء الدراسة، بخطاب قبول غير مشروط.\n- **الإمارات** (وزارة التعليم العالي والبحث العلمي): مؤسسة معتمدة طيلة مدة الدراسة، والتحقق عبر Quadra Bay أو DataFlow؛ تصديق السفارة وحده لا يكفي.\n- **الكويت والبحرين:** يُرجع إلى الجهة الوطنية المختصة قبل التسجيل.\n\n## ثلاثة تنبيهات عملية\n\n1. **التوقيت الميسر والدراسة عن بعد:** الجهات الخليجية تشترط الانتظام الحضوري، وقد رفضت اللجنة العُمانية معادلة شهادات لعدم الانتظام أو للدراسة عن بعد.\n2. **المؤسسات الخاصة:** الاعتراف المغربي بالمؤسسة لا يعني إدراجها في القوائم الخليجية.\n3. **الإعفاء المغربي لا يعفيك من معادلة بلدك:** شهادتك المغربية ستُعادل عند العودة بقواعد بلدك.\n\n> سابقة مفيدة: عادلت اللجنة العُمانية دكتوراه من جامعة محمد الأول بوجدة سنة 2021.\n\nاحتفظ بنسخ بطاقة الإقامة: هي نفسها دليل «الإقامة أثناء الدراسة» الذي تطلبه جهات المعادلة.',
      'Gulf students pass through two gates: Morocco’s, which has become easier since 2026–27, and their own country’s, which decides what the degree is worth back home. **The second is the riskier one:** enrolling before you have prior approval can leave you with an unrecognised degree.\n\n## Conditions by country\n\n- **Oman** (Ministry of Higher Education, Research and Innovation): an online “continuing studies” request and written approval before enrolling; institution and programme on the recommended list; an approved mode of study.\n- **Saudi Arabia** (Ministry of Education): prior approval for self-funded students; institution and programme on the ministry’s list; regular attendance.\n- **Qatar** (Ministry of Education and Higher Education): prior approval before starting, with an unconditional offer letter.\n- **UAE** (Ministry of Higher Education and Scientific Research): an institution accredited throughout your studies, and verification through Quadra Bay or DataFlow; embassy attestation alone is not enough.\n- **Kuwait and Bahrain:** check with the national authority before enrolling.\n\n## Three practical warnings\n\n1. **Flexible-schedule and distance study:** Gulf authorities require regular attendance, and Oman’s committee has rejected degrees for non-attendance or distance study.\n2. **Private institutions:** Moroccan recognition does not mean the institution is on Gulf lists.\n3. **Morocco’s exemption does not exempt you at home:** your Moroccan degree will be assessed under your own country’s rules.\n\n> A useful precedent: Oman’s committee recognised a doctorate from Mohammed I University, Oujda, in 2021.\n\nKeep copies of your residence card — they are the “residence during study” evidence recognition authorities ask for.',
    ),
  },
  {
    slug: 'cost-of-studying-in-morocco',
    category: 'costs-scholarships',
    publishedAt: '2026-10-16T09:00:00.000Z',
    title: L('كم تكلف الدراسة في المغرب؟ الرسوم حسب نوع المؤسسة', 'How much does it cost to study in Morocco? Fees by type of institution'),
    excerpt: L('من الجامعة العمومية المجانية إلى الجامعات الخاصة الناطقة بالإنجليزية — الأرقام الفعلية لموسم 2026-2027.', 'From free public universities to English-speaking private universities — the actual figures for 2026–27.'),
    meta: { description: L('رسوم الجامعات المغربية العمومية والخاصة وتكاليف المعيشة للطلبة الدوليين.', 'Tuition at Moroccan public and private universities, and living costs for international students.') },
    content: MD(
      'التكوين بالتوقيت العادي في الجامعة العمومية مجاني للطالب الأجنبي كما للمغربي؛ الكلفة الحقيقية في السكن والمعيشة.\n\n## الرسوم السنوية\n\n- **جامعة عمومية — توقيت عادي:** مجاني (إجازة، ماستر، دكتوراه).\n- **جامعة عمومية — توقيت ميسر (2026-2027):** إجازة 5.000، باشلور 18.000، ماستر 15.000، دكتوراه 20.000 درهم.\n- **جامعة الأخوين (سعر دولي):** 3.392 درهمًا للرصيد في الإجازة، و4.240 في الماستر — نحو 108.000 درهم سنويًا للإجازة دون السكن.\n- **جامعة محمد السادس متعددة التخصصات:** 65.000 (إجازة)، 75.000 (ماستر وهندسة)، 130.000 (طب وصيدلة) + 5.000 تسجيل.\n- **الجامعة الدولية للرباط:** متوسط 6.000 يورو؛ 12.000 للطب وطب الأسنان.\n- **جامعة محمد السادس لعلوم الصحة:** الطب نحو 130.000 درهم (رقم تاريخي).\n\n## تكاليف المعيشة\n\nتتراوح عادةً بين **4.000 و7.000 درهم شهريًا** حسب المدينة ونوع السكن: فاس ووجدة والقنيطرة الأقل كلفة، والدار البيضاء والرباط الأعلى.\n\n## تكاليف إدارية\n\nملف المعادلة عند الحاجة (حدود 200 درهم)، والترجمة المحلّفة (حتى 250 درهمًا للصفحة)، وطابع بطاقة الإقامة.\n\n_أرقام UM6P وUM6SS والجامعة الدولية للرباط مصدرها ثانوي أو سابق لموسم 2026-2027؛ تأكد منها لدى المؤسسة._',
      'Regular-track study at a public university is free for international students, just as for Moroccans; the real cost is housing and living.\n\n## Yearly fees\n\n- **Public university — regular track:** free (bachelor’s, master’s, doctorate).\n- **Public university — flexible track (2026–27):** bachelor’s MAD 5,000, professional bachelor MAD 18,000, master’s MAD 15,000, doctorate MAD 20,000.\n- **Al Akhawayn (international rate):** MAD 3,392 per credit (bachelor’s) and MAD 4,240 (master’s) — about MAD 108,000 a year for a bachelor’s, excluding housing.\n- **UM6P:** MAD 65,000 (bachelor’s), 75,000 (master’s and engineering), 130,000 (medicine and pharmacy) + 5,000 registration.\n- **International University of Rabat:** average €6,000; €12,000 for medicine and dentistry.\n- **UM6SS:** medicine about MAD 130,000 (historical figure).\n\n## Living costs\n\nUsually **MAD 4,000–7,000 a month** depending on the city and housing: Fes, Oujda and Kenitra are the most affordable; Casablanca and Rabat the most expensive.\n\n## Administrative costs\n\nEquivalence file if needed (around MAD 200), sworn translation (up to MAD 250 per page) and the residence card stamp.\n\n_UM6P, UM6SS and UIR figures come from secondary or pre-2026–27 sources; confirm them with the institution._',
    ),
  },
  {
    slug: 'which-language-study-morocco',
    category: 'student-life',
    publishedAt: '2026-10-17T09:00:00.000Z',
    title: L('بأي لغة سأدرس في المغرب؟ العربية والفرنسية والإنجليزية', 'Which language will I study in? Arabic, French and English in Morocco'),
    excerpt: L('الفرنسية غالبة، والعربية لغة الآداب والشريعة، والإنجليزية في جامعات محددة. اختر المسلك الأقصر لك.', 'French dominates, Arabic is used for letters and Sharia, and English at specific universities. Choose the shortest route for you.'),
    meta: { description: L('لغة التدريس في الجامعات المغربية حسب المؤسسة والتخصص، ونصائح للطلبة العرب.', 'Language of instruction at Moroccan universities by institution and subject, with advice for Arabic-speaking students.') },
    content: MD(
      '## الصورة العامة\n\n- **الفرنسية:** الطب، الصيدلة، العلوم، الهندسة، الاقتصاد والتسيير في الجامعات العمومية.\n- **العربية:** اللغة العربية وآدابها، الدراسات الإسلامية، وجزء من القانون؛ وجامعة القرويين بالكامل.\n- **الإنجليزية:** جامعة الأخوين (النظام الأمريكي)، وعدد من برامج جامعة محمد السادس متعددة التخصصات، وبعض برامج الجامعة الدولية للرباط والجامعة الأورومتوسطية.\n\n## ماذا يعني ذلك للطالب العربي؟\n\nالمسالك العربية هي الأقل كلفة وزمنًا. أما إن أردت تخصصًا علميًا بالفرنسية دون إتقانها، فهناك سنة تأهيل في مركز اللغات الدولي التابع للوكالة المغربية للتعاون الدولي بالرباط.\n\n## الاختبارات\n\n- جامعة الأخوين: TOEFL أو IELTS لمن لم يدرس بالإنجليزية، واختبارات تحديد مستوى.\n- UM6P: مستوى B2 في لغة البرنامج غالبًا.',
      '## The big picture\n\n- **French:** medicine, pharmacy, sciences, engineering, economics and management at public universities.\n- **Arabic:** Arabic language and literature, Islamic studies and part of law; Al-Qarawiyyin entirely.\n- **English:** Al Akhawayn (American system), a number of UM6P programmes, and some programmes at UIR and the Euromed University.\n\n## What this means for Arabic-speaking students\n\nArabic-taught tracks are the cheapest and fastest. If you want a French-taught science degree without being fluent, there is a preparation year at AMCI’s international language centre in Rabat.\n\n## Tests\n\n- Al Akhawayn: TOEFL or IELTS if you were not taught in English, plus placement tests.\n- UM6P: usually B2 in the language of the programme.',
    ),
  },
]

export const navigation = {
  header: [
    {
      label: L('الدراسة', 'Study'),
      href: '/universities',
      children: [
        { label: L('الجامعات', 'Universities'), href: '/universities', description: L('مقارنة الجامعات العمومية والخاصة', 'Public and private universities, compared') },
        { label: L('البرامج', 'Programmes'), href: '/programs', description: L('إجازة، ماستر، دكتوراه، طب ولغات', "Bachelor's, master's, PhD, medicine and language") },
        { label: L('المدن', 'Cities'), href: '/cities', description: L('أين تعيش وتدرس، بتكاليف واقعية', 'Where to live and study, with real costs') },
        { label: L('المنح', 'Scholarships'), href: '/scholarships', description: L('خيارات التمويل للطلبة الدوليين', 'Funding options for international students') },
        { label: L('حاسب التكاليف', 'Cost calculator'), href: '/cost-calculator', description: L('قدّر ميزانيتك السنوية بعملتك', 'Estimate your yearly budget in your currency') },
      ],
    },
    {
      label: L('من نخدم', 'Who we help'),
      href: '/gulf-students',
      children: [
        { label: L('طلبة الخليج', 'Gulf students'), href: '/gulf-students', description: L('القبول مع ضمان شروط المعادلة', 'Admission with recognition rules covered') },
        { label: L('طلبة المشرق والعراق', 'Levant & Iraq'), href: '/levant-iraq-students', description: L('دراسة بالعربية وبكلفة معقولة', 'Arabic-taught and affordable') },
        { label: L('العائلات من بريطانيا وأوروبا', 'Families from the UK & Europe'), href: '/families-uk-europe', description: L('انتقال العائلة والمدارس', 'Family relocation and schools') },
        { label: L('طلبة إفريقيا', 'African students'), href: '/african-students', description: L('منح وبرامج بالفرنسية والإنجليزية', 'Scholarships and French/English programmes') },
      ],
    },
    { label: L('الخدمات', 'Services'), href: '/services' },
    { label: L('الأدلة', 'Guides'), href: '/blog' },
    { label: L('الأسئلة الشائعة', 'FAQ'), href: '/faq' },
    { label: L('من نحن', 'About'), href: '/about' },
  ],
  footerNote: L(
    '«الدراسة في المغرب» خدمة إرشاد وقبول ودعم طلابي تديرها أكاديمية KNO. نحن جهة استشارية مستقلة ولسنا جامعة.',
    'Studying in Morocco is a student placement and support service operated by KNO Academy. We are an independent advisor, not a university.',
  ),
}

export const siteSettings = {
  siteName: L('الدراسة في المغرب', 'Studying in Morocco'),
  tagline: L('بوابتك الموثوقة إلى الجامعات المغربية', 'Your trusted gateway to universities in Morocco'),
  organization: L('أكاديمية KNO', 'KNO Academy'),
  announcement: {
    enabled: true,
    text: L('جديد 2026-2027: لا معادلة ولا مباراة للطلبة الدوليين الجدد في الجامعات العمومية', 'New for 2026–27: no equivalence and no entrance exam for new international students at public universities'),
    href: '/blog/admission-moroccan-public-universities-2026-2027',
  },
  // Placeholders — replace with the real KNO Academy contact details before launch.
  email: 'admissions@example.com',
  phone: '+212 600 000 000',
  whatsapp: '212600000000',
  address: L('الرباط، المغرب', 'Rabat, Morocco'),
  officeHours: L('الاثنين – الجمعة، 9:00 – 18:00 (بتوقيت المغرب)', 'Monday – Friday, 9:00 – 18:00 (Morocco time)'),
  defaultDescription: L(
    'ادرس في المغرب بثقة: قبول جامعي، وسكن، واستقبال في المطار، ودعم أكاديمي للطلبة والعائلات من الخليج والمشرق وأوروبا وإفريقيا.',
    'Study in Morocco with confidence: university placement, accommodation, airport pickup and academic support for students and families from the Gulf, the Levant, Europe and Africa.',
  ),
}

export const calculator = {
  ratesUpdated: '2026-10-26',
  rates: [
    { currency: 'USD', madPerUnit: 9.2 },
    { currency: 'EUR', madPerUnit: 10.7 },
    { currency: 'GBP', madPerUnit: 12.3 },
    { currency: 'OMR', madPerUnit: 23.93 },
    { currency: 'AED', madPerUnit: 2.505 },
    { currency: 'SAR', madPerUnit: 2.453 },
    { currency: 'QAR', madPerUnit: 2.527 },
    { currency: 'KWD', madPerUnit: 30.0 },
    { currency: 'BHD', madPerUnit: 24.47 },
    { currency: 'JOD', madPerUnit: 12.98 },
    { currency: 'IQD', madPerUnit: 0.00702 },
    { currency: 'XOF', madPerUnit: 0.01631 },
  ],
  tuition: { publicFlexible: 15000, privateMin: 50000, privateMax: 130000, oneTimeSetup: 6000, insurancePerYear: 3000 },
  benchmarks: [
    { label: L('المملكة المتحدة (طالب دولي)', 'United Kingdom (international student)'), tuition: 22000, living: 12500, currency: 'GBP', note: L('متوسط رسوم الإجازة الدولية؛ لندن أغلى', 'Average international undergraduate fees; London costs more') },
    { label: L('الولايات المتحدة', 'United States'), tuition: 29000, living: 15000, currency: 'USD', note: L('جامعة عمومية لطالب من خارج الولاية', 'Public university, out-of-state rate') },
    { label: L('فرنسا (خارج الاتحاد الأوروبي)', 'France (non-EU student)'), tuition: 2895, living: 11000, currency: 'EUR', note: L('رسوم الإجازة العمومية لغير الأوروبيين', 'Public bachelor’s fees for non-EU students') },
    { label: L('ألمانيا', 'Germany'), tuition: 600, living: 11904, currency: 'EUR', note: L('رسوم الفصل؛ الحد الأدنى للحساب المجمد', 'Semester fees; blocked-account minimum') },
  ],
  disclaimer: L(
    'تقديرات للتخطيط فقط. أسعار الصرف والرسوم تتغير — نؤكد الأرقام الدقيقة خلال الاستشارة.',
    'Estimates for planning only. Exchange rates and fees change — we confirm exact figures during your consultation.',
  ),
}

/** Unpublished examples showing editors the format. Only publish real testimonials, with consent. */
export const sampleTestimonials = [
  {
    name: 'Sample — replace before publishing',
    country: 'OM',
    rating: 5,
    published: false,
    quote: L('مثال على شهادة طالب. استبدله بشهادة حقيقية بعد الحصول على موافقة الطالب الكتابية.', 'Example student testimonial. Replace it with a real one once you have the student’s written consent.'),
    university: L('جامعة محمد الخامس', 'Mohammed V University'),
    program: L('ماستر', 'Master’s'),
  },
]
