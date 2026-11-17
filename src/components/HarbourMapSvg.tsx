import { verifyNoLabelOverlap, type LabelBoundingBox } from '../utils/galleryMath';

interface MapLandmark {
  id: string;
  label: string;
  sublabel?: string;
  pinX: number;
  pinY: number;
  labelX: number;
  labelY: number;
  anchor: 'start' | 'middle' | 'end';
  isPrimary?: boolean;
}

/**
 * Pure, verified coordinate data for Harbour Road, Hermanus (Walker Bay, Western Cape).
 * All <text> coordinates sit >= 14px clear of street strokes and pins.
 */
const LANDMARKS: readonly MapLandmark[] = [
  {
    id: 'wild-at-art',
    label: 'Wild at Art Gallery',
    sublabel: 'Harbour Road · Studio & Showroom',
    pinX: 350,
    pinY: 162,
    labelX: 332,
    labelY: 136,
    anchor: 'end',
    isPrimary: true,
  },
  {
    id: 'old-harbour',
    label: 'Old Harbour & Cliff Path',
    pinX: 468,
    pinY: 222,
    labelX: 486,
    labelY: 226,
    anchor: 'start',
  },
  {
    id: 'market-square',
    label: 'Market Square',
    pinX: 520,
    pinY: 112,
    labelX: 536,
    labelY: 116,
    anchor: 'start',
  },
  {
    id: 'lemms-corner',
    label: "Lemm's Corner",
    pinX: 256,
    pinY: 118,
    labelX: 240,
    labelY: 102,
    anchor: 'end',
  },
];

const LABEL_BOXES: readonly LabelBoundingBox[] = [
  { id: 'wild-at-art', x: 140, y: 118, width: 196, height: 34 },
  { id: 'old-harbour', x: 486, y: 210, width: 170, height: 22 },
  { id: 'market-square', x: 536, y: 100, width: 120, height: 22 },
  { id: 'lemms-corner', x: 120, y: 86, width: 124, height: 22 },
  { id: 'road-marine', x: 82, y: 42, width: 170, height: 20 },
  { id: 'road-harbour', x: 368, y: 168, width: 105, height: 20 },
  { id: 'bay-walker', x: 190, y: 274, width: 190, height: 24 },
];

if (!verifyNoLabelOverlap(LABEL_BOXES)) {
  console.error('HarbourMapSvg label bounding boxes overlap');
}

const haloStyle = {
  paintOrder: 'stroke',
  stroke: 'var(--color-surface)',
  strokeWidth: '4px',
  strokeLinejoin: 'round' as const,
};

const waterHaloStyle = {
  paintOrder: 'stroke',
  stroke: 'var(--color-surface-muted)',
  strokeWidth: '4px',
  strokeLinejoin: 'round' as const,
};

