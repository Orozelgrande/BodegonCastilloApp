import * as React from "react"
import { cn } from "../../lib/utils"

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'outline';
  children?: React.ReactNode;
  className?: string;
}

function Badge({ className, variant = "default", ...props }: BadgeProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
        {
          'border-transparent bg-[var(--color-primary)] text-[var(--color-primary-foreground)]': variant === 'default',
          'border-transparent bg-[var(--color-success)] text-white': variant === 'success',
          'border-transparent bg-[var(--color-warning)] text-white': variant === 'warning',
          'border-transparent bg-[var(--color-destructive)] text-white': variant === 'danger',
          'text-[var(--color-text-primary)] border-[var(--color-border)]': variant === 'outline',
        },
        className
      )}
      {...props}
    />
  )
}

export { Badge }
