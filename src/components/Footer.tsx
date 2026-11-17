import { ARTIST_CONTACT } from '../data/catalog';
import type { PageId } from './TopBar';

interface FooterProps {
  onNavigate: (page: PageId) => void;
}

export function Footer({ onNavigate }: FooterProps) {
  const go = (page: PageId) => (e: React.MouseEvent) => {
    e.preventDefault();
    onNavigate(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="mt-20 border-t border-viewer-muted/20 bg-viewer text-viewer-foreground">
      <div className="mx-auto max-w-[90rem] px-4 py-14 sm:px-8 lg:py-20">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-12">
          {/* Column 1: Gallery Identity */}
          <div className="min-w-0 space-y-4 md:col-span-4">
            <p className="font-display text-3xl font-medium tracking-tight text-viewer-foreground">
              Wild at Art
            </p>
            <p className="max-w-[34ch] text-sm leading-relaxed text-viewer-muted">
              Original wildlife oil paintings on raw Belgian linen and canvas board by self-taught
              artist Steve Jones, exhibited at Harbour Road in Hermanus.
            </p>
            <p className="text-xs uppercase tracking-[0.12em] text-viewer-muted">
              Worldwide insured crating · South Africa
            </p>
          </div>

          {/* Column 2: Portfolio Index */}
          <div className="min-w-0 space-y-3 md:col-span-2">
            <h2 className="text-xs font-medium uppercase tracking-[0.14em] text-viewer-foreground">
              Gallery
            </h2>
            <ul className="space-y-2.5 text-sm text-viewer-muted">
              <li>
                <a href="#home" onClick={go('home')} className="transition-colors hover:text-viewer-foreground">
                  Home
                </a>
              </li>
              <li>
                <a href="#gallery" onClick={go('gallery')} className="transition-colors hover:text-viewer-foreground">
                  Collection
                </a>
              </li>
              <li>
                <a href="#sold" onClick={go('sold')} className="transition-colors hover:text-viewer-foreground">
                  Sold archive
                </a>
              </li>
              <li>
                <a href="#events" onClick={go('events')} className="transition-colors hover:text-viewer-foreground">
                  Exhibitions
                </a>
              </li>
              <li>
                <a href="#about" onClick={go('about')} className="transition-colors hover:text-viewer-foreground">
                  About artist
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: Opening Hours & Location */}
          <div className="min-w-0 space-y-3 md:col-span-3">
            <h2 className="text-xs font-medium uppercase tracking-[0.14em] text-viewer-foreground">
              Visit & Hours
            </h2>
            <div className="space-y-2 text-sm text-viewer-muted">
              <p className="text-viewer-foreground">{ARTIST_CONTACT.galleryName}</p>
              <p>
                {ARTIST_CONTACT.streetAddress}
                <br />
                {ARTIST_CONTACT.region}
              </p>
              <p className="pt-1">Tuesday – Sunday, 09:30 – 17:00</p>
              <p>First Fridays until 20:00</p>
            </div>
          </div>

          {/* Column 4: Direct Studio Contact */}
          <div className="min-w-0 space-y-3 md:col-span-3">
            <h2 className="text-xs font-medium uppercase tracking-[0.14em] text-viewer-foreground">
              Collector Desk
            </h2>
            <address className="not-italic space-y-2 text-sm text-viewer-muted">
              <p>
                <a
                  href={`mailto:${ARTIST_CONTACT.emailPrimary}`}
                  className="text-viewer-foreground underline decoration-viewer-muted/50 underline-offset-4 transition-colors hover:decoration-viewer-foreground"
                >
                  {ARTIST_CONTACT.emailPrimary}
                </a>
              </p>
              <p>
                <a
                  href={ARTIST_CONTACT.phoneHref}
                  className="tabular-nums text-viewer-foreground transition-colors hover:text-viewer-muted"
                >
                  {ARTIST_CONTACT.phoneDisplay}
                </a>
              </p>
              <div className="pt-2">
                <a
                  href="#contact"
                  onClick={go('contact')}
                  className="inline-flex min-h-10 items-center border border-viewer-muted/40 px-4 text-xs font-medium uppercase tracking-[0.12em] text-viewer-foreground transition-colors hover:border-viewer-foreground hover:bg-viewer-surface"
                >
                  Arrange a viewing
                </a>
              </div>
            </address>
          </div>
        </div>

        <div className="mt-14 flex flex-wrap items-center justify-between gap-4 border-t border-viewer-muted/20 pt-6 text-xs text-viewer-muted">
          <p>© {new Date().getFullYear()} Wild at Art · Steve Jones. All artworks copyright of the artist.</p>
          <p className="uppercase tracking-[0.12em]">Hermanus · Western Cape · South Africa</p>
        </div>
      </div>
    </footer>
  );
}
