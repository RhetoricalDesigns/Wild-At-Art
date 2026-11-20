import { useMemo, useState } from 'react';
import { Eye } from 'lucide-react';
import type { Artwork, ArtworkTheme } from '../data/catalog';
import { formatDimensions, type DimensionUnit } from '../utils/galleryMath';
import { ArtworkImage, Button, FilterChip, Surface } from '../components/ui';

interface SoldArchivePageProps {
  soldWorks: readonly Artwork[];
  unit: DimensionUnit;
  onQuickView: (artwork: Artwork, pool: readonly Artwork[]) => void;
  onCommissionSimilar: (artwork: Artwork) => void;
}

const ARCHIVE_THEMES: readonly ('All' | ArtworkTheme)[] = [
  'All',
  'Elephants & herds',
  'Big cats',
  'Nocturnal',
  'Coastal & birdlife',
];

export function SoldArchivePage({
  soldWorks,
  unit,
  onQuickView,
  onCommissionSimilar,
}: SoldArchivePageProps) {
  const [selectedTheme, setSelectedTheme] = useState<'All' | ArtworkTheme>('All');

  const filteredArchive = useMemo(() => {
    if (selectedTheme === 'All') return soldWorks;
    return soldWorks.filter((w) => w.theme === selectedTheme);
  }, [soldWorks, selectedTheme]);

  return (
    <div className="mx-auto max-w-[90rem] space-y-12 px-4 py-10 sm:px-8 sm:py-16">
      {/* Archival Header */}
      <div className="flex flex-wrap items-end justify-between gap-6 border-b border-border pb-8">
        <div className="min-w-0 space-y-2.5">
          <p className="text-xs font-medium uppercase tracking-[0.14em] text-accent">
            Career Archive · Private & Public Holdings
          </p>
          <h1 className="font-display text-display text-foreground">Sold paintings</h1>
          <p className="max-w-[62ch] text-base leading-relaxed text-muted">
            Completed original canvases now held in private collections. Contact Steve Jones to
            discuss commissioning an original oil work inspired by previous series.
          </p>
        </div>

        <div
          className="flex flex-wrap items-center gap-2"
          role="group"
          aria-label="Filter sold archive by subject"
        >
          {ARCHIVE_THEMES.map((theme) => (
            <FilterChip
              key={theme}
              active={selectedTheme === theme}
              onClick={() => setSelectedTheme(theme)}
            >
              {theme === 'All' ? 'All archived' : theme}
            </FilterChip>
          ))}
        </div>
      </div>

      {/* Archival Photo Grid */}
      {filteredArchive.length === 0 ? (
        <Surface className="p-12 text-center space-y-4">
          <h2 className="font-display text-2xl text-foreground">
            All current artist works are available in the gallery collection
          </h2>
          <p className="mx-auto max-w-md text-sm text-muted">
            The newly uploaded artist collection features 12 original available oil paintings. Explore
            them in the main collection or contact the studio regarding custom commissions.
          </p>
        </Surface>
      ) : (
        <div className="grid grid-cols-1 items-start gap-8 md:grid-cols-2 lg:grid-cols-3">
          {filteredArchive.map((work) => (
            <article key={work.id} className="group min-w-0">
              <Surface className="space-y-4 p-4 sm:p-5">
                <button
                  type="button"
                  onClick={() => onQuickView(work, filteredArchive)}
                  aria-label={`Open archived work ${work.title} in full-screen viewer`}
                  className="block w-full overflow-hidden border border-border/70 bg-background p-2 text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                >
                  <div className="overflow-hidden">
                    <ArtworkImage
                      src={work.image}
                      alt={`${work.title} (${work.year}) — Archived oil painting by Steve Jones`}
                      title={work.title}
                      width={work.imageWidth}
                      height={work.imageHeight}
                      archivalMuted
                      zoomOnHover
                    />
                  </div>
                </button>

                <div className="space-y-1.5">
                  <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-muted tabular-nums">
                    Sold · {work.year}
                    {work.provenanceNote ? ` · ${work.provenanceNote}` : ''}
                  </p>

                  <h2 className="font-display text-2xl font-medium text-foreground">{work.title}</h2>

                  <p className="text-sm text-muted tabular-nums">
                    {work.medium} · {formatDimensions(work.widthCm, work.heightCm, unit)}
                  </p>

                  <p className="pt-1 text-sm leading-relaxed text-muted">{work.story}</p>
                </div>

                <div className="flex flex-wrap items-center gap-2.5 border-t border-border pt-4">
                  <Button
                    tone="quiet"
                    className="flex-1"
                    onClick={() => onQuickView(work, filteredArchive)}
                  >
                    <Eye className="size-4" />
                    <span>Inspect plate</span>
                  </Button>
                  <Button
                    tone="primary"
                    className="flex-1"
                    onClick={() => onCommissionSimilar(work)}
                  >
                    Commission related
                  </Button>
                </div>
              </Surface>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
