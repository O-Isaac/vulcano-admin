import { Clock } from "lucide-react";

interface PlanoTimeSelectorProps {
    hours: number;
    minutes: number;
    seconds: number;
    setHours: (val: number) => void;
    setMinutes: (val: number) => void;
    setSeconds: (val: number) => void;
}

export function PlanoTimeSelector({
    hours,
    minutes,
    seconds,
    setHours,
    setMinutes,
    setSeconds,
}: PlanoTimeSelectorProps) {
    return (
        <div className="border-b border-gray-100 p-6 flex flex-col gap-4 bg-gray-50/30">
            <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                    <Clock className="size-4" />
                    Tiempo de Fabricación
                </span>
            </div>
            <div className="flex gap-8 items-center justify-start ml-2">
                <TimeInput label="Horas" value={hours} onChange={setHours} max={undefined} />
                <div className="text-2xl font-light text-gray-300">:</div>
                <TimeInput label="Minutos" value={minutes} onChange={setMinutes} max={59} />
                <div className="text-2xl font-light text-gray-300">:</div>
                <TimeInput label="Segundos" value={seconds} onChange={setSeconds} max={59} />
            </div>
        </div>
    );
}

function TimeInput({ label, value, onChange, max }: { label: string, value: number, onChange: (v: number) => void, max?: number }) {
    return (
        <div className="flex flex-col items-center gap-1 group">
            <input
                type="number"
                min="0"
                max={max}
                className="w-16 text-2xl font-bold text-center bg-transparent border-b-2 border-gray-200 focus:border-blue-500 focus:outline-none transition-colors"
                value={value}
                onChange={(e) => {
                    const val = Number(e.target.value);
                    onChange(max ? Math.min(max, Math.max(0, val)) : Math.max(0, val));
                }}
            />
            <span className="text-[10px] uppercase font-bold text-gray-400 group-focus-within:text-blue-500">
                {label}
            </span>
        </div>
    );
}
