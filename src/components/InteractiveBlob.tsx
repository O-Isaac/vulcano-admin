import { useRef, useEffect } from 'react';

export default function InteractiveBlob() {
    const blobRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (!blobRef.current || !containerRef.current) return;

            // Get parent container bounds
            const parent = containerRef.current.parentElement;
            if (!parent) return;

            const rect = parent.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            // Direct DOM manipulation for performance (skips React render cycle)
            blobRef.current.style.transform = `translate3d(${x - 250}px, ${y - 250}px, 0)`;
        };

        const parent = containerRef.current?.parentElement;
        if (parent) {
            parent.addEventListener('mousemove', handleMouseMove as any);
        }

        return () => {
            if (parent) {
                parent.removeEventListener('mousemove', handleMouseMove as any);
            }
        };
    }, []);

    return (
        <div ref={containerRef} className="absolute inset-0 pointer-events-none overflow-hidden -z-10 bg-transparent">
            <div
                ref={blobRef}
                className="absolute w-[500px] h-[500px] transition-transform duration-1000 ease-out will-change-transform opacity-40 mix-blend-multiply"
                style={{
                    transform: 'translate3d(calc(50% - 250px), calc(50% - 250px), 0)'
                }}
            >
                {/* Single Large Living Blob */}
                <div className="absolute inset-0 blur-[100px] animate-morph animate-float animate-color-shift" />
            </div>
        </div>
    );
}
