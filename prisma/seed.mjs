// Наполнение БД «Гипс Стиль 31» демо-данными (Postgres).
// Запуск: npm run db:seed
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const categories = [
  {
    slug: "decor-brick",
    title: "Декоративный кирпич",
    subtitle: "Лофт, старый кирпич, античный",
    priceFrom: 1680,
    icon: "🧱",
    sortOrder: 1,
    description:
      "Гипсовый декоративный кирпич ручной формовки — основа интерьеров в стиле лофт, сканди и прованс. Каждая плитка отливается малыми партиями и тонируется вручную, поэтому фактура получается живой, с лёгкими перепадами тона и рельефа, как у настоящей кладки. Лёгкий гипс не нагружает стены, дышит и держит микроклимат, а толщина 12–18 мм позволяет оформлять и стены, и углы, и ниши. Подбираем колер бесплатно под ваш интерьер и режем нестандартные форматы под заказ.",
    seoTitle: "Декоративный гипсовый кирпич ручной работы — купить в Губкине | Гипс Стиль 31",
    seoDescription:
      "Декоративный кирпич из гипса ручной формовки: лофт, старый город, английский, белёный. Подбор цвета бесплатно, доставка по РФ. От 1 680 ₽/м².",
  },
  {
    slug: "stone",
    title: "Камень / сланец",
    subtitle: "Рваный, слоистый",
    priceFrom: 1740,
    icon: "🪨",
    sortOrder: 2,
    description:
      "Гипсовый камень и сланец воспроизводят природную фактуру скола и слоистой породы, но весят в разы меньше натурального камня и проще в монтаже. Подходят для акцентных стен, каминных порталов, прихожих и фасадных зон интерьера. Глубокий рельеф и многослойная ручная тонировка дают эффект настоящей каменной кладки.",
    seoTitle: "Гипсовый камень и сланец для стен — Гипс Стиль 31, Губкин",
    seoDescription:
      "Декоративный гипсовый камень и сланец: рваный, слоистый, плитняк. Лёгкий, экологичный, ручная тонировка. От 1 740 ₽/м².",
  },
  {
    slug: "mosaic-3d",
    title: "3D-мозаика, соты",
    subtitle: "Гексагон, соты",
    badge: "Хит",
    priceFrom: 2040,
    icon: "⬡",
    sortOrder: 3,
    description:
      "3D-мозаика и гипсовые соты-гексагоны — современный геометрический декор для акцентных стен, изголовий, зон ТВ и витрин. Объёмный рельеф создаёт игру света и тени и делает поверхность выразительной даже без подсветки. Это наш фирменный мотив: модули стыкуются без видимых швов и собираются в сплошной паттерн любой площади.",
    seoTitle: "3D-мозаика и гипсовые соты гексагон — Гипс Стиль 31",
    seoDescription:
      "Объёмная 3D-мозаика и соты-гексагоны из гипса. Бесшовная раскладка, ручная окраска, любой формат под заказ. От 2 040 ₽/м².",
  },
  {
    slug: "corners",
    title: "Угловые элементы",
    subtitle: "Доборные",
    priceFrom: 320,
    icon: "📐",
    sortOrder: 4,
    description:
      "Угловые (доборные) элементы повторяют фактуру и цвет основной плитки и позволяют аккуратно оформить внешние углы стен, оконные и дверные откосы. Готовый угол избавляет от подрезки и стыковки на 90° — кладка выглядит цельной и профессиональной.",
    seoTitle: "Угловые доборные элементы для гипсовой плитки — Гипс Стиль 31",
    seoDescription:
      "Угловые элементы под декоративный кирпич и камень: аккуратное оформление внешних углов и откосов. В тон коллекции. От 320 ₽/шт.",
  },
  {
    slug: "supplies",
    title: "Расходники",
    subtitle: "Клей, затирка, лак",
    priceFrom: 390,
    icon: "🧴",
    sortOrder: 5,
    description:
      "Всё для монтажа и защиты гипсовой плитки: монтажный клей, затирка для швов и финишный лак-пропитка. Подбираем расходники под конкретную коллекцию и условия помещения, чтобы плитка держалась десятилетиями, а швы и поверхность не пачкались и легко мылись.",
    seoTitle: "Клей, затирка и лак для гипсовой плитки — Гипс Стиль 31",
    seoDescription:
      "Расходники для монтажа гипсовой плитки: монтажный клей, затирка для швов, лак-пропитка. От 390 ₽.",
  },
];

