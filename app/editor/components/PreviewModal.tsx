"use client"

import { Button } from "@/components/ui/button"
import { Printer } from "lucide-react"
import { useEditorContext } from "../lib/context"

export function PreviewModal() {
  const {
    showPreview,
    setShowPreview,
    documentTitle,
    currentFont,
    currentFontSize,
    editor,
    handlePrint,
  } = useEditorContext()

  if (!showPreview) {
    return null
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b">
          <div>
            <h3 className="text-lg font-semibold">Document Preview</h3>
            <p className="text-sm text-muted-foreground">{documentTitle}</p>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" onClick={handlePrint} className="h-9">
              <Printer className="h-4 w-4 mr-2" />
              Print
            </Button>
            <Button variant="outline" onClick={() => setShowPreview(false)} className="h-9">
              ✕
            </Button>
          </div>
        </div>
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)] bg-white dark:bg-gray-800">
          <div 
            className="prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto max-w-none"
            style={{ 
              fontFamily: currentFont, 
              fontSize: `${currentFontSize}px`,
              color: '#000',
              backgroundColor: '#fff',
              padding: '40px',
              minHeight: '600px',
              boxShadow: '0 0 20px rgba(0,0,0,0.1)',
              borderRadius: '8px'
            }}
            dangerouslySetInnerHTML={{ __html: editor?.getHTML() || '' }}
          />
        </div>
      </div>
    </div>
  )
}
