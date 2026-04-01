'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { 
  CreditCard, 
  DollarSign, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  XCircle, 
  AlertCircle,
  TrendingUp,
  Users,
  FileText,
  Crown,
  Zap,
  Building,
  Star,
  ArrowRight
} from 'lucide-react'

interface Payment {
  id: string
  invoiceNumber: string
  amount: number
  currency: string
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED' | 'REFUNDED' | 'CANCELLED'
  paymentMethod?: string
  description: string
  dueDate: string
  paidAt?: string
  createdAt: string
  application?: {
    id: string
    company: {
      name: string
    }
  }
}

const subscriptionPlans = [
  {
    name: 'FREE',
    price: 0,
    period: 'month',
    icon: Users,
    color: 'bg-gray-500',
    features: [
      'Basic cost calculator',
      'Limited document uploads',
      'Community support',
      'Basic country information'
    ],
    current: true
  },
  {
    name: 'BASIC',
    price: 999,
    period: 'month',
    icon: FileText,
    color: 'bg-blue-500',
    features: [
      'Full cost calculator',
      'Unlimited document uploads',
      'Email support',
      'Document templates',
      'Application tracking'
    ],
    popular: true
  },
  {
    name: 'PRO',
    price: 2999,
    period: 'month',
    icon: Zap,
    color: 'bg-purple-500',
    features: [
      'All Basic features',
      'AI Business Advisor',
      'Priority support',
      'Advanced analytics',
      'Consultant matching',
      'Compliance alerts'
    ]
  },
  {
    name: 'ENTERPRISE',
    price: 4999,
    period: 'month',
    icon: Crown,
    color: 'bg-yellow-500',
    features: [
      'All Pro features',
      'Dedicated consultant',
      'Custom solutions',
      'API access',
      'White-label options',
      'Priority processing'
    ]
  }
]