const products = [
  // Декоративный кирпич
  { slug: "kirpich-loft", title: "Кирпич «Лофт»", article: "LF-114", status: "Хит", priceFrom: 1680, colors: ["#C9B79A", "#9C7B5B", "#6E5A48", "#3A332B"], extraColors: 4, categorySlug: "decor-brick", isBestseller: true, sortOrder: 1, size: "210×65×16 мм", coverage: 1.1, weight: "~9 кг/м²", material: "Экологичный гипс", description: "Классический лофт-кирпич с выраженной шероховатой фактурой и потёртыми кромками. Многослойная ручная тонировка даёт эффект состаренной кирпичной кладки — каждая плитка чуть отличается по тону, поэтому стена выглядит живой. Идеален для кухни-гостиной, прихожей и рабочих зон в индустриальном стиле." },
  { slug: "kirpich-staryj-gorod", title: "Кирпич «Старый город»", article: "SG-208", priceFrom: 1780, colors: ["#CDB89A", "#A07C57", "#7C6450"], extraColors: 3, categorySlug: "decor-brick", sortOrder: 2, size: "205×60×15 мм", coverage: 1.0, weight: "~8.5 кг/м²", material: "Экологичный гипс", description: "Кирпич с мягким античным рельефом и сколами, имитирующий кладку исторического центра. Тёплые песочно-терракотовые оттенки хорошо сочетаются с деревом и тёплым светом." },
  { slug: "kirpich-anglijskij", title: "Кирпич «Английский»", article: "EN-077", status: "Новинка", priceFrom: 1820, colors: ["#7E4B3A", "#5E3A2E", "#8C6A52"], extraColors: 2, categorySlug: "decor-brick", sortOrder: 3, size: "215×65×16 мм", coverage: 1.0, weight: "~9 кг/м²", material: "Экологичный гипс", description: "Ровный кирпич глубоких бордово-коричневых тонов в духе английской террасной застройки. Гладкая поверхность с лёгкой фактурой смотрится строго и дорого." },
  { slug: "kirpich-belenyj", title: "Кирпич «Белёный»", article: "WH-040", priceFrom: 1720, colors: ["#EFE7DA", "#E2D5C2", "#CFC0AA"], extraColors: 2, categorySlug: "decor-brick", sortOrder: 4, size: "210×65×15 мм", coverage: 1.1, weight: "~8.5 кг/м²", material: "Экологичный гипс", description: "Светлый кирпич с лёгкой побелкой — визуально расширяет пространство и наполняет его воздухом. Базовый выбор для скандинавских и прованских интерьеров." },
  // Камень / сланец
  { slug: "slanec-rvanyj", title: "Сланец «Рваный»", article: "SL-22", status: "Под заказ", priceFrom: 1940, colors: ["#B9A98C", "#857058", "#4F4034"], extraColors: 2, categorySlug: "stone", isBestseller: true, sortOrder: 1, size: "200×100×18 мм", coverage: 0.9, weight: "~11 кг/м²", material: "Экологичный гипс", description: "Глубокий скол с острыми гранями и природной игрой фактуры — почти неотличим от настоящего сланца, но в разы легче. Эффектно смотрится на акцентной стене, каминном портале и в прихожей." },
  { slug: "kamen-plitnyak", title: "Камень «Плитняк»", article: "PL-15", priceFrom: 1740, colors: ["#A9A096", "#7E776C", "#585149"], extraColors: 2, categorySlug: "stone", sortOrder: 2, size: "Произвольный модуль", coverage: 0.95, weight: "~10 кг/м²", material: "Экологичный гипс", description: "Плоский природный камень неправильной формы для «сухой кладки». Серо-бежевая гамма подходит для современных и эко-интерьеров, хорошо сочетается с бетоном и деревом." },
  { slug: "slanec-sloistyj", title: "Сланец «Слоистый»", article: "SL-31", priceFrom: 1990, colors: ["#8C7E66", "#5F5446", "#3C342B"], extraColors: 3, categorySlug: "stone", sortOrder: 3, size: "210×95×20 мм", coverage: 0.9, weight: "~12 кг/м²", material: "Экологичный гипс", description: "Многослойный сланец с выраженными горизонтальными пластами и глубоким рельефом. Тёмная тонировка даёт благородный, почти каменный вид." },
  // 3D-мозаика
  { slug: "soty-geksagon", title: "Соты «Гексагон»", article: "HX-30", status: "Новинка", priceFrom: 2140, colors: ["#E8D9BE", "#D99A2B", "#7A6A52", "#211C17"], extraColors: 2, categorySlug: "mosaic-3d", isBestseller: true, sortOrder: 1, size: "Гексагон 200 мм", coverage: 1.0, weight: "~9 кг/м²", material: "Экологичный гипс", description: "Наш фирменный мотив — объёмные соты-гексагоны, собирающиеся в бесшовный паттерн любой площади. Рельеф создаёт мягкую игру света и тени. Колеруем в тон или контраст." },
  { slug: "panel-volna", title: "3D-панель «Волна»", article: "WV-12", priceFrom: 2240, colors: ["#F0E9DC", "#E0D6C5", "#CBBFA8"], extraColors: 1, categorySlug: "mosaic-3d", sortOrder: 2, size: "Панель 500×500 мм", coverage: 0.75, weight: "~10 кг/м²", material: "Экологичный гипс", description: "Пластичный волновой рельеф для современных гостиных, изголовий кровати и зон ресепшн. Создаёт скульптурный эффект в монохромных интерьерах." },
  { slug: "soty-mini", title: "Соты «Мини»", article: "HX-12", priceFrom: 2040, colors: ["#EDE0C8", "#C9A86E", "#8A7656"], extraColors: 2, categorySlug: "mosaic-3d", sortOrder: 3, size: "Гексагон 120 мм", coverage: 1.0, weight: "~8.5 кг/м²", material: "Экологичный гипс", description: "Уменьшенная версия гексагона для камерных зон: ниш, фартуков, простенков и небольших акцентов. Мелкий модуль даёт более деликатный, графичный рисунок." },
  // Угловые
  { slug: "ugol-loft", title: "Угол «Лофт»", article: "LF-114-U", priceFrom: 320, unit: "шт", colors: ["#C9B79A", "#9C7B5B", "#6E5A48"], extraColors: 4, categorySlug: "corners", sortOrder: 1, size: "210×(65+65)×16 мм", weight: "~0.4 кг/шт", material: "Экологичный гипс", description: "Готовый угловой элемент к коллекции «Лофт»: оформляет внешние углы и откосы без подрезки. Фактура и колер совпадают с основной плиткой." },
  { slug: "ugol-slanec", title: "Угол «Сланец»", article: "SL-22-U", priceFrom: 360, unit: "шт", colors: ["#B9A98C", "#857058", "#4F4034"], extraColors: 2, categorySlug: "corners", sortOrder: 2, size: "200×(100+100)×18 мм", weight: "~0.6 кг/шт", material: "Экологичный гипс", description: "Угловой добор к сланцу «Рваный»: повторяет глубокий скол на внешнем углу и сохраняет естественный рисунок породы по ребру стены." },
  // Расходники
  { slug: "klej-montazhnyj", title: "Клей монтажный", article: "GL-05", priceFrom: 390, unit: "шт", colors: [], extraColors: 0, categorySlug: "supplies", sortOrder: 1, size: "Упаковка 5 кг", weight: "5 кг", material: "Гипсовый монтажный состав", description: "Монтажный клей для гипсовой плитки на гипсовой основе: высокая адгезия к бетону, кирпичу и гипсокартону, удобное время коррекции." },
  { slug: "zatirka-shvov", title: "Затирка для швов", article: "GR-02", priceFrom: 450, unit: "шт", colors: ["#EFE7DA", "#CFC0AA", "#8A7656", "#3A332B"], extraColors: 0, categorySlug: "supplies", sortOrder: 2, size: "Упаковка 2 кг", weight: "2 кг", material: "Гипсовая затирочная смесь", description: "Затирка для расшивки швов между плитками. Колеруется в тон или контраст к кладке, легко формуется и не растрескивается." },
  { slug: "lak-propitka", title: "Лак-пропитка", article: "LK-01", status: "Новинка", priceFrom: 590, unit: "шт", colors: [], extraColors: 0, categorySlug: "supplies", sortOrder: 3, size: "Флакон 1 л", weight: "1 л", material: "Акриловая пропитка, матовая", description: "Финишный лак-пропитка защищает гипс от влаги и загрязнений, не меняя матовую фактуру. Обязателен для кухонь, прихожих и влажных зон. 1 л ≈ 8–10 м²." },
];

