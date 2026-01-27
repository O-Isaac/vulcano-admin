import { Hammer, LogOut } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { useNavigate, useLocation } from 'react-router-dom';

export default function Header() {
    const user = useAuthStore((state) => state.user);
    const logout = useAuthStore((state) => state.logout);
    const navigate = useNavigate();
    const location = useLocation();

    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const getPathName = () => {
        const path = location.pathname.split('/').filter(Boolean)[0];
        return path ? path.charAt(0).toUpperCase() + path.slice(1) : 'Dashboard';
    };

    return (
        <header className="h-20 bg-white/50 backdrop-blur-md flex items-center justify-between px-6 md:px-12 sticky top-0 z-50">
            {/* Left: Branding */}
            <div className="flex items-center gap-3">
                <Hammer className="w-6 h-6" fill="black" strokeWidth={0} />
                <div className="flex items-center gap-2 text-sm font-medium">
                    <span className="text-gray-300">/</span>
                    <span className="text-gray-900">{getPathName()}</span>
                </div>
            </div>

            {/* Right: Actions (Only if authenticated) */}
            {isAuthenticated && (
                <div className="flex items-center space-x-4">
                    <div className="text-right hidden sm:block pr-4 border-r border-gray-100">
                        <p className="text-sm font-medium text-gray-900">{user?.sub || 'User'}</p>
                        <p className="text-xs text-gray-400 capitalize">{user?.roles?.split(' ')[0].toLowerCase() || 'Member'}</p>
                    </div>

                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-600 hover:text-red-600 transition-colors rounded-lg hover:bg-red-50 cursor-pointer"
                    >
                        <LogOut className="w-4 h-4" />
                        <span>Cerrar sesión</span>
                    </button>
                </div>
            )}
        </header>
    );
}
