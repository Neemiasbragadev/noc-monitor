import { describe, expect, it } from "vitest";
import { servidorSchema } from "./schema";

describe("servidorSchema", () => {
  it("aceita um servidor HTTP válido", () => {
    const r = servidorSchema.safeParse({
      tipo: "http",
      nome: "api-gateway",
      url: "https://api.exemplo.com/health",
      intervalo: 30,
    });
    expect(r.success).toBe(true);
  });

  it("recusa URL que não é http(s)", () => {
    const r = servidorSchema.safeParse({
      tipo: "http",
      nome: "api-gateway",
      url: "ftp://arquivos.exemplo.com",
      intervalo: 30,
    });
    expect(r.success).toBe(false);
  });

  it("exige porta e engine quando o tipo é banco", () => {
    const r = servidorSchema.safeParse({
      tipo: "banco",
      nome: "db-principal",
      host: "10.0.1.10",
      intervalo: 30,
    });
    expect(r.success).toBe(false);
    if (!r.success) {
      const campos = Object.keys(r.error.flatten().fieldErrors);
      expect(campos).toEqual(expect.arrayContaining(["porta", "engine"]));
    }
  });

  it("recusa intervalo abaixo de 10 segundos", () => {
    const r = servidorSchema.safeParse({
      tipo: "ping",
      nome: "switch-core",
      host: "10.0.0.5",
      intervalo: 5,
    });
    expect(r.success).toBe(false);
  });
});
