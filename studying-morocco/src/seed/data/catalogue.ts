import { L } from '../helpers'

/**
 * Cities and fields of study. Monthly costs are indicative student budgets in
 * MAD (single student, 2026) and are meant to be reviewed by the team.
 */

export const disciplines = [
  { slug: 'business-management', icon: 'briefcase', order: 10, name: L('الأعمال والتسيير', 'Business & Management'), description: L('إدارة الأعمال، التسويق، المحاسبة وريادة الأعمال.', 'Business administration, marketing, accounting and entrepreneurship.') },
  { slug: 'economics-finance', icon: 'wallet', order: 20, name: L('الاقتصاد والمالية', 'Economics & Finance'), description: L('الاقتصاد، المالية والبنوك، والتدبير العمومي.', 'Economics, finance and banking, public management.') },
  { slug: 'engineering', icon: 'cpu', order: 30, name: L('الهندسة والتكنولوجيا', 'Engineering & Technology'), description: L('سلك المهندس، الهندسة الصناعية والطاقية والفضائية.', 'Engineering degrees: industrial, energy, aerospace and more.') },
  { slug: 'computer-science', icon: 'sparkles', order: 40, name: L('علوم الحاسوب والذكاء الاصطناعي', 'Computer Science & AI'), description: L('البرمجة، علوم البيانات والذكاء الاصطناعي.', 'Software, data science and artificial intelligence.') },
  { slug: 'medicine-health', icon: 'stethoscope', order: 50, name: L('الطب والعلوم الصحية', 'Medicine & Health Sciences'), description: L('الطب، طب الأسنان، الصيدلة والتمريض.', 'Medicine, dentistry, pharmacy and nursing.') },
  { slug: 'law-political-science', icon: 'scale', order: 60, name: L('القانون والعلوم السياسية', 'Law & Political Science'), description: L('القانون الخاص والعام، بمسالك عربية وفرنسية.', 'Private and public law, in Arabic and French tracks.') },
  { slug: 'islamic-studies', icon: 'moon-star', order: 70, name: L('الدراسات الإسلامية والشرعية', 'Islamic Studies & Sharia'), description: L('العلوم الشرعية، القراءات القرآنية وأصول الدين.', 'Sharia sciences, Qur’anic readings and theology.') },
  { slug: 'arabic-humanities', icon: 'book-open', order: 80, name: L('اللغة العربية والعلوم الإنسانية', 'Arabic Language & Humanities'), description: L('اللغة العربية وآدابها، اللسانيات والعلوم الإنسانية.', 'Arabic language and literature, linguistics and the humanities.') },
  { slug: 'international-relations', icon: 'globe', order: 90, name: L('العلاقات الدولية والدبلوماسية', 'International Relations & Diplomacy'), description: L('الدراسات الدولية، الدبلوماسية ودراسات المنطقة.', 'International studies, diplomacy and area studies.') },
  { slug: 'architecture-design', icon: 'palette', order: 100, name: L('العمارة والتصميم', 'Architecture & Design'), description: L('العمارة، التصميم والتعمير.', 'Architecture, design and urbanism.') },
  { slug: 'sciences', icon: 'leaf', order: 110, name: L('العلوم الأساسية', 'Natural & Exact Sciences'), description: L('الفيزياء، الكيمياء، الأحياء والرياضيات.', 'Physics, chemistry, biology and mathematics.') },
]

type CityCosts = [residence: number, shared: number, studio: number, homestay: number, food: number, transport: number, utilities: number, leisure: number]

const costs = ([rentResidence, rentShared, rentStudio, homestay, food, transport, utilities, leisure]: CityCosts) => ({
  rentResidence,
  rentShared,
  rentStudio,
  homestay,
  food,
  transport,
  utilities,
  leisure,
})

