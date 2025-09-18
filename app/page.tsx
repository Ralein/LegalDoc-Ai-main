"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  FileText,
  Edit,
  Archive,
  TrendingUp,
  Plus,
  Clock,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Sparkles,
} from "lucide-react"
import { useLanguage } from "@/lib/language-context"
import Link from "next/link"
import { Navbar } from "@/components/navbar"
import { Sidebar } from "@/components/sidebar"
import { LanguageProvider } from "@/lib/language-context"
import { useEffect, useState } from "react"

function DashboardContent() {
  const { t } = useLanguage()
  const [realStats, setRealStats] = useState({
    totalDocs: 0,
    templatesUsed: 0,
    archivedDocs: 0,
    completionRate: 0,
  })
  const [recentDocuments, setRecentDocuments] = useState<any[]>([])

  useEffect(() => {
    const savedDocs = JSON.parse(localStorage.getItem("savedDocuments") || "[]")
    const archivedDocs = JSON.parse(localStorage.getItem("archivedDocuments") || "[]")

    const totalDocs = savedDocs.length
    const templatesUsed = new Set(savedDocs.map((doc: any) => doc.type)).size
    const archivedCount = archivedDocs.length
    const completedDocs = savedDocs.filter((doc: any) => !doc.content.includes("[")).length
    const completionRate = totalDocs > 0 ? Math.round((completedDocs / totalDocs) * 100) : 0

    setRealStats({
      totalDocs,
      templatesUsed,
      archivedDocs: archivedCount,
      completionRate,
    })

    const recent = savedDocs
      .sort((a: any, b: any) => new Date(b.modified).getTime() - new Date(a.modified).getTime())
      .slice(0, 5)
      .map((doc: any) => ({
        id: doc.id,
        title: doc.title,
        type: doc.type === "fir" ? "FIR" : doc.type === "chargesheet" ? "Charge Sheet" : "General Report",
        date: new Date(doc.modified).toLocaleDateString(),
        status: doc.content.includes("[") ? "Draft" : "Completed",
      }))

    setRecentDocuments(recent)
  }, [])

  const stats = [
    {
      title: "Total Documents",
      value: realStats.totalDocs.toString(),
      description: "Active legal documents",
      icon: FileText,
      color: "text-blue-600",
      bgColor: "bg-blue-50 dark:bg-blue-950/20",
      borderColor: "border-blue-200 dark:border-blue-800",
    },
    {
      title: "Templates Used",
      value: realStats.templatesUsed.toString(),
      description: "Different template types",
      icon: Edit,
      color: "text-green-600",
      bgColor: "bg-green-50 dark:bg-green-950/20",
      borderColor: "border-green-200 dark:border-green-800",
    },
    {
      title: "Archived Cases",
      value: realStats.archivedDocs.toString(),
      description: "Completed documents",
      icon: Archive,
      color: "text-purple-600",
      bgColor: "bg-purple-50 dark:bg-purple-950/20",
      borderColor: "border-purple-200 dark:border-purple-800",
    },
    {
      title: "Completion Rate",
      value: `${realStats.completionRate}%`,
      description: "Document completion rate",
      icon: TrendingUp,
      color: "text-orange-600",
      bgColor: "bg-orange-50 dark:bg-orange-950/20",
      borderColor: "border-orange-200 dark:border-orange-800",
    },
  ]

  return (
    <div className="flex-1 space-y-8 p-8 pt-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            Dashboard
          </h2>
          <p className="text-muted-foreground text-lg mt-2">
            Welcome back! Here's an overview of your legal document management.
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Link href="/create">
            <Button size="lg" className="bg-primary hover:bg-primary/90 shadow-sm">
              <Plus className="mr-2 h-4 w-4" />
              Create New Document
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card
            key={stat.title}
            className={`hover:shadow-lg transition-all duration-300 border-0 ${stat.bgColor} ${stat.borderColor} border backdrop-blur-sm hover:scale-[1.02]`}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
              <stat.icon className={`h-5 w-5 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className={`text-3xl font-bold ${stat.color} mb-1`}>{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4 shadow-lg border-0 bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center text-xl">
              <Clock className="mr-3 h-6 w-6 text-primary" />
              Recent Documents
            </CardTitle>
            <CardDescription>Your latest legal document drafts and submissions</CardDescription>
          </CardHeader>
          <CardContent>
            {recentDocuments.length > 0 ? (
              <div className="space-y-4">
                {recentDocuments.map((doc) => (
                  <div
                    key={doc.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/30 transition-colors group"
                  >
                    <div className="space-y-1">
                      <p className="text-sm font-medium leading-none group-hover:text-primary transition-colors">
                        {doc.title}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {doc.id} • {doc.type}
                      </p>
                    </div>
                    <div className="text-right space-y-1">
                      <p className="text-sm text-muted-foreground">{doc.date}</p>
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          doc.status === "Completed"
                            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                            : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
                        }`}
                      >
                        {doc.status === "Completed" ? (
                          <CheckCircle2 className="mr-1 h-3 w-3" />
                        ) : (
                          <AlertTriangle className="mr-1 h-3 w-3" />
                        )}
                        {doc.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="mx-auto w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <FileText className="h-12 w-12 text-primary/50" />
                </div>
                <p className="text-lg font-medium text-muted-foreground mb-2">No documents yet</p>
                <p className="text-sm text-muted-foreground mb-4">Create your first document to get started</p>
                <Link href="/create">
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Create Document
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="col-span-3 shadow-lg border-0 bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center text-xl">
              <Sparkles className="mr-3 h-6 w-6 text-primary" />
              Quick Actions
            </CardTitle>
            <CardDescription>Common tasks and shortcuts</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Link href="/create">
              <Button
                className="w-full justify-start h-14 bg-transparent hover:bg-primary/5 border border-primary/20 group"
                variant="outline"
              >
                <div className="flex items-center">
                  <div className="p-2 bg-primary/10 rounded-lg mr-4 group-hover:bg-primary/20 transition-colors">
                    <Plus className="h-5 w-5 text-primary" />
                  </div>
                  <div className="text-left">
                    <div className="font-medium">Create New Document</div>
                    <div className="text-xs text-muted-foreground">Start with custom form</div>
                  </div>
                </div>
                <ArrowRight className="ml-auto h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>

            <Link href="/templates">
              <Button
                className="w-full justify-start h-14 bg-transparent hover:bg-primary/5 border border-primary/20 group"
                variant="outline"
              >
                <div className="flex items-center">
                  <div className="p-2 bg-primary/10 rounded-lg mr-4 group-hover:bg-primary/20 transition-colors">
                    <FileText className="h-5 w-5 text-primary" />
                  </div>
                  <div className="text-left">
                    <div className="font-medium">Use Template</div>
                    <div className="text-xs text-muted-foreground">FIR, Charge Sheet, Reports</div>
                  </div>
                </div>
                <ArrowRight className="ml-auto h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>

            <Link href="/editor">
              <Button
                className="w-full justify-start h-14 bg-transparent hover:bg-primary/5 border border-primary/20 group"
                variant="outline"
              >
                <div className="flex items-center">
                  <div className="p-2 bg-primary/10 rounded-lg mr-4 group-hover:bg-primary/20 transition-colors">
                    <Edit className="h-5 w-5 text-primary" />
                  </div>
                  <div className="text-left">
                    <div className="font-medium">Open Editor</div>
                    <div className="text-xs text-muted-foreground">Rich text editing with AI</div>
                  </div>
                </div>
                <ArrowRight className="ml-auto h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>

            <Link href="/archive">
              <Button
                className="w-full justify-start h-14 bg-transparent hover:bg-primary/5 border border-primary/20 group"
                variant="outline"
              >
                <div className="flex items-center">
                  <div className="p-2 bg-primary/10 rounded-lg mr-4 group-hover:bg-primary/20 transition-colors">
                    <Archive className="h-5 w-5 text-primary" />
                  </div>
                  <div className="text-left">
                    <div className="font-medium">Browse Archive</div>
                    <div className="text-xs text-muted-foreground">Search past documents</div>
                  </div>
                </div>
                <ArrowRight className="ml-auto h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default function Dashboard() {
  return (
    <LanguageProvider>
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/10">
        <Navbar />
        <div className="flex">
          <Sidebar />
          <DashboardContent />
        </div>
      </div>
    </LanguageProvider>
  )
}
