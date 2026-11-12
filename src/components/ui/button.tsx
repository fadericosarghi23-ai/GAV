import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "group/btn relative inline-flex shrink-0 items-center justify-center gap-2 overflow-hidden whitespace-nowrap font-display text-[13px] font-semibold uppercase tracking-[0.14em] transition-[color,background-color,box-shadow,transform] duration-300 outline-none disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 active:scale-[0.98]",
  {
    variants: {
      variant: {
        default:
          "bg-secondary text-secondary-foreground hover:bg-navy hover:text-white shadow-[0_10px_30px_-12px_rgba(255,161,0,.7)]",
        navy: "bg-primary text-primary-foreground hover:bg-secondary hover:text-secondary-foreground",
        outline: "border border-current bg-transparent hover:bg-navy hover:text-white hover:border-navy",
        ghost: "hover:bg-muted",
        link: "px-0 underline-offset-4 hover:underline",
      },
      size: {
        default: "h-12 px-6 rounded-md",
        sm: "h-10 px-4 rounded-md text-[12px]",
        lg: "h-14 px-8 rounded-md",
        icon: "size-11 rounded-md",
      },
    },
    defaultVariants: { variant: "default", size: "default" },
  },
)

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> & VariantProps<typeof buttonVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "button"
  return <Comp data-slot="button" className={cn(buttonVariants({ variant, size, className }))} {...props} />
}

export { Button, buttonVariants }
