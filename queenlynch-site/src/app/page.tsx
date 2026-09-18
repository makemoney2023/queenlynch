import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Hero, MinorAilmentsList } from '@/components/Hero';
import { WhyUs, CoreServices, SpecializedServices } from '@/components/Services';
import { LocationContact, ContactForm } from '@/components/Contact';

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <MinorAilmentsList />
        <WhyUs />
        <CoreServices />
        <SpecializedServices />
        <LocationContact />
        <ContactForm />
      </main>
      <Footer />
    </>
  );
}
