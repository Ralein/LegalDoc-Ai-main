"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useLanguage } from "@/lib/language-context"
import { Navbar } from "@/components/navbar"
import { Sidebar } from "@/components/sidebar"
import { LanguageProvider } from "@/lib/language-context"
import { useRouter } from "next/navigation"
import { FileText, AlertTriangle, CheckCircle2, Calendar, MapPin, User, FileEdit } from "lucide-react"

function CreateDocumentContent() {
  const { t } = useLanguage()
  const router = useRouter()
  const [formData, setFormData] = useState({
    title: "",
    complainant: "",
    date: "",
    location: "",
    details: "",
  })
  const [validationErrors, setValidationErrors] = useState<string[]>([])

  const validateForm = () => {
    const errors = []
    if (!formData.title.trim()) errors.push("Document title is required")
    if (!formData.complainant.trim()) errors.push("Complainant name is required")
    if (!formData.date) errors.push("Date is required")
    if (!formData.location.trim()) errors.push("Location is required")
    if (!formData.details.trim()) errors.push("Incident details are required")

    setValidationErrors(errors)
    return errors.length === 0
  }

  const handleSubmit = () => {
    if (!validateForm()) return

    // Store form data for the editor
    const templateData = {
      templateId: "general",
      templateTitle: formData.title,
      formData,
    }

    localStorage.setItem("templateData", JSON.stringify(templateData))
    router.push("/editor")
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    // Clear validation errors when user starts typing
    if (validationErrors.length > 0) {
      setValidationErrors([])
    }
  }

  return (
    <div className="flex-1 p-8 pt-6">
      <div className="max-w-2xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            Create New Document
          </h1>
          <p className="text-muted-foreground text-lg">
            Fill in the details below to generate a structured legal document
          </p>
        </div>

        {validationErrors.length > 0 && (
          <Alert className="border-destructive/50 bg-destructive/5">
            <AlertTriangle className="h-4 w-4 text-destructive" />
            <AlertDescription>
              <div className="font-medium text-destructive mb-2">Please fix the following issues:</div>
              <ul className="list-disc list-inside space-y-1">
                {validationErrors.map((error, index) => (
                  <li key={index} className="text-sm text-destructive">
                    {error}
                  </li>
                ))}
              </ul>
            </AlertDescription>
          </Alert>
        )}

        <Card className="shadow-lg border-0 bg-card/50 backdrop-blur-sm">
          <CardHeader className="pb-6">
            <CardTitle className="flex items-center text-xl">
              <FileText className="mr-3 h-6 w-6 text-primary" />
              Document Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title" className="text-sm font-medium flex items-center">
                <FileEdit className="mr-2 h-4 w-4" />
                Document Title
              </Label>
              <Input
                id="title"
                placeholder="e.g., First Information Report - Theft Case"
                value={formData.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
                className="h-12 text-base"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="complainant" className="text-sm font-medium flex items-center">
                <User className="mr-2 h-4 w-4" />
                Complainant Name
              </Label>
              <Input
                id="complainant"
                placeholder="Full name of the complainant"
                value={formData.complainant}
                onChange={(e) => handleInputChange("complainant", e.target.value)}
                className="h-12 text-base"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date" className="text-sm font-medium flex items-center">
                  <Calendar className="mr-2 h-4 w-4" />
                  Date
                </Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => handleInputChange("date", e.target.value)}
                  className="h-12 text-base"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="location" className="text-sm font-medium flex items-center">
                  <MapPin className="mr-2 h-4 w-4" />
                  Location
                </Label>
                <Input
                  id="location"
                  placeholder="City, State"
                  value={formData.location}
                  onChange={(e) => handleInputChange("location", e.target.value)}
                  className="h-12 text-base"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="details" className="text-sm font-medium">
                Incident Details
              </Label>
              <Textarea
                id="details"
                placeholder="Provide detailed description of the incident, including time, circumstances, and any relevant information..."
                value={formData.details}
                onChange={(e) => handleInputChange("details", e.target.value)}
                className="min-h-[120px] text-base resize-none"
              />
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <div className="bg-accent/30 rounded-lg p-4">
            <h3 className="font-medium mb-3 flex items-center">
              <CheckCircle2 className="mr-2 h-5 w-5 text-primary" />
              Validation Checklist
            </h3>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className={`flex items-center ${formData.title ? "text-green-600" : "text-muted-foreground"}`}>
                <div
                  className={`w-2 h-2 rounded-full mr-2 ${formData.title ? "bg-green-500" : "bg-muted-foreground/30"}`}
                />
                Document title
              </div>
              <div className={`flex items-center ${formData.complainant ? "text-green-600" : "text-muted-foreground"}`}>
                <div
                  className={`w-2 h-2 rounded-full mr-2 ${formData.complainant ? "bg-green-500" : "bg-muted-foreground/30"}`}
                />
                Complainant name
              </div>
              <div className={`flex items-center ${formData.date ? "text-green-600" : "text-muted-foreground"}`}>
                <div
                  className={`w-2 h-2 rounded-full mr-2 ${formData.date ? "bg-green-500" : "bg-muted-foreground/30"}`}
                />
                Date specified
              </div>
              <div className={`flex items-center ${formData.location ? "text-green-600" : "text-muted-foreground"}`}>
                <div
                  className={`w-2 h-2 rounded-full mr-2 ${formData.location ? "bg-green-500" : "bg-muted-foreground/30"}`}
                />
                Location provided
              </div>
              <div
                className={`flex items-center ${formData.details ? "text-green-600" : "text-muted-foreground"} col-span-2`}
              >
                <div
                  className={`w-2 h-2 rounded-full mr-2 ${formData.details ? "bg-green-500" : "bg-muted-foreground/30"}`}
                />
                Incident details included
              </div>
            </div>
          </div>

          <div className="flex justify-center">
            <Button
              onClick={handleSubmit}
              size="lg"
              className="px-8 py-3 text-base font-medium bg-primary hover:bg-primary/90 shadow-lg"
            >
              Generate Document & Open Editor
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function CreateDocument() {
  return (
    <LanguageProvider>
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/20">
        <Navbar />
        <div className="flex">
          <Sidebar />
          <CreateDocumentContent />
        </div>
      </div>
    </LanguageProvider>
  )
}
