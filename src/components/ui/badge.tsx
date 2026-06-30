import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib"

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-[#2563EB]/20 text-[#60A5FA]",
        secondary:
          "border-transparent bg-[#1E293B] text-[#94A3B8]",
        success:
          "border-transparent bg-[#16A34A]/20 text-[#4ADE80]",
        destructive:
          "border-transparent bg-[#DC2626]/20 text-[#F87171]",
        warning:
          "border-transparent bg-[#D97706]/20 text-[#FBBF24]",
        purple:
          "border-transparent bg-[#7C3AED]/20 text-[#A78BFA]",
        outline: "text-[var(--color-text-secondary)] border border-[var(--color-border)]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
