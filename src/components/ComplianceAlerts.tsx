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
import { Checkbox } from '@/components/ui/checkbox'
import { 
  Shield, 
  Calendar, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  FileText, 
  Bell,
  Plus,
  Search,
  Filter,
  Flag,
  TrendingUp,
  Users,
  Building2,
  Eye,
  Edit,
  Trash2
} from 'lucide-react'

interface ComplianceItem {
  id: string
  companyId: string
  title: string
  description: string
  type: 'LICENSE_RENEWAL' | 'VISA_RENEWAL' | 'ANNUAL_AUDIT' | 'TAX_FILING' | 'OTHER'
  dueDate: string
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'OVERDUE'
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'
  notes?: string
  createdAt: string
  updatedAt: string
  completedAt?: string
  requirements?: string[]
  documents?: Array<{
    name: string
    status: string
    uploadedAt?: string
  }>
  checklist?: Array<{
    item: string
    completed: boolean
  }>
}

const complianceTypes = [
  { value: 'LICENSE_RENEWAL', label: 'License Renewal', icon: Building2 },
  { value: 'VISA_RENEWAL', label: 'Visa Renewal', icon: Users },
  { value: 'ANNUAL_AUDIT', label: 'Annual Audit', icon: FileText },
  { value: 'TAX_FILING', label: 'Tax Filing', icon: TrendingUp },
  { value: 'OTHER', label: 'Other', icon: Shield }
]

const priorityColors = {
  LOW: 'bg-gray-100 text-gray-800',
  MEDIUM: 'bg-blue-100 text-blue-800',
  HIGH: 'bg-orange-100 text-orange-800',
  URGENT: 'bg-red-100 text-red-800'
}

const statusColors = {
  PENDING: 'bg-yellow-100 text-yellow-800',
  IN_PROGRESS: 'bg-blue-100 text-blue-800',
  COMPLETED: 'bg-green-100 text-green-800',
  OVERDUE: 'bg-red-100 text-red-800'
}

