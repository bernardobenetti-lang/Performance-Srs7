
import React, { useState, useMemo, useEffect } from 'react';
import { 
  ArrowRight, 
  ArrowLeft, 
  MapPin, 
  Clock, 
  CheckCircle2, 
  Users, 
  Trash2, 
  Plus, 
  Search,
  Zap,
  Lock,
  X,
  UserPlus,
  FileDown,
  ChevronLeft,
  LayoutDashboard,
  Box,
  Layers
} from 'lucide-react';
import { LOCAIS_PADRAO, TURNOS_PADRAO, FUNCOES_PADRAO } from '../constants';
import { Colaborador, ConfiguracoesOperacionais } from '../types';
import { calculateAdequacyScore, generateIdealTimeSuggestion } from '../utils/algorithm';

interface PlannerProps {
  colaboradores: Colaborador[];
  settings: ConfiguracoesOperacionais;
}

const Planner: React.FC<PlannerProps> = ({ colaboradores, settings }) => {
  const [step, setStep] = useState(1);
  const [isFinalized, setIsFinalized] = useState(false);
  
  // States
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedTurno, setSelectedTurno] = useState(TURNOS_PADRAO[1].id); 
  const [selectedLocal, setSelectedLocal] = useState(LOCAIS_PADRAO[0].id);
  const [ruas, setRuas] = useState<{id: string, nome: string, gaiolas: number, pacotes: number}[]>([]);
  const [absentIds, setAbsentIds] = useState<Set<string>>(new Set());
  const [allocations, setAllocations] = useState<{colaboradorId: string, funcaoId: string}[]>([]);
  const [selectingForFuncao, setSelectingForFuncao] = useState<string | null>(null);
  const [searchTermPool, setSearchTermPool] = useState('');

  // Limpar dados se mudar o turno para evitar alocações fantasmas de outros turnos
  useEffect(() => {
    setAbsentIds(new Set());
    setAllocations([]);
  }, [selectedTurno]);

  // Computations
  const colaboradoresAtivos = useMemo(() => {
    // Mapeamento de ID do turno para código de escala (T1, T2, T3)
    const shiftMap: Record<string, string> = {
      'turno-001': 'T1',
      'turno-002': 'T2',
      'turno-003': 'T3'
    };
    const targetShift = shiftMap[selectedTurno];
    
    return colaboradores.filter(c => 
      c.ativo === 'SIM' && 
      c.escala_padrao === targetShift
    );
  }, [colaboradores, selectedTurno]);

  const disponiveis = useMemo(() => colaboradoresAtivos.filter(c => !absentIds.has(c.id)), [colaboradoresAtivos, absentIds]);
  const ausentes = useMemo(() => colaboradoresAtivos.filter(c => absentIds.has(c.id)), [colaboradoresAtivos, absentIds]);
  const poolNaoAlocado = useMemo(() => disponiveis.filter(c => !allocations.some(a => a.colaboradorId === c.id)), [disponiveis, allocations]);

  const turnoInfo = useMemo(() => TURNOS_PADRAO.find(t => t.id === selectedTurno), [selectedTurno]);
  const localInfo = useMemo(() => LOCAIS_PADRAO.find(l => l.id === selectedLocal), [selectedLocal]);

  // RN009: Cálculo Dinâmico de Capacidade (Vagas por Função) usando SETTINGS
  const calculatedVagas = useMemo(() => {
    const totalPacotes = ruas.reduce((acc, r) => acc + r.pacotes, 0);
    const sortingConvVagas = ruas.reduce((acc, r) => acc + (r.pacotes <= settings.limitePacotesPorPessoaSorting ? 1 : 2), 0);
    const sortingVolVagas = Math.ceil((totalPacotes * (settings.percentualVolumeVolumoso / 100)) / settings.phhMetaVolumoso);

    return {
      'func-001': settings.vagasInducaoPadrao,
      'func-002': Math.max(0, sortingConvVagas),
      'func-003': Math.max(0, sortingVolVagas),
      'func-004': settings.vagasEtiquetagemPadrao,
      'func-005': settings.vagasEtiquetagemPadrao,
      'func-008': ruas.length, // REGRA: 1 pessoa para cada rua criada
    };
  }, [ruas, settings]);

  const toggleAbsence = (id: string) => {
    setAbsentIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const addRua = () => {
    const defaultNome = `Rua ${ruas.length + 1}`;
    setRuas([...ruas, { id: Date.now().toString(), nome: defaultNome, gaiolas: 0, pacotes: 0 }]);
  };

  const handleIdealTime = () => {
    const suggested = generateIdealTimeSuggestion({
      colaboradoresDisponiveis: disponiveis,
      vagasPorFuncao: calculatedVagas,
      priorizar: 'EQUILIBRIO',
      settings // Passando settings para o algoritmo
    });
    setAllocations(suggested);
  };

  const allocateColaborador = (colaboradorId: string, funcaoId: string) => {
    setAllocations(prev => [...prev, { colaboradorId, funcaoId }]);
    setSelectingForFuncao(null);
  };

  const removeAllocation = (colaboradorId: string) => {
    setAllocations(prev => prev.filter(a => a.colaboradorId !== colaboradorId));
  };

  const finalizePlanning = () => {
    setIsFinalized(true);
  };

  const handleExportPDF = () => {
    window.print();
  };

  if (isFinalized) {
    return (
      <div className="max-w-6xl mx-auto space-y-8 animate-in zoom-in-95 duration-500 pb-20">
        <div className="flex items-center justify-between no-print">
          <button 
            onClick={() => setIsFinalized(false)}
            className="flex items-center gap-2 text-slate-400 hover:text-brand-navy font-black text-xs uppercase tracking-widest transition-colors"
          >
            <ChevronLeft size={18} /> Voltar à Edição
          </button>
          <div className="flex gap-4">
            <button 
              onClick={handleExportPDF}
              className="px-8 py-4 bg-brand-yellow hover:bg-brand-navy hover:text-white text-brand-navy rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-xl shadow-brand-yellow/20 flex items-center gap-3"
            >
              <FileDown size={20} /> Exportar em PDF
            </button>
          </div>
        </div>

        <div className="bg-brand-surface rounded-[40px] border border-black/5 shadow-sm overflow-hidden print:border-none print:shadow-none bg-white">
          {/* Header Dashboard Final */}
          <div className="bg-brand-navy p-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-8 border-b border-black/5 print:bg-white print:border-b-2 print:border-black">
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 bg-brand-yellow rounded-3xl flex items-center justify-center shadow-2xl shadow-brand-yellow/20 print:shadow-none print:border print:border-black">
                <img 
                  src="https://http2.mlstatic.com/frontend-assets/ui-navigation/5.21.22/mercadolibre/logo__small.png" 
                  alt="ML" 
                  className="w-10 h-10 object-contain"
                />
              </div>
              <div>
                <h1 className="text-3xl font-black text-white print:text-black uppercase tracking-tighter">Relatório de Escala SRS7</h1>
                <p className="text-brand-yellow print:text-black font-black text-xs uppercase tracking-[0.3em]">{localInfo?.nome} • {selectedDate.split('-').reverse().join('/')}</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="px-6 py-4 bg-white/5 print:bg-white rounded-2xl border border-white/10 print:border-black">
                <p className="text-[10px] font-black text-white/30 print:text-black uppercase tracking-widest mb-1">Operação</p>
                <p className="text-lg font-black text-white print:text-black">{turnoInfo?.nome} ({turnoInfo?.horario_inicio}-{turnoInfo?.horario_fim})</p>
              </div>
            </div>
          </div>

          <div className="p-10 space-y-12 bg-white print:bg-white">
            {/* Grid de Resumo */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-slate-50 p-6 rounded-[32px] border border-slate-100 print:border-black">
                <div className="flex items-center gap-2 mb-4">
                  <Box size={16} className="text-brand-navy" />
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Volume Total</h4>
                </div>
                <p className="text-4xl font-black text-brand-navy">{ruas.reduce((acc, r) => acc + r.pacotes, 0).toLocaleString()} <span className="text-xs text-slate-400 uppercase font-bold">Pacotes</span></p>
                <p className="text-sm font-bold text-brand-navy/60 mt-2">{ruas.reduce((acc, r) => acc + r.gaiolas, 0)} Gaiolas totais</p>
              </div>
              <div className="bg-slate-50 p-6 rounded-[32px] border border-slate-100 print:border-black">
                <div className="flex items-center gap-2 mb-4">
                  <Users size={16} className="text-brand-navy" />
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Efetivo Alocado</h4>
                </div>
                <p className="text-4xl font-black text-brand-navy">{allocations.length} / {disponiveis.length}</p>
                <p className="text-sm font-bold text-emerald-600 mt-2">Capacidade: {Math.round((allocations.length / disponiveis.length) * 100)}%</p>
              </div>
              <div className="bg-slate-50 p-6 rounded-[32px] border border-slate-100 print:border-black">
                <div className="flex items-center gap-2 mb-4">
                  <X size={16} className="text-red-500" />
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Ausências</h4>
                </div>
                <p className="text-4xl font-black text-red-600">{absentIds.size}</p>
                <p className="text-sm font-bold text-slate-400 mt-2">Falhas de presença registradas</p>
              </div>
            </div>

            <div className="space-y-6">
               <h3 className="text-xl font-black text-brand-navy flex items-center gap-3">
                 <div className="w-1.5 h-6 bg-brand-yellow rounded-full shadow-sm"></div>
                 Detalhamento de Ruas e Volumes
               </h3>
               <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                 {ruas.map(r => (
                   <div key={r.id} className="p-5 bg-slate-50 border border-slate-100 print:border-black rounded-2xl flex flex-col items-center shadow-sm">
                     <span className="text-xs font-black text-brand-navy/40 uppercase mb-2 tracking-tighter">Rua {r.nome}</span>
                     <span className="text-lg font-black text-brand-navy">{r.pacotes.toLocaleString()}</span>
                     <span className="text-[10px] font-bold text-slate-300 uppercase tracking-tighter">Pacotes</span>
                   </div>
                 ))}
               </div>
            </div>

            <div className="space-y-6">
              <h3 className="text-xl font-black text-brand-navy flex items-center gap-3">
                <div className="w-1.5 h-6 bg-brand-yellow rounded-full shadow-sm"></div>
                Distribuição das Posições do Time
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {FUNCOES_PADRAO.filter(f => allocations.some(a => a.funcaoId === f.id)).map(func => (
                  <div key={func.id} className="p-6 bg-white border border-slate-100 print:border-black rounded-[32px] space-y-4 shadow-sm">
                    <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                      <span className="text-xs font-black text-brand-navy uppercase tracking-widest">{func.nome}</span>
                      <span className="text-[10px] font-black px-2 py-0.5 bg-brand-navy/5 border border-brand-navy/10 rounded-full text-brand-navy/60">
                        {allocations.filter(a => a.funcaoId === func.id).length} postos
                      </span>
                    </div>
                    <div className="space-y-2">
                      {allocations.filter(a => a.funcaoId === func.id).map(a => {
                        const colab = colaboradores.find(c => c.id === a.colaboradorId);
                        return (
                          <div key={a.colaboradorId} className="flex items-center gap-3 text-sm font-bold text-slate-700">
                            <div className="w-2 h-2 rounded-full bg-brand-yellow"></div>
                            {colab?.nome_completo}
                            <span className="text-[10px] text-slate-300 ml-auto font-black">{colab?.ldap}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {ausentes.length > 0 && (
              <div className="space-y-6">
                <h3 className="text-xl font-black text-red-500 flex items-center gap-3">
                  <div className="w-1.5 h-6 bg-red-500 rounded-full"></div>
                  Quadro de Ausências
                </h3>
                <div className="flex flex-wrap gap-3">
                  {ausentes.map(c => (
                    <div key={c.id} className="px-4 py-2 bg-red-50 border border-red-100 rounded-xl text-xs font-bold text-red-600">
                      {c.nome_completo} ({c.cargo_base})
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="p-10 bg-slate-50 border-t border-slate-100 print:border-t print:border-black text-center text-slate-300 print:text-black text-[10px] font-black uppercase tracking-[0.5em]">
            Relatório Oficial Performance SRS7 • Gerado em {new Date().toLocaleString()}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-10 animate-in fade-in duration-500">
      <div className="flex items-center justify-center mb-12">
        {[1, 2, 3, 4].map((s) => (
          <React.Fragment key={s}>
            <div className={`
              w-14 h-14 rounded-2xl flex items-center justify-center font-black text-lg transition-all shadow-xl
              ${step === s ? 'bg-brand-yellow text-brand-navy shadow-brand-yellow/20 scale-110' : 
                step > s ? 'bg-emerald-500 text-white' : 'bg-brand-surface text-slate-300 border border-slate-100'}
            `}>
              {step > s ? <CheckCircle2 size={24} /> : s}
            </div>
            {s < 4 && <div className={`w-16 h-1.5 mx-3 rounded-full ${step > s ? 'bg-emerald-500' : 'bg-slate-200'}`}></div>}
          </React.Fragment>
        ))}
      </div>

      <div className="bg-brand-surface rounded-[40px] border border-black/5 shadow-sm overflow-hidden min-h-[600px] flex flex-col">
        <div className="flex-1 p-10">
          {step === 1 && (
            <div className="max-w-md mx-auto space-y-10 py-10 animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="text-center">
                <h2 className="text-3xl font-black text-brand-navy uppercase tracking-tighter mb-3">Definir Operação</h2>
                <p className="text-slate-400 font-medium">Parâmetros básicos do turno</p>
              </div>
              <div className="space-y-8">
                <div className="space-y-3">
                  <label className="text-xs font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                    <Clock size={16} className="text-brand-navy" /> Data da Operação
                  </label>
                  <input 
                    type="date" 
                    className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-brand-yellow outline-none text-brand-navy font-bold" 
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-xs font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                    <MapPin size={16} className="text-brand-navy" /> Local
                  </label>
                  <select 
                    className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-brand-yellow outline-none text-brand-navy font-bold appearance-none"
                    value={selectedLocal}
                    onChange={(e) => setSelectedLocal(e.target.value)}
                  >
                    {LOCAIS_PADRAO.map(l => <option key={l.id} value={l.id}>{l.nome}</option>)}
                  </select>
                </div>
                <div className="space-y-4">
                  <label className="text-xs font-black uppercase tracking-widest text-slate-400">Turno</label>
                  <div className="space-y-3">
                    {TURNOS_PADRAO.map(t => (
                      <button 
                        key={t.id}
                        onClick={() => setSelectedTurno(t.id)}
                        className={`w-full p-5 border-2 rounded-3xl text-left transition-all ${
                          selectedTurno === t.id 
                          ? 'border-brand-yellow bg-brand-yellow/5 text-brand-navy' 
                          : 'border-slate-100 bg-white hover:border-brand-yellow shadow-sm'
                        }`}
                      >
                        <p className="font-black text-lg">{t.nome}</p>
                        <p className="text-xs font-bold opacity-60 uppercase">{t.horario_inicio} às {t.horario_fim}</p>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-8 py-4 animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-3xl font-black text-brand-navy uppercase tracking-tighter">Planejar Ruas</h2>
                  <p className="text-slate-400 font-medium">Volumes previstos para o processamento</p>
                </div>
                <button 
                  onClick={addRua}
                  className="px-6 py-3 bg-brand-navy text-white rounded-2xl flex items-center gap-2 font-bold hover:bg-brand-yellow hover:text-brand-navy transition-all shadow-lg"
                >
                  <Plus size={20} /> Adicionar Rua
                </button>
              </div>

              <div className="bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-sm">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-slate-50">
                      <th className="px-8 py-5 text-xs font-black uppercase tracking-widest text-slate-400">Rua</th>
                      <th className="px-8 py-5 text-xs font-black uppercase tracking-widest text-slate-400 text-center">Gaiolas</th>
                      <th className="px-8 py-5 text-xs font-black uppercase tracking-widest text-slate-400 text-center">Pacotes</th>
                      <th className="px-8 py-5 text-xs font-black uppercase tracking-widest text-slate-400 text-right">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {ruas.map((r, idx) => (
                      <tr key={r.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-8 py-5">
                          <input 
                            type="text" 
                            className="bg-slate-50 border border-slate-100 rounded-xl px-4 py-2 font-black text-brand-navy focus:ring-2 focus:ring-brand-yellow outline-none w-full max-w-[200px]"
                            value={r.nome}
                            onChange={(e) => {
                              const nr = [...ruas];
                              nr[idx].nome = e.target.value;
                              setRuas(nr);
                            }}
                          />
                        </td>
                        <td className="px-8 py-5 text-center">
                          <input 
                            type="number" 
                            className="w-24 text-center bg-slate-50 border border-slate-100 rounded-xl px-4 py-2 font-bold text-slate-700 outline-none"
                            value={r.gaiolas}
                            onChange={(e) => {
                              const nr = [...ruas];
                              nr[idx].gaiolas = parseInt(e.target.value) || 0;
                              setRuas(nr);
                            }}
                          />
                        </td>
                        <td className="px-8 py-5 text-center">
                          <input 
                            type="number" 
                            className="w-32 text-center bg-slate-50 border border-slate-100 rounded-xl px-4 py-2 font-bold text-slate-700 outline-none"
                            value={r.pacotes}
                            onChange={(e) => {
                              const nr = [...ruas];
                              nr[idx].pacotes = parseInt(e.target.value) || 0;
                              setRuas(nr);
                            }}
                          />
                        </td>
                        <td className="px-8 py-5 text-right">
                          <button 
                            onClick={() => setRuas(ruas.filter(item => item.id !== r.id))}
                            className="p-3 text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                          >
                            <Trash2 size={20} />
                          </button>
                        </td>
                      </tr>
                    ))}
                    {ruas.length === 0 && (
                      <tr>
                        <td colSpan={4} className="px-8 py-20 text-center">
                          <div className="flex flex-col items-center gap-4 text-slate-200">
                             <Plus size={48} />
                             <p className="font-bold uppercase tracking-widest text-xs">Nenhuma rua configurada</p>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                  {ruas.length > 0 && (
                    <tfoot className="bg-slate-50/50 font-black text-brand-navy">
                      <tr>
                        <td className="px-8 py-5 uppercase text-[10px] tracking-widest text-slate-400">Totais da Operação</td>
                        <td className="px-8 py-5 text-center">{ruas.reduce((acc, r) => acc + r.gaiolas, 0)} Gaiolas</td>
                        <td className="px-8 py-5 text-center">{ruas.reduce((acc, r) => acc + r.pacotes, 0).toLocaleString()} Pacotes</td>
                        <td></td>
                      </tr>
                    </tfoot>
                  )}
                </table>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-8 py-4 animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-3xl font-black text-brand-navy uppercase tracking-tighter">Confirmar Presença ({turnoInfo?.nome})</h2>
                  <p className="text-slate-400 font-medium">Seleção de efetivo disponível para este turno</p>
                </div>
                <div className="flex gap-4">
                  <span className="px-4 py-2 bg-emerald-50 text-emerald-600 rounded-2xl font-black text-xs uppercase shadow-sm">Disponíveis: {disponiveis.length}</span>
                  <span className="px-4 py-2 bg-red-50 text-red-600 rounded-2xl font-black text-xs uppercase shadow-sm">Ausentes: {absentIds.size}</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {colaboradoresAtivos.map(c => (
                  <button 
                    key={c.id}
                    onClick={() => toggleAbsence(c.id)}
                    className={`
                      p-6 rounded-3xl border-2 flex items-center gap-4 text-left transition-all relative overflow-hidden group
                      ${absentIds.has(c.id) 
                        ? 'border-red-100 bg-red-50/30 grayscale opacity-60 shadow-inner' 
                        : 'border-slate-100 bg-white hover:border-brand-yellow shadow-sm'}
                    `}
                  >
                    <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${absentIds.has(c.id) ? 'bg-red-500 border-red-500 shadow-sm' : 'bg-transparent border-slate-200'}`}>
                      {absentIds.has(c.id) && <X size={16} className="text-white" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-black truncate text-sm text-slate-800 group-hover:text-brand-navy transition-colors">{c.nome_completo}</p>
                      <p className="text-[10px] font-bold text-slate-400 uppercase mt-1 tracking-widest">{c.cargo_base} • {c.operacao}</p>
                    </div>
                  </button>
                ))}
                {colaboradoresAtivos.length === 0 && (
                  <div className="col-span-full py-20 text-center bg-slate-50 rounded-[32px] border border-dashed border-slate-200">
                    <Users size={48} className="mx-auto text-slate-200 mb-4" />
                    <p className="text-slate-400 font-bold uppercase text-xs tracking-widest">Nenhum colaborador encontrado para este turno</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-10 py-4 animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                  <h2 className="text-3xl font-black text-brand-navy uppercase tracking-tighter">Montar Time Ideal ({turnoInfo?.nome})</h2>
                  <p className="text-slate-400 font-medium">Alocação baseada no volume de pacotes e produtividade real</p>
                </div>
                <button 
                  onClick={handleIdealTime}
                  className="px-8 py-4 bg-brand-yellow hover:bg-brand-navy hover:text-white text-brand-navy rounded-3xl font-black uppercase text-xs tracking-widest transition-all shadow-xl shadow-brand-yellow/10 flex items-center gap-3"
                >
                  <Zap size={20} className="fill-current" /> Otimização Automática
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <div className="lg:col-span-3 space-y-6">
                  <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm">
                    <h3 className="font-black text-xs mb-8 flex items-center gap-2 text-slate-300 uppercase tracking-[0.2em]">
                      <Users size={18} className="text-brand-navy" /> Status Equipe
                    </h3>
                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-400 uppercase">Total:</span>
                        <span className="font-black text-xl text-brand-navy">{disponiveis.length}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-400 uppercase">Alocados:</span>
                        <span className="font-black text-xl text-emerald-600">{allocations.length}</span>
                      </div>
                      <div className="w-full h-2 bg-slate-50 rounded-full overflow-hidden">
                        <div className="bg-brand-yellow h-full transition-all duration-1000" style={{ width: `${Math.min(100, (allocations.length / Math.max(1, disponiveis.length)) * 100)}%` }}></div>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 bg-slate-50 border border-slate-100 rounded-[32px] space-y-4">
                     <h4 className="text-[10px] font-black uppercase text-brand-navy/30 tracking-widest">Resumo Volumétrico</h4>
                     <div className="space-y-2">
                        <div className="flex justify-between text-xs text-slate-500">
                           <span className="text-slate-400">Total Pacotes:</span>
                           <span className="font-bold text-brand-navy">{ruas.reduce((acc, r) => acc + r.pacotes, 0).toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-xs text-slate-500">
                           <span className="text-slate-400">Projeção Volumoso:</span>
                           <span className="font-bold text-brand-navy">{(ruas.reduce((acc, r) => acc + r.pacotes, 0) * (settings.percentualVolumeVolumoso / 100)).toLocaleString()}</span>
                        </div>
                     </div>
                  </div>
                </div>

                <div className="lg:col-span-9 grid grid-cols-1 md:grid-cols-2 gap-6">
                  {FUNCOES_PADRAO.filter(f => calculatedVagas[f.id as keyof typeof calculatedVagas] !== undefined).map(func => {
                    const funcAllocations = allocations.filter(a => a.funcaoId === func.id);
                    const capacity = calculatedVagas[func.id as keyof typeof calculatedVagas] || 0;
                    const isFull = funcAllocations.length >= capacity && capacity > 0;

                    return (
                      <div 
                        key={func.id} 
                        className={`
                          relative transition-all duration-300 rounded-[32px] border-2 p-6
                          ${isFull 
                            ? 'bg-emerald-50 border-emerald-100 shadow-sm' 
                            : capacity === 0 ? 'bg-slate-50 border-slate-100 opacity-50' : 'bg-white border-slate-100 hover:border-brand-yellow shadow-sm'}
                        `}
                      >
                        <div className="flex items-center justify-between mb-6">
                          <div className="flex items-center gap-3">
                            <h4 className="font-black text-brand-navy uppercase text-xs tracking-widest">{func.nome}</h4>
                            {func.requer_certificacao && <Lock size={14} className="text-brand-yellow" />}
                          </div>
                          <div className={`text-[10px] font-black px-3 py-1 rounded-full ${isFull ? 'bg-emerald-600 text-white shadow-sm' : 'bg-slate-100 text-slate-500'}`}>
                            {funcAllocations.length} / {capacity}
                          </div>
                        </div>

                        <div className="space-y-3 mb-6">
                          {funcAllocations.map(alloc => {
                            const c = colaboradores.find(col => col.id === alloc.colaboradorId);
                            if (!c) return null;
                            return (
                              <div key={c.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 group/item transition-all hover:bg-white hover:border-brand-yellow shadow-sm">
                                <div className="flex flex-col">
                                  <span className="font-bold text-xs truncate pr-2 text-slate-700 group-hover/item:text-brand-navy">{c.nome_completo}</span>
                                  <span className="text-[9px] font-black text-slate-300 uppercase tracking-tighter">{c.operacao}</span>
                                </div>
                                <button 
                                  onClick={() => removeAllocation(c.id)}
                                  className="text-slate-300 hover:text-red-500 transition-colors"
                                >
                                  <Trash2 size={16} />
                                </button>
                              </div>
                            );
                          })}
                        </div>

                        {(!isFull && capacity > 0) && (
                          <button 
                            onClick={() => setSelectingForFuncao(func.id)}
                            className="w-full py-4 border-2 border-dashed border-slate-100 rounded-2xl flex items-center justify-center gap-3 text-slate-300 hover:text-brand-navy hover:border-brand-navy/30 transition-all text-xs font-black uppercase tracking-widest"
                          >
                            <UserPlus size={18} /> Adicionar
                          </button>
                        )}
                        
                        {capacity === 0 && (
                          <div className="text-center py-4 text-[10px] text-slate-300 uppercase font-black">
                             Sem vagas calculadas
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="px-10 py-8 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
          <button 
            disabled={step === 1}
            onClick={() => setStep(step - 1)}
            className="px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-3 hover:bg-white transition-all disabled:opacity-10 text-slate-400"
          >
            <ArrowLeft size={20} /> Voltar
          </button>
          
          <div className="flex gap-4">
            {step === 4 ? (
              <button 
                onClick={finalizePlanning}
                disabled={allocations.length === 0}
                className="px-10 py-4 bg-brand-yellow hover:bg-brand-navy hover:text-white text-brand-navy rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-xl shadow-brand-yellow/20 flex items-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Finalizar Escala <LayoutDashboard size={20} />
              </button>
            ) : (
              <button 
                onClick={() => setStep(step + 1)}
                className="px-10 py-4 bg-brand-yellow hover:bg-brand-navy hover:text-white text-brand-navy rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-xl shadow-brand-yellow/10 flex items-center gap-3"
              >
                Próximo <ArrowRight size={20} />
              </button>
            )}
          </div>
        </div>
      </div>

      {selectingForFuncao && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-brand-navy/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-2xl rounded-[40px] shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[85vh]">
            <div className="p-10 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-black text-brand-navy uppercase tracking-tighter">Selecionar Membro ({turnoInfo?.nome})</h3>
                <p className="text-sm font-bold text-slate-300 uppercase mt-1">
                  Alocação: <span className="text-brand-navy">
                    {FUNCOES_PADRAO.find(f => f.id === selectingForFuncao)?.nome}
                  </span>
                </p>
              </div>
              <button 
                onClick={() => setSelectingForFuncao(null)}
                className="p-3 hover:bg-slate-50 rounded-full text-slate-300 transition-colors"
              >
                <X size={28} />
              </button>
            </div>

            <div className="p-6">
              <div className="relative">
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300" size={24} />
                <input 
                  autoFocus
                  type="text"
                  placeholder="Buscar colaborador..."
                  className="w-full pl-16 pr-8 py-5 bg-slate-50 border-none rounded-[24px] focus:ring-2 focus:ring-brand-yellow text-slate-800 font-bold text-lg shadow-sm outline-none"
                  value={searchTermPool}
                  onChange={(e) => setSearchTermPool(e.target.value)}
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-3">
              {poolNaoAlocado
                .filter(c => c.nome_completo.toLowerCase().includes(searchTermPool.toLowerCase()))
                .sort((a, b) => calculateAdequacyScore(b, selectingForFuncao!, settings) - calculateAdequacyScore(a, selectingForFuncao!, settings))
                .map(c => {
                  const score = calculateAdequacyScore(c, selectingForFuncao!, settings);
                  const funcNome = FUNCOES_PADRAO.find(f => f.id === selectingForFuncao)?.nome || '';
                  const isVolumosoMatch = funcNome.toLowerCase().includes('volumoso') && c.operacao === 'VOLUMOSO';
                  
                  return (
                    <button 
                      key={c.id}
                      onClick={() => allocateColaborador(c.id, selectingForFuncao!)}
                      className={`
                        w-full p-6 rounded-3xl border flex items-center justify-between transition-all group shadow-sm
                        ${isVolumosoMatch ? 'bg-brand-yellow/5 border-brand-yellow/40' : 'bg-white border-slate-100 hover:border-brand-yellow hover:bg-slate-50'}
                      `}
                    >
                      <div className="text-left flex-1">
                        <div className="flex items-center gap-2">
                          <p className="font-black text-slate-800 group-hover:text-brand-navy transition-colors">{c.nome_completo}</p>
                          {isVolumosoMatch && (
                            <span className="px-2 py-0.5 bg-brand-navy text-white text-[8px] font-black uppercase rounded-lg shadow-sm">
                              Match Equipe
                            </span>
                          )}
                        </div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase mt-1 tracking-widest">{c.cargo_base} • {c.operacao}</p>
                      </div>
                      <div className="text-right flex flex-col items-end gap-1">
                         <span className="text-[10px] font-black text-slate-300 uppercase tracking-tighter">Adequação</span>
                         <span className="font-black text-brand-navy flex items-center gap-1">
                            <Zap size={14} className="fill-current text-brand-yellow" /> {score.toFixed(0)}%
                         </span>
                      </div>
                    </button>
                  );
                })}
              {poolNaoAlocado.length === 0 && (
                <div className="text-center py-10">
                  <p className="text-slate-400 font-bold uppercase text-xs tracking-widest">Todos os membros disponíveis já foram alocados</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Planner;
