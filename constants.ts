
import { Funcao, Local, Turno, Colaborador, Operacao } from './types';

export const FUNCOES_PADRAO: Funcao[] = [
  { id: "func-001", nome: "Indução", requer_certificacao: false, ativo: true },
  { id: "func-002", nome: "Sorting Convencional", requer_certificacao: false, ativo: true },
  { id: "func-003", nome: "Sorting Volumoso", requer_certificacao: true, ativo: true },
  { id: "func-004", nome: "Etiquetagem Convencional", requer_certificacao: false, ativo: true },
  { id: "func-005", nome: "Etiquetagem Volumoso", requer_certificacao: true, ativo: true },
  { id: "func-006", nome: "Paleteira", requer_certificacao: true, ativo: true },
  { id: "func-007", nome: "Descarga de LH", requer_certificacao: false, ativo: true },
  { id: "func-008", nome: "Pesca", requer_certificacao: false, ativo: true },
  { id: "func-009", nome: "Goleiro", requer_certificacao: false, ativo: true },
  { id: "func-010", nome: "Problem Solver", requer_certificacao: false, ativo: true },
  { id: "func-011", nome: "Assistente", requer_certificacao: false, ativo: true },
  { id: "func-012", nome: "Auxiliar", requer_certificacao: false, ativo: true },
  { id: "func-013", nome: "Conferente", requer_certificacao: false, ativo: true }
];

export const LOCAIS_PADRAO: Local[] = [
  { id: "local-001", nome: "SRS7", codigo: "SRS7", ativo: true }
];

export const TURNOS_PADRAO: Turno[] = [
  { id: "turno-001", nome: "T1 - Noite", horario_inicio: "00:00", horario_fim: "08:20", ativo: true },
  { id: "turno-002", nome: "T2 - Manhã", horario_inicio: "08:00", horario_fim: "16:20", ativo: true },
  { id: "turno-003", nome: "T3 - Tarde", horario_inicio: "16:00", horario_fim: "00:20", ativo: true }
];

const PRODUCTIVITY_DATA: Record<string, { phh: number; total: number }> = {
  "ext_ertavare": { phh: 1289.09, total: 127801 },
  "ext_hericard": { phh: 960.76, total: 85948 },
  "ext_jocsique": { phh: 466.68, total: 46257 },
  "ext_pamelnay": { phh: 601.57, total: 41925 },
  "ext_dhfabrin": { phh: 463.35, total: 39494 },
  "ext_jehubner": { phh: 738.97, total: 31662 },
  "ext_jenatana": { phh: 323.74, total: 24461 },
  "ext_gibuenev": { phh: 356.74, total: 20004 },
  "ext_janmateu": { phh: 321.52, total: 19249 },
  "ext_pemayca": { phh: 345.40, total: 19197 },
  "ext_franc": { phh: 236.84, total: 18537 },
  "ext_karavier": { phh: 342.77, total: 17811 },
  "ext_faceesi": { phh: 246.45, total: 16777 },
  "ext_lenpaula": { phh: 209.32, total: 16604 },
  "ext_chparode": { phh: 248.41, total: 16145 },
  "ext_crmattos": { phh: 255.06, total: 15724 },
  "ext_gavizzot": { phh: 218.15, total: 14888 },
  "ext_karinyva": { phh: 259.81, total: 13591 },
  "ext_leonmell": { phh: 211.98, total: 12630 },
  "ext_susyalme": { phh: 188.88, total: 10981 },
  "ext_eldidone": { phh: 223.87, total: 10557 },
  "ext_almeidaw": { phh: 157.05, total: 8857 },
  "ext_erschrai": { phh: 160.12, total: 7623 },
  "ext_samigor": { phh: 169.14, total: 7252 },
  "ext_kabritte": { phh: 158.71, total: 5515 },
  "ext_addejani": { phh: 209.95, total: 5489 },
  "ext_michegio": { phh: 251.13, total: 5272 },
  "ext_alandutr": { phh: 159.02, total: 4761 },
  "ext_nyferrao": { phh: 119.97, total: 4727 },
  "ext_cenardao": { phh: 172.64, total: 3999 },
  "ext_ribarasu": { phh: 176.90, total: 3785 },
  "ext_ludi": { phh: 161.14, total: 3751 },
  "ext_gipalmei": { phh: 184.77, total: 3586 },
  "ext_dadarono": { phh: 143.01, total: 3444 },
  "ext_morodand": { phh: 287.63, total: 3355 },
  "ext_maeduari": { phh: 257.31, total: 2970 },
  "ext_fepolly": { phh: 188.38, total: 2914 },
  "ext_josatur": { phh: 156.12, total: 2834 },
  "ext_nafidenc": { phh: 136.38, total: 2551 },
  "ext_dalederm": { phh: 255.98, total: 2535 },
  "ext_luzucchi": { phh: 174.60, total: 1752 },
  "ext_paemoura": { phh: 167.01, total: 1514 },
  "ext_naalesan": { phh: 236.68, total: 1136 },
  "ext_mimunhoz": { phh: 169.13, total: 115 },
  "ext_gabolfe": { phh: 134.59, total: 89 },
  "ext_guilhama": { phh: 94.28, total: 54 }
};

