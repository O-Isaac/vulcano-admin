import useSWR, { mutate } from "swr";
import InteractiveBlob from "../components/InteractiveBlob";
import { apiFetcher, createRecurso, deleteRecurso, updateRecurso } from "../lib/api";
import type { Recurso } from "../types/api";
import { useState } from "react";
import RecursoForm from "../components/RecursoForm";
import RecursoList from "../components/RecursoList";
import { toast } from "sonner";

export default function RecursosPages() {
    const [selectedRecurso, setSelectedRecurso] = useState<Recurso | null>(null);
    const [adding, setAdding] = useState(false);
    const { data, error, isLoading } = useSWR("/api/recursos", apiFetcher)

    if (isLoading) {
        return <div className="p-6">Cargando recursos...</div>;
    }

    if (error) {
        return <div className="p-6 text-red-500">Error al cargar los recursos.</div>;
    }

    const handleRecursoClick = (recurso: Recurso) => () => {
        setSelectedRecurso(recurso);
    }

    const handleAdd = async (nuevo: Partial<Recurso>) => {
        // Validación mínima
        if (!nuevo.nombre || !nuevo.desc || !nuevo.rareza) return;
       
        toast.promise(createRecurso(nuevo), {
            loading: 'Añadiendo recurso...',
            success: 'Recurso añadido correctamente.',
            error: 'Error al añadir el recurso.',
        });

        setAdding(false);
        setSelectedRecurso(null);
        mutate("/api/recursos"); // Refresca la lista tras añadir
    };
    const handleUpdate = async (updated: Partial<Recurso>) => {
        if (!updated.id || !updated.nombre || !updated.desc || !updated.rareza) return;
        setSelectedRecurso(updated as Recurso);

        toast.promise(updateRecurso(updated as Recurso), {
            loading: 'Actualizando recurso...',
            success: 'Recurso actualizado correctamente.',
            error: 'Error al actualizar el recurso.',
        });
    };
    const handleDelete = async (id?: number) => {
        if (!id) return;
        toast.promise(deleteRecurso(id), {
            loading: 'Eliminando recurso...',
            success: 'Recurso eliminado correctamente.',
            error: 'Error al eliminar el recurso.',
        });
        setSelectedRecurso(null);
        setAdding(false);
        mutate("/api/recursos"); // Refresca la lista tras eliminar
    };

    return (
       <>
            <section className="p-6 h-87 border-b border-gray-300 flex flex-col justify-center relative overflow-hidden isolate">
                <InteractiveBlob />
                <h1 className="text-2xl font-medium mb-4">Recursos</h1>
                <p className="text-gray-500">Administra todos los recursos del servicio.</p>
            </section>

            <section className="grid-cols-3 grid-rows-1 md:grid border-b border-gray-300 min-h-[80vh]">
                <aside className="border-r border-gray-300 flex flex-col gap-4">
                    <div className="flex items-center justify-between mb-4 sticky top-20 border-b p-6 border-gray-300">
                        <h2 className="text-xl font-medium">Lista de Recursos</h2>
                        <button
                            className="px-6 py-3 bg-black text-white rounded-full shadow hover:bg-gray-900 transition font-semibold"
                            onClick={() => { setAdding(true); setSelectedRecurso(null); }}
                        >
                            Añadir recurso
                        </button>
                    </div>
                </aside>
                <div className="w-full">
                    {data && data.length > 0 ? (
                        <RecursoList recursos={data} onSelect={setSelectedRecurso} />
                    ) : (
                        <p className="p-6 text-gray-500">No hay recursos disponibles.</p>
                    )}
                </div>
                <div className="relative">
                    {adding ? (
                        <div className="h-full">
                            <RecursoForm
                                recurso={{ nombre: "", desc: "", rareza: "comun" }}
                                onUpdate={nuevo => handleAdd(nuevo)}
                                onDelete={() => setAdding(false)}
                                isNew
                            />
                        </div>
                    ) : selectedRecurso ? (
                        <div className="h-full">
                            <RecursoForm
                                recurso={selectedRecurso}
                                onUpdate={handleUpdate}
                                onDelete={handleDelete}
                            />
                        </div>
                    ) : (
                        <p className="p-6.5 text-gray-500 sticky top-40 border-b border-gray-300">Selecciona un recurso para ver los detalles.</p>
                    )}
                </div>
            </section>
       </>
    )
}