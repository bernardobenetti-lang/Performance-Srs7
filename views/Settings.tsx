
import React from 'react';
import { 
  Settings as SettingsIcon, 
  Cpu, 
  Box, 
  Layers, 
  Zap, 
  Users, 
  Save,
  RotateCcw,
  Hash,
  Percent,
  Activity,
  ShieldCheck as ShieldCheckIcon
} from 'lucide-react';
import { ConfiguracoesOperacionais } from '../types';

interface SettingsProps {
  settings: ConfiguracoesOperacionais;
  onUpdateSettings: (settings: ConfiguracoesOperacionais) => void;
}

const Settings: React.FC<SettingsProps> = ({ settings, onUpdateSettings }) => {
  const handleChange = (key: keyof ConfiguracoesOperacionais, value: number) => {
    // Garantir que valores não sejam negativos
    const safeValue = isNaN(value) ? 0 : Math.max(0, value);
    
    if (key === 'pesoPerformance') {
      const perf = Math.min(100, safeValue);
      onUpdateSettings({ ...settings, pesoPerformance: perf, pesoExperiencia: 100 - perf });
    } else if (key === 'pesoExperiencia') {
      const exp = Math.min(100, safeValue);
      onUpdateSettings({ ...settings, pesoExperiencia: exp, pesoPerformance: 100 - exp });
    } else {
      onUpdateSettings({ ...settings, [key]: safeValue });
    }
  };

  const resetToDefault = () => {
    onUpdateSettings({
      limitePacotesPorPessoaSorting: 1500,
      percentualVolumeVolumoso: 10,
      phhMetaVolumoso: 150,
      vagasInducaoPadrao: 5,
      vagasEtiquetagemPadrao: 2,
      vagasPescaPadrao: 1, // Não utilizado na lógica dinâmica de ruas
      pesoPerformance: 70,
      pesoExperiencia: 30
    });
  };

  return (
    <div className="max-w-6xl mx-auto space-y-10 animate-in fade-in duration-500 pb-20">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-brand-navy uppercase tracking-tighter">Painel de Controle</h1>
          <p className="text-slate-400 font-medium">Configure os parâmetros matemáticos do SRS7</p>
        </div>
        <button 
          onClick={resetToDefault}
          className="flex items-center gap-2 px-6 py-3 border border-slate-200 text-slate-400 hover:text-brand-navy hover:bg-white rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all"
        >
          <RotateCcw size={16} /> Restaurar Padrões
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Card 1: Dimensionamento Convencional */}
        <div className="bg-white p-10 rounded-[40px] border border-black/5 shadow-sm space-y-8">
          <div className="flex items-center gap-4 text-brand-navy">
            <div className="p-3 bg-brand-navy text-brand-yellow rounded-2xl">
              <Layers size={24} />
            </div>
            <div>
              <h3 className="text-lg font-black uppercase tracking-tighter">Cálculo Convencional</h3>
              <p className="text-[10px] font-bold text-slate-400 uppercase">Regras por Rua (Sorting)</p>
            </div>
          </div>
          
          <div className="space-y-4">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Capacidade por Operador (Limite)</label>
            <div className="relative">
              <input 
                type="number" 
                className="w-full p-5 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-brand-yellow outline-none font-black text-brand-navy text-xl transition-all"
                value={settings.limitePacotesPorPessoaSorting}
                onChange={(e) => handleChange('limitePacotesPorPessoaSorting', parseInt(e.target.value))}
              />
              <span className="absolute right-6 top-1/2 -translate-y-1/2 text-xs font-black text-slate-300 uppercase">Pacotes / Pessoa</span>
            </div>
            <p className="text-[10px] text-slate-400 font-medium italic">Acima deste valor, o sistema aloca 2 pessoas por rua automaticamente.</p>
          </div>
        </div>

        {/* Card 2: Dimensionamento Volumoso */}
        <div className="bg-white p-10 rounded-[40px] border border-black/5 shadow-sm space-y-8">
          <div className="flex items-center gap-4 text-brand-navy">
            <div className="p-3 bg-brand-navy text-brand-yellow rounded-2xl">
              <Box size={24} />
            </div>
            <div>
              <h3 className="text-lg font-black uppercase tracking-tighter">Cálculo Volumoso</h3>
              <p className="text-[10px] font-bold text-slate-400 uppercase">Projeção por Volume Global</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Mix Estimado (%)</label>
              <div className="relative">
                <input 
                  type="number" 
                  className="w-full p-5 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-brand-yellow outline-none font-black text-brand-navy text-xl transition-all"
                  value={settings.percentualVolumeVolumoso}
                  onChange={(e) => handleChange('percentualVolumeVolumoso', parseInt(e.target.value))}
                />
                <Percent size={16} className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-200" />
              </div>
            </div>
            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">PHH Meta</label>
              <div className="relative">
                <input 
                  type="number" 
                  className="w-full p-5 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-brand-yellow outline-none font-black text-brand-navy text-xl transition-all"
                  value={settings.phhMetaVolumoso}
                  onChange={(e) => handleChange('phhMetaVolumoso', parseInt(e.target.value))}
                />
                <Activity size={16} className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-200" />
              </div>
            </div>
          </div>
        </div>

        {/* Card 3: Postos Fixos */}
        <div className="bg-white p-10 rounded-[40px] border border-black/5 shadow-sm space-y-8">
          <div className="flex items-center gap-4 text-brand-navy">
            <div className="p-3 bg-brand-navy text-brand-yellow rounded-2xl">
              <Users size={24} />
            </div>
            <div>
              <h3 className="text-lg font-black uppercase tracking-tighter">Postos Operacionais</h3>
              <p className="text-[10px] font-bold text-slate-400 uppercase">Vagas Fixas e Dinâmicas</p>
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block text-center">Indução</label>
              <input 
                type="number" 
                className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-brand-yellow outline-none font-black text-brand-navy text-lg text-center"
                value={settings.vagasInducaoPadrao}
                onChange={(e) => handleChange('vagasInducaoPadrao', parseInt(e.target.value))}
              />
            </div>
            <div className="space-y-2">
              <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block text-center">Etiqueta.</label>
              <input 
                type="number" 
                className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-brand-yellow outline-none font-black text-brand-navy text-lg text-center"
                value={settings.vagasEtiquetagemPadrao}
                onChange={(e) => handleChange('vagasEtiquetagemPadrao', parseInt(e.target.value))}
              />
            </div>
            <div className="space-y-2">
              <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block text-center">Pesca</label>
              <div className="w-full h-[60px] bg-slate-100 rounded-2xl border-2 border-slate-200 font-black text-slate-400 text-[10px] uppercase text-center flex items-center justify-center p-2 leading-tight">
                Automático<br/>1 / Rua
              </div>
            </div>
          </div>
        </div>

        {/* Card 4: Inteligência de Match */}
        <div className="bg-white p-10 rounded-[40px] border border-black/5 shadow-sm space-y-8">
          <div className="flex items-center gap-4 text-brand-navy">
            <div className="p-3 bg-brand-navy text-brand-yellow rounded-2xl">
              <Cpu size={24} />
            </div>
            <div>
              <h3 className="text-lg font-black uppercase tracking-tighter">Critérios de Escolha</h3>
              <p className="text-[10px] font-bold text-slate-400 uppercase">Peso Total deve somar 100%</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <Zap size={14} className="text-brand-yellow" /> Performance (PHH)
              </label>
              <div className="relative">
                <input 
                  type="number" 
                  max="100"
                  className="w-full p-5 bg-brand-navy/5 border-2 border-brand-navy/10 rounded-2xl focus:border-brand-navy outline-none font-black text-brand-navy text-xl transition-all"
                  value={settings.pesoPerformance}
                  onChange={(e) => handleChange('pesoPerformance', parseInt(e.target.value))}
                />
                <span className="absolute right-6 top-1/2 -translate-y-1/2 font-black text-brand-navy/20">%</span>
              </div>
            </div>
            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <Users size={14} className="text-brand-navy" /> Maturidade Técnica
              </label>
              <div className="relative">
                <input 
                  type="number" 
                  max="100"
                  className="w-full p-5 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-brand-yellow outline-none font-black text-brand-navy text-xl transition-all"
                  value={settings.pesoExperiencia}
                  onChange={(e) => handleChange('pesoExperiencia', parseInt(e.target.value))}
                />
                <span className="absolute right-6 top-1/2 -translate-y-1/2 font-black text-slate-300">%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-brand-navy p-10 rounded-[40px] flex items-center justify-between text-white shadow-xl">
        <div className="flex items-center gap-6">
          <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center">
            <ShieldCheckIcon size={32} className="text-brand-yellow" />
          </div>
          <div>
            <h4 className="text-xl font-black uppercase tracking-tighter">Salvamento Automático Ativo</h4>
            <p className="text-sm font-bold opacity-60">As configurações são aplicadas imediatamente ao motor de cálculo.</p>
          </div>
        </div>
        <div className="flex items-center gap-3 bg-white/5 px-6 py-4 rounded-2xl border border-white/10">
           <Hash size={16} className="text-brand-yellow" />
           <span className="text-[10px] font-black uppercase tracking-widest">Versão Algoritmo v3.1</span>
        </div>
      </div>
    </div>
  );
};

export default Settings;
