import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Componente } from "../../types/api";

interface ComponenteFormProps {
    componente: Partial<Componente>;
    onUpdate: (componente: Partial<Componente>) => void;
    onDelete: (id?: number) => void;
    isNew?: boolean;
}

export default function ComponenteForm({
    componente,
    onUpdate,
    onDelete,
    isNew = false,
}: ComponenteFormProps) {
    const [componenteData, setComponenteData] = useState<Partial<Componente>>(componente);

    useEffect(() => {
        setComponenteData(componente);
    }, [componente]);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setComponenteData(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    const publishChanges = (e: React.FormEvent) => {
        e.preventDefault();
        if (isNew) {
            const { nombre, desc, rareza } = componenteData;
            onUpdate({ nombre, desc, rareza });
        } else {
            onUpdate(componenteData as Componente);
        }
    };

    return (
        <AnimatePresence mode="popLayout">
            <motion.form
                key={componenteData.id || "new"}
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 100 }}
                transition={{ duration: 0.2, type: "spring", stiffness: 300, damping: 30 }}
                onSubmit={publishChanges}
                className="border-b border-l border-gray-300 flex flex-col w-full max-w-full min-w-0 sticky top-40 z-10 bg-white shadow"
            >
                <label className="border-y border-gray-300 relative isolate overflow-hidden h-20 flex items-center">
                    <span className="text-6xl font-bold absolute right-2 bottom-2 opacity-10 -z-10 select-none">Nombre</span>
                    <input
                        type="text"
                        name="nombre"
                        required
                        className="w-full p-6 h-full isolate bg-transparent text-base focus:outline-none"
                        value={componenteData.nombre || ""}
                        onChange={handleChange}
                        placeholder="Nombre del componente"
                    />
                </label>
                <label className="border-b border-gray-300 relative isolate overflow-hidden h-20 flex items-center">
                    <span className="text-6xl font-bold absolute right-2 bottom-2 opacity-10 -z-10 select-none">Descripción</span>
                    <input
                        type="text"
                        name="desc"
                        required
                        className="w-full p-6 h-full isolate bg-transparent text-base focus:outline-none"
                        value={componenteData.desc || ""}
                        onChange={handleChange}
                        placeholder="Descripción del componente"
                    />
                </label>
                <label className="border-b border-gray-300 relative isolate overflow-hidden h-20 flex items-center">
                    <span className="text-6xl font-bold absolute right-2 bottom-2 opacity-10 -z-10 select-none">Rareza</span>
                    <select
                        name="rareza"
                        required
                        className="w-full p-6 h-full isolate bg-transparent text-base focus:outline-none outline-none appearance-none"
                        value={componenteData.rareza || "comun"}
                        onChange={handleChange}
                    >
                        <option value="comun">Común</option>
                        <option value="raro">Raro</option>
                        <option value="epico">Épico</option>
                        <option value="legendario">Legendario</option>
                    </select>
                </label>
                <div className="grid grid-cols-2 grid-rows-1 h-20">
                    <button type="submit" className="border-r border-gray-300 bg-black text-white hover:bg-gray-800 transition-colors cursor-pointer">{isNew ? "Crear" : "Guardar"}</button>
                    <button type="button" className="hover:bg-gray-50 transition-colors cursor-pointer" onClick={() => onDelete(componenteData.id)}>{isNew ? "Cancelar" : "Eliminar"}</button>
                </div>
            </motion.form>
        </AnimatePresence>
    );
}
