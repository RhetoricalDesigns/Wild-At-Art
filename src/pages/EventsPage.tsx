import { useMemo, useState } from 'react';
import { Calendar, MapPin } from 'lucide-react';
import type { ExhibitionEvent } from '../data/catalog';
import {
  buildEventIcsContent,
  formatExhibitionRange,
  makeLocalDate,
} from '../utils/galleryMath';
import { HarbourMapSvg } from '../components/HarbourMapSvg';
import { Button, FilterChip, Surface } from '../components/ui';

interface EventsPageProps {
  exhibitions: readonly ExhibitionEvent[];
  onInquireEvent: (event: ExhibitionEvent) => void;
}

type EventSegment = 'upcoming' | 'past' | 'all';

const MONTH_SHORT = [
  'JAN',
  'FEB',
  'MAR',
  'APR',
  'MAY',
  'JUN',
  'JUL',
  'AUG',
  'SEP',
  'OCT',
  'NOV',
  'DEC',
];

export function EventsPage({ exhibitions, onInquireEvent }: EventsPageProps) {
  const [segment, setSegment] = useState<EventSegment>('upcoming');
  const [calendarNotice, setCalendarNotice] = useState<string | null>(null);

  const referenceToday = useMemo(() => {
    const now = new Date();
    return makeLocalDate(now.getFullYear(), now.getMonth() + 1, now.getDate());
  }, []);

  const { upcomingList, pastList } = useMemo(() => {
    const upcoming: ExhibitionEvent[] = [];
    const past: ExhibitionEvent[] = [];

    for (const ev of exhibitions) {
      const endDate = makeLocalDate(ev.end[0], ev.end[1], ev.end[2]);
      if (endDate.getTime() >= referenceToday.getTime()) {
        upcoming.push(ev);
      } else {
        past.push(ev);
      }
    }

    upcoming.sort(
      (a, b) =>
        makeLocalDate(a.start[0], a.start[1], a.start[2]).getTime() -
        makeLocalDate(b.start[0], b.start[1], b.start[2]).getTime()
    );
    past.sort(
      (a, b) =>
        makeLocalDate(b.start[0], b.start[1], b.start[2]).getTime() -
        makeLocalDate(a.start[0], a.start[1], a.start[2]).getTime()
    );

    return { upcomingList: upcoming, pastList: past };
  }, [exhibitions, referenceToday]);

  const displayedEvents =
    segment === 'upcoming'
      ? upcomingList
      : segment === 'past'
        ? pastList
        : [...upcomingList, ...pastList];

  const handleDownloadCalendar = (ev: ExhibitionEvent) => {
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
    const a = document.createElement('a');
    a.href = url;
    a.download = `${ev.id}.ics`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    setCalendarNotice(`Downloaded calendar file (.ics) for "${ev.title}".`);
  };

  const scrollToDirections = () => {
    document.getElementById('harbour-road-directions')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="mx-auto max-w-[90rem] space-y-14 px-4 py-10 sm:px-8 sm:py-16">
      {/* Header & Segmented View Controls */}
      <div className="flex flex-wrap items-end justify-between gap-6 border-b border-border pb-8">
        <div className="min-w-0 space-y-2.5">
          <p className="text-xs font-medium uppercase tracking-[0.14em] text-accent">
            Harbour Road Calendar · Solo & Open Studio
          </p>
          <h1 className="font-display text-display text-foreground">Events & exhibitions</h1>
          <p className="max-w-[62ch] text-base leading-relaxed text-muted">
            Solo presentations, seasonal studio hangs, and First Fridays Artwalk evenings at Wild
            at Art Gallery on Harbour Road, Hermanus.
          </p>
        </div>

        <div
          className="flex flex-wrap items-center gap-2"
          role="group"
          aria-label="Exhibition timeline segment"
        >
          <FilterChip active={segment === 'upcoming'} onClick={() => setSegment('upcoming')}>
            Upcoming ({upcomingList.length})
          </FilterChip>
          <FilterChip active={segment === 'past'} onClick={() => setSegment('past')}>
            Past shows ({pastList.length})
          </FilterChip>
          <FilterChip active={segment === 'all'} onClick={() => setSegment('all')}>
            All ({exhibitions.length})
          </FilterChip>
        </div>
      </div>

      {calendarNotice ? (
        <div
          role="status"
          aria-live="polite"
          className="flex flex-wrap items-center justify-between gap-3 rounded-card border border-border-strong bg-surface px-4 py-3 text-sm text-foreground"
        >
          <span>{calendarNotice}</span>
          <button
            type="button"
            onClick={() => setCalendarNotice(null)}
            className="text-xs font-medium uppercase tracking-[0.1em] text-muted hover:text-foreground"
          >
            Dismiss
          </button>
        </div>
      ) : null}

      {/* Ozeum-style Exhibition Schedule Rows */}
      <section aria-label="Exhibition schedule" className="divide-y divide-border border-y border-border bg-surface">
        {displayedEvents.map((ev) => {
          const isUpcoming =
            makeLocalDate(ev.end[0], ev.end[1], ev.end[2]).getTime() >= referenceToday.getTime();
          const dayStr = String(ev.start[2]).padStart(2, '0');
          const monthLabel = MONTH_SHORT[ev.start[1] - 1] ?? 'JAN';

          return (
            <div key={ev.id} className="p-5 sm:p-8">
              <div className="grid grid-cols-1 gap-5 lg:grid-cols-12 lg:items-center lg:gap-6">
                {/* Large Architectural Museum Date Block */}
                <div className="flex min-w-0 flex-col space-y-1.5 lg:col-span-3">
                  <div className="flex items-baseline gap-2.5">
                    <span className="font-display text-4xl font-medium text-foreground tabular-nums sm:text-5xl">
                      {dayStr}
                    </span>
                    <span className="text-xs font-medium uppercase tracking-[0.14em] text-accent tabular-nums">
                      {monthLabel} {ev.start[0]}
                    </span>
                  </div>
                  <p className="text-xs text-muted tabular-nums">
                    {formatExhibitionRange(ev.start, ev.end)}
                  </p>
                  <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-muted">
                    {isUpcoming ? (
                      <span className="text-accent">Upcoming · {ev.kind}</span>
                    ) : (
                      <span>Archived · {ev.kind}</span>
                    )}
                    {ev.featuredWorksCount ? ` · ${ev.featuredWorksCount} canvases` : ''}
                  </p>
                </div>

                {/* Narrative & Opening Night details */}
                <div className="min-w-0 space-y-2 lg:col-span-6">
                  <h2 className="font-display text-2xl font-medium text-foreground sm:text-3xl">
                    {ev.title}
                  </h2>
                  <p className="text-sm font-medium text-foreground">
                    {ev.venue} · {ev.address}, {ev.city}
                  </p>
                  <p className="text-sm leading-relaxed text-muted">{ev.summary}</p>
                  <p className="pt-1 text-xs text-muted">
                    <span className="font-medium text-foreground">Opening night:</span>{' '}
                    {ev.openingNight}
                  </p>
                </div>

                {/* Interactive Calendar, Directions & RSVP Actions */}
                <div className="flex flex-wrap items-center gap-2.5 lg:col-span-3 lg:justify-end">
                  {isUpcoming ? (
                    <>
                      <Button tone="quiet" onClick={() => handleDownloadCalendar(ev)}>
                        <Calendar className="size-4" />
                        <span>Add to calendar</span>
                      </Button>
                      <Button tone="primary" onClick={() => onInquireEvent(ev)}>
                        RSVP / preview
                      </Button>
                    </>
                  ) : (
                    <Button tone="quiet" onClick={() => onInquireEvent(ev)}>
                      Catalogue inquiry
                    </Button>
                  )}

                  {ev.isHarbourRoadVenue ? (
                    <button
                      type="button"
                      onClick={scrollToDirections}
                      className="inline-flex min-h-9 items-center gap-1.5 px-2 text-xs font-medium uppercase tracking-[0.1em] text-muted hover:text-foreground"
                    >
                      <MapPin className="size-3.5" />
                      <span>Harbour Road map</span>
                    </button>
                  ) : null}
                </div>
              </div>
            </div>
          );
        })}
      </section>

      {/* Gallery Precinct Map & Visitor Notes */}
      <section
        id="harbour-road-directions"
        aria-labelledby="directions-heading"
        className="grid grid-cols-1 gap-8 pt-4 lg:grid-cols-12 lg:items-start"
      >
        <Surface className="min-w-0 space-y-4 p-6 lg:col-span-4">
          <p className="text-xs font-medium uppercase tracking-[0.14em] text-accent">
            Visitor Information
          </p>
          <h2 id="directions-heading" className="font-display text-title text-foreground">
            Visiting Harbour Road
          </h2>
          <p className="text-sm leading-relaxed text-muted">
            Wild at Art sits along historic Harbour Road in central Hermanus, a two-minute walk
            above the Old Harbour Museum and Walker Bay cliff path. Street parking is available
            along Marine Drive and Market Square.
          </p>
          <div className="divide-y divide-border border-t border-border pt-2 text-sm">
            <div className="py-3">
              <p className="text-xs font-medium uppercase tracking-[0.1em] text-foreground">
                Gallery hours
              </p>
              <p className="mt-1 text-muted">Tuesday – Sunday, 09:30 – 17:00</p>
            </div>
            <div className="py-3">
              <p className="text-xs font-medium uppercase tracking-[0.1em] text-foreground">
                First Fridays Artwalk
              </p>
              <p className="mt-1 text-muted">
                Open until 20:00 on the first Friday of every month alongside neighbouring Hermanus
                galleries.
              </p>
            </div>
            <div className="py-3 pb-0">
              <p className="text-xs font-medium uppercase tracking-[0.1em] text-foreground">
                Private viewings
              </p>
              <p className="mt-1 text-muted">
                Monday or after-hours studio appointments arranged directly with Steve Jones.
              </p>
            </div>
          </div>
        </Surface>

        <div className="min-w-0 lg:col-span-8">
          <HarbourMapSvg />
        </div>
      </section>
    </div>
  );
}
