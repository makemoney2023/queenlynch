'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SPECIALIZED_SERVICES } from '@/lib/constants';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export function WhyUs() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (prefersReducedMotion || !sectionRef.current) {
      return;
    }

    const ctx = gsap.context(() => {
      gsap.from('.why-us-content', {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
        },
        opacity: 0,
        y: 40,
        duration: 0.8,
        stagger: 0.2,
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="py-20 bg-white">
      <div className="container-custom">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="why-us-content">
            <h3 className="text-emerald-700 font-semibold text-lg mb-2">WHY US</h3>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-balance">
              Your Well-Being is our Main Priority.
            </h2>
            <p className="text-lg text-gray-700">
              We are a leader in implementing new technologies. With the capabilities of automating your prescriptions making it safe, easy and timely for you to receive your medication.
            </p>
          </div>
          <div className="why-us-content">
            <Image
              src="/media/interiors/ByUvCogb.webp"
              alt="Queen Lynch Pharmacy Interior"
              width={600}
              height={400}
              className="rounded-lg shadow-lg"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

export function CoreServices() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (prefersReducedMotion || !sectionRef.current) {
      return;
    }

    const ctx = gsap.context(() => {
      gsap.from('.core-services-content', {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
        },
        opacity: 0,
        y: 40,
        duration: 0.8,
        stagger: 0.2,
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="py-20 bg-gray-50">
      <div className="container-custom">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="core-services-content order-2 lg:order-1">
            <Image
              src="/media/interiors/a1TxdQS5.webp"
              alt="Pharmacy Services"
              width={600}
              height={400}
              className="rounded-lg shadow-lg"
            />
          </div>
          <div className="core-services-content order-1 lg:order-2">
            <h3 className="text-emerald-700 font-semibold text-lg mb-2">CORE SERVICES</h3>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-balance">
              Our Qualified Team is Ready to Help You!
            </h2>
            <p className="text-lg text-gray-700">
              Queen Lynch Pharmacy provides a multitude of services from prescription fulfillment, patient counselling, drug tracking, MedsCheck Programs and much more.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export function SpecializedServices() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (prefersReducedMotion || !sectionRef.current) {
      return;
    }

    const ctx = gsap.context(() => {
      gsap.from('.service-card', {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
        },
        opacity: 0,
        y: 40,
        duration: 0.8,
        stagger: 0.15,
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="py-20 bg-white">
      <div className="container-custom">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-4 text-balance">
          Specialized Services
        </h2>
        <p className="text-lg text-gray-700 text-center mb-12 max-w-4xl mx-auto">
          Some of our specialized services are Oncology Palliative Medication, Diabetes Education, Smoking Cessation, Home Health Care, Varicose/ Support Stockings, Naturopathic Therapy, Vaccines/ Flu Shots and much more.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {SPECIALIZED_SERVICES.map((service, index) => (
            <div 
              key={index}
              className="service-card bg-emerald-50 p-8 rounded-lg hover:shadow-lg transition-shadow"
            >
              <h3 className="text-2xl font-bold mb-4 text-emerald-900">{service.title}</h3>
              <p className="text-gray-700">{service.description}</p>
            </div>
          ))}
        </div>

        <div className="bg-emerald-700 text-white p-8 rounded-lg text-center">
          <p className="text-lg mb-6">
            As well we have partnered with Health Snap. Order over the counter products right to Queen Lynch for free.
          </p>
          <a
            href="https://www.healthsnap.ca"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white text-emerald-700 px-8 py-3 rounded-full font-semibold hover:bg-gray-100 inline-block transition-colors"
          >
            ORDER OVER THE COUNTER →
          </a>
        </div>
      </div>
    </section>
  );
}
