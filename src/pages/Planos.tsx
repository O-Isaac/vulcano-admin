import PlanoForm from "../components/planos/PlanoForm";
import PlanoList from "../components/planos/PlanoList";
import PlanoHero from "../components/planos/PlanoHero";
import PlanoSidebar from "../components/planos/PlanoSidebar";
import { usePlanos } from "../hooks/usePlanos";
import { FileText } from "lucide-react";

import { Drawer } from "vaul";

export default function PlanosPage() {
    const {
        planos,
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
    } = usePlanos();

    // Determine if drawer should be open
    const isDrawerOpen = !!selectedPlano || adding;

    if (isLoading) {
        return <div className="p-6 text-gray-400 font-medium font-inter">Cargando planos...</div>;
    }

    if (error) {
        console.error(error);
        return <div className="p-6 text-red-500 font-medium font-inter">Error al cargar los planos.</div>;
    }

    return (
        <Drawer.Root
            open={isDrawerOpen}
            onOpenChange={(open) => {
                if (!open) {
                    if (adding) cancelAdding();
                    else selectPlano(null);
                }
            }}
            direction="right"
        >
            <PlanoHero
                title="Planos"
                subtitle="Gestión de planos y esquemas"
            />

            <section className="flex flex-col lg:flex-row border-b border-gray-300 min-h-[80vh] divide-y lg:divide-y-0 lg:divide-x divide-gray-300 bg-white">
                <div className="lg:w-[320px] shrink-0 bg-gray-50/30">
                    <PlanoSidebar
                        title="Listado"
                        onAdd={startAdding}
                    />
                </div>

                <div className="flex-1 min-w-0 bg-white overflow-hidden">
                    {planos && planos.length > 0 ? (
                        <PlanoList planos={planos} onSelect={selectPlano} />
                    ) : (
                        <div className="p-20 text-center flex flex-col items-center gap-4">
                            <div className="size-16 rounded-full bg-gray-50 flex items-center justify-center text-gray-300">
                                <FileText className="size-8" />
                            </div>
                            <p className="text-gray-400 font-medium italic">No hay planos registrados.</p>
                        </div>
                    )}
                </div>
            </section>

            <Drawer.Portal>
                <Drawer.Overlay className="fixed inset-0 bg-black/40 z-50 backdrop-blur-[2px]" />
                <Drawer.Content className="bg-white flex flex-col rounded-t-[10px] lg:rounded-t-0 lg:rounded-l-[20px] h-full mt-24 fixed bottom-0 right-0 z-50 w-full lg:w-[550px] outline-none shadow-2xl overflow-hidden border-l border-gray-200">
                    <div className="flex-1 h-full">
                        {adding ? (
                            <PlanoForm
                                plano={{
                                    nombre: "",
                                    coste: 0,
                                    tiempoConstrucion: 0,
                                    desc: "",
                                    recursoFabricado: {
                                        desc: "",
                                        id: 0,
                                        nombre: "",
                                        rareza: ""
                                    }
                                }}
                                onUpdate={handleAdd}
                                onDelete={cancelAdding}
                                isNew
                            />
                        ) : selectedPlano ? (
                            <PlanoForm
                                plano={selectedPlano}
                                onUpdate={handleUpdate}
                                onDelete={handleDelete}
                            />
                        ) : null}
                    </div>
                </Drawer.Content>
            </Drawer.Portal>
        </Drawer.Root>
    );
}
