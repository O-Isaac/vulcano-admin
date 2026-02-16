import { Trash2, FileText } from "lucide-react";

interface PlanoHeaderProps {
    isNew: boolean;
    onDelete: () => void;
}

export function PlanoHeader({ isNew, onDelete }: PlanoHeaderProps) {
    return (
        <div className="p-6 bg-white border-b border-gray-100 flex items-center justify-between shrink-0">
            <h2 className="text-xl font-bold flex items-center gap-2">
                <FileText className="size-5 text-blue-500" />
                {isNew ? "Crear Nuevo Plano" : "Editar Plano"}
            </h2>
            <button
                type="button"
                onClick={onDelete}
                className="p-2 hover:bg-gray-100 rounded-full text-gray-400 hover:text-red-500 transition-colors"
                title="Eliminar Plano"
            >
                <Trash2 className="size-5" />
            </button>
        </div>
    );
}
