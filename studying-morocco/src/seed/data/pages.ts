import { L, MD } from '../helpers'

const cta = (heading: ReturnType<typeof L>, text: ReturnType<typeof L>) => ({
  blockType: 'cta',
  variant: 'dark',
  heading,
  text,
  primaryCta: { label: L('احجز استشارة مجانية', 'Book a free consultation'), href: '/consultation' },
  secondaryCta: { label: L('قدّم الآن', 'Apply now'), href: '/apply' },
})

const journey = {
  blockType: 'processSteps',
  eyebrow: L('كيف نعمل', 'How it works'),
  heading: L('رحلتك في ست خطوات واضحة', 'Your journey in six clear steps'),
  intro: L('فريق واحد يرافقك من أول سؤال حتى أول محاضرة — وبعدها.', 'One team with you from the first question to your first lecture — and beyond.'),
  steps: [
    { title: L('استشارة مجانية', 'Free consultation'), text: L('نفهم أهدافك ومؤهلاتك وميزانيتك، ونجيب عن كل أسئلتك.', 'We understand your goals, qualifications and budget, and answer every question.'), duration: L('30 دقيقة', '30 minutes') },
    { title: L('اختيار البرنامج', 'Choose your programme'), text: L('قائمة مختارة من الجامعات والبرامج مع التكاليف والآجال.', 'A shortlist of universities and programmes with costs and deadlines.'), duration: L('3–5 أيام', '3–5 days') },
    { title: L('الموافقة المسبقة', 'Prior approval'), text: L('نتحقق من شروط المعادلة في بلدك قبل أي التزام مالي.', 'We check your home country’s recognition rules before any payment.'), duration: L('حسب بلدك', 'Depends on your country') },
    { title: L('الملف والقبول', 'Application & offer'), text: L('نجهّز ملفك ونودعه عبر القناة الصحيحة ونتابعه حتى خطاب القبول.', 'We prepare and submit your file through the right channel and follow it to the offer.'), duration: L('2–8 أسابيع', '2–8 weeks') },
    { title: L('السفر والسكن', 'Travel & housing'), text: L('سكن مختار، واستقبال في المطار، وتنقل إلى سكنك.', 'Chosen housing, airport pickup and a transfer to your new home.'), duration: L('قبل الدخول الجامعي', 'Before term starts') },
    { title: L('الاستقرار والدعم', 'Settle in & succeed'), text: L('بطاقة الإقامة، والتسجيل النهائي، والدعم الأكاديمي طوال دراستك.', 'Residence card, final registration and academic support throughout your studies.'), duration: L('طوال الدراسة', 'Throughout your studies') },
  ],
}

