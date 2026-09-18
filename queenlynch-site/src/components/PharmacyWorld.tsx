'use client';

import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowDownRight,
  ArrowUpRight,
  Clock3,
  Mail,
  MapPin,
  Menu,
  Phone,
  ShieldCheck,
} from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { useRef, type MouseEvent } from 'react';
import { Button } from '@/components/ui/button';
import { MINOR_AILMENTS, NAP_DATA, SPECIALIZED_SERVICES } from '@/lib/constants';
import './PharmacyWorld.css';

gsap.registerPlugin(ScrollTrigger, useGSAP);

const PHONE_HREF = `tel:${NAP_DATA.phone.primary.replace(/[^0-9]/g, '')}`;

const CARE_CARDS = [
  {
    index: '01',
    title: 'Prescriptions',
    body: 'Clear answers, careful dispensing, and counselling that gives every prescription context.',
    image: '/media/interiors/ByUvCogb.webp',
    alt: 'Queen Lynch Pharmacy prescription counter',
  },
  {
    index: '02',
    title: 'Minor ailments',
    body: `Our pharmacists can assess and prescribe for ${MINOR_AILMENTS.length} common conditions.`,
    image: '/media/interiors/BeE0h5JC.webp',
    alt: 'A consultation area inside Queen Lynch Pharmacy',
  },
  {
    index: '03',
    title: 'MedsCheck',
    body: 'A one-on-one medication review to help you understand what you take and why.',
    image: '/media/staff/DPsZ9mdv.webp',
    alt: 'A Queen Lynch pharmacist ready to help',
  },
  {
    index: '04',
    title: 'Care that continues',
    body: 'Vaccines, counselling, diabetes education, and support through every stage of care.',
    image: '/media/interiors/a1TxdQS5.webp',
    alt: 'The bright interior of Queen Lynch Pharmacy',
  },
];

const AILMENT_GROUPS = [
  MINOR_AILMENTS.slice(0, 4),
  MINOR_AILMENTS.slice(4, 7),
  MINOR_AILMENTS.slice(7, 10),
  MINOR_AILMENTS.slice(10),
];

const STORY_IMAGES = [
  { src: '/media/interiors/ByUvCogb.webp', alt: 'Queen Lynch Pharmacy dispensary' },
  { src: '/media/staff/DPsZ9mdv.webp', alt: 'A Queen Lynch pharmacist' },
  { src: '/media/interiors/BeE0h5JC.webp', alt: 'Queen Lynch Pharmacy interior' },
  { src: '/media/interiors/a1TxdQS5.webp', alt: 'Queen Lynch Pharmacy counter' },
];

