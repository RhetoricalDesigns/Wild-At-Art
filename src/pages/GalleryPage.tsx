import { useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { Eye, RotateCcw, Search } from 'lucide-react';
import type { Artwork, ArtworkMedium, ArtworkTheme } from '../data/catalog';
import {
  formatDimensions,
  formatZarMinorUnits,
  getScaleCategory,
  type DimensionUnit,
  type ScaleCategory,
} from '../utils/galleryMath';
import { ArtworkImage, Button, FilterChip, Surface, inputClassName } from '../components/ui';

interface GalleryPageProps {
  availableWorks: readonly Artwork[];
  unit: DimensionUnit;
  onChangeUnit: (unit: DimensionUnit) => void;
  onQuickView: (artwork: Artwork, pool: readonly Artwork[]) => void;
  onInquire: (artwork: Artwork) => void;
}

type SortKey = 'curated' | 'price-asc' | 'price-desc' | 'scale-desc';

const THEMES: readonly ('All' | ArtworkTheme)[] = [
  'All',
  'Big cats',
  'Elephants & herds',
  'Nocturnal',
  'Coastal & birdlife',
];

const MEDIUMS: readonly ('All' | ArtworkMedium)[] = [
  'All',
  'Oil on canvas',
  'Oil on canvas board',
];

const SCALES: readonly { id: 'all' | ScaleCategory; label: string }[] = [
  { id: 'all', label: 'All sizes' },
  { id: 'statement', label: 'Statement (120 cm+)' },
  { id: 'medium', label: 'Medium (75–119 cm)' },
  { id: 'study', label: 'Study (<75 cm)' },
];

export function GalleryPage({
  availableWorks,
  unit,
  onChangeUnit,
  onQuickView,
  onInquire,
}: GalleryPageProps) {
  const [selectedTheme, setSelectedTheme] = useState<'All' | ArtworkTheme>('All');
  const [selectedMedium, setSelectedMedium] = useState<'All' | ArtworkMedium>('All');
  const [selectedScale, setSelectedScale] = useState<'all' | ScaleCategory>('all');
  const [sortBy, setSortBy] = useState<SortKey>('curated');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredWorks = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    const list = availableWorks.filter((work) => {
      if (selectedTheme !== 'All' && work.theme !== selectedTheme) return false;
      if (selectedMedium !== 'All' && work.medium !== selectedMedium) return false;
      if (
        selectedScale !== 'all' &&
        getScaleCategory(work.widthCm, work.heightCm) !== selectedScale
      ) {
        return false;
      }
      if (q) {
        const haystack = `${work.title} ${work.medium} ${work.theme} ${work.story}`.toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      return true;
    });

    if (sortBy === 'price-asc') {
      return [...list].sort((a, b) => (a.priceCentsZar ?? 0) - (b.priceCentsZar ?? 0));
    }
    if (sortBy === 'price-desc') {
      return [...list].sort((a, b) => (b.priceCentsZar ?? 0) - (a.priceCentsZar ?? 0));
    }
    if (sortBy === 'scale-desc') {
      return [...list].sort((a, b) => b.widthCm * b.heightCm - a.widthCm * a.heightCm);
    }
    return list;
  }, [availableWorks, selectedTheme, selectedMedium, selectedScale, sortBy, searchQuery]);

  const hasActiveFilters =
    selectedTheme !== 'All' ||
    selectedMedium !== 'All' ||
    selectedScale !== 'all' ||
    sortBy !== 'curated' ||
    searchQuery.trim() !== '';

  const resetFilters = () => {
    setSelectedTheme('All');
    setSelectedMedium('All');
    setSelectedScale('all');
    setSortBy('curated');
    setSearchQuery('');
  };

  return (
    <div className="mx-auto max-w-[90rem] space-y-12 px-4 py-10 sm:px-8 sm:py-16">
      {/* Page Header */}
      <div className="flex flex-wrap items-end justify-between gap-6 border-b border-border pb-8">
        <div className="min-w-0 space-y-2.5">
          <p className="text-xs font-medium uppercase tracking-[0.14em] text-accent">
            Harbour Road Inventory · Available Works
          </p>
          <h1 className="font-display text-display text-foreground">Gallery collection</h1>
          <p className="max-w-[60ch] text-base leading-relaxed text-muted">
            Original available wildlife oil paintings by Steve Jones. Open Quick view on any work to
            inspect brushwork or compare canvas scale against a 2.8 m museum wall.
          </p>
        </div>

        {/* Metric / Imperial toggle */}
        <div className="flex items-center gap-3">
          <span className="text-xs font-medium uppercase tracking-[0.12em] text-muted">
            Dimensions
          </span>
          <div
            role="group"
            aria-label="Measurement unit"
            className="inline-flex rounded-control border border-border bg-surface p-0.5"
          >
            <button
              type="button"
              aria-pressed={unit === 'cm'}
              onClick={() => onChangeUnit('cm')}
              className={`min-h-9 rounded-control px-3 text-xs font-medium uppercase tracking-[0.1em] transition-colors duration-150 ${
                unit === 'cm'
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted hover:text-foreground'
              }`}
            >
              CM
            </button>
            <button
              type="button"
              aria-pressed={unit === 'in'}
              onClick={() => onChangeUnit('in')}
              className={`min-h-9 rounded-control px-3 text-xs font-medium uppercase tracking-[0.1em] transition-colors duration-150 ${
                unit === 'in'
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted hover:text-foreground'
              }`}
            >
              IN
            </button>
          </div>
        </div>
      </div>

      {/* Curatorial Filter Bar */}
      <Surface className="space-y-4 p-5 sm:p-6">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-12 lg:items-center">
          <div className="relative min-w-0 lg:col-span-5">
            <label htmlFor="gallery-search" className="sr-only">
              Search available paintings by title, subject, or medium
            </label>
            <Search
              aria-hidden="true"
              className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted"
            />
            <input
              id="gallery-search"
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search title, animal, or technique…"
              className={`${inputClassName} pl-10`}
            />
          </div>

          <div className="flex flex-wrap items-center gap-4 lg:col-span-7 lg:justify-end">
            <div className="flex items-center gap-2">
              <label
                htmlFor="gallery-medium-select"
                className="text-xs font-medium uppercase tracking-[0.1em] text-muted"
              >
                Medium
              </label>
              <select
                id="gallery-medium-select"
                value={selectedMedium}
                onChange={(e) => setSelectedMedium(e.target.value as 'All' | ArtworkMedium)}
                className="min-h-10 rounded-control border border-border-strong bg-surface px-3 text-sm text-foreground focus-visible:outline-2 focus-visible:outline-primary"
              >
                {MEDIUMS.map((m) => (
                  <option key={m} value={m}>
                    {m === 'All' ? 'All mediums' : m}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2">
              <label
                htmlFor="gallery-sort-select"
                className="text-xs font-medium uppercase tracking-[0.1em] text-muted"
              >
                Order
              </label>
              <select
                id="gallery-sort-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortKey)}
                className="min-h-10 rounded-control border border-border-strong bg-surface px-3 text-sm text-foreground focus-visible:outline-2 focus-visible:outline-primary"
              >
                <option value="curated">Curated hang</option>
                <option value="price-desc">Price: high to low</option>
                <option value="price-asc">Price: low to high</option>
                <option value="scale-desc">Largest canvas first</option>
              </select>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-border/80 pt-4">
          <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Filter by wildlife theme">
            {THEMES.map((theme) => (
              <FilterChip
                key={theme}
                active={selectedTheme === theme}
                onClick={() => setSelectedTheme(theme)}
              >
                {theme === 'All' ? 'All subjects' : theme}
              </FilterChip>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Filter by canvas scale">
            {SCALES.map((scale) => (
              <FilterChip
                key={scale.id}
                active={selectedScale === scale.id}
                onClick={() => setSelectedScale(scale.id)}
              >
                {scale.label}
              </FilterChip>
            ))}
          </div>
        </div>

        <div
          role="status"
          aria-live="polite"
          className="flex flex-wrap items-center justify-between gap-2 border-t border-border/80 pt-3 text-xs text-muted"
        >
          <span className="tabular-nums">
            Showing {filteredWorks.length} of {availableWorks.length} available works · Prices in ZAR inclusive of studio provenance certificate
          </span>
          {hasActiveFilters ? (
            <button
              type="button"
              onClick={resetFilters}
              className="inline-flex items-center gap-1.5 font-medium uppercase tracking-[0.1em] text-accent hover:underline"
            >
              <RotateCcw className="size-3.5" />
              <span>Reset filters</span>
            </button>
          ) : null}
        </div>
      </Surface>

      {/* Empty state */}
      {filteredWorks.length === 0 ? (
        <Surface className="space-y-4 p-12 text-center">
          <h2 className="font-display text-3xl text-foreground">
            No available paintings match that combination
          </h2>
          <p className="mx-auto max-w-md text-sm text-muted">
            Clear one of the active medium, scale, or subject filters to view the rest of the
            Harbour Road collection.
          </p>
          <div>
            <Button tone="primary" onClick={resetFilters}>
              Show all {availableWorks.length} available works
            </Button>
          </div>
        </Surface>
      ) : (
        <div className="grid grid-cols-1 items-start gap-8 md:grid-cols-2 lg:grid-cols-3">
          {filteredWorks.map((work) => (
            <motion.article
              key={work.id}
              layout
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="group min-w-0"
            >
              <Surface className="flex flex-col justify-between p-4 sm:p-5">
                <div className="space-y-4">
                  <button
                    type="button"
                    onClick={() => onQuickView(work, filteredWorks)}
                    aria-label={`Inspect ${work.title} in full-screen viewer`}
                    className="block w-full overflow-hidden border border-border/70 bg-background p-2 text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
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

                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                      <h2 className="font-display text-2xl font-medium text-foreground">
                        {work.title}
                      </h2>
                      {work.priceCentsZar !== null ? (
                        <span className="text-base font-medium text-foreground tabular-nums">
                          {formatZarMinorUnits(work.priceCentsZar)}
                        </span>
                      ) : null}
                    </div>

                    <p className="text-sm text-muted tabular-nums">
                      {work.medium} · {formatDimensions(work.widthCm, work.heightCm, unit)} ·{' '}
                      <span className="text-accent">Available</span>
                    </p>

                    <p className="pt-1 text-sm leading-relaxed text-muted">{work.story}</p>
                  </div>
                </div>

                <div className="mt-5 flex flex-wrap items-center gap-2.5 border-t border-border pt-4">
                  <Button
                    tone="quiet"
                    className="flex-1"
                    onClick={() => onQuickView(work, filteredWorks)}
                  >
                    <Eye className="size-4" />
                    <span>Quick view</span>
                  </Button>
                  <Button
                    tone="primary"
                    className="flex-1"
                    onClick={() => onInquire(work)}
                  >
                    Inquire
                  </Button>
                </div>
              </Surface>
            </motion.article>
          ))}
        </div>
      )}
    </div>
  );
}
