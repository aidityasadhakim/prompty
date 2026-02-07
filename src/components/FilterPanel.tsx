import { cn } from '@/lib/utils'
import { ASPECT_RATIOS, STYLE_TAGS } from '@/lib/schema'
import type { AspectRatio, StyleTag } from '@/lib/schema'

interface FilterPanelProps {
  selectedAspectRatio: AspectRatio | null
  selectedStyle: StyleTag | null
  onAspectRatioChange: (ratio: AspectRatio | null) => void
  onStyleChange: (style: StyleTag | null) => void
  className?: string
}

export function FilterPanel({
  selectedAspectRatio,
  selectedStyle,
  onAspectRatioChange,
  onStyleChange,
  className,
}: FilterPanelProps) {
  return (
    <div className={cn('space-y-6', className)}>
      <div>
        <h3 className="text-sm font-medium text-text-secondary mb-3">
          Aspect Ratio
        </h3>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => onAspectRatioChange(null)}
            className={cn(
              'px-3 py-1.5 text-sm rounded-lg transition-colors',
              !selectedAspectRatio
                ? 'bg-accent-primary text-white'
                : 'bg-secondary text-text-secondary hover:bg-secondary/80',
            )}
          >
            All
          </button>
          {ASPECT_RATIOS.map((ratio) => (
            <button
              key={ratio}
              onClick={() => onAspectRatioChange(ratio)}
              className={cn(
                'px-3 py-1.5 text-sm rounded-lg transition-colors',
                selectedAspectRatio === ratio
                  ? 'bg-accent-primary text-white'
                  : 'bg-secondary text-text-secondary hover:bg-secondary/80',
              )}
            >
              {ratio}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-sm font-medium text-text-secondary mb-3">Style</h3>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => onStyleChange(null)}
            className={cn(
              'px-3 py-1.5 text-sm rounded-lg transition-colors',
              !selectedStyle
                ? 'bg-accent-primary text-white'
                : 'bg-secondary text-text-secondary hover:bg-secondary/80',
            )}
          >
            All
          </button>
          {STYLE_TAGS.map((style) => (
            <button
              key={style}
              onClick={() => onStyleChange(style)}
              className={cn(
                'px-3 py-1.5 text-sm rounded-lg transition-colors',
                selectedStyle === style
                  ? 'bg-accent-primary text-white'
                  : 'bg-secondary text-text-secondary hover:bg-secondary/80',
              )}
            >
              {style}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
