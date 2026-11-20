import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowRight, Calendar, ChevronLeft, ChevronRight, Eye, Pause, Play } from 'lucide-react';
import { ARTIST_CONTACT, STUDIO_IMAGE, type Artwork, type ExhibitionEvent } from '../data/catalog';
import {
  buildEventIcsContent,
  formatDimensions,
  formatExhibitionRange,
  formatZarMinorUnits,
  makeLocalDate,
  type DimensionUnit,
} from '../utils/galleryMath';
import type { PageId } from '../components/TopBar';
import { ArtworkImage, Button } from '../components/ui';

interface HomePageProps {
  heroWorks: readonly Artwork[];
  previewWorks: readonly Artwork[];
  soldPreviewWorks: readonly Artwork[];
  exhibitions: readonly ExhibitionEvent[];
  nextExhibition: ExhibitionEvent | null;
  unit: DimensionUnit;
  onNavigate: (page: PageId) => void;
  onQuickView: (artwork: Artwork, pool: readonly Artwork[]) => void;
  onInquire: (artwork: Artwork) => void;
}

export function HomePage({
  heroWorks,
  previewWorks,
  soldPreviewWorks,
  exhibitions,
  nextExhibition,
  unit,
  onNavigate,
  onQuickView,
  onInquire,
}: HomePageProps) {
  const [heroIndex, setHeroIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const swipeStartX = useRef<number | null>(null);

  useEffect(() => {
    if (paused || heroWorks.length <= 1) return;
    const timer = window.setInterval(() => {
      setHeroIndex((prev) => (prev + 1) % heroWorks.length);
    }, 6500);
    return () => window.clearInterval(timer);
  }, [paused, heroWorks.length]);

  const activeHero = heroWorks[heroIndex] ?? heroWorks[0];

  const goPrevHero = () =>
    setHeroIndex((prev) => (prev - 1 + heroWorks.length) % heroWorks.length);
  const goNextHero = () =>
    setHeroIndex((prev) => (prev + 1) % heroWorks.length);

  const handleDownloadIcs = (ev: ExhibitionEvent) => {
    const ics = buildEventIcsContent({
      id: ev.id,
      title: ev.title,
      location: `${ev.venue}, ${ev.address}, ${ev.city}`,
      description: `${ev.openingNight} — ${ev.summary}`,
      start: ev.start,
      end: ev.end,
    });
    const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${ev.id}.ics`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  };

  // Pick up to 3 upcoming exhibitions for the Ozeum exhibition strip
  const now = new Date();
  const today = makeLocalDate(now.getFullYear(), now.getMonth() + 1, now.getDate());
  const upcomingShows = exhibitions
    .filter((ev) => makeLocalDate(ev.end[0], ev.end[1], ev.end[2]).getTime() >= today.getTime())
    .sort(
      (a, b) =>
        makeLocalDate(a.start[0], a.start[1], a.start[2]).getTime() -
        makeLocalDate(b.start[0], b.start[1], b.start[2]).getTime()
    )
    .slice(0, 3);

  const secondaryShows = upcomingShows.filter((ev) => ev.id !== nextExhibition?.id).slice(0, 2);

  return (
    <div className="bg-background text-foreground">
      {/* 1. Full-Bleed Architectural Museum Hero Slider */}
      <section
        aria-label="Featured painting slider"
        aria-roledescription="carousel"
        className="relative w-full overflow-hidden bg-viewer text-viewer-foreground"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onPointerDown={(e) => {
          swipeStartX.current = e.clientX;
        }}
        onPointerUp={(e) => {
          if (swipeStartX.current === null || heroWorks.length <= 1) return;
          const dx = e.clientX - swipeStartX.current;
          swipeStartX.current = null;
          if (Math.abs(dx) > 56) {
            if (dx < 0) goNextHero();
            else goPrevHero();
          }
        }}
      >
        <div className="relative flex min-h-[540px] w-full flex-col justify-end sm:min-h-[640px] lg:block lg:h-[78dvh] lg:max-h-[840px]">
          {activeHero ? (
            <AnimatePresence mode="sync" initial={false}>
              <motion.div
                key={activeHero.id}
                initial={{ opacity: 0.25, scale: 1.015 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0.25 }}
                transition={{ duration: 0.55, ease: 'easeOut' }}
                className="absolute inset-0"
              >
                <img
                  src={activeHero.image}
                  alt={`${activeHero.title} — ${activeHero.medium} by Steve Jones`}
                  width={activeHero.imageWidth}
                  height={activeHero.imageHeight}
                  loading="eager"
                  decoding="sync"
                  referrerPolicy="no-referrer"
                  className="h-full w-full object-cover object-center"
                />
              </motion.div>
            </AnimatePresence>
          ) : null}

          {/* Measured directional gradient scrim for crisp museum-grade legibility */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-black/25"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/95 via-black/68 to-black/20 lg:bg-gradient-to-r lg:from-black/90 lg:via-black/58 lg:to-black/20"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 bottom-0 h-60 bg-gradient-to-t from-black/95 via-black/75 to-transparent"
          />

          {/* Side Arrow Controls */}
          {heroWorks.length > 1 ? (
            <>
              <button
                type="button"
                onClick={goPrevHero}
                aria-label="Previous featured painting"
                className="absolute top-1/2 left-5 z-20 hidden min-h-12 min-w-12 -translate-y-1/2 items-center justify-center rounded-control border border-white/35 bg-black/75 text-white transition-colors duration-150 hover:border-white hover:bg-black focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white md:inline-flex"
              >
                <ChevronLeft className="size-5" />
              </button>
              <button
                type="button"
                onClick={goNextHero}
                aria-label="Next featured painting"
                className="absolute top-1/2 right-5 z-20 hidden min-h-12 min-w-12 -translate-y-1/2 items-center justify-center rounded-control border border-white/35 bg-black/75 text-white transition-colors duration-150 hover:border-white hover:bg-black focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white md:inline-flex"
              >
                <ChevronRight className="size-5" />
              </button>
            </>
          ) : null}

          {/* Foreground Museum Hero Content */}
          <div className="relative z-10 mx-auto flex w-full max-w-[90rem] flex-col justify-end px-4 pt-24 pb-8 sm:px-8 sm:pt-28 sm:pb-12 lg:h-full">
            <div className="grid grid-cols-1 items-end gap-7 sm:gap-8 lg:grid-cols-12">
              <div className="min-w-0 space-y-5 lg:col-span-7">
                <p className="text-xs font-medium uppercase tracking-[0.16em] text-[#ece8df]">
                  Harbour Road · Hermanus · Steve Jones
                </p>

                <h1 className="font-display text-display text-white">
                  Wildlife oil paintings shaped by dust, shadow, and linen
                </h1>

                <p className="max-w-[38em] text-base leading-relaxed text-[#f5f3ee]">
                  Monumental palette-knife and hog-bristle oils of Southern African megafauna,
                  painted from field sketches by self-taught artist Steve Jones.
                </p>

                <div className="flex flex-wrap items-center gap-3 pt-1">
                  <Button
                    tone="accent"
                    onClick={() => onNavigate('gallery')}
                  >
                    <span>Explore collection</span>
                    <ArrowRight className="size-4" />
                  </Button>
                  <Button tone="viewer" onClick={() => onNavigate('events')}>
                    Current exhibitions
                  </Button>
                </div>
              </div>

              {/* Right: Active Canvas Placard & Index Tabs */}
              {activeHero ? (
                <div className="min-w-0 space-y-4 lg:col-span-5 lg:text-right">
                  <div className="space-y-1">
                    <p className="text-xs uppercase tracking-[0.14em] text-[#e6e1d6] tabular-nums">
                      Featured plate 0{heroIndex + 1} / 0{heroWorks.length}
                    </p>
                    <p className="font-display text-2xl font-medium text-white sm:text-3xl">
                      {activeHero.title}
                    </p>
                    <p className="text-sm text-[#f5f3ee] tabular-nums">
                      {activeHero.medium} ·{' '}
                      {formatDimensions(activeHero.widthCm, activeHero.heightCm, unit)}
                      {activeHero.priceCentsZar !== null
                        ? ` · ${formatZarMinorUnits(activeHero.priceCentsZar)}`
                        : ''}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 lg:justify-end">
                    <button
                      type="button"
                      onClick={() => onQuickView(activeHero, heroWorks)}
                      className="text-xs font-medium uppercase tracking-[0.12em] text-white underline decoration-white/60 underline-offset-4 hover:decoration-white"
                    >
                      Inspect canvas
                    </button>
                    <span className="text-white/65" aria-hidden="true">
                      ·
                    </span>
                    <button
                      type="button"
                      onClick={() => onInquire(activeHero)}
                      className="text-xs font-medium uppercase tracking-[0.12em] text-white underline decoration-white/60 underline-offset-4 hover:decoration-white"
                    >
                      Inquire
                    </button>
                  </div>

                  {/* Slider Controls & Title Tabs */}
                  <div className="flex flex-wrap items-center gap-1.5 pt-1 lg:justify-end">
                    <div className="flex items-center gap-1.5 md:hidden">
                      <button
                        type="button"
                        onClick={goPrevHero}
                        aria-label="Previous slide"
                        className="inline-flex min-h-10 min-w-10 items-center justify-center rounded-control border border-white/35 bg-black/70 text-white"
                      >
                        <ChevronLeft className="size-4" />
                      </button>
                      <button
                        type="button"
                        onClick={goNextHero}
                        aria-label="Next slide"
                        className="inline-flex min-h-10 min-w-10 items-center justify-center rounded-control border border-white/35 bg-black/70 text-white"
                      >
                        <ChevronRight className="size-4" />
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => setPaused((p) => !p)}
                      aria-label={paused ? 'Resume slider rotation' : 'Pause slider rotation'}
                      className="inline-flex min-h-10 min-w-10 items-center justify-center rounded-control border border-white/35 bg-black/70 text-white hover:border-white"
                    >
                      {paused ? <Play className="size-3.5" /> : <Pause className="size-3.5" />}
                    </button>

                    <div
                      className="flex flex-wrap items-center gap-1.5"
                      role="tablist"
                      aria-label="Choose featured painting"
                    >
                      {heroWorks.map((work, idx) => {
                        const selected = idx === heroIndex;
                        return (
                          <button
                            key={work.id}
                            type="button"
                            role="tab"
                            aria-selected={selected}
                            aria-label={work.title}
                            onClick={() => setHeroIndex(idx)}
                            className={`min-h-10 min-w-10 rounded-control px-2.5 text-xs transition-colors duration-150 ${
                              selected
                                ? 'border border-white bg-white font-medium text-viewer'
                                : 'border border-white/35 bg-black/65 text-white hover:border-white'
                            }`}
                          >
                            <span className="tabular-nums sm:hidden">0{idx + 1}</span>
                            <span className="hidden sm:inline">{work.title}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </section>

      {/* Operational Gallery Utility Ribbon (Ozeum Institutional Pattern) */}
      <section aria-label="Gallery visitor information" className="border-b border-border bg-surface">
        <div className="mx-auto grid max-w-[90rem] grid-cols-1 divide-y divide-border px-4 sm:grid-cols-2 sm:divide-y-0 sm:px-8 lg:grid-cols-4 lg:divide-x">
          <div className="py-3.5 sm:border-b sm:border-border sm:pr-6 sm:py-4 lg:border-b-0">
            <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-muted">
              Opening hours
            </p>
            <p className="mt-1 text-sm font-medium text-foreground">
              Tue – Sun · 09:30 – 17:00
            </p>
          </div>
          <div className="py-3.5 sm:border-b sm:border-l sm:border-border sm:pl-6 sm:py-4 lg:border-b-0 lg:border-l-0 lg:px-6">
            <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-muted">
              Location
            </p>
            <p className="mt-1 text-sm font-medium text-foreground">
              {ARTIST_CONTACT.streetAddress}
            </p>
          </div>
          <div className="py-3.5 sm:pr-6 sm:py-4 lg:px-6">
            <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-muted">
              First Fridays Artwalk
            </p>
            <p className="mt-1 text-sm font-medium text-foreground">
              Open monthly until 20:00
            </p>
          </div>
          <div className="flex items-center justify-between gap-4 py-3.5 sm:border-l sm:border-border sm:pl-6 sm:py-4 lg:border-l-0 lg:pl-6">
            <div>
              <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-muted">
                Admission
              </p>
              <p className="mt-1 text-sm font-medium text-foreground">Open studio viewing</p>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('contact')}
              className="shrink-0 whitespace-nowrap text-xs font-medium uppercase tracking-[0.12em] text-accent underline decoration-accent/50 underline-offset-4 hover:decoration-accent"
            >
              Plan a visit
            </button>
          </div>
        </div>
      </section>

      {/* 2. Exhibitions & Seasonal Viewings (Ozeum Asymmetric Showcase) */}
      {nextExhibition ? (
        <section
          aria-labelledby="exhibitions-home-heading"
          className="border-b border-border bg-background py-12 sm:py-24"
        >
          <div className="mx-auto max-w-[90rem] px-4 sm:px-8">
            <div className="flex flex-wrap items-end justify-between gap-4 border-b border-border pb-6">
              <div className="space-y-2">
                <p className="text-xs font-medium uppercase tracking-[0.14em] text-accent">
                  01 · Exhibitions & Events
                </p>
                <h2 id="exhibitions-home-heading" className="font-display text-title text-foreground">
                  Exhibitions on view & upcoming
                </h2>
              </div>
              <Button tone="quiet" onClick={() => onNavigate('events')}>
                <span>All exhibitions</span>
                <ArrowRight className="size-4" />
              </Button>
            </div>

            <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-stretch">
              {/* Left: Featured Exhibition Visual Plate */}
              <div className="min-w-0 lg:col-span-6">
                {previewWorks[0] ? (
                  <button
                    type="button"
                    onClick={() => onQuickView(previewWorks[0], previewWorks)}
                    aria-label={`Inspect exhibition highlight ${previewWorks[0].title}`}
                    className="group block h-full w-full overflow-hidden border border-border bg-surface p-3 text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                  >
                    <div className="h-full overflow-hidden">
                      <ArtworkImage
                        src={previewWorks[0].image}
                        alt={`${previewWorks[0].title} featured for ${nextExhibition.title}`}
                        title={previewWorks[0].title}
                        width={previewWorks[0].imageWidth}
                        height={previewWorks[0].imageHeight}
                        zoomOnHover
                        className="h-full w-full object-cover"
                      />
                    </div>
                  </button>
                ) : null}
              </div>

              {/* Right: Next Exhibition Narrative & Secondary Exhibition List */}
              <div className="flex min-w-0 flex-col justify-between space-y-8 lg:col-span-6">
                <div className="space-y-4">
                  <p className="text-xs font-medium uppercase tracking-[0.14em] text-accent tabular-nums">
                    {formatExhibitionRange(nextExhibition.start, nextExhibition.end)} ·{' '}
                    {nextExhibition.kind}
                  </p>
                  <h3 className="font-display text-3xl font-medium leading-tight text-foreground sm:text-4xl">
                    {nextExhibition.title}
                  </h3>
                  <p className="text-sm font-medium text-foreground">
                    {nextExhibition.venue}, {nextExhibition.city}
                  </p>
                  <p className="max-w-[58ch] text-base leading-relaxed text-muted">
                    {nextExhibition.summary}
                  </p>
                  <p className="text-sm text-muted">
                    <span className="font-medium text-foreground">Opening reception:</span>{' '}
                    {nextExhibition.openingNight}
                  </p>

                  <div className="flex flex-wrap items-center gap-3 pt-2">
                    <Button tone="primary" onClick={() => onNavigate('events')}>
                      <span>Exhibition details</span>
                      <ArrowRight className="size-4" />
                    </Button>
                    <Button tone="quiet" onClick={() => handleDownloadIcs(nextExhibition)}>
                      <Calendar className="size-4" />
                      <span>Add to calendar</span>
                    </Button>
                  </div>
                </div>

                {secondaryShows.length > 0 ? (
                  <div className="divide-y divide-border border-t border-border pt-2">
                    {secondaryShows.map((ev) => (
                      <div
                        key={ev.id}
                        className="flex flex-wrap items-baseline justify-between gap-4 py-4"
                      >
                        <div className="min-w-0 space-y-0.5">
                          <p className="text-xs uppercase tracking-[0.12em] text-muted tabular-nums">
                            {formatExhibitionRange(ev.start, ev.end)} · {ev.kind}
                          </p>
                          <p className="font-display text-xl text-foreground">{ev.title}</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => onNavigate('events')}
                          className="shrink-0 text-xs font-medium uppercase tracking-[0.12em] text-foreground underline decoration-border-strong underline-offset-4 hover:decoration-foreground"
                        >
                          Schedule
                        </button>
                      </div>
                    ))}
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </section>
      ) : null}

      {/* 3. Current Collection in the Gallery (Museum Catalog 3-Column Grid) */}
      <section
        aria-labelledby="curated-preview-heading"
        className="bg-surface py-12 sm:py-24"
      >
        <div className="mx-auto max-w-[90rem] px-4 sm:px-8">
          <div className="flex flex-wrap items-end justify-between gap-4 border-b border-border pb-6">
            <div className="space-y-2">
              <p className="text-xs font-medium uppercase tracking-[0.14em] text-accent">
                02 · Current Collection
              </p>
              <h2 id="curated-preview-heading" className="font-display text-title text-foreground">
                Original oils currently in the gallery
              </h2>
              <p className="max-w-[58ch] text-sm text-muted">
                Selected original canvases available for private viewing in Hermanus or insured
                worldwide crating.
              </p>
            </div>
            <Button tone="quiet" onClick={() => onNavigate('gallery')}>
              <span>Browse full collection</span>
              <ArrowRight className="size-4" />
            </Button>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-8 md:grid-cols-3">
            {previewWorks.map((work) => (
              <article
                key={work.id}
                className="group flex min-w-0 flex-col justify-between space-y-5 border border-border bg-background p-4 sm:p-5"
              >
                <div className="space-y-4">
                  <button
                    type="button"
                    onClick={() => onQuickView(work, previewWorks)}
                    aria-label={`Quick view ${work.title}`}
                    className="block w-full overflow-hidden border border-border/70 bg-surface p-2 text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                  >
                    <div className="overflow-hidden">
                      <ArtworkImage
                        src={work.image}
                        alt={`${work.title} — ${work.medium}, ${formatDimensions(work.widthCm, work.heightCm, 'cm')}`}
                        title={work.title}
                        width={work.imageWidth}
                        height={work.imageHeight}
                        zoomOnHover
                      />
                    </div>
                  </button>

                  <div className="space-y-1.5">
                    <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-muted tabular-nums">
                      {work.theme} · {work.year}
                    </p>
                    <div className="flex items-baseline justify-between gap-3">
                      <h3 className="font-display text-2xl font-medium text-foreground">
                        {work.title}
                      </h3>
                      {work.priceCentsZar !== null ? (
                        <span className="shrink-0 text-sm font-medium text-foreground tabular-nums">
                          {formatZarMinorUnits(work.priceCentsZar)}
                        </span>
                      ) : null}
                    </div>
                    <p className="text-sm text-muted tabular-nums">
                      {work.medium} · {formatDimensions(work.widthCm, work.heightCm, unit)} ·{' '}
                      <span className="text-accent">Available</span>
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2.5 border-t border-border pt-4">
                  <Button
                    tone="quiet"
                    className="flex-1"
                    onClick={() => onQuickView(work, previewWorks)}
                  >
                    <Eye className="size-4" />
                    <span>Quick view</span>
                  </Button>
                  <Button tone="primary" className="flex-1" onClick={() => onInquire(work)}>
                    Inquire
                  </Button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Dark Obsidian Studio & Provenance Room (Ozeum Signature Dark Gallery Band) */}
      <section
        aria-labelledby="about-artist-home-heading"
        className="bg-viewer py-12 text-viewer-foreground sm:py-24"
      >
        <div className="mx-auto max-w-[90rem] px-4 sm:px-8">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-start">
            {/* Left column: Artist Monograph, Pull Quote & Craft Pillars */}
            <div className="min-w-0 space-y-8 lg:col-span-7">
              <div className="space-y-3">
                <p className="text-xs font-medium uppercase tracking-[0.14em] text-accent">
                  03 · Studio Practice & Provenance
                </p>
                <h2
                  id="about-artist-home-heading"
                  className="font-display text-title text-viewer-foreground"
                >
                  From Warwickshire field notebooks to the coastal studio on Harbour Road
                </h2>
              </div>

              <blockquote className="border-y border-viewer-muted/20 py-5 font-display text-2xl italic leading-snug text-viewer-foreground sm:text-[1.75rem]">
                “Raw Belgian linen and steel palette knives allow a bull elephant’s scarred hide or
                moonlit waterhole to hold genuine sculptural relief.”
              </blockquote>

              <div className="max-w-[65ch] space-y-4 text-base leading-relaxed text-viewer-muted">
                <p>
                  Born in Coventry, England in 1962, self-taught wildlife painter{' '}
                  <span className="font-medium text-viewer-foreground">Steve Jones</span> spent
                  decades sketching British birds and woodland mammals directly from life before
                  relocating permanently to South Africa in 1996.
                </p>
                <p>
                  Settling in <span className="font-medium text-viewer-foreground">Hermanus</span>{' '}
                  in 2015, Jones opened Wild at Art Gallery steps above the Atlantic cliff path.
                  Today his oils hang in private and corporate collections across Europe, North
                  America, and Southern Africa—including fifteen works in the collection of South
                  African President Cyril Ramaphosa.
                </p>
              </div>

              <div className="divide-y divide-viewer-muted/20 border-y border-viewer-muted/20">
                <div className="grid grid-cols-1 gap-2 py-4 sm:grid-cols-12 sm:gap-4">
                  <p className="text-xs font-medium uppercase tracking-[0.12em] text-viewer-foreground sm:col-span-4">
                    Palette-knife & linen
                  </p>
                  <p className="text-sm leading-relaxed text-viewer-muted sm:col-span-8">
                    Heavyweight Belgian linen layered with raw umber, yellow ochre, burnt sienna,
                    and Prussian blue for lasting tactile depth.
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-2 py-4 sm:grid-cols-12 sm:gap-4">
                  <p className="text-xs font-medium uppercase tracking-[0.12em] text-viewer-foreground sm:col-span-4">
                    International provenance
                  </p>
                  <p className="text-sm leading-relaxed text-viewer-muted sm:col-span-8">
                    Placed with collectors in the UK, Germany, North America, and South Africa,
                    accompanied by signed studio provenance certificates.
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-2 py-4 sm:grid-cols-12 sm:gap-4">
                  <p className="text-xs font-medium uppercase tracking-[0.12em] text-viewer-foreground sm:col-span-4">
                    Studio commissions
                  </p>
                  <p className="text-sm leading-relaxed text-viewer-muted sm:col-span-8">
                    Visit Harbour Road Tuesday to Sunday to view works in progress, or commission a
                    custom-scale canvas shipped crated or rolled worldwide.
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3 pt-1">
                <Button tone="accent" onClick={() => onNavigate('about')}>
                  <span>Full artist biography</span>
                  <ArrowRight className="size-4" />
                </Button>
                <Button tone="viewer" onClick={() => onNavigate('sold')}>
                  View sold archive
                </Button>
              </div>
            </div>

            {/* Right column: Studio Easel Photography & Chronological Milestones */}
            <div className="min-w-0 space-y-6 lg:col-span-5">
              <div className="border border-viewer-muted/25 bg-viewer-surface p-3">
                <ArtworkImage
                  src={STUDIO_IMAGE.src}
                  alt={STUDIO_IMAGE.alt}
                  title="Wild at Art Studio Easel, Hermanus"
                  width={STUDIO_IMAGE.width}
                  height={STUDIO_IMAGE.height}
                />
                <p className="mt-3 px-1 text-xs leading-relaxed text-viewer-muted">
                  Morning Atlantic window light across the H-frame easel, raw linen canvases, and
                  palette knives at Wild at Art Gallery, Harbour Road, Hermanus.
                </p>
              </div>

              <div className="grid grid-cols-3 divide-x divide-viewer-muted/25 border border-viewer-muted/25 bg-viewer-surface text-center">
                <div className="px-2 py-3.5 sm:px-3 sm:py-4">
                  <p className="font-display text-xl text-viewer-foreground tabular-nums sm:text-2xl">1962</p>
                  <p className="mt-1 text-[10px] uppercase tracking-[0.08em] text-viewer-muted sm:text-[11px] sm:tracking-[0.1em]">
                    Coventry
                  </p>
                </div>
                <div className="px-2 py-3.5 sm:px-3 sm:py-4">
                  <p className="font-display text-xl text-viewer-foreground tabular-nums sm:text-2xl">1996</p>
                  <p className="mt-1 text-[10px] uppercase tracking-[0.08em] text-viewer-muted sm:text-[11px] sm:tracking-[0.1em]">
                    South Africa
                  </p>
                </div>
                <div className="px-2 py-3.5 sm:px-3 sm:py-4">
                  <p className="font-display text-xl text-viewer-foreground tabular-nums sm:text-2xl">2015</p>
                  <p className="mt-1 text-[10px] uppercase tracking-[0.08em] text-viewer-muted sm:text-[11px] sm:tracking-[0.1em]">
                    Hermanus
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Additional Available Works in the Gallery */}
      <section aria-labelledby="archive-preview-heading" className="bg-background py-12 sm:py-24">
        <div className="mx-auto max-w-[90rem] px-4 sm:px-8">
          <div className="flex flex-wrap items-end justify-between gap-4 border-b border-border pb-6">
            <div className="space-y-2">
              <p className="text-xs font-medium uppercase tracking-[0.14em] text-accent">
                04 · Gallery Highlights
              </p>
              <h2 id="archive-preview-heading" className="font-display text-title text-foreground">
                More statement oils from the collection
              </h2>
              <p className="max-w-[58ch] text-sm text-muted">
                Original available oil paintings currently exhibited on Harbour Road, Hermanus.
              </p>
            </div>
            <Button tone="quiet" onClick={() => onNavigate('gallery')}>
              <span>View full collection</span>
              <ArrowRight className="size-4" />
            </Button>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-8 md:grid-cols-3">
            {soldPreviewWorks.map((work) => (
              <article key={work.id} className="group min-w-0 space-y-4">
                <button
                  type="button"
                  onClick={() => onQuickView(work, soldPreviewWorks)}
                  aria-label={`Inspect ${work.title}`}
                  className="block w-full overflow-hidden border border-border bg-surface p-2.5 text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                >
                  <div className="overflow-hidden">
                    <ArtworkImage
                      src={work.image}
                      alt={`${work.title} (${work.year}) — Oil painting`}
                      title={work.title}
                      width={work.imageWidth}
                      height={work.imageHeight}
                      zoomOnHover
                    />
                  </div>
                </button>
                <div className="space-y-1">
                  <div className="flex items-baseline justify-between gap-3">
                    <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-muted tabular-nums">
                      {work.theme} · {work.year}
                    </p>
                    {work.priceCentsZar !== null ? (
                      <span className="text-sm font-medium text-foreground tabular-nums">
                        {formatZarMinorUnits(work.priceCentsZar)}
                      </span>
                    ) : null}
                  </div>
                  <h3 className="font-display text-2xl font-medium text-foreground">{work.title}</h3>
                  <p className="text-sm text-muted tabular-nums">
                    {work.medium} · {formatDimensions(work.widthCm, work.heightCm, unit)} ·{' '}
                    <span className="text-accent">Available</span>
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
