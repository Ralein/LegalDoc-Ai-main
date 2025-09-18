"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

type Language = "en" | "ta"

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
}

const translations = {
  en: {
    // Navigation
    "nav.templates": "Templates",
    "nav.editor": "Editor",
    "nav.archive": "Archive",
    "nav.settings": "Settings",
    "nav.dashboard": "Dashboard",

    // Templates
    "templates.title": "Legal Document Templates",
    "templates.subtitle": "Choose from predefined templates to create legal documents",
    "templates.fir": "First Information Report (FIR)",
    "templates.fir.desc": "File a complaint with police authorities",
    "templates.chargesheet": "Charge Sheet",
    "templates.chargesheet.desc": "Formal accusation document for court proceedings",
    "templates.general": "General Report",
    "templates.general.desc": "General purpose legal report template",
    "templates.use": "Use Template",

    // Form Fields
    "form.complainant": "Complainant Name",
    "form.date": "Date of Incident",
    "form.location": "Location",
    "form.officer": "Officer Name",
    "form.details": "Incident Details",
    "form.case_id": "Case ID",
    "form.accused": "Accused Name",
    "form.charges": "Charges",
    "form.evidence": "Evidence Details",
    "form.witnesses": "Witnesses",

    // Editor
    "editor.title": "Document Editor",
    "editor.save": "Save Document",
    "editor.export_word": "Export as Word",
    "editor.export_pdf": "Export as PDF",
    "editor.grammar": "Grammar Fix",
    "editor.concise": "Make Concise",
    "editor.elaborate": "Elaborate",
    "editor.rephrase": "Rephrase",
    "editor.summarize": "Auto Summarize",
    "editor.legal_tone": "Legal Tone",
    "editor.plain_tone": "Plain Language",

    // Archive
    "archive.title": "Document Archive",
    "archive.search": "Search documents...",
    "archive.no_docs": "No documents found",
    "archive.created": "Created",
    "archive.modified": "Last Modified",
    "archive.view": "View",
    "archive.delete": "Delete",

    // Common
    "common.loading": "Loading...",
    "common.save": "Save",
    "common.cancel": "Cancel",
    "common.delete": "Delete",
    "common.edit": "Edit",
    "common.create": "Create",
    "common.search": "Search",
  },
  ta: {
    // Navigation
    "nav.templates": "வார்ப்புருக்கள்",
    "nav.editor": "எடிட்டர்",
    "nav.archive": "காப்பகம்",
    "nav.settings": "அமைப்புகள்",
    "nav.dashboard": "டாஷ்போர்டு",

    // Templates
    "templates.title": "சட்ட ஆவண வார்ப்புருக்கள்",
    "templates.subtitle": "சட்ட ஆவணங்களை உருவாக்க முன்வரையறுக்கப்பட்ட வார்ப்புருக்களில் இருந்து தேர்ந்தெடுக்கவும்",
    "templates.fir": "முதல் தகவல் அறிக்கை (FIR)",
    "templates.fir.desc": "காவல் அதிகாரிகளிடம் புகார் பதிவு செய்யவும்",
    "templates.chargesheet": "குற்றப்பத்திரிகை",
    "templates.chargesheet.desc": "நீதிமன்ற நடவடிக்கைகளுக்கான முறையான குற்றச்சாட்டு ஆவணம்",
    "templates.general": "பொது அறிக்கை",
    "templates.general.desc": "பொது நோக்கத்திற்கான சட்ட அறிக்கை வார்ப்புரு",
    "templates.use": "வார்ப்புருவைப் பயன்படுத்தவும்",

    // Form Fields
    "form.complainant": "புகார்தாரர் பெயர்",
    "form.date": "சம்பவ தேதி",
    "form.location": "இடம்",
    "form.officer": "அதிகாரி பெயர்",
    "form.details": "சம்பவ விவரங்கள்",
    "form.case_id": "வழக்கு எண்",
    "form.accused": "குற்றவாளி பெயர்",
    "form.charges": "குற்றச்சாட்டுகள்",
    "form.evidence": "சாட்சி விவரங்கள்",
    "form.witnesses": "சாட்சிகள்",

    // Editor
    "editor.title": "ஆவண எடிட்டர்",
    "editor.save": "ஆவணத்தை சேமிக்கவும்",
    "editor.export_word": "Word ஆக ஏற்றுமதி செய்யவும்",
    "editor.export_pdf": "PDF ஆக ஏற்றுமதி செய்யவும்",
    "editor.grammar": "இலக்கணம் சரிசெய்யவும்",
    "editor.concise": "சுருக்கமாக்கவும்",
    "editor.elaborate": "விரிவாக்கவும்",
    "editor.rephrase": "மறுபதிப்பு செய்யவும்",
    "editor.summarize": "தானியங்கி சுருக்கம்",
    "editor.legal_tone": "சட்ட தொனி",
    "editor.plain_tone": "எளிய மொழி",

    // Archive
    "archive.title": "ஆவண காப்பகம்",
    "archive.search": "ஆவணங்களைத் தேடவும்...",
    "archive.no_docs": "ஆவணங்கள் எதுவும் கிடைக்கவில்லை",
    "archive.created": "உருவாக்கப்பட்டது",
    "archive.modified": "கடைசியாக மாற்றப்பட்டது",
    "archive.view": "பார்க்கவும்",
    "archive.delete": "நீக்கவும்",

    // Common
    "common.loading": "ஏற்றுகிறது...",
    "common.save": "சேமிக்கவும்",
    "common.cancel": "ரத்து செய்யவும்",
    "common.delete": "நீக்கவும்",
    "common.edit": "திருத்தவும்",
    "common.create": "உருவாக்கவும்",
    "common.search": "தேடவும்",
  },
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>("en")

  useEffect(() => {
    const saved = localStorage.getItem("language") as Language
    if (saved && (saved === "en" || saved === "ta")) {
      setLanguage(saved)
    }
  }, [])

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang)
    localStorage.setItem("language", lang)
  }

  const t = (key: string): string => {
    return translations[language][key as keyof (typeof translations)["en"]] || key
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}
