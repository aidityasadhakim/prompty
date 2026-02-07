import type { AspectRatio, StyleTag } from '@/lib/schema'
import { cn } from '@/lib/utils'
import { ASPECT_RATIOS, STYLE_TAGS } from '@/lib/schema'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

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
    <div className={cn('flex gap-4 items-center', className)}>
      <div className="flex items-center gap-2">
        <label
          htmlFor="aspect-ratio-select"
          className="text-sm font-medium text-text-secondary whitespace-nowrap"
        >
          Aspect Ratio:
        </label>
        <Select
          value={selectedAspectRatio ?? 'all'}
          onValueChange={(value) =>
            onAspectRatioChange(value === 'all' ? null : (value as AspectRatio))
          }
        >
          <SelectTrigger id="aspect-ratio-select" className="w-[180px]">
            <SelectValue placeholder="Select aspect ratio" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            {ASPECT_RATIOS.map((ratio) => (
              <SelectItem key={ratio} value={ratio}>
                {ratio}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center gap-2">
        <label
          htmlFor="style-select"
          className="text-sm font-medium text-text-secondary whitespace-nowrap"
        >
          Style:
        </label>
        <Select
          value={selectedStyle ?? 'all'}
          onValueChange={(value) =>
            onStyleChange(value === 'all' ? null : (value as StyleTag))
          }
        >
          <SelectTrigger id="style-select" className="w-[180px]">
            <SelectValue placeholder="Select style" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            {STYLE_TAGS.map((style) => (
              <SelectItem key={style} value={style}>
                {style}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
