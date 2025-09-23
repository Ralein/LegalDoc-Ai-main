"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, Replace } from "lucide-react"
import { useEditorContext } from "../lib/context"

export function SearchBar() {
  const {
    showSearch,
    searchTerm,
    setSearchTerm,
    replaceTerm,
    setReplaceTerm,
    handleSearch,
    handleReplace,
  } = useEditorContext()

  if (!showSearch) {
    return null
  }

  return (
    <Card className="mb-6 shadow-sm border-0 bg-card/50 backdrop-blur-sm">
      <CardContent className="pt-6">
        <div className="flex items-center space-x-3">
          <Input
            placeholder="Search in document..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 h-11"
          />
          <Input
            placeholder="Replace with..."
            value={replaceTerm}
            onChange={(e) => setReplaceTerm(e.target.value)}
            className="flex-1 h-11"
          />
          <Button onClick={handleSearch} variant="outline" className="h-11 bg-transparent">
            <Search className="h-4 w-4" />
          </Button>
          <Button onClick={handleReplace} variant="outline" className="h-11 bg-transparent">
            <Replace className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