export const homePage = {
  slug: 'home',
  _status: 'published',
  title: L('الرئيسية', 'Home'),
  meta: {
    title: L('الدراسة في المغرب — قبول جامعي وسكن ودعم للطلبة العرب والدوليين', 'Study in Morocco — university placement, housing & support for international students'),
    description: L(
      'ادرس في المغرب بثقة مع أكاديمية KNO: قبول في الجامعات العمومية والخاصة، سكن، استقبال في المطار، دعم أكاديمي، وإرشاد في المعادلة لطلبة الخليج.',
      'Study in Morocco with KNO Academy: admission to public and private universities, housing, airport pickup, academic support and degree-recognition guidance for Gulf students.',
    ),
  },
  layout: [
    {
      blockType: 'hero',
      variant: 'home',
      eyebrow: L('الدراسة في المغرب · نستقبل طلبات العام الجامعي 2027–2028', 'Study in Morocco · Now advising for the 2027–28 academic year'),
      heading: L('تعليم بمستوى عالمي، وثقافة قريبة منك، بجزء بسيط من التكلفة.', 'World-class study, a welcoming culture, at a fraction of the cost.'),
      subheading: L(
        'نساعد الطلبة والعائلات من الخليج والمشرق وأوروبا وإفريقيا على الالتحاق بالجامعات المغربية — ونتولى كل ما يحيط بالدراسة: السكن، والاستقبال في المطار، والتنقل، والدعم الأكاديمي.',
        'We place students and families from the Gulf, the Levant, Europe and Africa at Moroccan universities — and handle everything around it: housing, airport pickup, transport and academic support.',
      ),
      primaryCta: { label: L('ابدأ طلبك', 'Start your application'), href: '/apply' },
      secondaryCta: { label: L('استشارة مجانية', 'Free consultation'), href: '/consultation' },
      chips: [
        { text: L('دراسة مجانية في الجامعات العمومية', 'Free tuition at public universities') },
        { text: L('دخول بلا تأشيرة لمواطني الخليج', 'Visa-free entry for GCC citizens') },
        { text: L('برامج بالعربية والفرنسية والإنجليزية', 'Programmes in Arabic, French & English') },
      ],
      showSearch: true,
    },
    { blockType: 'stats' },
    {
      blockType: 'featureGrid',
      eyebrow: L('لماذا المغرب', 'Why Morocco'),
      heading: L('خيار ذكي لمستقبلك — ولميزانية عائلتك', 'A smart choice for your future — and your family’s budget'),
      intro: L('جامعات عريقة، وبيئة عربية مسلمة آمنة، وكلفة أقل بكثير من أوروبا وأمريكا الشمالية.', 'Respected universities, a safe Arab-Muslim environment and costs far below Europe and North America.'),
      items: [
        { icon: 'wallet', stat: L('0 درهم', '0 MAD'), title: L('دراسة مجانية في الجامعات العمومية', 'Free tuition at public universities'), text: L('التكوين بالتوقيت العادي في الجامعات العمومية مجاني للطالب الأجنبي كما للمغربي. الكلفة الحقيقية هي السكن والمعيشة.', 'Regular-track study at public universities is free for international students, just as for Moroccans. Your real costs are housing and living.') },
        { icon: 'badge-check', title: L('قبول أسهل منذ 2026', 'Easier admission since 2026'), text: L('لا معادلة مسبقة ولا مباراة ولوج للطالب الدولي الجديد — دراسة الملف فقط.', 'No prior equivalence and no entrance exam for new international students — file review only.') },
        { icon: 'plane', title: L('بلا تأشيرة لمواطني الخليج', 'Visa-free for GCC citizens'), text: L('دخول مباشر بجواز السفر العادي، ثم بطاقة إقامة بعد 90 يومًا.', 'Enter on your ordinary passport, then a residence card after 90 days.') },
        { icon: 'moon-star', title: L('بيئة مسلمة مألوفة', 'A familiar Muslim environment'), text: L('طعام حلال، مساجد في كل حي، وقيم عائلية — بعيدًا عن العنصرية والإسلاموفوبيا.', 'Halal food, mosques in every neighbourhood and family values — far from racism and Islamophobia.') },
        { icon: 'languages', title: L('عربي، فرنسي، إنجليزي', 'Arabic, French, English'), text: L('مسالك عربية في الآداب والشريعة والقانون، وفرنسية في العلوم، وإنجليزية في جامعات متميزة.', 'Arabic tracks in letters, Sharia and law; French in sciences; English at leading universities.') },
        { icon: 'globe', stat: L('3 ساعات', '3 hours'), title: L('بين أوروبا وإفريقيا والخليج', 'Between Europe, Africa and the Gulf'), text: L('رحلات مباشرة إلى لندن وباريس ومدريد في نحو ثلاث ساعات، وإلى عواصم الخليج.', 'Direct flights to London, Paris and Madrid in about three hours, and to Gulf capitals.') },
      ],
    },
    {
      blockType: 'audiences',
      eyebrow: L('من نخدم', 'Who we help'),
      heading: L('دعم مصمم وفق بلدك وظروفك', 'Support designed around where you come from'),
      items: [
        { icon: 'sun', title: L('طلبة الخليج', 'Gulf students'), text: L('عُمان، الإمارات، قطر، السعودية، الكويت، البحرين — مع ضمان شروط المعادلة.', 'Oman, UAE, Qatar, KSA, Kuwait, Bahrain — with your recognition rules covered.'), href: '/gulf-students' },
        { icon: 'book-open', title: L('طلبة المشرق والعراق', 'Levant & Iraq'), text: L('الأردن، لبنان، سوريا، العراق — دراسة بالعربية وبكلفة في المتناول.', 'Jordan, Lebanon, Syria, Iraq — Arabic-taught options at affordable costs.'), href: '/levant-iraq-students' },
        { icon: 'users', title: L('العائلات من بريطانيا وأوروبا', 'Families from the UK & Europe'), text: L('حياة أقل كلفة، ومدارس جيدة، وبيئة تحترم هويتكم.', 'A more affordable life, good schools and an environment that respects your identity.'), href: '/families-uk-europe' },
        { icon: 'compass', title: L('طلبة إفريقيا جنوب الصحراء', 'Sub-Saharan Africa'), text: L('منح الوكالة والجامعات، وبرامج بالفرنسية والإنجليزية.', 'AMCI and university scholarships, French- and English-taught programmes.'), href: '/african-students' },
      ],
    },
    {
      blockType: 'servicesGrid',
      onlyFeatured: true,
      eyebrow: L('دعم متكامل', 'End-to-end support'),
      heading: L('نتولى كل شيء، من أول سؤال إلى أول محاضرة', 'Everything handled, from first question to first lecture'),
      intro: L('القبول، والسكن، والاستقبال في المطار، والتنقل، والدعم الأكاديمي — فريق واحد مسؤول.', 'Admission, housing, airport pickup, transport and academic support — one accountable team.'),
    },
    {
      blockType: 'universitiesShowcase',
      limit: 6,
      eyebrow: L('الجامعات', 'Universities'),
      heading: L('جامعات عريقة، مختارة بعناية', 'Respected universities, carefully selected'),
      intro: L('جامعات عمومية مجانية وجامعات خاصة بالإنجليزية والفرنسية — قارن ثم اختر.', 'Free public universities and English- and French-taught private universities — compare, then choose.'),
    },
    {
      blockType: 'costComparison',
      eyebrow: L('مقارنة التكاليف', 'Costs compared'),
      heading: L('كم تكلف سنة دراسية فعلًا؟', 'What a year of study really costs'),
      intro: L('الرسوم والمعيشة لسنة واحدة، مقارنة بالوجهات الأكثر طلبًا.', 'Tuition plus living costs for one year, compared with popular destinations.'),
    },
    {
      blockType: 'citiesShowcase',
      limit: 6,
      eyebrow: L('المدن', 'Cities'),
      heading: L('اختر المدينة التي تناسب حياتك', 'Choose the city that fits your life'),
      intro: L('من الرباط الهادئة إلى الدار البيضاء النابضة وفاس العلمية وإفران الجبلية.', 'From calm Rabat to buzzing Casablanca, scholarly Fes and mountain Ifrane.'),
    },
    journey,
    { blockType: 'testimonials', eyebrow: L('تجارب الطلبة', 'Student stories'), heading: L('بكلماتهم', 'In their own words') },
    {
      blockType: 'faq',
      limit: 6,
      eyebrow: L('أسئلة', 'Questions'),
      heading: L('الأسئلة الشائعة', 'Frequently asked questions'),
      intro: L('إجابات واضحة حول القبول والمعادلة والتكاليف والحياة في المغرب.', 'Straight answers on admission, recognition, costs and life in Morocco.'),
    },
    {
      blockType: 'postsFeed',
      limit: 3,
      eyebrow: L('الأدلة', 'Guides'),
      heading: L('خطّط بأدلة من الخبراء', 'Plan with expert guides'),
    },
    cta(L('جاهز لبدء رحلتك الدراسية في المغرب؟', 'Ready to start your studies in Morocco?'), L('احجز استشارتك المجانية اليوم، وسنرسم معك الطريق كاملًا.', 'Book your free consultation today and we’ll map out the whole journey with you.')),
  ],
}

