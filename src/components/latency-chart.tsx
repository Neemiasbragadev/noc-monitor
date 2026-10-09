"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { PontoLatencia } from "@/lib/types";

export function LatencyChart({ dados }: { dados: PontoLatencia[] }) {
  return (
    <div className="flex flex-col gap-3">
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={dados} margin={{ top: 8, right: 8, left: -8, bottom: 0 }}>
            <defs>
              <linearGradient id="preenchimento" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3987e5" stopOpacity={0.35} />
                <stop offset="100%" stopColor="#3987e5" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="#2f2f2c" strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey="hora"
              tick={{ fill: "#a3a29b", fontSize: 12 }}
              tickLine={false}
              axisLine={{ stroke: "#2f2f2c" }}
              interval={3}
            />
            <YAxis
              tick={{ fill: "#a3a29b", fontSize: 12 }}
              tickLine={false}
              axisLine={false}
              unit=" ms"
              width={64}
            />
            <Tooltip
              cursor={{ stroke: "#a3a29b", strokeDasharray: "3 3" }}
              contentStyle={{
                background: "#232321",
                border: "1px solid #2f2f2c",
                borderRadius: 8,
                color: "#f4f4f2",
              }}
              labelStyle={{ color: "#a3a29b" }}
              itemStyle={{ color: "#f4f4f2" }}
              formatter={(v) => [`${v} ms`, "Latência média"]}
            />
            <Area
              type="monotone"
              dataKey="latenciaMs"
              stroke="#3987e5"
              strokeWidth={2}
              fill="url(#preenchimento)"
              isAnimationActive={false}
              activeDot={{ r: 5, stroke: "#1a1a19", strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Alternativa acessível: os mesmos números em tabela */}
      <details className="text-sm text-muted">
        <summary className="cursor-pointer select-none">Ver dados em tabela</summary>
        <table className="mt-2 w-full max-w-sm text-left font-mono text-xs">
          <thead>
            <tr>
              <th scope="col" className="py-1">Hora</th>
              <th scope="col" className="py-1 text-right">Latência (ms)</th>
            </tr>
          </thead>
          <tbody>
            {dados.map((p) => (
              <tr key={p.hora} className="border-t border-border">
                <td className="py-1">{p.hora}</td>
                <td className="py-1 text-right tabular-nums text-text">{p.latenciaMs}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </details>
    </div>
  );
}
