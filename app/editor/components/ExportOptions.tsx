"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download, FileText } from "lucide-react"
import { useEditorContext } from "../lib/context"
import { ExportManager } from "@/components/export-manager"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

export function ExportOptions() {
  const { editor, documentTitle } = useEditorContext()
  const [showExportManager, setShowExportManager] = useState(false)

  return (
    <Card className="shadow-lg border-0 bg-card/50 backdrop-blur-sm">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg flex items-center">
          <Download className="mr-2 h-5 w-5 text-primary" />
          Export Options
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <Dialog open={showExportManager} onOpenChange={setShowExportManager}>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              className="w-full justify-start h-11 bg-transparent hover:bg-primary/5"
            >
              <FileText className="mr-3 h-4 w-4 text-red-500" />
              Export Document
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Export Document</DialogTitle>
            </DialogHeader>
            {editor && (
              <ExportManager content={editor.getHTML()} title={documentTitle} />
            )}
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  )
}
