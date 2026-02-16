import useSWR from "swr";
import { toast } from "sonner";
import { fetcher } from "../../lib/api";
import { usePlanoForm } from "../../hooks/usePlanoForm";
import { usePlanoIngredients } from "../../hooks/usePlanoIngredients";
import type { Plano, Recurso } from "../../types/api";

// Sub-components
import { PlanoHeader } from "./form/PlanoHeader";
import { PlanoBasicInputs } from "./form/PlanoBasicInputs";
import { PlanoTimeSelector } from "./form/PlanoTimeSelector";
import { PlanoIngredientsSection } from "./form/PlanoIngredientsSection";
import { PlanoDescription, PlanoFormFooter } from "./form/PlanoDescriptionAndFooter";

interface PlanoFormProps {
    plano: Partial<Plano>;
    onUpdate: (plano: Partial<Plano>) => void;
    onDelete: (id?: number) => void;
    isNew?: boolean;
}

export default function PlanoForm({
    plano,
    onUpdate,
    onDelete,
    isNew = false,
}: PlanoFormProps) {
    const { 
        planoData, 
        timeState: { hours, minutes, seconds }, 
        timeSetters: { setHours, setMinutes, setSeconds },
        handleInputChange,
        getConstructionTime
    } = usePlanoForm(plano);


    const {
        isAddingIngredients, setIsAddingIngredients,
        selectedIngredients,
        editingComponentId, setEditingComponentId,
        editQuantity, setEditQuantity,
        componentes, loadingComp,
        handleAddBulk,
        handleUpdateQty,
        handleDeleteComp,
        toggleIngredientSelection,
        updateSelectedQty
    } = usePlanoIngredients(planoData.id);

    const { data: recursos, isLoading: loadingRecursos } = useSWR("recursos", fetcher<Recurso[]>);

    const publishChanges = (e: React.FormEvent) => {
        e.preventDefault();

        if (!planoData.recursoFabricadoId && !planoData.recursoFabricado?.id) {
             toast.error("Debes seleccionar un recurso fabricado");
             return;
        }

        const tiempoMs = getConstructionTime();
        const finalData = { ...planoData, tiempoConstrucion: tiempoMs };
        onUpdate(finalData);
    };

    return (
        <form
            onSubmit={publishChanges}
            className="flex flex-col h-full bg-white relative"
        >
            {/* Drawer Handle */}
            <div className="mx-auto w-12 h-1.5 shrink-0 rounded-full bg-gray-200 mt-4 mb-2" />

            <PlanoHeader isNew={isNew} onDelete={() => onDelete(planoData.id)} />

            {/* Main Fields - Scrollable Area */}
            <div className="flex-1 overflow-y-auto min-h-0 flex flex-col custom-scrollbar pb-32">
                <PlanoBasicInputs 
                    planoData={planoData}
                    onChange={handleInputChange}
                    recursos={recursos}
                    loadingRecursos={loadingRecursos}
                />

                <PlanoTimeSelector 
                    hours={hours}
                    minutes={minutes}
                    seconds={seconds}
                    setHours={setHours}
                    setMinutes={setMinutes}
                    setSeconds={setSeconds}
                />

                <PlanoIngredientsSection 
                    isNew={isNew}
                    recursos={recursos}
                    recursoFabricadoId={planoData.recursoFabricadoId || planoData.recursoFabricado?.id}
                    isAdding={isAddingIngredients}
                    setIsAdding={setIsAddingIngredients}
                    selectedIngredients={selectedIngredients}
                    toggleSelection={toggleIngredientSelection}
                    updateSelectionQty={updateSelectedQty}
                    onAddBulk={handleAddBulk}
                    loadingComp={loadingComp}
                    componentes={componentes}
                    editingId={editingComponentId}
                    setEditingId={setEditingComponentId}
                    editQty={editQuantity}
                    setEditQty={setEditQuantity}
                    onUpdateQty={handleUpdateQty}
                    onDeleteComp={handleDeleteComp}
                />

                <PlanoDescription 
                    value={planoData.desc || ""}
                    onChange={handleInputChange}
                />
            </div>

            <PlanoFormFooter 
                isNew={isNew}
                loadingRecursos={loadingRecursos}
                noRecursos={!recursos || recursos.length === 0}
                onCancel={() => onDelete(planoData.id)}
            />

            <style>{`
                .vertical-text {
                    writing-mode: vertical-rl;
                    transform: rotate(180deg);
                }
            `}</style>
        </form>
    );
}