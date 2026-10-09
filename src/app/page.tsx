import Link from "next/link";
import { historicoLatencia, listarServidores } from "@/lib/data";
import { resumo } from "@/lib/filter";
import { Card, StatCard } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import { LatencyChart } from "@/components/latency-chart";
import { ServerTable } from "@/components/server-table";

// Dados mudam a cada checagem; desativa o cache estático do Next
export const dynamic = "force-dynamic";

export default async function PainelPage() {
  const [servidores, historico] = await Promise.all([
    listarServidores(),
    historicoLatencia(),
  ]);
  const r = resumo(servidores);

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Painel de monitoramento</h1>
          <p className="text-sm text-muted">Visão geral dos {r.total} ativos monitorados</p>
        </div>
        <Link href="/servidores/novo" className={buttonVariants()}>
          + Novo servidor
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard rotulo="Online" valor={`${r.online}/${r.total}`} />
        <StatCard rotulo="Offline" valor={r.offline} detalhe={r.offline > 0 ? "Requer atenção" : "Tudo respondendo"} />
        <StatCard rotulo="Em manutenção" valor={r.manutencao} />
        <StatCard
          rotulo="Latência média"
          valor={r.latenciaMedia !== null ? `${r.latenciaMedia} ms` : "—"}
          detalhe="Só servidores online"
        />
      </div>

      <Card>
        <h2 className="mb-1 font-semibold">Latência média — últimas 24h</h2>
        <p className="mb-4 text-sm text-muted">Média de todos os servidores, por hora</p>
        <LatencyChart dados={historico} />
      </Card>

      <section aria-labelledby="titulo-servidores" className="flex flex-col gap-4">
        <h2 id="titulo-servidores" className="font-semibold">Servidores</h2>
        <ServerTable inicial={servidores} />
      </section>
    </div>
  );
}
