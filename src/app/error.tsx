"use client";

import { Button } from "@/components/ui/button";

export default function Erro({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div role="alert" className="mx-auto flex max-w-md flex-col items-center gap-4 py-20 text-center">
      <h1 className="text-xl font-semibold">Não foi possível carregar o painel</h1>
      <p className="text-sm text-muted">
        A fonte de dados de monitoramento não respondeu. Tente de novo em instantes.
      </p>
      {error.digest && <p className="font-mono text-xs text-muted">Código: {error.digest}</p>}
      <Button onClick={reset}>Tentar de novo</Button>
    </div>
  );
}
