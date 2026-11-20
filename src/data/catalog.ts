import coastalPainterEaselImg from '../assets/images/coastal_painter_easel_1794896401110.jpg';

export type ArtworkMedium = 'Oil on canvas' | 'Oil on canvas board';
export type ArtworkTheme = 'Big cats' | 'Elephants & herds' | 'Nocturnal' | 'Coastal & birdlife';
export type ArtworkStatus = 'available' | 'sold';

export interface Artwork {
  id: string;
  title: string;
  year: number;
  medium: ArtworkMedium;
  theme: ArtworkTheme;
  widthCm: number;
  heightCm: number;
  /** Stored in integer minor units (cents ZAR); null for sold archival works */
  priceCentsZar: number | null;
  status: ArtworkStatus;
  /** Unique 1-to-1 artwork plate photograph */
  image: string;
  imageWidth: number;
  imageHeight: number;
  heroFeatured?: boolean;
  homePreview?: boolean;
  provenanceNote?: string;
  story: string;
}

export interface ExhibitionEvent {
  id: string;
  title: string;
  venue: string;
  city: string;
  address: string;
  start: [number, number, number];
  end: [number, number, number];
  openingNight: string;
  kind: 'Solo showcase' | 'Open studio & artwalk' | 'Group exhibition';
  summary: string;
  featuredWorksCount?: number;
  isHarbourRoadVenue: boolean;
}

export interface AccordionSection {
  id: string;
  title: string;
  subtitle: string;
  entries: {
    period: string;
    heading: string;
    detail: string;
  }[];
}

export const STUDIO_IMAGE = {
  src: coastalPainterEaselImg,
  width: 1200,
  height: 900,
  alt: 'Wooden H-frame easel holding an oil study on raw Belgian linen beside squeezed oil pigment tubes, linseed oil, and palette knives in morning daylight at the Harbour Road studio in Hermanus.',
};

export const ARTIST_CONTACT = {
  galleryName: 'Wild at Art Gallery',
  artistName: 'Steve Jones',
  streetAddress: 'Harbour Road, Hermanus, 7200',
  region: 'Western Cape, South Africa',
  phoneDisplay: '+27 83 740 8133',
  phoneHref: 'tel:+27837408133',
  emailPrimary: 'info@wildatart.co.za',
  emailStudio: 'stevefootprintjones@gmail.com',
  hours: 'Tuesday – Sunday, 09:30 – 17:00 · First Fridays until 20:00',
  instagramUrl: 'https://www.instagram.com/',
  facebookUrl: 'https://www.facebook.com/',
};

/**
 * Complete artwork catalogue sourced from Wild at Art (Steve Jones, Hermanus)
 * featuring the exact uploaded artist works.
 */
