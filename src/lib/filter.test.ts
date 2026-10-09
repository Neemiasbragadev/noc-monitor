import { describe, expect, it } from "vitest";
import { filtrarServidores, resumo } from "./filter";
import type { Servidor } from "./types";

const lista: Servidor[] = [
  { id: "1", nome: "api-gateway", tipo: "http", alvo: "https://api.x.com", status: "online", latenciaMs: 100, uptime: 99.9, intervalo: 30 },
  { id: "2", nome: "db-principal", tipo: "banco", alvo: "10.0.1.10:5432", status: "offline", latenciaMs: null, uptime: 95, intervalo: 30 },
  { id: "3", nome: "switch-core", tipo: "ping", alvo: "10.0.0.5", status: "online", latenciaMs: 2, uptime: 100, intervalo: 15 },
];

describe("filtrarServidores", () => {
  it("busca por nome sem diferenciar maiúsculas", () => {
    expect(filtrarServidores(lista, "API", "todos").map((s) => s.id)).toEqual(["1"]);
  });

  it("busca também pelo endereço", () => {
    expect(filtrarServidores(lista, "10.0.1", "todos").map((s) => s.id)).toEqual(["2"]);
  });

  it("combina busca e status", () => {
    expect(filtrarServidores(lista, "", "online").map((s) => s.id)).toEqual(["1", "3"]);
    expect(filtrarServidores(lista, "switch", "offline")).toEqual([]);
  });
});

describe("resumo", () => {
  it("conta status e calcula a latência média só dos online", () => {
    expect(resumo(lista)).toEqual({
      total: 3,
      online: 2,
      offline: 1,
      manutencao: 0,
      latenciaMedia: 51,
    });
  });
});
