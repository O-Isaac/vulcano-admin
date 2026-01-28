import { useAuthStore } from "../store/useAuthStore";

interface Props {
    children: React.ReactNode;
}


export default function Authenticate({ children }: Props) {
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

    if (!isAuthenticated) {
        return null;
    }

    return children;
}