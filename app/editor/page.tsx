"use client"

import { EditorContent as TipTapEditor } from '@tiptap/react'
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Navbar } from "@/components/navbar"
import { Sidebar } from "@/components/sidebar"
import { LanguageProvider } from "@/lib/language-context"
import { AIWritingTools } from "@/components/ai-writing-tools"
import { CheckCircle, AlertCircle } from "lucide-react"
import { TooltipProvider } from "@/components/ui/tooltip"
import { EditorProvider } from './lib/provider'
import { useEditorContext } from './lib/context'
import { EditorHeader } from './components/EditorHeader'
import { SearchBar } from './components/SearchBar'
import { ValidationIssues } from './components/ValidationIssues'
import { EditorToolbar } from './components/EditorToolbar'
import { TypographySettings } from './components/TypographySettings'
import { DocumentStats } from './components/DocumentStats'
import { VersionHistory } from './components/VersionHistory'
import { ExportOptions } from './components/ExportOptions'
import { PreviewModal } from './components/PreviewModal'

function EditorContent() {
  const {
    editor,
    documentTitle,
    setDocumentTitle,
    validationIssues,
    getWordCount,
    selectedText,
    handleAIChange,
    setSelectedText,
  } = useEditorContext()

  if (!editor) {
    return <div>Loading editor...</div>
  }

  return (
    <TooltipProvider>
      <div className="flex-1 p-8 pt-6 relative">
        <EditorHeader />
        <SearchBar />
        <ValidationIssues />

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
                      {getWordCount()} words
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
                <EditorToolbar />
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
                <div className="tiptap-editor-wrapper">
                  <TipTapEditor 
                    editor={editor} 
                    className="min-h-[600px] focus-within:outline-none"
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <TypographySettings />
            <DocumentStats />
            <VersionHistory />
            <ExportOptions />
          </div>
        </div>

        <PreviewModal />

        <style jsx global>{`
          .tiptap-editor-wrapper .ProseMirror {
            outline: none;
          }
          
          .tiptap-editor-wrapper .ProseMirror p.is-editor-empty:first-child::before {
            content: attr(data-placeholder);
            float: left;
            color: #adb5bd;
            pointer-events: none;
            height: 0;
          }
          
          .tiptap-editor-wrapper .ProseMirror blockquote {
            border-left: 4px solid #e2e8f0;
            margin: 1rem 0;
            padding-left: 1rem;
          }
          
          .tiptap-editor-wrapper .ProseMirror ul, .tiptap-editor-wrapper .ProseMirror ol {
            padding-left: 1.5rem;
            margin: 1rem 0;
          }
          
          .tiptap-editor-wrapper .ProseMirror ul li, .tiptap-editor-wrapper .ProseMirror ol li {
            margin: 0.25rem 0;
            list-style-position: outside;
          }
          
          .tiptap-editor-wrapper .ProseMirror ul li {
            list-style-type: disc;
          }
          
          .tiptap-editor-wrapper .ProseMirror ol li {
            list-style-type: decimal;
          }
          
          .tiptap-editor-wrapper .ProseMirror h1 {
            font-size: 2rem;
            font-weight: bold;
            margin: 1rem 0;
          }
          
          .tiptap-editor-wrapper .ProseMirror h2 {
            font-size: 1.5rem;
            font-weight: bold;
            margin: 0.75rem 0;
          }
          
          .tiptap-editor-wrapper .ProseMirror h3 {
            font-size: 1.25rem;
            font-weight: bold;
            margin: 0.5rem 0;
          }

          .line-clamp-2 {
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
          }
        `}</style>
      </div>
    </TooltipProvider>
  )
}

export default function Editor() {
  return (
    <LanguageProvider>
      <EditorProvider>
        <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/10">
          <Navbar />
          <div className="flex">
            <Sidebar />
            <EditorContent />
          </div>
        </div>
      </EditorProvider>
    </LanguageProvider>
  )
}
