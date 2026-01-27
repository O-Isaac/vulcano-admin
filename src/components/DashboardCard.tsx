import type { LucideIcon } from 'lucide-react';

interface Action {
    label: string;
    icon: LucideIcon;
    onClick?: () => void;
    variant?: 'default' | 'danger';
}

interface DashboardCardProps {
    title: string;
    icon: LucideIcon;
    description: string;
    actions: Action[];
}

export default function DashboardCard({ title, icon: Icon, description, actions }: DashboardCardProps) {
    return (
        <div className="h-full p-8 flex flex-col justify-between gap-6 transition-colors hover:bg-gray-50/50">
            <div className="space-y-6">
                <span className='flex items-center gap-2'>
                    <Icon strokeWidth={0} className='size-8' fill='black' />
                    <h3 className='font-medium text-xl'>{title}</h3>
                </span>

                <div className='flex flex-col gap-2'>
                    {actions.map((action, index) => (
                        <button
                            key={index}
                            onClick={action.onClick}
                            className={`flex items-center gap-3 p-2 -ml-2 rounded-lg transition-colors w-full text-left group
                                ${action.variant === 'danger'
                                    ? 'hover:bg-red-50 text-gray-600 hover:text-red-600'
                                    : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900'
                                }`}
                        >
                            <action.icon
                                className={`size-5 
                                    ${action.variant === 'danger'
                                        ? 'text-gray-400 group-hover:text-red-500'
                                        : 'text-gray-400 group-hover:text-gray-600'
                                    }`}
                            />
                            <span className='font-normal'>{action.label}</span>
                        </button>
                    ))}
                </div>
            </div>

            <div>
                <h3 className='font-medium mb-1'>Descripción</h3>
                <p className="text-gray-500 text-sm">{description}</p>
            </div>
        </div>
    );
}
