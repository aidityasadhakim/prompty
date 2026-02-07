import { Link } from '@tanstack/react-router'
import { Github, Twitter } from 'lucide-react'
import { cn } from '@/lib/utils'

export default function Footer() {
  return (
    <footer
      className={cn('border-t border-border-default', 'bg-background-primary')}
    >
      <div className={cn('container mx-auto px-4 py-8')}>
        <div
          className={cn(
            'flex flex-col md:flex-row',
            'items-center justify-between gap-4',
          )}
        >
          <div
            className={cn(
              'flex items-center gap-2',
              'text-text-secondary text-sm',
            )}
          >
            <span>© 2026 Prompty</span>
            <span>•</span>
            <span>AI Image Prompt Gallery</span>
          </div>

          <nav className={cn('flex items-center gap-6')}>
            <Link
              to="/gallery"
              className={cn(
                'text-text-secondary text-sm',
                'hover:text-text-primary transition-colors',
              )}
            >
              Gallery
            </Link>
            <Link
              to="/trending"
              className={cn(
                'text-text-secondary text-sm',
                'hover:text-text-primary transition-colors',
              )}
            >
              Trending
            </Link>
            <a
              href="#"
              className={cn(
                'text-text-secondary text-sm',
                'hover:text-text-primary transition-colors',
              )}
            >
              About
            </a>
          </nav>

          <div className={cn('flex items-center gap-4')}>
            <a
              href="#"
              className={cn(
                'text-text-secondary hover:text-text-primary',
                'transition-colors',
              )}
              aria-label="GitHub"
            >
              <Github className="w-5 h-5" />
            </a>
            <a
              href="#"
              className={cn(
                'text-text-secondary hover:text-text-primary',
                'transition-colors',
              )}
              aria-label="Twitter"
            >
              <Twitter className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
