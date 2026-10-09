"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useDebounce } from "@/hooks/use-debounce";
import { filtrarServidores, type FiltroStatus } from "@/lib/filter";
import type { Servidor, StatusAoVivo } from "@/lib/types";
import { StatusBadge } from "@/components/ui/status-badge";
import { Select } from "@/components/ui/select";
import { Input } from "@/components/ui/field";
import { Button } from "@/components/ui/button";

const INTERVALO_MS = 20_000;

const tipoRotulo: Record<Servidor["tipo"], string> = {
  http: "HTTP",
  ping: "Ping",
  banco: "Banco",
};

export function ServerTable({ inicial }: { inicial: Servidor[] }) {
  const [servidores, setServidores] = useState(inicial);
  const [busca, setBusca] = useState("");
  const [status, setStatus] = useState<FiltroStatus>("todos");
  const [atualizadoEm, setAtualizadoEm] = useState<string | null>(null);
  const [verificando, setVerificando] = useState(false);
  const [alterados, setAlterados] = useState<Set<string>>(new Set());

  const buscaAtrasada = useDebounce(busca, 250);

  async function atualizar() {
    setVerificando(true);
    try {
      const res = await fetch("/api/status", { cache: "no-store" });
      if (!res.ok) return;
      const vivos: StatusAoVivo[] = await res.json();
      const porId = new Map(vivos.map((v) => [v.id, v]));
      const idsMudados = new Set<string>();
      setServidores((atual) =>
        atual.map((s) => {
          const novo = porId.get(s.id);
          if (!novo) return s;
          if (novo.status !== s.status || novo.latenciaMs !== s.latenciaMs) {
            idsMudados.add(s.id);
          }
          return { ...s, ...novo };
        }),
      );
      setAlterados(idsMudados);
      setAtualizadoEm(new Date().toLocaleTimeString("pt-BR"));
      // destaque temporário nas linhas alteradas, só pra chamar atenção
      setTimeout(() => setAlterados(new Set()), 1500);
    } catch {
      // rede caiu: mantém o último dado bom na tela
    } finally {
      setVerificando(false);
    }
  }

  // Em produção, trocaria por WebSocket/SSE pra o servidor empurrar a mudança
  useEffect(() => {
    const t = setInterval(atualizar, INTERVALO_MS);
    return () => clearInterval(t);
  }, []);

  const visiveis = useMemo(
    () => filtrarServidores(servidores, buscaAtrasada, status),
    [servidores, buscaAtrasada, status],
  );

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <Input
          type="search"
          placeholder="Buscar por nome ou endereço…"
          aria-label="Buscar servidor"
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          className="sm:max-w-xs"
        />
        <Select
          rotuloAcessivel="Filtrar por status"
          value={status}
          onValueChange={(v) => setStatus(v as FiltroStatus)}
          className="sm:w-44"
          opcoes={[
            { valor: "todos", rotulo: "Todos os status" },
            { valor: "online", rotulo: "Online" },
            { valor: "offline", rotulo: "Offline" },
            { valor: "manutencao", rotulo: "Manutenção" },
          ]}
        />
        <div className="flex items-center gap-3 sm:ml-auto">
          <p className="text-xs text-muted" aria-live="polite">
            {atualizadoEm ? `Atualizado às ${atualizadoEm}` : "Atualiza a cada 20s"}
          </p>
          <Button
            type="button"
            variante="secundario"
            tamanho="sm"
            onClick={atualizar}
            disabled={verificando}
          >
            {verificando ? "Verificando…" : "Verificar agora"}
          </Button>
        </div>
      </div>

      <div className="overflow-x-auto rounded-card border border-border">
        <table className="w-full sm:min-w-[640px] text-left text-sm">
          <caption className="sr-only">Servidores monitorados</caption>
          <thead className="bg-surface-2 text-xs uppercase tracking-wide text-muted">
            <tr>
              <th scope="col" className="px-4 py-3 font-medium">Servidor</th>
              <th scope="col" className="hidden px-4 py-3 font-medium sm:table-cell">Tipo</th>
              <th scope="col" className="px-4 py-3 font-medium">Status</th>
              <th scope="col" className="px-4 py-3 text-right font-medium">Latência</th>
              <th scope="col" className="hidden px-4 py-3 text-right font-medium sm:table-cell">Uptime 24h</th>
            </tr>
          </thead>
          <tbody>
            {visiveis.map((s) => (
              <tr
                key={s.id}
                className={`border-t border-border transition-colors duration-700 hover:bg-surface-2/60 ${
                  alterados.has(s.id) ? "bg-accent/15" : ""
                }`}
              >
                <td className="px-4 py-3">
                  <Link href={`/servidores/${s.id}`} className="font-medium hover:text-accent hover:underline">
                    {s.nome}
                  </Link>
                  <p className="max-w-[9rem] truncate font-mono text-xs text-muted sm:max-w-none" title={s.alvo}>{s.alvo}</p>
                </td>
                <td className="hidden px-4 py-3 text-muted sm:table-cell">{tipoRotulo[s.tipo]}</td>
                <td className="px-4 py-3">
                  <StatusBadge status={s.status} />
                </td>
                <td className="px-4 py-3 text-right font-mono tabular-nums">
                  {s.latenciaMs !== null ? `${s.latenciaMs} ms` : "—"}
                </td>
                <td className="hidden px-4 py-3 text-right font-mono tabular-nums sm:table-cell">
                  {s.uptime.toFixed(2)}%
                </td>
              </tr>
            ))}
            {visiveis.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-10 text-center text-muted">
                  Nenhum servidor encontrado com esse filtro.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
