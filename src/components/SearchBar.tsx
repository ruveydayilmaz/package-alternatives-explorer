import { useNavigate } from 'react-router-dom'
import { useEffect, useRef, useState } from 'react'

interface Props {
  initialValue?: string
  autoFocus?: boolean
}

export default function SearchBar({ initialValue = '', autoFocus = false }: Props) {
  const [q, setQ] = useState(initialValue)
  const nav = useNavigate()
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (autoFocus) inputRef.current?.focus()
  }, [autoFocus])

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        if (q.trim()) nav(`/results?q=${encodeURIComponent(q.trim())}`)
      }}
      className="flex w-full max-w-2xl gap-2"
    >
      <input
        ref={inputRef}
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="e.g. react, date library, query builder"
        className="flex-1 rounded border px-4 py-2 outline-none border-gray-200 focus:ring-2 focus:ring-black"
      />
      <button
        type="submit"
        className="rounded px-4 py-2 bg-black text-white hover:bg-gray-900"
      >
        Search
      </button>
    </form>
  )
}
