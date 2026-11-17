import { useEffect, useState, type FormEvent } from 'react';
import { CheckCircle2, Mail, Phone, Send, Trash2, X } from 'lucide-react';
import { ARTIST_CONTACT, type Artwork, type ExhibitionEvent } from '../data/catalog';
import {
  formatDimensions,
  formatExhibitionRange,
  formatZarMinorUnits,
  type DimensionUnit,
} from '../utils/galleryMath';
import { HarbourMapSvg } from '../components/HarbourMapSvg';
import { Button, Field, Surface, inputClassName } from '../components/ui';

export interface InquiryContextPayload {
  kind: 'artwork' | 'commission' | 'event';
  artwork?: Artwork;
  event?: ExhibitionEvent;
}

interface SavedInquiryRecord {
  reference: string;
  name: string;
  email: string;
  subject: string;
  submittedAt: string;
}

const STORAGE_KEY = 'wildatart.inquiries.v1';

function readSavedInquiries(): SavedInquiryRecord[] {
  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (item): item is SavedInquiryRecord =>
        item &&
        typeof item.reference === 'string' &&
        typeof item.name === 'string' &&
        typeof item.subject === 'string'
    );
  } catch {
    return [];
  }
}

function writeSavedInquiries(records: SavedInquiryRecord[]) {
  try {
    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(records.slice(0, 8)));
  } catch {
    // Ignore storage quota errors cleanly
  }
}

interface ContactPageProps {
  allArtworks: readonly Artwork[];
  inquiryContext: InquiryContextPayload | null;
  unit: DimensionUnit;
  onClearContext: () => void;
  onSelectArtworkContext: (artworkId: string) => void;
}

