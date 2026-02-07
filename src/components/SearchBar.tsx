import { useCallback, useState } from 'react'
import { Search, X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface SearchBarProps {
  value: string
  onChange: (value: string) => void
  onSubmit: (value: string) => void
  placeholder?: string
}

export function SearchBar({
  value,
  onChange,
  onSubmit,
  placeholder = 'Search images...',
}: SearchBarProps) {
  const [inputValue, setInputValue] = useState(value)

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault()
      onSubmit(inputValue)
    },
    [inputValue, onSubmit],
  )

  const handleClear = useCallback(() => {
    setInputValue('')
    onChange('')
    onSubmit('')
  }, [onChange, onSubmit])

  return (
    <form onSubmit={handleSubmit} className="relative w-full max-w-md">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder={placeholder}
        className={cn(
          'w-full h-12 pl-10 pr-10 rounded-xl',
          'bg-secondary border border-border-default',
          'text-text-primary placeholder-text-muted',
          'focus:outline-none focus:border-accent-primary focus:ring-1 focus:ring-accent-primary',
          'transition-colors duration-200',
        )}
      />
      {inputValue && (
        <button
          type="button"
          onClick={handleClear}
          className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-text-muted hover:text-text-primary transition-colors"
          aria-label="Clear search"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </form>
  )
}
