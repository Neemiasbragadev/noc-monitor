import { z } from "zod";

const hostRegex =
  /^((\d{1,3}\.){3}\d{1,3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+)$/;

const base = {
  nome: z
    .string()
    .trim()
    .min(3, "O nome precisa ter pelo menos 3 caracteres")
    .max(40, "Máximo de 40 caracteres"),
  intervalo: z
    .number({ error: "Informe um número" })
    .int("Use um número inteiro")
    .min(10, "Mínimo de 10 segundos")
    .max(3600, "Máximo de 3600 segundos"),
};

const host = z
  .string()
  .trim()
  .min(1, "Informe o host ou IP")
  .regex(hostRegex, "Host ou IP inválido");

// Mesmo schema valida no cliente (React Hook Form) e no servidor (Server Action)
export const servidorSchema = z.discriminatedUnion("tipo", [
  z.object({
    ...base,
    tipo: z.literal("http"),
    url: z.url({ protocol: /^https?$/, error: "Informe uma URL http(s) válida" }),
  }),
  z.object({
    ...base,
    tipo: z.literal("ping"),
    host,
  }),
  z.object({
    ...base,
    tipo: z.literal("banco"),
    host,
    porta: z
      .number({ error: "Informe a porta" })
      .int()
      .min(1, "Porta inválida")
      .max(65535, "Porta inválida"),
    engine: z.enum(["postgres", "mysql", "mongodb"], {
      error: "Escolha o banco",
    }),
  }),
]);

export type ServidorInput = z.infer<typeof servidorSchema>;
