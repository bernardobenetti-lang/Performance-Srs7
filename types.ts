
export type Genero = 'MASCULINO' | 'FEMININO' | 'OUTRO' | 'NÃO INFORMADO';
export type SimNao = 'SIM' | 'NÃO';
export type DiaSemana = 'DOMINGO' | 'SEGUNDA' | 'TERÇA' | 'QUARTA' | 'QUINTA' | 'SEXTA' | 'SÁBADO';
export type StatusEscala = 'RASCUNHO' | 'PUBLICADA' | 'ARQUIVADA';
export type TipoAlocacao = 'COLABORADOR' | 'DIARISTA';
export type Operacao = 'CONVENCIONAL' | 'VOLUMOSO';

export interface ConfiguracoesOperacionais {
  limitePacotesPorPessoaSorting: number;
  percentualVolumeVolumoso: number;
  phhMetaVolumoso: number;
  vagasInducaoPadrao: number;
  vagasEtiquetagemPadrao: number;
  vagasPescaPadrao: number;
  pesoPerformance: number; // 0 a 100
  pesoExperiencia: number; // 0 a 100
}

export interface ExperienciaFuncao {
  funcao_id: string;
  nivel_experiencia: number; // 0 a 5
  horas_trabalhadas?: number;
  ultima_atuacao?: string;
}

export interface Colaborador {
  id: string;
  nome_completo: string;
  cpf: string;
  data_nascimento: string;
  genero: Genero;
  contrato_fornecedor: string;
  cargo_base: string;
  data_admissao: string;
  ativo: SimNao;
  em_ferias: SimNao;
  gestor_imediato: string;
  escala_padrao: string;
  dsr_dia: DiaSemana;
  ldap: string;
  id_groot: string;
  custo_hora: number;
  eficiencia: number; // 0-100 (legado/geral)
  phh_efetivo: number; // Real PHH fornecido
  total_produzido: number; // Volume total
  operacao: Operacao;
  funcoes_habilitadas: string[];
  experiencia_por_funcao: ExperienciaFuncao[];
  criado_em: string;
  updated_at?: string;
}

export interface Funcao {
  id: string;
  nome: string;
  descricao?: string;
  requer_certificacao: boolean;
  ativo: boolean;
}

export interface Local {
  id: string;
  nome: string;
  codigo?: string;
  endereco?: string;
  ativo: boolean;
}

export interface Turno {
  id: string;
  nome: string;
  horario_inicio: string;
  horario_fim: string;
  ativo: boolean;
}

export interface Rua {
  id: string;
  letra: string;
  quantidade_gaiolas: number;
  total_pacotes: number;
}

export interface ItemEscala {
  posicao: number;
  funcao_id: string;
  colaborador_id?: string;
  tipo: TipoAlocacao;
  nome_diarista?: string;
  observacoes?: string;
}

export interface Escala {
  id: string;
  data: string;
  local_id: string;
  turno_id: string;
  status: StatusEscala;
  ruas?: Rua[];
  itens: ItemEscala[];
  criado_por: string;
  criado_em: string;
  publicado_em?: string;
  observacoes?: string;
}
