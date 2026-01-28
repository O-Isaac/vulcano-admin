import ComponenteForm from "../components/componentes/ComponenteForm";
import ComponenteList from "../components/componentes/ComponenteList";
import ComponenteHero from "../components/componentes/ComponenteHero";
import ComponenteSidebar from "../components/componentes/ComponenteSidebar";
import { useComponentes } from "../hooks/useComponentes";

export default function ComponentesPage() {
    const {
        componentes,
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
    } = useComponentes();

    if (isLoading) {
        return <div className="p-6 text-gray-400 font-medium">Cargando componentes...</div>;
    }

    if (error) {
        console.error(error);
        return <div className="p-6 text-red-500 font-medium">Error al cargar los componentes.</div>;
    }

    return (
        <>
            <ComponenteHero
                title="Componentes"
                subtitle="Administra los componentes base para los planos"
            />

            <section className="grid-cols-3 grid-rows-1 md:grid border-b border-gray-300 min-h-[80vh]">
                <ComponenteSidebar
                    title="Lista de Componentes"
                    onAdd={startAdding}
                />

                <div className="w-full">
                    {componentes && componentes.length > 0 ? (
                        <ComponenteList componentes={componentes} onSelect={selectComponente} />
                    ) : (
                        <p className="p-6 text-gray-500 font-medium">No hay componentes disponibles.</p>
                    )}
                </div>

                <div className="relative">
                    {adding ? (
                        <div className="h-full">
                            <ComponenteForm
                                componente={{ nombre: "", desc: "", rareza: "comun" }}
                                onUpdate={handleAdd}
                                onDelete={cancelAdding}
                                isNew
                            />
                        </div>
                    ) : selectedComponente ? (
                        <div className="h-full">
                            <ComponenteForm
                                componente={selectedComponente}
                                onUpdate={handleUpdate}
                                onDelete={handleDelete}
                            />
                        </div>
                    ) : (
                        <p className="p-6.5 text-gray-500 sticky top-40 border-b border-gray-300 font-medium">Selecciona un componente para ver los detalles.</p>
                    )}
                </div>
            </section>
        </>
    );
}