export const ARTWORKS: readonly Artwork[] = [
  {
    id: 'waiting-for-the-herds',
    title: 'Waiting for the Herds',
    year: 2026,
    medium: 'Oil on canvas',
    theme: 'Big cats',
    widthCm: 150,
    heightCm: 90,
    priceCentsZar: 5500000,
    status: 'available',
    image: '/assets/aistudio/Waiting_for_the_herds_150_x_90cms_R5__5000_d277f428.jpeg',
    imageWidth: 1600,
    imageHeight: 1200,
    heroFeatured: true,
    homePreview: true,
    story:
      'A male lion and lioness keeping watch from elevated granite rock formations under a dramatic stormy sky.',
  },
  {
    id: 'dominance',
    title: 'Dominance',
    year: 2026,
    medium: 'Oil on canvas',
    theme: 'Big cats',
    widthCm: 120,
    heightCm: 83,
    priceCentsZar: 3800000,
    status: 'available',
    image: '/assets/aistudio/Dominance_120x83_cms_R38__000_76cd7476.jpeg',
    imageWidth: 1600,
    imageHeight: 1200,
    heroFeatured: true,
    homePreview: true,
    story:
      'Low chiaroscuro evening light rakes across a dark-maned Kalahari lion, contrasting warm yellow ochre and burnt sienna against deep Prussian-umber shadow.',
  },
  {
    id: 'follow-the-leader',
    title: 'Follow the Leader',
    year: 2026,
    medium: 'Oil on canvas',
    theme: 'Elephants & herds',
    widthCm: 150,
    heightCm: 90,
    priceCentsZar: 5500000,
    status: 'available',
    image: '/assets/aistudio/Follow_the_leader_150x90cms_R55__000_6c6b10b2.jpeg',
    imageWidth: 1600,
    imageHeight: 1200,
    heroFeatured: true,
    homePreview: true,
    story:
      'An elephant matriarch leads her breeding herd along a sun-bleached bushveld track in monumental scale.',
  },
  {
    id: 'into-the-leopards-lair',
    title: "Into the Leopard's Lair",
    year: 2026,
    medium: 'Oil on canvas',
    theme: 'Big cats',
    widthCm: 150,
    heightCm: 62,
    priceCentsZar: 4000000,
    status: 'available',
    image: '/assets/aistudio/In_to_the_leopards_lair_150x62_cms_R40__000._c80cb688.jpeg',
    imageWidth: 1600,
    imageHeight: 1200,
    heroFeatured: true,
    story:
      'A commanding leopard resting upon weathered rock formations, carved with steel palette knives and rich bristle textures.',
  },
  {
    id: 'flight-of-the-fish-eagle',
    title: 'Flight of the Fish Eagle',
    year: 2025,
    medium: 'Oil on canvas',
    theme: 'Coastal & birdlife',
    widthCm: 91,
    heightCm: 61,
    priceCentsZar: 2500000,
    status: 'available',
    image: '/assets/aistudio/Flight_of_the_fish_eagle_91_x61cms_R25__000_21736d80.jpeg',
    imageWidth: 1200,
    imageHeight: 1600,
    homePreview: true,
    story:
      'An African fish eagle soaring in powerful silhouette against crisp blue skies and sunlit cloud banks.',
  },
  {
    id: 'the-night-stalker',
    title: 'The Night Stalker',
    year: 2025,
    medium: 'Oil on canvas',
    theme: 'Nocturnal',
    widthCm: 91,
    heightCm: 61,
    priceCentsZar: 2500000,
    status: 'available',
    image: '/assets/aistudio/The_night_stalker_91_x61_cms_R25__000_75fc27e3.jpeg',
    imageWidth: 1600,
    imageHeight: 1200,
    homePreview: true,
    story:
      'A leopard framed in silhouette upon a sloping leadwood bough as warm dusk twilight breaks across the bushveld.',
  },
  {
    id: 'the-twitches',
    title: 'The Twitches',
    year: 2025,
    medium: 'Oil on canvas',
    theme: 'Big cats',
    widthCm: 101,
    heightCm: 76,
    priceCentsZar: 3000000,
    status: 'available',
    image: '/assets/aistudio/The_twitches_101x76cms_R30__000_5b2dbaee.jpeg',
    imageWidth: 1600,
    imageHeight: 1200,
    homePreview: true,
    story:
      'Two alert leopard cubs gazing upward in rapt attention, captured with expressive bristle brushwork.',
  },
  {
    id: 'the-kiss',
    title: 'The Kiss',
    year: 2025,
    medium: 'Oil on canvas',
    theme: 'Elephants & herds',
    widthCm: 101,
    heightCm: 76,
    priceCentsZar: 3000000,
    status: 'available',
    image: '/assets/aistudio/The_kiss_-_101x76cms_R30__000_86cece5d.jpeg',
    imageWidth: 1600,
    imageHeight: 1200,
    story:
      'Two elephants gently touching trunks in a moment of tenderness, rendered in textured impasto.',
  },
  {
    id: 'the-lovers',
    title: 'The Lovers',
    year: 2025,
    medium: 'Oil on canvas',
    theme: 'Elephants & herds',
    widthCm: 76,
    heightCm: 50,
    priceCentsZar: 1500000,
    status: 'available',
    image: '/assets/aistudio/The_lovers_76x50cms_R15000_for_the_pair_547bb928.jpeg',
    imageWidth: 1600,
    imageHeight: 1200,
    story:
      'Two giraffes depicted in gentle intimacy across paired canvases, rendered in soft atmospheric tones with rich impasto brushwork.',
  },
  {
    id: 'monarch-of-the-bushveld',
    title: 'Monarch of the Bushveld',
    year: 2025,
    medium: 'Oil on canvas',
    theme: 'Elephants & herds',
    widthCm: 91,
    heightCm: 61,
    priceCentsZar: 2500000,
    status: 'available',
    image: '/assets/aistudio/Monarch_of_the_bushveld-91x61cms_R25__000_781a7198.jpeg',
    imageWidth: 1200,
    imageHeight: 1600,
    story:
      'A magnificent Kudu bull with sweeping spiral horns standing watchful amidst sun-dappled bushveld foliage.',
  },
  {
    id: 'midnight',
    title: 'Midnight',
    year: 2025,
    medium: 'Oil on canvas',
    theme: 'Elephants & herds',
    widthCm: 91,
    heightCm: 61,
    priceCentsZar: 2500000,
    status: 'available',
    image: '/assets/aistudio/Midnight_91_x_61cms_R2__5000_65423880.jpeg',
    imageWidth: 1600,
    imageHeight: 1200,
    story:
      'A striking sable antelope bull captured in dramatic lighting against a warm neutral background.',
  },
  {
    id: 'lean-on-me',
    title: 'Lean on Me',
    year: 2025,
    medium: 'Oil on canvas',
    theme: 'Elephants & herds',
    widthCm: 100,
    heightCm: 50,
    priceCentsZar: 1850000,
    status: 'available',
    image: '/assets/aistudio/Lean_on_me_100x50cms_R1__8500_dcc22a1e.jpeg',
    imageWidth: 1600,
    imageHeight: 1200,
    story:
      'Two zebras resting side-by-side, their contrasting monochrome stripes interwoven in harmony.',
  },
];

