import { useNavigate } from 'react-router-dom';
import { Box, Command, Eye, FileText, Hammer, Pencil, Trash2 } from 'lucide-react';
import DashboardCard from '../components/DashboardCard';
import { useAuthStore } from '../store/useAuthStore';

import InteractiveBlob from '../components/InteractiveBlob';

export default function Home() {
    const user = useAuthStore((state) => state.user);
    const navigate = useNavigate();

    return (
        <>
            {/* Hero Section */}
            <section
                className="relative min-h-[400px] flex flex-col justify-center px-6 py-20 md:p-32 overflow-hidden bg-white isolate"
            >
                <InteractiveBlob />

                <div className="flex flex-col items-start text-left relative z-10 w-full gap-2">
                    <h1 className="text-4xl md:text-7xl font-bold tracking-tight">Proyecto Vulcano</h1>
                    <div className="flex items-center gap-3 flex-wrap">
                        <p className='text-xl md:text-3xl font-medium text-gray-400'>Bienvenido {user?.sub}</p>
                        {user && (
                            <span className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-gray-900/90 text-white text-xs md:text-sm font-semibold tracking-wide shadow-sm border border-gray-900/20">
                                <span className="uppercase tracking-widest">{user.roles?.split(' ')[0]}</span>
                                <span className="w-1 h-1 rounded-full bg-white/40 mx-1"></span>
                                <span className="text-gray-200">Nivel {user.nivel}</span>
                            </span>
                        )}
                    </div>
                </div>
            </section>

            {/* Dashboard Cards */}
            <section className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 border-gray-200/50 border-y-2 divide-y md:divide-y-0 md:divide-x divide-gray-200/50">
                <DashboardCard
                    title="Servicios"
                    icon={Command}
                    actions={[]}
                    isAdmin={user?.roles?.includes('ADMIN')}
                />
                <DashboardCard
                    title="Recursos"
                    icon={Box}
                    description="Catálogo maestro de recursos e ítems"
                    actions={[
                        { label: 'Ver recursos', icon: Eye, onClick: () => navigate('/recursos') },
                        { label: 'Editar recursos', icon: Pencil, onClick: () => navigate('/recursos') },
                        { label: 'Eliminar recursos', icon: Trash2, variant: 'danger', onClick: () => navigate('/recursos') },
                    ]}
                    isAdmin={user?.roles?.includes('ADMIN')}
                />
                <DashboardCard
                    title="Planos"
                    icon={FileText}
                    description="Gestión de planos y esquemas jerárquicos de fabricación"
                    actions={[
                        { label: 'Ver planos', icon: Eye, onClick: () => navigate('/planos') },
                        { label: 'Editar planos', icon: Pencil, onClick: () => navigate('/planos') },
                        { label: 'Eliminar planos', icon: Trash2, variant: 'danger', onClick: () => navigate('/planos') },
                    ]}
                    isAdmin={user?.roles?.includes('ADMIN')}
                />
                <DashboardCard
                    title="Fundición"
                    icon={Hammer}
                    description="Control de procesos de fundición"
                    actions={[
                        { label: 'Ver fundición', icon: Eye, onClick: () => navigate('/fundicion') },
                        { label: 'Editar fundición', icon: Pencil, onClick: () => navigate('/fundicion') },
                        { label: 'Eliminar fundición', icon: Trash2, variant: 'danger', onClick: () => navigate('/fundicion') },
                    ]}
                    isAdmin={user?.roles?.includes('ADMIN')}
                />
            </section>

            <footer className="py-20 md:py-32 flex flex-col items-center justify-center gap-4 text-center overflow-hidden">
                <h2 className="text-[18vw] md:text-[12rem] leading-none font-bold text-transparent bg-clip-text bg-linear-to-r from-black via-gray-500 to-black animate-gradient uppercase tracking-tighter select-none pb-4 w-full">
                    Vulcano
                </h2>
                <p className="text-gray-400 font-medium px-6">
                    Hecho por <span className="text-gray-900 font-semibold">Isaac Zaragoza Mendoza</span>
                </p>
            </footer>
        </>
    );
}
