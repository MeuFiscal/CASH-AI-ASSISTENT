import { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface ChartDataPoint {
  date: string;
  usuarios: number;
  receita: number;
  workspaces: number;
}

export function GrowthChart({ data, loading }: { data: ChartDataPoint[], loading: boolean }) {
  const [period, setPeriod] = useState('30d');

  const filters = [
    { label: 'Hoje', value: '1d' },
    { label: '7 dias', value: '7d' },
    { label: '30 dias', value: '30d' },
    { label: '90 dias', value: '90d' },
    { label: '12 meses', value: '12m' },
  ];

  return (
    <div className="bg-[#181C28]/60 border border-white/5 backdrop-blur-md rounded-2xl p-5 w-full flex flex-col gap-4 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h3 className="text-white font-medium">Crescimento da Plataforma</h3>
          <p className="text-xs text-[#A8B3CF]">Usuários, Receita e Workspaces</p>
        </div>
        <div className="flex bg-[#0A0D14]/80 p-1 rounded-lg border border-white/5">
          {filters.map(f => (
            <button
              key={f.value}
              onClick={() => setPeriod(f.value)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                period === f.value ? 'bg-[#181C28] text-white shadow-sm border border-white/5' : 'text-[#A8B3CF] hover:text-white'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <div className="h-[300px] w-full mt-4">
        {loading ? (
          <div className="w-full h-full flex items-center justify-center text-[#A8B3CF] text-sm">Carregando dados...</div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
              <XAxis dataKey="date" stroke="#A8B3CF" fontSize={12} tickLine={false} axisLine={false} dy={10} />
              <YAxis stroke="#A8B3CF" fontSize={12} tickLine={false} axisLine={false} dx={-10} tickFormatter={(v) => v >= 1000 ? `${(v/1000).toFixed(1)}k` : v} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#181C28', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff' }}
                itemStyle={{ color: '#fff', fontSize: '13px' }}
                labelStyle={{ color: '#A8B3CF', marginBottom: '4px', fontSize: '12px' }}
              />
              <Area type="monotone" dataKey="usuarios" stroke="#3B82F6" strokeWidth={2} fillOpacity={1} fill="url(#colorUsers)" />
              <Area type="monotone" dataKey="receita" stroke="#10B981" strokeWidth={2} fillOpacity={1} fill="url(#colorRev)" />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
