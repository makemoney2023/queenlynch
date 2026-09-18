import Link from 'next/link';
import { NAP_DATA } from '@/lib/constants';

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container-custom py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <h3 className="text-xl font-semibold mb-4">Our Location</h3>
            <p className="text-gray-300">
              {NAP_DATA.address.street}<br />
              {NAP_DATA.address.city}, {NAP_DATA.address.province} {NAP_DATA.address.postalCode}
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-4">Opening Hours</h3>
            <p className="text-gray-300">
              Monday - Friday: {NAP_DATA.hours.weekday}<br />
              Saturday: {NAP_DATA.hours.saturday}<br />
              Sunday: {NAP_DATA.hours.sunday}
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-4">Contact Us</h3>
            <p className="text-gray-300">
              Phone: <a href={`tel:${NAP_DATA.phone.primary.replace(/[^0-9]/g, '')}`} className="hover:text-emerald-400">{NAP_DATA.phone.primary}</a><br />
              Email: <a href={`mailto:${NAP_DATA.email}`} className="hover:text-emerald-400">{NAP_DATA.email}</a>
            </p>
          </div>
        </div>

        <div className="border-t border-gray-700 pt-8 text-center">
          <p className="text-gray-400 mb-4">
            Call our partner Medicus Alliance — {NAP_DATA.phone.secondary}
          </p>
          <p className="text-gray-400">
            © {new Date().getFullYear()} {NAP_DATA.name}. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
