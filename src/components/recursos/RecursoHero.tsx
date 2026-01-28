import InteractiveBlob from "../InteractiveBlob";

interface RecursoHeroProps {
    title: string;
    subtitle: string;
}

export default function RecursoHero({ title, subtitle }: RecursoHeroProps) {
    return (
        <section
            className="relative min-h-[400px] flex flex-col justify-center px-6 py-20 md:p-32 overflow-hidden bg-white isolate"
        >
            <InteractiveBlob />
            <div className="flex flex-col items-start text-left relative z-10 w-full">
                <h1 className="text-4xl md:text-7xl font-bold tracking-tight">{title}</h1>
                <p className='text-xl md:text-3xl font-medium text-gray-400'>{subtitle}</p>
            </div>
        </section>
    );
}
