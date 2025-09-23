"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText } from "lucide-react"
import { useEditorContext } from "../lib/context"

export function DocumentStats() {
  const { getWordCount, getCharCount, getParagraphCount } = useEditorContext()

  return (
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
            <div className="text-2xl font-bold text-primary">{getWordCount()}</div>
            <div className="text-xs text-muted-foreground">Words</div>
          </div>
          <div className="text-center p-3 bg-primary/5 rounded-lg border border-primary/10">
            <div className="text-2xl font-bold text-primary">{getCharCount()}</div>
            <div className="text-xs text-muted-foreground">Characters</div>
          </div>
          <div className="text-center p-3 bg-primary/5 rounded-lg border border-primary/10">
            <div className="text-2xl font-bold text-primary">{getParagraphCount()}</div>
            <div className="text-xs text-muted-foreground">Paragraphs</div>
          </div>
          <div className="text-center p-3 bg-primary/5 rounded-lg border border-primary/10">
            <div className="text-2xl font-bold text-primary">
              {Math.ceil(getWordCount() / 200)}
            </div>
            <div className="text-xs text-muted-foreground">Min Read</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
