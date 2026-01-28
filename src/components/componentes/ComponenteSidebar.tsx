interface ComponenteSidebarProps {
    title: string;
    onAdd: () => void;
}

export default function ComponenteSidebar({ title, onAdd }: ComponenteSidebarProps) {
    return (
        <aside className="border-r border-gray-300 w-full md:w-80 min-h-full bg-gray-50/30 flex flex-col sticky top-20">
            <div className="p-6 border-b border-gray-300 flex items-center justify-between">
                <h2 className="font-semibold text-gray-900">{title}</h2>
                <button
                    onClick={onAdd}
                    className="size-12 rounded-full bg-black text-white text-3xl font-black flex items-center justify-center hover:bg-gray-800 transition-colors cursor-pointer"
                >
                    +
                </button>
            </div>
        </aside>
    );
}