export const audiencePages = [
  {
    slug: 'gulf-students',
    _status: 'published',
    title: L('طلبة الخليج', 'Gulf students'),
    meta: {
      title: L('الدراسة في المغرب لطلبة الخليج — قبول ومعادلة مضمونة الخطوات', 'Study in Morocco for Gulf students — admission with recognition covered'),
      description: L('دليل طلبة عُمان والإمارات وقطر والسعودية والكويت والبحرين: القبول في الجامعات المغربية، الموافقة المسبقة، المعادلة، السكن والدعم.', 'For students from Oman, UAE, Qatar, Saudi Arabia, Kuwait and Bahrain: admission to Moroccan universities, prior approval, recognition, housing and support.'),
    },
    layout: [
      {
        blockType: 'hero',
        variant: 'page',
        eyebrow: L('عُمان · الإمارات · قطر · السعودية · الكويت · البحرين', 'Oman · UAE · Qatar · Saudi Arabia · Kuwait · Bahrain'),
        heading: L('ادرس في المغرب، وعُد بشهادة معترف بها في بلدك', 'Study in Morocco — and come home with a recognised degree'),
        subheading: L(
          'القبول في المغرب أصبح أسهل منذ 2026. التحدي الحقيقي هو المعادلة عند العودة — ونحن نبدأ من هنا: الموافقة المسبقة، والقائمة الموصى بها، والدراسة الحضورية المنتظمة.',
          'Admission in Morocco became easier in 2026. The real challenge is recognition back home — and that is where we start: prior approval, the recommended list and regular in-person study.',
        ),
        primaryCta: { label: L('احجز استشارة مجانية', 'Book a free consultation'), href: '/consultation' },
        secondaryCta: { label: L('قدّم الآن', 'Apply now'), href: '/apply' },
      },
      {
        blockType: 'featureGrid',
        eyebrow: L('لماذا يختار طلبة الخليج المغرب', 'Why Gulf students choose Morocco'),
        heading: L('قريب منك ثقافيًا، وأقل كلفة بكثير', 'Culturally close, and far more affordable'),
        items: [
          { icon: 'plane', title: L('دخول بلا تأشيرة', 'Visa-free entry'), text: L('بجواز السفر العادي، ثم بطاقة إقامة طلابية بعد 90 يومًا.', 'On your ordinary passport, then a student residence card after 90 days.') },
          { icon: 'book-open', title: L('مسالك بالعربية', 'Arabic-taught tracks'), text: L('الآداب والدراسات الإسلامية وجزء من القانون بالعربية — أقصر طريق وأقل كلفة.', 'Letters, Islamic studies and part of law in Arabic — the shortest and cheapest route.') },
          { icon: 'wallet', title: L('دراسة مجانية في الجامعات العمومية', 'Free public tuition'), text: L('في التوقيت العادي، مع معيشة بين 4.000 و7.000 درهم شهريًا.', 'On the regular track, with living costs of MAD 4,000–7,000 a month.') },
          { icon: 'badge-check', title: L('المعادلة أولًا', 'Recognition first'), text: L('نتحقق من القائمة الموصى بها في بلدك قبل أي التزام مالي.', 'We check your country’s recommended list before any financial commitment.') },
          { icon: 'shield-check', title: L('رعاية الطالبات', 'Care for female students'), text: L('سكن وتنقل آمنان ومتابعة منتظمة مع الأسرة.', 'Safe housing and transport, with regular family updates.') },
          { icon: 'moon-star', title: L('بيئة مسلمة مألوفة', 'A familiar Muslim environment'), text: L('حلال، مساجد، وعادات قريبة من بيئتك.', 'Halal food, mosques and customs close to home.') },
        ],
      },
      {
        blockType: 'richText',
        narrow: true,
        content: MD(
          '## الموافقة المسبقة: الخطوة الأولى قبل التسجيل\n\nالطالب الخليجي يعبر بوابتين: بوابة المغرب (وقد أصبحت أسهل)، وبوابة بلده التي تقرر قيمة الشهادة عند العودة. **أي تسجيل قبل الحصول على الموافقة المسبقة قد ينتهي بشهادة غير معادَلة.**\n\n- **سلطنة عُمان:** «طلب مواصلة دراسة» إلكترونيًا وموافقة كتابية قبل الالتحاق، مع مؤسسة وتخصص ضمن القائمة الموصى بها ونظام دراسة معتمد.\n- **السعودية:** موافقة مسبقة لمن يدرس على حسابه، والمؤسسة والبرنامج ضمن قائمة الوزارة، مع انتظام حضوري.\n- **قطر:** موافقة مسبقة قبل بدء الدراسة لمن يدرس على نفقته أو نفقة جهة عمله، بخطاب قبول غير مشروط.\n- **الإمارات:** مؤسسة معتمدة من الجهة الرسمية في بلد الدراسة طيلة مدة الدراسة، والتحقق من المؤهل عبر Quadra Bay أو DataFlow.\n- **الكويت والبحرين:** نرجع معك إلى الجهة الوطنية المختصة قبل التسجيل.\n\n> سابقة مفيدة: عادلت اللجنة العُمانية دكتوراه في التواصل الإداري وتنمية الموارد البشرية من جامعة محمد الأول بوجدة (2021).\n\nالمعلومات أعلاه مأخوذة من مصادر رسمية حتى أكتوبر 2026، وتتغير الأنظمة؛ نتحقق منها معك في كل حالة.',
          '## Prior approval: the first step before you enrol\n\nGulf students pass through two gates: Morocco’s (now easier) and their own country’s, which decides what the degree is worth back home. **Enrolling before you have prior approval can leave you with an unrecognised degree.**\n\n- **Oman:** an online “continuing studies” request and written approval before enrolling, with an institution and programme on the recommended list and an approved mode of study.\n- **Saudi Arabia:** prior approval for self-funded students, an institution and programme on the ministry’s list, and regular attendance.\n- **Qatar:** prior approval before starting, for self- or employer-funded students, with an unconditional offer letter.\n- **UAE:** an institution accredited by the official authority in the country of study for the whole programme, and qualification verification via Quadra Bay or DataFlow.\n- **Kuwait and Bahrain:** we check with the national authority together before you enrol.\n\n> A useful precedent: Oman’s committee recognised a doctorate in administrative communication and HR development from Mohammed I University, Oujda (2021).\n\nThis information comes from official sources up to October 2026; rules change, so we verify it with you case by case.',
        ),
      },
      journey,
      { blockType: 'faq', category: 'gcc', limit: 6, eyebrow: L('أسئلة', 'Questions'), heading: L('أسئلة طلبة الخليج', 'Questions from Gulf students') },
      cta(L('ابدأ بالخطوة الصحيحة', 'Start with the right step'), L('احجز استشارة مجانية لنراجع معك شروط المعادلة في بلدك قبل اختيار الجامعة.', 'Book a free consultation and we’ll review your country’s recognition rules before you choose a university.')),
    ],
  },
  {
    slug: 'families-uk-europe',
    _status: 'published',
    title: L('العائلات من بريطانيا وأوروبا', 'Families from the UK & Europe'),
    meta: {
      title: L('الانتقال إلى المغرب للعائلات من بريطانيا وأوروبا — دراسة ومدارس وسكن', 'Relocating to Morocco from the UK & Europe — studies, schools and housing'),
      description: L('حياة أقل كلفة، ومدارس دولية وفرنسية، وجامعات مجانية، وبيئة مسلمة تحترم هويتكم. نرافقكم من الزيارة الاستكشافية إلى الاستقرار.', 'Lower living costs, international and French schools, free public universities and a Muslim environment that respects your identity. We support you from scouting visit to settling in.'),
    },
    layout: [
      {
        blockType: 'hero',
        variant: 'page',
        eyebrow: L('للعائلات من بريطانيا وأوروبا', 'For families in the UK & Europe'),
        heading: L('حياة أهدأ، وكلفة أقل، ومستقبل أفضل لأطفالكم', 'A calmer life, lower costs and a brighter future for your children'),
        subheading: L(
          'ارتفاع كلفة المعيشة ورسوم المدارس، والشعور بالغربة أو التمييز — أسباب تدفع عائلات كثيرة إلى التفكير في المغرب. نساعدكم على اتخاذ القرار بالأرقام، ثم ننفذه معكم خطوة بخطوة.',
          'Rising living costs and school fees, and the feeling of not belonging or facing discrimination, lead many families to consider Morocco. We help you decide with real numbers — then make it happen, step by step.',
        ),
        primaryCta: { label: L('احجز استشارة عائلية مجانية', 'Book a free family consultation'), href: '/consultation' },
        secondaryCta: { label: L('خدمة انتقال العائلة', 'Family relocation service'), href: '/services/family-relocation-schools' },
      },
      {
        blockType: 'comparison',
        eyebrow: L('بالأرقام', 'By the numbers'),
        heading: L('بريطانيا مقارنة بالمغرب', 'The UK compared with Morocco'),
        intro: L('أرقام تقريبية لأسرة في مدينة كبرى. الفروق الحقيقية تختلف حسب المدينة ونمط الحياة.', 'Approximate figures for a family in a major city. Actual differences vary with city and lifestyle.'),
        labelA: L('المملكة المتحدة', 'United Kingdom'),
        labelB: L('المغرب (الرباط / الدار البيضاء)', 'Morocco (Rabat / Casablanca)'),
        rows: [
          { label: L('الرسوم الجامعية', 'University tuition'), a: L('9.535 جنيه سنويًا (للمقيمين)', '£9,535 a year (home students)'), b: L('مجانية في الجامعات العمومية', 'Free at public universities') },
          { label: L('مدرسة خاصة / دولية للطفل', 'Private / international school per child'), a: L('نحو 18.000–21.000 جنيه سنويًا', 'About £18,000–21,000 a year'), b: L('نحو 40.000–90.000 درهم (≈ 3.300–7.300 جنيه)', 'About MAD 40,000–90,000 (≈ £3,300–7,300)') },
          { label: L('إيجار شقة عائلية (غرفتان)', 'Family flat rent (2 bedrooms)'), a: L('1.200–2.200 جنيه شهريًا', '£1,200–2,200 a month'), b: L('6.000–9.000 درهم (≈ 490–730 جنيه)', 'MAD 6,000–9,000 (≈ £490–730)') },
          { label: L('بيئة البيت والهوية', 'Home environment & identity'), a: L('أقلية، مع تحديات الاندماج', 'A minority, with integration challenges'), b: L('بلد مسلم: حلال، مساجد، قيم عائلية', 'A Muslim country: halal, mosques, family values') },
          { label: L('القرب من الأهل في أوروبا', 'Distance to family in Europe'), a: L('—', '—'), b: L('نحو 3 ساعات طيران', 'About 3 hours’ flight') },
        ],
        footnote: L('مصادر تقديرية 2025–2026؛ تختلف الرسوم حسب المدرسة والمدينة. نزودكم بعروض دقيقة خلال الاستشارة.', 'Indicative 2025–26 figures; fees vary by school and city. We provide exact quotes during your consultation.'),
      },
      {
        blockType: 'featureGrid',
        eyebrow: L('ما نقدمه للعائلات', 'What we do for families'),
        heading: L('انتقال منظم دون مفاجآت', 'A well-planned move without surprises'),
        items: [
          { icon: 'compass', title: L('زيارة استكشافية', 'Scouting visit'), text: L('برنامج زيارة للأحياء والمدارس والجامعات قبل القرار.', 'A visit programme to neighbourhoods, schools and universities before you decide.') },
          { icon: 'baby', title: L('مدارس للأطفال', 'Schools for your children'), text: L('مناهج بريطانية وأمريكية وفرنسية ومغربية ثنائية اللغة.', 'British, American, French and bilingual Moroccan curricula.') },
          { icon: 'home', title: L('سكن عائلي', 'Family housing'), text: L('أحياء آمنة قريبة من المدرسة والمسجد والخدمات.', 'Safe neighbourhoods close to school, mosque and amenities.') },
          { icon: 'graduation-cap', title: L('الجامعة للأبناء الكبار', 'University for older children'), text: L('قبول في الجامعات المغربية بالفرنسية أو الإنجليزية أو العربية.', 'Admission to Moroccan universities in French, English or Arabic.') },
          { icon: 'file-check', title: L('الإقامة والإجراءات', 'Residence & paperwork'), text: L('الإقامة، والبنك، والتأمين الصحي، والسيارة.', 'Residence, banking, health insurance and car.') },
          { icon: 'heart-pulse', title: L('رعاية مستمرة', 'Ongoing care'), text: L('مستشار مخصص للأسرة خلال السنة الأولى.', 'A dedicated family counselor through the first year.') },
        ],
      },
      { blockType: 'faq', category: 'families', limit: 6, eyebrow: L('أسئلة', 'Questions'), heading: L('أسئلة العائلات', 'Questions from families') },
      cta(L('لنخطط لانتقال عائلتكم معًا', 'Let’s plan your family’s move together'), L('استشارة عائلية مجانية بالعربية أو الإنجليزية، عبر الفيديو أو واتساب.', 'A free family consultation in Arabic or English, by video or WhatsApp.')),
    ],
  },
  {
    slug: 'levant-iraq-students',
    _status: 'published',
    title: L('طلبة المشرق والعراق', 'Students from the Levant & Iraq'),
    meta: {
      title: L('الدراسة في المغرب لطلبة الأردن ولبنان وسوريا والعراق', 'Study in Morocco for students from Jordan, Lebanon, Syria and Iraq'),
      description: L('جامعات مغربية بمسالك عربية ودراسة مجانية في الجامعات العمومية — قبول وسكن ودعم كامل.', 'Moroccan universities with Arabic-taught tracks and free public tuition — admission, housing and full support.'),
    },
    layout: [
      {
        blockType: 'hero',
        variant: 'page',
        eyebrow: L('الأردن · لبنان · سوريا · العراق · فلسطين', 'Jordan · Lebanon · Syria · Iraq · Palestine'),
        heading: L('شهادة جامعية مرموقة، بالعربية، وبكلفة في المتناول', 'A respected degree, in Arabic, at an affordable cost'),
        subheading: L('الجامعات العمومية المغربية مجانية في التوقيت العادي، وتقدم مسالك بالعربية في الآداب والشريعة والقانون. نرافقك في القبول والتأشيرة والسكن.', 'Moroccan public universities are free on the regular track and offer Arabic-taught tracks in letters, Sharia and law. We support you with admission, visas and housing.'),
        primaryCta: { label: L('احجز استشارة مجانية', 'Book a free consultation'), href: '/consultation' },
        secondaryCta: { label: L('تصفح البرامج العربية', 'Browse Arabic-taught programmes'), href: '/programs?lang=ar' },
      },
      {
        blockType: 'featureGrid',
        eyebrow: L('لماذا المغرب', 'Why Morocco'),
        heading: L('الخيار الأقرب لغةً وثقافةً', 'The closest choice in language and culture'),
        items: [
          { icon: 'book-open', title: L('دراسة بالعربية', 'Study in Arabic'), text: L('الآداب، الدراسات الإسلامية، الشريعة، وجزء من القانون.', 'Letters, Islamic studies, Sharia and part of law.') },
          { icon: 'wallet', title: L('رسوم منخفضة', 'Low fees'), text: L('مجانية في التوقيت العادي، ومعيشة معقولة خاصة في فاس ووجدة والقنيطرة.', 'Free on the regular track, with reasonable living costs, especially in Fes, Oujda and Kenitra.') },
          { icon: 'file-check', title: L('التأشيرة والإقامة', 'Visa & residence'), text: L('نرشدك إلى إجراءات التأشيرة حسب جنسيتك، ثم بطاقة الإقامة.', 'We guide you through the visa process for your nationality, then the residence card.') },
        ],
      },
      journey,
      cta(L('ابدأ رحلتك الدراسية', 'Start your study journey'), L('استشارة مجانية لتحديد الجامعة والمسلك الأنسب لك.', 'A free consultation to find the right university and track for you.')),
    ],
  },
  {
    slug: 'african-students',
    _status: 'published',
    title: L('طلبة إفريقيا جنوب الصحراء', 'Students from Sub-Saharan Africa'),
    meta: {
      title: L('الدراسة في المغرب لطلبة إفريقيا جنوب الصحراء — منح وقبول', 'Study in Morocco for Sub-Saharan African students — scholarships & admission'),
      description: L('منح المملكة المغربية، ومنح الجامعات الخاصة، وبرامج بالفرنسية والإنجليزية. نرافقك من الترشيح حتى الوصول.', 'Kingdom of Morocco scholarships, private university scholarships and French- or English-taught programmes. We support you from application to arrival.'),
    },
    layout: [
      {
        blockType: 'hero',
        variant: 'page',
        eyebrow: L('السنغال · كوت ديفوار · مالي · غينيا · نيجيريا · وغيرها', 'Senegal · Côte d’Ivoire · Mali · Guinea · Nigeria · and more'),
        heading: L('المغرب، بوابتك إلى تعليم عالٍ إفريقي متميز', 'Morocco: your gateway to excellent African higher education'),
        subheading: L('منح المملكة المغربية عبر الوكالة المغربية للتعاون الدولي، ومنح سخية في جامعات مثل UM6P والجامعة الدولية للرباط، وبرامج بالفرنسية والإنجليزية.', 'Kingdom of Morocco scholarships through AMCI, generous scholarships at universities such as UM6P and UIR, and French- and English-taught programmes.'),
        primaryCta: { label: L('اكتشف المنح', 'Explore scholarships'), href: '/scholarships' },
        secondaryCta: { label: L('احجز استشارة مجانية', 'Book a free consultation'), href: '/consultation' },
      },
      {
        blockType: 'featureGrid',
        eyebrow: L('فرص التمويل', 'Funding opportunities'),
        heading: L('منح مصممة للطلبة الأفارقة', 'Scholarships designed for African students'),
        items: [
          { icon: 'landmark', title: L('منحة المملكة المغربية', 'Kingdom of Morocco Scholarship'), text: L('حصص ثنائية عبر بلدك، مع منحة شهرية.', 'Bilateral quotas via your country, with a monthly stipend.') },
          { icon: 'sparkles', title: L('UM6P ومؤسسة ابن رشد', 'UM6P & Ibn Rochd Foundation'), text: L('حتى 100% من الرسوم والمعيشة، ونحو 70% من الطلبة ممنوحون.', 'Up to 100% of fees and living costs; about 70% of students funded.') },
          { icon: 'badge-check', title: L('الجامعة الدولية للرباط', 'International University of Rabat'), text: L('تخفيض يقارب 50% للطلبة الأفارقة.', 'About 50% reduction for African students.') },
        ],
      },
      journey,
      cta(L('لنجد المنحة والبرنامج المناسبين لك', 'Let’s find the right scholarship and programme'), L('استشارة مجانية بالفرنسية أو الإنجليزية أو العربية.', 'A free consultation in French, English or Arabic.')),
    ],
  },
]

