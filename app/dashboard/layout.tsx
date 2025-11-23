import type React from "react"
import { Users, FileText, LayoutDashboard, LogOut } from "lucide-react"
import Link from "next/link"
import { GlobalSearch } from "@/components/search/global-search"
import { Suspense } from "react"

import { Logo } from "@/components/ui/logo"
import { logout } from "@/app/login/actions"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <aside className="w-64 border-r border-border bg-card">
        <div className="flex h-20 items-center justify-start border-b border-border px-6">
          <Logo className="h-11" />
        </div>
        <nav className="space-y-1 p-4">
          <Link
            href="/dashboard"
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-foreground transition-colors hover:bg-secondary"
          >
            <LayoutDashboard className="h-5 w-5" />
            <span>Dashboard</span>
          </Link>
          <Link
            href="/dashboard/clientes"
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-foreground transition-colors hover:bg-secondary"
          >
            <Users className="h-5 w-5" />
            <span>Clientes</span>
          </Link>
          <Link
            href="/dashboard/manutencoes"
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-foreground transition-colors hover:bg-secondary"
          >
            <FileText className="h-5 w-5" />
            <span>Manutenções</span>
          </Link>
        </nav>
        <div className="mt-auto p-4 border-t border-border">
          <form action={logout}>
            <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-secondary">
              <LogOut className="h-5 w-5" />
              <span>Sair</span>
            </button>
          </form>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1">
        <Suspense fallback={<div>Loading...</div>}>
          <GlobalSearch />
        </Suspense>
        {children}
      </main>
    </div>
  )
}
