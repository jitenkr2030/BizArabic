'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { 
  Upload, 
  FileText, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  AlertCircle,
  Download,
  Eye,
  Trash2,
  Plus,
  Search,
  Filter
} from 'lucide-react'

interface Document {
  id: string
  fileName: string
  documentType: string
  status: 'UPLOADED' | 'UNDER_REVIEW' | 'APPROVED' | 'REJECTED' | 'EXPIRED'
  uploadedAt: string
  verifiedAt?: string
  verificationNotes?: string
  fileSize: number
  mimeType: string
}

const documentTypes = [
  { value: 'PASSPORT', label: 'Passport', required: true },
  { value: 'VISA', label: 'Visa', required: false },
  { value: 'ADDRESS_PROOF', label: 'Address Proof', required: true },
  { value: 'BANK_STATEMENT', label: 'Bank Statement', required: false },
  { value: 'PHOTOGRAPH', label: 'Photograph', required: true },
  { value: 'BUSINESS_PLAN', label: 'Business Plan', required: false },
  { value: 'CV', label: 'CV/Resume', required: false },
  { value: 'CERTIFICATE', label: 'Certificate', required: false },
  { value: 'OTHER', label: 'Other', required: false }
]

export default function DocumentManagement() {
  const [documents, setDocuments] = useState<Document[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [documentType, setDocumentType] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null)

  useEffect(() => {
    fetchDocuments()
  }, [])

  const fetchDocuments = async () => {
    try {
      const response = await fetch('/api/documents')
      if (response.ok) {
        const data = await response.json()
        setDocuments(data.documents)
      }
    } catch (error) {
      console.error('Failed to fetch documents:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleFileUpload = async () => {
    if (!selectedFile || !documentType) return

    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', selectedFile)
      formData.append('documentType', documentType)

      const response = await fetch('/api/documents', {
        method: 'POST',
        body: formData
      })

      if (response.ok) {
        const data = await response.json()
        setDocuments(prev => [data.document, ...prev])
        setSelectedFile(null)
        setDocumentType('')
        // Reset file input
        const fileInput = document.getElementById('file-upload') as HTMLInputElement
        if (fileInput) fileInput.value = ''
      }
    } catch (error) {
      console.error('Upload failed:', error)
    } finally {
      setUploading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'APPROVED': return 'bg-green-100 text-green-800'
      case 'UNDER_REVIEW': return 'bg-blue-100 text-blue-800'
      case 'REJECTED': return 'bg-red-100 text-red-800'
      case 'EXPIRED': return 'bg-orange-100 text-orange-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'APPROVED': return CheckCircle2
      case 'UNDER_REVIEW': return Clock
      case 'REJECTED': return XCircle
      case 'EXPIRED': return AlertCircle
      default: return FileText
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.fileName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.documentType.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || doc.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const documentsByStatus = {
    required: documents.filter(doc => 
      documentTypes.find(type => type.value === doc.documentType)?.required
    ),
    optional: documents.filter(doc => 
      !documentTypes.find(type => type.value === doc.documentType)?.required
    ),
    approved: documents.filter(doc => doc.status === 'APPROVED'),
    pending: documents.filter(doc => ['UPLOADED', 'UNDER_REVIEW'].includes(doc.status))
  }

  const completionPercentage = documents.length > 0 
    ? (documentsByStatus.approved.length / documentsByStatus.required.length) * 100 
    : 0

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading documents...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-semibold text-gray-900">Document Management</h1>
                <p className="text-sm text-gray-500">Upload and manage your business documents</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Download All
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Progress Overview */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold">Document Completion</h3>
                <p className="text-sm text-gray-500">
                  {documentsByStatus.approved.length} of {documentsByStatus.required.length} required documents approved
                </p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-blue-600">{Math.round(completionPercentage)}%</div>
                <div className="text-sm text-gray-500">Complete</div>
              </div>
            </div>
            <Progress value={completionPercentage} className="h-2" />
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Upload Section */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Upload Document</CardTitle>
                <CardDescription>
                  Add required documents for your business registration
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="document-type">Document Type</Label>
                  <Select value={documentType} onValueChange={setDocumentType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select document type" />
                    </SelectTrigger>
                    <SelectContent>
                      {documentTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          <div className="flex items-center gap-2">
                            <span>{type.label}</span>
                            {type.required && <Badge variant="secondary" className="text-xs">Required</Badge>}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="file-upload">Choose File</Label>
                  <Input
                    id="file-upload"
                    type="file"
                    onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                    accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                    className="mt-1"
                  />
                  {selectedFile && (
                    <p className="text-sm text-gray-500 mt-1">
                      Selected: {selectedFile.name} ({formatFileSize(selectedFile.size)})
                    </p>
                  )}
                </div>

                <Button 
                  onClick={handleFileUpload} 
                  disabled={!selectedFile || !documentType || uploading}
                  className="w-full"
                >
                  {uploading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4 mr-2" />
                      Upload Document
                    </>
                  )}
                </Button>

                <div className="text-xs text-gray-500 space-y-1">
                  <p>• Accepted formats: PDF, JPG, PNG, DOC, DOCX</p>
                  <p>• Maximum file size: 10MB</p>
                  <p>• Required documents marked with badge</p>
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="text-lg">Quick Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Total Documents</span>
                  <span className="font-semibold">{documents.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Approved</span>
                  <span className="font-semibold text-green-600">{documentsByStatus.approved.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Pending Review</span>
                  <span className="font-semibold text-blue-600">{documentsByStatus.pending.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Rejected</span>
                  <span className="font-semibold text-red-600">{documents.filter(d => d.status === 'REJECTED').length}</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Documents List */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Your Documents</CardTitle>
                    <CardDescription>Manage and track all your uploaded documents</CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        placeholder="Search documents..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 w-64"
                      />
                    </div>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="UPLOADED">Uploaded</SelectItem>
                        <SelectItem value="UNDER_REVIEW">Under Review</SelectItem>
                        <SelectItem value="APPROVED">Approved</SelectItem>
                        <SelectItem value="REJECTED">Rejected</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="all" className="w-full">
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="all">All ({documents.length})</TabsTrigger>
                    <TabsTrigger value="required">Required ({documentsByStatus.required.length})</TabsTrigger>
                    <TabsTrigger value="approved">Approved ({documentsByStatus.approved.length})</TabsTrigger>
                    <TabsTrigger value="pending">Pending ({documentsByStatus.pending.length})</TabsTrigger>
                  </TabsList>

                  <TabsContent value="all" className="space-y-4">
                    {filteredDocuments.length === 0 ? (
                      <div className="text-center py-8">
                        <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-500">No documents found</p>
                      </div>
                    ) : (
                      filteredDocuments.map((doc) => {
                        const StatusIcon = getStatusIcon(doc.status)
                        return (
                          <div key={doc.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                                <StatusIcon className="w-5 h-5 text-gray-600" />
                              </div>
                              <div>
                                <p className="font-medium">{doc.fileName}</p>
                                <p className="text-sm text-gray-500">
                                  {doc.documentType} • {formatFileSize(doc.fileSize)} • 
                                  {new Date(doc.uploadedAt).toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge className={getStatusColor(doc.status)}>
                                {doc.status.replace('_', ' ')}
                              </Badge>
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button variant="ghost" size="sm">
                                    <Eye className="w-4 h-4" />
                                  </Button>
                                </DialogTrigger>
                                <DialogContent>
                                  <DialogHeader>
                                    <DialogTitle>{doc.fileName}</DialogTitle>
                                    <DialogDescription>
                                      Document details and verification status
                                    </DialogDescription>
                                  </DialogHeader>
                                  <div className="space-y-4">
                                    <div>
                                      <Label>Type</Label>
                                      <p className="font-medium">{doc.documentType}</p>
                                    </div>
                                    <div>
                                      <Label>Status</Label>
                                      <Badge className={getStatusColor(doc.status)}>
                                        {doc.status.replace('_', ' ')}
                                      </Badge>
                                    </div>
                                    <div>
                                      <Label>File Size</Label>
                                      <p>{formatFileSize(doc.fileSize)}</p>
                                    </div>
                                    <div>
                                      <Label>Uploaded</Label>
                                      <p>{new Date(doc.uploadedAt).toLocaleString()}</p>
                                    </div>
                                    {doc.verifiedAt && (
                                      <div>
                                        <Label>Verified</Label>
                                        <p>{new Date(doc.verifiedAt).toLocaleString()}</p>
                                      </div>
                                    )}
                                    {doc.verificationNotes && (
                                      <div>
                                        <Label>Notes</Label>
                                        <p className="text-sm text-gray-600">{doc.verificationNotes}</p>
                                      </div>
                                    )}
                                  </div>
                                </DialogContent>
                              </Dialog>
                              <Button variant="ghost" size="sm">
                                <Download className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        )
                      })
                    )}
                  </TabsContent>

                  <TabsContent value="required" className="space-y-4">
                    {documentsByStatus.required.map((doc) => (
                      <div key={doc.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <FileText className="w-5 h-5 text-gray-600" />
                          <div>
                            <p className="font-medium">{doc.fileName}</p>
                            <p className="text-sm text-gray-500">{doc.documentType}</p>
                          </div>
                        </div>
                        <Badge className={getStatusColor(doc.status)}>
                          {doc.status.replace('_', ' ')}
                        </Badge>
                      </div>
                    ))}
                  </TabsContent>

                  <TabsContent value="approved" className="space-y-4">
                    {documentsByStatus.approved.map((doc) => (
                      <div key={doc.id} className="flex items-center justify-between p-4 border rounded-lg bg-green-50">
                        <div className="flex items-center gap-3">
                          <CheckCircle2 className="w-5 h-5 text-green-600" />
                          <div>
                            <p className="font-medium">{doc.fileName}</p>
                            <p className="text-sm text-gray-500">{doc.documentType}</p>
                          </div>
                        </div>
                        <Badge className="bg-green-100 text-green-800">
                          Approved
                        </Badge>
                      </div>
                    ))}
                  </TabsContent>

                  <TabsContent value="pending" className="space-y-4">
                    {documentsByStatus.pending.map((doc) => (
                      <div key={doc.id} className="flex items-center justify-between p-4 border rounded-lg bg-blue-50">
                        <div className="flex items-center gap-3">
                          <Clock className="w-5 h-5 text-blue-600" />
                          <div>
                            <p className="font-medium">{doc.fileName}</p>
                            <p className="text-sm text-gray-500">{doc.documentType}</p>
                          </div>
                        </div>
                        <Badge className="bg-blue-100 text-blue-800">
                          {doc.status.replace('_', ' ')}
                        </Badge>
                      </div>
                    ))}
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}