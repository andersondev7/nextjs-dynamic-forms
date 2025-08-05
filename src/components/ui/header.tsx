"use client";

import { ThemeToggle } from "@/context/theme-toggle";

export function Header() {
  return (
    <header className="fixed top-0 z-50 w-full border-b bg-background backdrop-blur">
      <div className="container flex h-14 items-center justify-end">
        <ThemeToggle />
      </div>
    </header>
  );
}
