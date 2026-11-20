/**
 * Starter content, taken from the foundation's previous WordPress site
 * (theflorencemodupefoundation.com). Only used to fill an empty database;
 * after that, everything is edited in the admin dashboard.
 */
import { db, schema } from "../src/db";
import { defaultSettings } from "../src/lib/site-settings";

const p = (...paras: string[]) => paras.map((t) => `<p>${t}</p>`).join("");
const h3 = (t: string) => `<h3>${t}</h3>`;
const ul = (...items: string[]) => `<ul>${items.map((i) => `<li>${i}</li>`).join("")}</ul>`;
const photos = (group: string, n: number, skip: number[] = []) =>
  Array.from({ length: n }, (_, i) => i + 1)
    .filter((i) => !skip.includes(i))
    .map((i) => `/images/outreach/${group}-${i}.jpg`);

export async function seedContent() {
  await db.insert(schema.settings).values({
    key: "site",
    value: JSON.stringify({
      ...defaultSettings,
      stats: [
        { value: "300", label: "Nupe women empowered" },
        { value: "500+", label: "People fed" },
        { value: "7", label: "Outreach programmes" },
      ],
    }),
  });

  await db.insert(schema.pages).values([
    {
      slug: "who-we-are",
      title: "Who We Are",
      subtitle: "A building with four walls and tomorrow inside",
      heroImage: "/images/img_2316.jpg",
      navGroup: "About",
      sortOrder: 1,
      body:
        p(
          "Florence Modupe Foundation, FMF, is a registered non-governmental organization. Our mission is to provide equitable access to quality education and life-changing skills for Africans, women and children in particular, aimed at developing future leaders.",
          "This is in line with the United Nations Sustainable Development Goals that must be achieved on or before the year 2030. To make this a reality, we partner with individuals, educational institutions, government and communities.",
        ) +
        h3("Our Vision") +
        p("To create a platform that institutionalizes learning and development.") +
        h3("Our Mission") +
        p("Equitable access to quality education and life changing skills for Africans aimed at developing future leaders.") +
        p('Learn more about <a href="/the-challenge">the challenge we are responding to</a> and <a href="/our-approach">our approach</a>.'),
    },
    {
      slug: "core-values",
      title: "Core Values",
      subtitle: "The principles that guide everything we do",
      heroImage: "/images/img_2380.jpg",
      navGroup: "About",
      sortOrder: 2,
      system: true,
      body: "",
    },
    {
      slug: "from-our-founder",
      title: "From Our Founder",
      subtitle: "Dr (Mrs.) Olubukola Abitoye, Founder",
      heroImage: "/images/img_2488.jpg",
      navGroup: "About",
      sortOrder: 3,
      body:
        p(
          "Late Emeritus Professor of Education, Babatunde Fafunwa, in 1994, defined education as the aggregate of all the processes by which a child or young adult develops abilities, attributes, and other forms of behaviours that are of positive value to the society in which he lives. This simple definition by the late Don aptly captures the immeasurable role of education in society and the attainment benefits inherent for every society.",
          "In the spirit of my 40th birthday, my personal and career growth can be attributed or ascribed to the grace of God that is evident in every facet of my journey thus far. The pivotal role of quality education, in spite of challenges faced, provides the platform for my modest achievements. I was born into an average family with regards to disposable income by Nigerian standards, but my parents made education a must-have for my siblings and I.",
          "The knowledge acquired was the best gift ever as this was the foundation upon my building blocks for success in my life. My sojourn in the career world has seen me offer my innate and earned ability in the financial industry with a knack for sterling performance always. I have contributed to the growth of the various organizations I passed through, which consistently earned me accolades from management at different levels. I equally wrote and delivered research papers on financial issues, featured online for further reviews by seasoned professionals.",
          "However, in the view of my modest achievements, I realize that many individuals in our society with exceptional abilities do not have the resources to pursue their career aspirations for a better tomorrow due to the poor state of our economy.",
          "Sadly, as it may, I am desirous through Florence Modupe Foundation to support those lacking the resources to attain quality education and acquire desired skills acquisition for a better tomorrow. The noble foundation was inspired by Goal 4 of the United Nations SDGs, which says that quality education is essential to the growth of Nigeria’s vision in fixing education on or before the year 2030.",
          "Our desire is primed on the above assertion. Hence, we will invest in the educational needs of indigent but creative and brilliant children in Nigeria, irrespective of their religion and tribe.",
          "Thank you,",
          "<strong>Dr. (Mrs) Olubukola Abitoye</strong><br>Founder,<br>Florence Modupe Foundation",
        ),
    },
    {
      slug: "the-team",
      title: "The Team",
      subtitle: "Committed and dedicated individuals",
      heroImage: "/images/img_2427.jpg",
      navGroup: "About",
      sortOrder: 4,
      system: true,
      body:
        p(
          "Florence Modupe Foundation activity is being executed by a team of committed and dedicated individuals who not only give their time but their expertise to the work we do at the foundation.",
        ) +
        h3("How we are organised") +
        ul(
          "Board of Trustees",
          "Founder",
          "Chief Executive Officer",
          "Programme Officers: Orphanage; Adopt a School; Uniform &amp; Book Distribution; Orphanage Care; Skill Development &amp; Women Empowerment",
          "Secretary, Communications Officer, Head of Finance and Volunteers",
        ),
    },
    {
      slug: "milestones",
      title: "Milestones",
      subtitle: "Our 3-year targets",
      heroImage: "/images/img_2452.jpg",
      navGroup: "About",
      sortOrder: 5,
      system: true,
      body: p(
        "For us, our 3-year milestone is stated below. This is important to guide our progress through the years and to give you a glance into what we have to offer in our first 3 years. The milestone will be subjected to a review after the first 3 years elapse.",
      ),
    },
    {
      slug: "the-challenge",
      title: "The Challenge",
      subtitle: "Why educational inclusion matters",
      heroImage: "/images/img_1078.jpg",
      navGroup: "Our Work",
      sortOrder: 6,
      body:
        "<blockquote><p>“All children, no matter where they live or what their circumstances, have the right to quality education.” — UNICEF Declaration</p></blockquote>" +
        p(
          "Also, all women that are less privileged or vulnerable in society are expected to get help in cases whereby soft skills or self-vocational skills gained are also provided with what they need to start up these businesses, as well as cases where women who are vulnerable and can’t really take care of their family are not just empowered but also provided foodstuff to feed their homes. On this basis, the Florence Modupe Foundation was established as a response to a national emergency that has grown beyond what governments alone could tackle. The statement below was quoted from UNICEF’s website.",
        ) +
        "<blockquote><p>“One in every five of the world’s out-of-school children is in Nigeria. Even though primary education is officially free and compulsory, about 10.5 million of the country’s children aged 5 to 14 years are not in school. Only 61% of 6 to 11-year-olds regularly attend primary school, and only 35.6% of children aged 36 to 59 months receive early childhood education. In the north of the country, the picture is even bleaker, with a net attendance rate of 53%. Getting out-of-school children back into education poses a massive challenge.”</p></blockquote>" +
        p(
          "This statement aptly captures the ticking time bomb the country is currently sitting on. For every society that experiences growth and development, education is the bedrock for a society facing a myriad of challenges like ours. The poor educational system is the reason why we are where we are today, which has also been fueled by lack of proper planning for women who are in rural areas and have not been able to escape poverty. We work to ensure that these vulnerable women are also upheld in society and given a sense of belonging by empowering them through provision of things for them to use for their vocational skills, such as setting up small SMEs for them to trade, as well as providing them foodstuff from time to time to help their families.",
          "The poor state of education in Nigeria has contributed to a high rate of unemployment in the country, which hit an all-time high of 27.10% in the second quarter of 2020 according to tradingeconomics.com. Apart from this, access to education has become more expensive as government schools can no longer meet the demand from parents seeking to expand the quality of education. While the available privately owned schools are expensive and way beyond the budget of some of these parents, this has greatly increased the number of children who irrespective of their intellects have been thrown out of school into the streets where they take up odd and menial jobs to survive.",
          "This is a huge challenge that can’t be wished away by mere motivation but by taking concrete steps to address the challenges. For us at Florence Modupe Foundation, this is why we are here: to democratize access to education for children in Nigeria and life-changing skills for the youth, especially the women, empowering them and ensuring that they are better than their yesterday.",
        ),
    },
    {
      slug: "our-approach",
      title: "Our Approach",
      subtitle: "Four areas of intervention",
      heroImage: "/images/img_2328.jpg",
      navGroup: "Our Work",
      sortOrder: 7,
      body:
        p(
          "Realizing the challenges facing the educational sector in the country and the huge number of children out of school, as well as vulnerable women who tend to learn certain skills but have not been provided the enabling environment or the items needed to set up the skills they already learnt, or even food items to take care of their families, the Florence Modupe Foundation will contribute its quota through four-pronged areas of intervention:",
        ) +
        "<ol><li>Scholarship for brilliant but indigent children.</li><li>Adopt a school program.</li><li>Uniforms and book distribution.</li><li>Skills development and empowerment of women.</li></ol>" +
        h3("Scholarship for brilliant but indigent students") +
        p(
          "To help reduce the percentage of children that drop out of school in the country, we will be providing scholarships for brilliant but indigent students in the country. We will be doing this across the northern and southern parts of Nigeria. Beneficiaries of this scholarship will be selected via different means, irrespective of their religion or tribe. Applications can be nominations of brilliant but indigent students in the community. As a gender-sensitive organization driven by the SDGs, we will also ensure equitable gender distribution of the scholarship.",
        ) +
        h3("Adopt-a-School program") +
        p(
          "Through our Adopt-a-School program, we will partner with states across the country to renovate and equip existing educational infrastructures. It is important to state that in our quest for quality education in the country, we will also invest in critical infrastructures that will aid the smooth learning process.",
        ) +
        h3("Uniforms and book distribution") +
        p(
          "Apart from granting scholarships and the Adopt-a-School program, the foundation will also make available uniforms and writing materials for institutions and pupils that need them, in order to keep them in school and ensure they have more positive learning outcomes.",
        ) +
        h3("Skills development and empowerment of women") +
        p(
          "This is a very vital area of what we are doing, and it focuses on women. We help them learn skills like hairdressing, fashion designing, makeup and many other things. We also help them set up small trading shops, empowering them with funds to kickstart these businesses, and we provide food items to help them take care of their families.",
          "Worldwide, the demand for vocational life-changing skills is high. With little access to this training comes a gap we need to fill. As a foundation, we will provide platforms for these women to acquire these skills, while we also partner with existing platforms in tech, fashion, digital skills, makeup, among others, to give more access to others.",
        ),
    },
    {
      slug: "outreach",
      title: "Outreach",
      subtitle: "Out in the community",
      heroImage: "/images/outreach/nupe-women-4.jpg",
      navGroup: "Our Work",
      sortOrder: 8,
      body: p(
        "From empowering women with the tools to start their own businesses to medical outreaches, scholarships and visits to children with special needs, here are some of the ways we have reached out to our communities.",
      ),
    },
    {
      slug: "gallery",
      title: "Gallery",
      subtitle: "Moments from our outreaches",
      heroImage: "/images/outreach/special-kids-3.jpg",
      navGroup: "Our Work",
      sortOrder: 9,
      system: true,
      body: "",
    },
    {
      slug: "news",
      title: "News",
      subtitle: "Updates from the foundation",
      heroImage: "/images/img_2262.jpg",
      sortOrder: 10,
      system: true,
      body: "",
    },
    {
      slug: "contact",
      title: "Contact",
      subtitle: "Got questions? Reach out to us.",
      heroImage: "/images/img_2471.jpg",
      sortOrder: 11,
      system: true,
      body: "",
    },
    {
      slug: "donate",
      title: "Donate",
      subtitle: "Help a child learn and a woman thrive",
      heroImage: "/images/outreach/helen-school-1.jpg",
      showInNav: false,
      sortOrder: 12,
      body:
        p(
          "Your donation helps us provide scholarships, renovate schools, distribute uniforms and books, and empower women with life-changing skills. You can give by bank transfer to the accounts below.",
        ) +
        h3("Naira account") +
        ul("<strong>Account name:</strong> FMF", "<strong>Account number:</strong> 1011904059", "<strong>Bank:</strong> Keystone Bank Limited") +
        h3("USD account") +
        ul("<strong>Account name:</strong> FMF", "<strong>Account number:</strong> 1011906950", "<strong>Bank:</strong> Keystone Bank Limited") +
        p('After making a donation, please <a href="/contact">send us a message</a> so we can thank you. Thank you for your support!'),
    },
  ]);

  await db.insert(schema.heroSlides).values([
    {
      eyebrow: "Building a Better Tomorrow, Today",
      title: "Educational Inclusion In Africa",
      image: "/images/img_2380.jpg",
      ctaLabel: "Who We Are",
      ctaHref: "/who-we-are",
      sortOrder: 1,
    },
    {
      eyebrow: "Skills Development & Women Empowerment",
      title: "Empowering Women, Uplifting Families",
      image: "/images/outreach/nupe-women-4.jpg",
      ctaLabel: "Our Outreach",
      ctaHref: "/outreach",
      sortOrder: 2,
    },
    {
      eyebrow: "Every Child Has A Right To Education",
      title: "No One Left Behind",
      image: "/images/outreach/special-kids-1.jpg",
      ctaLabel: "Donate",
      ctaHref: "/donate",
      sortOrder: 3,
    },
  ]);

  await db.insert(schema.coreValues).values([
    {
      title: "Integrity",
      description:
        "Our strong moral principles ensure our conduct and operations are executed in an honest, transparent and accountable environment.",
      sortOrder: 1,
    },
    { title: "Excellence", description: "Our service delivery is embodied in outstanding success.", sortOrder: 2 },
    {
      title: "Community Collaboration",
      description:
        "We thrive on strategic partnership with our host communities through collaborations and collective responsibilities on set objectives.",
      sortOrder: 3,
    },
    {
      title: "Care",
      description: "We will care and serve our societies to uplift the downtrodden with no one left behind.",
      sortOrder: 4,
    },
  ]);

  // From the organisation chart on the previous site. Names can be added in the admin.
  await db.insert(schema.teamMembers).values([
    { name: "Dr (Mrs.) Olubukola Abitoye", role: "Founder", sortOrder: 1 },
  ]);

  await db.insert(schema.milestones).values([
    {
      date: "300 beneficiaries in 3 years",
      title: "Scholarships",
      description:
        "We plan to reach 300 beneficiaries in 3 years, with an estimate of 100 beneficiaries per annum. This will be done across the country to reflect the geographical diversity in the country.",
      image: "/images/outreach/helen-school-3.jpg",
      sortOrder: 1,
    },
    {
      date: "30 schools in 3 years",
      title: "Adopt a School",
      description:
        "Through our Adopt-a-School program, we will be renovating and equipping 30 schools in 3 years, with a projection of 10 schools per annum. Apart from renovating, some schools will enjoy upgraded infrastructures through the painting of their fences and buildings to make the environment more comfortable for the learning process.",
      sortOrder: 2,
    },
    {
      date: "3 million books · 3,000 uniforms",
      title: "School Uniforms and Books",
      description:
        "We will be giving out 3 million exercise books to pupils and students in government schools in Nigeria, while 3,000 uniforms will be procured and distributed across selected schools in the country in 3 years.",
      sortOrder: 3,
    },
    {
      date: "15,000 women in 3 years",
      title: "Skills Development and Women Empowerment",
      description:
        "Through our Vocational and Skills Development programs, we will reach out to 15,000 women in 3 years across all our areas of interest.",
      image: "/images/outreach/shagamu-women-3.jpg",
      sortOrder: 4,
    },
  ]);

  const gallery = [
    ...["img_1019", "img_1024", "img_1078", "img_1097", "img_1111", "img_1236", "img_2252", "img_2262",
      "img_2306", "img_2316", "img_2328", "img_2380", "img_2427", "img_2452", "img_2471"].map((g) => `/images/${g}.jpg`),
    "/images/founder-event.jpg",
    ...photos("nupe-women", 9),
    ...photos("shagamu-women", 6),
    ...photos("special-kids", 8),
    ...photos("elderly", 15),
    ...photos("helen-school", 5),
    ...photos("medical-surgery", 3),
  ];
  await db.insert(schema.galleryImages).values(gallery.map((src, i) => ({ src, sortOrder: i + 1 })));

  const outreach = (o: {
    slug: string;
    title: string;
    excerpt: string;
    body: string;
    group: string;
    count: number;
    cover?: number;
    skip?: number[];
    videoUrl?: string;
  }) => ({
    slug: o.slug,
    title: o.title,
    excerpt: o.excerpt,
    body: p(o.body),
    coverImage: `/images/outreach/${o.group}-${o.cover ?? 1}.jpg`,
    photos: JSON.stringify(photos(o.group, o.count, o.skip)),
    videoUrl: o.videoUrl ?? "",
    category: "Outreach",
    published: true,
    publishedAt: "",
  });

  // Listed oldest-first so the newest ends up on top (posts without dates sort by id).
  await db.insert(schema.posts).values([
    outreach({
      slug: "helen-school-scholarship-to-bright-students",
      title: "Helen School – Scholarship to Bright Students",
      excerpt: "Florence Modupe Foundation partnered with @fefngo to sponsor 5 bright students from St. Helen’s Unity Secondary School, Ondo State.",
      body: "Florence Modupe Foundation partnered with @fefngo to sponsor 5 bright students from St. Helen’s Unity Secondary School, Ondo State.",
      group: "helen-school",
      count: 5,
      videoUrl: "/videos/helen-school-scholarship.mp4",
    }),
    outreach({
      slug: "school-of-the-blind-visitation",
      title: "School of the Blind Visitation",
      excerpt: "The foundation paid a visit to a school for the blind.",
      body: "The foundation paid a visit to a school for the blind.",
      group: "blind-school",
      count: 5,
      cover: 1,
    }),
    outreach({
      slug: "emergency-medical-surgery-2022",
      title: "Emergency Medical Surgery (2022)",
      excerpt: "Supporting a patient through emergency medical surgery in 2022.",
      body: "In 2022, the foundation supported a patient through an emergency medical surgery.",
      group: "medical-surgery",
      count: 3,
      cover: 3,
    }),
    outreach({
      slug: "end-of-year-party-with-special-kids-2022",
      title: "End Of Year Party With Special Kids (2022)",
      excerpt: "Celebrating the end of 2022 with children with special needs.",
      body: "We celebrated the end of 2022 with an end-of-year party for children with special needs.",
      group: "special-kids",
      count: 8,
    }),
    outreach({
      slug: "medical-outreach-for-the-elderly-in-shagamu",
      title: "Medical Outreach for the Elderly in Shagamu",
      excerpt: "A medical outreach for elderly members of the Shagamu community.",
      body: "The foundation held a medical outreach for elderly members of the community in Shagamu.",
      group: "elderly",
      count: 15,
    }),
    outreach({
      slug: "empowerment-of-300-nupe-women",
      title: "Empowerment of 300 Nupe Women",
      excerpt: "Empowerment of 300 Nupe women with cash of 25,000 Naira and feeding of over 500.",
      body: "Empowerment of 300 Nupe women with cash of 25,000 Naira each, and feeding of over 500 people.",
      group: "nupe-women",
      count: 9,
      cover: 4,
    }),
    outreach({
      slug: "empowerment-of-shagamu-women",
      title: "Empowerment of Shagamu Women",
      excerpt: "Shagamu women who learnt vocational skills received equipment to kick off their businesses.",
      body: "Empowerment of some Shagamu women who learnt vocational skills, with equipment to kick off their businesses.",
      group: "shagamu-women",
      count: 6,
      cover: 3,
    }),
  ]);
}
