import type { Recurso } from "../types/api";

interface RecursoListProps {
  recursos: Recurso[];
  onSelect: (recurso: Recurso) => void;
}

export default function RecursoList({ recursos, onSelect }: RecursoListProps) {
  return (
    <ul className="p-0">
      {recursos.map((recurso) => (
        <li
          onClick={() => onSelect(recurso)}
          key={recurso.id}
          className="p-4 border-r border-gray-300 hover:bg-gray-200 border-b cursor-pointer"
        >
          <h3 className="text-lg font-semibold">{recurso.nombre}</h3>
          <p className="text-gray-600 text-xs">{recurso.desc}</p>
        </li>
      ))}
    </ul>
  );
}
