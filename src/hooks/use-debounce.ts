"use client";

import { useEffect, useState } from "react";

/** Só devolve o valor novo depois que ele para de mudar por `delay` ms. */
export function useDebounce<T>(valor: T, delay = 300): T {
  const [atrasado, setAtrasado] = useState(valor);

  useEffect(() => {
    const t = setTimeout(() => setAtrasado(valor), delay);
    return () => clearTimeout(t);
  }, [valor, delay]);

  return atrasado;
}
