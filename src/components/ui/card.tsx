import { cn } from "@/lib/utils";

export function Card({ className, ...props }: React.ComponentProps<"section">) {
  return (
    <section
      className={cn("rounded-card border border-border bg-surface p-5", className)}
      {...props}
    />
  );
}

export function StatCard({
  rotulo,
  valor,
  detalhe,
}: {
  rotulo: string;
  valor: string | number;
  detalhe?: string;
}) {
  return (
    <Card className="flex flex-col gap-1">
      <p className="text-sm text-muted">{rotulo}</p>
      <p className="font-mono text-3xl font-semibold tabular-nums">{valor}</p>
      {detalhe && <p className="text-xs text-muted">{detalhe}</p>}
    </Card>
  );
}
