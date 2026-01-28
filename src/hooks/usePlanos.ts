import useSWR, { mutate } from "swr";
import { useState } from "react";
import { toast } from "sonner";
import { fetcher } from "../lib/api";
import { createPlano as apiCreatePlano, deletePlano as apiDeletePlano, updatePlano as apiUpdatePlano } from "../services/vulcano.service";
import type { Plano } from "../types/api";

export function usePlanos() {
    const [selectedPlano, setSelectedPlano] = useState<Plano | null>(null);
    const [adding, setAdding] = useState(false);
    const { data, error, isLoading } = useSWR("planos", fetcher<Plano[]>);

    const handleAdd = async (nuevo: Partial<Plano>) => {
        toast.promise(apiCreatePlano(nuevo), {
            loading: 'Añadiendo plano...',
            success: () => {
                mutate("planos");
                return 'Plano añadido correctamente.'
            },
            error: (err) => err.message || 'Error al añadir el plano.',
        });

        setAdding(false);
        setSelectedPlano(null);
    };

    const handleUpdate = async (updated: Partial<Plano>) => {
        setSelectedPlano(updated as Plano);

        toast.promise(apiUpdatePlano(updated as Plano), {
            loading: 'Actualizando plano...',
            success: () => {
                mutate("planos");
                return 'Plano actualizado correctamente.'
            },
            error: (err) => err.message || 'Error al actualizar el plano.',
        });
    };

    const handleDelete = async (id?: number) => {
        if (!id) return;

        toast.promise(apiDeletePlano(id), {
            loading: 'Eliminando plano...',
            success: () => {
                mutate("planos");
                return 'Plano eliminado correctamente.'
            },
            error: (err) => err.message || 'Error al eliminar el plano.',
        });

        setSelectedPlano(null);
        setAdding(false);
    };

    const selectPlano = (plano: Plano | null) => {
        setSelectedPlano(plano);
        setAdding(false);
    };

    const startAdding = () => {
        setAdding(true);
        setSelectedPlano(null);
    };

    const cancelAdding = () => {
        setAdding(false);
    };

    return {
        planos: data,
        error,
        isLoading,
        selectedPlano,
        adding,
        handleAdd,
        handleUpdate,
        handleDelete,
        selectPlano,
        startAdding,
        cancelAdding
    };
}