/**
 * Chronological Exhibitions & Gallery Events relative to Nov 2026.
 */
export const EXHIBITIONS: readonly ExhibitionEvent[] = [
  {
    id: 'first-fridays-dec-2026',
    title: 'Summer Harbour Road Open Evening — First Fridays Artwalk',
    venue: 'Wild at Art Gallery',
    city: 'Hermanus, Western Cape',
    address: 'Harbour Road, Hermanus, 7200',
    start: [2026, 12, 4],
    end: [2026, 12, 4],
    openingNight: 'Friday 4 Dec 2026 · 17:00 – 20:30 SAST (Artist walkthrough at 18:15)',
    kind: 'Open studio & artwalk',
    summary:
      'Late-evening coastal gallery walk through central Hermanus. View recent large-format bushveld oils on the easel and meet Steve Jones in the Harbour Road space.',
    featuredWorksCount: 12,
    isHarbourRoadVenue: true,
  },
  {
    id: 'walker-bay-summer-salon-2027',
    title: 'Light Over Dry Earth — New Large-Scale Wildlife Oils',
    venue: 'Wild at Art Gallery',
    city: 'Hermanus, Western Cape',
    address: 'Harbour Road, Hermanus, 7200',
    start: [2026, 12, 18],
    end: [2027, 1, 31],
    openingNight: 'Friday 18 Dec 2026 · 17:30 – 20:00 SAST',
    kind: 'Solo showcase',
    summary:
      'Annual summer solo presentation unveiling statement 150 cm linen canvases dedicated to Lowveld elephant herds, nocturnal buffalo studies, and Kalahari lions.',
    featuredWorksCount: 12,
    isHarbourRoadVenue: true,
  },
  {
    id: 'hermanus-coastal-arts-june-2027',
    title: 'Winter Whale-Season Studio Exhibition & Field Sketchbook Display',
    venue: 'Wild at Art Gallery',
    city: 'Hermanus, Western Cape',
    address: 'Harbour Road, Hermanus, 7200',
    start: [2027, 6, 11],
    end: [2027, 6, 21],
    openingNight: 'Friday 11 Jun 2027 · 17:00 – 20:00 SAST',
    kind: 'Solo showcase',
    summary:
      'Ten-day winter exhibition pairing finished oil-on-canvas wildlife works with Steve Jones’s graphite and charcoal field notebooks from South African reserves.',
    featuredWorksCount: 12,
    isHarbourRoadVenue: true,
  },
];

