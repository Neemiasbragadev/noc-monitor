"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { criarServidorAction } from "@/app/actions";
import { servidorSchema, type ServidorInput } from "@/lib/schema";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/field";
import { Select } from "@/components/ui/select";

type Erros = Partial<Record<string, { message?: string }>>;

export function ServerForm() {
  const router = useRouter();
  const [enviando, startTransition] = useTransition();
  const [erroServidor, setErroServidor] = useState<string | null>(null);

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ServidorInput>({
    resolver: zodResolver(servidorSchema),
    mode: "onBlur",
    reValidateMode: "onChange",
    shouldUnregister: true,
    defaultValues: { tipo: "http", nome: "", intervalo: 60, url: "" },
  });

  const tipo = useWatch({ control, name: "tipo" });
  const e = errors as Erros;

  // aria-invalid + aria-describedby ligam o erro ao campo pra leitores de tela
  const a11y = (campo: string) => ({
    id: campo,
    "aria-invalid": e[campo] ? true : undefined,
    "aria-describedby": e[campo] ? `${campo}-erro` : `${campo}-ajuda`,
  });

  function onSubmit(dados: ServidorInput) {
    setErroServidor(null);
    startTransition(async () => {
      const r = await criarServidorAction(dados);
      if (r.ok) router.push(`/servidores/${r.id}`);
      else setErroServidor("O servidor recusou os dados. Revise os campos.");
    });
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex max-w-xl flex-col gap-5">
      <Field id="nome" rotulo="Nome" erro={e.nome?.message} ajuda="Ex.: api-pagamentos">
        <Input {...a11y("nome")} {...register("nome")} autoComplete="off" />
      </Field>

      <Field id="tipo" rotulo="Tipo de checagem" erro={e.tipo?.message}>
        <Controller
          control={control}
          name="tipo"
          render={({ field }) => (
            <Select
              id="tipo"
              value={field.value}
              onValueChange={field.onChange}
              opcoes={[
                { valor: "http", rotulo: "HTTP — site ou API" },
                { valor: "ping", rotulo: "Ping — equipamento de rede" },
                { valor: "banco", rotulo: "Banco de dados" },
              ]}
            />
          )}
        />
      </Field>

      {tipo === "http" && (
        <Field id="url" rotulo="URL" erro={e.url?.message} ajuda="Endereço que será consultado">
          <Input {...a11y("url")} {...register("url")} placeholder="https://api.empresa.com/health" />
        </Field>
      )}

      {(tipo === "ping" || tipo === "banco") && (
        <Field id="host" rotulo="Host ou IP" erro={e.host?.message} ajuda="Ex.: 10.0.0.1 ou db.empresa.local">
          <Input {...a11y("host")} {...register("host")} placeholder="10.0.0.1" />
        </Field>
      )}

      {tipo === "banco" && (
        <div className="grid gap-5 sm:grid-cols-2">
          <Field id="engine" rotulo="Banco" erro={e.engine?.message}>
            <Controller
              control={control}
              name="engine"
              render={({ field }) => (
                <Select
                  id="engine"
                  value={field.value}
                  onValueChange={field.onChange}
                  invalido={!!e.engine}
                  placeholder="Escolha…"
                  opcoes={[
                    { valor: "postgres", rotulo: "PostgreSQL" },
                    { valor: "mysql", rotulo: "MySQL" },
                    { valor: "mongodb", rotulo: "MongoDB" },
                  ]}
                />
              )}
            />
          </Field>
          <Field id="porta" rotulo="Porta" erro={e.porta?.message}>
            <Input
              {...a11y("porta")}
              type="number"
              inputMode="numeric"
              placeholder="5432"
              {...register("porta", { valueAsNumber: true })}
            />
          </Field>
        </div>
      )}

      <Field
        id="intervalo"
        rotulo="Intervalo de checagem (segundos)"
        erro={e.intervalo?.message}
        ajuda="Entre 10 e 3600 segundos"
      >
        <Input
          {...a11y("intervalo")}
          type="number"
          inputMode="numeric"
          {...register("intervalo", { valueAsNumber: true })}
        />
      </Field>

      {erroServidor && (
        <p role="alert" className="rounded-lg border border-down/50 bg-down/10 px-3 py-2 text-sm">
          {erroServidor}
        </p>
      )}

      <div className="flex gap-3">
        <Button type="submit" disabled={enviando}>
          {enviando ? "Salvando…" : "Cadastrar servidor"}
        </Button>
        <Button type="button" variante="secundario" onClick={() => router.back()}>
          Cancelar
        </Button>
      </div>
    </form>
  );
}
