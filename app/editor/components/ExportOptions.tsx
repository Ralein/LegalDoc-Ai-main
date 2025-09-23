"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download, FileText } from "lucide-react"
import { useEditorContext } from "../lib/context"

export function ExportOptions() {
  const { exportDocument } = useEditorContext()

  return (
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
  )
}
