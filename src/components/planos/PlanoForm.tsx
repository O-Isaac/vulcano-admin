import { useEffect, useState } from "react";
import useSWR from "swr";
import { fetcher } from "../../lib/api";
import type { Plano, Recurso } from "../../types/api";
import { Clock, DollarSign, FileText, Package, Plus, Trash2, Edit2, Check, X } from "lucide-react";
import {
    getPlanoComponentes,
    addPlanoComponentesBulk,
    updateComponente,
    deleteComponente
} from "../../services/vulcano.service";
import { toast } from "sonner";

interface PlanoFormProps {
    plano: Partial<Plano>;
    onUpdate: (plano: Partial<Plano>) => void;
    onDelete: (id?: number) => void;
    isNew?: boolean;
}

export default function PlanoForm({
    plano,
    onUpdate,
    onDelete,
    isNew = false,
}: PlanoFormProps) {
    const [planoData, setPlanoData] = useState<Partial<Plano>>(plano);

    // Time selector state
    const [hours, setHours] = useState(0);
    const [minutes, setMinutes] = useState(0);
    const [seconds, setSeconds] = useState(0);

    // Ingredients management state
    const [isAddingIngredients, setIsAddingIngredients] = useState(false);
    const [selectedIngredients, setSelectedIngredients] = useState<{ recursoId: number, cantidad: number }[]>([]);
    const [editingComponentId, setEditingComponentId] = useState<number | null>(null);
    const [editQuantity, setEditQuantity] = useState<number>(0);

    const { data: recursos, isLoading: loadingRecursos } = useSWR("recursos", fetcher<Recurso[]>);
    const { data: componentes, mutate: mutateComp, isLoading: loadingComp } = useSWR(
        planoData.id ? `planos/${planoData.id}/componentes` : null,
        () => getPlanoComponentes(planoData.id!)
    );


    useEffect(() => {
        setPlanoData(plano);
        if (plano.tiempoConstrucion) {
            const totalSeconds = Math.floor(plano.tiempoConstrucion / 1000);
            setHours(Math.floor(totalSeconds / 3600));
            setMinutes(Math.floor((totalSeconds % 3600) / 60));
            setSeconds(totalSeconds % 60);
        } else {
            setHours(0);
            setMinutes(0);
            setSeconds(0);
        }
    }, [plano]);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        console.log(name, value)
        setPlanoData(prev => {
            return {
                ...prev,
                [name]: name === 'coste' || name === 'recursoFabricadoId' ? (value === "" ? "" : Number(value)) : value,
            }
        })
    };

    const publishChanges = (e: React.FormEvent) => {
        e.preventDefault();
        const tiempoMs = (hours * 3600 + (minutes || 0) * 60 + (seconds || 0)) * 1000;
        const finalData = { ...planoData, tiempoConstrucion: tiempoMs };
        onUpdate(finalData);
    };

    // Components Handlers
    const handleAddBulk = async () => {
        if (!planoData.id || selectedIngredients.length === 0) return;

        toast.promise(addPlanoComponentesBulk(planoData.id, selectedIngredients), {
            loading: 'Añadiendo ingredientes...',
            success: () => {
                mutateComp();
                setIsAddingIngredients(false);
                setSelectedIngredients([]);
                return 'Ingredientes añadidos.';
            },
            error: 'Error al añadir ingredientes.'
        });
    };

    const handleUpdateQty = async (id: number, recursoId: number) => {
        toast.promise(updateComponente(id, { cantidad: editQuantity, recursoId }), {
            loading: 'Actualizando cantidad...',
            success: () => {
                mutateComp();
                setEditingComponentId(null);
                return 'Cantidad actualizada.';
            },
            error: 'Error al actualizar.'
        });
    };

    const handleDeleteComp = async (id: number) => {
        toast.promise(deleteComponente(id), {
            loading: 'Eliminando ingrediente...',
            success: () => {
                mutateComp();
                return 'Ingrediente eliminado.';
            },
            error: 'Error al eliminar.'
        });
    };

    const toggleIngredientSelection = (recursoId: number) => {
        setSelectedIngredients(prev => {
            const exists = prev.find(i => i.recursoId === recursoId);
            if (exists) {
                return prev.filter(i => i.recursoId !== recursoId);
            } else {
                return [...prev, { recursoId, cantidad: 1 }];
            }
        });
    };

    const updateSelectedQty = (recursoId: number, qty: number) => {
        setSelectedIngredients(prev => prev.map(i =>
            i.recursoId === recursoId ? { ...i, cantidad: Math.max(1, qty) } : i
        ));
    };

    return (
        <form
            onSubmit={publishChanges}
            className="flex flex-col h-full bg-white relative"
        >
            {/* Drawer Handle */}
            <div className="mx-auto w-12 h-1.5 shrink-0 rounded-full bg-gray-200 mt-4 mb-2" />

            {/* Header Section */}
            <div className="p-6 bg-white border-b border-gray-100 flex items-center justify-between shrink-0">
                <h2 className="text-xl font-bold flex items-center gap-2">
                    <FileText className="size-5 text-blue-500" />
                    {isNew ? "Crear Nuevo Plano" : "Editar Plano"}
                </h2>
                <button
                    type="button"
                    onClick={() => onDelete(planoData.id)}
                    className="p-2 hover:bg-gray-100 rounded-full text-gray-400 hover:text-red-500 transition-colors"
                >
                    <Trash2 className="size-5" />
                </button>
            </div>

            {/* Main Fields - Scrollable Area */}
            <div className="flex-1 overflow-y-auto min-h-0 flex flex-col custom-scrollbar pb-32">
                <label className="border-b border-gray-100 relative group flex items-center h-20">
                    <div className="w-16 flex justify-center text-gray-400 group-focus-within:text-blue-500 transition-colors">
                        <span className="font-bold text-xs uppercase vertical-text">Nombre</span>
                    </div>
                    <input
                        type="text"
                        name="nombre"
                        required
                        className="flex-1 p-6 h-full bg-transparent text-lg font-medium focus:outline-none placeholder:text-gray-300"
                        value={planoData.nombre || ""}
                        onChange={handleChange}
                        placeholder="Ej: Plano de Excalibur Prime"
                    />
                </label>

                {/* Target Fabrication Resource */}
                <div className="border-b border-gray-100 relative group flex items-center h-20">
                    <div className="w-16 flex justify-center text-gray-400 group-focus-within:text-purple-500 transition-colors">
                        <Package className="size-5" />
                    </div>
                    <div className="flex-1 flex flex-col justify-center px-6">
                        <span className="text-[10px] font-bold text-gray-400 uppercase mb-1">Resultado de Fabricación</span>
                        <select
                            name="recursoFabricadoId"
                            required
                            className="w-full bg-transparent text-lg font-medium focus:outline-none appearance-none cursor-pointer disabled:opacity-50"
                            value={planoData.recursoFabricadoId || planoData.recursoFabricado?.id || ""}
                            onChange={handleChange}
                            disabled={loadingRecursos || !recursos || recursos.length === 0}
                        >
                            {loadingRecursos ? (
                                <option>Cargando recursos...</option>
                            ) : !recursos || recursos.length === 0 ? (
                                <option value="">⚠️ No hay recursos disponibles</option>
                            ) : (
                                <>
                                    <option value="" disabled>Selecciona el recurso resultante</option>
                                    {recursos.map(r => (
                                        <option key={r.id} value={r.id}>{r.nombre}</option>
                                    ))}
                                </>
                            )}
                        </select>
                    </div>
                    <div className="absolute right-6 pointer-events-none text-gray-300 text-xs">▼</div>
                </div>

                <label className="border-b border-gray-100 relative group flex items-center h-20">
                    <div className="w-16 flex justify-center text-gray-400 group-focus-within:text-green-500 transition-colors">
                        <DollarSign className="size-5" />
                    </div>
                    <input
                        type="number"
                        name="coste"
                        required
                        min="0"
                        className="flex-1 p-6 h-full bg-transparent text-lg font-medium focus:outline-none placeholder:text-gray-300"
                        value={planoData.coste ?? ""}
                        onChange={handleChange}
                        placeholder="Coste en créditos"
                    />
                </label>

                {/* Time Selector */}
                <div className="border-b border-gray-100 p-6 flex flex-col gap-4 bg-gray-50/30">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                            <Clock className="size-4" />
                            Tiempo de Fabricación
                        </span>
                    </div>
                    <div className="flex gap-8 items-center justify-start ml-2">
                        <div className="flex flex-col items-center gap-1 group">
                            <input
                                type="number"
                                min="0"
                                className="w-16 text-2xl font-bold text-center bg-transparent border-b-2 border-gray-200 focus:border-blue-500 focus:outline-none transition-colors"
                                value={hours}
                                onChange={(e) => setHours(Math.max(0, Number(e.target.value)))}
                            />
                            <span className="text-[10px] uppercase font-bold text-gray-400 group-focus-within:text-blue-500">Horas</span>
                        </div>
                        <div className="text-2xl font-light text-gray-300">:</div>
                        <div className="flex flex-col items-center gap-1 group">
                            <input
                                type="number"
                                min="0"
                                max="59"
                                className="w-16 text-2xl font-bold text-center bg-transparent border-b-2 border-gray-200 focus:border-blue-500 focus:outline-none transition-colors"
                                value={minutes}
                                onChange={(e) => setMinutes(Math.min(59, Math.max(0, Number(e.target.value))))}
                            />
                            <span className="text-[10px] uppercase font-bold text-gray-400 group-focus-within:text-blue-500">Minutos</span>
                        </div>
                        <div className="text-2xl font-light text-gray-300">:</div>
                        <div className="flex flex-col items-center gap-1 group">
                            <input
                                type="number"
                                min="0"
                                max="59"
                                className="w-16 text-2xl font-bold text-center bg-transparent border-b-2 border-gray-200 focus:border-blue-500 focus:outline-none transition-colors"
                                value={seconds}
                                onChange={(e) => setSeconds(Math.min(59, Math.max(0, Number(e.target.value))))}
                            />
                            <span className="text-[10px] uppercase font-bold text-gray-400 group-focus-within:text-blue-500">Segundos</span>
                        </div>
                    </div>
                </div>

                {/* Ingredients Section */}
                {!isNew && (
                    <div className="border-b border-gray-100 flex flex-col">
                        <div className="p-6 bg-gray-50/50 flex items-center justify-between border-b border-gray-100">
                            <span className="text-xs font-bold text-gray-500 uppercase flex items-center gap-2">
                                <Plus className="size-4" />
                                Ingredientes
                            </span>
                            <button
                                type="button"
                                onClick={() => setIsAddingIngredients(!isAddingIngredients)}
                                className={`p-2 rounded-full transition-all cursor-pointer border ${isAddingIngredients ? 'bg-black text-white border-black' : 'hover:bg-gray-100 border-gray-200'}`}
                            >
                                {isAddingIngredients ? <X className="size-4" /> : <Plus className="size-4" />}
                            </button>
                        </div>

                        {/* Bulk Adding UI */}
                        {isAddingIngredients && (
                            <div className="p-6 bg-white border-b border-gray-100 space-y-4 animate-in slide-in-from-top duration-300">
                                <p className="text-[11px] font-bold text-gray-400 uppercase">Selecciona recursos</p>
                                <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto p-1 custom-scrollbar">
                                    {recursos?.filter(r => r.id !== planoData.recursoFabricado?.id).map(r => {
                                        const selected = selectedIngredients.find(i => i.recursoId === r.id);
                                        return (
                                            <div
                                                key={r.id}
                                                onClick={() => toggleIngredientSelection(r.id)}
                                                className={`p-3 border rounded-lg cursor-pointer transition-all flex flex-col gap-2 ${selected ? 'border-blue-600 bg-blue-50/50' : 'border-gray-100 hover:border-gray-300'}`}
                                            >
                                                <span className="text-xs font-bold truncate">{r.nombre}</span>
                                                {selected && (
                                                    <div onClick={e => e.stopPropagation()} className="flex items-center gap-2 mt-1">
                                                        <input
                                                            type="number"
                                                            min="1"
                                                            className="w-full bg-white border border-blue-200 text-[11px] font-bold p-1 rounded focus:outline-none"
                                                            value={selected.cantidad}
                                                            onChange={e => updateSelectedQty(r.id, Number(e.target.value))}
                                                        />
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                                <button
                                    type="button"
                                    onClick={handleAddBulk}
                                    disabled={selectedIngredients.length === 0}
                                    className="w-full py-3 bg-black text-white text-[10px] font-bold uppercase tracking-widest hover:bg-gray-800 disabled:bg-gray-200 transition-all rounded-xl"
                                >
                                    Añadir {selectedIngredients.length} Ingredientes
                                </button>
                            </div>
                        )}

                        {/* Existing Components List */}
                        <div className="flex flex-col divide-y divide-gray-50">
                            {loadingComp ? (
                                <div className="p-6 text-xs text-gray-400 italic">Cargando ingredientes...</div>
                            ) : componentes && componentes.length > 0 ? (
                                componentes.map(comp => (
                                    <div key={comp.id} className={`p-4 flex items-center justify-between group transition-colors ${editingComponentId === comp.id ? 'bg-blue-50/30' : 'hover:bg-gray-50/50'}`}>
                                        <div className="flex items-center gap-3">
                                            <div className="size-8 rounded bg-gray-100 flex items-center justify-center font-bold text-[10px] text-gray-500">
                                                {comp.cantidad}x
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-sm font-bold text-gray-900">{comp.recurso?.nombre || `Recurso #${comp.recursoId}`}</span>
                                                <span className="text-[10px] text-gray-400 uppercase tracking-tighter">ID: {comp.recursoId}</span>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-1 opacity-100">
                                            {editingComponentId === comp.id ? (
                                                <div className="flex items-center gap-1 bg-white p-1 rounded-lg border border-blue-100 shadow-sm animate-in zoom-in-95">
                                                    <input
                                                        type="number"
                                                        className="w-14 border-none bg-transparent p-1 text-xs font-bold focus:ring-0"
                                                        value={editQuantity}
                                                        onChange={e => setEditQuantity(Number(e.target.value))}
                                                        autoFocus
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => handleUpdateQty(comp.id, comp.recursoId || comp.recurso?.id!)}
                                                        className="p-1.5 hover:bg-green-50 text-green-600 rounded-md transition-colors"
                                                        title="Guardar"
                                                    >
                                                        <Check className="size-4" />
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => setEditingComponentId(null)}
                                                        className="p-1.5 hover:bg-red-50 text-red-500 rounded-md transition-colors"
                                                        title="Cancelar"
                                                    >
                                                        <X className="size-4" />
                                                    </button>
                                                </div>
                                            ) : (
                                                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            setEditingComponentId(comp.id);
                                                            setEditQuantity(comp.cantidad);
                                                        }}
                                                        className="p-2 hover:bg-blue-50 text-blue-600 rounded-md transition-colors"
                                                        title="Editar cantidad"
                                                    >
                                                        <Edit2 className="size-3.5" />
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleDeleteComp(comp.id)}
                                                        className="p-2 hover:bg-red-50 text-red-600 rounded-md transition-colors"
                                                        title="Eliminar ingrediente"
                                                    >
                                                        <Trash2 className="size-3.5" />
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="p-8 text-center flex flex-col items-center gap-2">
                                    <div className="size-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-300">
                                        <Plus className="size-5" />
                                    </div>
                                    <span className="text-[10px] font-bold text-gray-400 uppercase px-12">No hay ingredientes definidos</span>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Description */}
                <label className="border-b border-gray-100 relative group flex flex-col p-6 min-h-32 bg-gray-50/20">
                    <span className="text-xs font-bold text-gray-400 uppercase mb-2">Notas / Descripción</span>
                    <textarea
                        name="desc"
                        required
                        className="flex-1 bg-transparent text-base focus:outline-none resize-none placeholder:text-gray-300 leading-relaxed"
                        value={planoData.desc || ""}
                        onChange={handleChange}
                        placeholder="Propósito, origen o notas del plano..."
                    />
                </label>
            </div>

            {/* Footer Actions */}
            <div className="absolute bottom-0 left-0 right-0 flex h-20 divide-x divide-gray-100 bg-white/80 backdrop-blur-xl border-t border-gray-100 z-50">
                <button
                    type="submit"
                    disabled={loadingRecursos || !recursos || recursos.length === 0}
                    className="flex-1 bg-black text-white font-bold hover:bg-gray-800 transition-colors cursor-pointer disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed uppercase tracking-widest text-[11px]"
                >
                    {isNew ? "Crear Plano" : "Publicar Cambios"}
                </button>
                <button
                    type="button"
                    className="flex-1 bg-white text-gray-900 font-bold hover:bg-gray-50 transition-colors cursor-pointer uppercase tracking-widest text-[11px]"
                    onClick={() => onDelete(planoData.id)}
                >
                    {isNew ? "Cancelar" : "Eliminar"}
                </button>
            </div>

            <style>{`
                .vertical-text {
                    writing-mode: vertical-rl;
                    transform: rotate(180deg);
                }
            `}</style>
        </form>
    );
}