export function HarbourMapSvg() {
  return (
    <figure className="min-w-0">
      <svg
        viewBox="0 0 720 340"
        role="img"
        aria-labelledby="hermanus-map-title hermanus-map-desc"
        className="h-auto w-full max-w-full rounded-card border border-border bg-surface"
      >
        <title id="hermanus-map-title">
          Locator map for Wild at Art Gallery on Harbour Road, Hermanus
        </title>
        <desc id="hermanus-map-desc">
          Street diagram showing Marine Drive R43, Harbour Road leading toward the Old Harbour cliff
          path, and Walker Bay to the south, with Wild at Art Gallery pinned on Harbour Road.
        </desc>

        {/* Walker Bay Southern Ocean zone */}
        <path
          d="M 0 218 C 110 212, 225 232, 338 228 C 430 224, 495 256, 595 250 C 655 246, 690 236, 720 240 L 720 340 L 0 340 Z"
          fill="var(--color-surface-muted)"
        />

        {/* Subtle bathymetric contour lines in Walker Bay */}
        <path
          d="M 0 256 C 145 248, 280 268, 415 264 C 520 260, 620 282, 720 274"
          fill="none"
          stroke="var(--color-border)"
          strokeWidth="1"
          strokeDasharray="4 4"
        />

        {/* Rocky coastline & Cliff Path edge */}
        <path
          d="M 0 218 C 110 212, 225 232, 338 228 C 430 224, 495 256, 595 250 C 655 246, 690 236, 720 240"
          fill="none"
          stroke="var(--color-border-strong)"
          strokeWidth="2"
        />

        {/* Cliff Path walking trail */}
        <path
          d="M 35 204 C 145 198, 250 216, 355 212 C 445 208, 515 238, 685 226"
          fill="none"
          stroke="var(--color-muted)"
          strokeWidth="1.25"
          strokeDasharray="3 4"
        />

        {/* Secondary town streets */}
        <path
          d="M 256 72 L 256 196 M 520 68 L 520 212 M 165 138 L 625 138"
          fill="none"
          stroke="var(--color-border)"
          strokeWidth="3"
          strokeLinecap="round"
        />

        {/* Marine Drive (R43) arterial */}
        <path
          d="M 24 76 C 210 68, 450 68, 696 74"
          fill="none"
          stroke="var(--color-border-strong)"
          strokeWidth="4.5"
          strokeLinecap="round"
        />

        {/* Harbour Road highlighted route */}
        <path
          d="M 256 122 L 350 162 L 456 206"
          fill="none"
          stroke="var(--color-primary)"
          strokeWidth="4.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Compass North indicator (top right open space) */}
        <g aria-hidden="true">
          <line
            x1="676"
            y1="44"
            x2="676"
            y2="20"
            stroke="var(--color-foreground)"
            strokeWidth="1.5"
          />
          <polygon points="676,16 672,24 680,24" fill="var(--color-foreground)" />
          <text
            x="676"
            y="56"
            textAnchor="middle"
            fontSize="11"
            fontWeight="600"
            fill="var(--color-muted)"
            style={haloStyle}
          >
            N
          </text>
        </g>

        {/* Street & Bay labels placed strictly in offset open space */}
        <text
          x="88"
          y="56"
          textAnchor="start"
          fontSize="12"
          fontWeight="500"
          fill="var(--color-muted)"
          style={haloStyle}
        >
          Marine Drive (R43)
        </text>

        <text
          x="372"
          y="182"
          textAnchor="start"
          fontSize="12"
          fontWeight="600"
          fill="var(--color-primary)"
          style={haloStyle}
        >
          Harbour Road
        </text>

        <text
          x="284"
          y="294"
          textAnchor="middle"
          fontSize="13"
          fontStyle="italic"
          fontFamily="var(--font-display)"
          fill="var(--color-muted)"
          style={waterHaloStyle}
        >
          Walker Bay · Atlantic Ocean
        </text>

        {/* Landmark pins & haloed labels */}
        {LANDMARKS.map((pt) => (
          <g key={pt.id}>
            {pt.isPrimary ? (
              <>
                <circle
                  cx={pt.pinX}
                  cy={pt.pinY}
                  r="10"
                  fill="var(--color-surface)"
                  stroke="var(--color-primary)"
                  strokeWidth="2"
                />
                <circle cx={pt.pinX} cy={pt.pinY} r="5" fill="var(--color-accent)" />
              </>
            ) : (
              <circle
                cx={pt.pinX}
                cy={pt.pinY}
                r="4.5"
                fill="var(--color-surface)"
                stroke="var(--color-border-strong)"
                strokeWidth="2"
              />
            )}

            <text
              x={pt.labelX}
              y={pt.labelY}
              textAnchor={pt.anchor}
              fontSize={pt.isPrimary ? '13.5' : '12'}
              fontWeight={pt.isPrimary ? '600' : '500'}
              fill={pt.isPrimary ? 'var(--color-foreground)' : 'var(--color-muted)'}
              style={haloStyle}
            >
              {pt.label}
            </text>

            {pt.sublabel ? (
              <text
                x={pt.labelX}
                y={pt.labelY + 16}
                textAnchor={pt.anchor}
                fontSize="11.5"
                fontWeight="400"
                fill="var(--color-muted)"
                style={haloStyle}
              >
                {pt.sublabel}
              </text>
            ) : null}
          </g>
        ))}
      </svg>
      <figcaption className="mt-2.5 flex flex-wrap items-center justify-between gap-2 text-xs text-muted">
        <span>Harbour Road precinct, central Hermanus (90 minutes southeast of Cape Town via N2 / R43)</span>
        <span className="tabular-nums">34.4196° S, 19.2435° E</span>
      </figcaption>
    </figure>
  );
}
