"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { FileText, Download, Printer, Mail } from "lucide-react"
import { useLanguage } from "@/lib/language-context"
import { exportDocument } from "@/lib/export-utils"

interface ExportManagerProps {
  content: string
  title: string
}

export function ExportManager({ content, title }: ExportManagerProps) {
  const { t } = useLanguage()
  const [exportFormat, setExportFormat] = useState("pdf")
  const [includeHeader, setIncludeHeader] = useState(true)
  const [includeFooter, setIncludeFooter] = useState(true)
  const [includeTimestamp, setIncludeTimestamp] = useState(true)

  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Download className="h-4 w-4" />
          Export & Share
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="format">Export Format</Label>
          <Select value={exportFormat} onValueChange={setExportFormat}>
            <SelectTrigger>
              <SelectValue placeholder="Select format" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pdf">PDF Document</SelectItem>
              <SelectItem value="docx">Word Document</SelectItem>
              <SelectItem value="txt">Plain Text</SelectItem>
              <SelectItem value="html">HTML Document</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-3">
          <Label>Export Options</Label>
          <div className="flex items-center space-x-2">
            <Checkbox id="header" checked={includeHeader} onCheckedChange={(checked) => setIncludeHeader(checked === true)} />
            <Label htmlFor="header" className="text-sm">
              Include document header
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="footer" checked={includeFooter} onCheckedChange={(checked) => setIncludeFooter(checked === true)} />
            <Label htmlFor="footer" className="text-sm">
              Include footer with branding
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="timestamp" checked={includeTimestamp} onCheckedChange={(checked) => setIncludeTimestamp(checked === true)} />
            <Label htmlFor="timestamp" className="text-sm">
              Include generation timestamp
            </Label>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-2">
          <Button variant="outline" size="sm" onClick={() => exportDocument(exportFormat, content, title, { includeHeader, includeFooter, includeTimestamp })} className="justify-start">
            <FileText className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}