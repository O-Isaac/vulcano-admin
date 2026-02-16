import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../components/Header';
import IntroAnimation from '../components/IntroAnimation';
import { useAuthStore } from '../store/useAuthStore';
import { AnimatePresence, motion } from 'framer-motion';
import { useQueueMonitor } from '../hooks/useQueueMonitor';

export default function DashboardLayout() {
    useQueueMonitor();
    const user = useAuthStore((state) => state.user);
    const refreshUser = useAuthStore((state) => state.refreshUser);
    const [showIntro, setShowIntro] = useState(() => !sessionStorage.getItem('vulcano_intro_shown'));
    const [isAppReady, setIsAppReady] = useState(() => !!sessionStorage.getItem('vulcano_intro_shown'));

    useEffect(() => {
        refreshUser();
    }, [refreshUser]);

    const handleIntroComplete = () => {
        setShowIntro(false);
        sessionStorage.setItem('vulcano_intro_shown', 'true');
        setTimeout(() => setIsAppReady(true), 150);
    };

    return (
        <div className="min-h-screen bg-white">
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
