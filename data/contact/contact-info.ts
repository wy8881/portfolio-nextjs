import { ContactInfo } from '@/types/contact'

export const contactInfo: ContactInfo = {
  title: "Let's Work Together",
  subtitle: "Get in touch",
  description: "I'm currently looking for full-stack development and data analytics opportunities in Adelaide. Feel free to reach out!",
  email: "wy7382@gmail.com",
  phone: "0411 558 880",
  location: "Adelaide, SA",
  socialLinks: [
    {
      href: 'https://github.com/wy8881',
      icon: 'bi-github',
      label: 'GitHub',
      ariaLabel: 'Visit my GitHub Profile'
    },
    {
      href: 'https://linkedin.com/in/yi-wang-meow99',
      icon: 'bi-linkedin',
      label: 'LinkedIn',
      ariaLabel: 'Visit my LinkedIn Profile'
    }
  ],
  image: {
    src: "/images/contact/dog.jpg",
    alt: "Yi Wang's dog"
  }
}

