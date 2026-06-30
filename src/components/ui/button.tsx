import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-[20px] text-sm font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-95",
  {
    variants: {
      variant: {
        default: "bg-[var(--color-primary)] text-white shadow-[0_2px_10px_rgba(37,99,235,0.2)] hover:bg-[var(--color-primary-hover)] hover:shadow-[0_4px_14px_rgba(37,99,235,0.3)] hover:-translate-y-px",
        secondary: "bg-[#EFF6FF] text-[#1E3A8A] hover:bg-[#DBEAFE]",
        outline: "border border-[#E8EEF5] bg-white hover:bg-[#F8FAFC] hover:text-[var(--color-text)]",
        ghost: "hover:bg-[#F8FAFC] hover:text-[var(--color-text)]",
        link: "text-[var(--color-primary)] underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-6 py-2.5",
        sm: "h-8 rounded-[16px] px-4 text-xs",
        lg: "h-12 rounded-[24px] px-8 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
