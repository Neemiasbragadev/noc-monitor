import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

export const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-colors disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variante: {
        primario: "bg-accent-strong text-white hover:bg-accent",
        secundario: "border border-border bg-surface-2 text-text hover:bg-border",
        fantasma: "text-muted hover:bg-surface-2 hover:text-text",
      },
      tamanho: {
        sm: "h-8 px-3 text-sm",
        md: "h-10 px-4 text-sm",
      },
    },
    defaultVariants: { variante: "primario", tamanho: "md" },
  },
);

type ButtonProps = React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants>;

export function Button({ className, variante, tamanho, ...props }: ButtonProps) {
  return (
    <button
      className={cn(buttonVariants({ variante, tamanho }), className)}
      {...props}
    />
  );
}
