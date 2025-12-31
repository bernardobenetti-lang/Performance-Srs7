
import React, { useMemo } from 'react';
import { 
  Users, 
  Calendar, 
  TrendingUp, 
  AlertTriangle,
  Play,
  Zap,
  CheckCircle2,
  PieChart as PieIcon,
  Layers,
  Box,
  UserCheck,
  Clock,
  User,
  Sunrise,
  Sun,
  Moon
} from 'lucide-react';
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  Tooltip as RechartsTooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis
} from 'recharts';
import { Colaborador } from '../types';

interface DashboardProps {
  colaboradores: Colaborador[];
  onGoToPlanner: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ colaboradores, onGoToPlanner }) => {
  const stats = useMemo(() => {
    const ativos = colaboradores.filter(c => c.ativo === 'SIM');
    const emFerias = colaboradores.filter(c => c.em_ferias === 'SIM').length;
    
    // Produtividade
    const mediaEficiencia = ativos.length > 0 
      ? Math.round(ativos.reduce((acc, c) => acc + c.eficiencia, 0) / ativos.length)
      : 0;
    
    // Ranking PHH
    const top5 = [...ativos].sort((a, b) => b.phh_efetivo - a.phh_efetivo).slice(0, 5);

    // Distribuição por Turnos (T1, T2, T3)
    const t1 = ativos.filter(c => c.escala_padrao === 'T1').length;
    const t2 = ativos.filter(c => c.escala_padrao === 'T2').length;
    const t3 = ativos.filter(c => c.escala_padrao === 'T3').length;

    const turnosData = [
      { name: 'T1 - Noite', value: t1, icon: Moon },
      { name: 'T2 - Manhã', value: t2, icon: Sunrise },
      { name: 'T3 - Tarde', value: t3, icon: Sun },
    ];

    // Distribuição de Contratos
    const contratosMap = ativos.reduce((acc, c) => {
      acc[c.contrato_fornecedor] = (acc[c.contrato_fornecedor] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const pieData = Object.entries(contratosMap).map(([name, value]) => ({ name, value }));

    // Distribuição Operacional
    const convencional = ativos.filter(c => c.operacao === 'CONVENCIONAL').length;
    const volumoso = ativos.filter(c => c.operacao === 'VOLUMOSO').length;

    // PHH Médio por Operação
    const phhConv = ativos.filter(c => c.operacao === 'CONVENCIONAL');
    const phhVol = ativos.filter(c => c.operacao === 'VOLUMOSO');
    
    const avgPhhConv = phhConv.length > 0 ? (phhConv.reduce((acc, c) => acc + c.phh_efetivo, 0) / phhConv.length).toFixed(1) : 0;
    const avgPhhVol = phhVol.length > 0 ? (phhVol.reduce((acc, c) => acc + c.phh_efetivo, 0) / phhVol.length).toFixed(1) : 0;

    // Diversidade
    const masc = ativos.filter(c => c.genero === 'MASCULINO').length;
    const fem = ativos.filter(c => c.genero === 'FEMININO').length;
    const femPerc = ativos.length > 0 ? Math.round((fem / ativos.length) * 100) : 0;

    return {
      totalAtivos: ativos.length,
      emFerias,
      mediaEficiencia,
      top5,
      t1, t2, t3,
      turnosData,
      pieData,
      operacao: { convencional, volumoso },
      performance: { avgPhhConv, avgPhhVol },
      diversidade: { femPerc, fem, masc }
    };
  }, [colaboradores]);

  const COLORS = ['#2D3277', '#FFE600', '#6366F1', '#F43F5E', '#10B981'];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500 pb-10">
      
      {/* KPIs Principais - Linha 1 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-brand-surface p-6 rounded-3xl border border-black/5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-brand-navy text-brand-yellow rounded-2xl shadow-lg shadow-brand-navy/10">
              <Users size={24} />
            </div>
            <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg">Online</span>
          </div>
          <h3 className="text-slate-400 text-[10px] font-black uppercase tracking-widest">Efetivo Total</h3>
          <p className="text-3xl font-black mt-1 text-brand-navy">{stats.totalAtivos}</p>
        </div>

        <div className="bg-brand-surface p-6 rounded-3xl border border-black/5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-brand-navy text-brand-yellow rounded-2xl">
              <TrendingUp size={24} />
            </div>
          </div>
          <h3 className="text-slate-400 text-[10px] font-black uppercase tracking-widest">PHH Global</h3>
          <p className="text-3xl font-black mt-1 text-brand-navy">
            {((parseFloat(stats.performance.avgPhhConv.toString()) + parseFloat(stats.performance.avgPhhVol.toString())) / 2).toFixed(1)}
          </p>
        </div>

        <div className="bg-brand-surface p-6 rounded-3xl border border-black/5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-brand-navy text-brand-yellow rounded-2xl">
              <Layers size={24} />
            </div>
          </div>
          <h3 className="text-slate-400 text-[10px] font-black uppercase tracking-widest">Convencional</h3>
          <p className="text-3xl font-black mt-1 text-brand-navy">{stats.operacao.convencional}</p>
          <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase">Avg: {stats.performance.avgPhhConv}</p>
        </div>

        <div className="bg-brand-surface p-6 rounded-3xl border border-black/5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-brand-navy text-brand-yellow rounded-2xl">
              <Box size={24} />
            </div>
          </div>
          <h3 className="text-slate-400 text-[10px] font-black uppercase tracking-widest">Volumoso</h3>
          <p className="text-3xl font-black mt-1 text-brand-navy">{stats.operacao.volumoso}</p>
          <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase">Avg: {stats.performance.avgPhhVol}</p>
        </div>
      </div>

      {/* DETALHAMENTO DE TURNOS - Linha 2 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-[32px] border border-black/5 shadow-sm flex items-center gap-6 group hover:border-brand-yellow transition-all">
          <div className="w-14 h-14 bg-slate-50 text-brand-navy rounded-2xl flex items-center justify-center group-hover:bg-brand-navy group-hover:text-white transition-colors">
            <Moon size={28} />
          </div>
          <div>
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Turno T1 (Noite)</h4>
            <p className="text-2xl font-black text-brand-navy">{stats.t1} <span className="text-[10px] text-slate-300">Pessoas</span></p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-[32px] border border-black/5 shadow-sm flex items-center gap-6 group hover:border-brand-yellow transition-all">
          <div className="w-14 h-14 bg-slate-50 text-brand-navy rounded-2xl flex items-center justify-center group-hover:bg-brand-navy group-hover:text-white transition-colors">
            <Sunrise size={28} />
          </div>
          <div>
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Turno T2 (Manhã)</h4>
            <p className="text-2xl font-black text-brand-navy">{stats.t2} <span className="text-[10px] text-slate-300">Pessoas</span></p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-[32px] border border-black/5 shadow-sm flex items-center gap-6 group hover:border-brand-yellow transition-all">
          <div className="w-14 h-14 bg-slate-50 text-brand-navy rounded-2xl flex items-center justify-center group-hover:bg-brand-navy group-hover:text-white transition-colors">
            <Sun size={28} />
          </div>
          <div>
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Turno T3 (Tarde)</h4>
            <p className="text-2xl font-black text-brand-navy">{stats.t3} <span className="text-[10px] text-slate-300">Pessoas</span></p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Gráfico Mix de Fornecedores */}
        <div className="lg:col-span-4 bg-brand-surface p-8 rounded-[40px] border border-black/5 shadow-sm">
          <h3 className="text-sm font-black mb-6 text-brand-navy flex items-center gap-3 uppercase tracking-widest">
            <PieIcon size={18} className="text-brand-yellow" /> Fornecedores SRS7
          </h3>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stats.pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {stats.pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <RechartsTooltip 
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  itemStyle={{ fontWeight: 'bold', fontSize: '12px' }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Elite de Performance */}
        <div className="lg:col-span-5 bg-brand-surface p-8 rounded-[40px] border border-black/5 shadow-sm flex flex-col">
          <h3 className="text-sm font-black mb-8 text-brand-navy flex items-center gap-3 uppercase tracking-widest">
            <span className="p-2 bg-brand-yellow/20 text-brand-navy rounded-xl">🏆</span> Elite PHH SRS7
          </h3>
          <div className="space-y-6 flex-1">
            {stats.top5.map((p, idx) => (
              <div key={p.id} className="flex items-center justify-between group">
                <div className="flex items-center gap-4">
                  <span className="text-[10px] font-black text-slate-300 w-4">#{idx + 1}</span>
                  <div className="flex flex-col">
                    <span className="text-xs font-black text-slate-700 uppercase tracking-tighter truncate max-w-[140px] group-hover:text-brand-navy transition-colors">{p.nome_completo}</span>
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{p.ldap} • {p.escala_padrao}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                   <div className="text-right">
                      <p className="text-sm font-black text-brand-navy flex items-center justify-end gap-1">
                        <Zap size={14} className="text-brand-yellow fill-current" /> {p.phh_efetivo.toFixed(1)}
                      </p>
                   </div>
                   <div className={`w-2 h-8 rounded-full ${p.operacao === 'VOLUMOSO' ? 'bg-brand-yellow' : 'bg-brand-navy opacity-20'}`}></div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-8 pt-6 border-t border-slate-50 flex items-center justify-between">
             <div>
                <p className="text-[10px] font-black text-slate-300 uppercase">Mix de Gênero</p>
                <p className="text-xs font-black text-brand-navy uppercase mt-1">F: {stats.fem} / M: {stats.masc}</p>
             </div>
             <div className="text-right">
                <p className="text-[10px] font-black text-slate-300 uppercase">Representatividade</p>
                <p className="text-xs font-black text-emerald-600 uppercase mt-1">{stats.femPerc}% Feminino</p>
             </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="lg:col-span-3 space-y-6">
          <div className="bg-brand-navy p-8 rounded-[40px] text-white shadow-xl relative overflow-hidden group">
            <div className="absolute -right-4 -bottom-4 text-white/5 transition-transform group-hover:scale-110">
               <UserCheck size={120} />
            </div>
            <h3 className="text-xs font-black uppercase tracking-widest mb-4 opacity-60">Planejamento</h3>
            <p className="text-lg font-black leading-tight mb-6">Pronto para montar a escala de hoje?</p>
            <button 
              onClick={onGoToPlanner}
              className="w-full py-4 bg-brand-yellow text-brand-navy rounded-2xl font-black uppercase text-[10px] tracking-widest hover:scale-105 transition-all shadow-lg shadow-brand-yellow/20 flex items-center justify-center gap-2"
            >
              <Play size={16} fill="currentColor" /> Iniciar Escala
            </button>
          </div>

          <div className="bg-white p-6 rounded-[32px] border border-black/5 shadow-sm space-y-4">
             <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <AlertTriangle size={14} className="text-brand-yellow" /> Status da Base
             </h4>
             <p className="text-[11px] font-bold text-slate-600 leading-relaxed">
               A base está sincronizada com a planilha SRS7. Total de {stats.totalAtivos} colaboradores ativos prontos para alocação.
             </p>
             <div className="flex items-center gap-2 pt-2">
                <CheckCircle2 size={14} className="text-emerald-500" />
                <span className="text-[9px] font-black text-slate-300 uppercase">Dados Verificados</span>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
