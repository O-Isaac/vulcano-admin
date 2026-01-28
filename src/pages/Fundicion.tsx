import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import fundicionImage from "../assets/fundicion.webp";

export default function FundicionPage() {
    const [isActive, setIsActive] = useState(false);

    return (
        <main className="relative w-full h-[70vh] md:h-[80vh] overflow-hidden bg-white/20">
            {/* Imagen de fondo */}
            <motion.img
                src={fundicionImage}
                alt="Fundicion"
                initial={{ opacity: 0.3 }}
                animate={{
                    opacity: isActive ? 0.7 : 0.3,
                    scale: isActive ? 1.05 : 1,
                    filter: isActive ? "brightness(1.1) saturate(1.3)" : "brightness(1) saturate(0.8)"
                }}
                transition={{ duration: 0.5 }}
                className="absolute inset-0 w-full h-full object-cover"
            />

            <section className="relative z-10 h-full w-full flex items-center justify-center p-6">

                <div className="relative flex items-center justify-center w-full max-w-xs md:max-w-md">

                    {/* ESFERA GUÍA REESTRUCTURADA */}
                    <AnimatePresence>
                        {!isActive && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 1.5 }}
                                // Este contenedor asegura que todo esté centrado
                                className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none"
                            >
                                <div className="relative flex items-center justify-center">
                                    {/* Brillo difuso naranja */}
                                    <div className="absolute w-16 h-16 md:w-20 md:h-20 bg-orange-500/30 rounded-full blur-2xl animate-pulse" />

                                    {/* Onda de radar naranja (Ahora perfectamente centrada) */}
                                    <div className="absolute w-12 h-12 md:w-16 md:h-16 border-2 border-orange-500/50 rounded-full animate-ping" />

                                    {/* Núcleo ámbar */}
                                    <motion.div
                                        animate={{
                                            boxShadow: ["0px 0px 15px #f97316", "0px 0px 25px #ea580c", "0px 0px 15px #f97316"],
                                            scale: [1, 1.1, 1]
                                        }}
                                        transition={{ repeat: Infinity, duration: 2 }}
                                        className="relative w-4 h-4 md:w-5 md:h-5 bg-orange-600 rounded-full shadow-[0_0_20px_rgba(234,88,12,0.6)]"
                                    />
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* BOTÓN "ACTIVATE" */}
                    <motion.button
                        onMouseEnter={() => setIsActive(true)}
                        onMouseLeave={() => setIsActive(false)}
                        onTouchStart={() => setIsActive(true)}
                        onTouchEnd={() => setIsActive(false)}

                        initial={false}
                        animate={{
                            opacity: isActive ? 1 : 0,
                            scale: isActive ? 1 : 0.85
                        }}
                        transition={{ duration: 0.3 }}
                        className={`
                            relative z-20 w-full 
                            px-6 py-4 md:px-12 md:py-5
                            bg-white/90 backdrop-blur-xl
                            border-2 border-orange-500/40 rounded-sm
                            flex items-center justify-center
                            shadow-2xl
                            ${isActive ? "cursor-pointer" : "cursor-default"}
                        `}
                    >
                        <span className="text-orange-700 font-black tracking-[0.3em] md:tracking-[0.4em] text-lg md:text-xl">
                            ACTIVATE
                        </span>

                        <Corners isActive={isActive} />
                    </motion.button>

                </div>
            </section>
        </main>
    );
}

function Corners({ isActive }: { isActive: boolean }) {
    const cornerSize = isActive ? "w-3 h-3 md:w-4 md:h-4" : "w-2 h-2";
    const cornerColor = isActive ? "border-orange-600" : "border-orange-400";
    const cornerStyle = `absolute transition-all duration-500 ${cornerSize} ${cornerColor}`;

    return (
        <>
            <div className={`${cornerStyle} -top-1.5 -left-1.5 border-t-2 border-l-2`} />
            <div className={`${cornerStyle} -top-1.5 -right-1.5 border-t-2 border-r-2`} />
            <div className={`${cornerStyle} -bottom-1.5 -left-1.5 border-b-2 border-l-2`} />
            <div className={`${cornerStyle} -bottom-1.5 -right-1.5 border-b-2 border-r-2`} />
        </>
    );
}