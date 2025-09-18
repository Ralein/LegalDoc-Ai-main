"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Wand2, Minimize2, Maximize2, RotateCcw, CheckCircle, Palette, Type, Loader2, Sparkles, X, ChevronDown } from "lucide-react"

interface AIWritingToolsProps {
  selectedText: string
  onApplyChange: (newText: string) => void
  onClose: () => void
  disabled?: boolean
  position?: { x: number; y: number } | null
}

export function AIWritingTools({
  selectedText,
  onApplyChange,
  onClose,
  disabled = false,
  position = null,
}: AIWritingToolsProps) {
  const [isProcessing, setIsProcessing] = useState(false)
  const [currentAction, setCurrentAction] = useState("")
  const [previewText, setPreviewText] = useState("")
  const [showPreview, setShowPreview] = useState(false)
  const [showDropdown, setShowDropdown] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false)
      }
    }

    if (showDropdown) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showDropdown])

  // Reset states when selected text changes
  useEffect(() => {
    if (!selectedText.trim()) {
      setShowPreview(false)
      setShowDropdown(false)
      setPreviewText("")
    }
  }, [selectedText])

  const handleAIAction = async (action: string, actionName: string) => {
    setIsProcessing(true)
    setCurrentAction(actionName)
    setShowPreview(false)
    setShowDropdown(false)

    // Simulate AI processing
    await new Promise((resolve) => setTimeout(resolve, 1500))

    let processedText = selectedText

    switch (action) {
      case "grammar":
        processedText = selectedText
          .replace(/\s+/g, " ")
          .replace(/([.!?])\s*([a-z])/g, "$1 $2")
          .replace(/\bi\b/g, "I")
          .replace(/\bits\b/g, "it's")
          .replace(/\byour\b/g, "you're")
          .replace(/\bthier\b/g, "their")
          .replace(/\brecieve\b/g, "receive")
          .trim()
        break
      case "concise":
        const words = selectedText.split(" ")
        if (words.length > 10) {
          processedText = words.slice(0, Math.ceil(words.length * 0.7)).join(" ") + "."
        } else {
          processedText = selectedText
            .replace(/\b(very|really|quite|rather|somewhat|actually|basically|literally)\b/gi, "")
            .replace(/\s+/g, " ")
            .trim()
        }
        break
      case "elaborate":
        processedText = selectedText + 
          " Furthermore, this matter requires careful consideration of all relevant factors, " +
          "taking into account the specific circumstances and applicable legal framework " +
          "to ensure comprehensive documentation and proper procedural compliance."
        break
      case "rephrase":
        processedText = selectedText
          .replace(/\b(said|aforementioned)\b/gi, "the mentioned")
          .replace(/\b(whereas|heretofore)\b/gi, "while")
          .replace(/\b(pursuant to)\b/gi, "according to")
          .replace(/\b(therefore)\b/gi, "thus")
          .replace(/\b(however)\b/gi, "nevertheless")
          .replace(/\b(in order to)\b/gi, "to")
        break
      case "legal_tone":
        processedText = selectedText
          .replace(/\b(I|me|my)\b/gi, "the undersigned")
          .replace(/\b(you|your)\b/gi, "the aforementioned party")
          .replace(/\b(said)\b/gi, "aforementioned")
          .replace(/\b(because)\b/gi, "whereas")
          .replace(/\b(if)\b/gi, "in the event that")
          .replace(/\b(when)\b/gi, "at such time as")
          .replace(/\b(agree)\b/gi, "hereby acknowledge and agree")
        break
      case "plain_tone":
        processedText = selectedText
          .replace(/\b(whereas|heretofore|aforementioned)\b/gi, "")
          .replace(/\b(the undersigned)\b/gi, "I")
          .replace(/\b(the aforementioned party|the party)\b/gi, "you")
          .replace(/\b(pursuant to)\b/gi, "under")
          .replace(/\b(in the event that)\b/gi, "if")
          .replace(/\b(at such time as)\b/gi, "when")
          .replace(/\b(hereby acknowledge and agree)\b/gi, "agree")
          .replace(/\s+/g, " ")
          .trim()
        break
    }

    setPreviewText(processedText)
    setShowPreview(true)
    setIsProcessing(false)
  }

  const applyChange = () => {
    onApplyChange(previewText)
    setShowPreview(false)
    setShowDropdown(false)
    setPreviewText("")
    onClose()
  }

  const discardChange = () => {
    setShowPreview(false)
    setShowDropdown(false)
    setPreviewText("")
  }

  const handleClose = () => {
    setShowPreview(false)
    setShowDropdown(false)
    setPreviewText("")
    onClose()
  }

  const toggleDropdown = () => {
    if (selectedText.trim() && !disabled) {
      setShowDropdown(!showDropdown)
    }
  }

  // AI Tools Options
  const aiOptions = [
    {
      id: "grammar",
      label: "Fix Grammar & Spelling",
      icon: CheckCircle,
      color: "text-green-500",
      description: "Correct grammatical errors and spelling mistakes"
    },
    {
      id: "concise",
      label: "Make Concise",
      icon: Minimize2,
      color: "text-blue-500",
      description: "Shorten text while preserving meaning"
    },
    {
      id: "elaborate",
      label: "Elaborate & Expand",
      icon: Maximize2,
      color: "text-purple-500",
      description: "Add more detail and context"
    },
    {
      id: "rephrase",
      label: "Rephrase",
      icon: RotateCcw,
      color: "text-orange-500",
      description: "Rewrite using different words"
    },
    {
      id: "legal_tone",
      label: "Convert to Legal Tone",
      icon: Palette,
      color: "text-indigo-500",
      description: "Transform to formal legal language"
    },
    {
      id: "plain_tone",
      label: "Convert to Plain Language",
      icon: Type,
      color: "text-teal-500",
      description: "Simplify complex legal jargon"
    }
  ]

  // Show processing state
  if (isProcessing) {
    return (
      <div className="flex items-center space-x-2 bg-muted/50 rounded-lg px-3 py-1.5">
        <Loader2 className="h-3 w-3 animate-spin text-primary" />
        <span className="text-xs font-medium text-muted-foreground">{currentAction}...</span>
      </div>
    )
  }

  // Show preview state
  if (showPreview) {
    return (
      <div className="flex items-center space-x-2 bg-primary/5 border border-primary/20 rounded-lg p-3 max-w-md">
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2 mb-2">
            <Badge variant="secondary" className="bg-primary/10 text-primary text-xs">
              <Sparkles className="mr-1 h-2 w-2" />
              AI Suggestion
            </Badge>
          </div>
          <div className="max-h-24 overflow-y-auto">
            <p className="text-sm text-foreground leading-relaxed">{previewText}</p>
          </div>
        </div>
        <div className="flex flex-col space-y-1">
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

  // Main AI Tools Button with Dropdown
  return (
    <div className="relative" ref={dropdownRef}>
      <Button
        variant="outline"
        size="sm"
        disabled={disabled || !selectedText.trim()}
        className="h-8 px-3 bg-background hover:bg-primary/5 border-primary/20 text-primary hover:text-primary"
        onClick={toggleDropdown}
      >
        <Wand2 className="h-3 w-3 mr-1" />
        <span className="text-xs font-medium">AI Tools</span>
        <ChevronDown className={`h-3 w-3 ml-1 transition-transform ${showDropdown ? 'rotate-180' : ''}`} />
      </Button>

      {/* Dropdown Menu */}
      {showDropdown && selectedText.trim() && (
        <div className="absolute top-full left-0 mt-2 w-80 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-2xl overflow-hidden z-50 animate-in fade-in-0 slide-in-from-top-2 duration-200">
          {/* Header */}
          <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-750">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">AI Writing Tools</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 truncate max-w-[200px]">
                  "{selectedText.length > 40 ? `${selectedText.substring(0, 40)}...` : selectedText}"
                </p>
              </div>
              <Button
                onClick={handleClose}
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0 hover:bg-gray-200 dark:hover:bg-gray-600"
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          </div>

          {/* AI Options */}
          <div className="py-2 max-h-80 overflow-y-auto">
            {aiOptions.map((option, index) => {
              const IconComponent = option.icon
              return (
                <button
                  key={option.id}
                  onClick={() => handleAIAction(option.id, option.label)}
                  className="w-full flex items-start px-4 py-3 text-left hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors group"
                >
                  <IconComponent className={`mr-3 h-4 w-4 mt-0.5 ${option.color} group-hover:scale-110 transition-transform`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {option.label}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {option.description}
                    </p>
                  </div>
                </button>
              )
            })}
          </div>

          {/* Footer */}
          <div className="px-4 py-3 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-750">
            <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
              <Sparkles className="h-3 w-3 mr-1" />
              Select text and choose an AI action
            </p>
          </div>
        </div>
      )}
    </div>
  )
}