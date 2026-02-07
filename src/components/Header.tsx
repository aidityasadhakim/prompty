import { Link, useLocation } from '@tanstack/react-router'
import { useState } from 'react'
import { Home, Lock, Menu, TrendingUp, Upload, X } from 'lucide-react'
import { cn } from '@/lib/utils'

export default function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const location = useLocation()

  const navItems = [
    { to: '/', label: 'Explore', icon: Home },
    // Gallery link removed
    { to: '/trending', label: 'Trending', icon: TrendingUp },
    { to: '/upload', label: 'Upload', icon: Upload },
    { to: '/admin', label: 'Admin', icon: Lock },
  ]

  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/'
    }
    return location.pathname.startsWith(path)
  }

  return (
    <>
      <header
        className={cn(
          'fixed top-0 left-0 right-0 z-50 h-16',
          'bg-background/80 backdrop-blur-md', // Using generic background variable which maps to primary
          'border-b border-border',
          'transition-all duration-300',
        )}
      >
        <div
          className={cn(
            'h-full container mx-auto px-4',
            'flex items-center justify-between',
          )}
        >
          <Link
            to="/"
            viewTransition
            className={cn(
              'text-xl font-semibold text-foreground',
              'hover:text-accent-primary transition-colors',
            )}
          >
            Prompty
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  'flex items-center gap-2 px-4 py-2 rounded-lg',
                  'text-sm font-medium transition-colors',
                  isActive(item.to)
                    ? 'bg-accent-primary/10 text-accent-primary'
                    : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50',
                )}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </Link>
            ))}
          </nav>

          <button
            onClick={() => setIsOpen(true)}
            className={cn(
              'md:hidden p-2 rounded-lg',
              'text-muted-foreground hover:text-foreground',
              'hover:bg-secondary/50 transition-colors',
            )}
            aria-label="Open menu"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </header>

      <aside
        className={cn(
          'fixed top-0 right-0 h-full w-72 z-50',
          'bg-background border-l border-border',
          'transform transition-transform duration-300',
          isOpen ? 'translate-x-0' : 'translate-x-full',
        )}
      >
        <div
          className={cn(
            'flex items-center justify-between p-4',
            'border-b border-border',
          )}
        >
          <span className="text-lg font-semibold text-foreground">Menu</span>
          <button
            onClick={() => setIsOpen(false)}
            className={cn(
              'p-2 rounded-lg',
              'text-muted-foreground hover:text-foreground',
              'hover:bg-secondary/50 transition-colors',
            )}
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="p-4">
          <div className="space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setIsOpen(false)}
                className={cn(
                  'flex items-center gap-3 px-4 py-3 rounded-lg',
                  'text-sm font-medium transition-colors',
                  isActive(item.to)
                    ? 'bg-accent-primary/10 text-accent-primary'
                    : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50',
                )}
              >
                <item.icon className="w-5 h-5" />
                {item.label}
              </Link>
            ))}
          </div>
        </nav>
      </aside>

      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  )
}
