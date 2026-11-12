import * as React from "react"

import { cn } from "@/lib/utils"

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "min-h-36 w-full rounded-md border border-input bg-white px-4 py-3 text-base transition-[border-color,box-shadow] outline-none placeholder:text-muted-foreground/70 focus-visible:border-navy focus-visible:ring-4 focus-visible:ring-ring/25",
        className,
      )}
      {...props}
    />
  )
}

export { Textarea }
