
import React, { useState, useMemo } from 'react';
import { 
  User, 
  Star, 
  MessageSquare, 
  Search, 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle2, 
  Info,
  Target,
  Trophy,
  Users,
  AlertCircle
} from 'lucide-react';
import { Colaborador } from '../types';

interface EvaluationData {
  qualidade: number;
  pontualidade: number;
  efetividade: number;
  responsabilidade: number;
  comportamento: number;
  resiliencia: number;
}

interface FeedbackProps {
  colaboradores: Colaborador[];
}

const Feedback: React.FC<FeedbackProps> = ({ colaboradores }) => {
  const [step, setStep] = useState(1);
  const [selectedColabId, setSelectedColabId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [evaluation, setEvaluation] = useState<EvaluationData>({
    qualidade: 5,
    pontualidade: 5,
    efetividade: 5,
    responsabilidade: 5,
    comportamento: 5,
    resiliencia: 5
  });

  const selectedColab = useMemo(() => 
    colaboradores.find(c => c.id === selectedColabId), [colaboradores, selectedColabId]
  );

  const filteredColabs = useMemo(() => 
    colaboradores.filter(c => 
      c.nome_completo.toLowerCase().includes(searchTerm.toLowerCase())
    ).slice(0, 5), [colaboradores, searchTerm]
  );

  const criteriaInfo = [
    { key: 'qualidade', label: 'Qualidade', desc: 'Reflete o cuidado com os pacotes e a ausência de erros no processo.', icon: Target },
    { key: 'pontualidade', label: 'Pontualidade', desc: 'Cumprimento rigoroso de horários e agilidade no início das atividades.', icon: AlertCircle },
    { key: 'efetividade', label: 'Efetividade', desc: 'Capacidade de converter esforço em produção real (PHH).', icon: Target },
    { key: 'responsabilidade', label: 'Responsabilidade', desc: 'Comprometimento com as tarefas delegadas e cuidado com equipamentos.', icon: AlertCircle },
    { key: 'comportamento', label: 'Comportamento', desc: 'Atitude positiva e respeito com colegas e cultura SRS7.', icon: Users },
    { key: 'resiliencia', label: 'Resiliência', desc: 'Capacidade de manter a performance sob alta pressão.', icon: Trophy },
  ];

  const feedbackQuestions = [
    { category: 'Clareza e Prioridades', questions: [
      { id: 'q1', text: 'Em uma escala de 0–10, o quão claro está o que é “sucesso” para o time neste ciclo? O que falta para ficar 10?' },
      { id: 'q2', text: 'O que estamos fazendo hoje que não deveria estar na nossa lista de prioridades? E o que está faltando?' }
    ]},
    { category: 'Valor e Performance', questions: [
      { id: 'q3', text: 'Qual entrega recente gerou mais valor real para cliente/negócio? Como sabemos?' },
      { id: 'q4', text: 'Estamos equilibrando bem qualidade e velocidade? Onde estamos pagando “juros”?' }
    ]}
  ];

  const handleSave = () => {
    alert('Feedback e Avaliação salvos com sucesso no perfil do colaborador!');
    setStep(1);
    setSelectedColabId(null);
  };

  const calculateGlobalAverage = () => {
    const values = Object.values(evaluation) as number[];
    return (values.reduce((a, b) => a + b, 0) / values.length).toFixed(1);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500 pb-20">
      {!selectedColabId ? (
        <div className="bg-brand-surface p-12 rounded-[40px] border border-black/5 shadow-sm text-center space-y-8">
          <div className="w-20 h-20 bg-brand-yellow/20 text-brand-navy rounded-3xl flex items-center justify-center mx-auto shadow-xl">
            <User size={40} />
          </div>
          <div>
            <h2 className="text-3xl font-black text-brand-navy uppercase tracking-tighter">Novo Ciclo de Feedback</h2>
            <p className="text-slate-400 font-medium">Selecione um colaborador da base SRS7 para iniciar</p>
          </div>
          <div className="max-w-md mx-auto relative">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
            <input 
              type="text" 
              placeholder="Buscar por nome..." 
              className="w-full pl-14 pr-6 py-5 bg-slate-50 border-none rounded-3xl focus:ring-2 focus:ring-brand-yellow font-bold text-slate-800 outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && filteredColabs.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-3 bg-white border border-slate-100 rounded-2xl shadow-2xl z-50 overflow-hidden divide-y divide-slate-50">
                {filteredColabs.map(c => (
                  <button 
                    key={c.id} 
                    onClick={() => setSelectedColabId(c.id)}
                    className="w-full px-6 py-4 flex items-center justify-between hover:bg-slate-50 transition-colors group"
                  >
                    <div className="text-left">
                      <p className="font-black text-slate-800 group-hover:text-brand-navy">{c.nome_completo}</p>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{c.ldap} • {c.cargo_base}</p>
                    </div>
                    <ArrowRight size={18} className="text-slate-200 group-hover:text-brand-yellow" />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="space-y-10">
          <div className="flex items-center justify-between">
            <button 
              onClick={() => setSelectedColabId(null)}
              className="flex items-center gap-2 text-slate-400 hover:text-brand-navy font-black text-[10px] uppercase tracking-widest transition-colors"
            >
              <ArrowLeft size={16} /> Trocar Colaborador
            </button>
            <div className="flex items-center gap-4 bg-brand-surface px-6 py-3 rounded-2xl border border-black/5 shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-brand-yellow flex items-center justify-center font-black text-brand-navy text-xs uppercase">
                {selectedColab?.ldap.split('_').pop()?.substring(0, 2)}
              </div>
              <div className="text-left">
                <p className="text-xs font-black text-brand-navy uppercase tracking-tighter">{selectedColab?.nome_completo}</p>
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{selectedColab?.cargo_base} • {selectedColab?.contrato_fornecedor}</p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center gap-4">
             <div className={`flex items-center gap-3 px-6 py-3 rounded-2xl transition-all ${step === 1 ? 'bg-brand-navy text-white shadow-xl' : 'bg-slate-50 text-slate-300'}`}>
               <Star size={18} /> <span className="text-[10px] font-black uppercase tracking-widest">Etapa 1: Avaliação Quantitativa</span>
             </div>
             <div className="w-8 h-0.5 bg-slate-100 rounded-full"></div>
             <div className={`flex items-center gap-3 px-6 py-3 rounded-2xl transition-all ${step === 2 ? 'bg-brand-navy text-white shadow-xl' : 'bg-slate-50 text-slate-300'}`}>
               <MessageSquare size={18} /> <span className="text-[10px] font-black uppercase tracking-widest">Etapa 2: Conversa 1a1</span>
             </div>
          </div>

          {step === 1 && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in slide-in-from-right-4 duration-300">
              <div className="lg:col-span-8 space-y-4">
                {criteriaInfo.map((item) => (
                  <div key={item.key} className="bg-brand-surface p-8 rounded-[32px] border border-black/5 shadow-sm space-y-6 group">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-slate-50 text-brand-navy rounded-xl group-hover:bg-brand-yellow/10 transition-colors">
                          <item.icon size={20} />
                        </div>
                        <h4 className="font-black text-brand-navy uppercase text-xs tracking-widest">{item.label}</h4>
                      </div>
                      <span className="text-2xl font-black text-brand-navy">{evaluation[item.key as keyof EvaluationData]}<span className="text-xs text-slate-300">/10</span></span>
                    </div>
                    <input 
                      type="range" 
                      min="1" 
                      max="10" 
                      step="1"
                      className="w-full h-2 bg-slate-100 rounded-full appearance-none cursor-pointer accent-brand-yellow"
                      value={evaluation[item.key as keyof EvaluationData]}
                      onChange={(e) => setEvaluation({...evaluation, [item.key]: parseInt(e.target.value)})}
                    />
                    <div className="p-4 bg-slate-50/50 rounded-2xl border border-slate-50 flex gap-4">
                       <Info size={16} className="text-brand-yellow shrink-0 mt-0.5" />
                       <p className="text-[10px] font-medium text-slate-400 leading-relaxed italic">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="lg:col-span-4 space-y-6">
                 <div className="bg-brand-navy p-8 rounded-[40px] text-white shadow-2xl relative overflow-hidden">
                    <div className="absolute -right-10 -bottom-10 opacity-10">
                      <Trophy size={200} />
                    </div>
                    <h3 className="text-xl font-black uppercase tracking-tighter mb-4">Média Global</h3>
                    <p className="text-6xl font-black text-brand-yellow">
                      {calculateGlobalAverage()}
                    </p>
                    <p className="text-[10px] font-bold text-white/40 uppercase tracking-[0.2em] mt-2">Performance Atualizada</p>
                    <div className="mt-8 space-y-3">
                      <div className="flex justify-between text-[10px] font-black uppercase">
                        <span className="text-white/40">Status</span>
                        <span className="text-emerald-400">Excelente</span>
                      </div>
                      <div className="w-full h-1 bg-white/10 rounded-full">
                        <div className="bg-emerald-400 h-full rounded-full" style={{ width: '85%' }}></div>
                      </div>
                    </div>
                 </div>
                 <button 
                  onClick={() => setStep(2)}
                  className="w-full py-6 bg-brand-yellow hover:bg-brand-navy hover:text-white text-brand-navy rounded-[32px] font-black uppercase text-xs tracking-[0.2em] transition-all shadow-xl shadow-brand-yellow/20 flex items-center justify-center gap-3"
                 >
                   Ir para 1a1 <ArrowRight size={20} />
                 </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-10 animate-in slide-in-from-right-4 duration-300">
              {feedbackQuestions.map((category, idx) => (
                <div key={idx} className="space-y-6">
                  <h3 className="text-lg font-black text-brand-navy flex items-center gap-3 uppercase tracking-tighter">
                    <div className="w-1.5 h-6 bg-brand-yellow rounded-full shadow-sm"></div>
                    {category.category}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {category.questions.map(q => (
                      <div key={q.id} className="bg-brand-surface p-8 rounded-[32px] border border-black/5 shadow-sm space-y-4">
                        <label className="text-[11px] font-bold text-slate-500 leading-relaxed block min-h-[40px]">
                          {q.text}
                        </label>
                        <textarea 
                          placeholder="Digite aqui as observações da conversa..."
                          className="w-full p-6 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-brand-yellow text-slate-700 font-medium text-sm min-h-[120px] resize-none outline-none"
                        ></textarea>
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              <div className="flex gap-4 pt-10">
                <button 
                  onClick={() => setStep(1)}
                  className="flex-1 py-6 bg-white border border-slate-200 text-slate-400 rounded-[32px] font-black uppercase text-xs tracking-[0.2em] hover:bg-slate-50 transition-all"
                >
                  Voltar para Notas
                </button>
                <button 
                  onClick={handleSave}
                  className="flex-[2] py-6 bg-brand-navy text-white rounded-[32px] font-black uppercase text-xs tracking-[0.2em] hover:bg-brand-yellow hover:text-brand-navy transition-all shadow-2xl flex items-center justify-center gap-3"
                >
                  Concluir Ciclo de Feedback <CheckCircle2 size={20} />
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Feedback;
