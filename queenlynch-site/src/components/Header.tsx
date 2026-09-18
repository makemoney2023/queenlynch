'use client';

import Link from 'next/link';
import Image from 'next/image';
import { NAP_DATA } from '@/lib/constants';
import { useState } from 'react';

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      <div className="bg-emerald-800 text-white py-2 text-sm">
        <div className="container-custom flex flex-wrap justify-center md:justify-between items-center gap-2">
          <div className="flex flex-wrap justify-center gap-4">
            <a href={`tel:${NAP_DATA.phone.primary.replace(/[^0-9]/g, '')}`} className="hover:underline">
              📞 {NAP_DATA.phone.primary}
            </a>
            <a href={`mailto:${NAP_DATA.email}`} className="hover:underline">
              ✉️ {NAP_DATA.email}
            </a>
          </div>
          <div className="hidden md:block">
            {NAP_DATA.hours.display}
          </div>
        </div>
      </div>

      <header className="bg-white shadow-sm sticky top-0 z-50">
        <nav className="container-custom py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <Image
                src="/media/brand/DRpQ8qHl.svg"
                alt={NAP_DATA.name}
                width={180}
                height={60}
                priority
                className="h-12 w-auto"
              />
            </Link>

            <button
              className="md:hidden p-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>

            <div className="hidden md:flex items-center gap-8">
              <Link href="/" className="text-gray-700 hover:text-emerald-700 font-medium">
                Home
              </Link>
              <Link href="/blog" className="text-gray-700 hover:text-emerald-700 font-medium">
                Blog
              </Link>
              <a
                href="https://www.healthsnap.ca"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-emerald-700 text-white px-6 py-2 rounded-full hover:bg-emerald-800 font-medium"
              >
                Order OTC
              </a>
            </div>
          </div>

          {mobileMenuOpen && (
            <div className="md:hidden mt-4 py-4 border-t">
              <div className="flex flex-col gap-4">
                <Link href="/" className="text-gray-700 hover:text-emerald-700 font-medium" onClick={() => setMobileMenuOpen(false)}>
                  Home
                </Link>
                <Link href="/blog" className="text-gray-700 hover:text-emerald-700 font-medium" onClick={() => setMobileMenuOpen(false)}>
                  Blog
                </Link>
                <a
                  href="https://www.healthsnap.ca"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-emerald-700 text-white px-6 py-2 rounded-full hover:bg-emerald-800 font-medium text-center"
                >
                  Order OTC
                </a>
              </div>
            </div>
          )}
        </nav>
      </header>
    </>
  );
}
