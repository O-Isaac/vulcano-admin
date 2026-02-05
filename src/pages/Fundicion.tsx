import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Drawer } from "vaul";
import useSWR from "swr";
import { toast } from "sonner";
import fundicionImage from "../assets/fundicion.webp";
import { fetcher } from "../lib/api";
import type { Plano, Queue } from "../types/api";
import { queuePlano, getActiveQueues } from "../services/vulcano.service";
import { useAuthStore } from "../store/useAuthStore";

export default function FundicionPage() {
    const [isActive, setIsActive] = useState(false);
    const [isLaunching, setIsLaunching] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const refreshUser = useAuthStore((state) => state.refreshUser);

    // Sincronización con el backend
    const { data: activeQueues, mutate, isLoading: isLoadingQueues } = useSWR("api/queues/active", getActiveQueues);
    const { data: planos } = useSWR("planos", fetcher<Plano[]>);

    const handleActivateSequence = () => {
        setIsLaunching(true);
        setTimeout(() => {
            setIsOpen(true);
            setIsLaunching(false);
        }, 600);
    };

    const handleSelectPlano = async (plano: Plano) => {
        toast.promise(queuePlano(plano.id), {
            loading: "Iniciando forja...",
            success: () => {
                mutate(); // Refresca la lista para mostrar el nuevo contador
                refreshUser(); // Updates credits
                setIsOpen(false);
                return `Forja iniciada: ${plano.nombre}`;
            },
            error: "Error al iniciar la forja"
        });
    };

    return (
        <Drawer.Root open={isOpen} onOpenChange={setIsOpen} shouldScaleBackground>

            <main className="relative w-full h-[70vh] md:h-[80vh] overflow-hidden bg-white font-sans">
                {/* Fondo reactivo */}
                <motion.img
                    src={fundicionImage}
                    alt="Fundicion"
                    animate={{
                        opacity: isLaunching || (activeQueues && activeQueues.length > 0) ? 0.9 : (isActive ? 0.6 : 0.3),
                        scale: isLaunching ? 1.05 : 1,
                    }}
                    transition={{ duration: 0.8 }}
                    className="absolute inset-0 w-full h-full object-cover"
                />

                <section className="relative z-10 h-full w-full flex items-center justify-center p-6">
                    <AnimatePresence mode="wait">
                        {activeQueues && activeQueues.length > 0 ? (
                            <motion.div
                                key="list"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl"
                            >
                                {activeQueues.map((q) => (
                                    <CountdownDisplay key={q.id} queue={q} onFinished={() => mutate()} />
                                ))}

                                {/* Botón para añadir más construcciones (Estilo limpio) */}
                                <button
                                    onClick={() => setIsOpen(true)}
                                    className="h-[140px] border-2 border-dashed border-zinc-200 rounded-3xl flex flex-col items-center justify-center text-zinc-400 hover:border-orange-500 hover:text-orange-500 hover:bg-orange-50/50 transition-all bg-white/80 backdrop-blur-sm"
                                >
                                    <span className="text-2xl font-light">+</span>
                                    <span className="text-[10px] font-bold uppercase tracking-wider mt-1">Nuevo Plano</span>
                                </button>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="trigger"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 1.05, filter: "blur(8px)" }}
                                className="relative flex items-center justify-center w-full max-w-xs"
                            >
                                {/* Esfera Guía Minimalista */}
                                {!isActive && !isLaunching && (
                                    <div className="absolute flex items-center justify-center">
                                        <div className="absolute w-20 h-20 bg-orange-500/10 rounded-full blur-xl animate-pulse" />
                                        <div className="w-3 h-3 bg-orange-500 rounded-full shadow-[0_0_10px_#ea580c]" />
                                    </div>
                                )}

                                <motion.button
                                    onMouseEnter={() => !isLaunching && setIsActive(true)}
                                    onMouseLeave={() => !isLaunching && setIsActive(false)}
                                    onClick={handleActivateSequence}
                                    animate={{
                                        opacity: isLaunching ? 0 : (isActive ? 1 : 0),
                                        scale: isLaunching ? 1.2 : (isActive ? 1 : 0.9)
                                    }}
                                    className="relative z-20 w-full px-10 py-5 bg-white border border-zinc-100 rounded-lg shadow-xl"
                                >
                                    <span className="text-zinc-900 font-black tracking-[0.3em] text-lg uppercase">
                                        Activar
                                    </span>
                                    <Corners isActive={isActive} />
                                </motion.button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </section>

                {/* Drawer (Selección de Planos - Estilo Blanco Limpio) */}
                <Drawer.Portal>
                    <Drawer.Overlay className="fixed inset-0 bg-zinc-900/20 backdrop-blur-sm z-[60]" />
                    <Drawer.Content className="bg-white flex flex-col rounded-t-[32px] max-h-[92%] fixed bottom-0 left-0 right-0 z-[70] outline-none shadow-2xl">
                        <div className="p-8 flex-1 overflow-y-auto">
                            <div className="mx-auto w-12 h-1 rounded-full bg-zinc-200 mb-8" />
                            <div className="max-w-2xl mx-auto">
                                <header className="mb-8">
                                    <Drawer.Title className="font-black text-3xl text-zinc-900 tracking-tight uppercase">Planos de Forja</Drawer.Title>
                                    <p className="text-zinc-500 text-sm">Selecciona una estructura para comenzar la síntesis.</p>
                                </header>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-10">
                                    {planos?.map((plano) => (
                                        <div
                                            key={plano.id}
                                            onClick={() => handleSelectPlano(plano)}
                                            className="p-5 rounded-2xl border border-zinc-100 bg-zinc-50/50 hover:bg-white hover:border-orange-500 hover:shadow-md transition-all cursor-pointer group"
                                        >
                                            <div className="flex justify-between items-start mb-1">
                                                <h3 className="font-bold text-zinc-900 group-hover:text-orange-600 transition-colors uppercase text-sm tracking-tight">{plano.nombre}</h3>
                                                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-zinc-900 text-white uppercase">
                                                    {plano.recursoFabricado?.rareza}
                                                </span>
                                            </div>
                                            <div className="flex gap-4 mt-4 pt-3 border-t border-zinc-100 font-mono text-[10px]">
                                                <span className="text-zinc-400 uppercase">Costo: <b className="text-zinc-900">{plano.coste} UE</b></span>
                                                <span className="text-zinc-400 uppercase">Tiempo: <b className="text-zinc-900">{Math.floor(plano.tiempoConstrucion / 1000)}s</b></span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </Drawer.Content>
                </Drawer.Portal>
            </main>
        </Drawer.Root>
    );
}

// --- COMPONENTES AUXILIARES ---

function CountdownDisplay({ queue, onFinished }: { queue: Queue, onFinished: () => void }) {
    const [timeLeft, setTimeLeft] = useState("");
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const calculate = () => {
            const final = new Date(queue.finalTime).getTime();
            const inicio = new Date(queue.inicioTime).getTime();
            const now = Date.now();

            const total = final - inicio;
            const remaining = final - now;

            if (remaining <= 0) {
                onFinished();
                return;
            }

            setProgress(Math.min(((now - inicio) / total) * 100, 100));

            const m = Math.floor(remaining / 60000);
            const s = Math.floor((remaining % 60000) / 1000);
            setTimeLeft(`${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`);
        };

        const timer = setInterval(calculate, 1000);
        calculate();
        return () => clearInterval(timer);
    }, [queue, onFinished]);

    return (
        <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="p-6 rounded-3xl bg-white shadow-xl border border-zinc-100 flex flex-col relative overflow-hidden">
            <div className="flex justify-between items-end mb-4">
                <div className="flex flex-col">
                    <span className="text-[9px] font-black tracking-widest text-orange-500 uppercase">Sintetizando</span>
                    <span className="font-bold text-zinc-900 uppercase tracking-tight">{queue.plano.nombre}</span>
                </div>
                <span className="text-4xl font-mono font-bold text-zinc-900 tracking-tighter">{timeLeft}</span>
            </div>

            <div className="w-full h-1.5 bg-zinc-100 rounded-full overflow-hidden">
                <motion.div
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 1, ease: "linear" }}
                    className="h-full bg-orange-500"
                />
            </div>
        </motion.div>
    );
}

function Corners({ isActive }: { isActive: boolean }) {
    const style = `absolute transition-all duration-500 pointer-events-none ${isActive ? "w-6 h-6 border-orange-500" : "w-2 h-2 border-zinc-300"}`;
    return (
        <>
            <div className={`${style} -top-1 -left-1 border-t border-l`} />
            <div className={`${style} -top-1 -right-1 border-t border-r`} />
            <div className={`${style} -bottom-1 -left-1 border-b border-l`} />
            <div className={`${style} -bottom-1 -right-1 border-b border-r`} />
        </>
    );
}