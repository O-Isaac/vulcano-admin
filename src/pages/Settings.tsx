import { useState } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { useSettingsStore } from '../store/useSettingsStore';
import { Shield, Eye, EyeOff, Zap, Copy, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

export default function SettingsPage() {
    const { user, refreshToken } = useAuthStore();
    const { queueMonitorEnabled, queueMonitorInterval, setQueueMonitorEnabled, setQueueMonitorInterval } = useSettingsStore();

    const [showRefreshToken, setShowRefreshToken] = useState(false);
    const [copiedToken, setCopiedToken] = useState(false);

    const handleCopy = (text: string) => {
        navigator.clipboard.writeText(text);
        setCopiedToken(true);
        toast.success("Token copiado al portapapeles");
        setTimeout(() => setCopiedToken(false), 2000);
    };

    return (
        <div className="p-8 lg:p-12 max-w-4xl mx-auto space-y-10">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-black uppercase tracking-tighter text-gray-900 mb-2">Ajustes & Sistema</h1>
                <p className="text-gray-400 font-medium">Configuración de cliente y credenciales de sesión.</p>
            </div>

            {/* Client Settings */}
            <section className="bg-white border border-gray-100 rounded-3xl p-8 shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-orange-50 rounded-xl text-orange-500">
                        <Zap className="size-5" />
                    </div>
                    <h2 className="text-lg font-bold text-gray-900 uppercase tracking-tight">Preferencias de Cliente</h2>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100">
                    <div>
                        <h3 className="font-bold text-gray-900 text-sm">Monitor de Fabricación</h3>
                        <p className="text-xs text-gray-500 mt-1 max-w-md">
                            Permite que la aplicación verifique en segundo plano el estado de tus construcciones y te notifique cuando estén listas, incluso si no estás en la pestaña de Fundición.
                        </p>
                    </div>
                    
                    <button
                        onClick={() => setQueueMonitorEnabled(!queueMonitorEnabled)}
                        className={`relative w-14 h-8 rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 ${
                            queueMonitorEnabled ? 'bg-orange-500' : 'bg-gray-200'
                        }`}
                    >
                        <motion.span
                            layout
                            className="absolute top-1 left-1 bg-white w-6 h-6 rounded-full shadow-sm"
                            animate={{ x: queueMonitorEnabled ? 24 : 0 }}
                            transition={{ type: "spring", stiffness: 500, damping: 30 }}
                        />
                    </button>
                    
                </div>
                
                <AnimatePresence>
                    {queueMonitorEnabled && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden"
                        >
                            <div className="mt-4 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                                <div className="flex justify-between items-center mb-2">
                                    <h3 className="font-bold text-gray-900 text-sm">Intervalo de Actualización</h3>
                                    <span className="text-xs font-mono font-bold bg-white px-2 py-1 rounded-md border border-gray-200 text-gray-600">
                                        {(queueMonitorInterval / 1000)}s
                                    </span>
                                </div>
                                <input 
                                    type="range" 
                                    min="5000" 
                                    max="60000" 
                                    step="1000"
                                    value={queueMonitorInterval}
                                    onChange={(e) => setQueueMonitorInterval(Number(e.target.value))}
                                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-orange-500"
                                />
                                <div className="flex justify-between mt-1 text-[10px] text-gray-400 font-medium uppercase tracking-wider">
                                    <span>5s (Rápido)</span>
                                    <span>60s (Lento)</span>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                <p className="text-[10px] text-gray-400 mt-3 pl-2">
                    *Al activarlo, el cliente realizará peticiones al servidor cada {(queueMonitorInterval / 1000)} segundos.
                </p>
            </section>

            {/* Session Info */}
            <section className="bg-white border border-gray-100 rounded-3xl p-8 shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-blue-50 rounded-xl text-blue-600">
                        <Shield className="size-5" />
                    </div>
                    <h2 className="text-lg font-bold text-gray-900 uppercase tracking-tight">Diagnóstico de Sesión</h2>
                </div>

                <div className="space-y-6">
                    {/* User Badge */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">Rango / Rol</span>
                            <div className="flex items-center gap-2">
                                <span className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase border ${user?.roles?.includes('ADMIN') ? 'bg-black text-white border-black' : 'bg-white text-gray-500 border-gray-200'}`}>
                                    {user?.roles || 'USER'}
                                </span>
                                {user?.nivel && (
                                     <span className="px-2 py-0.5 rounded-md text-[10px] font-black uppercase bg-blue-100 text-blue-600 border border-blue-200">
                                        Nivel {user.nivel}
                                     </span>
                                )}
                            </div>
                        </div>

                         <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">Identificador (SUB)</span>
                            <span className="font-mono text-sm font-medium text-gray-700">{user?.sub || 'Desconocido'}</span>
                        </div>
                    </div>

                    {/* Refresh Token Viewer */}
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Refresh Token</span>
                            <button 
                                onClick={() => setShowRefreshToken(!showRefreshToken)}
                                className="text-xs flex items-center gap-1 text-blue-600 hover:text-blue-700 font-medium"
                            >
                                {showRefreshToken ? <><EyeOff className="size-3" /> Ocultar</> : <><Eye className="size-3" /> Mostrar</>}
                            </button>
                        </div>
                        
                        <div className="relative group">
                            <div className={`p-4 bg-zinc-900 rounded-2xl text-zinc-400 font-mono text-[10px] break-all border border-zinc-800 transition-all ${showRefreshToken ? 'opacity-100' : 'opacity-60 blur-[3px] select-none'}`}>
                                {refreshToken || "No disponible"}
                            </div>
                            {showRefreshToken && (
                                <button 
                                    onClick={() => handleCopy(refreshToken || "")}
                                    className="absolute top-2 right-2 p-1.5 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg transition-colors"
                                    title="Copiar al portapapeles"
                                >
                                    {copiedToken ? <Check className="size-3" /> : <Copy className="size-3" />}
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
