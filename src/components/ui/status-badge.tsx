import { cn } from "@/lib/utils";
import type { Status } from "@/lib/types";

const rotulos: Record<Status, string> = {
  online: "Online",
  offline: "Offline",
  manutencao: "Em manutenção",
};

const cores: Record<Status, string> = {
  online: "bg-ok/15 text-ok",
  offline: "bg-down/15 text-down",
  manutencao: "bg-maint/15 text-maint",
};

export function StatusBadge({ status }: { status: Status }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium",
        cores[status],
      )}
    >
      <span className={cn("size-1.5 rounded-full", cores[status].split(" ")[1].replace("text-", "bg-"))} aria-hidden />
      {rotulos[status]}
    </span>
  );
}
