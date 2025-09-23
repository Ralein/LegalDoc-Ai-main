"use client"

import { Button } from "@/components/ui/button"
import { useEditorContext } from "../lib/context"
import { Save, Lightbulb, Search } from "lucide-react"

export function EditorHeader() {
  const {
    setShowSearch,
    showSearch,
    generateSummary,
    handleSave,
  } = useEditorContext()

  return (
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
  )
}
