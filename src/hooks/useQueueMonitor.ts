import { useEffect, useRef } from 'react';
import useSWR from 'swr';
import { toast } from 'sonner';
import { useAuthStore } from '../store/useAuthStore';
import { useSettingsStore } from '../store/useSettingsStore';
import type { Queue } from '../types/api';
import { getActiveQueues } from '../services/vulcano.service';

export function useQueueMonitor() {
    const { queueMonitorEnabled, queueMonitorInterval } = useSettingsStore();
    
    // Condicional SWR: si queueMonitorEnabled es false, pasamos null como key para desactivar la query
    // Sin embargo, queremos que getActiveQueues funcione si ya estamos en una pagina que lo usa...
    // Pero useQueueMonitor suele ser global.
    // La mejor estrategia para "no gastar recursos" es pausar el polling.
    
    // Si queremos desactivarlo completamente:
    const shouldFetch = queueMonitorEnabled ? "api/queues/active" : null;

    const { data: activeQueues, mutate } = useSWR<Queue[]>(shouldFetch, getActiveQueues, {
        refreshInterval: queueMonitorEnabled ? queueMonitorInterval : 0, 
        revalidateOnFocus: queueMonitorEnabled
    });
    const refreshUser = useAuthStore(state => state.refreshUser);
    
    // Rastreamos los IDs para los que ya hemos configurado un timer en esta sesión
    const monitoredIds = useRef(new Set<number>());

    useEffect(() => {
        if (!queueMonitorEnabled || !activeQueues) return;

        activeQueues.forEach((queue) => {
            // Si ya lo estamos monitoreando, saltar
            if (monitoredIds.current.has(queue.id)) return;

            const endTime = new Date(queue.finalTime).getTime();
            const now = Date.now();
            const delay = endTime - now;

            // Si ya terminó (ej: mientras estaba cerrado), podemos refrescar datos silenciosamente
            // O si acaba de terminar (margen pequeño), notificar.
            // Por ahora, si es negativo, asumimos que backend lo limpiará o UI se actualizará
            if (delay <= 0) {
                 // Opción: forzar refresco si encontramos algo vencido
                 // mutate(); 
                 return;
            }

            // Programar notificación
            monitoredIds.current.add(queue.id);

            setTimeout(() => {
                // Notificar
                toast.success('Fabricación Completada', {
                    description: `${queue.plano.nombre} ha sido añadido a tu inventario.`,
                    duration: 5000,
                    icon: '🔨'
                });

                // Efectos colaterales
                mutate(); // Recargar colas (debería desaparecer)
                refreshUser(); // Actualizar créditos/inventario
                
                // Limpieza (opcional, ya que el ID sigue en el Set para no repetir)
                // monitoredIds.current.delete(queue.id); 
            }, delay);
        });
    }, [activeQueues, mutate, refreshUser, queueMonitorEnabled]);
}
