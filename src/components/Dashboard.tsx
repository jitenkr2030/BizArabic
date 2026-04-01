'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Building2, 
  FileText, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  Plus,
  TrendingUp,
  DollarSign,
  Users,
  Calendar,
  Calculator,
  MessageCircle
} from 'lucide-react'

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('overview')

  // Mock data - in real app, this would come from API
  const stats = {
    totalApplications: 3,
    activeCompanies: 2,
    pendingTasks: 5,
    totalSpent: 45750
  }

  const applications = [
    {
      id: '1',
      companyName: 'Tech Solutions LLC',
      country: '🇦🇪 UAE',
      businessType: 'Free Zone',
      status: 'UNDER_REVIEW',
      currentStep: 4,
      totalSteps: 6,
      submittedAt: '2024-01-15',
      estimatedCost: 25000
    },
    {
      id: '2',
      companyName: 'Global Trading Co',
      country: '🇸🇦 Saudi',
      businessType: 'Mainland',
      status: 'APPROVED',
      currentStep: 6,
      totalSteps: 6,
      submittedAt: '2024-01-10',
      estimatedCost: 32000
    },
    {
      id: '3',
      companyName: 'Digital Services Ltd',
      country: '🇶🇦 Qatar',
      businessType: 'Free Zone',
      status: 'DRAFT',
      currentStep: 1,
      totalSteps: 6,
      submittedAt: null,
      estimatedCost: 22000
    }
  ]

  const recentActivity = [
    {
      id: '1',
      type: 'application_update',
      title: 'Tech Solutions LLC - Document Verification',
      description: 'Your passport has been verified successfully',
      time: '2 hours ago',
      icon: CheckCircle2,
      color: 'text-green-600'
    },
    {
      id: '2',
      type: 'payment_due',
      title: 'Payment Due - Global Trading Co',
      description: 'Visa fee payment of SAR 3,500 is due',
      time: '1 day ago',
      icon: DollarSign,
      color: 'text-orange-600'
    },
    {
      id: '3',
      type: 'system',
      title: 'New Consultant Available',
      description: 'Expert in Saudi mainland business is now available',
      time: '2 days ago',
      icon: Users,
      color: 'text-blue-600'
    }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'APPROVED': return 'bg-green-100 text-green-800'
      case 'UNDER_REVIEW': return 'bg-blue-100 text-blue-800'
      case 'DRAFT': return 'bg-gray-100 text-gray-800'
      case 'REJECTED': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'APPROVED': return CheckCircle2
      case 'UNDER_REVIEW': return Clock
      case 'DRAFT': return FileText
      case 'REJECTED': return AlertCircle
      default: return FileText
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <Building2 className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold">BizArabic</span>
              </div>
              <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline">
                <Calendar className="w-4 h-4 mr-2" />
                Schedule Consultation
              </Button>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                New Application
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Applications</p>
                  <p className="text-2xl font-bold">{stats.totalApplications}</p>
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
                  <p className="text-sm font-medium text-gray-600">Active Companies</p>
                  <p className="text-2xl font-bold">{stats.activeCompanies}</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <Building2 className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Pending Tasks</p>
                  <p className="text-2xl font-bold">{stats.pendingTasks}</p>
                </div>
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Clock className="w-6 h-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Spent</p>
                  <p className="text-2xl font-bold">AED {stats.totalSpent.toLocaleString()}</p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="applications">Applications</TabsTrigger>
            <TabsTrigger value="activity">Recent Activity</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Applications */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Applications</CardTitle>
                  <CardDescription>Your latest business registration applications</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {applications.slice(0, 3).map((app) => {
                    const StatusIcon = getStatusIcon(app.status)
                    return (
                      <div key={app.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                            <Building2 className="w-5 h-5 text-gray-600" />
                          </div>
                          <div>
                            <p className="font-medium">{app.companyName}</p>
                            <p className="text-sm text-gray-500">{app.country} • {app.businessType}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge className={getStatusColor(app.status)}>
                            <StatusIcon className="w-3 h-3 mr-1" />
                            {app.status.replace('_', ' ')}
                          </Badge>
                        </div>
                      </div>
                    )
                  })}
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                  <CardDescription>Common tasks and resources</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button variant="outline" className="w-full justify-start">
                    <Calculator className="w-4 h-4 mr-3" />
                    Calculate Business Setup Costs
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <MessageCircle className="w-4 h-4 mr-3" />
                    Chat with AI Business Advisor
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <FileText className="w-4 h-4 mr-3" />
                    Upload Required Documents
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Users className="w-4 h-4 mr-3" />
                    Find Local Consultant
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Calendar className="w-4 h-4 mr-3" />
                    Schedule Consultation Call
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="applications" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">Business Applications</h2>
                <p className="text-gray-600">Track and manage all your business registration applications</p>
              </div>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                New Application
              </Button>
            </div>

            <div className="grid gap-6">
              {applications.map((app) => {
                const StatusIcon = getStatusIcon(app.status)
                const progressPercentage = (app.currentStep / app.totalSteps) * 100
                
                return (
                  <Card key={app.id}>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                            <Building2 className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold">{app.companyName}</h3>
                            <p className="text-gray-600">{app.country} • {app.businessType}</p>
                            <p className="text-sm text-gray-500">
                              {app.submittedAt ? `Submitted: ${new Date(app.submittedAt).toLocaleDateString()}` : 'Not submitted yet'}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge className={getStatusColor(app.status)}>
                            <StatusIcon className="w-3 h-3 mr-1" />
                            {app.status.replace('_', ' ')}
                          </Badge>
                          <p className="text-sm text-gray-500 mt-1">
                            Est. Cost: AED {app.estimatedCost.toLocaleString()}
                          </p>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span>Progress</span>
                          <span>Step {app.currentStep} of {app.totalSteps}</span>
                        </div>
                        <Progress value={progressPercentage} className="h-2" />
                      </div>

                      <div className="flex items-center gap-2 mt-4">
                        <Button variant="outline" size="sm">View Details</Button>
                        <Button variant="outline" size="sm">Documents</Button>
                        <Button variant="outline" size="sm">Messages</Button>
                        {app.status === 'DRAFT' && (
                          <Button size="sm">Continue Application</Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </TabsContent>

          <TabsContent value="activity" className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-2">Recent Activity</h2>
              <p className="text-gray-600">Stay updated with your latest business activities</p>
            </div>

            <div className="space-y-4">
              {recentActivity.map((activity) => {
                const Icon = activity.icon
                return (
                  <Card key={activity.id}>
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${activity.color} bg-opacity-10`}>
                          <Icon className={`w-5 h-5 ${activity.color}`} />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium">{activity.title}</h4>
                          <p className="text-sm text-gray-600">{activity.description}</p>
                          <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

import { Calculator } from 'lucide-react'