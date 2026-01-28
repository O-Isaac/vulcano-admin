import { useEffect, useState } from "react";
import type { Recurso } from "../../types/api";
import { FileText, Package, Star, X } from "lucide-react";

interface RecursoFormProps {
  recurso: Partial<Recurso>;
  onUpdate: (recurso: Partial<Recurso>) => void;
  onDelete: (id: number) => void;
  onClose: () => void;
  isNew?: boolean;
}

export default function RecursoForm({
  recurso,
  onUpdate,
  onDelete,
  onClose,
  isNew = false,
}: RecursoFormProps) {
  const [recursoData, setRecursoData] = useState<Partial<Recurso>>(recurso);

  useEffect(() => {
    setRecursoData(recurso);
  }, [recurso]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setRecursoData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const publishChanges = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate(recursoData);
  };

  const getRarityColor = (rarity?: string) => {
    switch (rarity?.toLowerCase()) {
      case 'comun': return 'text-gray-400';
      case 'raro': return 'text-blue-500';
      case 'epico': return 'text-purple-500';
      case 'legendario': return 'text-orange-500';
      default: return 'text-gray-400';
    }
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
          <Package className="size-5 text-blue-500" />
          {isNew ? "Crear Nuevo Recurso" : "Editar Recurso"}
        </h2>
        <button
          type="button"
          onClick={onClose}
          className="p-2 hover:bg-gray-100 rounded-full text-gray-400 hover:text-red-500 transition-colors"
        >
          <X className="size-5" />
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
            value={recursoData.nombre || ""}
            onChange={handleChange}
            placeholder="Ej: Oro, Ferrita, Oxium..."
          />
        </label>

        <label className="border-b border-gray-100 relative group flex items-center h-20">
          <div className="w-16 flex justify-center text-gray-400 group-focus-within:text-yellow-500 transition-colors">
            <Star className={`size-5 ${getRarityColor(recursoData.rareza)}`} />
          </div>
          <div className="flex-1 flex flex-col justify-center px-6">
            <span className="text-[10px] font-bold text-gray-400 uppercase mb-1">Rareza</span>
            <select
              name="rareza"
              required
              className="w-full bg-transparent text-lg font-medium focus:outline-none appearance-none cursor-pointer"
              value={recursoData.rareza?.toLowerCase() || "comun"}
              onChange={handleChange}
            >
              <option value="comun">Común</option>
              <option value="raro">Raro</option>
              <option value="epico">Épico</option>
              <option value="legendario">Legendario</option>
            </select>
          </div>
          <div className="absolute right-6 pointer-events-none text-gray-300 text-xs">▼</div>
        </label>

        <label className="border-b border-gray-100 relative group flex flex-col p-6 min-h-32 bg-gray-50/20">
          <div className="flex items-center gap-2 mb-2">
            <FileText className="size-4 text-gray-400" />
            <span className="text-xs font-bold text-gray-400 uppercase">Descripción</span>
          </div>
          <textarea
            name="desc"
            required
            className="flex-1 bg-transparent text-base focus:outline-none resize-none placeholder:text-gray-300 leading-relaxed"
            value={recursoData.desc || ""}
            onChange={handleChange}
            placeholder="Describe las propiedades y usos de este recurso..."
          />
        </label>
      </div>

      {/* Footer Actions */}
      <div className="absolute bottom-0 left-0 right-0 flex h-20 divide-x divide-gray-100 bg-white/80 backdrop-blur-xl border-t border-gray-100 z-50">
        <button
          type="submit"
          className="flex-1 bg-black text-white font-bold hover:bg-gray-800 transition-colors cursor-pointer uppercase tracking-widest text-[11px]"
        >
          {isNew ? "Crear Recurso" : "Publicar Cambios"}
        </button>
        {isNew ? (
          <button
            type="button"
            className="flex-1 bg-white text-gray-900 font-bold hover:bg-gray-50 transition-colors cursor-pointer uppercase tracking-widest text-[11px]"
            onClick={onClose}
          >
            Cancelar
          </button>
        ) : (
          <button
            type="button"
            className="flex-1 bg-red-50 text-red-600 font-bold hover:bg-red-100 transition-colors cursor-pointer uppercase tracking-widest text-[11px]"
            onClick={() => recursoData.id && onDelete(recursoData.id)}
          >
            Eliminar
          </button>
        )}
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
