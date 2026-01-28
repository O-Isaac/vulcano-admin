import useSWR, { mutate } from "swr";
import { useState } from "react";
import { toast } from "sonner";
import { fetcher } from "../lib/api";
import { createRecurso as apiCreateRecurso, deleteRecurso as apiDeleteRecurso, updateRecurso as apiUpdateRecurso } from "../services/vulcano.service";
import type { Recurso } from "../types/api";

export function useRecursos() {
    const [selectedRecurso, setSelectedRecurso] = useState<Recurso | null>(null);
    const [adding, setAdding] = useState(false);
    const { data, error, isLoading } = useSWR("recursos", fetcher<Recurso[]>);

    const handleAdd = async (nuevo: Partial<Recurso>) => {
        toast.promise(apiCreateRecurso(nuevo), {
            loading: 'Añadiendo recurso...',
            success: () => {
                mutate("recursos");
                return 'Recurso añadido correctamente.'
            },
            error: 'Error al añadir el recurso.',
        });

        setAdding(false);
        setSelectedRecurso(null);
    };

    const handleUpdate = async (updated: Partial<Recurso>) => {
        setSelectedRecurso(updated as Recurso);

        toast.promise(apiUpdateRecurso(updated as Recurso), {
            loading: 'Actualizando recurso...',
            success: () => {
                mutate("recursos");
                return 'Recurso actualizado correctamente.'
            },
            error: 'Error al actualizar el recurso.',
        });
    };

    const handleDelete = async (id?: number) => {
        if (!id) return;

        toast.promise(apiDeleteRecurso(id), {
            loading: 'Eliminando recurso...',
            success: () => {
                mutate("recursos");
                return 'Recurso eliminado correctamente.'
            },
            error: 'Error al eliminar el recurso.',
        });

        setSelectedRecurso(null);
        setAdding(false);
    };

    const selectRecurso = (recurso: Recurso | null) => {
        setSelectedRecurso(recurso);
        setAdding(false);
    };

    const startAdding = () => {
        setAdding(true);
        setSelectedRecurso(null);
    };

    const cancelAdding = () => {
        setAdding(false);
    };

    return {
        recursos: data,
        error,
        isLoading,
        selectedRecurso,
        adding,
        handleAdd,
        handleUpdate,
        handleDelete,
        selectRecurso,
        startAdding,
        cancelAdding
    };
}
