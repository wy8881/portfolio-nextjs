export interface SocialLink {
  href: string;
  icon: string;
  label: string;
  ariaLabel: string;
}

export interface ContactInfo {
  title: string;
  subtitle: string;
  description: string;
  email: string;
  phone: string;
  location: string;
  socialLinks: SocialLink[];
  image: {
    src: string;
    alt: string;
  };
}

