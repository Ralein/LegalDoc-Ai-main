"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { History, Clock, RotateCcw } from "lucide-react"
import { useEditorContext } from "../lib/context"

export function VersionHistory() {
  const {
    versionHistory,
    showVersionHistory,
    setShowVersionHistory,
    formatTimestamp,
    restoreVersion,
  } = useEditorContext()

  return (
    <Card className="shadow-lg border-0 bg-card/50 backdrop-blur-sm">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center">
            <History className="mr-2 h-5 w-5 text-primary" />
            Version History
          </CardTitle>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setShowVersionHistory(!showVersionHistory)}
            className="h-8"
          >
            <Clock className="h-3 w-3 mr-1" />
            {showVersionHistory ? 'Hide' : 'Show'}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {showVersionHistory ? (
          <div className="space-y-3 max-h-80 overflow-y-auto">
            {versionHistory.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">
                No versions saved yet
              </p>
            ) : (
              versionHistory.map((version) => (
                <div key={version.id} className="border rounded-lg p-3 bg-background/50">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <Badge variant={version.type === 'auto-save' ? 'secondary' : 'default'} className="text-xs">
                        {version.type === 'auto-save' ? 'Auto' : 'Manual'}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {formatTimestamp(version.timestamp)}
                      </span>
                    </div>
                    <div className="flex space-x-1">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => restoreVersion(version)}
                            className="h-6 w-6 p-0"
                          >
                            <RotateCcw className="h-3 w-3" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Restore this version</TooltipContent>
                      </Tooltip>
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    <div className="truncate mb-1 font-medium">{version.title}</div>
                    <div className="flex items-center justify-between">
                      <span>{version.wordCount} words</span>
                      <span>{new Date(version.timestamp).toLocaleTimeString()}</span>
                    </div>
                  </div>
                  {version.plainText && (
                    <div className="mt-2 text-xs text-muted-foreground bg-muted/20 rounded p-2">
                      <div className="line-clamp-2">
                        {version.plainText.substring(0, 100)}
                        {version.plainText.length > 100 && '...'}
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        ) : (
          <div className="text-center py-4">
            <p className="text-sm text-muted-foreground mb-2">Auto-save enabled</p>
            <Badge variant="outline" className="text-xs">
              {versionHistory.length} versions saved
            </Badge>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
