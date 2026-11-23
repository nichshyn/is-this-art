export interface SeedArtwork {
  slug: string;
  title: string;
  description: string;
  history: string;
  imageUrl: string;
  imageWidth: number;
  imageHeight: number;
  imageCredit: string;
  imageLicense: string;
  imageSourceUrl: string | null;
  category: string;
  artistName: string;
  creationYear: string;
  country: string;
  location: string;
  funFact: string;
  isAiGenerated?: boolean;
  isVerified?: boolean;
  isDemo?: boolean;
  status?: "pending" | "approved" | "rejected";
  submittedByUsername?: string;
  createdDaysAgo?: number;
}

/**
 * Demo catalogue.
 *
 * The historical works are public-domain (or CC0) images sourced from
 * Wikimedia Commons. Source and licence are stored with every record and shown
 * on the artwork page. The five pieces labelled "Demo" were created for this
 * project and are explicitly marked as demonstration content — they are not
 * attributed to a real artist or collection.
 */
export const SEED_ARTWORKS: SeedArtwork[] = [
  {
    slug: "mona-lisa",
    title: "Мона Лиза",
    description:
      "Погрудный портрет женщины с загадочной улыбкой, написанный на тополевой доске. Считается, что на нём изображена Лиза Герардини, жена флорентийского купца Франческо дель Джокондо.",
    history:
      "Леонардо начал портрет около 1503 года и, вероятно, возвращался к нему на протяжении многих лет. Работа попала в коллекцию французских королей и с начала XIX века хранится в Лувре. В 1911 году её украли из музея, а два года спустя нашли во Флоренции.",
    imageUrl: "/artworks/mona-lisa.jpg",
    imageWidth: 1600,
    imageHeight: 2384,
    imageCredit: "C2RMF / Wikimedia Commons",
    imageLicense: "Общественное достояние",
    imageSourceUrl:
      "https://commons.wikimedia.org/wiki/File:Mona_Lisa,_by_Leonardo_da_Vinci,_from_C2RMF_retouched.jpg",
    category: "paintings",
    artistName: "Леонардо да Винчи",
    creationYear: "ок. 1503–1519",
    country: "Италия",
    location: "Лувр, Париж",
    funFact:
      "Картина меньше, чем многие посетители ожидают: примерно 77 × 53 см.",
    isVerified: true,
    createdDaysAgo: 44,
  },
  {
    slug: "starry-night",
    title: "Звёздная ночь",
    description:
      "Вихрящееся ночное небо над тихой деревней, написанное по памяти во время пребывания Ван Гога в лечебнице в Сен-Реми-де-Провансе.",
    history:
      "Винсент ван Гог написал «Звёздную ночь» в июне 1889 года, добровольно находясь в лечебнице Сен-Поль-де-Мазоль. Ночное небо он описывал в письмах брату Тео. В 1941 году картина вошла в коллекцию Музея современного искусства.",
    imageUrl: "/artworks/starry-night.jpg",
    imageWidth: 1600,
    imageHeight: 1267,
    imageCredit: "Google Arts & Culture / Wikimedia Commons",
    imageLicense: "Общественное достояние",
    imageSourceUrl:
      "https://commons.wikimedia.org/wiki/File:Van_Gogh_-_Starry_Night_-_Google_Art_Project.jpg",
    category: "paintings",
    artistName: "Винсент ван Гог",
    creationYear: "1889",
    country: "Нидерланды",
    location: "Музей современного искусства, Нью-Йорк",
    funFact:
      "Крупную белую звезду чуть левее центра часто отождествляют с Венерой. Крыши деревни не были видны из окна Ван Гога.",
    isVerified: true,
    createdDaysAgo: 43,
  },
  {
    slug: "black-square",
    title: "Чёрный квадрат",
    description:
      "Почти чёрный квадрат на белом фоне — радикальное сведение живописи к чистой геометрической форме.",
    history:
      "Малевич впервые показал «Чёрный квадрат» в 1915 году на «Последней футуристической выставке 0.10» в Петрограде — высоко в углу, где обычно вешали икону. Работа стала манифестом супрематизма.",
    imageUrl: "/artworks/black-square.jpg",
    imageWidth: 1718,
    imageHeight: 1718,
    imageCredit: "Tretyakov Gallery / Wikimedia Commons",
    imageLicense: "Общественное достояние",
    imageSourceUrl:
      "https://commons.wikimedia.org/wiki/File:Kazimir_Malevich,_1915,_Black_Suprematic_Square,_oil_on_linen_canvas,_79.5_x_79.5_cm,_Tretyakov_Gallery,_Moscow.jpg",
    category: "abstract-art",
    artistName: "Казимир Малевич",
    creationYear: "1915",
    country: "Россия",
    location: "Третьяковская галерея, Москва",
    funFact:
      "Исследования реставраторов выявили более ранние живописные композиции под поверхностью.",
    isVerified: true,
    createdDaysAgo: 42,
  },
  {
    slug: "composition-vii",
    title: "Композиция VII",
    description:
      "Плотное, бурное сочетание цвета и линий, которое часто считают вершиной довоенной абстракции Кандинского.",
    history:
      "Василий Кандинский написал «Композицию VII» в 1913 году в Мюнхене. Это была самая крупная и сложная его композиция на тот момент; ей предшествовало множество эскизов и акварелей.",
    imageUrl: "/artworks/composition-vii.jpg",
    imageWidth: 1600,
    imageHeight: 1063,
    imageCredit: "Google Art & Culture / Wikimedia Commons",
    imageLicense: "Общественное достояние",
    imageSourceUrl:
      "https://commons.wikimedia.org/wiki/File:Composition_VII_-_Wassily_Kandinsky,_GAC.jpg",
    category: "abstract-art",
    artistName: "Василий Кандинский",
    creationYear: "1913",
    country: "Россия",
    location: "Третьяковская галерея, Москва",
    funFact:
      "Кандинский писал, что цвет способен вызывать прямые психологические и даже «музыкальные» эффекты.",
    isVerified: true,
    createdDaysAgo: 41,
  },
  {
    slug: "garden-of-earthly-delights",
    title: "Сад земных наслаждений",
    description:
      "Трёхчастная фантастическая панорама Эдема, земных удовольствий и ада, заполненная людьми, животными и фантастическими сооружениями.",
    history:
      "Триптих Босха впервые упоминается в 1517 году в коллекции Генриха III Нассауского. Позже он попал в испанскую королевскую коллекцию, а сейчас хранится в Прадо. Кто именно заказал работу и где она находилась изначально, до сих пор неясно.",
    imageUrl: "/artworks/garden-of-earthly-delights.jpg",
    imageWidth: 1600,
    imageHeight: 911,
    imageCredit: "Museo del Prado / Wikimedia Commons",
    imageLicense: "Общественное достояние",
    imageSourceUrl:
      "https://commons.wikimedia.org/wiki/File:The_Garden_of_Earthly_Delights_by_Bosch_High_Resolution.jpg",
    category: "paintings",
    artistName: "Иероним Босх",
    creationYear: "ок. 1490–1510",
    country: "Нидерланды",
    location: "Музей Прадо, Мадрид",
    funFact:
      "На закрытых внешних створках изображён мир в виде серого шара, что часто трактуют как третий день сотворения мира.",
    isVerified: true,
    createdDaysAgo: 40,
  },
  {
    slug: "fountain",
    title: "Фонтан",
    description:
      "Фарфоровый писсуар, перевёрнутый на бок, с подписью «Р. Мутт», отправленный на выставку, которая обещала принимать любые работы.",
    history:
      "Дюшан отправил «Фонтан» в Общество независимых художников в Нью-Йорке в 1917 году под псевдонимом. Жюри отказалось выставить его. Оригинал утрачен; основным свидетельством осталась фотография Альфреда Штиглица.",
    imageUrl: "/artworks/fountain.jpg",
    imageWidth: 1416,
    imageHeight: 1849,
    imageCredit: "Alfred Stieglitz, The Blind Man, No. 2, 1917 / Wikimedia Commons",
    imageLicense: "Общественное достояние",
    imageSourceUrl:
      "https://commons.wikimedia.org/wiki/File:Marcel_Duchamp,_1917,_Fountain,_photograph_by_Alfred_Stieglitz.jpg",
    category: "installations",
    artistName: "Марсель Дюшан",
    creationYear: "1917",
    country: "Франция / США",
    location: "Оригинал утрачен; фотография Альфреда Штиглица",
    funFact:
      "Проспект Общества обещал выставить любую работу художника, уплатившего шесть долларов.",
    isVerified: true,
    createdDaysAgo: 39,
  },
  {
    slug: "the-thinker",
    title: "Мыслитель",
    description:
      "Мускулистая фигура сидит в глубокой задумчивости; изначально она задумывалась как Данте у врат ада.",
    history:
      "Роден создал «Мыслителя» около 1880 года как часть «Врат ада». В 1904 году скульптуру увеличили и отлили в бронзе как самостоятельную работу. Отливки хранятся в музеях всего мира; здесь показана версия из Музея Родена в Париже.",
    imageUrl: "/artworks/the-thinker.jpg",
    imageWidth: 1600,
    imageHeight: 2274,
    imageCredit: "Musée Rodin / Wikimedia Commons (CC0)",
    imageLicense: "CC0",
    imageSourceUrl:
      "https://commons.wikimedia.org/wiki/File:Le_Penseur_Mus%C3%A9e_Rodin_Paris_S.1295.jpg",
    category: "sculpture",
    artistName: "Огюст Роден",
    creationYear: "1880–1882; увеличена в 1904",
    country: "Франция",
    location: "Музей Родена, Париж",
    funFact: "Отливка «Мыслителя» стоит на могиле Родена в Мёдоне.",
    isVerified: true,
    createdDaysAgo: 38,
  },
  {
    slug: "winged-victory",
    title: "Ника Самофракийская",
    description:
      "Мраморная скульптура крылатой богини Ники, запечатлённой в момент приземления на нос корабля.",
    history:
      "Статую нашли на острове Самофракия в 1863 году и реконструировали в Лувре. Её датируют началом II века до н. э.; вероятно, она была создана в честь морской победы.",
    imageUrl: "/artworks/winged-victory.jpg",
    imageWidth: 1600,
    imageHeight: 1067,
    imageCredit: "Jastrow / Wikimedia Commons",
    imageLicense: "Общественное достояние",
    imageSourceUrl:
      "https://commons.wikimedia.org/wiki/File:Wing_victory_Samothrace_Louvre_Ma2369.jpg",
    category: "sculpture",
    artistName: "Неизвестный скульптор",
    creationYear: "ок. 200–190 до н. э.",
    country: "Греция",
    location: "Лувр, Париж",
    funFact:
      "Голову и руки статуи так и не нашли; правое крыло — гипсовая реставрация.",
    isVerified: true,
    createdDaysAgo: 37,
  },
  {
    slug: "great-wave",
    title: "Большая волна в Канагаве",
    description:
      "Высокая волна нависает над тремя маленькими лодками, а вдали видна гора Фудзи.",
    history:
      "Кацусика Хокусай опубликовал «Большую волну в Канагаве» около 1831 года в серии «Тридцать шесть видов горы Фудзи». Гравюра стала одним из наиболее часто воспроизводимых изображений в японском искусстве.",
    imageUrl: "/artworks/great-wave.jpg",
    imageWidth: 1600,
    imageHeight: 1095,
    imageCredit: "The Metropolitan Museum of Art / Wikimedia Commons",
    imageLicense: "Общественное достояние",
    imageSourceUrl:
      "https://commons.wikimedia.org/wiki/File:Great_Wave_off_Kanagawa2.jpg",
    category: "paintings",
    artistName: "Кацусика Хокусай",
    creationYear: "ок. 1831",
    country: "Япония",
    location: "Метрополитен-музей, Нью-Йорк",
    funFact:
      "Лодки — осиокури-бунэ, быстрые грузовые суда, перевозившие рыбу; волна — штормовая, а не цунами.",
    isVerified: true,
    createdDaysAgo: 36,
  },
  {
    slug: "grande-jatte",
    title: "Воскресный день на острове Гранд-Жатт",
    description:
      "Парижане отдыхают на острове в Сене; картина сложена из тысяч маленьких, тщательно расположенных точек цвета.",
    history:
      "Сёра начал картину в 1884 году и показал её на восьмой выставке импрессионистов в 1886 году. Его техника, позже названная пуантилизмом, стала образцом для неоимпрессионизма. В 1924 году её приобрёл Художественный институт Чикаго.",
    imageUrl: "/artworks/grande-jatte.jpg",
    imageWidth: 1600,
    imageHeight: 1065,
    imageCredit: "Art Institute of Chicago / Wikimedia Commons",
    imageLicense: "Общественное достояние",
    imageSourceUrl:
      "https://commons.wikimedia.org/wiki/File:A_Sunday_on_La_Grande_Jatte,_Georges_Seurat,_1884.jpg",
    category: "paintings",
    artistName: "Жорж Сёра",
    creationYear: "1884–1886",
    country: "Франция",
    location: "Художественный институт Чикаго",
    funFact:
      "Сёра создал десятки подготовительных рисунков и масляных эскизов, в том числе наброски отдельных фигур.",
    isVerified: true,
    createdDaysAgo: 35,
  },
  {
    slug: "the-kiss",
    title: "Поцелуй",
    description:
      "Двое влюблённых обнимаются в мерцающем золотом поле, их тела окутаны узорчатыми одеждами.",
    history:
      "Климт написал «Поцелуй» в 1907–1908 годах, в разгар своего «золотого периода». В 1908 году работу купило австрийское государство; сейчас она — одно из самых известных произведений Бельведера.",
    imageUrl: "/artworks/the-kiss.jpg",
    imageWidth: 1600,
    imageHeight: 1605,
    imageCredit: "Belvedere / Google Cultural Institute",
    imageLicense: "Общественное достояние",
    imageSourceUrl:
      "https://commons.wikimedia.org/wiki/File:The_Kiss_-_Gustav_Klimt_-_Google_Cultural_Institute.jpg",
    category: "paintings",
    artistName: "Густав Климт",
    creationYear: "1907–1908",
    country: "Австрия",
    location: "Австрийская галерея Бельведер, Вена",
    funFact:
      "Картина почти квадратная, около 180 × 180 см, а золотая фольга придаёт ей мозаичную поверхность.",
    isVerified: true,
    createdDaysAgo: 34,
  },
  {
    slug: "the-scream",
    title: "Крик",
    description:
      "Фигура на мосту сжимает лицо под кроваво-красным небом — образ экзистенциального ужаса.",
    history:
      "Мунк создал первую версию «Крика» в 1893 году. В дневнике он описал переживание, ставшее основой работы: закат «стал кроваво-красным». Существуют четыре версии — две картины и две пастели.",
    imageUrl: "/artworks/the-scream.jpg",
    imageWidth: 1600,
    imageHeight: 1986,
    imageCredit: "National Museum of Norway / Wikimedia Commons",
    imageLicense: "Общественное достояние",
    imageSourceUrl:
      "https://commons.wikimedia.org/wiki/File:Edvard_Munch,_1893,_The_Scream,_oil,_tempera_and_pastel_on_cardboard,_91_x_73_cm,_National_Gallery_of_Norway.jpg",
    category: "paintings",
    artistName: "Эдвард Мунк",
    creationYear: "1893",
    country: "Норвегия",
    location: "Национальный музей, Осло",
    funFact:
      "Версия Национального музея выполнена маслом, темперой и пастелью на картоне.",
    isVerified: true,
    createdDaysAgo: 33,
  },
  {
    slug: "le-gras",
    title: "Вид из окна в Ле Гра",
    description:
      "Размытый вид на крыши и деревья, снятый с помощью камеры-обскуры и оловянной пластины, покрытой битумом.",
    history:
      "Ньепс создал эту гелиографию из окна своего поместья в Ле Гра примерно в 1826–1827 годах. Это самая старая из сохранившихся фотографий, сделанных с помощью камеры. Пластина хранится в Центре Гарри Рэнсома при Техасском университете в Остине.",
    imageUrl: "/artworks/le-gras.jpg",
    imageWidth: 1600,
    imageHeight: 1112,
    imageCredit: "Harry Ransom Center / Wikimedia Commons",
    imageLicense: "Общественное достояние",
    imageSourceUrl:
      "https://commons.wikimedia.org/wiki/File:View_from_the_Window_at_Le_Gras,_Joseph_Nic%C3%A9phore_Ni%C3%A9pce.jpg",
    category: "photography",
    artistName: "Жозеф Нисефор Ньепс",
    creationYear: "ок. 1826–1827",
    country: "Франция",
    location: "Центр Гарри Рэнсома, Остин",
    funFact:
      "Считается, что выдержка длилась несколько часов, возможно, до восьми.",
    isVerified: true,
    createdDaysAgo: 32,
  },
  {
    slug: "the-steerage",
    title: "Нижняя палуба",
    description:
      "Пассажиры теснятся на палубах парохода, разделённые по классам и обрамлённые лестницами и перилами.",
    history:
      "Штиглиц снял фотографию в 1907 году на пароходе «Кайзер Вильгельм II», направляясь в Европу. Позже он назвал её своей «первой фотографией» и отстаивал как доказательство того, что фотография может быть искусством. Один оттиск хранится в Метрополитен-музее.",
    imageUrl: "/artworks/the-steerage.jpg",
    imageWidth: 1600,
    imageHeight: 2006,
    imageCredit: "The Metropolitan Museum of Art / Google Art Project",
    imageLicense: "Общественное достояние",
    imageSourceUrl:
      "https://commons.wikimedia.org/wiki/File:Alfred_Stieglitz_-_The_Steerage_-_Google_Art_Project.jpg",
    category: "photography",
    artistName: "Альфред Штиглиц",
    creationYear: "1907",
    country: "США",
    location: "Метрополитен-музей, Нью-Йорк",
    funFact:
      "Штиглица привлекли не столько люди, сколько очертания шляп, труб и сходен.",
    isVerified: true,
    createdDaysAgo: 31,
  },
  {
    slug: "mondrian-1930",
    title: "Композиция II в красном, синем и жёлтом",
    description:
      "Сетка чёрных линий, ограничивающая прямоугольники белого, красного, синего и жёлтого цветов.",
    history:
      "Мондриан написал эту композицию в 1930 году, развивая неопластическую сетку, которую создал в Париже. Работа хранится в Кунстхаусе Цюрих.",
    imageUrl: "/artworks/mondrian-1930.jpg",
    imageWidth: 1600,
    imageHeight: 1622,
    imageCredit: "Kunsthaus Zürich / Wikimedia Commons",
    imageLicense: "Общественное достояние",
    imageSourceUrl:
      "https://commons.wikimedia.org/wiki/File:Piet_Mondriaan,_1930_-_Mondrian_Composition_II_in_Red,_Blue,_and_Yellow.jpg",
    category: "abstract-art",
    artistName: "Пит Мондриан",
    creationYear: "1930",
    country: "Нидерланды",
    location: "Кунстхаус Цюрих",
    funFact:
      "Мондриан не измерял сетку линейкой: он подправлял линии на глаз, пока пропорции не казались ему верными.",
    isVerified: true,
    createdDaysAgo: 30,
  },
  {
    slug: "armory-show-1913",
    title: "Армори-шоу: зал кубистов",
    description:
      "Пресс-фотография зала кубистов на Армори-шоу 1913 года в Нью-Йорке с работами Дюшана, Глеза и других художников.",
    history:
      "Международная выставка современного искусства открылась в Нью-Йорке в феврале 1913 года, а затем отправилась в Чикаго и Бостон. Многие американские зрители впервые познакомились там с кубизмом, футуризмом и другими европейскими авангардными течениями. Эта фотография была опубликована в «New York Tribune».",
    imageUrl: "/artworks/armory-show.jpg",
    imageWidth: 1600,
    imageHeight: 972,
    imageCredit: "New York Tribune, 1913 / Wikimedia Commons",
    imageLicense: "Общественное достояние",
    imageSourceUrl:
      "https://commons.wikimedia.org/wiki/File:Armory_Show,_1913,_the_Cubist_room,_Raymond_Duchamp-Villon,_Albert_Gleizes,_Marcel_Duchamp,_Alexander_Archipenko,_New_York_Tribune,_17_February_1913,_p._7.jpg",
    category: "photography",
    artistName: "New York Tribune (неизвестный фотограф)",
    creationYear: "1913",
    country: "США",
    location: "Международная выставка современного искусства, Нью-Йорк",
    funFact:
      "«Обнажённая, спускающаяся по лестнице» Марселя Дюшана стала самой обсуждаемой работой выставки, хотя на этой фотографии её почти не видно.",
    isVerified: true,
    createdDaysAgo: 29,
  },
  {
    slug: "demo-suspended-field",
    title: "Парящее поле",
    description:
      "Диск бледного света, застывший в пустой комнате, с мягкой тенью на полу.",
    history:
      "Это демонстрационный материал, созданный для IS THIS ART?. Он нужен, чтобы платформа могла показать, как представляется и оценивается работа-инсталляция; это не историческое произведение, и оно не приписывается реальному художнику.",
    imageUrl: "/artworks/demo-suspended-field.svg",
    imageWidth: 1600,
    imageHeight: 1200,
    imageCredit: "IS THIS ART? Studio",
    imageLicense: "Демо-контент — создан для IS THIS ART?",
    imageSourceUrl: null,
    category: "installations",
    artistName: "IS THIS ART? Studio",
    creationYear: "2025",
    country: "—",
    location: "Демо-работа",
    funFact:
      "Демо-контент: изображение и работа созданы для этого проекта.",
    isDemo: true,
    createdDaysAgo: 18,
  },
  {
    slug: "demo-synthetic-garden",
    title: "Синтетический сад",
    description:
      "Абстрактный сад, сгенерированный моделью диффузии, затем вручную откорректированный по цвету.",
    history:
      "Это демонстрационный материал, созданный для IS THIS ART? и представляющий категорию ИИ-искусства. Это не историческое произведение, и его не следует приписывать реальному художнику.",
    imageUrl: "/artworks/demo-synthetic-garden.svg",
    imageWidth: 1600,
    imageHeight: 1200,
    imageCredit: "IS THIS ART? Studio (при поддержке ИИ)",
    imageLicense: "Демо-контент — создан для IS THIS ART?",
    imageSourceUrl: null,
    category: "ai-art",
    artistName: "IS THIS ART? Studio (при поддержке ИИ)",
    creationYear: "2025",
    country: "—",
    location: "Демо-работа",
    funFact:
      "Демо-контент: с этим изображением не связаны реальные художники или исторические коллекции.",
    isAiGenerated: true,
    isDemo: true,
    createdDaysAgo: 17,
  },
  {
    slug: "demo-chromatic-study",
    title: "Хроматическое исследование № 4",
    description:
      "Цифровая композиция из цветовых полей, чёрного квадрата и одного круга, созданная кодом.",
    history:
      "Это демонстрационный материал, созданный для IS THIS ART? и представляющий цифровое искусство. Это не историческое произведение, и его не следует приписывать реальному художнику.",
    imageUrl: "/artworks/demo-chromatic-study.svg",
    imageWidth: 1600,
    imageHeight: 1200,
    imageCredit: "IS THIS ART? Studio",
    imageLicense: "Демо-контент — создан для IS THIS ART?",
    imageSourceUrl: null,
    category: "digital-art",
    artistName: "IS THIS ART? Studio",
    creationYear: "2025",
    country: "—",
    location: "Демо-работа",
    funFact:
      "Демо-контент: композиция нарисована с помощью SVG-фигур и фильтра зерна.",
    isDemo: true,
    createdDaysAgo: 16,
  },
  {
    slug: "demo-question-repeated",
    title: "Повторённый вопрос",
    description:
      "Вопрос «IS THIS ART?», повторяющийся в выцветающей сетке и прерванный одним красным вопросительным знаком.",
    history:
      "Это демонстрационный материал, созданный для IS THIS ART? и представляющий экспериментальные и текстовые работы. Это не историческое произведение, и его не следует приписывать реальному художнику.",
    imageUrl: "/artworks/demo-question-repeated.svg",
    imageWidth: 1600,
    imageHeight: 1200,
    imageCredit: "IS THIS ART? Studio",
    imageLicense: "Демо-контент — создан для IS THIS ART?",
    imageSourceUrl: null,
    category: "experimental-art",
    artistName: "IS THIS ART? Studio",
    creationYear: "2025",
    country: "—",
    location: "Демо-работа",
    funFact:
      "Демо-контент: работа — типографское размышление о собственном вопросе платформы.",
    isDemo: true,
    createdDaysAgo: 15,
  },
  {
    slug: "demo-still-life-fold",
    title: "Натюрморт со складкой",
    description:
      "Монохромное полотно с единственной складкой и маленьким синим прямоугольником, удерживаемыми светом.",
    history:
      "Это демонстрационный материал, созданный для IS THIS ART? и представляющий современное искусство. Это не историческое произведение, и его не следует приписывать реальному художнику.",
    imageUrl: "/artworks/demo-still-life-fold.svg",
    imageWidth: 1600,
    imageHeight: 1200,
    imageCredit: "IS THIS ART? Studio",
    imageLicense: "Демо-контент — создан для IS THIS ART?",
    imageSourceUrl: null,
    category: "contemporary-art",
    artistName: "IS THIS ART? Studio",
    creationYear: "2025",
    country: "—",
    location: "Демо-работа",
    funFact:
      "Демо-контент: складка нарисована, а не сфотографирована.",
    isDemo: true,
    createdDaysAgo: 14,
  },
  {
    slug: "demo-afterimage",
    title: "Без названия (послеобраз)",
    description:
      "Полутоновый послеобраз, задержавшийся на краю поля зрения, отправленный для проверки модерации.",
    history:
      "Это демонстрационный материал, созданный для IS THIS ART? и отправленный демо-аккаунтом. Он остаётся в очереди модерации, пока администратор его не одобрит.",
    imageUrl: "/artworks/demo-afterimage.svg",
    imageWidth: 1600,
    imageHeight: 1200,
    imageCredit: "Mira Sol — демо-работа",
    imageLicense: "Демо-контент — создан для IS THIS ART?",
    imageSourceUrl: null,
    category: "digital-art",
    artistName: "Mira Sol",
    creationYear: "2025",
    country: "—",
    location: "Ожидает проверки",
    funFact:
      "Демо-контент: эта предложенная работа показывает, что новые загрузки не публикуются до одобрения.",
    isDemo: true,
    status: "pending",
    submittedByUsername: "mira",
    createdDaysAgo: 2,
  },
];
