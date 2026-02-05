import { useInventory } from "../hooks/useInventory";
import { Package, ShieldCheck, Zap, Info, Settings, Plus, Check } from "lucide-react";
import { motion } from "framer-motion";
import { useAuthStore } from "../store/useAuthStore";
import { Link } from "react-router-dom";
import { Drawer } from "vaul";
import { useState } from "react";
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

    const { data: recursos } = useSWR<Recurso[]>(isAddOpen ? "recursos" : null, fetcher);

    // Filtrar recursos que ya tengo
    const availableRecursos = recursos?.filter(r => !inventory?.some(i => i.recurso.id === r.id));

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
            case 'comun': return 'bg-gray-100 text-gray-400';
            case 'raro': return 'bg-blue-100 text-blue-500';
            case 'epico': return 'bg-purple-100 text-purple-500';
            case 'legendario': return 'bg-orange-100 text-orange-500';
            default: return 'bg-gray-100 text-gray-400';
        }
    };

    return (
        <Drawer.Root open={isAddOpen} onOpenChange={setIsAddOpen}>
            <div className="p-8 lg:p-12 max-w-7xl mx-auto">
                <header className="mb-12 flex flex-col md:flex-row md:items-start justify-between gap-6">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <ShieldCheck className="size-6 text-blue-500" />
                            <h1 className="text-3xl font-black uppercase tracking-tighter text-gray-900">Bóveda Personal</h1>
                        </div>
                        <p className="text-gray-400 font-medium">Gestiona tus recursos asegurados y componentes de fabricación.</p>
                    </div>
                    <div className="flex items-center gap-3">
                        {isAdmin && (
                            <button
                                onClick={() => setIsAddOpen(true)}
                                className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-blue-700 transition-colors shadow-sm shadow-blue-200"
                            >
                                <Plus className="size-4" />
                                <span>Nuevo Recurso</span>
                            </button>
                        )}
                        {isAdmin && (
                            <Link 
                                to="/admin-inventario" 
                                className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-gray-800 transition-colors"
                            >
                                <Settings className="size-4" />
                                <span>Gestionar</span>
                            </Link>
                        )}
                    </div>
                </header>

                {!inventory || inventory.length === 0 ? (
                <div className="py-24 flex flex-col items-center gap-6 border-2 border-dashed border-gray-100 rounded-3xl">
                    <div className="size-20 bg-gray-50 flex items-center justify-center rounded-full text-gray-200">
                        <Package className="size-10" />
                    </div>
                    <div className="text-center">
                        <p className="text-lg font-bold text-gray-400 uppercase tracking-widest">Inventario Vacío</p>
                        <p className="text-sm text-gray-300 mt-1">No tienes recursos registrados en tu cuenta todavía.</p>
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {inventory.map((item, idx) => (
                        <motion.div
                            key={item.recurso.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.05 }}
                            className={`group bg-white border border-gray-100 p-6 rounded-3xl shadow-sm hover:shadow-xl transition-all duration-500 relative overflow-hidden ${getRarityGlow(item.recurso.rareza)}`}
                        >
                            <div className="absolute top-0 right-0 p-4">
                                <Zap className="size-4 text-gray-100 group-hover:text-blue-50 transition-colors" />
                            </div>

                            <div className="flex flex-col h-full">
                                <div className="mb-6">
                                    <span className={`text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full ${getRarityTag(item.recurso.rareza)}`}>
                                        {item.recurso.rareza}
                                    </span>
                                </div>

                                <div className="flex-1">
                                    <h3 className="text-xl font-bold text-gray-800 mb-2 leading-tight group-hover:text-black transition-colors truncate">
                                        {item.recurso.nombre}
                                    </h3>
                                    <p className="text-gray-400 text-xs line-clamp-2 leading-relaxed mb-6 group-hover:text-gray-500 transition-colors">
                                        {item.recurso.desc}
                                    </p>
                                </div>

                                <div className="flex items-center justify-between mt-auto pt-6 border-t border-gray-50">
                                    <div className="flex flex-col">
                                        <span className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">Cantidad</span>
                                        <span className="text-2xl font-black text-gray-900">{item.cantidad.toLocaleString()}</span>
                                    </div>
                                    <div className="size-10 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-300 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                                        <Info className="size-5" />
                                    </div>
                                </div>
                            </div>

                            {/* subtle background pattern */}
                            <div className="absolute -bottom-4 -left-4 text-gray-50/50 text-6xl font-black italic pointer-events-none select-none group-hover:text-blue-50 group-hover:scale-110 transition-all duration-700">
                                {idx + 1}
                            </div>
                        </motion.div>
                    ))}
                </div>
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
