import * as React from "react"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "h-12 w-full min-w-0 rounded-md border border-input bg-white px-4 text-base transition-[border-color,box-shadow] outline-none placeholder:text-muted-foreground/70 focus-visible:border-navy focus-visible:ring-4 focus-visible:ring-ring/25 aria-invalid:border-destructive",
        className,
      )}
      {...props}
    />
  )
}

export { Input }
