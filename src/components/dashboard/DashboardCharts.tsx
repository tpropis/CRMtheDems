'use client'

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts'
import { Card, CardHeader, CardTitle } from '@/components/ui/Card'

interface ChartEntry {
  name: string
  value: number
  status: string
}

const STATUS_CHART_COLORS: Record<string, string> = {
  strong_support: '#10b981',
  lean_support: '#34d399',
  undecided: '#f59e0b',
  lean_oppose: '#f97316',
  strong_oppose: '#ef4444',
  not_contacted: '#94a3b8',
}

interface Props {
  chartData: ChartEntry[]
}

export default function DashboardCharts({ chartData }: Props) {
  const hasData = chartData.some((d) => d.value > 0)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Voter Contact Summary</CardTitle>
        <span className="text-xs text-slate-500">
          {chartData.reduce((s, d) => s + d.value, 0)} total contacts
        </span>
      </CardHeader>

      {hasData ? (
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <div className="w-full sm:w-56 h-52">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={90}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {chartData.map((entry) => (
                    <Cell
                      key={entry.status}
                      fill={STATUS_CHART_COLORS[entry.status] ?? '#94a3b8'}
                    />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: number) => [value, 'Contacts']}
                  contentStyle={{ fontSize: 12, borderRadius: 6 }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="flex-1 space-y-2 w-full">
            {chartData
              .sort((a, b) => b.value - a.value)
              .map((entry) => {
                const total = chartData.reduce((s, d) => s + d.value, 0)
                const pct = total > 0 ? Math.round((entry.value / total) * 100) : 0
                return (
                  <div key={entry.status} className="flex items-center gap-3">
                    <div
                      className="w-3 h-3 rounded-full flex-shrink-0"
                      style={{ backgroundColor: STATUS_CHART_COLORS[entry.status] ?? '#94a3b8' }}
                    />
                    <span className="text-sm text-slate-700 flex-1">{entry.name}</span>
                    <span className="text-sm font-semibold text-slate-900">{entry.value}</span>
                    <span className="text-xs text-slate-400 w-8 text-right">{pct}%</span>
                  </div>
                )
              })}
          </div>
        </div>
      ) : (
        <div className="h-40 flex items-center justify-center">
          <p className="text-sm text-slate-400">No contact data yet</p>
        </div>
      )}
    </Card>
  )
}
