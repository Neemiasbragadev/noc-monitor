"use client";

import * as Label from "@radix-ui/react-label";
import { cn } from "@/lib/utils";

export function Field({
  id,
  rotulo,
  erro,
  ajuda,
  children,
}: {
  id: string;
  rotulo: string;
  erro?: string;
  ajuda?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label.Root htmlFor={id} className="text-sm font-medium">
        {rotulo}
      </Label.Root>
      {children}
      {ajuda && !erro && (
        <p id={`${id}-ajuda`} className="text-xs text-muted">
          {ajuda}
        </p>
      )}
      {erro && (
        <p id={`${id}-erro`} role="alert" className="text-xs text-down">
          {erro}
        </p>
      )}
    </div>
  );
}

export const inputClass =
  "h-10 w-full rounded-lg border border-border bg-surface-2 px-3 text-sm text-text placeholder:text-muted/70 aria-invalid:border-down";

export function Input({ className, ...props }: React.ComponentProps<"input">) {
  return <input className={cn(inputClass, className)} {...props} />;
}
