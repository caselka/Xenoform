
import React, { useState, useCallback } from 'react';
import type { Species } from './types';
import { useLocalStorage } from './hooks/useLocalStorage';
import { generateSpeciesData, generateEcosystemData, generateSpeciesImage } from './services/geminiService';
import SpeciesCard from './components/SpeciesCard';
import DnaHelix from './components/DnaHelix';
import { DnaIcon, EcosystemIcon, DeleteIcon } from './components/Icons';

type AppState = 'idle' | 'loading' | 'displaying' | 'error';
type DisplayMode = 'species' | 'ecosystem' | 'favorites';

const Header = () => (
  <header className="text-center p-4">
    <h1 className="text-5xl font-bold holographic-text font-orbitron tracking-widest">XENOFORM</h1>
    <p className="text-cyan-300/70 mt-2 text-sm">PROCEDURAL LIFE-FORM GENERATOR</p>
  </header>
);

const Loader: React.FC<{ message: string }> = ({ message }) => (
    <div className="flex flex-col items-center justify-center text-center p-8">
        <DnaIcon className="w-16 h-16 text-cyan-400 animate-spin" />
        <p className="mt-4 text-lg font-orbitron text-cyan-300">{message}</p>
        <p className="text-sm text-slate-400">Please wait, the Xenoform algorithm is synthesizing...</p>
    </div>
);

