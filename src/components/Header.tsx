import { Box, Hammer, LogOut } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { useNavigate, useLocation } from 'react-router-dom';
import Authenticate from './Authenticate';

export default function Header() {
    const user = useAuthStore((state) => state.user);
    const logout = useAuthStore((state) => state.logout);
    const navigate = useNavigate();
    const location = useLocation();

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
            {/* Left: Branding */}
            <div className="flex items-center gap-3">
                <div
                    onClick={() => navigate('/')}
                    className="cursor-pointer hover:opacity-80 transition-opacity"
                >
                    <Hammer className="w-6 h-6" fill="black" strokeWidth={0} />
                </div>
                <div className="flex items-center gap-2 text-sm font-medium">
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
                </div>
            </div>

            {/* Right: Actions (Only if authenticated) */}
            <Authenticate>
                <div className="flex items-center space-x-4">
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

                    <div className="text-right hidden sm:block pr-4 border-r border-gray-100">
                        <div className="flex items-center justify-end gap-2">
                            <p className="text-sm font-bold text-gray-900">{user?.sub || 'User'}</p>
                        </div>
                        <p className="text-xs text-gray-400 capitalize">
                            {user?.roles?.split(' ')[0].toLowerCase() || 'Member'} | Nv. {user?.nivel || 0}
                        </p>
                    </div>

                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-600 hover:text-red-600 transition-colors rounded-lg hover:bg-red-50 cursor-pointer"
                    >
                        <LogOut className="w-4 h-4" />
                        <span>Cerrar sesión</span>
                    </button>
                </div>
            </Authenticate>
        </header>
    );
}
