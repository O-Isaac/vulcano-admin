import type { Plano } from "../../types/api";
import { Package, Clock, DollarSign, Layers, FileText } from "lucide-react";

interface PlanoListProps {
    planos: Plano[];
    onSelect: (plano: Plano) => void;
}

export default function PlanoList({ planos, onSelect }: PlanoListProps) {
    const formatTime = (ms: number) => {
        const totalSeconds = Math.floor(ms / 1000);
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;

        const parts = [];
        if (hours > 0) parts.push(`${hours}h`);
        if (minutes > 0) parts.push(`${minutes}m`);
        if (seconds > 0 || parts.length === 0) parts.push(`${seconds}s`);

        return parts.join(" ");
    };

    return (
        <ul className="p-0 divide-y divide-gray-100 bg-white">
            {planos.map((plano) => (
                <li
                    onClick={() => onSelect(plano)}
                    key={plano.id}
                    className="p-6 hover:bg-gray-50/80 cursor-pointer relative overflow-hidden group transition-all duration-300 border-l-4 border-l-transparent hover:border-l-blue-600 border-b border-b-gray-300"
                >
                    <div className="flex justify-between items-start relative z-10 min-w-0">
                        <div className="flex flex-col gap-3 min-w-0 flex-1">
                            <div className="flex items-center gap-3">
                                <div className="p-2.5 bg-gray-50 text-gray-400 rounded-xl group-hover:bg-blue-50 group-hover:text-blue-600 transition-all duration-300 shadow-sm border border-gray-100 group-hover:border-blue-100">
                                    <Package className="size-5" />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <h3 className="text-lg font-bold text-gray-800 group-hover:text-gray-900 leading-tight transition-colors truncate">
                                        {plano.nombre}
                                    </h3>
                                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter truncate block">Esquema #{plano.id}</span>
                                </div>
                            </div>

                            <div className="flex flex-wrap gap-4 items-center">
                                <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-white border border-gray-100 group-hover:border-blue-50 transition-colors shadow-xs">
                                    <Clock className="size-3 text-blue-500" />
                                    <span className="text-[11px] font-bold text-gray-600 uppercase">{formatTime(plano.tiempoConstrucion)}</span>
                                </div>
                                <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-white border border-gray-100 group-hover:border-green-50 transition-colors shadow-xs">
                                    <DollarSign className="size-3 text-green-500" />
                                    <span className="text-[11px] font-bold text-gray-600 uppercase">{plano.coste.toLocaleString()} CR</span>
                                </div>
                                {plano.componentes && plano.componentes.length > 0 && (
                                    <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-white border border-gray-100 group-hover:border-purple-50 transition-colors shadow-xs">
                                        <Layers className="size-3 text-purple-500" />
                                        <span className="text-[11px] font-bold text-gray-600 uppercase">{plano.componentes.length} Ítems</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Minimal Indicator */}
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <div className="size-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                                <FileText className="size-4" />
                            </div>
                        </div>
                    </div>

                    {/* Ghost Background Number - Very Subtle */}
                    <p className="text-8xl font-black text-gray-50/30 absolute -right-4 -bottom-4 select-none group-hover:text-gray-100/40 transition-all duration-700 pointer-events-none tracking-tighter italic">
                        {plano.id}
                    </p>
                </li>
            ))}
        </ul>
    );
}
