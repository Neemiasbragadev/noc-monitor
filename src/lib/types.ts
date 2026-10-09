export type Status = "online" | "offline" | "manutencao";

export type TipoServidor = "http" | "ping" | "banco";

export interface Servidor {
  id: string;
  nome: string;
  tipo: TipoServidor;
  /** URL (http) ou host/IP (ping, banco) */
  alvo: string;
  status: Status;
  /** Latência atual em milissegundos; null quando offline */
  latenciaMs: number | null;
  /** Disponibilidade nas últimas 24h, de 0 a 100 */
  uptime: number;
  /** Intervalo de checagem em segundos */
  intervalo: number;
}

export interface PontoLatencia {
  hora: string;
  latenciaMs: number;
}

/** Só o que muda a cada checagem — é o que a rota /api/status devolve */
export type StatusAoVivo = Pick<Servidor, "id" | "status" | "latenciaMs">;
