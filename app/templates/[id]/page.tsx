"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useLanguage } from "@/lib/language-context"
import { useRouter } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { Sidebar } from "@/components/sidebar"
import { LanguageProvider } from "@/lib/language-context"
import { ArrowLeft, FileText } from "lucide-react"
import Link from "next/link"

function TemplateFormContent({ params }: { params: { id: string } }) {
  const { t } = useLanguage()
  const router = useRouter()
  const [formData, setFormData] = useState<Record<string, string>>({})

  const templateConfigs = {
    fir: {
      title: t("templates.fir"),
      fields: [
        { key: "complainant", label: "form.complainant", type: "text", required: true },
        { key: "date", label: "form.date", type: "date", required: true },
        { key: "location", label: "form.location", type: "text", required: true },
        { key: "officer", label: "form.officer", type: "text", required: true },
        { key: "details", label: "form.details", type: "textarea", required: true },
      ],
    },
    chargesheet: {
      title: t("templates.chargesheet"),
      fields: [
        { key: "case_id", label: "form.case_id", type: "text", required: true },
        { key: "accused", label: "form.accused", type: "text", required: true },
        { key: "charges", label: "form.charges", type: "textarea", required: true },
        { key: "evidence", label: "form.evidence", type: "textarea", required: true },
        { key: "witnesses", label: "form.witnesses", type: "textarea", required: false },
      ],
    },
    general: {
      title: t("templates.general"),
      fields: [
        { key: "date", label: "form.date", type: "date", required: true },
        { key: "location", label: "form.location", type: "text", required: true },
        { key: "officer", label: "form.officer", type: "text", required: true },
        { key: "details", label: "form.details", type: "textarea", required: true },
      ],
    },
  }

  const config = templateConfigs[params.id as keyof typeof templateConfigs]

  if (!config) {
    return <div>Template not found</div>
  }

  const handleInputChange = (key: string, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }))
  }

  const handleSubmit = () => {
    // Store form data in localStorage for the editor
    localStorage.setItem(
      "templateData",
      JSON.stringify({
        templateId: params.id,
        templateTitle: config.title,
        formData,
      }),
    )
    router.push("/editor")
  }

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center space-x-4">
        <Link href="/templates">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Templates
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            {config.title}
          </CardTitle>
          <CardDescription>Fill in the required information to generate your document</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            {config.fields.map((field) => (
              <div key={field.key} className={field.type === "textarea" ? "md:col-span-2" : ""}>
                <Label htmlFor={field.key}>
                  {t(field.label)} {field.required && <span className="text-red-500">*</span>}
                </Label>
                {field.type === "textarea" ? (
                  <Textarea
                    id={field.key}
                    placeholder={`Enter ${t(field.label).toLowerCase()}...`}
                    value={formData[field.key] || ""}
                    onChange={(e) => handleInputChange(field.key, e.target.value)}
                    className="mt-1"
                    rows={4}
                  />
                ) : (
                  <Input
                    id={field.key}
                    type={field.type}
                    placeholder={`Enter ${t(field.label).toLowerCase()}...`}
                    value={formData[field.key] || ""}
                    onChange={(e) => handleInputChange(field.key, e.target.value)}
                    className="mt-1"
                  />
                )}
              </div>
            ))}
          </div>

          <div className="flex justify-end space-x-4">
            <Link href="/templates">
              <Button variant="outline">{t("common.cancel")}</Button>
            </Link>
            <Button onClick={handleSubmit}>Generate Document</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default function TemplateForm({ params }: { params: { id: string } }) {
  return (
    <LanguageProvider>
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex">
          <Sidebar />
          <TemplateFormContent params={params} />
        </div>
      </div>
    </LanguageProvider>
  )
}
