export default function MdxBlockquote({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <blockquote
      className="border-l-2 border-accent italic mt-5 mb-5 pl-4 rounded-r-sm"
      style={{
        background: "color-mix(in srgb, var(--color-accent) 7%, transparent)",
      }}
    >
      <div className="py-2 text-secondary">
        <div className="text-xl text-accent opacity-40 not-italic font-serif leading-none select-none mb-1" aria-hidden="true">"</div>
        {children}
        <div className="text-xl text-accent opacity-40 not-italic font-serif leading-none select-none mt-1 text-right" aria-hidden="true">"</div>
      </div>
    </blockquote>
  );
}
