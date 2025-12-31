
import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  Download, 
  Eye, 
  Edit2, 
  ChevronLeft, 
  ChevronRight,
  Layers,
  Box
} from 'lucide-react';
import { Colaborador, Operacao } from '../types';

interface PeopleProps {
  colaboradores: Colaborador[];
  onUpdateColaborador: (id: string, updates: Partial<Colaborador>) => void;
}

const People: React.FC<PeopleProps> = ({ colaboradores, onUpdateColaborador }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterOperacao, setFilterOperacao] = useState<Operacao | 'TODOS'>('TODOS');

  const filtered = colaboradores.filter(c => {
    const matchesSearch = c.nome_completo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         c.cpf.includes(searchTerm) ||
                         c.ldap.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesOperacao = filterOperacao === 'TODOS' || c.operacao === filterOperacao;

    return matchesSearch && matchesOperacao;
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-brand-navy uppercase tracking-tighter">Equipe Ativa</h1>
          <p className="text-slate-400 font-medium">Gestão centralizada de colaboradores e competências</p>
        </div>
        <button className="flex items-center justify-center gap-3 px-8 py-4 bg-brand-yellow hover:bg-brand-navy hover:text-white text-brand-navy rounded-2xl font-black uppercase text-xs tracking-widest transition-all shadow-xl shadow-brand-yellow/10">
          <Plus size={20} /> Novo Colaborador
        </button>
      </div>

      <div className="bg-brand-surface rounded-[40px] border border-black/5 shadow-sm overflow-hidden">
        {/* Toolbar */}
        <div className="p-8 border-b border-black/5 flex flex-col md:flex-row gap-6 items-center justify-between">
          <div className="relative w-full md:w-[450px]">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
            <input 
              type="text" 
              placeholder="Pesquisar por nome, CPF ou LDAP..." 
              className="w-full pl-16 pr-8 py-5 bg-slate-50 border-none rounded-3xl focus:ring-2 focus:ring-brand-yellow text-slate-800 font-bold shadow-sm outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-4 w-full md:w-auto">
            <div className="flex bg-slate-100 p-1.5 rounded-2xl border border-slate-200 shadow-inner">
               <button 
                onClick={() => setFilterOperacao('TODOS')}
                className={`px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${filterOperacao === 'TODOS' ? 'bg-brand-navy text-white shadow-lg' : 'text-slate-400 hover:text-slate-600'}`}
               >
                 Todos
               </button>
               <button 
                onClick={() => setFilterOperacao('CONVENCIONAL')}
                className={`px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${filterOperacao === 'CONVENCIONAL' ? 'bg-brand-navy text-white shadow-lg' : 'text-slate-400 hover:text-slate-600'}`}
               >
                 Convencional
               </button>
               <button 
                onClick={() => setFilterOperacao('VOLUMOSO')}
                className={`px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${filterOperacao === 'VOLUMOSO' ? 'bg-brand-navy text-white shadow-lg' : 'text-slate-400 hover:text-slate-600'}`}
               >
                 Volumoso
               </button>
            </div>
            <button className="flex items-center justify-center gap-3 px-6 py-4 border border-slate-200 rounded-2xl text-xs font-black uppercase tracking-widest text-slate-500 hover:bg-slate-50 transition-all">
              <Download size={18} /> Exportar
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Colaborador</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Cargo</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Seleção de Time</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Status</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Eficiência</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map(c => (
                <tr key={c.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-8 py-6">
                    <div>
                      <p className="text-sm font-black text-slate-800">{c.nome_completo}</p>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">{c.ldap} • {c.cpf}</p>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className="text-xs font-bold text-slate-600 uppercase">{c.cargo_base}</span>
                  </td>
                  <td className="px-8 py-6">
                    {/* Select box for Operation */}
                    <div className="relative w-48">
                      <select 
                        value={c.operacao}
                        onChange={(e) => onUpdateColaborador(c.id, { operacao: e.target.value as Operacao })}
                        className={`
                          w-full appearance-none pl-10 pr-4 py-3 rounded-xl text-[10px] font-black uppercase tracking-tighter border-2 outline-none transition-all cursor-pointer
                          ${c.operacao === 'VOLUMOSO' 
                            ? 'bg-brand-yellow/10 border-brand-yellow/30 text-brand-navy ring-brand-yellow/20' 
                            : 'bg-slate-50 border-slate-100 text-slate-500 hover:border-slate-200'}
                        `}
                      >
                        <option value="CONVENCIONAL">Convencional</option>
                        <option value="VOLUMOSO">Volumoso</option>
                      </select>
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none transition-transform group-hover:scale-110">
                        {c.operacao === 'VOLUMOSO' 
                          ? <Box size={16} className="text-brand-navy" /> 
                          : <Layers size={16} className="text-slate-400" />
                        }
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    {c.em_ferias === 'SIM' ? (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black bg-amber-50 text-amber-600 uppercase tracking-tighter">
                        🏖️ Férias
                      </span>
                    ) : c.ativo === 'SIM' ? (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black bg-emerald-50 text-emerald-600 uppercase tracking-tighter">
                        ✅ Ativo
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black bg-slate-50 text-slate-300 uppercase tracking-tighter">
                        ❌ Inativo
                      </span>
                    )}
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-20 h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full transition-all duration-500 ${c.eficiencia > 80 ? 'bg-brand-navy' : c.eficiencia > 50 ? 'bg-blue-500' : 'bg-red-500'}`} 
                          style={{ width: `${c.eficiencia}%` }}
                        ></div>
                      </div>
                      <span className="text-xs font-black text-brand-navy">{c.eficiencia}%</span>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
                      <button className="p-2.5 bg-slate-50 text-slate-400 hover:text-brand-navy hover:bg-slate-100 rounded-xl transition-colors">
                        <Eye size={18} />
                      </button>
                      <button className="p-2.5 bg-slate-50 text-slate-400 hover:text-brand-navy hover:bg-slate-100 rounded-xl transition-colors">
                        <Edit2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-8 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
          <span className="text-xs font-bold text-slate-300 uppercase tracking-widest">
            {filtered.length} Registros encontrados
          </span>
          <div className="flex items-center gap-2">
            <button className="p-2 border border-slate-200 rounded-xl text-slate-300 hover:text-slate-600 transition-colors">
              <ChevronLeft size={20} />
            </button>
            <button className="w-10 h-10 bg-brand-yellow text-brand-navy rounded-xl font-black text-sm shadow-md">1</button>
            <button className="w-10 h-10 border border-slate-200 text-slate-400 hover:bg-white rounded-xl font-black text-sm transition-colors">2</button>
            <button className="p-2 border border-slate-200 rounded-xl text-slate-300 hover:text-slate-600 transition-colors">
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default People;
