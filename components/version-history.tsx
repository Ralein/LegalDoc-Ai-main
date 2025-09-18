"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { History, RotateCcw, Clock } from "lucide-react"
import { useLanguage } from "@/lib/language-context"

interface Version {
  id: string
  content: string
  timestamp: string
  changes: string
}

interface VersionHistoryProps {
  documentId: string
  currentContent: string
  onRestore: (content: string) => void
}

export function VersionHistory({ documentId, currentContent, onRestore }: VersionHistoryProps) {
  const { t } = useLanguage()
  const [versions, setVersions] = useState<Version[]>([])

  useEffect(() => {
    loadVersions()
  }, [documentId])

  const loadVersions = () => {
    const saved = localStorage.getItem(`versions_${documentId}`) || "[]"
    setVersions(JSON.parse(saved))
  }

  const saveVersion = (changes: string) => {
    const newVersion: Version = {
      id: Date.now().toString(),
      content: currentContent,
      timestamp: new Date().toISOString(),
      changes,
    }

    const updatedVersions = [newVersion, ...versions].slice(0, 10) // Keep only last 10 versions
    setVersions(updatedVersions)
    localStorage.setItem(`versions_${documentId}`, JSON.stringify(updatedVersions))
  }

  const handleRestore = (version: Version) => {
    if (confirm("Are you sure you want to restore this version? Current changes will be lost.")) {
      onRestore(version.content)
      saveVersion("Restored from version")
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <History className="h-4 w-4" />
          Version History
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[300px]">
          <div className="space-y-3">
            {versions.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">No version history available</p>
            ) : (
              versions.map((version, index) => (
                <div key={version.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Clock className="h-3 w-3 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">
                        {new Date(version.timestamp).toLocaleString()}
                      </span>
                      {index === 0 && (
                        <Badge variant="secondary" className="text-xs">
                          Latest
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm font-medium">{version.changes}</p>
                    <p className="text-xs text-muted-foreground">{version.content.length} characters</p>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => handleRestore(version)} disabled={index === 0}>
                    <RotateCcw className="h-3 w-3" />
                  </Button>
                </div>
              ))
            )}
          </div>
        </ScrollArea>
        <Button
          variant="outline"
          size="sm"
          className="w-full mt-3 bg-transparent"
          onClick={() => saveVersion("Manual save")}
        >
          Save Current Version
        </Button>
      </CardContent>
    </Card>
  )
}
