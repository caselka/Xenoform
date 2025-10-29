
import React, { useState } from 'react';
import type { Species } from '../types';
import { SaveIcon, ExportIcon, CopyIcon } from './Icons';

interface SpeciesCardProps {
  species: Species;
  imageUrl: string | null;
  onSave: (species: Species) => void;
  isFavorite: boolean;
}

const ImageLoader: React.FC = () => (
    <div className="w-full h-full bg-slate-800 animate-pulse flex items-center justify-center">
        <div className="text-cyan-400 font-orbitron">Rendering Specimen...</div>
    </div>
);

const DetailField: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div>
    <h3 className="text-sm font-bold uppercase tracking-widest text-cyan-400 mb-1">{label}</h3>
    <p className="text-slate-300 whitespace-pre-wrap">{value}</p>
  </div>
);

const SpeciesCard: React.FC<SpeciesCardProps> = ({ species, imageUrl, onSave, isFavorite }) => {
  const [copyStatus, setCopyStatus] = useState<'idle' | 'copied'>('idle');

  const handleExport = () => {
    const jsonString = JSON.stringify(species, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${species.name.replace(/\s+/g, '_')}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(JSON.stringify(species, null, 2)).then(() => {
      setCopyStatus('copied');
      setTimeout(() => setCopyStatus('idle'), 2000);
    });
  };

  const ActionButton: React.FC<{ icon: React.ReactNode; label: string; onClick: () => void; disabled?: boolean; active?:boolean }> = ({ icon, label, onClick, disabled, active }) => (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`flex items-center space-x-2 px-3 py-2 text-sm rounded-md transition-all duration-200 
                 ${active ? 'bg-cyan-400 text-slate-900' : 'bg-slate-700/50 text-cyan-400'}
                 hover:bg-cyan-500 hover:text-slate-900
                 disabled:opacity-50 disabled:cursor-not-allowed`}
    >
      {icon}
      <span>{label}</span>
    </button>
  );

  return (
    <div className="glass-card rounded-lg overflow-hidden shadow-2xl shadow-cyan-500/10 w-full max-w-5xl mx-auto animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-2">
        <div className="relative aspect-video md:aspect-auto">
          {imageUrl ? (
            <img src={imageUrl} alt={`Illustration of ${species.name}`} className="w-full h-full object-cover" />
          ) : (
            <ImageLoader/>
          )}
        </div>
        <div className="p-6 flex flex-col space-y-4">
          <div>
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
                <h2 className="text-3xl font-bold holographic-text font-orbitron break-words">{species.name}</h2>
                <div className="flex space-x-2 flex-shrink-0">
                    <ActionButton icon={<SaveIcon className="w-4 h-4" />} label={isFavorite ? 'Saved' : 'Save'} onClick={() => onSave(species)} active={isFavorite} />
                    <ActionButton icon={<ExportIcon className="w-4 h-4" />} label="Export" onClick={handleExport} />
                    <ActionButton icon={<CopyIcon className="w-4 h-4" />} label={copyStatus === 'idle' ? 'Copy' : 'Copied!'} onClick={handleCopy} />
                </div>
            </div>
            <p className="text-xs text-cyan-300/50 mt-2">BIOME SOUNDTRACK: {species.biome_soundtrack_prompt}</p>
          </div>

          <div className="flex flex-col space-y-4 flex-grow text-sm">
            <DetailField label="Appearance" value={species.appearance} />
            <DetailField label="Habitat" value={species.habitat} />
            <DetailField label="Behaviour" value={species.behaviour} />
            <DetailField label="Evolution Story" value={species.evolution_story} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpeciesCard;
