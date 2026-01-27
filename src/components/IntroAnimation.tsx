import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';

interface IntroAnimationProps {
    userName: string;
    onComplete: () => void;
}

export default function IntroAnimation({ userName, onComplete }: IntroAnimationProps) {
    const [step, setStep] = useState(0);

    useEffect(() => {
        // Super fast timeline:
        // 0s: Start VULCANO entrance
        // 0.4s: Show Bienvenido 
        // 2s: Start exit transition
        // 2.6s: Complete
        const timers = [
            setTimeout(() => setStep(1), 400),
            setTimeout(() => setStep(2), 2000),
            setTimeout(() => onComplete(), 2600)
        ];

        return () => timers.forEach(clearTimeout);
    }, [onComplete]);


    return (
        <motion.div
            initial={{ opacity: 1, scale: 1 }}
            exit={{
                opacity: 0,
                scale: 1.05,
                filter: "blur(20px)",
                transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] }
            }}
            className="fixed inset-0 z-9999 bg-white flex flex-col items-center justify-center overflow-hidden"
        >
            <div className="relative flex flex-col items-center w-full max-w-7xl px-6">
                {/* Vulcano Big Text Animation */}
                <div className="relative flex items-center justify-center mb-12">
                    <motion.h1
                        initial={{ opacity: 0, scale: 0.9, letterSpacing: "0.1em" }}
                        animate={{
                            opacity: step === 2 ? 0 : 1,
                            scale: step === 2 ? 1.05 : 1,
                            letterSpacing: step === 2 ? "-0.02em" : "-0.05em",
                            filter: step === 2 ? "blur(10px)" : "blur(0px)"
                        }}
                        transition={{
                            duration: 0.6,
                            ease: "easeOut"
                        }}
                        className="text-[15vw] md:text-[20rem] font-black text-black leading-none select-none tracking-tighter text-center"
                        style={{
                            fontFamily: 'var(--font-sans)',
                            display: 'block',
                            width: '100%',
                            filter: 'drop-shadow(0 20px 50px rgba(0,0,0,0.05))'
                        }}
                    >
                        VULCANO
                    </motion.h1>

                    {/* Artistic gradient light */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 0.04, scale: 1 }}
                        transition={{ delay: 0.2, duration: 2 }}
                        className="absolute inset-0 blur-[120px] bg-linear-to-tr from-black to-gray-400 rounded-full -z-10"
                    />
                </div>

                {/* Welcome Message Container */}
                <div className="h-40 flex flex-col items-center justify-start overflow-hidden">
                    <AnimatePresence mode="wait">
                        {step === 1 && (
                            <motion.div
                                key="welcome"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 1.05, filter: "blur(10px)" }}
                                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                                className="text-center"
                            >
                                <motion.div
                                    className="flex items-center justify-center gap-3 mb-6"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.2 }}
                                >
                                    <div className="h-px w-6 bg-black/5" />
                                    <span className="text-black/20 text-[10px] font-bold tracking-[0.5em] uppercase">
                                        Acceso Autorizado
                                    </span>
                                    <div className="h-px w-6 bg-black/5" />
                                </motion.div>

                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.4 }}
                                    className="space-y-1"
                                >
                                    <p className="text-black/40 text-xs md:text-sm font-medium tracking-wide">Bienvenido de nuevo</p>
                                    <h2 className="text-black text-2xl md:text-4xl font-black tracking-tight px-4">
                                        {userName}
                                    </h2>
                                </motion.div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* Background Texture for aesthetic feel */}
            <div className="fixed inset-0 opacity-[0.02] pointer-events-none mix-blend-multiply bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
        </motion.div>
    );
}
