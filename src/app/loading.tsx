export default function Carregando() {
  return (
    <div className="flex flex-col gap-8" aria-busy="true" aria-label="Carregando painel">
      <div className="h-8 w-72 animate-pulse rounded-lg bg-surface-2" />
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {Array.from({ length: 4 }, (_, i) => (
          <div key={i} className="h-28 animate-pulse rounded-card bg-surface" />
        ))}
      </div>
      <div className="h-80 animate-pulse rounded-card bg-surface" />
      <div className="h-96 animate-pulse rounded-card bg-surface" />
    </div>
  );
}
