import { useState } from "react";
import useSWR from "swr";
import { fetcher } from "../lib/api";
import { type Jugador, type Recurso } from "../types/api";
import { updateInventario, addInventario, addCreditos } from "../services/vulcano.service";
import { toast } from "sonner";
import { Backpack, Grip, Search, User, ChevronDown, Check, AlertCircle, DollarSign, Wallet } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { motion, AnimatePresence } from "framer-motion";

export default function AdminInventory() {
    const { data: jugadores, isLoading: isLoadingJugadores } = useSWR("jugadores", fetcher<Jugador[]>);
    const { data: recursos, isLoading: isLoadingRecursos } = useSWR("recursos", fetcher<Recurso[]>);
    const user = useAuthStore((state) => state.user);
    const refreshUser = useAuthStore((state) => state.refreshUser);

    const [activeTab, setActiveTab] = useState<'inventory' | 'credits'>('inventory');

    const [selectedJugador, setSelectedJugador] = useState<number | "">("");
    const [selectedRecurso, setSelectedRecurso] = useState<number | "">("");
    const [cantidad, setCantidad] = useState<number>(1);
    const [creditos, setCreditos] = useState<number>(100);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedJugador) return;
        
        if (activeTab === 'inventory' && !selectedRecurso) return;

        setLoading(true);
        try {
            if (activeTab === 'inventory') {
                // Intentamos actualizar (PUT)
                let success = await updateInventario(Number(selectedJugador), Number(selectedRecurso), cantidad);
                
                if (!success) {
                    // Si falla, quizás no existe el registro, intentamos crear (POST)
                    const created = await addInventario(Number(selectedJugador), Number(selectedRecurso));
                    if (created) {
                        // Si se crea, volvemos a intentar actualizar con la cantidad correcta
                        success = await updateInventario(Number(selectedJugador), Number(selectedRecurso), cantidad);
                    }
                }

                if (success) {
                    toast.success("Inventario actualizado correctamente");
                    setCantidad(1);
                } else {
                    toast.error("No se pudo actualizar el inventario");
                }
            } else {
                // Add credits
                const success = await addCreditos(Number(selectedJugador), creditos);
                 if (success) {
                    toast.success("Créditos añadidos correctamente");
                    setCreditos(100);
                    // Si el admin se añade créditos a sí mismo, actualizar la UI inmediatamente
                    if (Number(selectedJugador) === user?.id) {
                        refreshUser();
                    }
                } else {
                    toast.error("Error al añadir créditos");
                }
            }
        } catch (error) {
            console.error(error);
            toast.error("Error en la operación");
        } finally {
            setLoading(false);
        }
    };

    const getRarityColor = (rarity: string) => {
        switch (rarity?.toUpperCase()) {
            case 'COMUN': return 'bg-gray-100 text-gray-500 border-gray-200';
            case 'RARO': return 'bg-blue-50 text-blue-600 border-blue-200';
            case 'EPICO': return 'bg-purple-50 text-purple-600 border-purple-200';
            case 'LEGENDARIO': return 'bg-orange-50 text-orange-600 border-orange-200';
            default: return 'bg-gray-50 text-gray-500 border-gray-200';
        }
    };

    return (
        <div className="p-8 lg:p-12 max-w-7xl mx-auto animate-in fade-in duration-500">
            <header className="mb-8">
                <div className="flex items-center gap-3 mb-2">
                    <Backpack className="size-6 text-indigo-500" />
                    <h1 className="text-3xl font-black uppercase tracking-tighter text-gray-900">Gestión de Admin</h1>
                </div>
                <p className="text-gray-400 font-medium">Panel de control administrativo de jugadores.</p>
            </header>

            {/* Tabs */}
            <div className="flex gap-4 mb-8">
                <button
                    onClick={() => setActiveTab('inventory')}
                    className={`flex items-center gap-2 px-6 py-3 rounded-full font-bold text-sm uppercase tracking-wider transition-colors border ${activeTab === 'inventory' ? 'bg-black text-white border-black' : 'bg-white text-gray-500 border-gray-200 hover:bg-gray-50'}`}
                >
                    <Grip className="size-4" />
                    Inventario
                </button>
                <button
                    onClick={() => setActiveTab('credits')}
                    className={`flex items-center gap-2 px-6 py-3 rounded-full font-bold text-sm uppercase tracking-wider transition-colors border ${activeTab === 'credits' ? 'bg-black text-white border-black' : 'bg-white text-gray-500 border-gray-200 hover:bg-gray-50'}`}
                >
                    <Wallet className="size-4" />
                    Créditos
                </button>
            </div>

            <div className="grid lg:grid-cols-2 gap-12">
                {/* Formulario */}
                <div className="bg-white rounded-3xl p-8 shadow-xl shadow-gray-100/50 border border-gray-100 sticky top-8 h-fit">
                    <form onSubmit={handleSubmit} className="flex flex-col gap-8">
                        
                        {/* Selector Jugador */}
                        <div className="space-y-3">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                <User className="size-4" />
                                Jugador Destino
                            </label>
                            <div className="relative group">
                                <select
                                    value={selectedJugador}
                                    onChange={(e) => setSelectedJugador(Number(e.target.value))}
                                    required
                                    className="w-full bg-gray-50 border-2 border-transparent hover:border-gray-200 focus:border-indigo-500 rounded-xl p-4 pr-10 outline-none font-medium text-gray-700 transition-all appearance-none cursor-pointer"
                                >
                                    <option value="" disabled>Seleccionar jugador...</option>
                                    {isLoadingJugadores ? (
                                        <option>Cargando jugadores...</option>
                                    ) : (
                                        jugadores?.map(j => (
                                            <option key={j.id} value={j.id}>
                                                Level {j.nivel} - {j.correo}
                                            </option>
                                        ))
                                    )}
                                </select>
                                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none size-5" />
                            </div>
                        </div>

                       {activeTab === 'inventory' ? (
                           <>
                                {/* Selector Recurso */}
                                <div className="space-y-3">
                                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                        <Grip className="size-4" />
                                        Recurso a Asignar
                                    </label>
                                    <div className="relative group">
                                        <select
                                            value={selectedRecurso}
                                            onChange={(e) => setSelectedRecurso(Number(e.target.value))}
                                            required
                                            className="w-full bg-gray-50 border-2 border-transparent hover:border-gray-200 focus:border-indigo-500 rounded-xl p-4 pr-10 outline-none font-medium text-gray-700 transition-all appearance-none cursor-pointer"
                                        >
                                            <option value="" disabled>Seleccionar recurso...</option>
                                            {isLoadingRecursos ? (
                                                <option>Cargando recursos...</option>
                                            ) : (
                                                recursos?.map(r => (
                                                    <option key={r.id} value={r.id}>
                                                        {r.nombre}
                                                    </option>
                                                ))
                                            )}
                                        </select>
                                        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none size-5" />
                                    </div>
                                </div>

                                {/* Cantidad Input */}
                                <div className="space-y-3">
                                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                        <Search className="size-4" />
                                        Cantidad Final
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="number"
                                            min="0"
                                            value={cantidad}
                                            onChange={(e) => setCantidad(Number(e.target.value))}
                                            required
                                            className="w-full bg-gray-50 border-2 border-transparent hover:border-gray-200 focus:border-indigo-500 rounded-xl p-4 outline-none font-bold text-xl text-gray-900 transition-all placeholder:text-gray-300"
                                            placeholder="0"
                                        />
                                        <div className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400 uppercase bg-gray-200 px-2 py-1 rounded">
                                            Unidades
                                        </div>
                                    </div>
                                </div>
                            </>
                       ) : (
                           // Credits Input
                           <div className="space-y-3">
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                    <DollarSign className="size-4" />
                                    Cantidad de Créditos
                                </label>
                                <div className="relative">
                                    <input
                                        type="number"
                                        min="1"
                                        value={creditos}
                                        onChange={(e) => setCreditos(Number(e.target.value))}
                                        required
                                        className="w-full bg-gray-50 border-2 border-transparent hover:border-gray-200 focus:border-yellow-500 rounded-xl p-4 outline-none font-bold text-xl text-gray-900 transition-all placeholder:text-gray-300"
                                        placeholder="0"
                                    />
                                    <div className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400 uppercase bg-yellow-100/50 text-yellow-700 px-2 py-1 rounded">
                                        CR
                                    </div>
                                </div>
                            </div>
                       )}

                        <div className="pt-4 border-t border-gray-100">
                             <button
                                type="submit"
                                disabled={loading || !selectedJugador || (activeTab === 'inventory' && !selectedRecurso)}
                                className="w-full bg-black text-white p-5 rounded-xl font-bold uppercase tracking-widest hover:bg-gray-800 disabled:bg-gray-200 disabled:text-gray-400 transition-all flex items-center justify-center gap-3 group"
                            >
                                {loading ? (
                                    <span className="inline-block size-4 border-2 border-white/30 border-t-white rounded-full animate-spin"/>
                                ) : (
                                    <Check className="size-5 group-hover:scale-110 transition-transform" />
                                )}
                                {loading ? 'Procesando...' : (activeTab === 'inventory' ? 'Confirmar Asignación' : 'Añadir Créditos')}
                            </button>
                        </div>
                    </form>
                </div>

                {/* Preview / Info */}
                <div className="flex flex-col gap-6">
                    {activeTab === 'inventory' ? (
                        <>
                            {/* Tarjeta de Recurso Preview */}
                            <AnimatePresence mode="wait">
                                {selectedRecurso && recursos ? (
                                    (() => {
                                        const r = recursos.find(rec => rec.id === Number(selectedRecurso));
                                        if (!r) return null;
                                        return (
                                            <motion.div
                                                key={r.id}
                                                initial={{ opacity: 0, x: 20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0, x: -20 }}
                                                transition={{ duration: 0.2 }}
                                                className="space-y-2"
                                            >
                                                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Previsualización</p>
                                                <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-start gap-5">
                                                    <div className={`size-16 shrink-0 rounded-2xl flex items-center justify-center border-2 ${getRarityColor(r.rareza)}`}>
                                                        <span className="text-2xl font-bold">{r.nombre.charAt(0)}</span>
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <h3 className="text-lg font-bold text-gray-900 truncate">{r.nombre}</h3>
                                                            <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full border ${getRarityColor(r.rareza)}`}>
                                                                {r.rareza}
                                                            </span>
                                                        </div>
                                                        <p className="text-sm text-gray-500 line-clamp-2">{r.desc}</p>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        );
                                    })()
                                ) : (
                                    <motion.div
                                        key="empty"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="h-40 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200 flex items-center justify-center text-gray-300"
                                    >
                                        <span className="text-sm font-bold uppercase tracking-widest">Selecciona un recurso</span>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Info Alert */}
                            <div className="bg-blue-50/50 p-6 rounded-3xl border border-blue-100 flex gap-4 items-start">
                                <div className="bg-blue-100 p-2 rounded-full shrink-0 text-blue-500">
                                    <AlertCircle className="size-5" />
                                </div>
                                <div className="space-y-1">
                                    <h4 className="text-sm font-bold text-blue-900 uppercase">Consideración importante</h4>
                                    <p className="text-sm text-blue-700/80 leading-relaxed">
                                        Esta acción modificará directamente la base de datos de inventario del usuario seleccionado.
                                        Si el recurso no existe en su inventario, se creará una nueva entrada.
                                        Si ya existe, se <strong>sobreescribirá</strong> la cantidad con el valor ingresado.
                                    </p>
                                </div>
                            </div>
                        </>
                    ) : (
                        // Credits Info
                         <div className="bg-yellow-50/50 p-6 rounded-3xl border border-yellow-100 flex gap-4 items-start animate-in slide-in-from-right-4 duration-500">
                            <div className="bg-yellow-100 p-2 rounded-full shrink-0 text-yellow-600">
                                <DollarSign className="size-5" />
                            </div>
                            <div className="space-y-1">
                                <h4 className="text-sm font-bold text-yellow-900 uppercase">Gestión Financiera</h4>
                                <p className="text-sm text-yellow-700/80 leading-relaxed">
                                    Estás a punto de transferir créditos a la cuenta del jugador.
                                    Esta operación <strong>sumará</strong> la cantidad especificada al saldo actual del usuario.
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
