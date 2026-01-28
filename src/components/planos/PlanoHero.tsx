import InteractiveBlob from "../InteractiveBlob";

interface PlanoHeroProps {
    title: string;
    subtitle: string;
}

export default function PlanoHero({ title, subtitle }: PlanoHeroProps) {
    return (
        <section
            className="relative min-h-[300px] flex flex-col justify-center px-6 py-20 md:px-32 border-b border-gray-300 bg-white isolate overflow-hidden"
        >
            <InteractiveBlob />
            <div className="flex flex-col items-start text-left relative z-10 w-full">
                <h1 className="text-4xl md:text-7xl font-bold tracking-tight">{title}</h1>
                <p className='text-xl md:text-2xl font-medium text-gray-400'>{subtitle}</p>
            </div>
        </section>
    );
}
