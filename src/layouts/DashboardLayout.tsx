import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../components/Header';
import IntroAnimation from '../components/IntroAnimation';
import { useAuthStore } from '../store/useAuthStore';
import { AnimatePresence, motion } from 'framer-motion';
import { Toaster } from 'sonner';

export default function DashboardLayout() {
    const user = useAuthStore((state) => state.user);
    const [showIntro, setShowIntro] = useState(false);
    const [isAppReady, setIsAppReady] = useState(false);

    useEffect(() => {
        const hasShownIntro = sessionStorage.getItem('vulcano_intro_shown');

        if (!hasShownIntro) {
            setShowIntro(true);
        } else {
            setIsAppReady(true);
        }
    }, []);

    const handleIntroComplete = () => {
        setShowIntro(false);
        sessionStorage.setItem('vulcano_intro_shown', 'true');
        setTimeout(() => setIsAppReady(true), 150);
    };

    return (
        <div className="min-h-screen bg-white">
            <Toaster richColors theme="dark" />
            <AnimatePresence mode="wait">
                {showIntro && (
                    <IntroAnimation
                        userName={user?.sub || 'Usuario'}
                        onComplete={handleIntroComplete}
                    />
                )}
            </AnimatePresence>

            {isAppReady && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                >
                    <Header />
                    <main>
                        <Outlet />
                    </main>
                </motion.div>
            )}
        </div>
    );
}
