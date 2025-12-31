
import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import Dashboard from './views/Dashboard';
import People from './views/People';
import Planner from './views/Planner';
import ImportData from './views/ImportData';
import Feedback from './views/Feedback';
import Reports from './views/Reports';
import Settings from './views/Settings';
import { COLABORADORES_SEED } from './constants';
import { Colaborador, Operacao, ConfiguracoesOperacionais } from './types';

const App: React.FC = () => {
  const [activeView, setActiveView] = useState('dashboard');
  
  // Initialize state from localStorage if available, otherwise use SEED
  const [colaboradores, setColaboradores] = useState<Colaborador[]>(() => {
    const saved = localStorage.getItem('srs7_colaboradores');
    return saved ? JSON.parse(saved) : COLABORADORES_SEED;
  });

  // Default Settings
  const [settings, setSettings] = useState<ConfiguracoesOperacionais>(() => {
    const saved = localStorage.getItem('srs7_settings');
    return saved ? JSON.parse(saved) : {
      limitePacotesPorPessoaSorting: 1500,
      percentualVolumeVolumoso: 10,
      phhMetaVolumoso: 150,
      vagasInducaoPadrao: 5,
      vagasEtiquetagemPadrao: 2,
      vagasPescaPadrao: 2,
      pesoPerformance: 70,
      pesoExperiencia: 30
    };
  });

  // Persist to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem('srs7_colaboradores', JSON.stringify(colaboradores));
  }, [colaboradores]);

  useEffect(() => {
    localStorage.setItem('srs7_settings', JSON.stringify(settings));
  }, [settings]);

  const updateColaborador = (id: string, updates: Partial<Colaborador>) => {
    setColaboradores(prev => prev.map(c => 
      c.id === id ? { ...c, ...updates, updated_at: new Date().toISOString() } : c
    ));
  };

  const renderView = () => {
    switch (activeView) {
      case 'dashboard':
        return <Dashboard 
          colaboradores={colaboradores} 
          onGoToPlanner={() => setActiveView('planner')} 
        />;
      case 'planner':
        return <Planner colaboradores={colaboradores} settings={settings} />;
      case 'people':
        return <People 
          colaboradores={colaboradores} 
          onUpdateColaborador={updateColaborador} 
        />;
      case 'import':
        return <ImportData />;
      case 'feedback':
        return <Feedback colaboradores={colaboradores} />;
      case 'reports':
        return <Reports colaboradores={colaboradores} />;
      case 'settings':
        return <Settings 
          settings={settings} 
          onUpdateSettings={setSettings} 
        />;
      default:
        return <Dashboard 
          colaboradores={colaboradores} 
          onGoToPlanner={() => setActiveView('planner')} 
        />;
    }
  };

  return (
    <Layout activeView={activeView} onNavigate={setActiveView}>
      {renderView()}
    </Layout>
  );
};

export default App;