export function PharmacyWorld() {
  const root = useRef<HTMLElement>(null);

  const closeMobileMenu = (event: MouseEvent<HTMLElement>) => {
    const details = event.currentTarget.closest<HTMLDetailsElement>('details');
    if (details) details.open = false;
  };

  useGSAP(
    () => {
      const media = gsap.matchMedia();

      media.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.from('.ql-hero-word', {
          scale: 0.985,
          transformOrigin: 'left center',
          duration: 0.8,
          stagger: 0.08,
          ease: 'power2.out',
        });

        gsap.fromTo(
          '.ql-hero-media',
          { scale: 1.02, yPercent: 0 },
          {
            scale: 1.12,
            yPercent: -5,
            ease: 'none',
            scrollTrigger: {
              trigger: '.ql-hero',
              start: 'top top',
              end: 'bottom top',
              scrub: 0.7,
            },
          },
        );

        gsap.utils.toArray<HTMLElement>('.ql-reveal').forEach((element) => {
          gsap.from(element.children, {
            y: 24,
            duration: 0.7,
            stagger: 0.08,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: element,
              start: 'top 78%',
              once: true,
            },
          });
        });

        gsap.fromTo(
          '.ql-care-label',
          { '--care-label-progress': 0 },
          {
            '--care-label-progress': 1,
            ease: 'none',
            scrollTrigger: {
              trigger: '.ql-label-section',
              start: 'top top',
              end: 'bottom bottom',
              scrub: 0.5,
            },
          },
        );

        gsap.from('.ql-care-field', {
          y: 34,
          opacity: 0.14,
          stagger: 0.16,
          ease: 'none',
          scrollTrigger: {
            trigger: '.ql-label-section',
            start: 'top 10%',
            end: 'bottom 45%',
            scrub: 0.7,
          },
        });

        gsap.utils.toArray<HTMLElement>('.ql-story-tile').forEach((tile, index) => {
          gsap.fromTo(
            tile,
            { yPercent: index % 2 === 0 ? 14 : -10, rotate: index % 2 === 0 ? -1.5 : 1.5 },
            {
              yPercent: index % 2 === 0 ? -10 : 9,
              rotate: 0,
              ease: 'none',
              scrollTrigger: {
                trigger: '.ql-story-grid',
                start: 'top bottom',
                end: 'bottom top',
                scrub: 0.8,
              },
            },
          );
        });

        gsap.fromTo(
          '.ql-visit-media',
          { clipPath: 'circle(19% at 50% 50%)', scale: 1.12 },
          {
            clipPath: 'circle(76% at 50% 50%)',
            scale: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: '.ql-visit',
              start: 'top 86%',
              end: 'top 8%',
              scrub: 0.8,
            },
          },
        );
      });

      media.add('(min-width: 801px) and (prefers-reduced-motion: no-preference)', () => {
        const rail = document.querySelector<HTMLElement>('.ql-care-rail');
        const section = document.querySelector<HTMLElement>('.ql-services');

        if (!rail || !section) return;

        const distance = () => Math.max(0, rail.scrollWidth - window.innerWidth);

        gsap.to(rail, {
          x: () => -distance(),
          ease: 'none',
          scrollTrigger: {
            trigger: section,
            start: 'top top',
            end: () => `+=${Math.max(distance(), window.innerHeight * 1.5)}`,
            pin: true,
            scrub: 0.65,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });
      });

      media.add('(prefers-reduced-motion: reduce)', () => {
        gsap.set(
          '.ql-hero-word, .ql-hero-media, .ql-reveal > *, .ql-care-field, .ql-care-rail, .ql-story-tile, .ql-visit-media',
          { clearProps: 'all' },
        );
      });

      let hashFrame: number | undefined;
      const hashTarget = window.location.hash
        ? document.querySelector<HTMLElement>(window.location.hash)
        : null;

      if (hashTarget) {
        hashFrame = window.requestAnimationFrame(() => {
          ScrollTrigger.refresh();
          hashFrame = window.requestAnimationFrame(() => hashTarget.scrollIntoView());
        });
      }

      return () => {
        if (hashFrame !== undefined) window.cancelAnimationFrame(hashFrame);
        media.revert();
      };
    },
    { scope: root },
  );

  return (
    <main ref={root} className="ql-world" data-scroll-grammar="editorial-journey">
      <a className="ql-skip" href="#main-content">
        Skip to content
      </a>

      <header className="ql-header">
        <Link className="ql-brand" href="/" aria-label="Queen Lynch Pharmacy home">
          {/* The supplied brand mark is already an accessible decorative lockup. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/media/brand/DRpQ8qHl.svg" alt="" width="719" height="174" />
        </Link>

        <nav className="ql-nav" aria-label="Primary navigation">
          <a href="#services">Services</a>
          <a href="#minor-ailments">Minor ailments</a>
          <a href="#our-pharmacy">Our pharmacy</a>
          <Link href="/blog">Journal</Link>
          <a href="#visit">Visit</a>
        </nav>

        <div className="ql-header-actions">
          <a className="ql-header-phone" href={PHONE_HREF}>
            {NAP_DATA.phone.primary}
          </a>
          <Button asChild>
            <a href="#visit">Visit us</a>
          </Button>
        </div>

        <details className="ql-menu">
          <summary aria-label="Open navigation">
            <Menu aria-hidden="true" />
          </summary>
          <nav aria-label="Mobile navigation" onClick={closeMobileMenu}>
            <a href="#services">Services</a>
            <a href="#minor-ailments">Minor ailments</a>
            <a href="#our-pharmacy">Our pharmacy</a>
            <Link href="/blog">Journal</Link>
            <a href="#visit">Visit</a>
            <a href={PHONE_HREF}>{NAP_DATA.phone.primary}</a>
          </nav>
        </details>
      </header>

      <section className="ql-hero" aria-labelledby="hero-title">
        <div className="ql-hero-sticky">
          <Image
            className="ql-hero-media ql-hero-poster"
            src="/world/p02.webp"
            alt="Inside Queen Lynch Pharmacy in Brampton"
            fill
            preload
            sizes="100vw"
          />
          <video
            className="ql-hero-media ql-hero-video"
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            poster="/world/p02.webp"
            aria-hidden="true"
          >
            <source src="/world/02-m.mp4" type="video/mp4" media="(max-width: 800px)" />
            <source src="/world/02.mp4" type="video/mp4" />
          </video>
          <div className="ql-hero-scrim" aria-hidden="true" />
          <div className="ql-hero-copy">
            <p className="ql-kicker">{NAP_DATA.address.city}, Ontario</p>
            <h1 id="hero-title" aria-label="Your pharmacy should feel personal.">
              <span className="ql-word-mask">
                <span className="ql-hero-word">Your pharmacy</span>
              </span>
              <span className="ql-word-mask">
                <span className="ql-hero-word ql-hero-word-accent">should feel personal.</span>
              </span>
            </h1>
            <p className="ql-hero-intro">
              Prescriptions, minor ailment care, and straight answers from {NAP_DATA.owner} and a
              team that takes time to listen.
            </p>
            <div className="ql-hero-actions">
              <Button asChild size="lg" variant="light">
                <a href={PHONE_HREF}>
                  Call the pharmacy
                  <ArrowDownRight aria-hidden="true" />
                </a>
              </Button>
              <a className="ql-text-link ql-text-link-light" href="#minor-ailments">
                See minor ailment care
                <ArrowDownRight aria-hidden="true" />
              </a>
            </div>
          </div>
          <p className="ql-hero-address">{NAP_DATA.address.full}</p>
        </div>
      </section>

      <div id="main-content">
        <section className="ql-trust" aria-labelledby="trust-title">
          <div className="ql-trust-photo">
            <Image
              className="ql-parallax-photo"
              src="/media/staff/DPsZ9mdv.webp"
              alt="A pharmacist at Queen Lynch Pharmacy"
              fill
              sizes="(max-width: 800px) 100vw, 52vw"
            />
          </div>
          <div className="ql-trust-copy ql-reveal">
            <p className="ql-kicker">Independent care on Queen Street East</p>
            <h2 id="trust-title">Care from people who know your name.</h2>
            <p>
              Healthcare feels different when there is time for a real conversation. We explain
              what matters, notice what changed, and help you leave with a clear next step.
            </p>
            <div className="ql-trust-note">
              <ShieldCheck aria-hidden="true" />
              <div>
                <strong>Owned and operated by {NAP_DATA.owner}</strong>
                <span>Local pharmacy care grounded in continuity, clarity, and trust.</span>
              </div>
            </div>
          </div>
        </section>

        <section className="ql-services" id="services" aria-labelledby="services-title">
          <div className="ql-rail-heading">
            <p className="ql-kicker">Care for the everyday and the unexpected</p>
            <h2 id="services-title">Support that moves with you.</h2>
          </div>
          <div className="ql-care-rail">
            {CARE_CARDS.map((card) => (
              <article className="ql-care-card" key={card.title}>
                <Image src={card.image} alt={card.alt} fill sizes="(max-width: 800px) 84vw, 48vw" />
                <div className="ql-card-scrim" aria-hidden="true" />
                <span className="ql-card-index">{card.index}</span>
                <div className="ql-card-copy">
                  <h3>{card.title}</h3>
                  <p>{card.body}</p>
                  <a href={card.index === '02' ? '#minor-ailments' : '#visit'}>
                    Learn more
                    <ArrowUpRight aria-hidden="true" />
                  </a>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="ql-label-section" id="minor-ailments" aria-labelledby="ailments-title">
          <div className="ql-label-sticky">
            <div className="ql-label-copy ql-reveal">
              <p className="ql-kicker">Pharmacist prescribing</p>
              <h2 id="ailments-title">Thirteen common problems. One familiar counter.</h2>
              <p>
                Start with a conversation. Our pharmacists can assess these minor ailments and,
                when appropriate, prescribe treatment without a separate clinic visit.
              </p>
            </div>

            <article className="ql-care-label" aria-label="Minor ailment care label">
              <div className="ql-care-label-top">
                <div>
                  <span>Queen Lynch Pharmacy</span>
                  <strong>Minor ailment care</strong>
                </div>
                <span className="ql-rx-mark">Rx</span>
              </div>
              <div className="ql-label-rule">
                <span className="care-label-progress" aria-hidden="true" />
              </div>
              <div className="ql-care-fields">
                {AILMENT_GROUPS.map((group, groupIndex) => (
                  <div className="ql-care-field" key={group[0].name}>
                    <span className="ql-field-number">
                      {String(groupIndex + 1).padStart(2, '0')}
                    </span>
                    <ul>
                      {group.map((ailment) => (
                        <li key={ailment.name}>{ailment.name}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
              <p className="ql-label-disclaimer">
                Assessment determines whether pharmacist prescribing is appropriate. Ask our team
                what to bring.
              </p>
            </article>
          </div>
        </section>

        <section className="ql-specialty" aria-labelledby="specialty-title">
          <div className="ql-specialty-photo">
            <Image
              src="/media/interiors/BeE0h5JC.webp"
              alt="A quiet care space inside Queen Lynch Pharmacy"
              fill
              sizes="(max-width: 800px) 100vw, 50vw"
            />
          </div>
          <div className="ql-specialty-copy ql-reveal">
            <p className="ql-kicker">Specialized support</p>
            <h2 id="specialty-title">More than what comes in the bottle.</h2>
            <p>
              Complex care becomes more manageable when someone sees the whole picture. Our team
              supports medication routines, questions, and changes with patience.
            </p>
            <div className="ql-specialty-list">
              {SPECIALIZED_SERVICES.map((service, index) => (
                <article key={service.title}>
                  <span>{String(index + 1).padStart(2, '0')}</span>
                  <div>
                    <h3>{service.title}</h3>
                    <p>{service.description}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="ql-story-grid" id="our-pharmacy" aria-labelledby="story-title">
          <div className="ql-story-copy ql-reveal">
            <p className="ql-kicker">A pharmacy built around people</p>
            <h2 id="story-title">The details make care feel easier.</h2>
            <p>
              A bright room, a private conversation, a pharmacist who remembers the last one.
              Queen Lynch is designed for the small moments that make healthcare feel human.
            </p>
          </div>
          <div className="ql-story-tiles" aria-label="Inside Queen Lynch Pharmacy">
            {STORY_IMAGES.map((image) => (
              <figure className="ql-story-tile" key={image.src}>
                <Image src={image.src} alt={image.alt} fill sizes="(max-width: 800px) 82vw, 38vw" />
              </figure>
            ))}
          </div>
          <p className="ql-story-caption">
            A local pharmacy for prescriptions, practical questions, and care that remembers where
            you left off.
          </p>
        </section>

        <section className="ql-visit" id="visit" aria-labelledby="visit-title">
          <div className="ql-visit-media">
            <Image
              src="/media/interiors/a1TxdQS5.webp"
              alt="Visit Queen Lynch Pharmacy on Queen Street East"
              fill
              sizes="100vw"
            />
            <div className="ql-visit-scrim" aria-hidden="true" />
          </div>
          <div className="ql-visit-copy ql-reveal">
            <p className="ql-kicker">Come by or call ahead</p>
            <h2 id="visit-title">Let&apos;s make the next step clear.</h2>
            <p>
              Visit us at {NAP_DATA.address.street} or call with your question. We&apos;ll help you
              understand what can be handled at the pharmacy.
            </p>
            <div className="ql-visit-actions">
              <Button asChild size="lg" variant="light">
                <a href={PHONE_HREF}>
                  <Phone aria-hidden="true" />
                  {NAP_DATA.phone.primary}
                </a>
              </Button>
              <Button asChild size="lg" variant="outline">
                <a
                  href="https://maps.google.com/?q=157+Queen+St+E+Brampton+ON"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <MapPin aria-hidden="true" />
                  Get directions
                </a>
              </Button>
            </div>
          </div>
        </section>
      </div>

      <footer className="ql-footer">
        <div className="ql-footer-brand">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/media/brand/DRpQ8qHl.svg" alt="Queen Lynch Pharmacy" width="719" height="174" />
          <p>Independent pharmacy care in Brampton, Ontario.</p>
        </div>
        <div className="ql-footer-contact">
          <a href={PHONE_HREF}>
            <Phone aria-hidden="true" />
            {NAP_DATA.phone.primary}
          </a>
          <a href={`mailto:${NAP_DATA.email}`}>
            <Mail aria-hidden="true" />
            {NAP_DATA.email}
          </a>
          <span>
            <Clock3 aria-hidden="true" />
            Mon–Fri {NAP_DATA.hours.weekday} · Sat {NAP_DATA.hours.saturday}
          </span>
        </div>
        <div className="ql-footer-links">
          <Link href="/blog">Journal</Link>
          <a href="#services">Services</a>
          <a href="#minor-ailments">Minor ailments</a>
          <a href="#visit">Visit</a>
        </div>
        <p className="ql-footer-legal">© 2026 Queen Lynch Pharmacy</p>
      </footer>
    </main>
  );
}
