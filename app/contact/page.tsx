import type { Metadata } from 'next';
import ContactIntro from '@/components/contact/ContactIntro';
import Image from 'next/image';
export const metadata: Metadata = {
  title: 'Contact - Yi Wang',
  description: 'Get in touch with Yi Wang for full-stack development and data analytics opportunities in Adelaide.',
};

export default function ContactPage() {
  return (
    <section aria-label="Contact section" className='relative flex justify-center items-center px-6 md:px-12 lg:px-24 py-16 md:py-24 lg:py-32 overflow-hidden min-h-screen w-full'>
      <Image src="/images/contact/contact-cover.webp" alt="Contact cover image" fill className="absolute top-0 left-0 w-full h-full object-cover -z-10" priority/>

        <ContactIntro />
    </section>
  );
}

