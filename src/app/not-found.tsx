import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

export default function NaoEncontrado() {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center gap-4 py-20 text-center">
      <h1 className="text-xl font-semibold">Servidor não encontrado</h1>
      <p className="text-sm text-muted">Ele pode ter sido removido ou o endereço está errado.</p>
      <Link href="/" className={buttonVariants({ variante: "secundario" })}>
        Voltar ao painel
      </Link>
    </div>
  );
}
