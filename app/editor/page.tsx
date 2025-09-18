"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { useLanguage } from "@/lib/language-context"
import { Navbar } from "@/components/navbar"
import { Sidebar } from "@/components/sidebar"
import { LanguageProvider } from "@/lib/language-context"
import { AIWritingTools } from "@/components/ai-writing-tools"
import {
  Save,
  Lightbulb,
  Volume2,
  FileText,
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  Quote,
  Search,
  Replace,
  Download,
  History,
  CheckCircle,
  AlertCircle,
} from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

function EditorContent() {
  const { t, language } = useLanguage()
  const [content, setContent] = useState("")
  const [templateData, setTemplateData] = useState<any>(null)
  const [selectedText, setSelectedText] = useState("")
  const [documentTitle, setDocumentTitle] = useState("Untitled Document")
  const [validationIssues, setValidationIssues] = useState<string[]>([])
  const [documentId, setDocumentId] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [replaceTerm, setReplaceTerm] = useState("")
  const [showSearch, setShowSearch] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    setDocumentId(Date.now().toString())

    const saved = localStorage.getItem("templateData")
    if (saved) {
      const data = JSON.parse(saved)
      setTemplateData(data)
      setDocumentTitle(data.templateTitle)
      generateInitialContent(data)
      localStorage.removeItem("templateData")
    }
  }, [])

  const generateInitialContent = (data: any) => {
    const { formData } = data

    let generatedContent = `${formData.title}\n\n`
    generatedContent += `Date: ${formData.date}\n`
    generatedContent += `Location: ${formData.location}\n`
    generatedContent += `Complainant: ${formData.complainant}\n\n`
    generatedContent += `INCIDENT DETAILS:\n\n${formData.details}\n\n`
    generatedContent += `This document has been prepared in accordance with applicable legal procedures and requirements.\n\n`
    generatedContent += `Prepared by: _________________\n`
    generatedContent += `Signature: _________________\n`
    generatedContent += `Date: ${new Date().toLocaleDateString()}`

    if (language === "ta") {
      generatedContent = generatedContent
        .replace("Date:", "தேதி (Date):")
        .replace("Location:", "இடம் (Location):")
        .replace("Complainant:", "புகார்தாரர் (Complainant):")
        .replace("INCIDENT DETAILS:", "சம்பவ விவரங்கள் (INCIDENT DETAILS):")
    }

    setContent(generatedContent)
    validateDocument(generatedContent)
  }

  const validateDocument = (text: string) => {
    const issues = []
    if (text.includes("[") && text.includes("]")) {
      issues.push("Document contains placeholder fields that need to be filled")
    }
    if (text.length < 100) {
      issues.push("Document appears to be too short")
    }
    if (!text.includes("Date:") && !text.includes("தேதி")) {
      issues.push("Document is missing date information")
    }
    setValidationIssues(issues)
  }

  const handleTextSelection = () => {
    const selection = window.getSelection()
    if (selection && selection.toString().trim()) {
      const selectedText = selection.toString()
      setSelectedText(selectedText)
    } else {
      setSelectedText("")
    }
  }

  const formatText = (format: string) => {
    if (!textareaRef.current) return

    const textarea = textareaRef.current
    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selectedText = content.substring(start, end)

    let formattedText = selectedText

    switch (format) {
      case "bold":
        formattedText = `**${selectedText}**`
        break
      case "italic":
        formattedText = `*${selectedText}*`
        break
      case "underline":
        formattedText = `<u>${selectedText}</u>`
        break
      case "quote":
        formattedText = `> ${selectedText}`
        break
      case "list":
        formattedText = selectedText
          .split("\n")
          .map((line) => `• ${line}`)
          .join("\n")
        break
      case "numbered":
        formattedText = selectedText
          .split("\n")
          .map((line, i) => `${i + 1}. ${line}`)
          .join("\n")
        break
    }

    const newContent = content.substring(0, start) + formattedText + content.substring(end)
    setContent(newContent)
    validateDocument(newContent)
  }

  const handleSearch = () => {
    if (!searchTerm || !textareaRef.current) return

    const textarea = textareaRef.current
    const text = textarea.value.toLowerCase()
    const searchIndex = text.indexOf(searchTerm.toLowerCase())

    if (searchIndex !== -1) {
      textarea.focus()
      textarea.setSelectionRange(searchIndex, searchIndex + searchTerm.length)
    }
  }

  const handleReplace = () => {
    if (!searchTerm || !textareaRef.current) return

    const newContent = content.replace(new RegExp(searchTerm, "gi"), replaceTerm)
    setContent(newContent)
    validateDocument(newContent)
  }

  const handleAIChange = (newText: string) => {
    if (!textareaRef.current) return

    const textarea = textareaRef.current
    const start = textarea.selectionStart
    const end = textarea.selectionEnd

    const newContent = content.substring(0, start) + newText + content.substring(end)
    setContent(newContent)
    validateDocument(newContent)
    setSelectedText("")
  }

  const handleSave = () => {
    const savedDocs = JSON.parse(localStorage.getItem("savedDocuments") || "[]")
    const newDoc = {
      id: documentId,
      title: documentTitle,
      content,
      created: new Date().toISOString(),
      modified: new Date().toISOString(),
      type: templateData?.templateId || "general",
    }

    const existingIndex = savedDocs.findIndex((doc: any) => doc.id === documentId)
    if (existingIndex >= 0) {
      savedDocs[existingIndex] = { ...savedDocs[existingIndex], ...newDoc }
    } else {
      savedDocs.push(newDoc)
    }

    localStorage.setItem("savedDocuments", JSON.stringify(savedDocs))
    alert("Document saved successfully!")
  }

  const generateSummary = () => {
    const sentences = content.split(".").filter((s) => s.trim().length > 0)
    const summary = sentences.slice(0, 3).join(". ") + "."
    alert(`Document Summary:\n\n${summary}`)
  }

  const handleTextToSpeech = () => {
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(selectedText || content)
      utterance.lang = language === "ta" ? "ta-IN" : "en-US"
      speechSynthesis.speak(utterance)
    } else {
      alert("Text-to-speech is not supported in your browser")
    }
  }

  const exportDocument = (format: string) => {
    if (format === "pdf") {
      // Simulate PDF export
      alert("PDF export functionality would be implemented here")
    } else if (format === "docx") {
      // Simulate DOCX export
      alert("Word document export functionality would be implemented here")
    }
  }

  return (
    <TooltipProvider>
      <div className="flex-1 p-8 pt-6 relative">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              Document Editor
            </h2>
            <p className="text-muted-foreground text-lg mt-2">Professional legal document editing with AI assistance</p>
          </div>
          <div className="flex items-center space-x-3">
            <Button variant="outline" onClick={() => setShowSearch(!showSearch)} className="shadow-sm">
              <Search className="h-4 w-4 mr-2" />
              Search
            </Button>
            <Button variant="outline" onClick={generateSummary} className="shadow-sm bg-transparent">
              <Lightbulb className="h-4 w-4 mr-2" />
              Summarize
            </Button>
            <Button onClick={handleSave} className="bg-primary hover:bg-primary/90 shadow-sm">
              <Save className="h-4 w-4 mr-2" />
              Save Document
            </Button>
          </div>
        </div>

        {showSearch && (
          <Card className="mb-6 shadow-sm border-0 bg-card/50 backdrop-blur-sm">
            <CardContent className="pt-6">
              <div className="flex items-center space-x-3">
                <Input
                  placeholder="Search in document..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="flex-1 h-11"
                />
                <Input
                  placeholder="Replace with..."
                  value={replaceTerm}
                  onChange={(e) => setReplaceTerm(e.target.value)}
                  className="flex-1 h-11"
                />
                <Button onClick={handleSearch} variant="outline" className="h-11 bg-transparent">
                  <Search className="h-4 w-4" />
                </Button>
                <Button onClick={handleReplace} variant="outline" className="h-11 bg-transparent">
                  <Replace className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {validationIssues.length > 0 && (
          <Alert className="mb-6 border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950">
            <AlertCircle className="h-4 w-4 text-amber-600" />
            <AlertDescription>
              <strong className="text-amber-800 dark:text-amber-200">Validation Issues:</strong>
              <ul className="mt-2 list-disc list-inside text-amber-700 dark:text-amber-300">
                {validationIssues.map((issue, index) => (
                  <li key={index}>{issue}</li>
                ))}
              </ul>
            </AlertDescription>
          </Alert>
        )}

        <div className="grid gap-6 lg:grid-cols-4">
          <div className="lg:col-span-3">
            <Card className="shadow-lg border-0 bg-card/50 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <Input
                    value={documentTitle}
                    onChange={(e) => setDocumentTitle(e.target.value)}
                    className="text-xl font-semibold border-none p-0 h-auto bg-transparent focus-visible:ring-0"
                  />
                  <div className="flex items-center space-x-3">
                    <Badge variant="outline" className="bg-background/50">
                      {content.split(/\s+/).filter((w) => w.length > 0).length} words
                    </Badge>
                    <Badge variant={validationIssues.length === 0 ? "default" : "destructive"}>
                      {validationIssues.length === 0 ? (
                        <>
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Valid
                        </>
                      ) : (
                        <>
                          <AlertCircle className="h-3 w-3 mr-1" />
                          Issues
                        </>
                      )}
                    </Badge>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t bg-muted/30 -mx-6 px-6 py-3 rounded-t-lg">
                  <div className="flex items-center space-x-1">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="sm" onClick={() => formatText("bold")} className="h-8 w-8 p-0">
                          <Bold className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Bold</TooltipContent>
                    </Tooltip>

                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="sm" onClick={() => formatText("italic")} className="h-8 w-8 p-0">
                          <Italic className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Italic</TooltipContent>
                    </Tooltip>

                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => formatText("underline")}
                          className="h-8 w-8 p-0"
                        >
                          <Underline className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Underline</TooltipContent>
                    </Tooltip>

                    <Separator orientation="vertical" className="h-6 mx-2" />

                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="sm" onClick={() => formatText("list")} className="h-8 w-8 p-0">
                          <List className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Bullet List</TooltipContent>
                    </Tooltip>

                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => formatText("numbered")}
                          className="h-8 w-8 p-0"
                        >
                          <ListOrdered className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Numbered List</TooltipContent>
                    </Tooltip>

                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="sm" onClick={() => formatText("quote")} className="h-8 w-8 p-0">
                          <Quote className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Quote</TooltipContent>
                    </Tooltip>

                    <Separator orientation="vertical" className="h-6 mx-2" />

                    <Button variant="ghost" size="sm" onClick={handleTextToSpeech} className="h-8 px-3">
                      <Volume2 className="h-4 w-4 mr-1" />
                      <span className="text-xs">Read</span>
                    </Button>
                  </div>

                  <div className="flex items-center">
                    <AIWritingTools
                      selectedText={selectedText}
                      onApplyChange={handleAIChange}
                      onClose={() => setSelectedText("")}
                      disabled={!selectedText.trim()}
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="px-6 py-2 border-b bg-background/50">
                  <AIWritingTools
                    selectedText={selectedText}
                    onApplyChange={handleAIChange}
                    onClose={() => setSelectedText("")}
                    disabled={!selectedText.trim()}
                  />
                </div>
                <Textarea
                  ref={textareaRef}
                  value={content}
                  onChange={(e) => {
                    setContent(e.target.value)
                    validateDocument(e.target.value)
                  }}
                  onMouseUp={handleTextSelection}
                  onKeyUp={handleTextSelection}
                  className="min-h-[600px] text-base leading-relaxed resize-none border-0 focus-visible:ring-0 bg-transparent p-6"
                  placeholder="Start typing your legal document here..."
                />
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="shadow-lg border-0 bg-card/50 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg flex items-center">
                  <FileText className="mr-2 h-5 w-5 text-primary" />
                  Document Stats
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="text-center p-3 bg-primary/5 rounded-lg border border-primary/10">
                    <div className="text-2xl font-bold text-primary">
                      {content.split(/\s+/).filter((w) => w.length > 0).length}
                    </div>
                    <div className="text-xs text-muted-foreground">Words</div>
                  </div>
                  <div className="text-center p-3 bg-primary/5 rounded-lg border border-primary/10">
                    <div className="text-2xl font-bold text-primary">{content.length}</div>
                    <div className="text-xs text-muted-foreground">Characters</div>
                  </div>
                  <div className="text-center p-3 bg-primary/5 rounded-lg border border-primary/10">
                    <div className="text-2xl font-bold text-primary">
                      {content.split("\n\n").filter((p) => p.trim().length > 0).length}
                    </div>
                    <div className="text-xs text-muted-foreground">Paragraphs</div>
                  </div>
                  <div className="text-center p-3 bg-primary/5 rounded-lg border border-primary/10">
                    <div className="text-2xl font-bold text-primary">
                      {Math.ceil(content.split(/\s+/).length / 200)}
                    </div>
                    <div className="text-xs text-muted-foreground">Min Read</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-lg border-0 bg-card/50 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg flex items-center">
                  <Download className="mr-2 h-5 w-5 text-primary" />
                  Export Options
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  onClick={() => exportDocument("pdf")}
                  variant="outline"
                  className="w-full justify-start h-11 bg-transparent hover:bg-primary/5"
                >
                  <FileText className="mr-3 h-4 w-4 text-red-500" />
                  Export as PDF
                </Button>
                <Button
                  onClick={() => exportDocument("docx")}
                  variant="outline"
                  className="w-full justify-start h-11 bg-transparent hover:bg-primary/5"
                >
                  <FileText className="mr-3 h-4 w-4 text-blue-500" />
                  Export as Word
                </Button>
              </CardContent>
            </Card>

            <Card className="shadow-lg border-0 bg-card/50 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg flex items-center">
                  <History className="mr-2 h-5 w-5 text-primary" />
                  Version History
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground text-center py-4">Auto-save enabled</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </TooltipProvider>
  )
}

export default function Editor() {
  return (
    <LanguageProvider>
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/10">
        <Navbar />
        <div className="flex">
          <Sidebar />
          <EditorContent />
        </div>
      </div>
    </LanguageProvider>
  )
}
