import heroLionessesImg from '../assets/images/hero_lionesses_savannah_1794896390555.jpg';
import bullElephantImg from '../assets/images/bull_elephant_dust_1794896391569.jpg';
import leopardLeadwoodImg from '../assets/images/leopard_leadwood_bough_1794896392780.jpg';
import maleLionImg from '../assets/images/male_lion_chiaroscuro_1794896394189.jpg';
import buffaloMoonlitImg from '../assets/images/buffalo_moonlit_water_1794896396232.jpg';
import flamingosLagoonImg from '../assets/images/flamingos_coastal_lagoon_1794896397084.jpg';
import matriarchCalfSoldImg from '../assets/images/matriarch_calf_crossing_1794896399603.jpg';
import nocturnalLeopardSoldImg from '../assets/images/nocturnal_leopard_prowl_1794896400238.jpg';
import coastalPainterEaselImg from '../assets/images/coastal_painter_easel_1794896401110.jpg';
import youShallNotPassImg from '../assets/images/you_shall_not_pass_1794897708087.jpg';
import loveIsTwoImg from '../assets/images/love_is_two_1794897709042.jpg';
import loveIsOneImg from '../assets/images/love_is_one_1794897709544.jpg';
import theGiftImg from '../assets/images/the_gift_1794897710557.jpg';
import waitForMeTwoImg from '../assets/images/wait_for_me_two_1794897712122.jpg';
import loveIsThreeImg from '../assets/images/love_is_three_1794897711837.jpg';
import savannahMonarchImg from '../assets/images/savannah_monarch_1794897713971.jpg';
import walkerBayDuskImg from '../assets/images/walker_bay_dusk_1794897713461.jpg';
import dustOnTheChobeImg from '../assets/images/dust_on_the_chobe_1794897713311.jpg';

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
 * Complete artwork catalogue sourced from Wild at Art (Steve Jones, Hermanus).
 * Every single artwork—available and sold—is presented with its own unique oil-painting photograph.
 */
