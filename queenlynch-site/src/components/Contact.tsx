'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { NAP_DATA } from '@/lib/constants';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export function LocationContact() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (prefersReducedMotion || !sectionRef.current) {
      return;
    }

    const ctx = gsap.context(() => {
      gsap.from('.location-content', {
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
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-12 text-balance">
          Come visit us
        </h2>
        
        <p className="text-lg text-gray-700 text-center mb-12 max-w-3xl mx-auto">
          Queen Lynch has created a culture of efficiency, accuracy, professionalism and compassion whilst maintaining the highest standard of practice. Our staff are trained to understand the need to deliver consistently excellent patient care.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="location-content bg-white p-8 rounded-lg shadow-sm">
            <h3 className="text-2xl font-bold mb-4 text-emerald-900">Our Location</h3>
            <p className="text-gray-700">
              {NAP_DATA.address.street}<br />
              {NAP_DATA.address.city}, {NAP_DATA.address.province} {NAP_DATA.address.postalCode}
            </p>
          </div>

          <div className="location-content bg-white p-8 rounded-lg shadow-sm">
            <h3 className="text-2xl font-bold mb-4 text-emerald-900">Opening Hours</h3>
            <p className="text-gray-700">
              Monday - Friday: {NAP_DATA.hours.weekday}<br />
              Saturday: {NAP_DATA.hours.saturday}<br />
              Sunday: {NAP_DATA.hours.sunday}
            </p>
          </div>

          <div className="location-content bg-white p-8 rounded-lg shadow-sm">
            <h3 className="text-2xl font-bold mb-4 text-emerald-900">Contact Us</h3>
            <p className="text-gray-700">
              Phone: <a href={`tel:${NAP_DATA.phone.primary.replace(/[^0-9]/g, '')}`} className="text-emerald-700 hover:underline">{NAP_DATA.phone.primary}</a><br />
              Email: <a href={`mailto:${NAP_DATA.email}`} className="text-emerald-700 hover:underline">{NAP_DATA.email}</a>
            </p>
          </div>
        </div>

        <div className="location-content rounded-lg overflow-hidden shadow-lg">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2881.8747524845734!2d-79.76273242346447!3d43.684567571098395!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x882b3fb5d5d5d5d5%3A0x5d5d5d5d5d5d5d5d!2s157%20Queen%20St%20E%2C%20Brampton%2C%20ON%20L6W%203X4!5e0!3m2!1sen!2sca!4v1234567890123!5m2!1sen!2sca"
            width="100%"
            height="450"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Queen Lynch Pharmacy Location"
          />
        </div>
      </div>
    </section>
  );
}

export function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const mailtoLink = `mailto:${NAP_DATA.email}?subject=Contact from ${formData.name}&body=${encodeURIComponent(
      `Name: ${formData.name}\nEmail: ${formData.email}\nPhone: ${formData.phone}\n\nMessage:\n${formData.message}`
    )}`;
    window.location.href = mailtoLink;
  };

  return (
    <section className="py-20 bg-white">
      <div className="container-custom max-w-4xl">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-4">
          How Can We Help?
        </h2>
        <p className="text-xl text-center text-gray-600 mb-12">Need Some Help?</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 text-center">
          <div className="p-6">
            <div className="text-4xl mb-2">📞</div>
            <h3 className="font-semibold mb-2">Call us Today</h3>
            <a href={`tel:${NAP_DATA.phone.primary.replace(/[^0-9]/g, '')}`} className="text-emerald-700 hover:underline">
              {NAP_DATA.phone.primary}
            </a>
          </div>
          <div className="p-6">
            <div className="text-4xl mb-2">✉️</div>
            <h3 className="font-semibold mb-2">Send Us an Email</h3>
            <a href={`mailto:${NAP_DATA.email}`} className="text-emerald-700 hover:underline">
              {NAP_DATA.email}
            </a>
          </div>
          <div className="p-6">
            <div className="text-4xl mb-2">📍</div>
            <h3 className="font-semibold mb-2">Visit Us</h3>
            <p className="text-gray-700">Brampton</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="bg-gray-50 p-8 rounded-lg">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                What is your Name?
              </label>
              <input
                type="text"
                id="name"
                required
                placeholder="Your Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-600 focus:border-transparent outline-none"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                What is your Email?
              </label>
              <input
                type="email"
                id="email"
                required
                placeholder="email@youremail.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-600 focus:border-transparent outline-none"
              />
            </div>
          </div>
          <div className="mb-6">
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
              What is your Phone Number?
            </label>
            <input
              type="tel"
              id="phone"
              placeholder="(123) 456-7890"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-600 focus:border-transparent outline-none"
            />
          </div>
          <div className="mb-6">
            <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
              Do you have any message for us?
            </label>
            <textarea
              id="message"
              rows={5}
              required
              placeholder="Let us know how we can help..."
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-600 focus:border-transparent outline-none resize-none"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-emerald-700 hover:bg-emerald-800 text-white px-8 py-4 rounded-lg font-semibold transition-colors"
          >
            Send Message
          </button>
        </form>
      </div>
    </section>
  );
}
