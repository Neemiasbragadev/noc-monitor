import type { Servidor, Status } from "./types";

export type FiltroStatus = Status | "todos";

export function filtrarServidores(
  lista: Servidor[],
  busca: string,
  status: FiltroStatus,
): Servidor[] {
  const termo = busca.trim().toLowerCase();
  return lista.filter((s) => {
    const casaStatus = status === "todos" || s.status === status;
    const casaBusca =
      termo === "" ||
      s.nome.toLowerCase().includes(termo) ||
      s.alvo.toLowerCase().includes(termo);
    return casaStatus && casaBusca;
  });
}

export function resumo(lista: Servidor[]) {
  const online = lista.filter((s) => s.status === "online");
  const latencias = online
    .map((s) => s.latenciaMs)
    .filter((n): n is number => n !== null);
  const media =
    latencias.length > 0
      ? Math.round(latencias.reduce((a, b) => a + b, 0) / latencias.length)
      : null;
  return {
    total: lista.length,
    online: online.length,
    offline: lista.filter((s) => s.status === "offline").length,
    manutencao: lista.filter((s) => s.status === "manutencao").length,
    latenciaMedia: media,
  };
}
