"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Wand2, Minimize2, Maximize2, RotateCcw, CheckCircle, Palette, Type, Loader2, Sparkles } from "lucide-react"

interface AIWritingToolsProps {
  selectedText: string
  onApplyChange: (newText: string) => void
  onClose: () => void
  disabled?: boolean
}

export function AIWritingTools({ selectedText, onApplyChange, onClose, disabled = false }: AIWritingToolsProps) {
  const [isProcessing, setIsProcessing] = useState(false)
  const [currentAction, setCurrentAction] = useState("")
  const [previewText, setPreviewText] = useState("")
  const [showPreview, setShowPreview] = useState(false)

  const handleAIAction = async (action: string, actionName: string) => {
    setIsProcessing(true)
    setCurrentAction(actionName)
    setShowPreview(false)

    // Simulate AI processing
    await new Promise((resolve) => setTimeout(resolve, 1200))

    let processedText = selectedText

    switch (action) {
      case "grammar":
        processedText = selectedText
          .replace(/\s+/g, " ")
          .replace(/([.!?])\s*([a-z])/g, "$1 $2")
          .replace(/\bi\b/g, "I")
          .trim()
        break
      case "concise":
        const words = selectedText.split(" ")
        processedText =
          words.length > 10 ? words.slice(0, Math.ceil(words.length * 0.7)).join(" ") + "..." : selectedText
        break
      case "elaborate":
        processedText =
          selectedText +
          " Furthermore, this matter requires careful consideration of all relevant legal precedents and statutory provisions to ensure comprehensive documentation and proper procedural compliance."
        break
      case "rephrase":
        processedText = selectedText
          .replace(/\b(said|aforementioned)\b/g, "the")
          .replace(/\b(whereas|heretofore)\b/g, "while")
          .replace(/\b(pursuant to)\b/g, "according to")
        break
      case "legal_tone":
        processedText = selectedText
          .replace(/\b(I|me|my)\b/g, "the undersigned")
          .replace(/\b(you|your)\b/g, "the party")
          .replace(/\b(said)\b/g, "aforementioned")
          .replace(/\b(because)\b/g, "whereas")
        break
      case "plain_tone":
        processedText = selectedText
          .replace(/\b(whereas|heretofore|aforementioned)\b/g, "")
          .replace(/\b(the undersigned)\b/g, "I")
          .replace(/\b(the party)\b/g, "you")
          .replace(/\b(pursuant to)\b/g, "according to")
        break
    }

    setPreviewText(processedText)
    setShowPreview(true)
    setIsProcessing(false)
  }

  const applyChange = () => {
    onApplyChange(previewText)
    setShowPreview(false)
    setPreviewText("")
    onClose()
  }

  const discardChange = () => {
    setShowPreview(false)
    setPreviewText("")
  }

  if (showPreview) {
    return (
      <div className="flex items-center space-x-2 bg-primary/5 border border-primary/20 rounded-lg p-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2 mb-1">
            <Badge variant="secondary" className="bg-primary/10 text-primary text-xs">
              <Sparkles className="mr-1 h-2 w-2" />
              AI Suggestion
            </Badge>
          </div>
          <p className="text-sm text-foreground truncate">{previewText}</p>
        </div>
        <div className="flex items-center space-x-1">
          <Button onClick={applyChange} size="sm" className="h-7 px-2 text-xs">
            <CheckCircle className="mr-1 h-3 w-3" />
            Apply
          </Button>
          <Button onClick={discardChange} variant="outline" size="sm" className="h-7 px-2 text-xs bg-transparent">
            Discard
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex items-center">
      {isProcessing ? (
        <div className="flex items-center space-x-2 bg-muted/50 rounded-lg px-3 py-1.5">
          <Loader2 className="h-3 w-3 animate-spin text-primary" />
          <span className="text-xs font-medium text-muted-foreground">{currentAction}...</span>
        </div>
      ) : (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              disabled={disabled || !selectedText.trim()}
              className="h-8 px-3 bg-background hover:bg-primary/5 border-primary/20 text-primary hover:text-primary"
            >
              <Wand2 className="h-3 w-3 mr-1" />
              <span className="text-xs font-medium">AI Tools</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="start"
            side="bottom"
            className="w-56 bg-background/95 backdrop-blur-sm border shadow-lg rounded-lg"
            sideOffset={4}
          >
            <div className="px-3 py-2 border-b">
              <p className="text-xs font-medium text-muted-foreground">
                {selectedText.length > 30 ? `"${selectedText.substring(0, 30)}..."` : `"${selectedText}"`}
              </p>
            </div>

            <DropdownMenuItem
              onClick={() => handleAIAction("grammar", "Fixing Grammar")}
              className="cursor-pointer px-3 py-2 focus:bg-primary/5"
            >
              <CheckCircle className="mr-2 h-3 w-3 text-green-500" />
              <span className="text-sm">Fix Grammar</span>
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={() => handleAIAction("concise", "Making Concise")}
              className="cursor-pointer px-3 py-2 focus:bg-primary/5"
            >
              <Minimize2 className="mr-2 h-3 w-3 text-blue-500" />
              <span className="text-sm">Make Concise</span>
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={() => handleAIAction("elaborate", "Elaborating")}
              className="cursor-pointer px-3 py-2 focus:bg-primary/5"
            >
              <Maximize2 className="mr-2 h-3 w-3 text-purple-500" />
              <span className="text-sm">Elaborate</span>
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={() => handleAIAction("rephrase", "Rephrasing")}
              className="cursor-pointer px-3 py-2 focus:bg-primary/5"
            >
              <RotateCcw className="mr-2 h-3 w-3 text-orange-500" />
              <span className="text-sm">Rephrase</span>
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem
              onClick={() => handleAIAction("legal_tone", "Adjusting to Legal Tone")}
              className="cursor-pointer px-3 py-2 focus:bg-primary/5"
            >
              <Palette className="mr-2 h-3 w-3 text-indigo-500" />
              <span className="text-sm">Legal Tone</span>
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={() => handleAIAction("plain_tone", "Converting to Plain Language")}
              className="cursor-pointer px-3 py-2 focus:bg-primary/5"
            >
              <Type className="mr-2 h-3 w-3 text-teal-500" />
              <span className="text-sm">Plain Language</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  )
}
