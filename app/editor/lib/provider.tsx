"use client"

import { EditorContext } from "./context"
import { useEditorLogic } from "../hooks/use-editor-logic"

export function EditorProvider({ children }: { children: React.ReactNode }) {
  const editorLogic = useEditorLogic()

  return (
    <EditorContext.Provider value={editorLogic}>
      {children}
    </EditorContext.Provider>
  )
}
