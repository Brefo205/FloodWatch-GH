import { cn } from '@/lib/utils'
import { SEVERITY_META, type Severity } from '@/lib/data'

export function SeverityDot({ severity }: { severity: Severity }) {
  const meta = SEVERITY_META[severity]
  return (
    <span
      className="inline-block size-2.5 rounded-full"
      style={{ backgroundColor: meta.color }}
      aria-hidden
    />
  )
}

export function SeverityBadge({
  severity,
  size = 'sm',
}: {
  severity: Severity
  size?: 'sm' | 'lg'
}) {
  const meta = SEVERITY_META[severity]
  return (
    <span
      className={cn(
        'inline-flex items-center gap-2 rounded-full font-semibold',
        size === 'sm' ? 'px-2.5 py-1 text-xs' : 'px-4 py-1.5 text-sm',
      )}
      style={{
        backgroundColor: meta.bg,
        color: meta.color,
        boxShadow: `inset 0 0 0 1px ${meta.ring}`,
      }}
    >
      <span
        className="inline-block size-2 rounded-full"
        style={{ backgroundColor: meta.color }}
        aria-hidden
      />
      {meta.label}
    </span>
  )
}
