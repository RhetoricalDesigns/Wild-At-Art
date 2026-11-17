import { useState, type ComponentProps, type ReactNode } from 'react';
import { formatDimensions, type DimensionUnit } from '../utils/galleryMath';

/**
 * Surface primitive.
 * Clean rectilinear museum card or recessed gallery stage.
 */
export const Surface = ({
  inset = false,
  className = '',
  ...props
}: ComponentProps<'div'> & { inset?: boolean }) => (
  <div
    className={`min-w-0 [:where(&)]:rounded-card [:where(&)]:text-foreground ${
      inset
        ? '[:where(&)]:bg-surface-muted [:where(&)]:border [:where(&)]:border-border'
        : '[:where(&)]:bg-surface [:where(&)]:border [:where(&)]:border-border [:where(&)]:shadow-surface'
    } ${className}`}
    {...props}
  />
);

const buttonTones = {
  primary:
    '[:where(&)]:bg-primary [:where(&)]:text-primary-foreground [:where(&)]:border [:where(&)]:border-primary hover:[:where(&)]:bg-accent hover:[:where(&)]:border-accent',
  accent:
    '[:where(&)]:bg-accent [:where(&)]:text-primary-foreground [:where(&)]:border [:where(&)]:border-accent hover:opacity-90',
  quiet:
    '[:where(&)]:border [:where(&)]:border-border-strong [:where(&)]:bg-surface [:where(&)]:text-foreground hover:[:where(&)]:border-foreground hover:[:where(&)]:bg-surface-muted',
  ghost:
    '[:where(&)]:bg-transparent [:where(&)]:text-foreground hover:[:where(&)]:bg-surface-muted',
  viewer:
    '[:where(&)]:border [:where(&)]:border-viewer-muted/40 [:where(&)]:bg-viewer-surface [:where(&)]:text-viewer-foreground hover:[:where(&)]:border-viewer-foreground',
};

export const Button = ({
  tone = 'primary',
  type = 'button',
  className = '',
  ...props
}: ComponentProps<'button'> & { tone?: keyof typeof buttonTones }) => (
  <button
    type={type}
    className={`[:where(&)]:inline-flex [:where(&)]:min-h-11 [:where(&)]:items-center [:where(&)]:justify-center [:where(&)]:gap-2 whitespace-nowrap shrink-0 [:where(&)]:rounded-control [:where(&)]:px-4 sm:[:where(&)]:px-5 [:where(&)]:text-xs [:where(&)]:font-medium [:where(&)]:tracking-[0.09em] [:where(&)]:uppercase transition-colors duration-150 ease-out active:translate-y-px focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:pointer-events-none disabled:opacity-50 ${buttonTones[tone]} ${className}`}
    {...props}
  />
);

export const FilterChip = ({
  active,
  className = '',
  children,
  ...props
}: ComponentProps<'button'> & { active: boolean }) => (
  <button
    type="button"
    aria-pressed={active}
    className={`inline-flex min-h-10 shrink-0 items-center justify-center gap-1.5 whitespace-nowrap rounded-control px-3.5 text-xs font-medium tracking-[0.06em] transition-colors duration-150 ease-out focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${
      active
        ? 'border border-primary bg-primary text-primary-foreground'
        : 'border border-border bg-surface text-foreground hover:border-border-strong'
    } ${className}`}
    {...props}
  >
    {children}
  </button>
);

export const Field = ({
  label,
  htmlFor,
  hint,
  error,
  children,
}: {
  label: string;
  htmlFor: string;
  hint?: string;
  error?: string;
  children: ReactNode;
}) => (
  <div className="flex min-w-0 flex-col gap-1.5">
    <div className="flex flex-wrap items-baseline justify-between gap-2">
      <label htmlFor={htmlFor} className="text-sm font-medium text-foreground">
        {label}
      </label>
      {hint ? <span className="text-xs text-muted">{hint}</span> : null}
    </div>
    {children}
    {error ? (
      <p role="alert" className="text-xs font-medium text-danger">
        {error}
      </p>
    ) : null}
  </div>
);

export const inputClassName =
  'min-h-11 w-full min-w-0 rounded-control border border-border-strong bg-surface px-3.5 py-2.5 text-base text-foreground placeholder:text-muted/80 transition-colors duration-150 ease-out focus:border-primary focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-primary';

/**
 * Resilient artwork image with natural width/height, lazy-loading control, and
 * a styled museum mat fallback so a broken frame can never appear.
 */
export function ArtworkImage({
  src,
  alt,
  title,
  width = 1200,
  height = 900,
  eager = false,
  zoomOnHover = false,
  archivalMuted = false,
  className = '',
}: {
  src?: string;
  alt: string;
  title: string;
  width?: number;
  height?: number;
  eager?: boolean;
  zoomOnHover?: boolean;
  archivalMuted?: boolean;
  className?: string;
}) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return (
      <div
        role="img"
        aria-label={alt}
        style={{ aspectRatio: `${width} / ${height}` }}
        className={`flex w-full flex-col justify-between border border-border bg-surface-muted p-6 text-foreground ${className}`}
      >
        <span className="text-xs uppercase tracking-[0.12em] text-muted">
          Wild at Art · Studio Plate
        </span>
        <p className="font-display text-lg text-foreground">{title}</p>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      width={width}
      height={height}
      loading={eager ? 'eager' : 'lazy'}
      decoding={eager ? 'sync' : 'async'}
      referrerPolicy="no-referrer"
      onError={() => setFailed(true)}
      className={`block h-auto w-full object-cover ${
        zoomOnHover ? 'transition-transform duration-500 ease-out group-hover:scale-[1.03]' : ''
      } ${archivalMuted ? 'saturate-[0.86]' : ''} ${className}`}
    />
  );
}

/**
 * Proportional canvas plate rendered in clean HTML for catalog records without a plate photo.
 */
export function CanvasProportionPlate({
  title,
  medium,
  widthCm,
  heightCm,
  unit = 'cm',
  dark = false,
}: {
  title: string;
  medium: string;
  widthCm: number;
  heightCm: number;
  unit?: DimensionUnit;
  dark?: boolean;
}) {
  return (
    <div
      style={{ aspectRatio: `${widthCm} / ${heightCm}` }}
      className={`mx-auto flex max-h-[68dvh] w-full max-w-2xl flex-col justify-between border p-8 sm:p-10 ${
        dark
          ? 'border-viewer-muted/35 bg-viewer-surface text-viewer-foreground'
          : 'border-border-strong/50 bg-surface-muted text-foreground'
      }`}
    >
      <div className="flex items-center justify-between gap-4 text-xs opacity-80">
        <span>Studio catalogue record · Proportional canvas diagram</span>
        <span className="tabular-nums">{formatDimensions(widthCm, heightCm, unit)}</span>
      </div>
      <div className="my-auto py-6">
        <p className="font-display text-2xl sm:text-3xl">{title}</p>
        <p className="mt-2 text-sm opacity-80">
          {medium} · Stretched to {formatDimensions(widthCm, heightCm, 'cm')} (
          {formatDimensions(widthCm, heightCm, 'in')})
        </p>
      </div>
      <div className="flex items-center justify-between gap-4 border-t border-current/15 pt-4 text-xs opacity-75">
        <span>Wild at Art Gallery, Hermanus</span>
        <span>Photography plate available on studio request</span>
      </div>
    </div>
  );
}
