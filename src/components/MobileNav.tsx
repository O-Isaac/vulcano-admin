import * as React from "react";
import { Drawer } from "vaul";
import { Menu } from "lucide-react";

export function MobileNav({ children }: { children: React.ReactNode }) {
  return (
    <Drawer.Root direction="left">
      <Drawer.Trigger asChild>
        <button className="inline-flex items-center justify-center rounded-lg p-2 text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-black lg:hidden">
          <Menu className="w-6 h-6" />
        </button>
      </Drawer.Trigger>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 bg-black/30 z-40" />
        <Drawer.Content className="fixed top-0 left-0 h-full w-64 bg-white z-50 shadow-lg p-0">
          {children}
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}
