import type { Recurso } from "../../types/api";
import { Package } from "lucide-react";

interface RecursoListProps {
  recursos: Recurso[];
  onSelect: (recurso: Recurso) => void;
}

export default function RecursoList({ recursos, onSelect }: RecursoListProps) {
  const getRarityStyles = (rarity: string) => {
    switch (rarity.toLowerCase()) {
      case 'comun': return 'text-gray-400 opacity-20 group-hover:opacity-40';
      case 'raro': return 'text-blue-500 opacity-20 group-hover:opacity-40';
      case 'epico': return 'text-purple-500 opacity-20 group-hover:opacity-40';
      case 'legendario': return 'text-orange-500 opacity-20 group-hover:opacity-40';
      default: return 'text-gray-400 opacity-20 group-hover:opacity-40';
    }
  };

  return (
    <ul className="p-0">
      {recursos.map((recurso) => (
        <li
          onClick={() => onSelect(recurso)}
          key={recurso.id}
          className="p-4 border-r border-gray-300 hover:bg-gray-100 border-b cursor-pointer relative overflow-hidden group transition-colors"
        >
          <div className="flex justify-between items-start mr-16 relative z-10">
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <Package className="size-4 text-gray-400" />
                <h3 className="text-lg font-bold text-gray-900 leading-tight">
                  {recurso.nombre}
                </h3>
              </div>
              <p className="text-gray-500 text-xs line-clamp-2 max-w-[200px]">
                {recurso.desc}
              </p>
            </div>
          </div>

          {/* Background Rarity Text */}
          <p className={`text-4xl font-black uppercase absolute right-4 bottom-2 select-none transition-all duration-300 pointer-events-none tracking-tighter ${getRarityStyles(recurso.rareza)}`}>
            {recurso.rareza}
          </p>

          {/* Hover indicator strip */}
          <div className="absolute left-0 top-0 bottom-0 w-0 group-hover:w-1 bg-black transition-all duration-200" />
        </li>
      ))}
    </ul>
  );
}
