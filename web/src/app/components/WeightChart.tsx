'use client'

import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

export type WeightPoint = {
  date: string
  weight: number
}

export default function WeightChart({ data }: { data: WeightPoint[] }) {
  return (
    <ResponsiveContainer width="100%" height={320}>
      <LineChart data={data} margin={{ top: 8, right: 16, bottom: 8, left: -8 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
        <XAxis
          dataKey="date"
          stroke="var(--color-muted)"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke="var(--color-muted)"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          domain={['dataMin - 1', 'dataMax + 1']}
          unit="kg"
        />
        <Tooltip
          contentStyle={{
            background: 'var(--color-background)',
            border: '1px solid var(--color-border)',
            borderRadius: 8,
            fontSize: 13,
          }}
          labelStyle={{ color: 'var(--color-foreground)' }}
        />
        <Line
          type="monotone"
          dataKey="weight"
          stroke="var(--color-accent)"
          strokeWidth={2}
          dot={{ r: 3, fill: 'var(--color-accent)' }}
          activeDot={{ r: 5 }}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}