const works = [
  { slug: "loft-kitchen-1", title: "Кухня-гостиная в стиле лофт", tag: "Кухня", year: 2025, featured: true, sortOrder: 1, description: "Акцентная стена из кирпича «Лофт» с тёплой тонировкой под интерьер клиента." },
  { slug: "cafe-tseh", title: "Бар «Цех» — стена из сот", tag: "Кафе", year: 2025, featured: true, sortOrder: 2, description: "Соты «Гексагон» на всю стену бара, нестандартный размер под нишу." },
  { slug: "hallway-stone", title: "Прихожая со сланцем", tag: "Прихожая", year: 2024, sortOrder: 3 },
  { slug: "bedroom-white", title: "Спальня, белёный кирпич", tag: "Спальня", year: 2024, sortOrder: 4 },
  { slug: "fireplace-slate", title: "Каминный портал из камня", tag: "Гостиная", year: 2024, sortOrder: 5 },
  { slug: "office-brick", title: "Кабинет, английский кирпич", tag: "Офис", year: 2023, sortOrder: 6 },
];

const reviews = [
  { name: "Анна К.", source: "VK", rating: 5, sortOrder: 1, text: "Подобрали цвет точно под нашу кухню в стиле лофт. Плитка лёгкая, клеится отлично, а главное — живая фактура, не как штамповка. Очень довольны!" },
  { name: "Дмитрий, кафе «Цех»", source: "Авито", rating: 5, sortOrder: 2, text: "Делали соты на всю стену в баре. Помогли с расчётом, добили нестандартный размер под нишу. Гости постоянно спрашивают, где брали." },
  { name: "Марина С.", source: "VK", rating: 5, sortOrder: 3, text: "Заказывали белёный кирпич в прихожую. Доставили в другой город аккуратно, ничего не побилось. Стена смотрится дорого." },
];

