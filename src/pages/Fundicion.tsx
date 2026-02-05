import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Drawer } from "vaul";
import useSWR from "swr";
import { toast } from "sonner";
import fundicionImage from "../assets/fundicion.webp";
import { fetcher } from "../lib/api";
import type { Plano, Queue } from "../types/api";
import { queuePlano, getActiveQueues } from "../services/vulcano.service";
import { useAuthStore } from "../store/useAuthStore";
import { Search, Timer, Hammer, X, Zap } from "lucide-react";

export default function FundicionPage() {
    const [isActive, setIsActive] = useState(false);
    const [isLaunching, setIsLaunching] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const refreshUser = useAuthStore((state) => state.refreshUser);

    // States for UI/UX
    const [searchTerm, setSearchTerm] = useState("");
    const [rarityFilter, setRarityFilter] = useState("ALL");
    const [selectedPlanoId, setSelectedPlanoId] = useState<number | null>(null);

    // Sincronización con el backend
    const { data: activeQueues, mutate, isLoading: isLoadingQueues } = useSWR("api/queues/active", getActiveQueues);
    const { data: planos } = useSWR("planos", fetcher<Plano[]>);

    const filteredPlanos = useMemo(() => {
        return planos?.filter(p => {
            const matchesSearch = p.nombre.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesRarity = rarityFilter === "ALL" || p.recursoFabricado?.rareza?.toUpperCase() === rarityFilter;
            return matchesSearch && matchesRarity;
        }) || [];
    }, [planos, searchTerm, rarityFilter]);

    const handleActivateSequence = () => {
        setIsLaunching(true);
        setTimeout(() => {
            setIsOpen(true);
            setIsLaunching(false);
        }, 600);
    };

    const handleSelectPlano = async (plano: Plano) => {
        // Simple confirmation via UI selection or direct (keeping direct for now but improved visuals)
        toast.promise(queuePlano(plano.id), {
            loading: "Iniciando forja...",
            success: () => {
                mutate(); // Refresca la lista para mostrar el nuevo contador
                refreshUser(); // Updates credits
                setIsOpen(false);
                return `Forja iniciada: ${plano.nombre}`;
            },
            error: "Error al iniciar la forja"
        });
    };

    const getRarityColor = (rarity?: string) => {
        switch (rarity?.toUpperCase()) {
            case 'COMUN': return 'bg-gray-100 text-gray-600 border-gray-200';
            case 'RARO': return 'bg-blue-50 text-blue-600 border-blue-200';
            case 'EPICO': return 'bg-purple-50 text-purple-600 border-purple-200';
            case 'LEGENDARIO': return 'bg-orange-50 text-orange-600 border-orange-200';
            default: return 'bg-gray-100 text-gray-600 border-gray-200';
        }
    };

    return (
        <Drawer.Root open={isOpen} onOpenChange={setIsOpen} shouldScaleBackground>

            <main className="relative w-full h-[70vh] md:h-[80vh] overflow-hidden bg-white font-sans">
                {/* Fondo reactivo */}
                <motion.img
                    src={fundicionImage}
                    alt="Fundicion"
                    animate={{
                        opacity: isLaunching || (activeQueues && activeQueues.length > 0) ? 0.9 : (isActive ? 0.6 : 0.3),
                        scale: isLaunching ? 1.05 : 1,
                    }}
                    transition={{ duration: 0.8 }}
                    className="absolute inset-0 w-full h-full object-cover"
                />

                <section className="relative z-10 h-full w-full flex items-center justify-center p-6">
                    <AnimatePresence mode="wait">
                        {activeQueues && activeQueues.length > 0 ? (
                            <motion.div
                                key="list"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl"
                            >
                                {activeQueues.map((q) => (
                                    <CountdownDisplay key={q.id} queue={q} onFinished={() => mutate()} />
                                ))}

                                {/* Botón para añadir más construcciones (Estilo limpio) */}
                                <button
                                    onClick={() => setIsOpen(true)}
                                    className="h-[140px] border-2 border-dashed border-zinc-200 rounded-3xl flex flex-col items-center justify-center text-zinc-400 hover:border-orange-500 hover:text-orange-500 hover:bg-orange-50/50 transition-all bg-white/80 backdrop-blur-sm"
                                >
                                    <span className="text-2xl font-light">+</span>
                                    <span className="text-[10px] font-bold uppercase tracking-wider mt-1">Nuevo Plano</span>
                                </button>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="trigger"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 1.05, filter: "blur(8px)" }}
                                className="relative flex items-center justify-center w-full max-w-xs"
                            >
                                {/* Esfera Guía Minimalista */}
                                {!isActive && !isLaunching && (
                                    <div className="absolute flex items-center justify-center">
                                        <div className="absolute w-20 h-20 bg-orange-500/10 rounded-full blur-xl animate-pulse" />
                                        <div className="w-3 h-3 bg-orange-500 rounded-full shadow-[0_0_10px_#ea580c]" />
                                    </div>
                                )}

                                <motion.button
                                    onMouseEnter={() => !isLaunching && setIsActive(true)}
                                    onMouseLeave={() => !isLaunching && setIsActive(false)}
                                    onClick={handleActivateSequence}
                                    animate={{
                                        opacity: isLaunching ? 0 : (isActive ? 1 : 0),
                                        scale: isLaunching ? 1.2 : (isActive ? 1 : 0.9)
                                    }}
                                    className="relative z-20 w-full px-10 py-5 bg-white border border-zinc-100 rounded-lg shadow-xl"
                                >
                                    <span className="text-zinc-900 font-black tracking-[0.3em] text-lg uppercase">
                                        Activar
                                    </span>
                                    <Corners isActive={isActive} />
                                </motion.button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </section>

                {/* Drawer (Selección de Planos - UI Mejorada) */}
                <Drawer.Portal>
                    <Drawer.Overlay className="fixed inset-0 bg-zinc-900/60 backdrop-blur-sm z-[60]" />
                    <Drawer.Content className="bg-gray-50 flex flex-col rounded-t-[32px] h-[95%] fixed bottom-0 left-0 right-0 z-[70] outline-none shadow-2xl border-t border-white/20">
                        
                        {/* Header Sticky */}
                        <div className="p-6 pb-2 shrink-0 bg-white rounded-t-[32px] border-b border-gray-100">
                            <div className="mx-auto w-12 h-1.5 rounded-full bg-gray-200 mb-6" />
                            
                            <div className="max-w-4xl mx-auto w-full space-y-6">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                    <div>
                                        <h2 className="font-black text-2xl text-gray-900 tracking-tight uppercase flex items-center gap-2">
                                            <Hammer className="size-6 text-orange-500" />
                                            Base de Planos
                                        </h2>
                                        <p className="text-gray-400 text-sm mt-1">Selecciona un diseño para sintetizar en la forja.</p>
                                    </div>
                                    
                                    {/* Search Bar */}
                                    <div className="relative group w-full md:w-72">
                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-orange-500 transition-colors size-4" />
                                        <input 
                                            type="text" 
                                            placeholder="Buscar plano..." 
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            className="w-full bg-gray-100 border-2 border-transparent focus:bg-white focus:border-orange-500 rounded-xl py-2.5 pl-10 pr-4 text-sm font-medium transition-all outline-none placeholder:text-gray-400"
                                        />
                                        {searchTerm && (
                                            <button 
                                                onClick={() => setSearchTerm('')} 
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                            >
                                                <X className="size-3" />
                                            </button>
                                        )}
                                    </div>
                                </div>

                                {/* Filtros */}
                                <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar mask-gradient">
                                    {['ALL', 'COMUN', 'RARO', 'EPICO', 'LEGENDARIO'].map((filter) => (
                                        <button
                                            key={filter}
                                            onClick={() => setRarityFilter(filter)}
                                            className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap border ${
                                                rarityFilter === filter 
                                                    ? 'bg-zinc-900 text-white border-zinc-900 shadow-md transform scale-105' 
                                                    : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                                            }`}
                                        >
                                            {filter === 'ALL' ? 'Todos' : filter}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Contenido Scrollable */}
                        <div className="flex-1 overflow-y-auto bg-gray-50 p-6">
                            <div className="max-w-4xl mx-auto">
                                {filteredPlanos?.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                                        <Search className="size-12 mb-4 opacity-20" />
                                        <p className="font-medium">No se encontraron planos</p>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pb-20">
                                        {filteredPlanos?.map((plano) => {
                                            const isSelected = selectedPlanoId === plano.id;
                                            return (
                                                <motion.div
                                                    layoutId={`plano-${plano.id}`}
                                                    key={plano.id}
                                                    onClick={() => setSelectedPlanoId(isSelected ? null : plano.id)}
                                                    className={`relative bg-white rounded-2xl border transition-all cursor-pointer overflow-hidden group ${
                                                        isSelected 
                                                            ? 'border-orange-500 shadow-xl shadow-orange-500/10 ring-2 ring-orange-500/20' 
                                                            : 'border-gray-200 hover:border-orange-300 hover:shadow-lg hover:-translate-y-1'
                                                    }`}
                                                >
                                                    <div className="p-5">
                                                        <div className="flex justify-between items-start mb-3">
                                                            <div className={`size-10 rounded-xl flex items-center justify-center text-lg font-bold border ${getRarityColor(plano.recursoFabricado?.rareza)}`}>
                                                                {plano.nombre.charAt(0)}
                                                            </div>
                                                            <span className={`text-[9px] font-black px-2 py-1 rounded-full border ${getRarityColor(plano.recursoFabricado?.rareza)} uppercase`}>
                                                                {plano.recursoFabricado?.rareza}
                                                            </span>
                                                        </div>

                                                        <h3 className="font-bold text-gray-900 text-lg leading-tight mb-1">{plano.nombre}</h3>
                                                        <p className="text-xs text-gray-400 line-clamp-2 min-h-[2.5em]">{plano.desc}</p>
                                                        
                                                        {/* Stats Grid */}
                                                        <div className="grid grid-cols-2 gap-2 mt-4 pt-4 border-t border-gray-100">
                                                            <div className="flex flex-col">
                                                                <span className="text-[9px] text-gray-400 uppercase font-bold flex items-center gap-1">
                                                                    <Zap className="size-3" /> Costo
                                                                </span>
                                                                <span className="font-mono text-sm font-bold text-gray-900">{plano.coste.toLocaleString()} CR</span>
                                                            </div>
                                                            <div className="flex flex-col">
                                                                <span className="text-[9px] text-gray-400 uppercase font-bold flex items-center gap-1">
                                                                    <Timer className="size-3" /> Tiempo
                                                                </span>
                                                                <span className="font-mono text-sm font-bold text-gray-900">{(plano.tiempoConstrucion / 1000)}s</span>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Selection Action Layer */}
                                                    <AnimatePresence>
                                                        {isSelected && (
                                                            <motion.div 
                                                                initial={{ opacity: 0 }}
                                                                animate={{ opacity: 1 }}
                                                                exit={{ opacity: 0 }}
                                                                className="absolute inset-0 bg-white/90 backdrop-blur-[2px] flex items-center justify-center p-4 z-10"
                                                            >
                                                                <button
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        handleSelectPlano(plano);
                                                                    }}
                                                                    className="w-full bg-black text-white py-3 rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-orange-600 transition-colors shadow-lg flex items-center justify-center gap-2 transform active:scale-95"
                                                                >
                                                                    <Hammer className="size-4" />
                                                                    Fabricar
                                                                </button>
                                                            </motion.div>
                                                        )}
                                                    </AnimatePresence>
                                                </motion.div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        </div>
                    </Drawer.Content>
                </Drawer.Portal>
            </main>
        </Drawer.Root>
    );
}

// --- COMPONENTES AUXILIARES ---

function CountdownDisplay({ queue, onFinished }: { queue: Queue, onFinished: () => void }) {
    const [timeLeft, setTimeLeft] = useState("");
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const calculate = () => {
            const final = new Date(queue.finalTime).getTime();
            const inicio = new Date(queue.inicioTime).getTime();
            const now = Date.now();

            const total = final - inicio;
            const remaining = final - now;

            if (remaining <= 0) {
                onFinished();
                return;
            }

            setProgress(Math.min(((now - inicio) / total) * 100, 100));

            const m = Math.floor(remaining / 60000);
            const s = Math.floor((remaining % 60000) / 1000);
            setTimeLeft(`${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`);
        };

        const timer = setInterval(calculate, 1000);
        calculate();
        return () => clearInterval(timer);
    }, [queue, onFinished]);

    return (
        <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="p-6 rounded-3xl bg-white shadow-xl border border-zinc-100 flex flex-col relative overflow-hidden">
            <div className="flex justify-between items-end mb-4">
                <div className="flex flex-col">
                    <span className="text-[9px] font-black tracking-widest text-orange-500 uppercase">Sintetizando</span>
                    <span className="font-bold text-zinc-900 uppercase tracking-tight">{queue.plano.nombre}</span>
                </div>
                <span className="text-4xl font-mono font-bold text-zinc-900 tracking-tighter">{timeLeft}</span>
            </div>

            <div className="w-full h-1.5 bg-zinc-100 rounded-full overflow-hidden">
                <motion.div
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 1, ease: "linear" }}
                    className="h-full bg-orange-500"
                />
            </div>
        </motion.div>
    );
}

function Corners({ isActive }: { isActive: boolean }) {
    const style = `absolute transition-all duration-500 pointer-events-none ${isActive ? "w-6 h-6 border-orange-500" : "w-2 h-2 border-zinc-300"}`;
    return (
        <>
            <div className={`${style} -top-1 -left-1 border-t border-l`} />
            <div className={`${style} -top-1 -right-1 border-t border-r`} />
            <div className={`${style} -bottom-1 -left-1 border-b border-l`} />
            <div className={`${style} -bottom-1 -right-1 border-b border-r`} />
        </>
    );
}