export default function PaymentBilling() {
  const [payments, setPayments] = useState<Payment[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedPlan, setSelectedPlan] = useState('')
  const [upgrading, setUpgrading] = useState(false)
  const [statusFilter, setStatusFilter] = useState('all')
  const [currentSubscription, setCurrentSubscription] = useState('FREE')

  useEffect(() => {
    fetchPayments()
  }, [])

  const fetchPayments = async () => {
    try {
      const response = await fetch('/api/payments')
      if (response.ok) {
        const data = await response.json()
        setPayments(data.payments)
      }
    } catch (error) {
      console.error('Failed to fetch payments:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleUpgradeSubscription = async (plan: string) => {
    setUpgrading(true)
    try {
      const response = await fetch('/api/payments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'subscription',
          plan
        })
      })

      if (response.ok) {
        const data = await response.json()
        setCurrentSubscription(plan)
        // Show success message
        alert(`Successfully upgraded to ${plan} plan!`)
      }
    } catch (error) {
      console.error('Failed to upgrade subscription:', error)
    } finally {
      setUpgrading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED': return 'bg-green-100 text-green-800'
      case 'PENDING': return 'bg-yellow-100 text-yellow-800'
      case 'PROCESSING': return 'bg-blue-100 text-blue-800'
      case 'FAILED': return 'bg-red-100 text-red-800'
      case 'REFUNDED': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'COMPLETED': return CheckCircle2
      case 'PENDING': return Clock
      case 'PROCESSING': return AlertCircle
      case 'FAILED': return XCircle
      default: return FileText
    }
  }

  const filteredPayments = payments.filter(payment => 
    statusFilter === 'all' || payment.status === statusFilter
  )

  const totalSpent = payments
    .filter(p => p.status === 'COMPLETED')
    .reduce((sum, p) => sum + p.amount, 0)

  const pendingPayments = payments.filter(p => p.status === 'PENDING')
  const overduePayments = pendingPayments.filter(p => 
    new Date(p.dueDate) < new Date()
  )

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading payment information...</p>
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
                <CreditCard className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-semibold text-gray-900">Payment & Billing</h1>
                <p className="text-sm text-gray-500">Manage your subscription and payments</p>
              </div>
            </div>
            <Badge variant="outline" className="text-green-600 border-green-600">
              Current Plan: {currentSubscription}
            </Badge>
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
                  <p className="text-sm font-medium text-gray-600">Total Spent</p>
                  <p className="text-2xl font-bold">AED {totalSpent.toLocaleString()}</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Pending Payments</p>
                  <p className="text-2xl font-bold">{pendingPayments.length}</p>
                </div>
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <Clock className="w-6 h-6 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Overdue</p>
                  <p className="text-2xl font-bold text-red-600">{overduePayments.length}</p>
                </div>
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                  <AlertCircle className="w-6 h-6 text-red-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Current Plan</p>
                  <p className="text-2xl font-bold">{currentSubscription}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Crown className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="plans" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="plans">Subscription Plans</TabsTrigger>
            <TabsTrigger value="payments">Payment History</TabsTrigger>
            <TabsTrigger value="billing">Billing Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="plans" className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-2">Choose Your Plan</h2>
              <p className="text-gray-600">Upgrade your plan to access more features and grow your business faster.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {subscriptionPlans.map((plan) => {
                const Icon = plan.icon
                const isCurrentPlan = plan.name === currentSubscription
                
                return (
                  <Card key={plan.name} className={`relative ${plan.popular ? 'border-2 border-blue-500' : ''} ${isCurrentPlan ? 'ring-2 ring-green-500' : ''}`}>
                    {plan.popular && (
                      <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-blue-500">
                        Most Popular
                      </Badge>
                    )}
                    {isCurrentPlan && (
                      <Badge className="absolute -top-3 right-4 bg-green-500">
                        Current Plan
                      </Badge>
                    )}
                    <CardHeader className="text-center">
                      <div className={`w-16 h-16 ${plan.color} rounded-2xl flex items-center justify-center mx-auto mb-4`}>
                        <Icon className="w-8 h-8 text-white" />
                      </div>
                      <CardTitle className="text-2xl">{plan.name}</CardTitle>
                      <div className="mt-4">
                        <span className="text-4xl font-bold">AED {plan.price}</span>
                        <span className="text-gray-500">/{plan.period}</span>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <ul className="space-y-3">
                        {plan.features.map((feature, index) => (
                          <li key={index} className="flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
                            <span className="text-sm">{feature}</span>
                          </li>
                        ))}
                      </ul>
                      
                      <Button 
                        className="w-full" 
                        variant={isCurrentPlan ? "outline" : "default"}
                        disabled={isCurrentPlan || upgrading}
                        onClick={() => !isCurrentPlan && handleUpgradeSubscription(plan.name)}
                      >
                        {isCurrentPlan ? 'Current Plan' : upgrading ? 'Upgrading...' : `Upgrade to ${plan.name}`}
                      </Button>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </TabsContent>

          <TabsContent value="payments" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold mb-2">Payment History</h2>
                <p className="text-gray-600">View and manage all your payments and invoices</p>
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="PENDING">Pending</SelectItem>
                  <SelectItem value="COMPLETED">Completed</SelectItem>
                  <SelectItem value="FAILED">Failed</SelectItem>
                  <SelectItem value="REFUNDED">Refunded</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-4">
              {filteredPayments.map((payment) => {
                const StatusIcon = getStatusIcon(payment.status)
                return (
                  <Card key={payment.id}>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                            payment.status === 'COMPLETED' ? 'bg-green-100' : 'bg-gray-100'
                          }`}>
                            <StatusIcon className={`w-6 h-6 ${
                              payment.status === 'COMPLETED' ? 'text-green-600' : 'text-gray-600'
                            }`} />
                          </div>
                          <div>
                            <p className="font-semibold">{payment.description}</p>
                            <p className="text-sm text-gray-500">
                              Invoice #{payment.invoiceNumber}
                              {payment.application && ` • ${payment.application.company.name}`}
                            </p>
                            <p className="text-xs text-gray-400">
                              Due: {new Date(payment.dueDate).toLocaleDateString()}
                              {payment.paidAt && ` • Paid: ${new Date(payment.paidAt).toLocaleDateString()}`}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-xl font-bold">AED {payment.amount.toLocaleString()}</p>
                          <Badge className={getStatusColor(payment.status)}>
                            {payment.status}
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>

            {filteredPayments.length === 0 && (
              <div className="text-center py-12">
                <CreditCard className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No payments found</h3>
                <p className="text-gray-600">Your payment history will appear here</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="billing" className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-2">Billing Settings</h2>
              <p className="text-gray-600">Manage your payment methods and billing preferences</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Payment Methods</CardTitle>
                  <CardDescription>Add and manage your payment methods</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="border rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <CreditCard className="w-5 h-5 text-gray-600" />
                        <div>
                          <p className="font-medium">•••• •••• •••• 4242</p>
                          <p className="text-sm text-gray-500">Expires 12/25</p>
                        </div>
                      </div>
                      <Badge variant="outline">Default</Badge>
                    </div>
                  </div>
                  
                  <Button variant="outline" className="w-full">
                    <CreditCard className="w-4 h-4 mr-2" />
                    Add Payment Method
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Billing Preferences</CardTitle>
                  <CardDescription>Configure your billing settings</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="email">Billing Email</Label>
                    <Input id="email" type="email" defaultValue="user@example.com" />
                  </div>
                  
                  <div>
                    <Label htmlFor="currency">Preferred Currency</Label>
                    <Select defaultValue="AED">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="AED">AED - UAE Dirham</SelectItem>
                        <SelectItem value="SAR">SAR - Saudi Riyal</SelectItem>
                        <SelectItem value="USD">USD - US Dollar</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="auto-renew" defaultChecked className="rounded" />
                    <Label htmlFor="auto-renew" className="text-sm">
                      Auto-renew subscription
                    </Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="notifications" defaultChecked className="rounded" />
                    <Label htmlFor="notifications" className="text-sm">
                      Email notifications for payments
                    </Label>
                  </div>

                  <Button className="w-full">Save Preferences</Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}