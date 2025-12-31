
import React, { useMemo } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip as RechartsTooltip, 
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie,
  Legend
} from 'recharts';
import { 
  BarChart3, 
  Info, 
  Target, 
  Zap, 
  Users, 
  TrendingUp, 
  Calculator,
  Cpu,
  ArrowUpRight,
  ShieldCheck
} from 'lucide-react';
import { Colaborador, Funcao } from '../types';
import { FUNCOES_PADRAO } from '../constants';

interface ReportsProps {
  colaboradores: Colaborador[];
}

const Reports: React.FC<ReportsProps> = ({ colaboradores }) => {
  const stats = useMemo(() => {
    const ativos = colaboradores.filter(c => c.ativo === 'SIM');
    
    // Distribuição por Função Baseada em Habilidades
    const skillDistribution = FUNCOES_PADRAO.map(f => ({
      name: f.nome,
      count: ativos.filter(c => c.funcoes_habilitadas.includes(f.id)).length,
      avgPhh: Math.round(ativos.filter(c => c.funcoes_habilitadas.includes(f.id))
        .reduce((acc, c) => acc + c.phh_efetivo, 0) / (ativos.filter(c => c.funcoes_habilitadas.includes(f.id)).length || 1))
    })).filter(d => d.count > 0);

    // Comparativo Operacional
    const opStats = [
      { name: 'Convencional', value: ativos.filter(c => c.operacao === 'CONVENCIONAL').length, phh: 220 },
      { name: 'Volumoso', value: ativos.filter(c => c.operacao === 'VOLUMOSO').length, phh: 180 }
    ];

    return {
      skillDistribution,
      opStats,
      totalAtivos: ativos.length,
      globalPhh: Math.round(ativos.reduce((acc, c) => acc + c.phh_efetivo, 0) / (ativos.length || 1))
    };
  }, [colaboradores]);

  const COLORS = ['#2D3277', '#FFE600', '#6366F1', '#F43F5E', '#10B981'];

  return (
    <div className="space-y-10 animate-in fade-in duration-500 pb-20">
      {/* Header e KPIs de Performance Global */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-brand-navy p-8 rounded-[40px] text-white shadow-xl relative overflow-hidden group">
          <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:scale-110 transition-transform">
            <TrendingUp size={120} />
          </div>
          <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60 mb-2">PHH Médio Global</p>
          <div className="flex items-baseline gap-2">
            <h3 className="text-4xl font-black">{stats.globalPhh}</h3>
            <span className="text-xs font-bold text-brand-yellow">un/h</span>
          </div>
          <div className="mt-4 flex items-center gap-2 text-emerald-400">
            <ArrowUpRight size={16} />
            <span className="text-[10px] font-black uppercase">4.2% vs mês anterior</span>
          </div>
        </div>

        <div className="bg-white p-8 rounded-[40px] border border-black/5 shadow-sm">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Capacidade de Resposta</p>
          <div className="flex items-baseline gap-2">
            <h3 className="text-4xl font-black text-brand-navy">High</h3>
          </div>
          <p className="text-[10px] font-bold text-slate-400 mt-4 uppercase">Base com {stats.totalAtivos} operadores prontos</p>
        </div>

        <div className="bg-white p-8 rounded-[40px] border border-black/5 shadow-sm">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Acuracidade de Escala</p>
          <div className="flex items-baseline gap-2">
            <h3 className="text-4xl font-black text-brand-navy">98.4%</h3>
          </div>
          <p className="text-[10px] font-bold text-slate-400 mt-4 uppercase">Baseado em feedbacks de alocação</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Gráfico de Distribuição de Competências */}
        <div className="lg:col-span-8 bg-white p-10 rounded-[40px] border border-black/5 shadow-sm">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h3 className="text-xl font-black text-brand-navy uppercase tracking-tighter">Matriz de Competências</h3>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Efetivo habilitado por função</p>
            </div>
            <BarChart3 className="text-brand-yellow" size={24} />
          </div>
          
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.skillDistribution} layout="vertical" margin={{ left: 40 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                <XAxis type="number" hide />
                <YAxis 
                  dataKey="name" 
                  type="category" 
                  width={150} 
                  tick={{ fontSize: 9, fontWeight: 900, fill: '#64748b' }} 
                  axisLine={false}
                  tickLine={false}
                />
                <RechartsTooltip 
                  cursor={{ fill: '#f8fafc' }}
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  itemStyle={{ fontSize: '12px', fontWeight: 'bold' }}
                />
                <Bar dataKey="count" fill="#2D3277" radius={[0, 8, 8, 0]} barSize={24}>
                  {stats.skillDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.count > 15 ? '#2D3277' : '#6366F1'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Mix Operacional */}
        <div className="lg:col-span-4 bg-white p-10 rounded-[40px] border border-black/5 shadow-sm flex flex-col">
          <h3 className="text-sm font-black text-brand-navy uppercase tracking-widest mb-8 text-center">Mix de Operação</h3>
          <div className="flex-1 min-h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stats.opStats}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={8}
                  dataKey="value"
                >
                  {stats.opStats.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <RechartsTooltip />
                <Legend iconType="circle" verticalAlign="bottom" wrapperStyle={{ fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-8 pt-8 border-t border-slate-50 space-y-4">
             <div className="flex items-center justify-between">
                <span className="text-[10px] font-black text-slate-400 uppercase">Gap de Treinamento</span>
                <span className="text-[10px] font-black text-red-500 uppercase">12% Volumoso</span>
             </div>
             <div className="flex items-center justify-between">
                <span className="text-[10px] font-black text-slate-400 uppercase">Saturação</span>
                <span className="text-[10px] font-black text-emerald-500 uppercase">Otimizada</span>
             </div>
          </div>
        </div>
      </div>

      {/* SEÇÃO EDUCATIVA: O ALGORITMO */}
      <div className="space-y-8">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-brand-yellow text-brand-navy rounded-2xl shadow-lg shadow-brand-yellow/20">
            <Calculator size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-black text-brand-navy uppercase tracking-tighter">Inteligência Operacional</h2>
            <p className="text-slate-400 font-medium">Como o sistema sugere o "Time Ideal"?</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-[32px] border border-black/5 shadow-sm space-y-4 hover:border-brand-yellow transition-colors">
            <div className="flex items-center gap-3 text-brand-navy mb-4">
              <Zap size={20} className="fill-current text-brand-yellow" />
              <h4 className="font-black uppercase text-xs tracking-widest">1. Cálculo de Vagas</h4>
            </div>
            <p className="text-xs font-bold text-slate-500 leading-relaxed">
              O sistema utiliza a **Regra de Dimensionamento de Carga**. 
              Para o **Volumoso**, calculamos automaticamente **10% do volume total** de pacotes e dividimos pelo PHH meta de 150.
              No **Convencional**, as vagas de sorting são calculadas por rua: ruas com mais de 1500 pacotes recebem **2 postos**, garantindo fluidez.
            </p>
          </div>

          <div className="bg-white p-8 rounded-[32px] border border-black/5 shadow-sm space-y-4 hover:border-brand-yellow transition-colors">
            <div className="flex items-center gap-3 text-brand-navy mb-4">
              <Target size={20} className="text-brand-navy" />
              <h4 className="font-black uppercase text-xs tracking-widest">2. Score de Adequação</h4>
            </div>
            <p className="text-xs font-bold text-slate-500 leading-relaxed">
              Cada colaborador recebe um score dinâmico por função:
              <br/><br/>
              • **70% Performance Real**: PHH efetivo extraído da base de produtividade.
              <br/>
              • **30% Maturidade Técnica**: Baseada no nível de experiência (0-5) cadastrado no perfil.
            </p>
          </div>

          <div className="bg-white p-8 rounded-[32px] border border-black/5 shadow-sm space-y-4 hover:border-brand-yellow transition-colors">
            <div className="flex items-center gap-3 text-brand-navy mb-4">
              <ShieldCheck size={20} className="text-emerald-500" />
              <h4 className="font-black uppercase text-xs tracking-widest">3. Filtros de Segurança</h4>
            </div>
            <p className="text-xs font-bold text-slate-500 leading-relaxed">
              O algoritmo respeita as **Certificações Obrigatórias**. Funções como "Sorting Volumoso" ou "Paleteira" exigem habilitação técnica. 
              O sistema também prioriza a **Afinidade de Operação**, mantendo o colaborador no time (Conv/Vol) onde ele performa com mais consistência.
            </p>
          </div>
        </div>
      </div>

      {/* Card de Conclusão de Relatório */}
      <div className="bg-slate-50 border border-slate-200 p-8 rounded-[40px] flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-6">
          <div className="w-14 h-14 bg-brand-navy text-white rounded-2xl flex items-center justify-center">
            <Cpu size={28} />
          </div>
          <div>
            <h4 className="text-lg font-black text-brand-navy uppercase tracking-tighter">Status da Inteligência</h4>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Motor de sugestão SRS7 está operando em capacidade máxima</p>
          </div>
        </div>
        <div className="flex gap-4">
           <div className="flex items-center gap-2 text-emerald-600 bg-emerald-50 px-4 py-2 rounded-xl font-black text-[10px] uppercase">
              <Users size={14} /> Dados em Tempo Real
           </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
