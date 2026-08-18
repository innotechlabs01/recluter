import Link from 'next/link'

export function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2">
      <span className="text-xl font-bold text-slate-900">Recluter</span>
      <span className="w-2 h-2 rounded-full bg-blue-600" />
    </Link>
  )
}