const App: React.FC = () => {
    const [appState, setAppState] = useState<AppState>('idle');
    const [displayMode, setDisplayMode] = useState<DisplayMode>('species');
    const [currentSpecies, setCurrentSpecies] = useState<(Species & { imageUrl: string | null }) | null>(null);
    const [currentEcosystem, setCurrentEcosystem] = useState<(Species & { imageUrl: string | null })[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [favorites, setFavorites] = useLocalStorage<Species[]>('xenoform-favorites', []);
    const [mutationMode, setMutationMode] = useState(false);

    const handleGenerateSpecies = useCallback(async () => {
        setAppState('loading');
        setError(null);
        setCurrentEcosystem([]);
        setDisplayMode('species');
        try {
            const speciesData = await generateSpeciesData(mutationMode ? currentSpecies : null);
            setCurrentSpecies({ ...speciesData, imageUrl: null });
            
            const imageUrl = await generateSpeciesImage(speciesData);
            setCurrentSpecies({ ...speciesData, imageUrl });

            setAppState('displaying');
        } catch (err) {
            console.error(err);
            setError('Failed to generate species. The cosmic rays might be interfering. Please try again.');
            setAppState('error');
        }
    }, [mutationMode, currentSpecies]);

    const handleSpawnEcosystem = useCallback(async () => {
        setAppState('loading');
        setError(null);
        setCurrentSpecies(null);
        setDisplayMode('ecosystem');
        try {
            const ecosystemData = await generateEcosystemData();
            const ecosystemWithPlaceholders = ecosystemData.map(s => ({...s, imageUrl: null}));
            setCurrentEcosystem(ecosystemWithPlaceholders);

            const imagePromises = ecosystemData.map(s => generateSpeciesImage(s));
            const imageUrls = await Promise.all(imagePromises);

            const finalEcosystem = ecosystemData.map((s, i) => ({ ...s, imageUrl: imageUrls[i]}));
            setCurrentEcosystem(finalEcosystem);
            setAppState('displaying');

        } catch (err) {
            console.error(err);
            setError('Failed to generate ecosystem. A simulated extinction event may have occurred. Please try again.');
            setAppState('error');
        }
    }, []);

    const handleSaveFavorite = (species: Species) => {
        setFavorites(prev => {
            if (prev.find(fav => fav.name === species.name)) {
                return prev.filter(fav => fav.name !== species.name);
            }
            return [...prev, species];
        });
    };

    const handleViewFavorite = (species: Species) => {
        setDisplayMode('species');
        setCurrentSpecies({ ...species, imageUrl: 'https://picsum.photos/1280/720' }); // Note: Images aren't stored, using placeholder
        setAppState('displaying');
        window.scrollTo(0, 0);
    }
    
    const handleDeleteFavorite = (speciesName: string) => {
        setFavorites(prev => prev.filter(fav => fav.name !== speciesName));
    }

    const isFavorite = (speciesName: string) => favorites.some(fav => fav.name === speciesName);

    const Controls = () => (
      <div className="sticky top-0 z-10 p-4 glass-card mb-8 flex items-center justify-center space-x-2 md:space-x-4">
        <button onClick={handleGenerateSpecies} disabled={appState === 'loading'} className="flex items-center space-x-2 bg-cyan-500/80 text-white font-bold py-2 px-4 rounded-md hover:bg-cyan-400 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed">
          <DnaIcon className="w-5 h-5"/>
          <span>Generate Species</span>
        </button>
        <button onClick={handleSpawnEcosystem} disabled={appState === 'loading'} className="flex items-center space-x-2 bg-purple-500/80 text-white font-bold py-2 px-4 rounded-md hover:bg-purple-400 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed">
            <EcosystemIcon className="w-5 h-5"/>
            <span>Spawn Ecosystem</span>
        </button>
        <button onClick={() => setDisplayMode(displayMode === 'favorites' ? 'species' : 'favorites')} className="bg-slate-600/80 text-white font-bold py-2 px-4 rounded-md hover:bg-slate-500 transition-all duration-200">
            Favorites ({favorites.length})
        </button>
        <div className="flex items-center space-x-2 pl-4">
            <label htmlFor="mutation-toggle" className="text-sm text-slate-300 select-none">Mutation Mode</label>
            <button onClick={() => setMutationMode(!mutationMode)} className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ${mutationMode ? 'bg-green-500' : 'bg-gray-600'}`}>
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${mutationMode ? 'translate-x-6' : 'translate-x-1'}`}/>
            </button>
        </div>
      </div>
    );
    
    const WelcomeMessage = () => (
        <div className="text-center text-slate-300 max-w-2xl mx-auto p-8 glass-card rounded-lg">
            <h2 className="text-2xl font-orbitron holographic-text mb-4">Welcome to the Xenoform Codex</h2>
            <p>Press "Generate Species" to discover a new life-form, or "Spawn Ecosystem" to create an interconnected web of alien biology.</p>
            <p className="mt-2 text-sm text-slate-400">Toggle "Mutation Mode" to evolve new species from the current specimen.</p>
            <p className="mt-6 text-xs text-amber-400/50">Ambient biome audio simulation is offline for maintenance.</p>
        </div>
    );

    return (
        <div className="min-h-screen bg-slate-900 text-white grid-background relative overflow-x-hidden">
            <DnaHelix />
            <div className="container mx-auto px-4 py-8">
                <Header />
                <Controls />
                
                <main className="min-h-[50vh] flex flex-col items-center justify-center">
                    {displayMode === 'favorites' && (
                        <div className="w-full max-w-3xl glass-card p-6 rounded-lg">
                            <h2 className="text-2xl font-orbitron holographic-text mb-4">Favorite Specimens</h2>
                            {favorites.length === 0 ? <p className="text-slate-400">No species saved yet.</p> : (
                                <ul className="space-y-2">
                                    {favorites.map(fav => (
                                        <li key={fav.name} className="flex justify-between items-center bg-slate-800/50 p-3 rounded-md">
                                            <button onClick={() => handleViewFavorite(fav)} className="font-bold hover:text-cyan-400">{fav.name}</button>
                                            <button onClick={() => handleDeleteFavorite(fav.name)} className="text-red-400 hover:text-red-300"><DeleteIcon className="w-5 h-5" /></button>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    )}
                    
                    {displayMode !== 'favorites' && (
                        <>
                            {appState === 'loading' && <Loader message={displayMode === 'ecosystem' ? 'Generating Ecosystem...' : 'Generating Species...'} />}
                            {appState === 'error' && <p className="text-red-400 text-center">{error}</p>}
                            {appState === 'idle' && <WelcomeMessage />}

                            {appState === 'displaying' && displayMode === 'species' && currentSpecies && (
                                <SpeciesCard 
                                    species={currentSpecies} 
                                    imageUrl={currentSpecies.imageUrl} 
                                    onSave={handleSaveFavorite}
                                    isFavorite={isFavorite(currentSpecies.name)}
                                />
                            )}
                            
                            {appState === 'displaying' && displayMode === 'ecosystem' && currentEcosystem.length > 0 && (
                                <div className="space-y-8 w-full">
                                    {currentEcosystem.map((species, index) => (
                                        <SpeciesCard 
                                            key={index} 
                                            species={species} 
                                            imageUrl={species.imageUrl} 
                                            onSave={handleSaveFavorite} 
                                            isFavorite={isFavorite(species.name)}
                                        />
                                    ))}
                                </div>
                            )}
                        </>
                    )}
                </main>
            </div>
        </div>
    );
};

export default App;
