import type { Componente } from "../../types/api";

interface ComponenteListProps {
    componentes: Componente[];
    onSelect: (componente: Componente) => void;
}

export default function ComponenteList({ componentes, onSelect }: ComponenteListProps) {
    return (
        <ul className="p-0">
            {componentes.map((c) => (
                <li
                    onClick={() => onSelect(c)}
                    key={c.id}
                    className="p-4 border-r border-gray-300 hover:bg-gray-200 border-b cursor-pointer relative overflow-hidden group"
                >
                    <div className="flex justify-between items-center mr-16">
                        <div>
                            <h3 className="text-lg font-semibold">{c.nombre}</h3>
                            <p className="text-gray-600 text-xs">{c.desc}</p>
                        </div>
                    </div>
                    <p className="text-gray-400 text-3xl font-semibold capitalize absolute right-4 bottom-4 opacity-20 group-hover:opacity-40 transition-opacity">
                        {c.rareza}
                    </p>
                </li>
            ))}
        </ul>
    );
}