export const ABOUT_ACCORDION: readonly AccordionSection[] = [
  {
    id: 'collections-milestones',
    title: 'Notable collections & career milestones',
    subtitle: 'From Coventry field sketches to international private holdings',
    entries: [
      {
        period: '2015 – Present',
        heading: 'Wild at Art Gallery, Harbour Road, Hermanus',
        detail:
          'Established a dedicated coastal gallery and working painting studio steps from the Old Harbour cliff path in Hermanus, welcoming local and international collectors year-round.',
      },
      {
        period: 'Private & Public Holdings',
        heading: 'Presidential & international collector acquisitions',
        detail:
          'Works held in private and corporate collections across the United Kingdom, Germany, North America, and South Africa—including fifteen paintings acquired for the collection of South African President Cyril Ramaphosa.',
      },
      {
        period: '1996 – 2014',
        heading: 'Relocation to South Africa & transition to full-scale oils',
        detail:
          'Relocated from England to South Africa in 1996 to live closer to national parks and game reserves, evolving from graphite wildlife drawing into bold, tactile oil-on-canvas painting.',
      },
      {
        period: '1962 – 1995',
        heading: 'Early observational drawing in Warwickshire, England',
        detail:
          'Born in Coventry in 1962; entirely self-taught, spending decades sketching British countryside birds and mammals directly from life before turning toward African megafauna.',
      },
    ],
  },
  {
    id: 'selected-exhibitions-cv',
    title: 'Selected gallery showcases & open studios',
    subtitle: 'Solo presentations and Hermanus artwalk participation',
    entries: [
      {
        period: '2026',
        heading: 'After Last Light — Nocturnal Bushveld Studies',
        detail: 'Solo gallery presentation at Wild at Art Gallery, Harbour Road, Hermanus.',
      },
      {
        period: '2025',
        heading: 'A Decade on Harbour Road (2015–2025)',
        detail: 'Ten-year Hermanus studio milestone showcase featuring new and loaned archival oils.',
      },
      {
        period: '2018 – 2026',
        heading: 'Hermanus First Fridays Artwalk',
        detail:
          'Regular participating Harbour Road gallery welcoming evening visitors on the first Friday of each month.',
      },
      {
        period: '2023',
        heading: 'Untamed Texture — Impasto & Palette Knife Oils',
        detail: 'Summer solo exhibition of monumental 150 cm wildlife canvases, Hermanus.',
      },
    ],
  },
  {
    id: 'materials-shipping',
    title: 'Studio materials, commissions & worldwide crating',
    subtitle: 'Archival linen preparation, oil pigments, and collector logistics',
    entries: [
      {
        period: 'Ground & Pigments',
        heading: 'Heavyweight stretched linen & artist-grade oil colour',
        detail:
          'Paintings are executed on deep-edge stretched Belgian linen or primed canvas board using hog-bristle brushes and steel palette knives for lasting structural relief.',
      },
      {
        period: 'Commissions',
        heading: 'Bespoke wildlife commissions from field reference',
        detail:
          'Collectors inspired by an archived sold work may commission an original painting tailored to specific wall dimensions while preserving one-of-a-kind brushwork.',
      },
      {
        period: 'Global Dispatch',
        heading: 'Rolled tube or custom timber-crated freight from Cape Town',
        detail:
          'Large canvases can be shipped stretched in custom museum-grade timber crates within South Africa or rolled in reinforced archival cylinders for insured international courier delivery.',
      },
    ],
  },
];
