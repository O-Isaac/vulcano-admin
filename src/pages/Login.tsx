import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { Hammer } from 'lucide-react';
import InteractiveBlob from '../components/InteractiveBlob';
import Header from '../components/Header';
import { HTTPError } from 'ky';

export default function Login() {
    const navigate = useNavigate();
    const login = useAuthStore((state) => state.login);

    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            await login(email, password);

            navigate('/');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col min-h-screen bg-white font-sans text-gray-900">
            <Header />

            <div className="flex flex-1 relative overflow-hidden">
                {/* Left Column - Branding */}
                <div className="hidden lg:flex w-7/12 flex-col justify-end p-20 relative overflow-hidden bg-gray-50/50 isolate">
                    <InteractiveBlob />
                    <div className="relative z-10 space-y-4">
                        <div className="flex items-center gap-3">
                            <Hammer className="w-10 h-10" fill="black" strokeWidth={0} />
                            <span className="text-2xl font-bold tracking-tight">Vulcano Admin</span>
                        </div>
                        <h1 className="text-[14rem] font-bold tracking-tighter leading-[0.85] text-black select-none opacity-100">
                            Vulcano
                        </h1>
                    </div>
                </div>

                {/* Right Column - Login Form */}
                <div className="w-full lg:w-5/12 flex flex-col items-center justify-center p-12 bg-white relative z-20 border-l-1 border-gray-100">
                    <div className="w-full max-w-[420px] space-y-10">
                        <div className="space-y-3">
                            <h2 className="text-4xl font-bold tracking-tight text-gray-900">Entrar</h2>
                            <p className="text-lg text-gray-400">
                                Inicia sesión en el panel de Vulcano
                            </p>
                        </div>

                        <form className="space-y-6" onSubmit={handleSubmit}>
                            {error && (
                                <div className="p-4 rounded-2xl bg-red-50 text-red-600 text-sm border border-red-100 animate-pulse">
                                    {error}
                                </div>
                            )}
                            <div className="space-y-5">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700 ml-1">Email</label>
                                    <input
                                        type="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="block w-full rounded-2xl border border-gray-100 bg-gray-50/50 px-5 py-4 text-base text-gray-900 placeholder-gray-400 focus:bg-white focus:border-black focus:ring-4 focus:ring-black/5 outline-none transition-all duration-300"
                                        placeholder="correo@ejemplo.com"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <div className="flex justify-between items-center px-1">
                                        <label className="text-sm font-medium text-gray-700">Contraseña</label>
                                        <a href="#" className="text-sm text-gray-400 hover:text-black transition-colors">
                                            ¿Olvidaste tu contraseña?
                                        </a>
                                    </div>
                                    <input
                                        type="password"
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="block w-full rounded-2xl border border-gray-100 bg-gray-50/50 px-5 py-4 text-base text-gray-900 placeholder-gray-400 focus:bg-white focus:border-black focus:ring-4 focus:ring-black/5 outline-none transition-all duration-300"
                                        placeholder="••••••••"
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full rounded-2xl bg-black py-4 text-base font-medium text-white shadow-lg hover:bg-gray-800 hover:shadow-xl active:scale-[0.98] disabled:opacity-50 disabled:scale-100 transition-all duration-300 mt-4 cursor-pointer"
                            >
                                {loading ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        Entrando...
                                    </span>
                                ) : 'Acceder al panel'}
                            </button>
                        </form>

                        <div className="pt-4 text-center text-sm text-gray-400">
                            ¿No tienes cuenta?{' '}
                            <a
                                href="/register"
                                className="text-blue-600 hover:underline font-semibold transition-colors"
                            >
                                Regístrate
                            </a>
                        </div>
                        <div className="pt-8 text-center text-sm text-gray-400 border-t border-gray-100">
                            Hecho por <span className="text-gray-900 font-medium">Isaac Zaragoza Mendoza</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
