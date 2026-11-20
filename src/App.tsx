import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, MotionConfig, motion } from 'motion/react';
import { ARTWORKS, EXHIBITIONS, type Artwork, type ExhibitionEvent } from './data/catalog';
import { makeLocalDate, type DimensionUnit } from './utils/galleryMath';
import { ErrorBoundary } from './components/ErrorBoundary';
import { TopBar, type PageId } from './components/TopBar';
import { Footer } from './components/Footer';
import { LightboxModal } from './components/LightboxModal';
import { HomePage } from './pages/HomePage';
import { GalleryPage } from './pages/GalleryPage';
import { SoldArchivePage } from './pages/SoldArchivePage';
import { EventsPage } from './pages/EventsPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage, type InquiryContextPayload } from './pages/ContactPage';

const VALID_PAGES: readonly PageId[] = ['home', 'gallery', 'sold', 'events', 'about', 'contact'];
const UNIT_STORAGE_KEY = 'wildatart.unit.v1';

function parseHashPage(): PageId {
  if (typeof window === 'undefined') return 'home';
  const raw = window.location.hash.replace(/^#/, '').trim().toLowerCase();
  if ((VALID_PAGES as readonly string[]).includes(raw)) {
    return raw as PageId;
  }
  return 'home';
}

function readInitialUnit(): DimensionUnit {
  try {
    const saved = window.localStorage.getItem(UNIT_STORAGE_KEY);
    return saved === 'in' ? 'in' : 'cm';
  } catch {
    return 'cm';
  }
}

function PortfolioShell() {
  const [currentPage, setCurrentPage] = useState<PageId>(() => parseHashPage());
  const [unit, setUnit] = useState<DimensionUnit>(() => readInitialUnit());
  const [lightboxPool, setLightboxPool] = useState<readonly Artwork[]>(ARTWORKS);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [inquiryContext, setInquiryContext] = useState<InquiryContextPayload | null>(null);

  useEffect(() => {
    const onHashChange = () => {
      setCurrentPage(parseHashPage());
    };
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  const navigateTo = (page: PageId) => {
    setCurrentPage(page);
    if (window.location.hash !== `#${page}`) {
      window.history.pushState(null, '', `#${page}`);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleChangeUnit = (nextUnit: DimensionUnit) => {
    setUnit(nextUnit);
    try {
      window.localStorage.setItem(UNIT_STORAGE_KEY, nextUnit);
    } catch {
      // ignore storage failure
    }
  };

  const availableWorks = useMemo(
    () => ARTWORKS.filter((w) => w.status === 'available'),
    []
  );

  const soldWorks = useMemo(
    () => ARTWORKS.filter((w) => w.status === 'sold'),
    []
  );

  const heroWorks = useMemo(
    () => availableWorks.filter((w) => w.heroFeatured),
    [availableWorks]
  );

  const previewWorks = useMemo(
    () => availableWorks.filter((w) => w.homePreview),
    [availableWorks]
  );

  const nextExhibition = useMemo(() => {
    const now = new Date();
    const today = makeLocalDate(now.getFullYear(), now.getMonth() + 1, now.getDate());
    const upcoming = EXHIBITIONS.filter(
      (ev) => makeLocalDate(ev.end[0], ev.end[1], ev.end[2]).getTime() >= today.getTime()
    ).sort(
      (a, b) =>
        makeLocalDate(a.start[0], a.start[1], a.start[2]).getTime() -
        makeLocalDate(b.start[0], b.start[1], b.start[2]).getTime()
    );
    return upcoming[0] ?? EXHIBITIONS[0] ?? null;
  }, []);

  const handleQuickView = (artwork: Artwork, pool: readonly Artwork[]) => {
    const safePool = pool.length > 0 ? pool : ARTWORKS;
    const idx = safePool.findIndex((item) => item.id === artwork.id);
    setLightboxPool(safePool);
    setLightboxIndex(idx >= 0 ? idx : 0);
  };

  const handleInquireArtwork = (artwork: Artwork) => {
    setLightboxIndex(null);
    setInquiryContext({
      kind: artwork.status === 'sold' ? 'commission' : 'artwork',
      artwork,
    });
    navigateTo('contact');
  };

  const handleInquireEvent = (event: ExhibitionEvent) => {
    setInquiryContext({
      kind: 'event',
      event,
    });
    navigateTo('contact');
  };

  const handleSelectArtworkInForm = (artworkId: string) => {
    const found = ARTWORKS.find((w) => w.id === artworkId);
    if (!found) {
      setInquiryContext(null);
      return;
    }
    setInquiryContext({
      kind: found.status === 'sold' ? 'commission' : 'artwork',
      artwork: found,
    });
  };

  return (
    <MotionConfig reducedMotion="user">
      <div className="flex min-h-dvh flex-col bg-background text-foreground">
        <TopBar
          currentPage={currentPage}
          onNavigate={navigateTo}
        />

        <main className="flex-1">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={currentPage}
              initial={{ opacity: 0.92, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0.94, y: -4 }}
              transition={{ duration: 0.18, ease: 'easeOut' }}
            >
              {currentPage === 'home' && (
                <HomePage
                  heroWorks={heroWorks}
                  previewWorks={previewWorks}
                  soldPreviewWorks={availableWorks.slice(3, 6)}
                  exhibitions={EXHIBITIONS}
                  nextExhibition={nextExhibition}
                  unit={unit}
                  onNavigate={navigateTo}
                  onQuickView={handleQuickView}
                  onInquire={handleInquireArtwork}
                />
              )}

              {currentPage === 'gallery' && (
                <GalleryPage
                  availableWorks={availableWorks}
                  unit={unit}
                  onChangeUnit={handleChangeUnit}
                  onQuickView={handleQuickView}
                  onInquire={handleInquireArtwork}
                />
              )}

              {currentPage === 'sold' && (
                <SoldArchivePage
                  soldWorks={soldWorks}
                  unit={unit}
                  onQuickView={handleQuickView}
                  onCommissionSimilar={handleInquireArtwork}
                />
              )}

              {currentPage === 'events' && (
                <EventsPage
                  exhibitions={EXHIBITIONS}
                  onInquireEvent={handleInquireEvent}
                />
              )}

              {currentPage === 'about' && <AboutPage onNavigate={navigateTo} />}

              {currentPage === 'contact' && (
                <ContactPage
                  allArtworks={ARTWORKS}
                  inquiryContext={inquiryContext}
                  unit={unit}
                  onClearContext={() => setInquiryContext(null)}
                  onSelectArtworkContext={handleSelectArtworkInForm}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </main>

        <Footer onNavigate={navigateTo} />

        <LightboxModal
          works={lightboxPool}
          activeIndex={lightboxIndex}
          unit={unit}
          onClose={() => setLightboxIndex(null)}
          onChangeIndex={(nextIdx) => setLightboxIndex(nextIdx)}
          onInquire={handleInquireArtwork}
        />
      </div>
    </MotionConfig>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <PortfolioShell />
    </ErrorBoundary>
  );
}
