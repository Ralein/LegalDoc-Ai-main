"use client"

import { Button } from "@/components/ui/button"
import { Moon, Sun, Globe, Scale } from "lucide-react"
import { useTheme } from "next-themes"
import { useLanguage } from "@/lib/language-context"

export function Navbar() {
  const { setTheme, theme } = useTheme()
  const { language, setLanguage, t } = useLanguage()

  const handleLanguageChange = (newLanguage: "en" | "ta") => {
    console.log('Changing language to:', newLanguage) // Debug log
    setLanguage(newLanguage)
  }

  const handleThemeToggle = () => {
    const newTheme = theme === "light" ? "dark" : "light"
    console.log('Changing theme to:', newTheme) // Debug log
    setTheme(newTheme)
  }

  return (
    <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center px-6">
        <div className="mr-4 flex items-center space-x-3">
          <div className="flex items-center justify-center w-10 h-10 bg-primary rounded-lg">
            <Scale className="h-6 w-6 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            LegalDoc AI
          </h1>
        </div>

        <div className="flex flex-1 items-center justify-end space-x-2">
          {/* Language Toggle */}
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-9 hover:bg-accent hover:text-accent-foreground"
            onClick={() => handleLanguageChange(language === "en" ? "ta" : "en")}
          >
            <Globe className="h-4 w-4" />
            <span className="ml-2">
              {language === "en" ? "English" : "தமிழ்"}
            </span>
          </Button>

          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="sm"
            className="h-9 hover:bg-accent hover:text-accent-foreground"
            onClick={handleThemeToggle}
          >
            <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>
        </div>
      </div>
    </div>
  )
}