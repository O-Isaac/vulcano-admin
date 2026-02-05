import useSWR, { mutate } from "swr";
import { useState } from "react";
import { toast } from "sonner";
import { fetcher } from "../lib/api";
import { createComponente as apiCreateComponente, deleteComponente as apiDeleteComponente, updateComponente as apiUpdateComponente } from "../services/vulcano.service";
import type { Componente } from "../types/api";

export function useComponentes() {
    const [selectedComponente, setSelectedComponente] = useState<Componente | null>(null);
    const [adding, setAdding] = useState(false);
    const { data, error, isLoading } = useSWR("componentes", fetcher<Componente[]>);

    const handleAdd = async (nuevo: Partial<Componente>) => {
        toast.promise(apiCreateComponente(nuevo), {
            loading: 'Añadiendo componente...',
            success: () => {
                mutate("componentes");
                return 'Componente añadido correctamente.'
            },
            error: (err) => err.message || 'Error al añadir el componente.',
        });

        setAdding(false);
        setSelectedComponente(null);
    };

    const handleUpdate = async (updated: Partial<Componente>) => {
        setSelectedComponente(updated as Componente);

        if (!updated.id) return;
        toast.promise(apiUpdateComponente(updated.id, { cantidad: updated.cantidad || 0, recursoId: updated.recursoId }), {
            loading: 'Actualizando componente...',
            success: () => {
                mutate("componentes");
                return 'Componente actualizado correctamente.'
            },
            error: (err) => err.message || 'Error al actualizar el componente.',
        });
    };

    const handleDelete = async (id?: number) => {
        if (!id) return;

        toast.promise(apiDeleteComponente(id), {
            loading: 'Eliminando componente...',
            success: () => {
                mutate("componentes");
                return 'Componente eliminado correctamente.'
            },
            error: (err) => err.message || 'Error al eliminar el componente.',
        });

        setSelectedComponente(null);
        setAdding(false);
    };

    const selectComponente = (componente: Componente | null) => {
        setSelectedComponente(componente);
        setAdding(false);
    };

    const startAdding = () => {
        setAdding(true);
        setSelectedComponente(null);
    };

    const cancelAdding = () => {
        setAdding(false);
    };

    return {
        componentes: data,
        error,
        isLoading,
        selectedComponente,
        adding,
        handleAdd,
        handleUpdate,
        handleDelete,
        selectComponente,
        startAdding,
        cancelAdding
    };
}
