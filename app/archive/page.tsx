"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { useLanguage } from "@/lib/language-context"
import { Navbar } from "@/components/navbar"
import { Sidebar } from "@/components/sidebar"
import { LanguageProvider } from "@/lib/language-context"
import { Search, FileText, Eye, Trash2, Download, Calendar, Filter } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface Document {
  id: string
  title: string
  content: string
  created: string
  modified: string
  type: string
}

function ArchiveContent() {
  const { t } = useLanguage()
  const [documents, setDocuments] = useState<Document[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState("all")
  const [selectedDoc, setSelectedDoc] = useState<Document | null>(null)

  useEffect(() => {
    // Load documents from localStorage
    const saved = localStorage.getItem("savedDocuments")
    if (saved) {
      setDocuments(JSON.parse(saved))
    } else {
      // Add some sample documents for demonstration
      const sampleDocs: Document[] = [
        {
          id: "1",
          title: "Theft Case - Market Street FIR",
          content:
            "FIRST INFORMATION REPORT\n\nCase Registration Details:\nDate: 2024-01-15\nLocation: Market Street, Chennai\nReporting Officer: Inspector Kumar\n\nComplainant Information:\nName: Rajesh Sharma\n\nIncident Details:\nOn 15th January 2024, at approximately 10:30 PM, the complainant reported that his mobile phone and wallet were stolen by unknown persons near Market Street. The incident occurred when he was returning from work...",
          created: "2024-01-15T10:30:00Z",
          modified: "2024-01-15T11:45:00Z",
          type: "fir",
        },
        {
          id: "2",
          title: "Assault Case Charge Sheet",
          content:
            "CHARGE SHEET\n\nCase ID: CS-2024-002\nCourt: Metropolitan Magistrate Court\nDate: 2024-01-14\n\nAccused Details:\nName: Vikram Singh\n\nCharges:\nSection 323 IPC - Voluntarily causing hurt\nSection 506 IPC - Criminal intimidation\n\nEvidence:\n1. Medical report of the victim\n2. Eyewitness testimonies\n3. CCTV footage from nearby shop...",
          created: "2024-01-14T09:15:00Z",
          modified: "2024-01-14T16:20:00Z",
          type: "chargesheet",
        },
        {
          id: "3",
          title: "Property Dispute General Report",
          content:
            "GENERAL LEGAL REPORT\n\nDate: 2024-01-13\nLocation: Anna Nagar, Chennai\nPrepared by: Advocate Priya Menon\n\nReport Details:\nThis report concerns a property dispute between Mr. Suresh Kumar and Mrs. Lakshmi Devi regarding the ownership of Plot No. 45, Anna Nagar. The dispute arose when both parties claimed ownership based on different sale deeds...",
          created: "2024-01-13T14:20:00Z",
          modified: "2024-01-13T17:30:00Z",
          type: "general",
        },
      ]
      setDocuments(sampleDocs)
      localStorage.setItem("savedDocuments", JSON.stringify(sampleDocs))
    }
  }, [])

  const filteredDocuments = documents.filter((doc) => {
    const matchesSearch =
      doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.content.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterType === "all" || doc.type === filterType
    return matchesSearch && matchesFilter
  })

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this document?")) {
      const updated = documents.filter((doc) => doc.id !== id)
      setDocuments(updated)
      localStorage.setItem("savedDocuments", JSON.stringify(updated))
    }
  }

  const handleExport = (doc: Document) => {
    const blob = new Blob([doc.content], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${doc.title}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "fir":
        return "FIR"
      case "chargesheet":
        return "Charge Sheet"
      case "general":
        return "General Report"
      default:
        return "Document"
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "fir":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
      case "chargesheet":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
      case "general":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
    }
  }

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">{t("archive.title")}</h2>
          <p className="text-muted-foreground">Browse and manage your saved legal documents</p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="outline">{filteredDocuments.length} documents</Badge>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={t("archive.search")}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={filterType} onValueChange={setFilterType}>
          <SelectTrigger className="w-48">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Filter by type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Documents</SelectItem>
            <SelectItem value="fir">FIR Reports</SelectItem>
            <SelectItem value="chargesheet">Charge Sheets</SelectItem>
            <SelectItem value="general">General Reports</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Documents Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredDocuments.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium">{t("archive.no_docs")}</h3>
            <p className="text-muted-foreground">Try adjusting your search or create a new document</p>
          </div>
        ) : (
          filteredDocuments.map((doc) => (
            <Card key={doc.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-1 flex-1">
                    <CardTitle className="text-lg line-clamp-2">{doc.title}</CardTitle>
                    <Badge className={getTypeColor(doc.type)}>{getTypeLabel(doc.type)}</Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground line-clamp-3">{doc.content.substring(0, 150)}...</p>

                  <div className="flex items-center text-xs text-muted-foreground space-x-4">
                    <div className="flex items-center">
                      <Calendar className="h-3 w-3 mr-1" />
                      {t("archive.created")}: {new Date(doc.created).toLocaleDateString()}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <Button variant="outline" size="sm" onClick={() => setSelectedDoc(doc)}>
                      <Eye className="h-4 w-4 mr-2" />
                      {t("archive.view")}
                    </Button>

                    <div className="flex items-center space-x-1">
                      <Button variant="ghost" size="sm" onClick={() => handleExport(doc)}>
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(doc.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Document Preview Modal */}
      {selectedDoc && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-4xl max-h-[80vh] overflow-hidden">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>{selectedDoc.title}</CardTitle>
                  <CardDescription>
                    {t("archive.created")}: {new Date(selectedDoc.created).toLocaleDateString()} •
                    {t("archive.modified")}: {new Date(selectedDoc.modified).toLocaleDateString()}
                  </CardDescription>
                </div>
                <Button variant="ghost" onClick={() => setSelectedDoc(null)}>
                  ×
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="max-h-96 overflow-y-auto">
                <pre className="whitespace-pre-wrap text-sm font-mono">{selectedDoc.content}</pre>
              </div>
              <div className="flex justify-end space-x-2 mt-4">
                <Button variant="outline" onClick={() => handleExport(selectedDoc)}>
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
                <Button onClick={() => setSelectedDoc(null)}>Close</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}

export default function Archive() {
  return (
    <LanguageProvider>
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex">
          <Sidebar />
          <ArchiveContent />
        </div>
      </div>
    </LanguageProvider>
  )
}
