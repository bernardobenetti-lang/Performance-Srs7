
import React, { useState } from 'react';
import { Upload, FileText, CheckCircle, AlertCircle, X, Clock } from 'lucide-react';

const ImportData: React.FC = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState<{success: number, errors: number} | null>(null);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleUpload = () => {
    setIsUploading(true);
    // Simulate API call
    setTimeout(() => {
      setIsUploading(false);
      setUploadResult({ success: 42, errors: 3 });
      setFile(null);
    }, 2000);
  };

  const activities = [
    { id: 'sc', name: 'Sorting Convencional' },
    { id: 'sv', name: 'Sorting Volumoso' },
    { id: 'ec', name: 'Etiquetagem Convencional' },
    { id: 'ev', name: 'Etiquetagem Volumoso' },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="text-center">
        <h1 className="text-3xl font-black text-brand-navy uppercase tracking-tighter mb-2">Importar Performance</h1>
        <p className="text-slate-400 font-medium">Suba arquivos CSV para atualizar a eficiência operacional</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {activities.map(activity => (
          <div key={activity.id} className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-slate-50 text-brand-navy flex items-center justify-center border border-slate-100">
                <FileText size={20} />
              </div>
              <h3 className="font-black uppercase text-xs tracking-widest text-slate-600">{activity.name}</h3>
            </div>

            <div 
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              className={`
                border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center text-center transition-all
                ${isDragging ? 'border-brand-yellow bg-brand-yellow/5' : 'border-slate-100 hover:border-brand-yellow/40'}
              `}
            >
              {file ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-brand-navy font-bold text-sm">
                    <FileText size={20} /> {file.name}
                  </div>
                  <button 
                    onClick={handleUpload}
                    disabled={isUploading}
                    className="px-8 py-3 bg-brand-yellow text-brand-navy rounded-xl font-black uppercase text-[10px] tracking-widest shadow-lg shadow-brand-yellow/10 disabled:opacity-50"
                  >
                    {isUploading ? 'Processando...' : 'Processar'}
                  </button>
                </div>
              ) : (
                <>
                  <Upload size={32} className="text-slate-200 mb-3" />
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-300 mb-1">Arraste o CSV aqui</p>
                  <p className="text-[10px] text-slate-400 font-medium">Data | Nome | PHH | Quantidade</p>
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      {uploadResult && (
        <div className="bg-emerald-50 border border-emerald-100 rounded-[32px] p-8 flex items-start gap-5 shadow-lg shadow-emerald-600/5 animate-in slide-in-from-top-4">
          <div className="p-3 bg-emerald-600 text-white rounded-2xl shadow-lg">
            <CheckCircle size={28} />
          </div>
          <div className="flex-1">
            <h4 className="font-black text-emerald-900 uppercase tracking-tighter text-lg">Importação Concluída</h4>
            <p className="text-sm text-emerald-700/70 font-medium">
              A base de dados foi atualizada com sucesso.
            </p>
            <div className="mt-6 flex gap-8 text-sm">
              <span className="flex items-center gap-2 font-black uppercase text-[10px] tracking-widest text-emerald-600">
                <CheckCircle size={16} /> {uploadResult.success} Sucessos
              </span>
              <span className="flex items-center gap-2 font-black uppercase text-[10px] tracking-widest text-red-600">
                <AlertCircle size={16} /> {uploadResult.errors} Falhas
              </span>
            </div>
          </div>
          <button onClick={() => setUploadResult(null)} className="p-2 hover:bg-emerald-100 rounded-full transition-colors">
            <X size={24} className="text-emerald-300" />
          </button>
        </div>
      )}

      <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm">
        <h3 className="font-black text-brand-navy uppercase tracking-widest text-xs mb-6 flex items-center gap-3">
          <Clock size={18} className="text-brand-yellow" /> Histórico de Importações
        </h3>
        <div className="space-y-4">
          {[
            { date: '14/01/2024 15:30', activity: 'Sorting Conv.', count: 45, status: 'ok' },
            { date: '13/01/2024 09:15', activity: 'Etiquetagem', count: 32, status: 'ok' },
          ].map((log, i) => (
            <div key={i} className="flex items-center justify-between p-4 bg-slate-50/50 rounded-2xl border border-slate-50 last:border-slate-50">
              <div className="flex items-center gap-6">
                <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">{log.date}</span>
                <span className="text-sm font-black text-brand-navy uppercase tracking-tighter">{log.activity}</span>
              </div>
              <div className="flex items-center gap-6">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{log.count} registros</span>
                <CheckCircle size={18} className="text-emerald-500" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ImportData;
