"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Type } from "lucide-react"
import { useEditorContext } from "../lib/context"

export function TypographySettings() {
  const { currentFont, setCurrentFont, currentFontSize, setCurrentFontSize } = useEditorContext()

  return (
    <Card className="shadow-lg border-0 bg-card/50 backdrop-blur-sm">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg flex items-center">
          <div className="p-2 bg-primary/10 rounded-lg mr-3">
            <Type className="h-5 w-5 text-primary" />
          </div>
          Typography
        </CardTitle>
        <p className="text-sm text-muted-foreground">Customize document appearance</p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-foreground">Font Family</label>
            <Badge variant="outline" className="text-xs">
              {currentFont}
            </Badge>
          </div>
          <Select value={currentFont} onValueChange={setCurrentFont}>
            <SelectTrigger className="h-10">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Inter">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                  Inter
                </div>
              </SelectItem>
              <SelectItem value="Arial">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                  Arial
                </div>
              </SelectItem>
              <SelectItem value="Times New Roman">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-red-500 rounded-full mr-2"></div>
                  Times New Roman
                </div>
              </SelectItem>
              <SelectItem value="Georgia">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mr-2"></div>
                  Georgia
                </div>
              </SelectItem>
              <SelectItem value="Helvetica">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-orange-500 rounded-full mr-2"></div>
                  Helvetica
                </div>
              </SelectItem>
              <SelectItem value="Roboto">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-cyan-500 rounded-full mr-2"></div>
                  Roboto
                </div>
              </SelectItem>
              <SelectItem value="Open Sans">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-pink-500 rounded-full mr-2"></div>
                  Open Sans
                </div>
              </SelectItem>
              <SelectItem value="Lato">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></div>
                  Lato
                </div>
              </SelectItem>
              <SelectItem value="Montserrat">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-indigo-500 rounded-full mr-2"></div>
                  Montserrat
                </div>
              </SelectItem>
              <SelectItem value="Poppins">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full mr-2"></div>
                  Poppins
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-foreground">Font Size</label>
            <Badge variant="outline" className="text-xs">
              {currentFontSize}px
            </Badge>
          </div>
          <Select value={currentFontSize} onValueChange={setCurrentFontSize}>
            <SelectTrigger className="h-10">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="12">12px - Small</SelectItem>
              <SelectItem value="14">14px - Regular</SelectItem>
              <SelectItem value="16">16px - Medium</SelectItem>
              <SelectItem value="18">18px - Large</SelectItem>
              <SelectItem value="20">20px - X-Large</SelectItem>
              <SelectItem value="22">22px</SelectItem>
              <SelectItem value="24">24px</SelectItem>
              <SelectItem value="26">26px</SelectItem>
              <SelectItem value="28">28px</SelectItem>
              <SelectItem value="32">32px - Huge</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  )
}