export const corePages = [
  {
    slug: 'about',
    _status: 'published',
    title: L('من نحن', 'About us'),
    meta: {
      title: L('من نحن — الدراسة في المغرب، خدمة من أكاديمية KNO', 'About us — Studying in Morocco by KNO Academy'),
      description: L('فريق مستقل يرافق الطلبة والعائلات إلى الجامعات المغربية بأمانة ووضوح.', 'An independent team guiding students and families to Moroccan universities with honesty and clarity.'),
    },
    layout: [
      {
        blockType: 'hero',
        variant: 'page',
        eyebrow: L('من نحن', 'About us'),
        heading: L('نرافق الطلبة إلى المغرب بأمانة ووضوح', 'Guiding students to Morocco with honesty and clarity'),
        subheading: L('«الدراسة في المغرب» خدمة من أكاديمية KNO، تجمع الإرشاد الأكاديمي والدعم العملي في مكان واحد.', 'Studying in Morocco is a KNO Academy service that brings academic guidance and practical support together.'),
      },
      {
        blockType: 'richText',
        narrow: true,
        content: MD(
          '## مهمتنا\n\nأن يتخذ كل طالب وكل عائلة قرار الدراسة في المغرب بمعلومات صحيحة وموثقة، وأن يعيشوا التجربة بأمان وثقة.\n\n## ما يميزنا\n\n- **الاستقلالية:** نرشح ما يناسبك، لا ما يناسبنا. القرار الأكاديمي النهائي بيد الجامعة دائمًا.\n- **التحقق:** نعتمد المصادر الرسمية ونذكر تاريخ آخر تحقق، لأن الرسوم والأنظمة تتغير.\n- **المعادلة أولًا:** نبدأ بشروط بلدك قبل أي التزام مالي.\n- **دعم متكامل:** من الاستشارة الأولى حتى التخرج.',
          '## Our mission\n\nTo make sure every student and family decides to study in Morocco with accurate, verified information — and lives the experience safely and confidently.\n\n## What sets us apart\n\n- **Independence:** we recommend what suits you, not us. The final academic decision always rests with the university.\n- **Verification:** we rely on official sources and show when information was last checked, because fees and rules change.\n- **Recognition first:** we start with your home country’s rules before any financial commitment.\n- **End-to-end support:** from the first consultation to graduation.',
        ),
      },
      cta(L('تحدث مع مستشار', 'Talk to a counselor'), L('أول استشارة مجانية ودون التزام.', 'Your first consultation is free and without obligation.')),
    ],
  },
  {
    slug: 'privacy',
    _status: 'published',
    title: L('سياسة الخصوصية', 'Privacy policy'),
    meta: { description: L('كيف نجمع بياناتك ونستخدمها ونحميها.', 'How we collect, use and protect your data.') },
    layout: [
      {
        blockType: 'richText',
        narrow: true,
        content: MD(
          '_نموذج أولي — يُراجع مع مستشار قانوني قبل الإطلاق._\n\n## من نحن\n\nيُدار هذا الموقع من طرف أكاديمية KNO («نحن»)، وهي المسؤولة عن معالجة بياناتك.\n\n## البيانات التي نجمعها\n\n- البيانات التي ترسلها عبر الاستمارات: الاسم، البريد الإلكتروني، الهاتف، الجنسية، المؤهلات، والخدمات المطلوبة.\n- إحصاءات زيارات مجهولة الهوية دون ملفات تعريف الارتباط: الصفحة، الجهاز، البلد، والمصدر. لا نخزن عناوين IP.\n- ملفات تعريف الارتباط التسويقية (Google Analytics وMeta) **فقط** بعد موافقتك.\n\n## كيف نستخدمها\n\nللرد على طلبك، ومتابعة ملفك مع الجامعات ومقدمي الخدمات بموافقتك، وتحسين خدماتنا. لا نبيع بياناتك أبدًا.\n\n## حقوقك\n\nيمكنك طلب الاطلاع على بياناتك أو تصحيحها أو حذفها أو نقلها، أو سحب موافقتك، عبر صفحة «تواصل معنا». يحق للمقيمين في بريطانيا والاتحاد الأوروبي تقديم شكوى إلى سلطة حماية البيانات المختصة.\n\n## مدة الاحتفاظ\n\nنحتفظ بملفات الطلبات طيلة مدة الخدمة ثم لمدة أقصاها ثلاث سنوات، ما لم يفرض القانون مدة أخرى.',
          '_Draft template — to be reviewed by legal counsel before launch._\n\n## Who we are\n\nThis website is operated by KNO Academy (“we”), the controller of your personal data.\n\n## Data we collect\n\n- Data you send through our forms: name, email, phone, nationality, qualifications and the services you request.\n- Anonymous, cookieless visit statistics: page, device, country and source. We do not store IP addresses.\n- Marketing cookies (Google Analytics and Meta) **only** after you consent.\n\n## How we use it\n\nTo answer your request, to process your file with universities and service providers with your consent, and to improve our services. We never sell your data.\n\n## Your rights\n\nYou can ask to access, correct, delete or port your data, or withdraw consent, via our contact page. UK and EU residents may complain to their data protection authority.\n\n## Retention\n\nWe keep application files for the duration of the service and then for up to three years, unless the law requires otherwise.',
        ),
      },
    ],
  },
  {
    slug: 'terms',
    _status: 'published',
    title: L('شروط الخدمة', 'Terms of service'),
    meta: { description: L('شروط استخدام الموقع وخدماتنا.', 'Terms for using this website and our services.') },
    layout: [
      {
        blockType: 'richText',
        narrow: true,
        content: MD(
          '_نموذج أولي — يُراجع مع مستشار قانوني قبل الإطلاق._\n\n## طبيعة الخدمة\n\nنقدم خدمات إرشاد وقبول ودعم طلابي. لسنا جامعة، ولا نضمن القبول؛ القرار الأكاديمي النهائي بيد المؤسسة.\n\n## دقة المعلومات\n\nنتحقق من المعلومات المنشورة بانتظام، لكن الرسوم والآجال والأنظمة قد تتغير. الإعلان الرسمي للمؤسسة أو الجهة الحكومية هو المرجع دائمًا.\n\n## الرسوم والاسترجاع\n\nتُحدد رسوم خدماتنا في عرض مكتوب قبل البدء، مع شروط الاسترجاع الخاصة بكل باقة.',
          '_Draft template — to be reviewed by legal counsel before launch._\n\n## What we provide\n\nWe provide guidance, placement and student-support services. We are not a university and cannot guarantee admission; the final academic decision rests with the institution.\n\n## Accuracy of information\n\nWe verify published information regularly, but fees, deadlines and rules can change. The official notice of the institution or government authority always prevails.\n\n## Fees and refunds\n\nOur service fees are confirmed in a written quote before work starts, together with the refund terms for each package.',
        ),
      },
    ],
  },
]
