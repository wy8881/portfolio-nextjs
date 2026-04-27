export default function MdxTd({ children }: React.TdHTMLAttributes<HTMLTableCellElement>) {
  return (
    <td className="px-4 py-[0.6rem] text-primary">{children}</td>
  )
}
