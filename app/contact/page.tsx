import type { Metadata } from 'next';
import ContactIntro from '@/components/contact/ContactIntro';

export const metadata: Metadata = {
  title: 'Contact - Yi Wang',
  description: 'Get in touch with Yi Wang for full-stack development and data analytics opportunities in Adelaide.',
};

export default function ContactPage() {
  return (
    <section className="w-full flex items-center justify-center">
      <div
        className="
          max-w-[clamp(320px,90vw,1280px)]
          mx-auto
          px-[clamp(1.5rem,5vw,4rem)]
        "
      >
        <ContactIntro />
      </div>
    </section>
  );
}