export const cities = [
  {
    slug: 'rabat',
    order: 10,
    featured: true,
    artVariant: 'coast',
    name: L('الرباط', 'Rabat'),
    region: L('جهة الرباط-سلا-القنيطرة', 'Rabat-Salé-Kénitra'),
    tagline: L('العاصمة الإدارية والجامعية، على ضفاف الأطلسي', 'The capital — calm, green and right on the Atlantic'),
    summary: L(
      'الخيار الأسهل إداريًا للطالب الدولي: الوكالة المغربية للتعاون الدولي، ووزارة التعليم العالي، ومصلحة معادلة الشهادات، والحي الجامعي الدولي ومركز اللغات كلها في المدينة نفسها.',
      'The easiest city for paperwork: the AMCI agency, the Ministry of Higher Education, the equivalence office, the international student residence and the language centre are all here.',
    ),
    climate: L('متوسطي معتدل، 8–28° م', 'Mild Mediterranean, 8–28 °C'),
    flightTimes: L('مطار الرباط-سلا، وعلى بُعد ساعة من مطار الدار البيضاء الدولي', 'Rabat-Salé airport, one hour from Casablanca international airport'),
    highlights: [
      { text: L('مقر جامعة محمد الخامس، أعرق الجامعات العمومية', 'Home of Mohammed V University, the oldest public university') },
      { text: L('الحي الجامعي الدولي لطلبة الوكالة المغربية للتعاون الدولي', 'International student residence for AMCI-sponsored students') },
      { text: L('مدينة آمنة وهادئة ذات طابع عائلي', 'Safe, quiet and family-friendly') },
      { text: L('ترامواي يربط الرباط بسلا', 'Modern tramway linking Rabat and Salé') },
    ],
    ...costs([1500, 2500, 4500, 4500, 2000, 300, 450, 800]),
  },
  {
    slug: 'casablanca',
    order: 20,
    featured: true,
    artVariant: 'modern',
    name: L('الدار البيضاء', 'Casablanca'),
    region: L('جهة الدار البيضاء-سطات', 'Casablanca-Settat'),
    tagline: L('القلب الاقتصادي للمغرب وأكبر مدنه', 'Morocco’s business capital and largest city'),
    summary: L(
      'أكبر قطب اقتصادي في البلاد، تحتضن جامعة الحسن الثاني بأكثر من 2.400 طالب دولي، وجامعة محمد السادس لعلوم الصحة. فرص تدريب واسعة في المالية والصناعة.',
      'The country’s economic hub, home to Hassan II University (over 2,400 international students) and Mohammed VI University of Health Sciences, with wide internship opportunities.',
    ),
    climate: L('أطلسي معتدل ورطب، 10–27° م', 'Mild, humid Atlantic, 10–27 °C'),
    flightTimes: L('مطار محمد الخامس الدولي: رحلات مباشرة إلى معظم عواصم الخليج وأوروبا', 'Mohammed V International: direct flights to most Gulf and European capitals'),
    highlights: [
      { text: L('أكبر سوق عمل وتدريب في المغرب', 'The largest job and internship market in Morocco') },
      { text: L('رحلات مباشرة إلى الخليج وأوروبا وإفريقيا', 'Direct flights to the Gulf, Europe and Africa') },
      { text: L('مسجد الحسن الثاني وكورنيش عين الذئاب', 'Hassan II Mosque and the Ain Diab corniche') },
    ],
    ...costs([1600, 2800, 5000, 4800, 2100, 400, 450, 900]),
  },
  {
    slug: 'fes',
    order: 30,
    featured: true,
    artVariant: 'imperial',
    name: L('فاس', 'Fes'),
    region: L('جهة فاس-مكناس', 'Fès-Meknès'),
    tagline: L('العاصمة العلمية والروحية، موطن جامعة القرويين', 'The spiritual and scholarly capital, home of Al-Qarawiyyin'),
    summary: L(
      'تجمع فاس ثلاثة خيارات متكاملة للطالب المهتم بالعلوم الشرعية واللغة العربية: جامعة القرويين، وكليات جامعة سيدي محمد بن عبد الله، والجامعة الأورومتوسطية للتخصصات الحديثة، بكلفة معيشة منخفضة.',
      'Fes combines three complementary options: Al-Qarawiyyin for Islamic sciences, Sidi Mohamed Ben Abdellah University for Arabic-taught degrees, and the Euromed University for modern disciplines — at a low cost of living.',
    ),
    climate: L('قاري، صيف حار وشتاء بارد، 5–35° م', 'Continental: hot summers, cool winters, 5–35 °C'),
    flightTimes: L('مطار فاس-سايس الدولي', 'Fès-Saïss international airport'),
    highlights: [
      { text: L('أقدم جامعة في العالم ما تزال تعمل: القرويين (859م)', 'Al-Qarawiyyin (859 CE), the world’s oldest operating university') },
      { text: L('من أقل المدن الجامعية كلفةً للمعيشة', 'One of the most affordable university cities') },
      { text: L('مدينة عتيقة مصنفة تراثًا عالميًا', 'UNESCO World Heritage medina') },
    ],
    ...costs([1200, 1800, 3200, 3800, 1600, 250, 350, 600]),
  },
  {
    slug: 'marrakech',
    order: 40,
    featured: true,
    artVariant: 'desert',
    name: L('مراكش', 'Marrakech'),
    region: L('جهة مراكش-آسفي', 'Marrakech-Safi'),
    tagline: L('المدينة الحمراء: ثقافة نابضة وجامعة كبرى', 'The Red City: vibrant culture and a major university'),
    summary: L(
      'تحتضن جامعة القاضي عياض بكلياتها المتعددة، وتوفر حياة ثقافية غنية ومناخًا مشمسًا طوال السنة، مع ربط جوي مباشر بأوروبا والخليج.',
      'Home to Cadi Ayyad University and its many faculties, with a rich cultural life, year-round sunshine and direct flights to Europe and the Gulf.',
    ),
    climate: L('شبه جاف، مشمس، 6–38° م', 'Semi-arid and sunny, 6–38 °C'),
    flightTimes: L('مطار مراكش المنارة الدولي', 'Marrakech-Menara international airport'),
    highlights: [
      { text: L('جامعة القاضي عياض من أكبر الجامعات المغربية', 'Cadi Ayyad University, one of Morocco’s largest') },
      { text: L('وجهة سياحية عالمية بخدمات ممتازة', 'A world-class destination with excellent services') },
      { text: L('قريبة من جبال الأطلس', 'Close to the Atlas mountains') },
    ],
    ...costs([1400, 2200, 4000, 4300, 1800, 300, 400, 750]),
  },
  {
    slug: 'ifrane',
    order: 50,
    featured: true,
    artVariant: 'mountain',
    name: L('إفران', 'Ifrane'),
    region: L('جهة فاس-مكناس', 'Fès-Meknès'),
    tagline: L('«سويسرا المغرب»: حرم جامعي أمريكي بين غابات الأرز', '“Morocco’s Switzerland”: an American-style campus among cedar forests'),
    summary: L(
      'مدينة جبلية هادئة ونظيفة تحتضن جامعة الأخوين، الجامعة الناطقة بالإنجليزية وفق النظام الأمريكي. يقيم أغلب الطلبة داخل الحرم الجامعي.',
      'A clean, quiet mountain town that hosts Al Akhawayn University, the English-speaking, American-system university. Most students live on campus.',
    ),
    climate: L('جبلي، ثلوج شتاءً وصيف معتدل، -3–30° م', 'Mountain climate: snowy winters, mild summers, −3–30 °C'),
    flightTimes: L('ساعة واحدة من مطار فاس-سايس', 'One hour from Fès-Saïss airport'),
    highlights: [
      { text: L('دراسة بالإنجليزية في جامعة معتمدة أمريكيًا', 'English-taught, US-accredited university') },
      { text: L('بيئة آمنة جدًا ومناسبة لأولياء الأمور', 'Very safe, reassuring for parents') },
      { text: L('سكن جامعي داخل الحرم', 'On-campus housing') },
    ],
    ...costs([3500, 2600, 4200, 4200, 2000, 200, 400, 600]),
  },
  {
    slug: 'tangier-tetouan',
    order: 60,
    artVariant: 'coast',
    name: L('طنجة وتطوان', 'Tangier & Tetouan'),
    region: L('جهة طنجة-تطوان-الحسيمة', 'Tanger-Tétouan-Al Hoceïma'),
    tagline: L('بوابة إفريقيا على أوروبا، على بُعد 14 كم من إسبانيا', 'Africa’s gateway to Europe, 14 km from Spain'),
    summary: L(
      'تحتضن جامعة عبد المالك السعدي، وتجمع بين مدينة صناعية حديثة (طنجة) ومدينة أندلسية هادئة (تطوان)، مع قطار فائق السرعة إلى الرباط والدار البيضاء.',
      'Home to Abdelmalek Essaadi University, combining a modern industrial city (Tangier) and a calm Andalusian town (Tetouan), with a high-speed train to Rabat and Casablanca.',
    ),
    climate: L('متوسطي، 9–30° م', 'Mediterranean, 9–30 °C'),
    flightTimes: L('مطار طنجة ابن بطوطة، وقطار البراق فائق السرعة', 'Tangier Ibn Battouta airport and the Al Boraq high-speed train'),
    highlights: [
      { text: L('قطار البراق: الرباط في ساعة و20 دقيقة', 'Al Boraq high-speed train: Rabat in 1 h 20') },
      { text: L('أكبر ميناء ومنطقة صناعية في المتوسط', 'The Mediterranean’s largest port and industrial zone') },
    ],
    ...costs([1300, 2100, 3800, 4000, 1800, 300, 400, 700]),
  },
  {
    slug: 'agadir',
    order: 70,
    artVariant: 'coast',
    name: L('أكادير', 'Agadir'),
    region: L('جهة سوس-ماسة', 'Souss-Massa'),
    tagline: L('مدينة شاطئية مشمسة بإيقاع حياة مريح', 'A sunny beach city with a relaxed pace'),
    summary: L(
      'تحتضن جامعة ابن زهر، وتتميز بمناخ معتدل طوال العام وكلفة معيشة معقولة وجودة حياة عالية.',
      'Home to Ibn Zohr University, with mild weather all year, reasonable living costs and a high quality of life.',
    ),
    climate: L('معتدل ومشمس، 12–28° م', 'Mild and sunny, 12–28 °C'),
    flightTimes: L('مطار أكادير المسيرة الدولي', 'Agadir Al Massira international airport'),
    highlights: [
      { text: L('أكثر من 300 يوم مشمس سنويًا', 'Over 300 sunny days a year') },
      { text: L('كلفة معيشة أقل من المدن الكبرى', 'Lower living costs than the big cities') },
    ],
    ...costs([1200, 2000, 3500, 3800, 1700, 250, 400, 650]),
  },
  {
    slug: 'kenitra',
    order: 80,
    artVariant: 'modern',
    name: L('القنيطرة', 'Kenitra'),
    region: L('جهة الرباط-سلا-القنيطرة', 'Rabat-Salé-Kénitra'),
    tagline: L('قريبة من الرباط، بكلفة معيشة أقل', 'Close to Rabat, at a lower cost'),
    summary: L(
      'تحتضن جامعة ابن طفيل، على بُعد 30 دقيقة بالقطار من الرباط، مع كلفة سكن ومعيشة أقل بكثير من العاصمة.',
      'Home to Ibn Tofail University, 30 minutes by train from Rabat, with much lower housing and living costs than the capital.',
    ),
    climate: L('أطلسي معتدل، 8–28° م', 'Mild Atlantic, 8–28 °C'),
    flightTimes: L('45 دقيقة من مطار الرباط-سلا', '45 minutes from Rabat-Salé airport'),
    highlights: [
      { text: L('30 دقيقة من الرباط بالقطار', '30 minutes from Rabat by train') },
      { text: L('من أقل المدن كلفةً على الساحل', 'One of the most affordable coastal cities') },
    ],
    ...costs([1000, 1700, 3000, 3500, 1500, 250, 350, 550]),
  },
  {
    slug: 'oujda',
    order: 90,
    artVariant: 'imperial',
    name: L('وجدة', 'Oujda'),
    region: L('جهة الشرق', 'Oriental'),
    tagline: L('عاصمة الشرق المغربي، هادئة وميسورة الكلفة', 'Capital of eastern Morocco — calm and affordable'),
    summary: L(
      'تحتضن جامعة محمد الأول، التي عادلت وزارة التعليم العالي العُمانية دكتوراه صادرة عنها سنة 2021. كلفة معيشة هي الأقل بين المدن الجامعية الكبرى.',
      'Home to Mohammed I University — Oman’s Ministry of Higher Education recognised a doctorate it awarded in 2021. The lowest living costs of the major university cities.',
    ),
    climate: L('شبه جاف، 5–34° م', 'Semi-arid, 5–34 °C'),
    flightTimes: L('مطار وجدة-أنكاد الدولي', 'Oujda-Angads international airport'),
    highlights: [{ text: L('أقل كلفة معيشة بين المدن الجامعية الكبرى', 'The lowest cost of living among major university cities') }],
    ...costs([1000, 1500, 2800, 3300, 1400, 200, 350, 500]),
  },
  {
    slug: 'benguerir',
    order: 100,
    artVariant: 'modern',
    name: L('ابن جرير', 'Benguerir'),
    region: L('جهة مراكش-آسفي', 'Marrakech-Safi'),
    tagline: L('مدينة خضراء ذكية حول جامعة محمد السادس متعددة التخصصات', 'A green smart city built around UM6P'),
    summary: L(
      'مدينة جامعية حديثة تحتضن الحرم الرئيسي لجامعة محمد السادس متعددة التخصصات، على بُعد 45 دقيقة من مراكش.',
      'A modern university town hosting the main campus of Mohammed VI Polytechnic University (UM6P), 45 minutes from Marrakech.',
    ),
    climate: L('شبه جاف، 6–38° م', 'Semi-arid, 6–38 °C'),
    flightTimes: L('45 دقيقة من مطار مراكش', '45 minutes from Marrakech airport'),
    highlights: [
      { text: L('حرم جامعي حديث بمعايير عالمية', 'A world-class modern campus') },
      { text: L('برامج بالإنجليزية في الهندسة والأعمال', 'English-taught engineering and business programmes') },
    ],
    ...costs([2500, 1800, 3200, 3500, 1700, 200, 350, 500]),
  },
]
