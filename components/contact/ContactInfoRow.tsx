import { Body } from '@/components/ui/Typography'

interface ContactInfoRowProps {
  icon: string    // Bootstrap Icon class e.g. "bi-envelope"
  text: string    // Display value e.g. "wy7382@gmail.com"
  label: string   // sr-only prefix e.g. "Email" — screen readers announce "Email: wy7382@gmail.com"
  href?: string   // Optional — mailto: for email, tel: for phone, omit for location
}

const ContactInfoRow = ({ icon, text, label, href }: ContactInfoRowProps) => {
  const content = (
    <>
      <span className="sr-only">{label}: </span>
      <Body as="span">{text}</Body>
    </>
  )

  return (
    <div className="flex items-center gap-2.5">
      <i className={`bi ${icon} text-accent text-sm`} aria-hidden="true" />
      {href ? (
        <a href={href} className="hover:underline underline-offset-2 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-1 rounded-sm">
          {content}
        </a>
      ) : (
        <>{content}</>
      )}
    </div>
  )
}

export default ContactInfoRow
