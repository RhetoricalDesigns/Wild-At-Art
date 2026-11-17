import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { Button } from './ui';

export type PageId = 'home' | 'gallery' | 'sold' | 'events' | 'about' | 'contact';

interface TopBarProps {
  currentPage: PageId;
  onNavigate: (page: PageId) => void;
}

const NAV_LINKS: readonly { id: Exclude<PageId, 'contact'>; label: string }[] = [
  { id: 'home', label: 'Home' },
  { id: 'gallery', label: 'Collection' },
  { id: 'sold', label: 'Archive' },
  { id: 'events', label: 'Exhibitions' },
  { id: 'about', label: 'About' },
];

export function TopBar({ currentPage, onNavigate }: TopBarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleSelect = (page: PageId) => {
    setMobileOpen(false);
    onNavigate(page);
  };

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-surface">
      <div className="mx-auto flex max-w-[90rem] items-center justify-between gap-3 px-4 py-3 sm:gap-8 sm:px-8 sm:py-4">
        {/* Zone 1: Single-element Brand Wordmark */}
        <a
          href="#home"
          onClick={(e) => {
            e.preventDefault();
            handleSelect('home');
          }}
          className="min-w-0 shrink-0 whitespace-nowrap font-display text-[1.2rem] font-medium tracking-tight text-foreground focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary sm:text-[1.65rem]"
        >
          Wild at Art · Steve Jones
        </a>

        {/* Zone 2: 5 clean single-line navigation links */}
        <nav aria-label="Main navigation" className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((item) => {
            const active = currentPage === item.id;
            return (
              <a
                key={item.id}
                href={`#${item.id}`}
                aria-current={active ? 'page' : undefined}
                onClick={(e) => {
                  e.preventDefault();
                  handleSelect(item.id);
                }}
                className={`relative shrink-0 whitespace-nowrap py-1 text-xs font-medium uppercase tracking-[0.12em] transition-colors duration-150 ease-out focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary ${
                  active
                    ? 'text-foreground after:absolute after:inset-x-0 after:-bottom-1 after:h-[2px] after:bg-accent'
                    : 'text-muted hover:text-foreground'
                }`}
              >
                {item.label}
              </a>
            );
          })}
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="hidden shrink-0 items-center md:flex">
          <Button
            tone={currentPage === 'contact' ? 'accent' : 'primary'}
            onClick={() => handleSelect('contact')}
          >
            Inquire
          </Button>
        </div>

        {/* Mobile menu toggle */}
        <button
          type="button"
          aria-expanded={mobileOpen}
          aria-controls="mobile-gallery-nav"
          aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
          onClick={() => setMobileOpen((prev) => !prev)}
          className="inline-flex min-h-11 min-w-11 shrink-0 items-center justify-center rounded-control border border-border bg-surface text-foreground md:hidden"
        >
          {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      {/* Collapsible mobile menu */}
      {mobileOpen ? (
        <nav
          id="mobile-gallery-nav"
          aria-label="Mobile navigation"
          className="max-h-[calc(100dvh-4.5rem)] overflow-y-auto border-t border-border bg-surface px-4 py-4 md:hidden"
        >
          <div className="flex flex-col divide-y divide-border/70">
            {NAV_LINKS.map((item) => {
              const active = currentPage === item.id;
              return (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  aria-current={active ? 'page' : undefined}
                  onClick={(e) => {
                    e.preventDefault();
                    handleSelect(item.id);
                  }}
                  className={`flex min-h-11 items-center justify-between py-2.5 text-sm font-medium uppercase tracking-[0.1em] ${
                    active ? 'text-accent' : 'text-foreground'
                  }`}
                >
                  <span>{item.label}</span>
                </a>
              );
            })}
            <div className="pt-3">
              <Button
                tone="primary"
                className="w-full"
                onClick={() => handleSelect('contact')}
              >
                Plan a visit or inquire
              </Button>
            </div>
          </div>
        </nav>
      ) : null}
    </header>
  );
}
