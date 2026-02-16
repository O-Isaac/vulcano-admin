import { Plus, X, Trash2, Edit2, Check } from "lucide-react";
import type { Recurso, Componente } from "../../../types/api";

// We can define the props that this component needs
interface PlanoIngredientsProps {
    isNew: boolean;
    recursos?: Recurso[];
    recursoFabricadoId?: number;
    // adding related
    isAdding: boolean;
    setIsAdding: (v: boolean) => void;
    // bulk selection
    selectedIngredients: { recursoId: number; cantidad: number }[];
    toggleSelection: (id: number) => void;
    updateSelectionQty: (id: number, qty: number) => void;
    onAddBulk: () => void;
    // existing list
    loadingComp: boolean;
    componentes?: Componente[];
    // editing existing
    editingId: number | null;
    setEditingId: (id: number | null) => void;
    editQty: number;
    setEditQty: (qty: number) => void;
    onUpdateQty: (id: number, recursoId: number) => void;
    onDeleteComp: (id: number) => void;
}

export function PlanoIngredientsSection({
    isNew,
    recursos,
    recursoFabricadoId,
    isAdding,
    setIsAdding,
    selectedIngredients,
    toggleSelection,
    updateSelectionQty,
    onAddBulk,
    loadingComp,
    componentes,
    editingId,
    setEditingId,
    editQty,
    setEditQty,
    onUpdateQty,
    onDeleteComp
}: PlanoIngredientsProps) {
    if (isNew) return null;

    return (
        <div className="border-b border-gray-100 flex flex-col">
            <div className="p-6 bg-gray-50/50 flex items-center justify-between border-b border-gray-100">
                <span className="text-xs font-bold text-gray-500 uppercase flex items-center gap-2">
                    <Plus className="size-4" />
                    Ingredientes
                </span>
                <button
                    type="button"
                    onClick={() => setIsAdding(!isAdding)}
                    className={`p-2 rounded-full transition-all cursor-pointer border ${isAdding ? 'bg-black text-white border-black' : 'hover:bg-gray-100 border-gray-200'}`}
                >
                    {isAdding ? <X className="size-4" /> : <Plus className="size-4" />}
                </button>
            </div>

            {/* Bulk Adding UI */}
            {isAdding && (
                <div className="p-6 bg-white border-b border-gray-100 space-y-4 animate-in slide-in-from-top duration-300">
                    <p className="text-[11px] font-bold text-gray-400 uppercase">Selecciona recursos</p>
                    <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto p-1 custom-scrollbar">
                        {recursos?.filter(r => r.id !== recursoFabricadoId).map(r => {
                            const selected = selectedIngredients.find(i => i.recursoId === r.id);
                            return (
                                <div
                                    key={r.id}
                                    onClick={() => toggleSelection(r.id)}
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
                                                onChange={e => updateSelectionQty(r.id, Number(e.target.value))}
                                            />
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                    <button
                        type="button"
                        onClick={onAddBulk}
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
                        <div key={comp.id} className={`p-4 flex items-center justify-between group transition-colors ${editingId === comp.id ? 'bg-blue-50/30' : 'hover:bg-gray-50/50'}`}>
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
                                {editingId === comp.id ? (
                                    <div className="flex items-center gap-1 bg-white p-1 rounded-lg border border-blue-100 shadow-sm animate-in zoom-in-95">
                                        <input
                                            type="number"
                                            className="w-14 border-none bg-transparent p-1 text-xs font-bold focus:ring-0"
                                            value={editQty}
                                            onChange={e => setEditQty(Number(e.target.value))}
                                            autoFocus
                                        />
                                        <button
                                            type="button"
                                            onClick={() => onUpdateQty(comp.id, comp.recursoId || comp.recurso?.id || 0)}
                                            className="p-1.5 hover:bg-green-50 text-green-600 rounded-md transition-colors"
                                            title="Guardar"
                                        >
                                            <Check className="size-4" />
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setEditingId(null)}
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
                                                setEditingId(comp.id);
                                                setEditQty(comp.cantidad);
                                            }}
                                            className="p-2 hover:bg-blue-50 text-blue-600 rounded-md transition-colors"
                                            title="Editar cantidad"
                                        >
                                            <Edit2 className="size-3.5" />
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => onDeleteComp(comp.id)}
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
    );
}
