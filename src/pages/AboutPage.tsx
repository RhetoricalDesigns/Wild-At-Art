import { useState } from 'react';
import { ArrowRight, ChevronDown } from 'lucide-react';
import { ABOUT_ACCORDION, STUDIO_IMAGE } from '../data/catalog';
import type { PageId } from '../components/TopBar';
import { ArtworkImage, Button, Surface } from '../components/ui';

interface AboutPageProps {
  onNavigate: (page: PageId) => void;
}

export function AboutPage({ onNavigate }: AboutPageProps) {
  const [openIds, setOpenIds] = useState<Record<string, boolean>>({
    'collections-milestones': true,
    'selected-exhibitions-cv': false,
    'materials-shipping': false,
  });

  const toggleSection = (id: string) => {
    setOpenIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="mx-auto max-w-[90rem] space-y-16 px-4 py-10 sm:px-8 sm:py-16">
      {/* 1. Artist Monograph & Studio Practice */}
      <section
        aria-labelledby="about-artist-heading"
        className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-start"
      >
        <div className="min-w-0 space-y-6 lg:col-span-6">
          <div className="space-y-2.5">
            <p className="text-xs font-medium uppercase tracking-[0.14em] text-accent">
              Artist Monograph · Steve Jones (b. 1962)
            </p>
            <h1 id="about-artist-heading" className="font-display text-display text-foreground">
              Self-taught observation, built in raw linen and impasto oil
            </h1>
          </div>

          <div className="max-w-[65ch] space-y-4 text-base leading-relaxed text-muted">
            <p className="first-letter:float-left first-letter:mr-3 first-letter:mt-1 first-letter:font-display first-letter:text-5xl first-letter:font-medium first-letter:leading-none first-letter:text-foreground">
              Born in Coventry, England in 1962, Steve Jones grew up with a sketchbook in hand,
              observing British woodland birds and meadow wildlife long before picking up a palette
              knife. Without formal art-school orthodoxy to soften his instincts, he developed a
              direct, tactile visual language rooted in field patience and physical gesture.
            </p>
            <p>
              In 1996, drawn by Southern Africa’s untamed reserves, Jones relocated permanently to
              South Africa so he could spend weeks tracking elephants, lions, leopards, and Cape
              buffalo in their natural dust and light. In 2015 he settled on the Walker Bay coast,
              opening the Wild at Art Gallery on Harbour Road in Hermanus.
            </p>
            <p>
              Rather than smoothing oil paint into photographic illusion, Jones leaves raw Belgian
              linen edges breathing where appropriate and carves light with loaded bristle brushes
              and steel knives—allowing a bull elephant’s scarred hide or moonlit waterhole ripple
              to carry genuine sculptural relief on the wall.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Button tone="primary" onClick={() => onNavigate('gallery')}>
              <span>Explore collection</span>
              <ArrowRight className="size-4" />
            </Button>
            <Button tone="quiet" onClick={() => onNavigate('contact')}>
              Discuss a commission
            </Button>
          </div>
        </div>

        {/* 2. Studio Integration — Harbour Road Easel Photograph & Studio Notes */}
        <div className="min-w-0 space-y-6 lg:col-span-6">
          <Surface className="p-3 sm:p-4">
            <ArtworkImage
              src={STUDIO_IMAGE.src}
              alt={STUDIO_IMAGE.alt}
              title="Harbour Road Studio Easel, Hermanus"
              width={STUDIO_IMAGE.width}
              height={STUDIO_IMAGE.height}
              eager
            />
            <div className="mt-3 flex flex-wrap items-baseline justify-between gap-2 px-1 text-xs text-muted">
              <span className="italic">
                Fig. 1 — Morning Atlantic light at the Harbour Road studio easel, Hermanus
              </span>
              <span>Belgian linen, raw umber & yellow ochre</span>
            </div>
          </Surface>

          <Surface className="divide-y divide-border p-6">
            <div className="grid grid-cols-1 gap-4 pb-5 sm:grid-cols-3">
              <div>
                <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-muted">
                  Origin
                </p>
                <p className="mt-1 font-display text-xl text-foreground">Coventry, 1962</p>
              </div>
              <div>
                <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-muted">
                  South Africa
                </p>
                <p className="mt-1 font-display text-xl text-foreground">Since 1996</p>
              </div>
              <div>
                <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-muted">
                  Hermanus Gallery
                </p>
                <p className="mt-1 font-display text-xl text-foreground">Harbour Road, 2015</p>
              </div>
            </div>
            <p className="pt-4 text-sm leading-relaxed text-muted">
              Every canvas is painted personally by Steve Jones in Hermanus and accompanied by a
              signed Wild at Art studio provenance certificate.
            </p>
          </Surface>
        </div>
      </section>

      {/* 3. Exhibition CV, Notable Collections & Process Accordion */}
      <section aria-labelledby="cv-accordion-heading" className="space-y-6 border-t border-border pt-14">
        <div className="space-y-2">
          <p className="text-xs font-medium uppercase tracking-[0.14em] text-accent">
            Curriculum Vitae & Logistics
          </p>
          <h2 id="cv-accordion-heading" className="font-display text-title text-foreground">
            Collections, exhibitions & international crating
          </h2>
          <p className="text-sm text-muted">
            Expand each section for career milestones, exhibition history, and international
            collector shipping details.
          </p>
        </div>

        <Surface className="divide-y divide-border">
          {ABOUT_ACCORDION.map((section) => {
            const isExpanded = Boolean(openIds[section.id]);
            const panelId = `accordion-panel-${section.id}`;
            const triggerId = `accordion-trigger-${section.id}`;

            return (
              <div key={section.id} className="min-w-0">
                <h3>
                  <button
                    id={triggerId}
                    type="button"
                    aria-expanded={isExpanded}
                    aria-controls={panelId}
                    onClick={() => toggleSection(section.id)}
                    className="flex w-full items-center justify-between gap-4 px-5 py-5 text-left transition-colors duration-150 hover:bg-surface-muted/60 focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-primary sm:px-7"
                  >
                    <span className="min-w-0">
                      <span className="block font-display text-xl font-medium text-foreground sm:text-2xl">
                        {section.title}
                      </span>
                      <span className="mt-0.5 block text-sm text-muted">{section.subtitle}</span>
                    </span>
                    <ChevronDown
                      aria-hidden="true"
                      className={`size-5 shrink-0 text-muted transition-transform duration-200 ease-out ${
                        isExpanded ? 'rotate-180 text-accent' : ''
                      }`}
                    />
                  </button>
                </h3>

                {isExpanded ? (
                  <div
                    id={panelId}
                    role="region"
                    aria-labelledby={triggerId}
                    className="border-t border-border/80 px-5 py-6 sm:px-7"
                  >
                    <div className="divide-y divide-border/70">
                      {section.entries.map((entry) => (
                        <div
                          key={`${section.id}-${entry.heading}`}
                          className="grid grid-cols-1 gap-2 py-4 first:pt-0 last:pb-0 sm:grid-cols-12 sm:gap-6"
                        >
                          <div className="text-xs font-medium uppercase tracking-[0.12em] text-accent tabular-nums sm:col-span-3">
                            {entry.period}
                          </div>
                          <div className="space-y-1 sm:col-span-9">
                            <p className="font-medium text-foreground">{entry.heading}</p>
                            <p className="text-sm leading-relaxed text-muted">{entry.detail}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : null}
              </div>
            );
          })}
        </Surface>
      </section>
    </div>
  );
}