export default function ComplianceAlerts() {
  const [complianceItems, setComplianceItems] = useState<ComplianceItem[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [typeFilter, setTypeFilter] = useState('all')
  const [selectedItem, setSelectedItem] = useState<ComplianceItem | null>(null)
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [newItem, setNewItem] = useState({
    title: '',
    description: '',
    type: 'LICENSE_RENEWAL',
    dueDate: '',
    priority: 'MEDIUM'
  })

  useEffect(() => {
    fetchComplianceItems()
  }, [statusFilter, typeFilter])

  const fetchComplianceItems = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (statusFilter !== 'all') params.append('status', statusFilter)
      if (typeFilter !== 'all') params.append('type', typeFilter)

      const response = await fetch(`/api/compliance?${params}`)
      if (response.ok) {
        const data = await response.json()
        setComplianceItems(data.complianceItems)
      }
    } catch (error) {
      console.error('Failed to fetch compliance items:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateComplianceItem = async () => {
    try {
      const response = await fetch('/api/compliance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newItem,
          companyId: 'temp-company-id'
        })
      })

      if (response.ok) {
        setShowAddDialog(false)
        setNewItem({
          title: '',
          description: '',
          type: 'LICENSE_RENEWAL',
          dueDate: '',
          priority: 'MEDIUM'
        })
        fetchComplianceItems()
      }
    } catch (error) {
      console.error('Failed to create compliance item:', error)
    }
  }

  const handleUpdateComplianceItem = async (itemId: string, updates: any) => {
    try {
      const response = await fetch(`/api/compliance/${itemId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      })

      if (response.ok) {
        fetchComplianceItems()
      }
    } catch (error) {
      console.error('Failed to update compliance item:', error)
    }
  }

  const filteredItems = complianceItems.filter(item =>
    item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.description.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getDaysUntilDue = (dueDate: string) => {
    const due = new Date(dueDate)
    const now = new Date()
    const diffTime = due.getTime() - now.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  const getOverdueItems = () => {
    return complianceItems.filter(item => {
      const daysUntilDue = getDaysUntilDue(item.dueDate)
      return daysUntilDue < 0 && item.status !== 'COMPLETED'
    })
  }

  const getUpcomingItems = () => {
    return complianceItems.filter(item => {
      const daysUntilDue = getDaysUntilDue(item.dueDate)
      return daysUntilDue >= 0 && daysUntilDue <= 30 && item.status !== 'COMPLETED'
    })
  }

  const getCompletionRate = () => {
    if (complianceItems.length === 0) return 0
    const completed = complianceItems.filter(item => item.status === 'COMPLETED').length
    return (completed / complianceItems.length) * 100
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading compliance items...</p>
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
                <Shield className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-semibold text-gray-900">Compliance & Alerts</h1>
                <p className="text-sm text-gray-500">Manage your business compliance requirements</p>
              </div>
            </div>
            <Button onClick={() => setShowAddDialog(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Compliance Item
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Items</p>
                  <p className="text-2xl font-bold">{complianceItems.length}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <FileText className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Overdue</p>
                  <p className="text-2xl font-bold text-red-600">{getOverdueItems().length}</p>
                </div>
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6 text-red-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Upcoming (30 days)</p>
                  <p className="text-2xl font-bold text-orange-600">{getUpcomingItems().length}</p>
                </div>
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Completion Rate</p>
                  <p className="text-2xl font-bold text-green-600">{Math.round(getCompletionRate())}%</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6 text-green-600" />
                </div>
              </div>
              <Progress value={getCompletionRate()} className="mt-2 h-2" />
            </CardContent>
          </Card>
        </div>

        {/* Alerts Section */}
        {(getOverdueItems().length > 0 || getUpcomingItems().length > 0) && (
          <div className="mb-8 space-y-4">
            {getOverdueItems().length > 0 && (
              <Card className="border-red-200 bg-red-50">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <AlertTriangle className="w-5 h-5 text-red-600" />
                    <div>
                      <h4 className="font-semibold text-red-800">Overdue Items</h4>
                      <p className="text-sm text-red-600">
                        You have {getOverdueItems().length} overdue compliance item(s) that require immediate attention
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {getUpcomingItems().length > 0 && (
              <Card className="border-orange-200 bg-orange-50">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-orange-600" />
                    <div>
                      <h4 className="font-semibold text-orange-800">Upcoming Deadlines</h4>
                      <p className="text-sm text-orange-600">
                        {getUpcomingItems().length} item(s) due in the next 30 days
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        <Tabs defaultValue="items" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="items">Compliance Items</TabsTrigger>
            <TabsTrigger value="calendar">Calendar View</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
          </TabsList>

          <TabsContent value="items" className="space-y-6">
            {/* Filters */}
            <Card>
              <CardContent className="p-4">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="Search compliance items..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-full md:w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="PENDING">Pending</SelectItem>
                      <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                      <SelectItem value="COMPLETED">Completed</SelectItem>
                      <SelectItem value="OVERDUE">Overdue</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={typeFilter} onValueChange={setTypeFilter}>
                    <SelectTrigger className="w-full md:w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      {complianceTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Compliance Items List */}
            <div className="space-y-4">
              {filteredItems.map((item) => {
                const daysUntilDue = getDaysUntilDue(item.dueDate)
                const TypeIcon = complianceTypes.find(t => t.value === item.type)?.icon || Shield
                const isOverdue = daysUntilDue < 0 && item.status !== 'COMPLETED'

                return (
                  <Card key={item.id} className={`${isOverdue ? 'border-red-200' : ''}`}>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-4 flex-1">
                          <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                            isOverdue ? 'bg-red-100' : 'bg-gray-100'
                          }`}>
                            <TypeIcon className={`w-6 h-6 ${
                              isOverdue ? 'text-red-600' : 'text-gray-600'
                            }`} />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="font-semibold text-lg">{item.title}</h3>
                              <Badge className={statusColors[item.status]}>
                                {item.status.replace('_', ' ')}
                              </Badge>
                              <Badge className={priorityColors[item.priority]}>
                                {item.priority}
                              </Badge>
                            </div>
                            <p className="text-gray-600 mb-3">{item.description}</p>
                            <div className="flex items-center gap-4 text-sm text-gray-500">
                              <div className="flex items-center gap-1">
                                <Calendar className="w-4 h-4" />
                                <span>Due: {new Date(item.dueDate).toLocaleDateString()}</span>
                                {isOverdue && (
                                  <span className="text-red-600 font-medium">
                                    ({Math.abs(daysUntilDue)} days overdue)
                                  </span>
                                )}
                                {!isOverdue && daysUntilDue <= 30 && (
                                  <span className="text-orange-600 font-medium">
                                    (in {daysUntilDue} days)
                                  </span>
                                )}
                              </div>
                              <div className="flex items-center gap-1">
                                <Flag className="w-4 h-4" />
                                <span>{complianceTypes.find(t => t.value === item.type)?.label}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="ghost" size="sm" onClick={() => setSelectedItem(item)}>
                                <Eye className="w-4 h-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                              {selectedItem && (
                                <>
                                  <DialogHeader>
                                    <DialogTitle className="flex items-center gap-3">
                                      <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                                        selectedItem.status === 'COMPLETED' ? 'bg-green-100' : 'bg-gray-100'
                                      }`}>
                                        <TypeIcon className={`w-6 h-6 ${
                                          selectedItem.status === 'COMPLETED' ? 'text-green-600' : 'text-gray-600'
                                        }`} />
                                      </div>
                                      <div>
                                        <div className="font-semibold text-xl">{selectedItem.title}</div>
                                        <div className="flex items-center gap-2">
                                          <Badge className={statusColors[selectedItem.status]}>
                                            {selectedItem.status.replace('_', ' ')}
                                          </Badge>
                                          <Badge className={priorityColors[selectedItem.priority]}>
                                            {selectedItem.priority}
                                          </Badge>
                                        </div>
                                      </div>
                                    </DialogTitle>
                                    <DialogDescription>
                                      {selectedItem.description}
                                    </DialogDescription>
                                  </DialogHeader>

                                  <Tabs defaultValue="details" className="w-full">
                                    <TabsList className="grid w-full grid-cols-3">
                                      <TabsTrigger value="details">Details</TabsTrigger>
                                      <TabsTrigger value="requirements">Requirements</TabsTrigger>
                                      <TabsTrigger value="progress">Progress</TabsTrigger>
                                    </TabsList>

                                    <TabsContent value="details" className="space-y-4">
                                      <div className="grid grid-cols-2 gap-4">
                                        <div>
                                          <span className="text-sm text-gray-500">Type</span>
                                          <p className="font-medium">{complianceTypes.find(t => t.value === selectedItem.type)?.label}</p>
                                        </div>
                                        <div>
                                          <span className="text-sm text-gray-500">Priority</span>
                                          <p className="font-medium">{selectedItem.priority}</p>
                                        </div>
                                        <div>
                                          <span className="text-sm text-gray-500">Due Date</span>
                                          <p className="font-medium">{new Date(selectedItem.dueDate).toLocaleDateString()}</p>
                                        </div>
                                        <div>
                                          <span className="text-sm text-gray-500">Status</span>
                                          <Badge className={statusColors[selectedItem.status]}>
                                            {selectedItem.status.replace('_', ' ')}
                                          </Badge>
                                        </div>
                                      </div>

                                      {selectedItem.notes && (
                                        <div>
                                          <span className="text-sm text-gray-500">Notes</span>
                                          <p className="text-sm text-gray-600 mt-1">{selectedItem.notes}</p>
                                        </div>
                                      )}
                                    </TabsContent>

                                    <TabsContent value="requirements" className="space-y-4">
                                      <div>
                                        <h4 className="font-semibold mb-3">Required Documents</h4>
                                        <div className="space-y-2">
                                          {selectedItem.documents?.map((doc, index) => (
                                            <div key={index} className="flex items-center justify-between p-3 border rounded">
                                              <span className="text-sm font-medium">{doc.name}</span>
                                              <Badge variant={doc.status === 'UPLOADED' ? 'default' : 'secondary'}>
                                                {doc.status}
                                              </Badge>
                                            </div>
                                          ))}
                                        </div>
                                      </div>
                                    </TabsContent>

                                    <TabsContent value="progress" className="space-y-4">
                                      <div>
                                        <h4 className="font-semibold mb-3">Progress Checklist</h4>
                                        <div className="space-y-2">
                                          {selectedItem.checklist?.map((task, index) => (
                                            <div key={index} className="flex items-center gap-3">
                                              <Checkbox checked={task.completed} disabled />
                                              <span className={`text-sm ${task.completed ? 'line-through text-gray-500' : ''}`}>
                                                {task.item}
                                              </span>
                                            </div>
                                          ))}
                                        </div>
                                      </div>
                                    </TabsContent>
                                  </Tabs>
                                </>
                              )}
                            </DialogContent>
                          </Dialog>

                          {selectedItem.status !== 'COMPLETED' && (
                            <Select
                              value={selectedItem.status}
                              onValueChange={(value) => handleUpdateComplianceItem(item.id, { status: value })}
                            >
                              <SelectTrigger className="w-32">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="PENDING">Pending</SelectItem>
                                <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                                <SelectItem value="COMPLETED">Completed</SelectItem>
                              </SelectContent>
                            </Select>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>

            {filteredItems.length === 0 && (
              <div className="text-center py-12">
                <Shield className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No compliance items found</h3>
                <p className="text-gray-600">Try adjusting your search criteria or add a new compliance item</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="calendar" className="space-y-6">
            <Card>
              <CardContent className="p-8 text-center">
                <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Calendar View</h3>
                <p className="text-gray-600">Calendar view with compliance deadlines will be available soon</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reports" className="space-y-6">
            <Card>
              <CardContent className="p-8 text-center">
                <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Compliance Reports</h3>
                <p className="text-gray-600">Detailed compliance reports and analytics will be available soon</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Add Compliance Item Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Compliance Item</DialogTitle>
            <DialogDescription>
              Add a new compliance requirement to track
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={newItem.title}
                onChange={(e) => setNewItem(prev => ({ ...prev, title: e.target.value }))}
                placeholder="e.g., Trade License Renewal"
              />
            </div>

            <div>
              <Label htmlFor="type">Type</Label>
              <Select value={newItem.type} onValueChange={(value) => setNewItem(prev => ({ ...prev, type: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {complianceTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={newItem.description}
                onChange={(e) => setNewItem(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Describe the compliance requirement..."
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="dueDate">Due Date</Label>
                <Input
                  id="dueDate"
                  type="date"
                  value={newItem.dueDate}
                  onChange={(e) => setNewItem(prev => ({ ...prev, dueDate: e.target.value }))}
                />
              </div>

              <div>
                <Label htmlFor="priority">Priority</Label>
                <Select value={newItem.priority} onValueChange={(value) => setNewItem(prev => ({ ...prev, priority: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="LOW">Low</SelectItem>
                    <SelectItem value="MEDIUM">Medium</SelectItem>
                    <SelectItem value="HIGH">High</SelectItem>
                    <SelectItem value="URGENT">Urgent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setShowAddDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateComplianceItem}>
                Add Item
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}