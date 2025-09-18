"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { FileText, Users, Scale, AlertTriangle, Plus, ArrowRight } from "lucide-react"
import { useLanguage } from "@/lib/language-context"
import Link from "next/link"
import { Navbar } from "@/components/navbar"
import { Sidebar } from "@/components/sidebar"
import { LanguageProvider } from "@/lib/language-context"
import { useState, useEffect } from "react"

function TemplatesContent() {
  const { t } = useLanguage()
  const [realStats, setRealStats] = useState({
    firUsed: 0,
    chargesheetUsed: 0,
    generalUsed: 0,
  })

  useEffect(() => {
    const savedDocs = JSON.parse(localStorage.getItem("savedDocuments") || "[]")
    const firCount = savedDocs.filter((doc: any) => doc.type === "fir").length
    const chargesheetCount = savedDocs.filter((doc: any) => doc.type === "chargesheet").length
    const generalCount = savedDocs.filter((doc: any) => doc.type === "general").length

    setRealStats({
      firUsed: firCount,
      chargesheetUsed: chargesheetCount,
      generalUsed: generalCount,
    })
  }, [])

  const templates = [
    {
      id: "fir",
      title: t("templates.fir"),
      description: t("templates.fir.desc"),
      icon: AlertTriangle,
      category: "Police Reports",
      fields: ["form.complainant", "form.date", "form.location", "form.officer", "form.details"],
      color: "bg-red-50 text-red-700 border-red-200 dark:bg-red-950 dark:text-red-300 dark:border-red-800",
      iconColor: "text-red-600",
    },
    {
      id: "chargesheet",
      title: t("templates.chargesheet"),
      description: t("templates.chargesheet.desc"),
      icon: Scale,
      category: "Court Documents",
      fields: ["form.case_id", "form.accused", "form.charges", "form.evidence", "form.witnesses"],
      color: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-800",
      iconColor: "text-blue-600",
    },
    {
      id: "general",
      title: t("templates.general"),
      description: t("templates.general.desc"),
      icon: FileText,
      category: "General Reports",
      fields: ["form.date", "form.location", "form.officer", "form.details"],
      color: "bg-green-50 text-green-700 border-green-200 dark:bg-green-950 dark:text-green-300 dark:border-green-800",
      iconColor: "text-green-600",
    },
  ]

  return (
    <div className="flex-1 space-y-8 p-8 pt-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            Document Templates
          </h2>
          <p className="text-muted-foreground text-lg mt-2">
            Choose from professional legal document templates to get started quickly
          </p>
        </div>
        <Link href="/create">
          <Button size="lg" className="bg-primary hover:bg-primary/90 shadow-sm">
            <Plus className="mr-2 h-4 w-4" />
            Create Custom Document
          </Button>
        </Link>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {templates.map((template) => (
          <Card
            key={template.id}
            className="group hover:shadow-xl transition-all duration-300 border-0 bg-card/50 backdrop-blur-sm hover:scale-[1.02]"
          >
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between mb-4">
                <div
                  className={`p-3 rounded-lg bg-background/50 border ${template.color.split(" ").slice(-3).join(" ")}`}
                >
                  <template.icon className={`h-6 w-6 ${template.iconColor}`} />
                </div>
                <Badge variant="secondary" className={`${template.color} font-medium`}>
                  {template.category}
                </Badge>
              </div>
              <CardTitle className="text-xl group-hover:text-primary transition-colors">{template.title}</CardTitle>
              <CardDescription className="text-sm leading-relaxed">{template.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="text-sm font-medium mb-3 text-muted-foreground">Required Fields:</h4>
                <div className="flex flex-wrap gap-2">
                  {template.fields.map((field) => (
                    <Badge key={field} variant="outline" className="text-xs bg-background/50">
                      {t(field)}
                    </Badge>
                  ))}
                </div>
              </div>
              <Link href={`/templates/${template.id}`}>
                <Button className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                  Use Template
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="shadow-lg border-0 bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-xl">
            <Users className="h-6 w-6 text-primary" />
            Template Usage Statistics
          </CardTitle>
          <CardDescription>Track your document creation activity and template preferences</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-3">
            <div className="text-center p-6 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-lg">
              <div className="text-3xl font-bold text-red-600 mb-2">{realStats.firUsed}</div>
              <div className="text-sm text-muted-foreground">FIR Templates Used</div>
            </div>
            <div className="text-center p-6 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg">
              <div className="text-3xl font-bold text-blue-600 mb-2">{realStats.chargesheetUsed}</div>
              <div className="text-sm text-muted-foreground">Charge Sheets Created</div>
            </div>
            <div className="text-center p-6 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg">
              <div className="text-3xl font-bold text-green-600 mb-2">{realStats.generalUsed}</div>
              <div className="text-sm text-muted-foreground">General Reports Filed</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default function Templates() {
  return (
    <LanguageProvider>
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/10">
        <Navbar />
        <div className="flex">
          <Sidebar />
          <TemplatesContent />
        </div>
      </div>
    </LanguageProvider>
  )
}
