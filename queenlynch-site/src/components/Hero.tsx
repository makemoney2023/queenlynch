'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MINOR_AILMENTS } from '@/lib/constants';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export function Hero() {
  const heroRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (prefersReducedMotion || !heroRef.current || !imageRef.current || !textRef.current) {
      return;
    }

    const ctx = gsap.context(() => {
      gsap.from(textRef.current, {
        opacity: 0,
        y: 30,
        duration: 1,
        ease: 'power3.out',
      });

      gsap.from(imageRef.current, {
        opacity: 0,
        scale: 1.1,
        duration: 1.2,
        ease: 'power3.out',
      });

      ScrollTrigger.create({
        trigger: heroRef.current,
        start: 'top top',
        end: 'bottom top',
        scrub: true,
        onUpdate: (self) => {
          if (imageRef.current) {
            gsap.to(imageRef.current, {
              y: self.progress * 100,
              ease: 'none',
              duration: 0.1,
            });
          }
        },
      });
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={heroRef} className="relative min-h-[80vh] flex items-center overflow-hidden">
      <div ref={imageRef} className="absolute inset-0 z-0">
        <Image
          src="/media/heroes/DPsZ9mdv-hero.webp"
          alt="Queen Lynch Pharmacy Team"
          fill
          priority
          className="object-cover brightness-50"
          sizes="100vw"
        />
      </div>

      <div ref={textRef} className="container-custom relative z-10 text-white py-20">
        <div className="max-w-3xl">
          <p className="text-emerald-300 text-lg mb-4 font-medium">
            Our Pharmacists prescribe for minor ailments to support your everyday health.
          </p>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 text-balance">
            Committed to Your Care
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-gray-100">
            Experiencing a common health issue? Get convenient care for many minor ailments without needing a doctor's appointment.
          </p>
          <p className="text-lg mb-6">
            Visit QLP today! Our highly trained Pharmacists are ready to help with the conditions listed below.
          </p>
          <button 
            onClick={() => document.getElementById('minor-ailments')?.scrollIntoView({ behavior: 'smooth' })}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-4 rounded-full text-lg font-semibold inline-flex items-center gap-2 transition-colors"
          >
            View List of Minor Ailments
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
}

export function MinorAilmentsList() {
  return (
    <section id="minor-ailments" className="py-16 bg-emerald-50">
      <div className="container-custom">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-emerald-900">
          Minor Ailments We Can Prescribe For
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto">
          {MINOR_AILMENTS.map((ailment, index) => (
            <div 
              key={index}
              className="bg-white p-4 rounded-lg shadow-sm border border-emerald-100 hover:shadow-md transition-shadow"
            >
              <p className="text-gray-700">{ailment.name}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
