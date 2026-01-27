import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Recurso } from "../types/api";

interface RecursoFormProps {
  recurso: Partial<Recurso>;
  onUpdate: (recurso: Partial<Recurso>) => void;
  onDelete: (id?: number) => void;
  isNew?: boolean;
}

export default function RecursoForm({
  recurso,
  onUpdate,
  onDelete,
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
    if (isNew) {
      const { nombre, desc, rareza } = recursoData;
      onUpdate({ nombre, desc, rareza });
    } else {
      onUpdate(recursoData as Recurso);
    }
  };

  return (
    <AnimatePresence mode="wait">
      <motion.form
        key={recursoData.id || "new"}
        initial={{ opacity: 0, x: 80 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 80 }}
        transition={{ duration: 0.35, type: "spring", bounce: 0.2 }}
        onSubmit={publishChanges}
        className="border-b border-gray-300 flex flex-col w-full max-w-full min-w-0 sticky top-40 z-10 bg-white shadow"
      >
        {/* Nombre */}
        <label className="border-y border-gray-300 relative isolate overflow-hidden h-20 flex items-center">
          <span className="text-6xl font-bold absolute right-2 bottom-2 opacity-10 -z-10 select-none">Nombre</span>
          <input
            type="text"
            name="nombre"
            className="w-full p-6 h-full isolate bg-transparent text-base focus:outline-none"
            value={recursoData.nombre || ""}
            onChange={handleChange}
            placeholder="Nombre del recurso"
          />
        </label>
        {/* Descripción */}
        <label className="border-b border-gray-300 relative isolate overflow-hidden h-20 flex items-center">
          <span className="text-6xl font-bold absolute right-2 bottom-2 opacity-10 -z-10 select-none">Descripción</span>
          <input
            type="text"
            name="desc"
            className="w-full p-6 h-full isolate bg-transparent text-base focus:outline-none"
            value={recursoData.desc || ""}
            onChange={handleChange}
            placeholder="Descripción del recurso"
          />
        </label>
        {/* Rareza */}
        <label className="border-b border-gray-300 relative isolate overflow-hidden h-20 flex items-center">
          <span className="text-6xl font-bold absolute right-2 bottom-2 opacity-10 -z-10 select-none">Rareza</span>
          <select
            name="rareza"
            className="w-full p-6 h-full isolate bg-transparent text-base focus:outline-none"
            value={recursoData.rareza || "comun"}
            onChange={handleChange}
          >
            <option value="comun">Común</option>
            <option value="raro">Raro</option>
            <option value="epico">Épico</option>
            <option value="legendario">Legendario</option>
          </select>
        </label>
        <div className="grid grid-cols-2 grid-rows-1 h-20">
          <button type="submit" className="border-r border-gray-300 bg-black text-white">{isNew ? "Crear" : "Guardar"}</button>
          <button type="button" onClick={() => onDelete(recursoData.id)}>{isNew ? "Cancelar" : "Eliminar"}</button>
        </div>
      </motion.form>
    </AnimatePresence>
  );
}
