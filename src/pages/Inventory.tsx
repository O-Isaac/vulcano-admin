import { useInventory } from "../hooks/useInventory";
import { Package, ShieldCheck, Zap, Info, Settings, Plus, Check, Search, X, Filter } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuthStore } from "../store/useAuthStore";
import { Link } from "react-router-dom";
import { Drawer } from "vaul";
import { useState, useMemo } from "react";
import useSWR from "swr";
import { fetcher } from "../lib/api";
import type { Recurso } from "../types/api";
import { createMyInventory } from "../services/vulcano.service";
import { toast } from "sonner";

export default function InventoryPage() {
    const { inventory, isLoading, error, refresh } = useInventory();
    const user = useAuthStore(state => state.user);
    const isAdmin = user?.roles?.includes('ADMIN');

    const [isAddOpen, setIsAddOpen] = useState(false);
    const [selectedRecursoId, setSelectedRecursoId] = useState<number | "">("");
    const [isCreating, setIsCreating] = useState(false);

    // Búsqueda y Filtros
    const [searchTerm, setSearchTerm] = useState("");
    const [rarityFilter, setRarityFilter] = useState("ALL");

    const { data: recursos } = useSWR<Recurso[]>(isAddOpen ? "recursos" : null, fetcher);

    // Filtrar recursos que ya tengo
    const availableRecursos = recursos?.filter(r => !inventory?.some(i => i.recurso.id === r.id));

    // Lógica de filtrado visual
    const filteredInventory = useMemo(() => {
        if (!inventory) return [];
        return inventory.filter(item => {
            const matchesSearch = item.recurso.nombre.toLowerCase().includes(searchTerm.toLowerCase()) || 
                                  item.recurso.desc.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesRarity = rarityFilter === "ALL" || item.recurso.rareza.toUpperCase() === rarityFilter;
            
            return matchesSearch && matchesRarity;
        });
    }, [inventory, searchTerm, rarityFilter]);

    const handleCreate = async () => {
        if (!selectedRecursoId) return;
        setIsCreating(true);
        try {
            const success = await createMyInventory(Number(selectedRecursoId));
            if (success) {
                toast.success("Recurso añadido a la bóveda");
                refresh();
                setIsAddOpen(false);
                setSelectedRecursoId("");
            } else {
                toast.error("No se pudo añadir el recurso");
            }
        } catch (e) {
            toast.error("Error de conexión");
        } finally {
            setIsCreating(false);
        }
    };

    if (isLoading) {
        return (
            <div className="p-12 flex flex-col items-center justify-center min-h-[60vh] gap-4">
                <div className="size-12 border-4 border-gray-100 border-t-black rounded-full animate-spin" />
                <p className="text-gray-400 font-medium animate-pulse uppercase tracking-widest text-xs">Accediendo a la Bóveda...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-12 text-center">
                <p className="text-red-500 font-bold uppercase tracking-widest text-xs">Error de Sincronización</p>
                <p className="text-gray-400 text-sm mt-2">No se pudo recuperar el inventario de la red.</p>
                <p className="text-gray-400 text-sm mt-2">{error.message}.</p>
            </div>
        );
    }

    const getRarityGlow = (rarity: string) => {
        switch (rarity.toLowerCase()) {
            case 'comun': return 'group-hover:shadow-gray-200';
            case 'raro': return 'group-hover:shadow-blue-200';
            case 'epico': return 'group-hover:shadow-purple-200';
            case 'legendario': return 'group-hover:shadow-orange-200';
            default: return 'group-hover:shadow-gray-200';
        }
    };

    const getRarityTag = (rarity: string) => {
        switch (rarity.toLowerCase()) {
            case 'comun': return 'bg-gray-50 text-gray-500 border-gray-200';
            case 'raro': return 'bg-blue-50 text-blue-600 border-blue-200';
            case 'epico': return 'bg-purple-50 text-purple-600 border-purple-200';
            case 'legendario': return 'bg-orange-50 text-orange-600 border-orange-200';
            default: return 'bg-gray-50 text-gray-500 border-gray-200';
        }
    };

    return (
        <Drawer.Root open={isAddOpen} onOpenChange={setIsAddOpen}>
            <div className="p-8 lg:p-12 max-w-7xl mx-auto">
                <header className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <ShieldCheck className="size-6 text-blue-500" />
                            <h1 className="text-3xl font-black uppercase tracking-tighter text-gray-900">Bóveda Personal</h1>
                        </div>
                        <p className="text-gray-400 font-medium">Gestiona tus recursos asegurados y componentes de fabricación.</p>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                        {/* Search Bar */}
                        <div className="relative group w-full sm:w-64">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors size-4" />
                            <input 
                                type="text" 
                                placeholder="Buscar recurso..." 
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full bg-white border border-gray-200 focus:border-blue-500 rounded-xl py-2.5 pl-10 pr-4 text-sm font-medium transition-all outline-none placeholder:text-gray-400 shadow-sm"
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

                        {/* Admin Action */}
                        <div className="flex gap-2">
                            {isAdmin && (
                                <button
                                    onClick={() => setIsAddOpen(true)}
                                    className="flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-blue-700 transition-colors shadow-sm shadow-blue-200 flex-1 sm:flex-none whitespace-nowrap"
                                >
                                    <Plus className="size-4" />
                                    <span className="hidden sm:inline">Nuevo</span>
                                </button>
                            )}
                            {isAdmin && (
                                <Link 
                                    to="/admin-inventario" 
                                    className="flex items-center justify-center gap-2 bg-black text-white px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-gray-800 transition-colors flex-1 sm:flex-none whitespace-nowrap"
                                >
                                    <Settings className="size-4" />
                                    {/* <span className="hidden sm:inline">Gestionar</span> */}
                                </Link>
                            )}
                        </div>
                    </div>
                </header>

                {/* Filter Tabs */}
                <div className="flex gap-2 mb-8 overflow-x-auto pb-2 no-scrollbar">
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

                {!inventory ? (
                     // Loading state handled above but safety check
                     null
                ) : filteredInventory.length === 0 ? (
                    <div className="py-24 flex flex-col items-center gap-6 border-2 border-dashed border-gray-100 rounded-3xl bg-gray-50/50">
                        <div className="size-20 bg-white flex items-center justify-center rounded-full text-gray-300 shadow-sm font-bold border border-gray-100">
                           {searchTerm || rarityFilter !== 'ALL' ? <Filter className="size-8" /> : <Package className="size-8" />} 
                        </div>
                        <div className="text-center">
                            <p className="text-lg font-bold text-gray-400 uppercase tracking-widest">
                                {searchTerm || rarityFilter !== 'ALL' ? 'Sin Resultados' : 'Bóveda Vacía'}
                            </p>
                            <p className="text-sm text-gray-400 mt-1 max-w-xs mx-auto">
                                {searchTerm || rarityFilter !== 'ALL' ? 'Intenta ajústando tus filtros de búsqueda.' : 'No tienes recursos registrados en tu cuenta todavía.'}
                            </p>
                        </div>
                    </div>
                ) : (
                    <motion.div 
                        layout 
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
                    >
                        <AnimatePresence mode="popLayout">
                            {filteredInventory.map((item) => (
                                <motion.div
                                    layout
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    transition={{ duration: 0.2 }}
                                    key={item.recurso.id}
                                    className={`group flex flex-col h-full bg-white border border-gray-100 p-5 rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 relative overflow-hidden ${getRarityGlow(item.recurso.rareza)}`}
                                >
                                    <div className="flex justify-between items-start mb-4">
                                        <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-md border ${getRarityTag(item.recurso.rareza)}`}>
                                            {item.recurso.rareza}
                                        </span>
                                        <Zap className="size-4 text-gray-200 group-hover:text-blue-400 transition-colors shrink-0" />
                                    </div>

                                    <div className="mb-4 flex-1">
                                        <h3 className="text-lg font-bold text-gray-900 leading-tight mb-2 truncate">
                                            {item.recurso.nombre}
                                        </h3>
                                        <p 
                                            className="text-xs text-gray-400 leading-relaxed line-clamp-4 group-hover:line-clamp-none transition-all"
                                            title={item.recurso.desc}
                                        >
                                            {item.recurso.desc}
                                        </p>
                                    </div>

                                    <div className="pt-4 mt-auto border-t border-gray-50 flex items-center justify-between">
                                        <div className="flex flex-col">
                                            <span className="text-[9px] font-bold text-gray-300 uppercase tracking-widest">Cantidad</span>
                                            <span className="text-xl font-black text-gray-900 font-mono">{item.cantidad.toLocaleString()}</span>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </motion.div>
                )}

            <Drawer.Portal>
                <Drawer.Overlay className="fixed inset-0 bg-black/40 z-50 backdrop-blur-[2px]" />
                <Drawer.Content className="bg-white flex flex-col rounded-t-[20px] h-[50vh] mt-24 fixed bottom-0 left-0 right-0 z-50 outline-none shadow-2xl overflow-hidden border-t border-gray-200">
                     <div className="p-4 bg-white border-b border-gray-100 flex items-center justify-center shrink-0">
                        <div className="w-12 h-1.5 bg-gray-200 rounded-full" />
                     </div>
                     <div className="p-8 flex-1 overflow-y-auto">
                        <div className="max-w-md mx-auto space-y-6">
                            <div className="text-center">
                                <h2 className="text-xl font-bold text-gray-900">Añadir Nuevo Recurso</h2>
                                <p className="text-sm text-gray-500">Selecciona un recurso para desbloquearlo en tu inventario.</p>
                            </div>

                            <div className="space-y-4">
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest block">Recurso Disponible</label>
                                <select 
                                    value={selectedRecursoId}
                                    onChange={(e) => setSelectedRecursoId(Number(e.target.value))}
                                    className="w-full bg-gray-50 border-2 border-transparent hover:border-gray-200 focus:border-blue-500 rounded-xl p-4 outline-none font-medium text-gray-700 transition-all appearance-none cursor-pointer"
                                >
                                    <option value="" disabled>Selecciona...</option>
                                    {availableRecursos?.map(r => (
                                        <option key={r.id} value={r.id}>{r.nombre}</option>
                                    ))}
                                    {availableRecursos?.length === 0 && (
                                        <option disabled>¡Ya tienes todos los recursos!</option>
                                    )}
                                </select>
                            </div>

                            <button
                                onClick={handleCreate}
                                disabled={!selectedRecursoId || isCreating}
                                className="w-full bg-blue-600 text-white p-4 rounded-xl font-bold uppercase tracking-widest hover:bg-blue-700 disabled:bg-gray-200 disabled:text-gray-400 transition-all flex items-center justify-center gap-2"
                            >
                                {isCreating ? 'Procesando...' : (
                                    <>
                                        <Plus className="size-5" />
                                        Desbloquear Recurso
                                    </>
                                )}
                            </button>
                        </div>
                     </div>
                </Drawer.Content>
            </Drawer.Portal>

        </div>
        </Drawer.Root>
    );
}
