import { Box, Eye, FileText, Hammer, Pencil, Trash2, User2 } from 'lucide-react';
import DashboardCard from '../components/DashboardCard';
import { useAuthStore } from '../store/useAuthStore';

import InteractiveBlob from '../components/InteractiveBlob';

export default function Home() {
    const user = useAuthStore((state) => state.user);

    return (
        <>
            {/* Hero Section */}
            <section
                className="relative min-h-[400px] flex flex-col justify-center px-6 py-20 md:p-32 overflow-hidden bg-white isolate"
            >
                <InteractiveBlob />

                <div className="flex flex-col items-start text-left relative z-10 w-full">
                    <h1 className="text-4xl md:text-7xl font-bold tracking-tight">Proyecto Vulcano</h1>
                    <p className='text-xl md:text-3xl font-medium text-gray-400'>Bienvenido {user?.sub} </p>
                </div>
            </section>

            {/* Dashboard Cards */}
            <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 border-gray-200/50 border-y-2 divide-y md:divide-y-0 md:divide-x divide-gray-200/50">
                <DashboardCard
                    title="Recursos"
                    icon={Box}
                    description="Administrar todos los recursos del servicio"
                    actions={[
                        { label: 'Ver recursos', icon: Eye },
                        { label: 'Editar recursos', icon: Pencil },
                        { label: 'Eliminar recursos', icon: Trash2, variant: 'danger' },
                    ]}
                />
                <DashboardCard
                    title="Jugadores"
                    icon={User2}
                    description="Total de jugadores activos en el servicio"
                    actions={[
                        { label: 'Ver jugadores', icon: Eye },
                        { label: 'Editar jugadores', icon: Pencil },
                        { label: 'Eliminar jugadores', icon: Trash2, variant: 'danger' },
                    ]}
                />
                <DashboardCard
                    title="Planos"
                    icon={FileText}
                    description="Gestión de planos y esquemas"
                    actions={[
                        { label: 'Ver planos', icon: Eye },
                        { label: 'Editar planos', icon: Pencil },
                        { label: 'Eliminar planos', icon: Trash2, variant: 'danger' },
                    ]}
                />
                <DashboardCard
                    title="Fundición"
                    icon={Hammer}
                    description="Control de procesos de fundición"
                    actions={[
                        { label: 'Ver fundición', icon: Eye },
                        { label: 'Editar fundición', icon: Pencil },
                        { label: 'Eliminar fundición', icon: Trash2, variant: 'danger' },
                    ]}
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
