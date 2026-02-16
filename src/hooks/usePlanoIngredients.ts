import { useState } from 'react';
import useSWR from 'swr';
import { toast } from 'sonner';
import { 
    getPlanoComponentes, 
    addPlanoComponentesBulk, 
    updateComponente, 
    deleteComponente 
} from '../services/vulcano.service';

export function usePlanoIngredients(planoId?: number) {
    const [isAddingIngredients, setIsAddingIngredients] = useState(false);
    const [selectedIngredients, setSelectedIngredients] = useState<{ recursoId: number, cantidad: number }[]>([]);
    const [editingComponentId, setEditingComponentId] = useState<number | null>(null);
    const [editQuantity, setEditQuantity] = useState<number>(0);

    const { data: componentes, mutate: mutateComp, isLoading: loadingComp } = useSWR(
        planoId ? `planos/${planoId}/componentes` : null,
        () => getPlanoComponentes(planoId!)
    );

    const handleAddBulk = async () => {
        if (!planoId || selectedIngredients.length === 0) return;

        toast.promise(addPlanoComponentesBulk(planoId, selectedIngredients), {
            loading: 'Añadiendo ingredientes...',
            success: () => {
                mutateComp();
                setIsAddingIngredients(false);
                setSelectedIngredients([]);
                return 'Ingredientes añadidos.';
            },
            error: 'Error al añadir ingredientes.'
        });
    };

    const handleUpdateQty = async (id: number, recursoId: number) => {
        toast.promise(updateComponente(id, { cantidad: editQuantity, recursoId }), {
            loading: 'Actualizando cantidad...',
            success: () => {
                mutateComp();
                setEditingComponentId(null);
                return 'Cantidad actualizada.';
            },
            error: 'Error al actualizar.'
        });
    };

    const handleDeleteComp = async (id: number) => {
        toast.promise(deleteComponente(id), {
            loading: 'Eliminando ingrediente...',
            success: () => {
                mutateComp();
                return 'Ingrediente eliminado.';
            },
            error: 'Error al eliminar.'
        });
    };

    const toggleIngredientSelection = (recursoId: number) => {
        setSelectedIngredients(prev => {
            const exists = prev.find(i => i.recursoId === recursoId);
            if (exists) {
                return prev.filter(i => i.recursoId !== recursoId);
            } else {
                return [...prev, { recursoId, cantidad: 1 }];
            }
        });
    };

    const updateSelectedQty = (recursoId: number, qty: number) => {
        setSelectedIngredients(prev => prev.map(i =>
            i.recursoId === recursoId ? { ...i, cantidad: Math.max(1, qty) } : i
        ));
    };

    return {
        isAddingIngredients,
        setIsAddingIngredients,
        selectedIngredients,
        setSelectedIngredients,
        editingComponentId,
        setEditingComponentId,
        editQuantity,
        setEditQuantity,
        componentes,
        loadingComp,
        handleAddBulk,
        handleUpdateQty,
        handleDeleteComp,
        toggleIngredientSelection,
        updateSelectedQty
    };
}
