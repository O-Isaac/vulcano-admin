import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';

export default function GuestGuard() {
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

    if (isAuthenticated) {
        // If user has token, redirect to home/dashboard
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
}
