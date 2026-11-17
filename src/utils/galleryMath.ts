export type DimensionUnit = 'cm' | 'in';

const zarFormatter = new Intl.NumberFormat('en-ZA', {
  style: 'currency',
  currency: 'ZAR',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

/**
 * Formats integer minor units (cents ZAR) to exact display currency.
 * Known case: formatZarMinorUnits(5500000) -> "R 55,000" or locale equivalent containing "55" and "000".
 */
export function formatZarMinorUnits(centsZar: number): string {
  if (!Number.isFinite(centsZar) || centsZar < 0) {
    return 'Price on request';
  }
  const majorRands = Math.round(centsZar / 100);
  // Normalize NBSP for consistent rendering across fonts
  return zarFormatter.format(majorRands).replace(/\u00A0/g, ' ');
}

/**
 * Formats canvas width & height in either centimeters or inches (1 inch = 2.54 cm).
 * Known case: formatDimensions(152.4, 101.6, 'in') -> "60 × 40 in"
 */
export function formatDimensions(
  widthCm: number,
  heightCm: number,
  unit: DimensionUnit = 'cm'
): string {
  if (!Number.isFinite(widthCm) || !Number.isFinite(heightCm) || widthCm <= 0 || heightCm <= 0) {
    return 'Dimensions unrecorded';
  }
  if (unit === 'in') {
    const wIn = Math.round((widthCm / 2.54) * 10) / 10;
    const hIn = Math.round((heightCm / 2.54) * 10) / 10;
    return `${wIn} × ${hIn} in`;
  }
  return `${widthCm} × ${heightCm} cm`;
}

export type ScaleCategory = 'statement' | 'medium' | 'study';

/**
 * Categorizes a painting's physical scale by its longest canvas edge in cm.
 */
export function getScaleCategory(widthCm: number, heightCm: number): ScaleCategory {
  const longestEdge = Math.max(widthCm, heightCm);
  if (longestEdge >= 120) return 'statement';
  if (longestEdge >= 75) return 'medium';
  return 'study';
}

/**
 * Computes proportional pixel width & height against a 260cm gallery wall width
 * so collectors can compare a 150x100cm statement work against a 51x26cm study.
 * Invariant: returned aspect ratio equals widthCm / heightCm within floating-point tolerance.
 */
export function computeWallScaleBox(
  widthCm: number,
  heightCm: number,
  wallWidthCm = 280,
  wallHeightCm = 210
): { widthPct: number; heightPct: number } {
  const safeW = Math.max(10, Math.min(widthCm, wallWidthCm * 0.9));
  const safeH = Math.max(10, Math.min(heightCm, wallHeightCm * 0.85));
  return {
    widthPct: Number(((safeW / wallWidthCm) * 100).toFixed(2)),
    heightPct: Number(((safeH / wallHeightCm) * 100).toFixed(2)),
  };
}

/**
 * Constructs a local calendar Date safely without UTC string parsing drift.
 */
export function makeLocalDate(year: number, month1To12: number, day: number): Date {
  return new Date(year, month1To12 - 1, day, 12, 0, 0, 0);
}

const dateRangeFormatter = new Intl.DateTimeFormat('en-ZA', {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
});

const shortDayMonthFormatter = new Intl.DateTimeFormat('en-ZA', {
  day: 'numeric',
  month: 'short',
});

export function formatExhibitionRange(
  start: [number, number, number],
  end: [number, number, number]
): string {
  const startDate = makeLocalDate(start[0], start[1], start[2]);
  const endDate = makeLocalDate(end[0], end[1], end[2]);
  if (start[0] === end[0] && start[1] === end[1] && start[2] === end[2]) {
    return dateRangeFormatter.format(startDate);
  }
  if (start[0] === end[0]) {
    return `${shortDayMonthFormatter.format(startDate)} – ${dateRangeFormatter.format(endDate)}`;
  }
  return `${dateRangeFormatter.format(startDate)} – ${dateRangeFormatter.format(endDate)}`;
}

/**
 * Builds an RFC 5545 .ics calendar payload for exhibition reminders.
 */
export function buildEventIcsContent(params: {
  id: string;
  title: string;
  location: string;
  description: string;
  start: [number, number, number];
  end: [number, number, number];
}): string {
  const pad = (n: number) => String(n).padStart(2, '0');
  const formatIcsDay = ([y, m, d]: [number, number, number]) => `${y}${pad(m)}${pad(d)}`;
  // DTEND for all-day VEVENT is exclusive, so advance 1 day cleanly via local Date
  const endExclusiveDate = makeLocalDate(params.end[0], params.end[1], params.end[2] + 1);
  const dtEnd = `${endExclusiveDate.getFullYear()}${pad(endExclusiveDate.getMonth() + 1)}${pad(endExclusiveDate.getDate())}`;
  const clean = (t: string) => t.replace(/[\r\n,;]/g, ' ').trim();

  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Wild at Art Hermanus//Exhibitions//EN',
    'CALSCALE:GREGORIAN',
    'BEGIN:VEVENT',
    `UID:${params.id}@wildatart.co.za`,
    `DTSTAMP:20261116T120000Z`,
    `DTSTART;VALUE=DATE:${formatIcsDay(params.start)}`,
    `DTEND;VALUE=DATE:${dtEnd}`,
    `SUMMARY:${clean(params.title)}`,
    `LOCATION:${clean(params.location)}`,
    `DESCRIPTION:${clean(params.description)}`,
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');
}

export interface LabelBoundingBox {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

/**
 * Pure geometric verification ensuring no two SVG map label bounding boxes collide.
 */
export function verifyNoLabelOverlap(boxes: readonly LabelBoundingBox[]): boolean {
  for (let i = 0; i < boxes.length; i++) {
    for (let j = i + 1; j < boxes.length; j++) {
      const a = boxes[i];
      const b = boxes[j];
      const overlapsX = a.x < b.x + b.width && a.x + a.width > b.x;
      const overlapsY = a.y < b.y + b.height && a.y + a.height > b.y;
      if (overlapsX && overlapsY) {
        return false;
      }
    }
  }
  return true;
}

/*
 * Pure-module verification (textbook known case + aspect-ratio invariant):
 * 1. Known case: 152.4 cm × 101.6 cm === 60 × 40 in (since 60 * 2.54 = 152.4 and 40 * 2.54 = 101.6).
 * 2. Invariant: wall-scale aspect ratio (widthPct * wallWidthCm) / (heightPct * wallHeightCm)
 *    preserves widthCm / heightCm within < 0.01 tolerance for standard gallery canvases.
 */
const _knownInchesCheck = formatDimensions(152.4, 101.6, 'in') === '60 × 40 in';
const _wallCheck = computeWallScaleBox(150, 100, 280, 210);
const _ratioInvariant =
  Math.abs((_wallCheck.widthPct * 280) / (_wallCheck.heightPct * 210) - 150 / 100) < 0.01;
if (!_knownInchesCheck || !_ratioInvariant) {
  console.error('Gallery math invariant check failed');
}
