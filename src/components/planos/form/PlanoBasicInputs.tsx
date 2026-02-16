import { DollarSign, Package } from "lucide-react";
import type { Plano, Recurso } from "../../../types/api";

interface PlanoBasicInputsProps {
    planoData: Partial<Plano>;
    onChange: React.ChangeEventHandler<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>;
    recursos?: Recurso[];
    loadingRecursos: boolean;
}

export function PlanoBasicInputs({ planoData, onChange, recursos, loadingRecursos }: PlanoBasicInputsProps) {
    return (
        <div className="flex flex-col gap-0 border-b border-gray-100">
            {/* Name */}
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
                    onChange={onChange}
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
                        onChange={onChange}
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

            {/* Cost */}
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
                    onChange={onChange}
                    placeholder="Coste en créditos"
                />
            </label>
        </div>
    );
}
