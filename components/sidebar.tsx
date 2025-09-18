"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { FileText, Edit, Archive, Settings, LayoutDashboard, Plus } from "lucide-react"
import { useLanguage } from "@/lib/language-context"
import Link from "next/link"
import { usePathname } from "next/navigation"

const sidebarItems = [
  {
    title: "nav.dashboard",
    icon: LayoutDashboard,
    href: "/",
  },
  {
    title: "nav.templates",
    icon: FileText,
    href: "/templates",
  },
  {
    title: "nav.editor",
    icon: Edit,
    href: "/editor",
  },
  {
    title: "nav.archive",
    icon: Archive,
    href: "/archive",
  },
  {
    title: "nav.settings",
    icon: Settings,
    href: "/settings",
  },
]

export function Sidebar() {
  const { t } = useLanguage()
  const pathname = usePathname()

  return (
    <div className="pb-12 w-64 border-r bg-sidebar/50 backdrop-blur-sm">
      <div className="space-y-4 py-6">
        <div className="px-4">
          <Link href="/create">
            <Button className="w-full mb-6 bg-primary hover:bg-primary/90 shadow-sm">
              <Plus className="mr-2 h-4 w-4" />
              Create Document
            </Button>
          </Link>

          <div className="space-y-2">
            <ScrollArea className="h-[calc(100vh-12rem)]">
              {sidebarItems.map((item) => (
                <Link key={item.href} href={item.href}>
                  <Button
                    variant={pathname === item.href ? "secondary" : "ghost"}
                    className={cn(
                      "w-full justify-start mb-1 h-11 text-sm font-medium transition-all",
                      pathname === item.href
                        ? "bg-primary/10 text-primary border-r-2 border-primary shadow-sm"
                        : "hover:bg-accent/50 text-muted-foreground hover:text-foreground",
                    )}
                  >
                    <item.icon className="mr-3 h-4 w-4" />
                    {t(item.title)}
                  </Button>
                </Link>
              ))}
            </ScrollArea>
          </div>
        </div>
      </div>
    </div>
  )
}
