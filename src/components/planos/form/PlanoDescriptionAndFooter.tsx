interface PlanoDescriptionProps {
    value: string;
    onChange: React.ChangeEventHandler<HTMLTextAreaElement>;
}

export function PlanoDescription({ value, onChange }: PlanoDescriptionProps) {
    return (
        <label className="border-b border-gray-100 relative group flex flex-col p-6 min-h-32 bg-gray-50/20">
            <span className="text-xs font-bold text-gray-400 uppercase mb-2">Notas / Descripción</span>
            <textarea
                name="desc"
                required
                className="flex-1 bg-transparent text-base focus:outline-none resize-none placeholder:text-gray-300 leading-relaxed"
                value={value || ""}
                onChange={onChange}
                placeholder="Propósito, origen o notas del plano..."
            />
        </label>
    );
}

interface PlanoFooterProps {
    isNew: boolean;
    loadingRecursos: boolean;
    noRecursos: boolean;
    onCancel: () => void;
}

export function PlanoFormFooter({ isNew, loadingRecursos, noRecursos, onCancel }: PlanoFooterProps) {
    return (
        <div className="absolute bottom-0 left-0 right-0 flex h-20 divide-x divide-gray-100 bg-white/80 backdrop-blur-xl border-t border-gray-100 z-50">
            <button
                type="submit"
                disabled={loadingRecursos || noRecursos}
                className="flex-1 bg-black text-white font-bold hover:bg-gray-800 transition-colors cursor-pointer disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed uppercase tracking-widest text-[11px]"
            >
                {isNew ? "Crear Plano" : "Publicar Cambios"}
            </button>
            <button
                type="button"
                className="flex-1 bg-white text-gray-900 font-bold hover:bg-gray-50 transition-colors cursor-pointer uppercase tracking-widest text-[11px]"
                onClick={onCancel}
            >
                {isNew ? "Cancelar" : "Eliminar"}
            </button>
        </div>
    );
}
