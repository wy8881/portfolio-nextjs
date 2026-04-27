export default function MdxTable({ children }: React.HTMLAttributes<HTMLTableElement>) {
  return (
    <div className="my-8 overflow-x-auto rounded-[10px] border-[1.5px] border-artifact">
      <table className="mdx-table w-full border-collapse text-sm">{children}</table>
    </div>
  )
}
