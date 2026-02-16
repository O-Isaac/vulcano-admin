import { useState, useEffect, type ChangeEvent } from 'react';
import type { Plano } from '../types/api';

export function usePlanoForm(initialPlano: Partial<Plano>) {
    const [planoData, setPlanoData] = useState<Partial<Plano>>(() => ({
        ...initialPlano,
        recursoFabricadoId: initialPlano.recursoFabricadoId || initialPlano.recursoFabricado?.id
    }));

    // Time selector state
    const [hours, setHours] = useState(0);
    const [minutes, setMinutes] = useState(0);
    const [seconds, setSeconds] = useState(0);

    // Sync state when prop changes
    useEffect(() => {
        setPlanoData({
            ...initialPlano,
            recursoFabricadoId: initialPlano.recursoFabricadoId || initialPlano.recursoFabricado?.id
        });

        if (initialPlano.tiempoConstrucion) {
            const totalSeconds = Math.floor(initialPlano.tiempoConstrucion / 1000);
            setHours(Math.floor(totalSeconds / 3600));
            setMinutes(Math.floor((totalSeconds % 3600) / 60));
            setSeconds(totalSeconds % 60);
        } else {
            setHours(0);
            setMinutes(0);
            setSeconds(0);
        }
    }, [initialPlano]);

    const handleInputChange = (
        e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setPlanoData(prev => ({
            ...prev,
            [name]: name === 'coste' || name === 'recursoFabricadoId' 
                ? (value === "" ? "" : Number(value)) 
                : value,
        }));
    };

    const getConstructionTime = () => {
        return (hours * 3600 + (minutes || 0) * 60 + (seconds || 0)) * 1000;
    };

    return {
        planoData,
        setPlanoData,
        timeState: { hours, minutes, seconds },
        timeSetters: { setHours, setMinutes, setSeconds },
        handleInputChange,
        getConstructionTime
    };
}

