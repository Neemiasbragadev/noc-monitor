"use client";

import * as RSelect from "@radix-ui/react-select";
import { cn } from "@/lib/utils";

export function Select({
  id,
  value,
  onValueChange,
  opcoes,
  placeholder,
  invalido,
  rotuloAcessivel,
  className,
}: {
  id?: string;
  value?: string;
  onValueChange: (v: string) => void;
  opcoes: { valor: string; rotulo: string }[];
  placeholder?: string;
  invalido?: boolean;
  rotuloAcessivel?: string;
  className?: string;
}) {
  return (
    <RSelect.Root value={value} onValueChange={onValueChange}>
      <RSelect.Trigger
        id={id}
        aria-label={rotuloAcessivel}
        aria-invalid={invalido || undefined}
        className={cn(
          "inline-flex h-10 w-full items-center justify-between gap-2 rounded-lg border border-border bg-surface-2 px-3 text-sm text-text aria-invalid:border-down data-[placeholder]:text-muted",
          className,
        )}
      >
        <RSelect.Value placeholder={placeholder} />
        <RSelect.Icon aria-hidden className="text-muted">
          ▾
        </RSelect.Icon>
      </RSelect.Trigger>
      <RSelect.Portal>
        <RSelect.Content
          position="popper"
          sideOffset={4}
          className="z-50 min-w-[var(--radix-select-trigger-width)] overflow-hidden rounded-lg border border-border bg-surface-2 p-1 shadow-xl"
        >
          <RSelect.Viewport>
            {opcoes.map((o) => (
              <RSelect.Item
                key={o.valor}
                value={o.valor}
                className="flex cursor-pointer select-none items-center rounded-md px-3 py-2 text-sm text-text outline-none data-[highlighted]:bg-accent-strong data-[state=checked]:font-semibold"
              >
                <RSelect.ItemText>{o.rotulo}</RSelect.ItemText>
              </RSelect.Item>
            ))}
          </RSelect.Viewport>
        </RSelect.Content>
      </RSelect.Portal>
    </RSelect.Root>
  );
}
