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
    title: "Mona Lisa",
    description:
      "A half-length portrait of a woman with an enigmatic smile, painted on a poplar panel. The sitter is widely identified as Lisa Gherardini, wife of the Florentine merchant Francesco del Giocondo.",
    history:
      "Leonardo began the portrait around 1503 and is thought to have continued refining it for years. It entered the French royal collection and has hung at the Louvre since the early nineteenth century. In 1911 it was stolen from the museum and recovered in Florence two years later.",
    imageUrl: "/artworks/mona-lisa.jpg",
    imageWidth: 1600,
    imageHeight: 2384,
    imageCredit: "C2RMF / Wikimedia Commons",
    imageLicense: "Public domain",
    imageSourceUrl:
      "https://commons.wikimedia.org/wiki/File:Mona_Lisa,_by_Leonardo_da_Vinci,_from_C2RMF_retouched.jpg",
    category: "paintings",
    artistName: "Leonardo da Vinci",
    creationYear: "c. 1503–1519",
    country: "Italy",
    location: "Musée du Louvre, Paris",
    funFact:
      "The painting is smaller than many visitors expect: roughly 77 × 53 cm.",
    isVerified: true,
    createdDaysAgo: 44,
  },
  {
    slug: "starry-night",
    title: "The Starry Night",
    description:
      "A swirling night sky above a quiet village, painted from memory during Van Gogh's stay at an asylum in Saint-Rémy-de-Provence.",
    history:
      "Van Gogh painted The Starry Night in June 1889 while voluntarily staying at the Saint-Paul-de-Mausole asylum. He described the night sky in letters to his brother Theo. The painting entered the collection of the Museum of Modern Art in 1941.",
    imageUrl: "/artworks/starry-night.jpg",
    imageWidth: 1600,
    imageHeight: 1267,
    imageCredit: "Google Arts & Culture / Wikimedia Commons",
    imageLicense: "Public domain",
    imageSourceUrl:
      "https://commons.wikimedia.org/wiki/File:Van_Gogh_-_Starry_Night_-_Google_Art_Project.jpg",
    category: "paintings",
    artistName: "Vincent van Gogh",
    creationYear: "1889",
    country: "Netherlands",
    location: "Museum of Modern Art, New York",
    funFact:
      "The large white star just left of centre is often identified as Venus. The village skyline was not visible from Van Gogh's window.",
    isVerified: true,
    createdDaysAgo: 43,
  },
  {
    slug: "black-square",
    title: "Black Square",
    description:
      "A near-black square on a white ground — a radical reduction of painting to pure geometric form.",
    history:
      "Malevich first showed Black Square at the Last Futurist Exhibition 0.10 in Petrograd in 1915, hung high in the corner where a religious icon would traditionally go. It became a manifesto of Suprematism.",
    imageUrl: "/artworks/black-square.jpg",
    imageWidth: 1718,
    imageHeight: 1718,
    imageCredit: "Tretyakov Gallery / Wikimedia Commons",
    imageLicense: "Public domain",
    imageSourceUrl:
      "https://commons.wikimedia.org/wiki/File:Kazimir_Malevich,_1915,_Black_Suprematic_Square,_oil_on_linen_canvas,_79.5_x_79.5_cm,_Tretyakov_Gallery,_Moscow.jpg",
    category: "abstract-art",
    artistName: "Kazimir Malevich",
    creationYear: "1915",
    country: "Russia",
    location: "Tretyakov Gallery, Moscow",
    funFact:
      "Conservation research has revealed earlier painted compositions beneath the surface.",
    isVerified: true,
    createdDaysAgo: 42,
  },
  {
    slug: "composition-vii",
    title: "Composition VII",
    description:
      "A dense, turbulent arrangement of colour and line, often considered the high point of Kandinsky's pre-war abstraction.",
    history:
      "Kandinsky painted Composition VII in 1913 in Munich. It was his largest and most complex composition to date, preceded by numerous studies and watercolours.",
    imageUrl: "/artworks/composition-vii.jpg",
    imageWidth: 1600,
    imageHeight: 1063,
    imageCredit: "Google Art & Culture / Wikimedia Commons",
    imageLicense: "Public domain",
    imageSourceUrl:
      "https://commons.wikimedia.org/wiki/File:Composition_VII_-_Wassily_Kandinsky,_GAC.jpg",
    category: "abstract-art",
    artistName: "Wassily Kandinsky",
    creationYear: "1913",
    country: "Russia",
    location: "Tretyakov Gallery, Moscow",
    funFact:
      "Kandinsky described colour as capable of producing direct psychological and even 'musical' effects.",
    isVerified: true,
    createdDaysAgo: 41,
  },
  {
    slug: "garden-of-earthly-delights",
    title: "The Garden of Earthly Delights",
    description:
      "A three-part visionary panorama of Eden, earthly pleasure and hell, crowded with figures, animals and fantastical structures.",
    history:
      "Bosch's triptych is first documented in 1517, in the collection of Henry III of Nassau. It later entered the Spanish royal collection and is now at the Prado. Its patron and original setting remain uncertain.",
    imageUrl: "/artworks/garden-of-earthly-delights.jpg",
    imageWidth: 1600,
    imageHeight: 911,
    imageCredit: "Museo del Prado / Wikimedia Commons",
    imageLicense: "Public domain",
    imageSourceUrl:
      "https://commons.wikimedia.org/wiki/File:The_Garden_of_Earthly_Delights_by_Bosch_High_Resolution.jpg",
    category: "paintings",
    artistName: "Hieronymus Bosch",
    creationYear: "c. 1490–1510",
    country: "Netherlands",
    location: "Museo del Prado, Madrid",
    funFact:
      "The closed outer panels show the world as a grey sphere, often interpreted as the third day of creation.",
    isVerified: true,
    createdDaysAgo: 40,
  },
  {
    slug: "fountain",
    title: "Fountain",
    description:
      "A porcelain urinal turned on its back, signed 'R. Mutt' and submitted to an exhibition that claimed to accept any work.",
    history:
      "Duchamp submitted Fountain to the Society of Independent Artists in New York in 1917 under a pseudonym. The board declined to display it. The original was lost; the photograph by Alfred Stieglitz is the primary record.",
    imageUrl: "/artworks/fountain.jpg",
    imageWidth: 1416,
    imageHeight: 1849,
    imageCredit: "Alfred Stieglitz, The Blind Man, No. 2, 1917 / Wikimedia Commons",
    imageLicense: "Public domain",
    imageSourceUrl:
      "https://commons.wikimedia.org/wiki/File:Marcel_Duchamp,_1917,_Fountain,_photograph_by_Alfred_Stieglitz.jpg",
    category: "installations",
    artistName: "Marcel Duchamp",
    creationYear: "1917",
    country: "France / United States",
    location: "Original lost; photograph by Alfred Stieglitz",
    funFact:
      "The Society's prospectus promised to exhibit any work by an artist who paid the six-dollar fee.",
    isVerified: true,
    createdDaysAgo: 39,
  },
  {
    slug: "the-thinker",
    title: "The Thinker",
    description:
      "A muscular figure seated in deep thought, originally conceived as Dante at the gates of hell.",
    history:
      "Rodin modelled The Thinker around 1880 as part of The Gates of Hell. It was enlarged and cast as an independent bronze in 1904. Casts are held in museums worldwide; the version shown is at the Musée Rodin in Paris.",
    imageUrl: "/artworks/the-thinker.jpg",
    imageWidth: 1600,
    imageHeight: 2274,
    imageCredit: "Musée Rodin / Wikimedia Commons (CC0)",
    imageLicense: "CC0",
    imageSourceUrl:
      "https://commons.wikimedia.org/wiki/File:Le_Penseur_Mus%C3%A9e_Rodin_Paris_S.1295.jpg",
    category: "sculpture",
    artistName: "Auguste Rodin",
    creationYear: "1880–1882; enlarged 1904",
    country: "France",
    location: "Musée Rodin, Paris",
    funFact: "A cast of The Thinker marks Rodin's grave at Meudon.",
    isVerified: true,
    createdDaysAgo: 38,
  },
  {
    slug: "winged-victory",
    title: "Winged Victory of Samothrace",
    description:
      "A marble sculpture of the winged goddess Nike, shown alighting on the prow of a ship.",
    history:
      "The statue was discovered on the island of Samothrace in 1863 and reconstructed at the Louvre. It is dated to the early second century BC and was probably created to commemorate a naval victory.",
    imageUrl: "/artworks/winged-victory.jpg",
    imageWidth: 1600,
    imageHeight: 1067,
    imageCredit: "Jastrow / Wikimedia Commons",
    imageLicense: "Public domain",
    imageSourceUrl:
      "https://commons.wikimedia.org/wiki/File:Wing_victory_Samothrace_Louvre_Ma2369.jpg",
    category: "sculpture",
    artistName: "Unknown sculptor",
    creationYear: "c. 200–190 BC",
    country: "Greece",
    location: "Musée du Louvre, Paris",
    funFact:
      "The figure's head and arms were never recovered; the right wing is a plaster restoration.",
    isVerified: true,
    createdDaysAgo: 37,
  },
  {
    slug: "great-wave",
    title: "Under the Wave off Kanagawa",
    description:
      "A towering wave curls over three small boats, with Mount Fuji visible in the distance.",
    history:
      "Katsushika Hokusai published Under the Wave off Kanagawa around 1831 as part of Thirty-six Views of Mount Fuji. The woodblock print became one of the most widely reproduced images in Japanese art.",
    imageUrl: "/artworks/great-wave.jpg",
    imageWidth: 1600,
    imageHeight: 1095,
    imageCredit: "The Metropolitan Museum of Art / Wikimedia Commons",
    imageLicense: "Public domain",
    imageSourceUrl:
      "https://commons.wikimedia.org/wiki/File:Great_Wave_off_Kanagawa2.jpg",
    category: "paintings",
    artistName: "Katsushika Hokusai",
    creationYear: "c. 1831",
    country: "Japan",
    location: "The Metropolitan Museum of Art, New York",
    funFact:
      "The boats are oshiokuri-bune, fast cargo boats used to transport fish; the wave is a storm wave rather than a tsunami.",
    isVerified: true,
    createdDaysAgo: 36,
  },
  {
    slug: "grande-jatte",
    title: "A Sunday on La Grande Jatte",
    description:
      "Parisians at leisure on an island in the Seine, built from thousands of small, carefully placed dots of colour.",
    history:
      "Seurat began the painting in 1884 and showed it at the eighth Impressionist exhibition in 1886. Its technique, later called Pointillism, became a model for Neo-Impressionism. The Art Institute of Chicago acquired it in 1924.",
    imageUrl: "/artworks/grande-jatte.jpg",
    imageWidth: 1600,
    imageHeight: 1065,
    imageCredit: "Art Institute of Chicago / Wikimedia Commons",
    imageLicense: "Public domain",
    imageSourceUrl:
      "https://commons.wikimedia.org/wiki/File:A_Sunday_on_La_Grande_Jatte,_Georges_Seurat,_1884.jpg",
    category: "paintings",
    artistName: "Georges Seurat",
    creationYear: "1884–1886",
    country: "France",
    location: "Art Institute of Chicago",
    funFact:
      "Seurat made dozens of preparatory drawings and oil sketches, including studies of individual figures.",
    isVerified: true,
    createdDaysAgo: 35,
  },
  {
    slug: "the-kiss",
    title: "The Kiss",
    description:
      "Two lovers embrace in a shimmering field of gold, their bodies wrapped in patterned robes.",
    history:
      "Klimt painted The Kiss in 1907–1908, at the height of his 'Golden Period'. It was purchased by the Austrian state in 1908 and is now one of the Belvedere's best-known works.",
    imageUrl: "/artworks/the-kiss.jpg",
    imageWidth: 1600,
    imageHeight: 1605,
    imageCredit: "Belvedere / Google Cultural Institute",
    imageLicense: "Public domain",
    imageSourceUrl:
      "https://commons.wikimedia.org/wiki/File:The_Kiss_-_Gustav_Klimt_-_Google_Cultural_Institute.jpg",
    category: "paintings",
    artistName: "Gustav Klimt",
    creationYear: "1907–1908",
    country: "Austria",
    location: "Österreichische Galerie Belvedere, Vienna",
    funFact:
      "The painting is nearly square, about 180 × 180 cm, and the gold leaf gives it a mosaic-like surface.",
    isVerified: true,
    createdDaysAgo: 34,
  },
  {
    slug: "the-scream",
    title: "The Scream",
    description:
      "A figure on a bridge clutches its face beneath a blood-red sky — an image of existential dread.",
    history:
      "Munch created the first version of The Scream in 1893. He described the experience behind it in a diary entry about a sunset that turned 'blood red'. Four versions exist, including two paintings and two pastels.",
    imageUrl: "/artworks/the-scream.jpg",
    imageWidth: 1600,
    imageHeight: 1986,
    imageCredit: "National Museum of Norway / Wikimedia Commons",
    imageLicense: "Public domain",
    imageSourceUrl:
      "https://commons.wikimedia.org/wiki/File:Edvard_Munch,_1893,_The_Scream,_oil,_tempera_and_pastel_on_cardboard,_91_x_73_cm,_National_Gallery_of_Norway.jpg",
    category: "paintings",
    artistName: "Edvard Munch",
    creationYear: "1893",
    country: "Norway",
    location: "National Museum, Oslo",
    funFact:
      "The National Museum's version is painted with oil, tempera and pastel on cardboard.",
    isVerified: true,
    createdDaysAgo: 33,
  },
  {
    slug: "le-gras",
    title: "View from the Window at Le Gras",
    description:
      "A blurry view of rooftops and trees, made with a camera obscura and a pewter plate coated in bitumen.",
    history:
      "Niépce made this heliograph from a window of his estate at Le Gras around 1826–1827. It is the oldest surviving photograph made with a camera. The plate is held by the Harry Ransom Center at the University of Texas at Austin.",
    imageUrl: "/artworks/le-gras.jpg",
    imageWidth: 1600,
    imageHeight: 1112,
    imageCredit: "Harry Ransom Center / Wikimedia Commons",
    imageLicense: "Public domain",
    imageSourceUrl:
      "https://commons.wikimedia.org/wiki/File:View_from_the_Window_at_Le_Gras,_Joseph_Nic%C3%A9phore_Ni%C3%A9pce.jpg",
    category: "photography",
    artistName: "Joseph Nicéphore Niépce",
    creationYear: "c. 1826–1827",
    country: "France",
    location: "Harry Ransom Center, Austin",
    funFact:
      "The exposure is estimated to have lasted several hours, possibly as long as eight.",
    isVerified: true,
    createdDaysAgo: 32,
  },
  {
    slug: "the-steerage",
    title: "The Steerage",
    description:
      "Passengers crowd the decks of a steamship, divided by class and framed by stairways and railings.",
    history:
      "Stieglitz made the photograph in 1907 on the Kaiser Wilhelm II, travelling to Europe. He later described it as his 'first photograph' and championed it as evidence that photography could be art. The Met holds an impression.",
    imageUrl: "/artworks/the-steerage.jpg",
    imageWidth: 1600,
    imageHeight: 2006,
    imageCredit: "The Metropolitan Museum of Art / Google Art Project",
    imageLicense: "Public domain",
    imageSourceUrl:
      "https://commons.wikimedia.org/wiki/File:Alfred_Stieglitz_-_The_Steerage_-_Google_Art_Project.jpg",
    category: "photography",
    artistName: "Alfred Stieglitz",
    creationYear: "1907",
    country: "United States",
    location: "The Metropolitan Museum of Art, New York",
    funFact:
      "Stieglitz was drawn to the scene by the shapes of the hats, funnels and gangways rather than by the people alone.",
    isVerified: true,
    createdDaysAgo: 31,
  },
  {
    slug: "mondrian-1930",
    title: "Composition II in Red, Blue, and Yellow",
    description:
      "A grid of black lines enclosing rectangles of white, red, blue and yellow.",
    history:
      "Mondrian painted this composition in 1930, refining the neoplastic grid he had developed in Paris. It is held by the Kunsthaus Zürich.",
    imageUrl: "/artworks/mondrian-1930.jpg",
    imageWidth: 1600,
    imageHeight: 1622,
    imageCredit: "Kunsthaus Zürich / Wikimedia Commons",
    imageLicense: "Public domain",
    imageSourceUrl:
      "https://commons.wikimedia.org/wiki/File:Piet_Mondriaan,_1930_-_Mondrian_Composition_II_in_Red,_Blue,_and_Yellow.jpg",
    category: "abstract-art",
    artistName: "Piet Mondrian",
    creationYear: "1930",
    country: "Netherlands",
    location: "Kunsthaus Zürich",
    funFact:
      "Mondrian's grids were not measured with a ruler; he adjusted the lines by eye until the proportions felt right.",
    isVerified: true,
    createdDaysAgo: 30,
  },
  {
    slug: "armory-show-1913",
    title: "The Armory Show, Cubist Room",
    description:
      "A press photograph of the Cubist room at the 1913 Armory Show in New York, with works by Duchamp, Gleizes and others.",
    history:
      "The International Exhibition of Modern Art opened in New York in February 1913 and later travelled to Chicago and Boston. It introduced many American viewers to Cubism, Futurism and other European avant-garde movements. This photograph was published in the New York Tribune.",
    imageUrl: "/artworks/armory-show.jpg",
    imageWidth: 1600,
    imageHeight: 972,
    imageCredit: "New York Tribune, 1913 / Wikimedia Commons",
    imageLicense: "Public domain",
    imageSourceUrl:
      "https://commons.wikimedia.org/wiki/File:Armory_Show,_1913,_the_Cubist_room,_Raymond_Duchamp-Villon,_Albert_Gleizes,_Marcel_Duchamp,_Alexander_Archipenko,_New_York_Tribune,_17_February_1913,_p._7.jpg",
    category: "photography",
    artistName: "New York Tribune (anonymous photographer)",
    creationYear: "1913",
    country: "United States",
    location: "International Exhibition of Modern Art, New York",
    funFact:
      "Marcel Duchamp's Nude Descending a Staircase became the most talked-about work in the show, though it is not clearly visible in this photograph.",
    isVerified: true,
    createdDaysAgo: 29,
  },
  {
    slug: "demo-suspended-field",
    title: "Suspended Field",
    description:
      "A disc of pale light suspended in an empty room, with a soft shadow pooling on the floor.",
    history:
      "This is demonstration content created for IS THIS ART?. It exists so the platform can show how an installation entry is presented and judged; it is not a historical work and is not attributed to a real artist.",
    imageUrl: "/artworks/demo-suspended-field.svg",
    imageWidth: 1600,
    imageHeight: 1200,
    imageCredit: "IS THIS ART? Studio",
    imageLicense: "Demo content — created for IS THIS ART?",
    imageSourceUrl: null,
    category: "installations",
    artistName: "IS THIS ART? Studio",
    creationYear: "2025",
    country: "—",
    location: "Demo work",
    funFact:
      "Demo content: the image and the work were created for this project.",
    isDemo: true,
    createdDaysAgo: 18,
  },
  {
    slug: "demo-synthetic-garden",
    title: "Synthetic Garden",
    description:
      "An abstract garden generated with a diffusion model, then colour-graded by hand.",
    history:
      "This is demonstration content created for IS THIS ART? to represent the AI Art category. It is not a historical artwork and should not be attributed to a real artist.",
    imageUrl: "/artworks/demo-synthetic-garden.svg",
    imageWidth: 1600,
    imageHeight: 1200,
    imageCredit: "IS THIS ART? Studio (AI-assisted)",
    imageLicense: "Demo content — created for IS THIS ART?",
    imageSourceUrl: null,
    category: "ai-art",
    artistName: "IS THIS ART? Studio (AI-assisted)",
    creationYear: "2025",
    country: "—",
    location: "Demo work",
    funFact:
      "Demo content: no real artist or historical collection is associated with this image.",
    isAiGenerated: true,
    isDemo: true,
    createdDaysAgo: 17,
  },
  {
    slug: "demo-chromatic-study",
    title: "Chromatic Study No. 4",
    description:
      "A digital composition of colour fields, a black square and a single circle, built in code.",
    history:
      "This is demonstration content created for IS THIS ART? to represent digital art. It is not a historical artwork and should not be attributed to a real artist.",
    imageUrl: "/artworks/demo-chromatic-study.svg",
    imageWidth: 1600,
    imageHeight: 1200,
    imageCredit: "IS THIS ART? Studio",
    imageLicense: "Demo content — created for IS THIS ART?",
    imageSourceUrl: null,
    category: "digital-art",
    artistName: "IS THIS ART? Studio",
    creationYear: "2025",
    country: "—",
    location: "Demo work",
    funFact:
      "Demo content: the composition was drawn with SVG shapes and a grain filter.",
    isDemo: true,
    createdDaysAgo: 16,
  },
  {
    slug: "demo-question-repeated",
    title: "A Question, Repeated",
    description:
      "The question 'IS THIS ART?' repeated in a fading grid, interrupted by a single red question mark.",
    history:
      "This is demonstration content created for IS THIS ART? to represent experimental and text-based work. It is not a historical artwork and should not be attributed to a real artist.",
    imageUrl: "/artworks/demo-question-repeated.svg",
    imageWidth: 1600,
    imageHeight: 1200,
    imageCredit: "IS THIS ART? Studio",
    imageLicense: "Demo content — created for IS THIS ART?",
    imageSourceUrl: null,
    category: "experimental-art",
    artistName: "IS THIS ART? Studio",
    creationYear: "2025",
    country: "—",
    location: "Demo work",
    funFact:
      "Demo content: the work is a typographic meditation on the platform's own question.",
    isDemo: true,
    createdDaysAgo: 15,
  },
  {
    slug: "demo-still-life-fold",
    title: "Still Life with a Fold",
    description:
      "A monochrome canvas with a single crease and a small blue rectangle, held in place by light.",
    history:
      "This is demonstration content created for IS THIS ART? to represent contemporary art. It is not a historical artwork and should not be attributed to a real artist.",
    imageUrl: "/artworks/demo-still-life-fold.svg",
    imageWidth: 1600,
    imageHeight: 1200,
    imageCredit: "IS THIS ART? Studio",
    imageLicense: "Demo content — created for IS THIS ART?",
    imageSourceUrl: null,
    category: "contemporary-art",
    artistName: "IS THIS ART? Studio",
    creationYear: "2025",
    country: "—",
    location: "Demo work",
    funFact:
      "Demo content: the fold is drawn, not photographed.",
    isDemo: true,
    createdDaysAgo: 14,
  },
  {
    slug: "demo-afterimage",
    title: "Untitled (Afterimage)",
    description:
      "A halftone afterimage that lingers at the edge of vision, submitted as a test of the moderation flow.",
    history:
      "This is demonstration content created for IS THIS ART? and submitted by a demo account. It stays in the moderation queue until an administrator approves it.",
    imageUrl: "/artworks/demo-afterimage.svg",
    imageWidth: 1600,
    imageHeight: 1200,
    imageCredit: "Mira Sol — demo submission",
    imageLicense: "Demo content — created for IS THIS ART?",
    imageSourceUrl: null,
    category: "digital-art",
    artistName: "Mira Sol",
    creationYear: "2025",
    country: "—",
    location: "Awaiting review",
    funFact:
      "Demo content: this submission demonstrates that new uploads are not published until approved.",
    isDemo: true,
    status: "pending",
    submittedByUsername: "mira",
    createdDaysAgo: 2,
  },
];
