import { motion, AnimatePresence, Variants } from 'framer-motion';
import { useEffect, useState, useMemo } from 'react';

interface IntroAnimationProps {
    userName: string;
    onComplete: () => void;
}

/**
 * Animation Timing Configuration
 */
const TIMING = {
    SHOW_WELCOME: 400,
    START_EXIT: 2000,
    FINISH: 2600,
};

/**
 * Framer Motion Variants for specialized animations
 */
const CONTAINER_VARIANTS: Variants = {
    initial: { opacity: 1, scale: 1 },
    exit: {
        opacity: 0,
        scale: 1.05,
        filter: "blur(20px)",
        transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] }
    }
};

const LOGO_VARIANTS: Variants = {
    initial: { opacity: 0, scale: 0.9, letterSpacing: "0.1em" },
    visible: {
        opacity: 1,
        scale: 1,
        letterSpacing: "-0.05em",
        transition: { duration: 0.6, ease: "easeOut" }
    },
    exiting: {
        opacity: 0,
        scale: 1.05,
        letterSpacing: "-0.02em",
        filter: "blur(10px)",
        transition: { duration: 0.6, ease: "easeOut" }
    }
};

const WELCOME_VARIANTS: Variants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
        opacity: 1,
        scale: 1,
        transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] }
    },
    exit: {
        opacity: 0,
        scale: 1.05,
        filter: "blur(10px)",
        transition: { duration: 0.6 }
    }
};

export default function IntroAnimation({ userName, onComplete }: IntroAnimationProps) {
    const [step, setStep] = useState<'intro' | 'welcome' | 'exiting'>('intro');

    useEffect(() => {
        const timers = [
            setTimeout(() => setStep('welcome'), TIMING.SHOW_WELCOME),
            setTimeout(() => setStep('exiting'), TIMING.START_EXIT),
            setTimeout(() => onComplete(), TIMING.FINISH)
        ];

        return () => timers.forEach(clearTimeout);
    }, [onComplete]);

    // Optimize background texture to avoid unnecessary re-renders
    const grainTexture = useMemo(() => (
        <div
            className="fixed inset-0 opacity-[0.02] pointer-events-none mix-blend-multiply bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"
            aria-hidden="true"
        />
    ), []);

    return (
        <motion.div
            variants={CONTAINER_VARIANTS}
            initial="initial"
            exit="exit"
            className="fixed inset-0 z-9999 bg-white flex flex-col items-center justify-center overflow-hidden"
        >
            <div className="relative flex flex-col items-center w-full max-w-7xl px-6">

                {/* BRAND LOGO SECTION */}
                <div className="relative flex items-center justify-center mb-12">
                    <motion.h1
                        variants={LOGO_VARIANTS}
                        initial="initial"
                        animate={step === 'exiting' ? 'exiting' : 'visible'}
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

                    {/* Atmospheric Glow */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 0.04, scale: 1 }}
                        transition={{ delay: 0.2, duration: 2 }}
                        className="absolute inset-0 blur-[120px] bg-linear-to-tr from-black to-gray-400 rounded-full -z-10"
                        aria-hidden="true"
                    />
                </div>

                {/* WELCOME MESSAGE SECTION */}
                <div className="h-40 flex flex-col items-center justify-start overflow-hidden">
                    <AnimatePresence mode="wait">
                        {step === 'welcome' && (
                            <motion.div
                                key="welcome-content"
                                variants={WELCOME_VARIANTS}
                                initial="hidden"
                                animate="visible"
                                exit="exit"
                                className="text-center"
                            >
                                <SecondaryBranding />
                                <Greeting userName={userName} />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {grainTexture}
        </motion.div>
    );
}

/**
 * Sub-component for "Acceso Autorizado" badge
 */
function SecondaryBranding() {
    return (
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
    );
}

/**
 * Sub-component for personal greeting
 */
function Greeting({ userName }: { userName: string }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="space-y-1"
        >
            <p className="text-black/40 text-xs md:text-sm font-medium tracking-wide">
                Bienvenido de nuevo
            </p>
            <h2 className="text-black text-2xl md:text-4xl font-black tracking-tight px-4">
                {userName}
            </h2>
        </motion.div>
    );
}
