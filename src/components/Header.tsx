import { Box, Hammer, LogOut, DollarSign, Settings } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { useNavigate, useLocation } from 'react-router-dom';
import Authenticate from './Authenticate';
import { MobileNav } from "./MobileNav";
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useSpring, useTransform, useMotionValue } from 'framer-motion';

function AnimatedNumber({ value }: { value: number }) {
    const count = useMotionValue(value);
    const rounded = useSpring(count, { mass: 0.5, stiffness: 150, damping: 15 });
    const display = useTransform(rounded, (current) => Math.round(current).toLocaleString());

    useEffect(() => {
        count.set(value);
    }, [value, count]);

    return <motion.span>{display}</motion.span>;
}

export default function Header() {
    const user = useAuthStore((state) => state.user);
    const logout = useAuthStore((state) => state.logout);
    const navigate = useNavigate();
    const location = useLocation();
    
    // Animation logic
    const prevCreditosRef = useRef(user?.creditos);
    const [diff, setDiff] = useState<number | null>(null);

   useEffect(() => {
        const current = user?.creditos;
        const prev = prevCreditosRef.current;

        if (current !== undefined && prev !== undefined && current !== prev) {
            setDiff(current - prev);
            prevCreditosRef.current = current;
            const timer = setTimeout(() => setDiff(null), 2000);
            return () => clearTimeout(timer);
        }

        prevCreditosRef.current = current;
    }, [user?.creditos]);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const getPathName = () => {
        const path = location.pathname.split('/').filter(Boolean)[0];
        if (!path) return null;
        return path.charAt(0).toUpperCase() + path.slice(1);
    };

    return (
        <header className="h-20 bg-white/50 backdrop-blur-md flex items-center justify-between px-6 md:px-12 sticky top-0 z-50 border-b border-gray-100">
            {/* Branding y breadcrumbs */}
            <div className="flex items-center gap-3">
                <button
                    onClick={() => navigate('/')}
                    className="cursor-pointer hover:opacity-80 transition-opacity p-1 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                    aria-label="Ir al dashboard"
                >
                    <Hammer className="w-6 h-6" fill="black" strokeWidth={0} />
                </button>
                <nav className="flex items-center gap-2 text-sm font-medium" aria-label="Breadcrumb">
                    <span className="text-gray-300">/</span>
                    <button
                        onClick={() => navigate('/')}
                        className="text-gray-400 hover:text-black transition-colors cursor-pointer"
                    >
                        Dashboard
                    </button>
                    {getPathName() && (
                        <>
                            <span className="text-gray-300">/</span>
                            <span className="text-gray-900">{getPathName()}</span>
                        </>
                    )}
                </nav>
            </div>

            {/* Acciones de usuario */}
            <Authenticate>
                <div className="flex items-center gap-2">
                    {/* Desktop */}
                    <div className="hidden lg:flex items-center gap-4">
                        <button
                            onClick={() => navigate('/inventario')}
                            className={`p-2 rounded-lg transition-all hover:bg-gray-100 group relative ${location.pathname === '/inventario' ? 'bg-blue-50 text-blue-600' : 'text-gray-400'}`}
                            title="Mi Inventario"
                        >
                            <Box className="w-5 h-5 group-hover:scale-110 transition-transform" />
                            <span className="absolute -top-1 -right-1 flex h-3 w-3">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
                            </span>
                        </button>
                        <div className="text-right pr-4 border-r border-gray-100 flex items-center gap-2">
                             {/* Creditos */}
                             {user && (
                                <div className="relative">
                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-yellow-50 text-yellow-700 text-xs font-bold tracking-wide shadow-sm border border-yellow-200/50 mr-2 relative z-10">
                                        <DollarSign className="w-3.5 h-3.5" />
                                        <AnimatedNumber value={user.creditos ?? 0} />
                                    </span>
                                    <AnimatePresence>
                                        {diff !== null && (
                                            <motion.span
                                                initial={{ opacity: 0, y: 0, scale: 0.5 }}
                                                animate={{ opacity: 1, y: -20, scale: 1 }}
                                                exit={{ opacity: 0 }}
                                                transition={{ duration: 0.8, ease: "easeOut" }}
                                                className={`absolute -right-2 top-0 text-xs font-black pointer-events-none z-20 ${diff > 0 ? 'text-green-500' : 'text-red-500'}`}
                                            >
                                                {diff > 0 ? '+' : ''}{diff.toLocaleString()}
                                            </motion.span>
                                        )}
                                    </AnimatePresence>
                                </div>
                            )}
                            <p className="text-sm font-bold text-gray-900">{user?.sub || 'User'}</p>
                            {user && (
                                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gray-900/90 text-white text-xs font-semibold tracking-wide shadow-sm border border-gray-900/20">
                                    <span className="uppercase tracking-widest">{user.roles?.split(' ')[0]}</span>
                                    <span className="w-1 h-1 rounded-full bg-white/40 mx-1"></span>
                                    <span className="text-gray-200">Nv. {user.nivel}</span>
                                </span>
                            )}
                        </div>
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-600 hover:text-red-600 transition-colors rounded-lg hover:bg-red-50 cursor-pointer"
                        >
                            <LogOut className="w-4 h-4" />
                            <span>Cerrar sesión</span>
                        </button>
                        
                        <button
                          onClick={() => navigate('/ajustes')}
                          className="flex items-center justify-center p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
                          title="Ajustes"
                        >
                           <Settings className="size-5" />
                        </button>
                    </div>
                    {/* Mobile */}
                    <div className="lg:hidden">
                        <MobileNav>
                            <div className="flex flex-col gap-6 p-6 min-h-[100dvh] justify-between">
                                <div className="flex flex-col gap-6">
                                    <div className="flex flex-col items-start gap-2">
                                        <p className="text-base font-bold text-gray-900 break-all">{user?.sub || 'User'}</p>
                                        <div className='flex gap-2 items-center flex-wrap'>
                                            {user && (
                                                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gray-900/90 text-white text-xs font-semibold tracking-wide shadow-sm border border-gray-900/20 w-fit max-w-full overflow-x-auto">
                                                    <span className="uppercase tracking-widest">{user.roles?.split(' ')[0]}</span>
                                                    <span className="w-1 h-1 rounded-full bg-white/40 mx-1"></span>
                                                    <span className="text-gray-200">Nv. {user.nivel}</span>
                                                </span>
                                            )}
                                            {/* Creditos Mobile */}
                                            {user && (
                                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-yellow-50 text-yellow-700 text-xs font-bold tracking-wide shadow-sm border border-yellow-200/50">
                                                    <DollarSign className="w-3.5 h-3.5" />
                                                    <span>{user.creditos?.toLocaleString() ?? 0}</span>
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => { navigate('/inventario'); }}
                                        className={`flex items-center gap-2 px-4 py-3 rounded-lg transition-all hover:bg-gray-100 ${location.pathname === '/inventario' ? 'bg-blue-50 text-blue-600' : 'text-gray-700'}`}
                                    >
                                        <Box className="w-5 h-5" />
                                        Inventario
                                    </button>
                                </div>
                                <button
                                    onClick={handleLogout}
                                    className="flex items-center gap-2 px-4 py-3 rounded-lg text-gray-600 hover:text-red-600 hover:bg-red-50 transition-colors w-full justify-center"
                                >
                                    <LogOut className="w-4 h-4" />
                                    Cerrar sesión
                                </button>
                            </div>
                        </MobileNav>
                    </div>
                </div>
            </Authenticate>
        </header>
    );
}
