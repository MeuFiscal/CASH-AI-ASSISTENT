import { cn } from "@/lib"

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-[#F1F5F9]", className)}
      {...props}
    />
  )
}

export { Skeleton }
