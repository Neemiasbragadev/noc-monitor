import type { Metadata } from "next";
import { Card } from "@/components/ui/card";
import { ServerForm } from "@/components/server-form";

export const metadata: Metadata = { title: "Novo servidor · NOC Monitor" };

export default function NovoServidorPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold">Novo servidor</h1>
        <p className="text-sm text-muted">
          Os campos mudam conforme o tipo de checagem escolhido.
        </p>
      </div>
      <Card>
        <ServerForm />
      </Card>
    </div>
  );
}
