
import { Colaborador, ExperienciaFuncao, ConfiguracoesOperacionais } from '../types';
import { FUNCOES_PADRAO } from '../constants';

/**
 * RN005: Score de Adequação Dinâmico
 * Score = (Produtividade × PesoPerformance/100) + (Experiência × PesoExperiencia/100)
 */
export const calculateAdequacyScore = (
  colaborador: Colaborador, 
  funcaoId: string, 
  settings?: ConfiguracoesOperacionais
): number => {
  const pesoPerf = settings?.pesoPerformance ?? 70;
  const pesoExp = settings?.pesoExperiencia ?? 30;

  const exp = colaborador.experiencia_por_funcao.find(e => e.funcao_id === funcaoId);
  const nivelExp = exp ? exp.nivel_experiencia : 0;
  const convertedExp = nivelExp * 20; // 0-5 -> 0-100

  const funcao = FUNCOES_PADRAO.find(f => f.id === funcaoId);
  const isSorting = funcao?.nome.toLowerCase().includes('sorting');

  // Cálculo da Eficiência Específica
  let efficiencyScore = colaborador.eficiencia;
  
  if (isSorting) {
    // Normalizamos 200 PHH como 100 de score básico
    efficiencyScore = Math.min(100, (colaborador.phh_efetivo / 200) * 100);
  }

  let baseScore = (efficiencyScore * (pesoPerf / 100)) + (convertedExp * (pesoExp / 100));

  // Lógica de Priorização por Operação
  if (funcao) {
    const isFuncaoVolumoso = funcao.nome.toLowerCase().includes('volumoso');
    
    if (isFuncaoVolumoso && colaborador.operacao === 'VOLUMOSO') {
      baseScore += 30; 
    }
    else if (!isFuncaoVolumoso && colaborador.operacao === 'CONVENCIONAL') {
      baseScore += 5;
    }
    else if (isFuncaoVolumoso && colaborador.operacao === 'CONVENCIONAL') {
      baseScore -= 20;
    }
  }

  return Math.max(0, Math.min(100, baseScore));
};

export interface SuggestionParams {
  colaboradoresDisponiveis: Colaborador[];
  vagasPorFuncao: { [funcaoId: string]: number };
  priorizar: 'EFICIENCIA' | 'EQUILIBRIO' | 'CARGA';
  settings: ConfiguracoesOperacionais;
}

export const generateIdealTimeSuggestion = (params: SuggestionParams) => {
  const { colaboradoresDisponiveis, vagasPorFuncao, settings } = params;
  const allocations: { funcaoId: string; colaboradorId: string }[] = [];
  
  let pool = [...colaboradoresDisponiveis];

  const sortedFuncaoIds = Object.keys(vagasPorFuncao).sort((a, b) => {
    const fA = FUNCOES_PADRAO.find(f => f.id === a)?.nome || '';
    const fB = FUNCOES_PADRAO.find(f => f.id === b)?.nome || '';
    const isSortA = fA.toLowerCase().includes('sorting');
    const isSortB = fB.toLowerCase().includes('sorting');
    if (isSortA && !isSortB) return -1;
    if (!isSortA && isSortB) return 1;
    return 0;
  });

  for (const fId of sortedFuncaoIds) {
    const numVagas = vagasPorFuncao[fId];
    
    for (let i = 0; i < numVagas; i++) {
      if (pool.length === 0) break;

      const bestFit = pool.reduce((best, current) => {
        const scoreBest = calculateAdequacyScore(best, fId, settings);
        const scoreCurrent = calculateAdequacyScore(current, fId, settings);
        return scoreCurrent > scoreBest ? current : best;
      }, pool[0]);

      allocations.push({ funcaoId: fId, colaboradorId: bestFit.id });
      pool = pool.filter(p => p.id !== bestFit.id);
    }
  }

  return allocations;
};
