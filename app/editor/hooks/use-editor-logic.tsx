"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { useEditor } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import UnderlineExtension from "@tiptap/extension-underline"
import TextAlign from "@tiptap/extension-text-align"
import Placeholder from "@tiptap/extension-placeholder"
import { useLanguage } from "@/lib/language-context"

export function useEditorLogic() {
  const { language } = useLanguage()
  const [templateData, setTemplateData] = useState<any>(null)
  const [selectedText, setSelectedText] = useState("")
  const [documentTitle, setDocumentTitle] = useState("Untitled Document")
  const [validationIssues, setValidationIssues] = useState<string[]>([])
  const [documentId, setDocumentId] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [replaceTerm, setReplaceTerm] = useState("")
  const [showSearch, setShowSearch] = useState(false)
  const [currentFont, setCurrentFont] = useState("Inter")
  const [currentFontSize, setCurrentFontSize] = useState("16")
  const [versionHistory, setVersionHistory] = useState<any[]>([])
  const [showVersionHistory, setShowVersionHistory] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  const autoSaveTimeoutRef = useRef<NodeJS.Timeout>()

  const validateDocument = useCallback((text: string) => {
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
  }, [])

  const loadVersionHistory = useCallback((docId: string) => {
    const historyKey = `document_history_${docId}`
    const savedHistory = localStorage.getItem(historyKey)
    if (savedHistory) {
      setVersionHistory(JSON.parse(savedHistory))
    }
  }, [])

  const saveVersion = useCallback((htmlContent: string, textContent: string, type: 'manual' | 'auto-save' = 'manual') => {
    if (!documentId || !htmlContent.trim()) return

    const newVersion = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      content: htmlContent,
      plainText: textContent,
      title: documentTitle,
      wordCount: textContent.split(/\s+/).filter(w => w.length > 0).length,
      type: type,
      description: type === 'auto-save' ? 'Auto-saved' : 'Manual save'
    }

    const historyKey = `document_history_${documentId}`
    const currentHistory = JSON.parse(localStorage.getItem(historyKey) || '[]')
    
    const updatedHistory = [newVersion, ...currentHistory].slice(0, 20)
    
    localStorage.setItem(historyKey, JSON.stringify(updatedHistory))
    setVersionHistory(updatedHistory)
  }, [documentId, documentTitle])

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bulletList: {
          keepMarks: true,
          keepAttributes: false,
          HTMLAttributes: {
            class: 'my-bullet-list',
          },
        },
        orderedList: {
          keepMarks: true,
          keepAttributes: false,
          HTMLAttributes: {
            class: 'my-ordered-list',
          },
        },
      }),
      UnderlineExtension,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Placeholder.configure({
        placeholder: 'Start typing your legal document here...', 
      }),
    ],
    content: '',
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: 'min-h-[600px] text-base leading-relaxed focus:outline-none prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto p-6',
        style: `font-family: ${currentFont}; font-size: ${currentFontSize}px;`,
      },
    },
    onUpdate: ({ editor }) => {
      const content = editor.getHTML()
      validateDocument(editor.getText())
      
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current)
      }
      autoSaveTimeoutRef.current = setTimeout(() => {
        saveVersion(content, editor.getText(), 'auto-save')
      }, 3000)
    },
    onSelectionUpdate: ({ editor }) => {
      const { from, to } = editor.state.selection
      if (from !== to) {
        const selectedText = editor.state.doc.textBetween(from, to)
        setSelectedText(selectedText)
      } else {
        setSelectedText("")
      }
    },
  })

  useEffect(() => {
    const newDocId = Date.now().toString()
    setDocumentId(newDocId)
    loadVersionHistory(newDocId)

    const saved = localStorage.getItem("templateData")
    if (saved) {
      const data = JSON.parse(saved)
      setTemplateData(data)
      setDocumentTitle(data.templateTitle)
      generateInitialContent(data)
      localStorage.removeItem("templateData")
    }

    return () => {
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current)
      }
    }
  }, []) // Removed circular dependencies

  const generateInitialContent = useCallback((data: any) => {
    const { formData } = data

    let generatedContent = `<h1>${formData.title}</h1>`
    generatedContent += `<p><strong>Date:</strong> ${formData.date}</p>`
    generatedContent += `<p><strong>Location:</strong> ${formData.location}</p>`
    generatedContent += `<p><strong>Complainant:</strong> ${formData.complainant}</p>`
    generatedContent += `<h2>INCIDENT DETAILS:</h2>`
    generatedContent += `<p>${formData.details}</p>`
    generatedContent += `<p>This document has been prepared in accordance with applicable legal procedures and requirements.</p>`
    generatedContent += `<p><strong>Prepared by:</strong> _________________</p>`
    generatedContent += `<p><strong>Signature:</strong> _________________</p>`
    generatedContent += `<p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>`

    if (language === "ta") {
      generatedContent = generatedContent
        .replace("Date:", "தேতি (Date):")
        .replace("Location:", "இடம் (Location):")
        .replace("Complainant:", "புகார்தாரர் (Complainant):")
        .replace("INCIDENT DETAILS:", "சம்பவ விவரங்கள் (INCIDENT DETAILS):")
    }

    if (editor) {
      editor.commands.setContent(generatedContent)
      validateDocument(editor.getText())
    }
  }, [language, editor, validateDocument])

  // Separate useEffect for handling template data changes
  useEffect(() => {
    if (templateData && editor) {
      generateInitialContent(templateData)
    }
  }, [templateData, editor, generateInitialContent])

  useEffect(() => {
    if (editor) {
      const editorElement = editor.view.dom
      editorElement.style.fontFamily = currentFont
      editorElement.style.fontSize = `${currentFontSize}px`
    }
  }, [currentFont, currentFontSize, editor])

  const restoreVersion = useCallback((version: any) => {
    if (!editor) return

    editor.commands.setContent(version.content)
    setDocumentTitle(version.title)
    
    saveVersion(editor.getHTML(), editor.getText(), 'manual')
    
    alert(`Restored version from ${new Date(version.timestamp).toLocaleString()}`)
    setShowVersionHistory(false)
  }, [editor, saveVersion])

  const deleteVersion = useCallback((versionId: string) => {
    const historyKey = `document_history_${documentId}`
    const currentHistory = JSON.parse(localStorage.getItem(historyKey) || '[]')
    const updatedHistory = currentHistory.filter((v: any) => v.id !== versionId)
    
    localStorage.setItem(historyKey, JSON.stringify(updatedHistory))
    setVersionHistory(updatedHistory)
  }, [documentId])

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / (1000 * 60))
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    if (diffDays < 7) return `${diffDays}d ago`
    return date.toLocaleDateString()
  }

  const formatText = useCallback((format: string) => {
    if (!editor) return

    switch (format) {
      case "bold":
        editor.chain().focus().toggleBold().run()
        break
      case "italic":
        editor.chain().focus().toggleItalic().run()
        break
      case "underline":
        editor.chain().focus().toggleUnderline().run()
        break
      case "quote":
        editor.chain().focus().toggleBlockquote().run()
        break
      case "list":
        editor.chain().focus().toggleBulletList().run()
        break
      case "numbered":
        editor.chain().focus().toggleOrderedList().run()
        break
      case "undo":
        editor.chain().focus().undo().run()
        break
      case "redo":
        editor.chain().focus().redo().run()
        break
      case "align-left":
        editor.chain().focus().setTextAlign('left').run()
        break
      case "align-center":
        editor.chain().focus().setTextAlign('center').run()
        break
      case "align-right":
        editor.chain().focus().setTextAlign('right').run()
        break
      case "align-justify":
        editor.chain().focus().setTextAlign('justify').run()
        break
    }
  }, [editor])

  const handleSearch = useCallback(() => {
    if (!searchTerm || !editor) return
    const content = editor.getText().toLowerCase()
    const index = content.indexOf(searchTerm.toLowerCase())
    
    if (index !== -1) {
      editor.commands.focus()
    }
  }, [editor, searchTerm])

  const handleReplace = useCallback(() => {
    if (!searchTerm || !editor) return

    const content = editor.getHTML()
    const newContent = content.replace(new RegExp(searchTerm, "gi"), replaceTerm)
    editor.commands.setContent(newContent)
    validateDocument(editor.getText())
  }, [editor, searchTerm, replaceTerm, validateDocument])

  const handleAIChange = useCallback((newText: string) => {
    if (!editor) return

    if (selectedText) {
      editor.chain().focus().deleteSelection().insertContent(newText).run()
    } else {
      editor.chain().focus().insertContent(newText).run()
    }
    setSelectedText("")
  }, [editor, selectedText, setSelectedText])

  const handleSave = useCallback(() => {
    if (!editor) return

    const savedDocs = JSON.parse(localStorage.getItem("savedDocuments") || "[]")
    const newDoc = {
      id: documentId,
      title: documentTitle,
      content: editor.getHTML(),
      plainText: editor.getText(),
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
    
    saveVersion(editor.getHTML(), editor.getText(), 'manual')
    
    alert("Document saved successfully!")
  }, [editor, documentId, documentTitle, templateData, saveVersion])

  const generateSummary = useCallback(() => {
    if (!editor) return

    const text = editor.getText()
    const sentences = text.split(".").filter((s) => s.trim().length > 0)
    const summary = sentences.slice(0, 3).join(". ") + "."
    alert(`Document Summary:\n\n${summary}`)
  }, [editor])

  const handleTextToSpeech = useCallback(() => {
    if (!editor) return

    if ("speechSynthesis" in window) {
      const textToSpeak = selectedText || editor.getText()
      const utterance = new SpeechSynthesisUtterance(textToSpeak)
      utterance.lang = language === "ta" ? "ta-IN" : "en-US"
      speechSynthesis.speak(utterance)
    } else {
      alert("Text-to-speech is not supported in your browser")
    }
  }, [editor, selectedText, language])

  const exportDocument = (format: string) => {
    if (format === "pdf") {
      alert("PDF export functionality would be implemented here")
    } else if (format === "docx") {
      alert("Word document export functionality would be implemented here")
    }
  }

  const handlePreview = useCallback(() => {
    setShowPreview(true)
  }, [setShowPreview])

  const handlePrint = useCallback(() => {
    if (!editor) return

    const printWindow = window.open('', '_blank')
    if (printWindow) {
      const content = editor.getHTML()
      const printContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>${documentTitle}</title>
          <style>
            body { 
              font-family: ${currentFont}, Arial, sans-serif; 
              font-size: ${currentFontSize}px; 
              line-height: 1.6; 
              max-width: 800px; 
              margin: 0 auto; 
              padding: 20px;
              color: #000;
              background: #fff;
            }
            h1 { font-size: 2rem; font-weight: bold; margin: 1rem 0; }
            h2 { font-size: 1.5rem; font-weight: bold; margin: 0.75rem 0; }
            h3 { font-size: 1.25rem; font-weight: bold; margin: 0.5rem 0; }
            p { margin: 0.5rem 0; }
            ul, ol { padding-left: 1.5rem; margin: 1rem 0; }
            li { margin: 0.25rem 0; }
            blockquote { 
              border-left: 44px solid #e2e8f0; 
              margin: 1rem 0; 
              padding-left: 1rem; 
              color: #666;
            }
            strong { font-weight: bold; }
            em { font-style: italic; }
            u { text-decoration: underline; }
            @media print {
              body { margin: 0; padding: 15px; }
            }
          </style>
        </head>
        <body>
          ${content}
        </body>
        </html>
      `
      printWindow.document.write(printContent)
      printWindow.document.close()
      printWindow.print()
    }
  }, [editor, documentTitle, currentFont, currentFontSize])

  const getWordCount = useCallback(() => {
    if (!editor) return 0
    return editor.getText().split(/\s+/).filter((w) => w.length > 0).length
  }, [editor])

  const getCharCount = useCallback(() => {
    if (!editor) return 0
    return editor.getText().length
  }, [editor])

  const getParagraphCount = useCallback(() => {
    if (!editor) return 0
    return editor.getText().split("\n\n").filter((p) => p.trim().length > 0).length
  }, [editor])

  return {
    editor,
    templateData,
    selectedText,
    documentTitle,
    setDocumentTitle,
    validationIssues,
    documentId,
    searchTerm,
    setSearchTerm,
    replaceTerm,
    setReplaceTerm,
    showSearch,
    setShowSearch,
    currentFont,
    setCurrentFont,
    currentFontSize,
    setCurrentFontSize,
    versionHistory,
    showVersionHistory,
    setShowVersionHistory,
    showPreview,
    setShowPreview,
    loadVersionHistory,
    saveVersion,
    restoreVersion,
    deleteVersion,
    formatTimestamp,
    generateInitialContent,
    validateDocument,
    formatText,
    handleSearch,
    handleReplace,
    handleAIChange,
    handleSave,
    generateSummary,
    handleTextToSpeech,
    exportDocument,
    handlePreview,
    handlePrint,
    getWordCount,
    getCharCount,
    getParagraphCount,
    setSelectedText
  }
}