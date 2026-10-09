import Link from "next/link";
import { notFound } from "next/navigation";
import { buscarServidor, historicoLatencia } from "@/lib/data";
import { Card, StatCard } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/status-badge";
import { LatencyChart } from "@/components/latency-chart";

export const dynamic = "force-dynamic";

export default async function DetalheServidor({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const servidor = await buscarServidor(id);
  if (!servidor) notFound();

  const historico = await historicoLatencia(id);

  return (
    <div className="flex flex-col gap-8">
      <div>
        <Link href="/" className="text-sm text-muted hover:text-text">
          ← Voltar ao painel
        </Link>
        <div className="mt-3 flex flex-wrap items-center gap-3">
          <h1 className="text-2xl font-semibold">{servidor.nome}</h1>
          <StatusBadge status={servidor.status} />
        </div>
        <p className="mt-1 font-mono text-sm text-muted">{servidor.alvo}</p>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard rotulo="Latência atual" valor={servidor.latenciaMs !== null ? `${servidor.latenciaMs} ms` : "—"} />
        <StatCard rotulo="Uptime 24h" valor={`${servidor.uptime.toFixed(2)}%`} />
        <StatCard rotulo="Tipo" valor={servidor.tipo.toUpperCase()} />
        <StatCard rotulo="Checagem" valor={`${servidor.intervalo}s`} detalhe="Intervalo entre testes" />
      </div>

      <Card>
        <h2 className="mb-1 font-semibold">Latência — últimas 24h</h2>
        <p className="mb-4 text-sm text-muted">Média por hora</p>
        <LatencyChart dados={historico} />
      </Card>
    </div>
  );
}