const parseDate = (d: string) => {
  if (!d) return "1970-01-01";
  const [day, month, year] = d.split('/');
  return `${year}-${month}-${day}`;
};

const createColaborador = (data: any, index: number): Colaborador => {
  const ldapLower = data.ldap.toLowerCase();
  const perf = PRODUCTIVITY_DATA[ldapLower] || { phh: 150, total: 1000 };
  
  const isAuxiliar = data.cargo === "AUXILIAR";
  const funcId = isAuxiliar ? "func-012" : "func-013";
  const calcEfficiency = Math.min(100, Math.round((perf.phh / 250) * 100));

  // Operação Inicial baseada em lógica de distribuição (pode ser alterada na aba Pessoas)
  const operacao: Operacao = index % 3 === 0 ? 'VOLUMOSO' : 'CONVENCIONAL';

  return {
    id: `colab-${(index + 1).toString().padStart(3, '0')}`,
    nome_completo: data.nome,
    cpf: data.cpf,
    data_nascimento: parseDate(data.nascimento),
    genero: data.genero as any,
    contrato_fornecedor: data.contrato,
    cargo_base: data.cargo,
    data_admissao: parseDate(data.admissao),
    ativo: data.ativo as any,
    em_ferias: data.ferias as any,
    gestor_imediato: data.gestor,
    escala_padrao: data.escala,
    dsr_dia: data.dsr as any,
    ldap: data.ldap,
    id_groot: data.id_groot,
    custo_hora: 8.51,
    eficiencia: calcEfficiency,
    phh_efetivo: perf.phh,
    total_produzido: perf.total,
    operacao,
    funcoes_habilitadas: [funcId],
    experiencia_por_funcao: [{ funcao_id: funcId, nivel_experiencia: 3 }],
    criado_em: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
};

const rawData = [
  { nome: "ADRIANA DEJANIRA NOBLES ORBA", contrato: "KN", cargo: "AUXILIAR", admissao: "25/09/2024", gestor: "GUSTAVO HENRIQUE BECK NUNES", escala: "T2", dsr: "DOMINGO", ativo: "SIM", ferias: "NÃO", genero: "FEMININO", nascimento: "08/01/1990", cpf: "3347554094", ldap: "ext_addejani", id_groot: "1869017" },
  { nome: "ALAN RODRIGO DO NASCIMENTO DUTRA", contrato: "POLLY", cargo: "AUXILIAR", admissao: "14/11/2025", gestor: "LUIZ FERNANDO SEVERO BATISTA", escala: "T1", dsr: "DOMINGO", ativo: "SIM", ferias: "NÃO", genero: "MASCULINO", nascimento: "04/10/1995", cpf: "03701489084", ldap: "ext_alandutr", id_groot: "2298296" },
  { nome: "ANDREI DE MOURA RODRIGUES", contrato: "KN", cargo: "AUXILIAR", admissao: "15/10/2025", gestor: "LUIZ FERNANDO SEVERO BATISTA", escala: "T1", dsr: "DOMINGO", ativo: "SIM", ferias: "NÃO", genero: "MASCULINO", nascimento: "05/02/1998", cpf: "03740949007", ldap: "ext_morodand", id_groot: "2256544" },
  { nome: "CESAR AUGUSTO RODRIGUES NARDÃO", contrato: "POLLY", cargo: "AUXILIAR", admissao: "09/10/2025", gestor: "LUIZ FERNANDO SEVERO BATISTA", escala: "T1", dsr: "DOMINGO", ativo: "SIM", ferias: "NÃO", genero: "MASCULINO", nascimento: "06/07/1996", cpf: "03509154070", ldap: "ext_cenardao", id_groot: "2248346" },
  { nome: "CHAIANE PARODE DE FREITAS", contrato: "ADECCO", cargo: "AUXILIAR", admissao: "27/10/2025", gestor: "GUSTAVO HENRIQUE BECK NUNES", escala: "T2", dsr: "DOMINGO", ativo: "SIM", ferias: "NÃO", genero: "FEMININO", nascimento: "12/07/2001", cpf: "04702881086", ldap: "ext_chparode", id_groot: "2274166" },
  { nome: "CRISTOPHER GABRIEL DE MATTOS GUITE", contrato: "KN", cargo: "AUXILIAR", admissao: "02/04/2025", gestor: "LUIZ FERNANDO SEVERO BATISTA", escala: "T1", dsr: "DOMINGO", ativo: "SIM", ferias: "NÃO", genero: "MASCULINO", nascimento: "16/12/2005", cpf: "5958469045", ldap: "ext_crmattos", id_groot: "2036329" },
  { nome: "DANIELA LEDERMANN MACHADO", contrato: "KN", cargo: "CONFERENTE", admissao: "29/11/2024", gestor: "LUIZ FERNANDO SEVERO BATISTA", escala: "T1", dsr: "DOMINGO", ativo: "SIM", ferias: "NÃO", genero: "FEMININO", nascimento: "14/04/2000", cpf: "4887966016", ldap: "ext_dalederm", id_groot: "1937505" },
  { nome: "DANILO FERREIRA DARONCO", contrato: "KN", cargo: "AUXILIAR", admissao: "03/09/2025", gestor: "LUIZ FERNANDO SEVERO BATISTA", escala: "T1", dsr: "DOMINGO", ativo: "SIM", ferias: "NÃO", genero: "MASCULINO", nascimento: "31/10/2000", cpf: "03537274076", ldap: "ext_dadarono", id_groot: "2205883" },
  { nome: "DHEIVID FABRIN PORTELA", contrato: "KN", cargo: "AUXILIAR", admissao: "21/08/2025", gestor: "LUIZ FERNANDO SEVERO BATISTA", escala: "T1", dsr: "DOMINGO", ativo: "SIM", ferias: "NÃO", genero: "MASCULINO", nascimento: "10/04/2005", cpf: "4843391093", ldap: "ext_dhfabrin", id_groot: "2191198" },
  { nome: "ELENICE DIDONE", contrato: "KN", cargo: "AUXILIAR", admissao: "01/08/2024", gestor: "GUSTAVO HENRIQUE BECK NUNES", escala: "T2", dsr: "DOMINGO", ativo: "SIM", ferias: "NÃO", genero: "FEMININO", nascimento: "19/07/1968", cpf: "47489529034", ldap: "ext_eldidone", id_groot: "1732781" },
  { nome: "ERICK TAVARES DA SILVA", contrato: "KN", cargo: "AUXILIAR", admissao: "14/09/2024", gestor: "LUIZ FERNANDO SEVERO BATISTA", escala: "T1", dsr: "DOMINGO", ativo: "SIM", ferias: "NÃO", genero: "MASCULINO", nascimento: "04/09/2003", cpf: "3710326010", ldap: "ext_ertavare", id_groot: "1854369" },
  { nome: "ERIK SCHRAIBER DA SILVA JOBIM", contrato: "KN", cargo: "AUXILIAR", admissao: "21/10/2025", gestor: "GUSTAVO HENRIQUE BECK NUNES", escala: "T2", dsr: "DOMINGO", ativo: "SIM", ferias: "NÃO", genero: "MASCULINO", nascimento: "02/08/2004", cpf: "04454990018", ldap: "ext_erschrai", id_groot: "2265646" },
  { nome: "FELIPE NATANAEL MACHADO GOMES", contrato: "KN", cargo: "AUXILIAR", admissao: "18/10/2025", gestor: "LUIZ FERNANDO SEVERO BATISTA", escala: "T1", dsr: "DOMINGO", ativo: "SIM", ferias: "NÃO", genero: "MASCULINO", nascimento: "27/11/2002", cpf: "05435873045", ldap: "ext_fepolly", id_groot: "1948937" },
  { nome: "FRANCIELE DA SILVA", contrato: "ADECCO", cargo: "AUXILIAR", admissao: "26/11/2025", gestor: "LUIZ FERNANDO SEVERO BATISTA", escala: "T1", dsr: "DOMINGO", ativo: "SIM", ferias: "NÃO", genero: "FEMININO", nascimento: "", cpf: "02268786005", ldap: "ext_faceesi", id_groot: "2313691" },
  { nome: "FRANCIELE DE CARVALHO", contrato: "POLLY", cargo: "AUXILIAR", admissao: "23/10/2025", gestor: "LUIZ FERNANDO SEVERO BATISTA", escala: "T1", dsr: "DOMINGO", ativo: "SIM", ferias: "NÃO", genero: "FEMININO", nascimento: "29/03/1989", cpf: "02842652096", ldap: "ext_franc", id_groot: "2002693" },
  { nome: "GABRIEL LUIS BOLFE SILVACKY", contrato: "KN", cargo: "CONFERENTE", admissao: "11/11/2024", gestor: "GUSTAVO HENRIQUE BECK NUNES", escala: "T3", dsr: "SÁBADO", ativo: "SIM", ferias: "NÃO", genero: "MASCULINO", nascimento: "29/06/2003", cpf: "3000226036", ldap: "ext_gabolfe", id_groot: "1917317" },
  { nome: "GABRIELA VIZZOTTO STEINKE", contrato: "ADECCO", cargo: "AUXILIAR", admissao: "11/12/2024", gestor: "LUIZ FERNANDO SEVERO BATISTA", escala: "T1", dsr: "DOMINGO", ativo: "SIM", ferias: "NÃO", genero: "FEMININO", nascimento: "31/05/1985", cpf: "838957013", ldap: "ext_gavizzot", id_groot: "1950173" },
  { nome: "GIOVANA CAROLINA BUENEVIDES DE LIMA", contrato: "POLLY", cargo: "AUXILIAR", admissao: "18/11/2025", gestor: "GUSTAVO HENRIQUE BECK NUNES", escala: "T2", dsr: "DOMINGO", ativo: "SIM", ferias: "NÃO", genero: "MASCULINO", nascimento: "23/02/2006", cpf: "04522951060", ldap: "ext_gibuenev", id_groot: "2303682" },
  { nome: "GIOVANI PALMEIRA GOMES", contrato: "KN", cargo: "AUXILIAR", admissao: "05/06/2025", gestor: "GUSTAVO HENRIQUE BECK NUNES", escala: "T2", dsr: "DOMINGO", ativo: "SIM", ferias: "NÃO", genero: "MASCULINO", nascimento: "16/03/2004", cpf: "4348832048", ldap: "ext_gipalmei", id_groot: "2108827" },
  { nome: "GUILHERME DO AMARAL DE SIQUEIRA", contrato: "KN", cargo: "AUXILIAR", admissao: "31/07/2025", gestor: "GUSTAVO HENRIQUE BECK NUNES", escala: "T3", dsr: "SÁBADO", ativo: "SIM", ferias: "NÃO", genero: "MASCULINO", nascimento: "24/05/2000", cpf: "04940511081", ldap: "ext_guilhama", id_groot: "2168123" },
  { nome: "HERICK RICARDO PADILHA KURTZ", contrato: "KN", cargo: "CONFERENTE", admissao: "13/09/2021", gestor: "LUIZ FERNANDO SEVERO BATISTA", escala: "T1", dsr: "DOMINGO", ativo: "SIM", ferias: "NÃO", genero: "MASCULINO", nascimento: "29/04/2002", cpf: "4391174022", ldap: "ext_hericard", id_groot: "160375" },
  { nome: "IGOR DOS SANTOS MARTINS", contrato: "AST", cargo: "AUXILIAR", admissao: "20/11/2025", gestor: "GUSTAVO HENRIQUE BECK NUNES", escala: "T2", dsr: "DOMINGO", ativo: "SIM", ferias: "NÃO", genero: "MASCULINO", nascimento: "19/01/2000", cpf: "04708680074", ldap: "ext_samigor", id_groot: "2306763" },
  { nome: "JESSICA AVILA HUBNER", contrato: "KN", cargo: "AUXILIAR", admissao: "22/03/2025", gestor: "GUSTAVO HENRIQUE BECK NUNES", escala: "T2", dsr: "DOMINGO", ativo: "SIM", ferias: "NÃO", genero: "FEMININO", nascimento: "02/10/2000", cpf: "18347269726", ldap: "ext_jehubner", id_groot: "2023399" },
  { nome: "JESSICA NATANA DE ALMEIDA", contrato: "KN", cargo: "AUXILIAR", admissao: "12/02/2025", gestor: "LUIZ FERNANDO SEVERO BATISTA", escala: "T1", dsr: "DOMINGO", ativo: "SIM", ferias: "NÃO", genero: "FEMININO", nascimento: "04/08/1995", cpf: "2175893081", ldap: "ext_jenatana", id_groot: "1749460" },
  { nome: "JOÃO PEDRO SATUR STUMPF", contrato: "AST", cargo: "AUXILIAR", admissao: "24/10/2025", gestor: "GUSTAVO HENRIQUE BECK NUNES", escala: "T2", dsr: "DOMINGO", ativo: "SIM", ferias: "NÃO", genero: "MASCULINO", nascimento: "10/05/1999", cpf: "04386659021", ldap: "ext_josatur", id_groot: "2161913" },
  { nome: "JOCEMARA SIQUEIRA", contrato: "KN", cargo: "AUXILIAR", admissao: "31/05/2024", gestor: "LUIZ FERNANDO SEVERO BATISTA", escala: "T1", dsr: "DOMINGO", ativo: "SIM", ferias: "NÃO", genero: "FEMININO", nascimento: "30/07/1985", cpf: "708067050", ldap: "ext_jocsique", id_groot: "1766710" },
  { nome: "KAIQUE RAVIER FALCAO", contrato: "KN", cargo: "AUXILIAR", admissao: "09/03/2025", gestor: "LUIZ FERNANDO SEVERO BATISTA", escala: "T1", dsr: "DOMINGO", ativo: "SIM", ferias: "NÃO", genero: "MASCULINO", nascimento: "18/01/2006", cpf: "4773207086", ldap: "ext_karavier", id_groot: "2008758" },
  { nome: "KARIN CRISTINI MACHADO BRITTES", contrato: "AST", cargo: "AUXILIAR", admissao: "25/11/2025", gestor: "GUSTAVO HENRIQUE BECK NUNES", escala: "T2", dsr: "DOMINGO", ativo: "SIM", ferias: "NÃO", genero: "FEMININO", nascimento: "21/07/2005", cpf: "04447713012", ldap: "ext_kabritte", id_groot: "2312689" },
  { nome: "KARINY VARGAS RODRIGUES", contrato: "KN", cargo: "AUXILIAR", admissao: "15/10/2025", gestor: "LUIZ FERNANDO SEVERO BATISTA", escala: "T1", dsr: "DOMINGO", ativo: "SIM", ferias: "NÃO", genero: "FEMININO", nascimento: "11/03/2004", cpf: "05884833032", ldap: "ext_karinyva", id_groot: "2256548" },
  { nome: "LENIR CHAGAS DE PAULA", contrato: "ADECCO", cargo: "AUXILIAR", admissao: "13/04/2025", gestor: "LUIZ FERNANDO SEVERO BATISTA", escala: "T1", dsr: "DOMINGO", ativo: "SIM", ferias: "NÃO", genero: "MASCULINO", nascimento: "28/10/1972", cpf: "73953369091", ldap: "ext_lenpaula", id_groot: "2051897" },
  { nome: "LEONARDO DE MELLO WEGNER", contrato: "AST", cargo: "AUXILIAR", admissao: "03/10/2025", gestor: "LUIZ FERNANDO SEVERO BATISTA", escala: "T1", dsr: "DOMINGO", ativo: "SIM", ferias: "NÃO", genero: "MASCULINO", nascimento: "02/06/1999", cpf: "01382275005", ldap: "ext_leonmell", id_groot: "2238315" },
  { nome: "LUCAS ANTONIO MARAFIGA DIAS", contrato: "POLLY", cargo: "AUXILIAR", admissao: "14/11/2025", gestor: "LUIZ FERNANDO SEVERO BATISTA", escala: "T1", dsr: "DOMINGO", ativo: "SIM", ferias: "NÃO", genero: "MASCULINO", nascimento: "07/07/1994", cpf: "03247549064", ldap: "ext_ludi", id_groot: "2153658" },
  { nome: "LUCAS CARVALHO PINTO ZUCCHINI", contrato: "KN", cargo: "AUXILIAR", admissao: "21/03/2024", gestor: "GUSTAVO HENRIQUE BECK NUNES", escala: "T2", dsr: "DOMINGO", ativo: "SIM", ferias: "NÃO", genero: "MASCULINO", nascimento: "12/04/2005", cpf: "3268821030", ldap: "ext_luzucchi", id_groot: "1702363" },
  { nome: "MARIA EDUARDA RIBEIRO RAMOS", contrato: "AST", cargo: "AUXILIAR", admissao: "13/12/2025", gestor: "GUSTAVO HENRIQUE BECK NUNES", escala: "T2", dsr: "DOMINGO", ativo: "SIM", ferias: "NÃO", genero: "FEMININO", nascimento: "27/09/2002", cpf: "02696212023", ldap: "ext_maeduari", id_groot: "2335217" },
  { nome: "MICHEL GIOVANI PAIVA PINTO", contrato: "KN", cargo: "AUXILIAR", admissao: "29/06/2025", gestor: "GUSTAVO HENRIQUE BECK NUNES", escala: "T2", dsr: "DOMINGO", ativo: "SIM", ferias: "NÃO", genero: "MASCULINO", nascimento: "11/02/2007", cpf: "4823956052", ldap: "ext_michegio", id_groot: "2133311" },
  { nome: "MIGUEL MUNHOZ RODRIGUES", contrato: "KN", cargo: "AUXILIAR", admissao: "10/06/2025", gestor: "LUIZ FERNANDO SEVERO BATISTA", escala: "T1", dsr: "DOMINGO", ativo: "SIM", ferias: "NÃO", genero: "MASCULINO", nascimento: "25/11/1999", cpf: "04421615064", ldap: "ext_mimunhoz", id_groot: "2113714" },
  { nome: "NATANAEL ALEXSANDER DOS SANTOS SOARES", contrato: "POLLY", cargo: "AUXILIAR", admissao: "26/11/2025", gestor: "LUIZ FERNANDO SEVERO BATISTA", escala: "T1", dsr: "DOMINGO", ativo: "SIM", ferias: "NÃO", genero: "MASCULINO", nascimento: "", cpf: "05897682046", ldap: "ext_naalesan", id_groot: "2313741" },
  { nome: "NATANIEL FIDENCIO", contrato: "AST", cargo: "AUXILIAR", admissao: "18/10/2025", gestor: "LUIZ FERNANDO SEVERO BATISTA", escala: "T1", dsr: "DOMINGO", ativo: "SIM", ferias: "NÃO", genero: "MASCULINO", nascimento: "25/12/1998", cpf: "04186416095", ldap: "ext_nafidenc", id_groot: "2260886" },
  { nome: "NYCOLE FERRAO DE CARVALHO", contrato: "KN", cargo: "AUXILIAR", admissao: "19/11/2025", gestor: "GUSTAVO HENRIQUE BECK NUNES", escala: "T2", dsr: "DOMINGO", ativo: "SIM", ferias: "NÃO", genero: "FEMININO", nascimento: "19/03/2003", cpf: "06394533092", ldap: "ext_nyferrao", id_groot: "2305121" },
  { nome: "PAMELA NAYARA WINTER", contrato: "KN", cargo: "AUXILIAR", admissao: "21/10/2025", gestor: "GUSTAVO HENRIQUE BECK NUNES", escala: "T2", dsr: "DOMINGO", ativo: "SIM", ferias: "NÃO", genero: "FEMININO", nascimento: "20/07/2006", cpf: "05189262065", ldap: "ext_pamelnay", id_groot: "2265647" },
  { nome: "PAULO RICARDO DE MOURA DEMBOSKI", contrato: "KN", cargo: "AUXILIAR", admissao: "05/06/2025", gestor: "GUSTAVO HENRIQUE BECK NUNES", escala: "T2", dsr: "DOMINGO", ativo: "SIM", ferias: "NÃO", genero: "MASCULINO", nascimento: "28/12/2001", cpf: "2662812060", ldap: "ext_paemoura", id_groot: "2108829" },
  { nome: "PEDRO HENRIQUE VIEIRA MAYCÁ", contrato: "POLLY", cargo: "AUXILIAR", admissao: "09/10/2025", gestor: "LUIZ FERNANDO SEVERO BATISTA", escala: "T1", dsr: "DOMINGO", ativo: "SIM", ferias: "NÃO", genero: "MASCULINO", nascimento: "02/01/2002", cpf: "03781366073", ldap: "ext_pemayca", id_groot: "1962020" },
  { nome: "RICARDO CASARIN BARASUOL", contrato: "POLLY", cargo: "AUXILIAR", admissao: "06/11/2025", gestor: "LUIZ FERNANDO SEVERO BATISTA", escala: "T1", dsr: "DOMINGO", ativo: "SIM", ferias: "NÃO", genero: "MASCULINO", nascimento: "15/07/2006", cpf: "86578049053", ldap: "ext_ribarasu", id_groot: "2287299" },
  { nome: "SAMANTA KRUGER KIRSCHNICK CICHORSKI", contrato: "KN", cargo: "AUXILIAR", admissao: "03/09/2025", gestor: "LUIZ FERNANDO SEVERO BATISTA", escala: "T1", dsr: "DOMINGO", ativo: "SIM", ferias: "NÃO", genero: "FEMININO", nascimento: "16/01/1991", cpf: "2437391096", ldap: "ext_sakruger", id_groot: "2204783" },
  { nome: "SUZY DIOVANNA ALMEIDA DO CARMO", contrato: "AST", cargo: "AUXILIAR", admissao: "19/11/2025", gestor: "GUSTAVO HENRIQUE BECK NUNES", escala: "T2", dsr: "DOMINGO", ativo: "SIM", ferias: "NÃO", genero: "FEMININO", nascimento: "25/11/2001", cpf: "04834702014", ldap: "ext_susyalme", id_groot: "2305004" },
  { nome: "WILLIAN RODRIGUES DE ALMEIDA", contrato: "AST", cargo: "AUXILIAR", admissao: "18/11/2025", gestor: "GUSTAVO HENRIQUE BECK NUNES", escala: "T2", dsr: "DOMINGO", ativo: "SIM", ferias: "NÃO", genero: "MASCULINO", nascimento: "21/07/1999", cpf: "04622743060", ldap: "ext_almeidaw", id_groot: "2303687" }
];

export const COLABORADORES_SEED: Colaborador[] = rawData.map(createColaborador);