export function ContactPage({
  allArtworks,
  inquiryContext,
  unit,
  onClearContext,
  onSelectArtworkContext,
}: ContactPageProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submittedReceipt, setSubmittedReceipt] = useState<SavedInquiryRecord | null>(null);
  const [recentInquiries, setRecentInquiries] = useState<SavedInquiryRecord[]>(() =>
    readSavedInquiries()
  );

  useEffect(() => {
    if (!inquiryContext) return;
    setSubmittedReceipt(null);

    if (inquiryContext.kind === 'artwork' && inquiryContext.artwork) {
      const w = inquiryContext.artwork;
      const priceText =
        w.priceCentsZar !== null ? ` (${formatZarMinorUnits(w.priceCentsZar)})` : '';
      setSubject(`Acquisition inquiry: "${w.title}"`);
      setMessage(
        `Hello Steve,\n\nI would like to inquire about acquiring "${w.title}" (${w.medium}, ${formatDimensions(w.widthCm, w.heightCm, 'cm')}${priceText}). Please share availability and shipping options to my location.\n\nKind regards,`
      );
    } else if (inquiryContext.kind === 'commission' && inquiryContext.artwork) {
      const w = inquiryContext.artwork;
      setSubject(`Commission inquiry inspired by "${w.title}"`);
      setMessage(
        `Hello Steve,\n\nI admired your archived painting "${w.title}" (${formatDimensions(w.widthCm, w.heightCm, 'cm')}) and would like to discuss commissioning a related original oil work. My preferred wall dimensions are roughly …\n\nKind regards,`
      );
    } else if (inquiryContext.kind === 'event' && inquiryContext.event) {
      const ev = inquiryContext.event;
      setSubject(`Exhibition RSVP / preview: ${ev.title}`);
      setMessage(
        `Hello Steve,\n\nPlease register my interest for "${ev.title}" (${formatExhibitionRange(ev.start, ev.end)}) at ${ev.venue}. I would also appreciate receiving the preview catalogue.\n\nKind regards,`
      );
    }
  }, [inquiryContext]);

  const validate = () => {
    const nextErrors: Record<string, string> = {};
    if (name.trim().length < 2) {
      nextErrors.name = 'Please enter your full name.';
    }
    const emailClean = email.trim();
    if (!emailClean || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailClean)) {
      nextErrors.email = 'Please enter a valid email address so the gallery can reply.';
    }
    if (subject.trim().length < 3) {
      nextErrors.subject = 'Please enter a brief subject for your inquiry.';
    }
    if (message.trim().length < 15) {
      nextErrors.message = 'Please include a short message (at least 15 characters).';
    }
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    window.setTimeout(() => {
      const refCode = `WAA-${String(Date.now()).slice(-5)}`;
      const receipt: SavedInquiryRecord = {
        reference: refCode,
        name: name.trim(),
        email: email.trim(),
        subject: subject.trim(),
        submittedAt: new Intl.DateTimeFormat('en-ZA', {
          day: 'numeric',
          month: 'short',
          hour: '2-digit',
          minute: '2-digit',
        }).format(new Date()),
      };
      const updated = [receipt, ...recentInquiries];
      setRecentInquiries(updated);
      writeSavedInquiries(updated);
      setSubmittedReceipt(receipt);
      setSubmitting(false);
    }, 220);
  };

  const handleResetNewInquiry = () => {
    setSubmittedReceipt(null);
    setSubject('');
    setMessage('');
    setErrors({});
    onClearContext();
  };

  const handleClearHistory = () => {
    setRecentInquiries([]);
    try {
      window.sessionStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
  };

  return (
    <div className="mx-auto max-w-[90rem] space-y-14 px-4 py-10 sm:px-8 sm:py-16">
      {/* Header */}
      <div className="space-y-2.5 border-b border-border pb-8">
        <p className="text-xs font-medium uppercase tracking-[0.14em] text-accent">
          Collector Desk · Hermanus Studio
        </p>
        <h1 className="font-display text-display text-foreground">Contact & inquiries</h1>
        <p className="max-w-[62ch] text-base leading-relaxed text-muted">
          Direct inquiries to Steve Jones regarding available paintings, private Hermanus studio
          appointments, bespoke wildlife commissions, or insured shipping quotes.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-start">
        {/* Left: Interactive Inquiry Form */}
        <div className="min-w-0 space-y-6 lg:col-span-7">
          <Surface className="p-6 sm:p-8">
            {inquiryContext ? (
              <div className="mb-6 flex items-start justify-between gap-4 border-b border-border pb-5">
                <div className="min-w-0 space-y-1">
                  <p className="text-xs font-medium uppercase tracking-[0.12em] text-accent">
                    {inquiryContext.kind === 'commission'
                      ? 'Archival commission reference'
                      : inquiryContext.kind === 'event'
                        ? 'Exhibition RSVP'
                        : 'Selected painting attached'}
                  </p>
                  {inquiryContext.artwork ? (
                    <>
                      <p className="font-display text-2xl text-foreground">
                        {inquiryContext.artwork.title}
                      </p>
                      <p className="text-sm text-muted tabular-nums">
                        {inquiryContext.artwork.medium} ·{' '}
                        {formatDimensions(
                          inquiryContext.artwork.widthCm,
                          inquiryContext.artwork.heightCm,
                          unit
                        )}
                        {inquiryContext.artwork.priceCentsZar !== null
                          ? ` · ${formatZarMinorUnits(inquiryContext.artwork.priceCentsZar)}`
                          : ' · Archived work'}
                      </p>
                    </>
                  ) : inquiryContext.event ? (
                    <>
                      <p className="font-display text-2xl text-foreground">
                        {inquiryContext.event.title}
                      </p>
                      <p className="text-sm text-muted tabular-nums">
                        {formatExhibitionRange(
                          inquiryContext.event.start,
                          inquiryContext.event.end
                        )}{' '}
                        · {inquiryContext.event.venue}
                      </p>
                    </>
                  ) : null}
                </div>

                <button
                  type="button"
                  onClick={onClearContext}
                  aria-label="Clear attached reference"
                  className="inline-flex min-h-9 items-center gap-1 rounded-control border border-border px-2.5 text-xs font-medium uppercase tracking-[0.1em] text-muted hover:border-border-strong hover:text-foreground"
                >
                  <X className="size-3.5" />
                  <span>Clear</span>
                </button>
              </div>
            ) : null}

            {submittedReceipt ? (
              <div role="status" aria-live="polite" className="space-y-5 py-4">
                <div className="flex items-center gap-2.5 text-accent">
                  <CheckCircle2 className="size-6 shrink-0" />
                  <h2 className="font-display text-3xl text-foreground">
                    Inquiry logged for Steve Jones
                  </h2>
                </div>
                <p className="text-sm leading-relaxed text-muted">
                  Thank you, <span className="font-medium text-foreground">{submittedReceipt.name}</span>.
                  Your message regarding{' '}
                  <span className="font-medium text-foreground">{submittedReceipt.subject}</span> has
                  been recorded under reference{' '}
                  <span className="font-medium text-foreground tabular-nums">
                    {submittedReceipt.reference}
                  </span>
                  . Replies are sent to{' '}
                  <span className="font-medium text-foreground">{submittedReceipt.email}</span> from
                  the Harbour Road studio.
                </p>
                <div className="flex flex-wrap items-center gap-3 border-t border-border pt-5">
                  <Button tone="primary" onClick={handleResetNewInquiry}>
                    Send another inquiry
                  </Button>
                  <a
                    href={`mailto:${ARTIST_CONTACT.emailPrimary}?subject=${encodeURIComponent(
                      `${submittedReceipt.subject} (${submittedReceipt.reference})`
                    )}&body=${encodeURIComponent(message)}`}
                    className="inline-flex min-h-11 items-center gap-2 rounded-control border border-border-strong px-4 text-xs font-medium uppercase tracking-[0.1em] text-foreground hover:bg-surface-muted"
                  >
                    <Mail className="size-4" />
                    <span>Open in email client</span>
                  </a>
                </div>
              </div>
            ) : (
              <form noValidate onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <Field label="Your name" htmlFor="contact-name" error={errors.name}>
                    <input
                      id="contact-name"
                      name="name"
                      type="text"
                      autoComplete="name"
                      value={name}
                      onChange={(e) => {
                        setName(e.target.value);
                        if (errors.name) setErrors((p) => ({ ...p, name: '' }));
                      }}
                      placeholder="e.g. Claire van der Merwe"
                      className={inputClassName}
                    />
                  </Field>

                  <Field label="Email address" htmlFor="contact-email" error={errors.email}>
                    <input
                      id="contact-email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (errors.email) setErrors((p) => ({ ...p, email: '' }));
                      }}
                      placeholder="you@domain.com"
                      className={inputClassName}
                    />
                  </Field>
                </div>

                <Field
                  label="Reference a specific painting (optional)"
                  htmlFor="contact-artwork-picker"
                  hint="Pre-fills dimensions & status"
                >
                  <select
                    id="contact-artwork-picker"
                    value={inquiryContext?.artwork?.id ?? ''}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (!val) onClearContext();
                      else onSelectArtworkContext(val);
                    }}
                    className={inputClassName}
                  >
                    <option value="">General studio / exhibition inquiry</option>
                    <optgroup label="Available in gallery">
                      {allArtworks
                        .filter((w) => w.status === 'available')
                        .map((w) => (
                          <option key={w.id} value={w.id}>
                            {w.title} — {formatDimensions(w.widthCm, w.heightCm, unit)} (
                            {w.priceCentsZar !== null
                              ? formatZarMinorUnits(w.priceCentsZar)
                              : 'Available'}
                            )
                          </option>
                        ))}
                    </optgroup>
                    <optgroup label="Sold archive (commission reference)">
                      {allArtworks
                        .filter((w) => w.status === 'sold')
                        .map((w) => (
                          <option key={w.id} value={w.id}>
                            {w.title} ({w.year} · Sold — commission similar)
                          </option>
                        ))}
                    </optgroup>
                  </select>
                </Field>

                <Field label="Subject" htmlFor="contact-subject" error={errors.subject}>
                  <input
                    id="contact-subject"
                    name="subject"
                    type="text"
                    value={subject}
                    onChange={(e) => {
                      setSubject(e.target.value);
                      if (errors.subject) setErrors((p) => ({ ...p, subject: '' }));
                    }}
                    placeholder="Acquisition, shipping quote, or private studio viewing"
                    className={inputClassName}
                  />
                </Field>

                <Field
                  label="Message"
                  htmlFor="contact-message"
                  hint="Include destination city if requesting crating/shipping"
                  error={errors.message}
                >
                  <textarea
                    id="contact-message"
                    name="message"
                    rows={5}
                    value={message}
                    onChange={(e) => {
                      setMessage(e.target.value);
                      if (errors.message) setErrors((p) => ({ ...p, message: '' }));
                    }}
                    placeholder="Write your question for Steve Jones…"
                    className={`${inputClassName} resize-y`}
                  />
                </Field>

                <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
                  <p className="text-xs text-muted">
                    Replies typically sent within one gallery day from Hermanus.
                  </p>
                  <Button type="submit" tone="primary" disabled={submitting}>
                    <Send className="size-4" />
                    <span>{submitting ? 'Sending…' : 'Send inquiry'}</span>
                  </Button>
                </div>
              </form>
            )}
          </Surface>

          {recentInquiries.length > 0 ? (
            <Surface className="p-5 sm:p-6">
              <div className="flex items-center justify-between gap-3 pb-3">
                <h2 className="text-xs font-medium uppercase tracking-[0.12em] text-foreground">
                  Recent inquiries sent this session ({recentInquiries.length})
                </h2>
                <button
                  type="button"
                  onClick={handleClearHistory}
                  className="inline-flex items-center gap-1 text-xs font-medium text-muted hover:text-foreground"
                >
                  <Trash2 className="size-3.5" />
                  <span>Clear list</span>
                </button>
              </div>
              <div className="divide-y divide-border/70 border-t border-border/70 text-sm">
                {recentInquiries.map((rec) => (
                  <div
                    key={rec.reference}
                    className="flex flex-wrap items-baseline justify-between gap-2 py-2.5"
                  >
                    <span className="font-medium text-foreground">{rec.subject}</span>
                    <span className="text-xs text-muted tabular-nums">
                      {rec.reference} · {rec.submittedAt}
                    </span>
                  </div>
                ))}
              </div>
            </Surface>
          ) : null}
        </div>

        {/* Right: Direct Studio Channels & Location Details */}
        <aside className="min-w-0 space-y-6 lg:col-span-5">
          <Surface className="divide-y divide-border p-6 sm:p-7">
            <div className="space-y-2 pb-5">
              <p className="text-xs font-medium uppercase tracking-[0.14em] text-accent">
                Harbour Road Gallery
              </p>
              <h2 className="font-display text-3xl text-foreground">Direct studio channels</h2>
              <p className="text-sm text-muted">
                Speak directly with Steve Jones or visit the showroom on Harbour Road.
              </p>
            </div>

            <div className="space-y-2 py-5 text-sm">
              <p className="text-xs font-medium uppercase tracking-[0.12em] text-muted">Email</p>
              <p>
                <a
                  href={`mailto:${ARTIST_CONTACT.emailPrimary}`}
                  className="inline-flex items-center gap-2 font-medium text-foreground hover:text-accent"
                >
                  <Mail className="size-4 text-muted" />
                  <span>{ARTIST_CONTACT.emailPrimary}</span>
                </a>
              </p>
              <p className="text-xs text-muted">
                Artist studio desk:{' '}
                <a
                  href={`mailto:${ARTIST_CONTACT.emailStudio}`}
                  className="underline decoration-border-strong underline-offset-4 hover:text-foreground"
                >
                  {ARTIST_CONTACT.emailStudio}
                </a>
              </p>
            </div>

            <div className="space-y-2 py-5 text-sm">
              <p className="text-xs font-medium uppercase tracking-[0.12em] text-muted">
                Telephone & WhatsApp
              </p>
              <p>
                <a
                  href={ARTIST_CONTACT.phoneHref}
                  className="inline-flex items-center gap-2 font-medium text-foreground tabular-nums hover:text-accent"
                >
                  <Phone className="size-4 text-muted" />
                  <span>{ARTIST_CONTACT.phoneDisplay}</span>
                </a>
              </p>
            </div>

            <div className="space-y-1.5 py-5 text-sm">
              <p className="text-xs font-medium uppercase tracking-[0.12em] text-muted">
                Physical gallery
              </p>
              <p className="font-medium text-foreground">{ARTIST_CONTACT.galleryName}</p>
              <p className="text-muted">
                {ARTIST_CONTACT.streetAddress}, {ARTIST_CONTACT.region}
              </p>
              <p className="pt-1 text-xs text-muted">{ARTIST_CONTACT.hours}</p>
            </div>

            <div className="space-y-2 pt-5 text-sm">
              <p className="text-xs font-medium uppercase tracking-[0.12em] text-muted">
                Social channels
              </p>
              <div className="flex flex-wrap items-center gap-4 font-medium text-foreground">
                <a
                  href={ARTIST_CONTACT.instagramUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="underline decoration-border-strong underline-offset-4 hover:decoration-foreground"
                >
                  Instagram
                </a>
                <span className="text-border-strong" aria-hidden="true">
                  ·
                </span>
                <a
                  href={ARTIST_CONTACT.facebookUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="underline decoration-border-strong underline-offset-4 hover:decoration-foreground"
                >
                  Facebook
                </a>
              </div>
            </div>
          </Surface>

          <HarbourMapSvg />
        </aside>
      </div>
    </div>
  );
}
