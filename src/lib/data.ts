import type { PontoLatencia, Servidor, StatusAoVivo } from "./types";
import type { ServidorInput } from "./schema";

// "Banco" em memória pra demo (ficaria Postgres/Prisma num projeto real).
// Fica no globalThis pra sobreviver ao hot reload do dev.

const seed: Servidor[] = [
  { id: "1", nome: "api-gateway", tipo: "http", alvo: "https://api.exemplo.com.br/health", status: "online", latenciaMs: 84, uptime: 99.98, intervalo: 30 },
  { id: "2", nome: "portal-cliente", tipo: "http", alvo: "https://portal.exemplo.com.br", status: "online", latenciaMs: 132, uptime: 99.91, intervalo: 60 },
  { id: "3", nome: "db-principal", tipo: "banco", alvo: "10.0.1.10:5432", status: "online", latenciaMs: 6, uptime: 100, intervalo: 30 },
  { id: "4", nome: "db-replica", tipo: "banco", alvo: "10.0.1.11:5432", status: "manutencao", latenciaMs: null, uptime: 97.2, intervalo: 30 },
  { id: "5", nome: "fw-borda-01", tipo: "ping", alvo: "10.0.0.1", status: "online", latenciaMs: 2, uptime: 100, intervalo: 15 },
  { id: "6", nome: "fw-borda-02", tipo: "ping", alvo: "10.0.0.2", status: "online", latenciaMs: 3, uptime: 99.99, intervalo: 15 },
  { id: "7", nome: "switch-core", tipo: "ping", alvo: "10.0.0.5", status: "online", latenciaMs: 1, uptime: 100, intervalo: 15 },
  { id: "8", nome: "vpn-matriz", tipo: "ping", alvo: "vpn.exemplo.com.br", status: "offline", latenciaMs: null, uptime: 92.4, intervalo: 30 },
  { id: "9", nome: "cache-redis", tipo: "banco", alvo: "10.0.2.20:6379", status: "online", latenciaMs: 1, uptime: 99.95, intervalo: 30 },
  { id: "10", nome: "erp-web", tipo: "http", alvo: "https://erp.exemplo.com.br/login", status: "online", latenciaMs: 410, uptime: 98.7, intervalo: 60 },
  { id: "11", nome: "mongo-logs", tipo: "banco", alvo: "10.0.3.5:27017", status: "online", latenciaMs: 12, uptime: 99.6, intervalo: 60 },
  { id: "12", nome: "dns-interno", tipo: "ping", alvo: "10.0.0.53", status: "online", latenciaMs: 1, uptime: 100, intervalo: 15 },
];

const g = globalThis as unknown as { __servidores?: Servidor[] };
const db = (g.__servidores ??= structuredClone(seed));

const latenciaBase = new Map(db.map((s) => [s.id, s.latenciaMs ?? 50]));

export async function listarServidores(): Promise<Servidor[]> {
  return structuredClone(db);
}

export async function buscarServidor(id: string): Promise<Servidor | null> {
  const s = db.find((x) => x.id === id);
  return s ? structuredClone(s) : null;
}

export async function criarServidor(input: ServidorInput): Promise<Servidor> {
  const id = String(Math.max(0, ...db.map((s) => Number(s.id))) + 1);
  const alvo =
    input.tipo === "http"
      ? input.url
      : input.tipo === "banco"
        ? `${input.host}:${input.porta}`
        : input.host;
  const novo: Servidor = {
    id,
    nome: input.nome,
    tipo: input.tipo,
    alvo,
    status: "online",
    latenciaMs: 40,
    uptime: 100,
    intervalo: input.intervalo,
  };
  db.push(novo);
  latenciaBase.set(id, 40);
  return structuredClone(novo);
}

// Simula uma rodada de checagem: latência oscila e, às vezes, um servidor cai ou volta
export async function checarAgora(): Promise<StatusAoVivo[]> {
  for (const s of db) {
    if (s.status === "manutencao") continue;
    const sorte = Math.random();
    if (s.status === "online" && sorte < 0.02) s.status = "offline";
    else if (s.status === "offline" && sorte < 0.25) s.status = "online";

    const base = latenciaBase.get(s.id) ?? 50;
    s.latenciaMs =
      s.status === "online"
        ? Math.max(1, Math.round(base * (0.75 + Math.random() * 0.5)))
        : null;
  }
  return db.map(({ id, status, latenciaMs }) => ({ id, status, latenciaMs }));
}

/** Histórico de 24h gerado de forma determinística a partir do id. */
export async function historicoLatencia(id?: string): Promise<PontoLatencia[]> {
  const alvos = id ? db.filter((s) => s.id === id) : db;
  const agora = new Date();
  const pontos: PontoLatencia[] = [];

  for (let h = 23; h >= 0; h--) {
    const quando = new Date(agora.getTime() - h * 3600_000);
    const valores = alvos.map((s) => {
      const base = latenciaBase.get(s.id) ?? 50;
      const onda = Math.sin((quando.getHours() + Number(s.id)) / 3.5) * 0.25;
      const pico = quando.getHours() >= 9 && quando.getHours() <= 18 ? 0.2 : 0;
      return base * (1 + onda + pico);
    });
    const media = valores.reduce((a, b) => a + b, 0) / Math.max(1, valores.length);
    pontos.push({
      hora: `${String(quando.getHours()).padStart(2, "0")}h`,
      latenciaMs: Math.round(media),
    });
  }
  return pontos;
}
