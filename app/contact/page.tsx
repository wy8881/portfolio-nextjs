import type { Metadata } from 'next';
import ContactIntro from '@/components/contact/ContactIntro';

export const metadata: Metadata = {
  title: 'Contact - Yi Wang',
  description: 'Get in touch with Yi Wang for full-stack development and data analytics opportunities in Adelaide.',
};

export default function ContactPage() {
  return (
    <section aria-label="Contact section">
        <ContactIntro />
    </section>
  );
}

