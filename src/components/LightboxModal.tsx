import { useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, Maximize2, Ruler, X } from 'lucide-react';
import type { Artwork } from '../data/catalog';
import {
  computeWallScaleBox,
  formatDimensions,
  formatZarMinorUnits,
  type DimensionUnit,
} from '../utils/galleryMath';
import { Button, CanvasProportionPlate } from './ui';

interface LightboxModalProps {
  works: readonly Artwork[];
  activeIndex: number | null;
  unit: DimensionUnit;
  onClose: () => void;
  onChangeIndex: (nextIndex: number) => void;
  onInquire: (artwork: Artwork) => void;
}

export function LightboxModal({
  works,
  activeIndex,
  unit,
  onClose,
  onChangeIndex,
  onInquire,
}: LightboxModalProps) {
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const pointerStartX = useRef<number | null>(null);
  const [roomScaleMode, setRoomScaleMode] = useState(false);

  const isOpen = activeIndex !== null && activeIndex >= 0 && activeIndex < works.length;
  const artwork = isOpen ? works[activeIndex] : null;

  useEffect(() => {
    if (!isOpen) return;
    previousFocusRef.current = document.activeElement as HTMLElement | null;
    const focusTimer = window.setTimeout(() => {
      closeButtonRef.current?.focus();
    }, 10);

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      window.clearTimeout(focusTimer);
      document.body.style.overflow = prevOverflow;
      previousFocusRef.current?.focus?.();
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen || activeIndex === null) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onClose();
      } else if (event.key === 'ArrowLeft' && works.length > 1) {
        event.preventDefault();
        onChangeIndex((activeIndex - 1 + works.length) % works.length);
      } else if (event.key === 'ArrowRight' && works.length > 1) {
        event.preventDefault();
        onChangeIndex((activeIndex + 1) % works.length);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, activeIndex, works.length, onClose, onChangeIndex]);

  if (!isOpen || !artwork || activeIndex === null) {
    return null;
  }

  const goPrev = () => onChangeIndex((activeIndex - 1 + works.length) % works.length);
  const goNext = () => onChangeIndex((activeIndex + 1) % works.length);

  const wallBox = computeWallScaleBox(artwork.widthCm, artwork.heightCm, 280, 210);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="lightbox-artwork-title"
      className="fixed inset-0 z-50 flex flex-col justify-between bg-viewer text-viewer-foreground"
      onPointerDown={(e) => {
        pointerStartX.current = e.clientX;
      }}
      onPointerUp={(e) => {
        if (pointerStartX.current === null || works.length <= 1) return;
        const deltaX = e.clientX - pointerStartX.current;
        pointerStartX.current = null;
        if (Math.abs(deltaX) > 56) {
          if (deltaX < 0) goNext();
          else goPrev();
        }
      }}
    >
      {/* Top viewer bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-viewer-muted/20 px-4 py-3 sm:px-8">
        <div className="flex min-w-0 items-center gap-3 text-xs text-viewer-muted">
          <span className="tabular-nums">
            {activeIndex + 1} / {works.length}
          </span>
          <span aria-hidden="true">·</span>
          <span>Steve Jones · Wild at Art</span>
          <span className="hidden sm:inline" aria-hidden="true">
            ·
          </span>
          <span className="hidden uppercase tracking-[0.06em] sm:inline">[ESC] close · [←] [→] browse</span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            tone="viewer"
            onClick={() => setRoomScaleMode((prev) => !prev)}
            aria-pressed={roomScaleMode}
          >
            {roomScaleMode ? <Maximize2 className="size-4" /> : <Ruler className="size-4" />}
            <span>{roomScaleMode ? 'Full canvas view' : 'Wall scale (2.8 m)'}</span>
          </Button>

          <Button
            ref={closeButtonRef}
            tone="viewer"
            onClick={onClose}
            aria-label="Close artwork viewer"
          >
            <X className="size-4" />
            <span>Close</span>
          </Button>
        </div>
      </div>

      {/* Main uncropped canvas stage */}
      <div className="relative flex min-h-0 flex-1 items-center justify-center px-4 py-4 sm:px-16 sm:py-6">
        {works.length > 1 ? (
          <button
            type="button"
            onClick={goPrev}
            aria-label="Previous painting"
            className="absolute left-3 z-10 hidden min-h-11 min-w-11 items-center justify-center rounded-control border border-viewer-muted/35 bg-viewer-surface text-viewer-foreground transition-colors duration-150 ease-out hover:border-viewer-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-viewer-foreground sm:inline-flex"
          >
            <ChevronLeft className="size-5" />
          </button>
        ) : null}

        {roomScaleMode ? (
          /* Calibrated 280 cm x 210 cm gallery wall scale benchmark */
          <div
            aria-label={`Wall scale diagram showing ${artwork.title} (${artwork.widthCm} by ${artwork.heightCm} cm) hung along a 280 cm gallery wall`}
            style={{ aspectRatio: '280 / 210' }}
            className="relative flex max-h-[62dvh] w-full max-w-3xl items-center justify-center border border-viewer-muted/30 bg-surface text-foreground"
          >
            {/* 155 cm gallery eye-level datum */}
            <div
              style={{ bottom: '62%' }}
              className="pointer-events-none absolute inset-x-0 border-t border-dashed border-border-strong/60"
            >
              <span className="ml-3 inline-block -translate-y-2.5 bg-surface px-1.5 text-[11px] text-muted tabular-nums">
                155 cm gallery eye line
              </span>
            </div>

            {/* Proportional artwork frame */}
            <div
              style={{
                width: `${wallBox.widthPct}%`,
                height: `${wallBox.heightPct}%`,
              }}
              className="relative z-10 overflow-hidden border border-border-strong bg-surface-muted shadow-float"
            >
              {artwork.image ? (
                <img
                  src={artwork.image}
                  alt={artwork.title}
                  referrerPolicy="no-referrer"
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full flex-col justify-between p-3 text-xs text-foreground">
                  <span className="font-display text-sm">{artwork.title}</span>
                  <span className="text-[11px] text-muted tabular-nums">
                    {formatDimensions(artwork.widthCm, artwork.heightCm, unit)}
                  </span>
                </div>
              )}
            </div>

            {/* Console bench benchmark (140 cm wide x 52 cm tall) */}
            <div
              style={{ width: '50%', height: '22%' }}
              className="pointer-events-none absolute bottom-0 border-x border-t border-border-strong/60 bg-surface-muted/80"
            >
              <span className="block pt-1.5 text-center text-[11px] text-muted tabular-nums">
                140 cm gallery bench reference
              </span>
            </div>
          </div>
        ) : artwork.image ? (
          <img
            src={artwork.image}
            alt={`${artwork.title} — ${artwork.medium}, ${formatDimensions(artwork.widthCm, artwork.heightCm, 'cm')} by Steve Jones`}
            width={artwork.imageWidth ?? 1200}
            height={artwork.imageHeight ?? 900}
            referrerPolicy="no-referrer"
            className="max-h-[66dvh] w-auto max-w-full object-contain shadow-float"
          />
        ) : (
          <CanvasProportionPlate
            title={artwork.title}
            medium={artwork.medium}
            widthCm={artwork.widthCm}
            heightCm={artwork.heightCm}
            unit={unit}
            dark
          />
        )}

        {works.length > 1 ? (
          <button
            type="button"
            onClick={goNext}
            aria-label="Next painting"
            className="absolute right-3 z-10 hidden min-h-11 min-w-11 items-center justify-center rounded-control border border-viewer-muted/35 bg-viewer-surface text-viewer-foreground transition-colors duration-150 ease-out hover:border-viewer-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-viewer-foreground sm:inline-flex"
          >
            <ChevronRight className="size-5" />
          </button>
        ) : null}
      </div>

      {/* Bottom quiet archival caption & inquiry bar */}
      <div className="border-t border-viewer-muted/20 bg-viewer-surface px-4 py-4 sm:px-8">
        <div className="mx-auto flex max-w-[90rem] flex-col justify-between gap-4 lg:flex-row lg:items-center">
          <div className="min-w-0 space-y-1">
            <div className="flex flex-wrap items-baseline gap-x-2.5 gap-y-1">
              <h2 id="lightbox-artwork-title" className="font-display text-xl text-viewer-foreground sm:text-2xl">
                {artwork.title}
              </h2>
              <span className="text-sm text-viewer-muted tabular-nums">
                {artwork.year} · {artwork.medium} · {formatDimensions(artwork.widthCm, artwork.heightCm, unit)}
              </span>
            </div>
            <p className="max-w-3xl text-sm text-viewer-muted">{artwork.story}</p>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 sm:justify-end">
            {/* Mobile prev/next controls */}
            {works.length > 1 ? (
              <div className="flex items-center gap-2 sm:hidden">
                <Button tone="viewer" onClick={goPrev} aria-label="Previous painting">
                  <ChevronLeft className="size-4" />
                  <span>Prev</span>
                </Button>
                <Button tone="viewer" onClick={goNext} aria-label="Next painting">
                  <span>Next</span>
                  <ChevronRight className="size-4" />
                </Button>
              </div>
            ) : null}

            <div className="text-right text-sm tabular-nums">
              {artwork.status === 'available' && artwork.priceCentsZar !== null ? (
                <span className="font-medium text-viewer-foreground">
                  {formatZarMinorUnits(artwork.priceCentsZar)} · Available
                </span>
              ) : (
                <span className="text-viewer-muted">
                  Sold{artwork.provenanceNote ? ` · ${artwork.provenanceNote}` : ''}
                </span>
              )}
            </div>

            <Button
              tone="accent"
              onClick={() => onInquire(artwork)}
            >
              {artwork.status === 'available'
                ? 'Inquire about this work'
                : 'Commission a related work'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
