import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface SettingsState {
    queueMonitorEnabled: boolean;
    queueMonitorInterval: number;
    setQueueMonitorEnabled: (enabled: boolean) => void;
    setQueueMonitorInterval: (interval: number) => void;
}

export const useSettingsStore = create<SettingsState>()(
    persist(
        (set) => ({
            queueMonitorEnabled: false, // Default text from user request: "por defecto este desactivada"
            queueMonitorInterval: 15000, 
            setQueueMonitorEnabled: (enabled) => set({ queueMonitorEnabled: enabled }),
            setQueueMonitorInterval: (interval) => set({ queueMonitorInterval: interval }),
        }),
        {
            name: 'vulcano_settings',
        }
    )
);
