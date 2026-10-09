"use server";

import { revalidatePath } from "next/cache";
import { criarServidor } from "@/lib/data";
import { servidorSchema } from "@/lib/schema";

export type ResultadoCriacao =
  | { ok: true; id: string }
  | { ok: false; erros: Record<string, string[] | undefined> };

// Revalida de novo no servidor — nunca confiar só na validação do cliente
export async function criarServidorAction(dados: unknown): Promise<ResultadoCriacao> {
  const parse = servidorSchema.safeParse(dados);
  if (!parse.success) {
    return { ok: false, erros: parse.error.flatten().fieldErrors };
  }
  const novo = await criarServidor(parse.data);
  revalidatePath("/");
  return { ok: true, id: novo.id };
}
