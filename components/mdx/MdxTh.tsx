export default function MdxTh({ children }: React.ThHTMLAttributes<HTMLTableCellElement>) {
  return (
    <th
      className="px-4 py-[0.65rem] text-left text-[0.65rem] font-bold uppercase tracking-[0.1em] text-accent"
      style={{ background: 'color-mix(in srgb, var(--color-accent) 10%, transparent)' }}
    >
      {children}
    </th>
  )
}