async function main() {
  // контент чистим, заявки Lead не трогаем
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.work.deleteMany();
  await prisma.review.deleteMany();

  const catBySlug = {};
  for (const c of categories) {
    const created = await prisma.category.create({ data: c });
    catBySlug[c.slug] = created.id;
  }
  for (const { categorySlug, ...p } of products) {
    await prisma.product.create({ data: { ...p, categoryId: catBySlug[categorySlug] ?? null } });
  }
  for (const w of works) await prisma.work.create({ data: w });
  for (const r of reviews) await prisma.review.create({ data: r });

  // Админ-пользователь (по умолчанию). Пароль поменять после первого входа!
  const adminEmail = "admin@gips31.ru";
  const passwordHash = await bcrypt.hash("admin12345", 10);
  await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      password: passwordHash,
      name: "Администратор",
      role: "ADMIN",
      permissions: ["products", "categories", "works", "leads", "reviews", "settings", "users"],
    },
  });

  // Контакты и настройки (одна запись)
  const contactCount = await prisma.contactInfo.count();
  if (contactCount === 0) {
    await prisma.contactInfo.create({
      data: {
        phone: "+7 (900) 000-00-00",
        email: "info@gips31.ru",
        address: "г. Губкин, Белгородская обл.",
        workingHours: "Ежедневно 9:00–20:00",
        whatsapp: "+79000000000",
        telegram: "gips31",
        vk: "gips31",
      },
    });
  }
  const settingsCount = await prisma.siteSettings.count();
  if (settingsCount === 0) {
    await prisma.siteSettings.create({ data: {} });
  }

  console.log(
    `Seed готов: ${categories.length} категорий, ${products.length} товаров, ${works.length} работ, ${reviews.length} отзыва, 1 админ.\nВход в админку: ${adminEmail} / admin12345`
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
