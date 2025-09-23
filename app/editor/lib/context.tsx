"use client"
import { createContext, useContext } from "react"
import { useEditorLogic } from "../hooks/use-editor-logic"

type EditorContextType = ReturnType<typeof useEditorLogic> | null

export const EditorContext = createContext<EditorContextType>(null)

export const useEditorContext = () => {
  const context = useContext(EditorContext)
  if (!context) {
    throw new Error("useEditorContext must be used within an EditorProvider")
  }
  return context
}
