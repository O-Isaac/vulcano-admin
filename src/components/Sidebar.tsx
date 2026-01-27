import { Users, FileText, Pickaxe, Hammer, LogOut } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { useNavigate, useLocation } from 'react-router-dom';

export default function Sidebar() {
    const logout = useAuthStore((state) => state.logout);
    const user = useAuthStore((state) => state.user);
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const isActive = (path: string) => location.pathname === path;

    // Determine roles
    const isAdmin = user?.roles?.includes('ADMIN');
    // const isJugador = user?.roles?.includes('JUGADOR') || isAdmin; // Admin usually implies access, or check specific logic. User said Planos (Jugador/Admin)

    const navItems = [
        ...(isAdmin ? [{ name: 'Jugadores', icon: Users, path: '/players' }] : []),
        { name: 'Planos', icon: FileText, path: '/blueprints' },
        { name: 'Recursos', icon: Pickaxe, path: '/resources' },
        { name: 'Fundición', icon: Hammer, path: '/foundry' },
    ];

    return (
        <aside className="hidden lg:flex flex-col w-[280px] bg-white min-h-screen fixed left-0 top-0 z-20 border-r border-[#dadce0] py-6 px-4">
            {/* Brand - Antigravity "V" matches Login */}
            <div className="flex items-center px-4 mb-12">
                <div className="h-10 w-10 bg-[#1a73e8] rounded-xl flex items-center justify-center mr-3 shadow-sm">
                    <span className="text-white font-bold text-xl leading-none">V</span>
                </div>
                <span className="text-[22px] font-medium tracking-tight text-[#202124]">Vulcano</span>
            </div>

            {/* Nav */}
            <nav className="flex-1 space-y-1.5">
                <div className="px-4 mb-2">
                    <span className="text-[11px] font-semibold text-[#5f6368] uppercase tracking-wider">Menu</span>
                </div>

                {navItems.map((item) => (
                    <button
                        key={item.name}
                        onClick={() => navigate(item.path)}
                        className={`w-full flex items-center px-5 py-3.5 text-[15px] font-medium rounded-full transition-all duration-200 ${isActive(item.path)
                            ? 'bg-[#e8f0fe] text-[#1a73e8]'
                            : 'text-[#3c4043] hover:bg-[#f1f3f4]'
                            }`}
                    >
                        <item.icon className={`w-5 h-5 mr-4 ${isActive(item.path) ? 'text-[#1a73e8]' : 'text-[#5f6368]'}`} />
                        {item.name}
                    </button>
                ))}
            </nav>

            {/* User Profile & Logout */}
            <div className="mt-auto px-2">
                <div className="p-4 rounded-4xl bg-[#f8f9fa] border border-[#dadce0]">
                    <div className="flex items-center mb-4">
                        <div className="h-10 w-10 rounded-full bg-[#1a73e8] text-white flex items-center justify-center text-sm font-medium">
                            {user?.sub?.[0].toUpperCase()}
                        </div>
                        <div className="ml-3 overflow-hidden">
                            <p className="text-sm font-medium text-[#202124] truncate">{user?.sub}</p>
                            <p className="text-xs text-[#5f6368] truncate">{user?.roles}</p>
                        </div>
                    </div>

                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center justify-center px-4 py-2.5 text-sm font-medium text-[#3c4043] bg-white border border-[#dadce0] rounded-full hover:bg-[#f1f3f4] transition-colors"
                    >
                        <LogOut className="w-4 h-4 mr-2" />
                        Sign out
                    </button>
                </div>
            </div>
        </aside>
    );
}
