"use client"

import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import { useEditorContext } from "../lib/context"

export function ValidationIssues() {
  const { validationIssues } = useEditorContext()

  if (validationIssues.length === 0) {
    return null
  }

  return (
    <Alert className="mb-6 border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950">
      <AlertCircle className="h-4 w-4 text-amber-600" />
      <AlertDescription>
        <strong className="text-amber-800 dark:text-amber-200">Validation Issues:</strong>
        <ul className="mt-2 list-disc list-inside text-amber-700 dark:text-amber-300">
          {validationIssues.map((issue, index) => (
            <li key={index}>{issue}</li>
          ))}
        </ul>
      </AlertDescription>
    </Alert>
  )
}