export const ARTWORKS: readonly Artwork[] = [
  // Hero full-width slider featured works (4 panoramic / statement available works)
  {
    id: 'waiting-for-the-herds',
    title: 'Waiting for the Herds',
    year: 2026,
    medium: 'Oil on canvas',
    theme: 'Big cats',
    widthCm: 150,
    heightCm: 90,
    priceCentsZar: 4800000,
    status: 'available',
    image: heroLionessesImg,
    imageWidth: 1600,
    imageHeight: 900,
    heroFeatured: true,
    story:
      'Built up with broad palette-knife planes across raw linen, two lionesses hold higher granite ground as late-afternoon heat lifts off the savannah plain.',
  },
  {
    id: 'in-your-face',
    title: 'In Your Face',
    year: 2026,
    medium: 'Oil on canvas',
    theme: 'Elephants & herds',
    widthCm: 150,
    heightCm: 100,
    priceCentsZar: 5500000,
    status: 'available',
    image: bullElephantImg,
    imageWidth: 1200,
    imageHeight: 900,
    heroFeatured: true,
    story:
      'A full-scale bull elephant advances straight out of suspended red-ochre bushveld dust, sculpted in heavy impasto ridges that catch directional gallery light.',
  },
  {
    id: 'vigilance',
    title: 'Vigilance',
    year: 2025,
    medium: 'Oil on canvas',
    theme: 'Big cats',
    widthCm: 150,
    heightCm: 75,
    priceCentsZar: 4200000,
    status: 'available',
    image: leopardLeadwoodImg,
    imageWidth: 1600,
    imageHeight: 900,
    heroFeatured: true,
    story:
      'Wide horizontal study balancing rough silver leadwood bark against the stillness of an African leopard watching the drainage line below.',
  },
  {
    id: 'you-shall-not-pass',
    title: 'You Shall Not Pass',
    year: 2025,
    medium: 'Oil on canvas',
    theme: 'Elephants & herds',
    widthCm: 150,
    heightCm: 90,
    priceCentsZar: 4800000,
    status: 'available',
    image: youShallNotPassImg,
    imageWidth: 1600,
    imageHeight: 900,
    heroFeatured: true,
    story:
      'Panoramic confrontation along a dry mopane track, contrasting dusty slate shadows with bright ivory highlights.',
  },

  // Curated Home Preview + Additional Available Works (all photographed)
  {
    id: 'dominance',
    title: 'Dominance',
    year: 2026,
    medium: 'Oil on canvas',
    theme: 'Big cats',
    widthCm: 120,
    heightCm: 83,
    priceCentsZar: 3000000,
    status: 'available',
    image: maleLionImg,
    imageWidth: 1200,
    imageHeight: 900,
    homePreview: true,
    story:
      'Low chiaroscuro evening light rakes across a dark-maned Kalahari lion, contrasting warm yellow ochre and burnt sienna against deep Prussian-umber shadow.',
  },
  {
    id: 'midnight',
    title: 'Midnight',
    year: 2025,
    medium: 'Oil on canvas',
    theme: 'Nocturnal',
    widthCm: 91,
    heightCm: 61,
    priceCentsZar: 2250000,
    status: 'available',
    image: buffaloMoonlitImg,
    imageWidth: 1200,
    imageHeight: 900,
    homePreview: true,
    story:
      'Painted in a restrained nocturnal key of ultramarine, raw umber, and titanium white as Cape buffalo test the shallows of a moonlit pan.',
  },
  {
    id: 'pretty-in-pink',
    title: 'Pretty in Pink',
    year: 2025,
    medium: 'Oil on canvas board',
    theme: 'Coastal & birdlife',
    widthCm: 85,
    heightCm: 75,
    priceCentsZar: 1000000,
    status: 'available',
    image: flamingosLagoonImg,
    imageWidth: 1200,
    imageHeight: 900,
    homePreview: true,
    story:
      'Inspired by Western Cape lagoon estuaries near Walker Bay, Greater Flamingos wade through mineral grey-blue water broken with brisk knife strokes.',
  },
  {
    id: 'love-is-2',
    title: 'Love Is #2',
    year: 2025,
    medium: 'Oil on canvas',
    theme: 'Elephants & herds',
    widthCm: 76,
    heightCm: 61,
    priceCentsZar: 1200000,
    status: 'available',
    image: loveIsTwoImg,
    imageWidth: 1200,
    imageHeight: 900,
    story:
      'Intimate close-cropped study of intertwined trunks and textured hide in warm ochre and raw umber glazes.',
  },
  {
    id: 'love-is-1',
    title: 'Love Is #1',
    year: 2024,
    medium: 'Oil on canvas',
    theme: 'Coastal & birdlife',
    widthCm: 60,
    heightCm: 45,
    priceCentsZar: 650000,
    status: 'available',
    image: loveIsOneImg,
    imageWidth: 1200,
    imageHeight: 900,
    story:
      'Paired study of Grey Crowned Cranes exploring gesture and companionship through economical bristle brushwork on fine-grain linen.',
  },
  {
    id: 'the-gift',
    title: 'The Gift',
    year: 2024,
    medium: 'Oil on canvas',
    theme: 'Coastal & birdlife',
    widthCm: 51,
    heightCm: 26,
    priceCentsZar: 400000,
    status: 'available',
    image: theGiftImg,
    imageWidth: 1600,
    imageHeight: 900,
    story:
      'Compact horizontal cabinet oil study of coastal wading birds painted alla prima in a single morning session at the Hermanus studio.',
  },

  // Sold Paintings (Archival Portfolio — 100% photographed)
  {
    id: 'wait-for-me-part-1',
    title: 'Wait for Me — Part I',
    year: 2024,
    medium: 'Oil on canvas',
    theme: 'Elephants & herds',
    widthCm: 120,
    heightCm: 90,
    priceCentsZar: null,
    status: 'sold',
    image: matriarchCalfSoldImg,
    imageWidth: 1200,
    imageHeight: 900,
    provenanceNote: 'Private collection, Cape Town',
    story:
      'An elephant matriarch checks her stride across sun-bleached river sand so a young calf keeps pace; part one of a two-canvas narrative pairing.',
  },
  {
    id: 'the-night-stalker-moves',
    title: 'The Night Stalker Moves',
    year: 2024,
    medium: 'Oil on canvas',
    theme: 'Nocturnal',
    widthCm: 61,
    heightCm: 91,
    priceCentsZar: null,
    status: 'sold',
    image: nocturnalLeopardSoldImg,
    imageWidth: 900,
    imageHeight: 1200,
    provenanceNote: 'Private collection, United Kingdom',
    story:
      'Vertical twilight study capturing the silent forward shift of a leopard parting dry winter grass as dusk cools into deep ultramarine.',
  },
  {
    id: 'wait-for-me-part-2',
    title: 'Wait for Me — Part II',
    year: 2024,
    medium: 'Oil on canvas',
    theme: 'Elephants & herds',
    widthCm: 120,
    heightCm: 90,
    priceCentsZar: null,
    status: 'sold',
    image: waitForMeTwoImg,
    imageWidth: 1200,
    imageHeight: 900,
    provenanceNote: 'Private collection, Johannesburg',
    story:
      'Companion canvas to Part I, following the matriarch and calf up the opposite riverbank into warm late-afternoon acacia shade.',
  },
  {
    id: 'love-is-3',
    title: 'Love Is #3',
    year: 2023,
    medium: 'Oil on canvas',
    theme: 'Big cats',
    widthCm: 60,
    heightCm: 45,
    priceCentsZar: null,
    status: 'sold',
    image: loveIsThreeImg,
    imageWidth: 1200,
    imageHeight: 900,
    provenanceNote: 'Private collection, Hermanus',
    story:
      'Third study in the Love Is series, pairing warm sienna underpainting with crisp palette-knife highlights.',
  },
  {
    id: 'savannah-monarch',
    title: 'Savannah Monarch',
    year: 2022,
    medium: 'Oil on canvas',
    theme: 'Big cats',
    widthCm: 150,
    heightCm: 100,
    priceCentsZar: null,
    status: 'sold',
    image: savannahMonarchImg,
    imageWidth: 1200,
    imageHeight: 900,
    provenanceNote: 'Presidential & private collection, South Africa',
    story:
      'Large-scale portrait of an older Lowveld lion painted after field sketching along the Sabie River.',
  },
  {
    id: 'walker-bay-dusk',
    title: 'Walker Bay Dusk Study',
    year: 2021,
    medium: 'Oil on canvas board',
    theme: 'Coastal & birdlife',
    widthCm: 80,
    heightCm: 60,
    priceCentsZar: null,
    status: 'sold',
    image: walkerBayDuskImg,
    imageWidth: 1200,
    imageHeight: 900,
    provenanceNote: 'Private collection, Munich',
    story:
      'Plein-air inspired oil study looking across the cliff path and kelp gulls just metres from the Harbour Road gallery door.',
  },
  {
    id: 'dust-on-the-chobe',
    title: 'Dust on the Chobe',
    year: 2019,
    medium: 'Oil on canvas',
    theme: 'Elephants & herds',
    widthCm: 140,
    heightCm: 85,
    priceCentsZar: null,
    status: 'sold',
    image: dustOnTheChobeImg,
    imageWidth: 1600,
    imageHeight: 900,
    provenanceNote: 'Private collection, Surrey, England',
    story:
      'Breeding herd silhouetted against backlit riverine dust, painted from field notebooks compiled in northern Botswana.',
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
    featuredWorksCount: 10,
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
    featuredWorksCount: 14,
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
  {
    id: 'autumn-nocturnes-2026',
    title: 'After Last Light — Nocturnal Bushveld Studies',
    venue: 'Wild at Art Gallery',
    city: 'Hermanus, Western Cape',
    address: 'Harbour Road, Hermanus, 7200',
    start: [2026, 4, 3],
    end: [2026, 5, 17],
    openingNight: 'Held Friday 3 Apr 2026 · Harbour Road, Hermanus',
    kind: 'Solo showcase',
    summary:
      'Focused presentation of moonlit waterhole and twilight predator oils exploring cool Prussian blue, raw umber, and silver-titanium highlights.',
    featuredWorksCount: 9,
    isHarbourRoadVenue: true,
  },
  {
    id: 'ten-years-in-hermanus-2025',
    title: 'A Decade on Harbour Road (2015–2025 Retrospective)',
    venue: 'Wild at Art Gallery',
    city: 'Hermanus, Western Cape',
    address: 'Harbour Road, Hermanus, 7200',
    start: [2025, 11, 7],
    end: [2025, 12, 14],
    openingNight: 'Held Friday 7 Nov 2025 · Harbour Road, Hermanus',
    kind: 'Solo showcase',
    summary:
      'Milestone gallery retrospective marking ten years since Steve Jones established his permanent studio and gallery in Hermanus.',
    featuredWorksCount: 18,
    isHarbourRoadVenue: true,
  },
  {
    id: 'harbour-road-collectors-2023',
    title: 'Untamed Texture — Impasto & Palette Knife Oils',
    venue: 'Wild at Art Gallery',
    city: 'Hermanus, Western Cape',
    address: 'Harbour Road, Hermanus, 7200',
    start: [2023, 12, 8],
    end: [2024, 1, 21],
    openingNight: 'Held Friday 8 Dec 2023 · Harbour Road, Hermanus',
    kind: 'Solo showcase',
    summary:
      'Summer collector showcase featuring large-format elephant and leopard canvases acquired by private collections across Europe and Southern Africa.',
    featuredWorksCount: 15,
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
