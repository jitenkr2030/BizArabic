'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle2, 
  Circle, 
  Building2, 
  FileText, 
  CreditCard, 
  Send,
  AlertCircle,
  Clock,
  MapPin,
  Briefcase,
  Users,
  DollarSign,
  Upload
} from 'lucide-react'

interface Application {
  id: string
  applicationNumber: string
  currentStep: number
  totalSteps: number
  status: string
  company: {
    name: string
    country: string
    businessType: string
    industry: string
  }
  checklists: Array<{
    id: string
    step: number
    item: string
    isCompleted: boolean
    completedAt?: string
    notes?: string
  }>
}

const workflowSteps = [
  {
    step: 1,
    title: 'Choose Country & Business Type',
    description: 'Select your target country and business structure',
    icon: MapPin,
    required: ['country', 'businessType']
  },
  {
    step: 2,
    title: 'Upload Documents',
    description: 'Upload all required documents for verification',
    icon: Upload,
    required: ['passport', 'addressProof']
  },
  {
    step: 3,
    title: 'Business Information',
    description: 'Provide detailed business information and plans',
    icon: Briefcase,
    required: ['businessName', 'legalForm', 'industry']
  },
  {
    step: 4,
    title: 'Review & Confirm',
    description: 'Review all information and confirm accuracy',
    icon: FileText,
    required: []
  },
  {
    step: 5,
    title: 'Payment',
    description: 'Complete payment for processing fees',
    icon: CreditCard,
    required: ['payment']
  },
  {
    step: 6,
    title: 'Submit Application',
    description: 'Submit your application for processing',
    icon: Send,
    required: []
  }
]

const countries = [
  { code: 'UAE', name: 'United Arab Emirates', flag: '🇦🇪' },
  { code: 'SAUDI', name: 'Saudi Arabia', flag: '🇸🇦' },
  { code: 'QATAR', name: 'Qatar', flag: '🇶🇦' },
  { code: 'OMAN', name: 'Oman', flag: '🇴🇲' },
  { code: 'BAHRAIN', name: 'Bahrain', flag: '🇧🇭' }
]

const businessTypes = [
  { code: 'FREE_ZONE', name: 'Free Zone', description: '100% foreign ownership, tax benefits' },
  { code: 'MAINLAND', name: 'Mainland', description: 'Access to local market' },
  { code: 'OFFSHORE', name: 'Offshore', description: 'International business, tax optimization' }
]

export default function BusinessRegistrationWorkflow() {
  const [application, setApplication] = useState<Application | null>(null)
  const [currentStep, setCurrentStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    // Step 1
    country: '',
    businessType: '',
    // Step 3
    businessName: '',
    legalForm: '',
    industry: '',
    description: '',
    estimatedBudget: ''
  })
  const [checklistItems, setChecklistItems] = useState<any[]>([])

  useEffect(() => {
    // For demo, create a new application
    createNewApplication()
  }, [])

  const createNewApplication = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          companyId: 'temp-company-id',
          businessName: 'Demo Business',
          legalForm: 'LLC',
          industry: 'Technology',
          description: 'Demo business application'
        })
      })

      if (response.ok) {
        const data = await response.json()
        setApplication(data.application)
        setChecklistItems(data.application.checklists)
      }
    } catch (error) {
      console.error('Failed to create application:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateApplication = async (updates: any) => {
    if (!application) return

    try {
      const response = await fetch(`/api/applications/${application.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      })

      if (response.ok) {
        const data = await response.json()
        setApplication(data.application)
      }
    } catch (error) {
      console.error('Failed to update application:', error)
    }
  }

  const updateChecklistItem = async (checklistId: string, isCompleted: boolean, notes?: string) => {
    try {
      const response = await fetch(`/api/applications/${application?.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'checklist',
          checklistId,
          isCompleted,
          notes
        })
      })

      if (response.ok) {
        const data = await response.json()
        setApplication(data.application)
        setChecklistItems(data.application.checklists)
      }
    } catch (error) {
      console.error('Failed to update checklist:', error)
    }
  }

  const handleNext = () => {
    if (currentStep < 6) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = async () => {
    if (!application) return

    setLoading(true)
    try {
      await updateApplication({
        status: 'SUBMITTED',
        notes: 'Application submitted for review'
      })
    } finally {
      setLoading(false)
    }
  }

  const getCurrentStepChecklist = () => {
    return checklistItems.filter(item => item.step === currentStep)
  }

  const isStepComplete = (step: number) => {
    const stepChecklist = checklistItems.filter(item => item.step === step)
    return stepChecklist.every(item => item.isCompleted)
  }

  const canProceedToNext = () => {
    const currentChecklist = getCurrentStepChecklist()
    return currentChecklist.every(item => item.isCompleted)
  }

  if (loading || !application) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading application...</p>
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
                <Building2 className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-semibold text-gray-900">Business Registration</h1>
                <p className="text-sm text-gray-500">Application #{application.applicationNumber}</p>
              </div>
            </div>
            <Badge className={application.status === 'DRAFT' ? 'bg-gray-100 text-gray-800' : 'bg-blue-100 text-blue-800'}>
              {application.status.replace('_', ' ')}
            </Badge>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Progress Overview */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">Application Progress</h2>
              <div className="text-sm text-gray-500">
                Step {currentStep} of {application.totalSteps}
              </div>
            </div>
            
            {/* Step Progress */}
            <div className="grid grid-cols-6 gap-4 mb-6">
              {workflowSteps.map((step) => {
                const Icon = step.icon
                const isCompleted = isStepComplete(step.step)
                const isCurrent = step.step === currentStep
                
                return (
                  <div key={step.step} className="text-center">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2 ${
                      isCompleted ? 'bg-green-500 text-white' : 
                      isCurrent ? 'bg-blue-500 text-white' : 
                      'bg-gray-200 text-gray-500'
                    }`}>
                      {isCompleted ? <CheckCircle2 className="w-6 h-6" /> : <Icon className="w-6 h-6" />}
                    </div>
                    <div className="text-xs font-medium">{step.step}</div>
                  </div>
                )
              })}
            </div>

            <Progress value={(currentStep / application.totalSteps) * 100} className="h-2" />
            
            <div className="mt-4">
              <h3 className="font-medium mb-2">
                {workflowSteps[currentStep - 1].title}
              </h3>
              <p className="text-sm text-gray-600">
                {workflowSteps[currentStep - 1].description}
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Step {currentStep}: {workflowSteps[currentStep - 1].title}</CardTitle>
                <CardDescription>
                  {workflowSteps[currentStep - 1].description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* Step 1: Country & Business Type */}
                {currentStep === 1 && (
                  <div className="space-y-6">
                    <div>
                      <Label htmlFor="country">Target Country</Label>
                      <Select value={formData.country} onValueChange={(value) => setFormData(prev => ({ ...prev, country: value }))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select your target country" />
                        </SelectTrigger>
                        <SelectContent>
                          {countries.map((country) => (
                            <SelectItem key={country.code} value={country.code}>
                              <div className="flex items-center gap-2">
                                <span>{country.flag}</span>
                                <span>{country.name}</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="businessType">Business Type</Label>
                      <Select value={formData.businessType} onValueChange={(value) => setFormData(prev => ({ ...prev, businessType: value }))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select business type" />
                        </SelectTrigger>
                        <SelectContent>
                          {businessTypes.map((type) => (
                            <SelectItem key={type.code} value={type.code}>
                              <div>
                                <div className="font-medium">{type.name}</div>
                                <div className="text-sm text-gray-500">{type.description}</div>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                )}

                {/* Step 2: Documents */}
                {currentStep === 2 && (
                  <div className="space-y-6">
                    <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
                      <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600 mb-2">Upload Required Documents</p>
                      <p className="text-sm text-gray-500 mb-4">Passport, Address Proof, etc.</p>
                      <Button>Choose Files</Button>
                    </div>
                    <div className="text-sm text-gray-600">
                      <p className="font-medium mb-2">Required Documents:</p>
                      <ul className="list-disc list-inside space-y-1">
                        <li>Passport copy</li>
                        <li>Address proof</li>
                        <li>Photograph</li>
                        <li>Business plan (if applicable)</li>
                      </ul>
                    </div>
                  </div>
                )}

                {/* Step 3: Business Information */}
                {currentStep === 3 && (
                  <div className="space-y-6">
                    <div>
                      <Label htmlFor="businessName">Business Name</Label>
                      <Input
                        id="businessName"
                        value={formData.businessName}
                        onChange={(e) => setFormData(prev => ({ ...prev, businessName: e.target.value }))}
                        placeholder="Enter your business name"
                      />
                    </div>

                    <div>
                      <Label htmlFor="legalForm">Legal Form</Label>
                      <Select value={formData.legalForm} onValueChange={(value) => setFormData(prev => ({ ...prev, legalForm: value }))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select legal form" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="LLC">LLC (Limited Liability Company)</SelectItem>
                          <SelectItem value="SOLE_PROPRIETORSHIP">Sole Proprietorship</SelectItem>
                          <SelectItem value="PARTNERSHIP">Partnership</SelectItem>
                          <SelectItem value="BRANCH">Branch of Foreign Company</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="industry">Industry</Label>
                      <Input
                        id="industry"
                        value={formData.industry}
                        onChange={(e) => setFormData(prev => ({ ...prev, industry: e.target.value }))}
                        placeholder="e.g., Technology, Trading, Consulting"
                      />
                    </div>

                    <div>
                      <Label htmlFor="description">Business Description</Label>
                      <Textarea
                        id="description"
                        value={formData.description}
                        onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                        placeholder="Describe your business activities..."
                        rows={4}
                      />
                    </div>

                    <div>
                      <Label htmlFor="estimatedBudget">Estimated Budget (USD)</Label>
                      <Input
                        id="estimatedBudget"
                        type="number"
                        value={formData.estimatedBudget}
                        onChange={(e) => setFormData(prev => ({ ...prev, estimatedBudget: e.target.value }))}
                        placeholder="e.g., 50000"
                      />
                    </div>
                  </div>
                )}

                {/* Step 4: Review */}
                {currentStep === 4 && (
                  <div className="space-y-6">
                    <div className="bg-gray-50 p-6 rounded-lg">
                      <h3 className="font-semibold mb-4">Business Details</h3>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-500">Business Name:</span>
                          <p className="font-medium">{formData.businessName || 'Not specified'}</p>
                        </div>
                        <div>
                          <span className="text-gray-500">Legal Form:</span>
                          <p className="font-medium">{formData.legalForm || 'Not specified'}</p>
                        </div>
                        <div>
                          <span className="text-gray-500">Country:</span>
                          <p className="font-medium">{countries.find(c => c.code === formData.country)?.name || 'Not selected'}</p>
                        </div>
                        <div>
                          <span className="text-gray-500">Business Type:</span>
                          <p className="font-medium">{businessTypes.find(t => t.code === formData.businessType)?.name || 'Not selected'}</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
                      <div className="flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
                        <div>
                          <h4 className="font-medium text-yellow-800">Review Important</h4>
                          <p className="text-sm text-yellow-700 mt-1">
                            Please review all information carefully. Once submitted, some details cannot be changed.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 5: Payment */}
                {currentStep === 5 && (
                  <div className="space-y-6">
                    <div className="text-center py-8">
                      <DollarSign className="w-16 h-16 text-green-600 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold mb-2">Complete Payment</h3>
                      <p className="text-gray-600 mb-6">Processing fee: $2,500</p>
                      <Button size="lg" className="bg-green-600 hover:bg-green-700">
                        Proceed to Payment
                      </Button>
                    </div>
                  </div>
                )}

                {/* Step 6: Submit */}
                {currentStep === 6 && (
                  <div className="space-y-6">
                    <div className="text-center py-8">
                      <Send className="w-16 h-16 text-blue-600 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold mb-2">Ready to Submit</h3>
                      <p className="text-gray-600 mb-6">
                        Your application is complete and ready for review. Click submit to send it for processing.
                      </p>
                      <Button size="lg" onClick={handleSubmit} disabled={loading}>
                        {loading ? 'Submitting...' : 'Submit Application'}
                      </Button>
                    </div>
                  </div>
                )}

                {/* Navigation */}
                <div className="flex justify-between mt-8">
                  <Button
                    variant="outline"
                    onClick={handlePrevious}
                    disabled={currentStep === 1}
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Previous
                  </Button>
                  
                  {currentStep < 6 ? (
                    <Button
                      onClick={handleNext}
                      disabled={!canProceedToNext()}
                    >
                      Next
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  ) : null}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Checklist */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="text-lg">Step Checklist</CardTitle>
                <CardDescription>
                  Complete all items to proceed
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {getCurrentStepChecklist().map((item) => (
                    <div key={item.id} className="flex items-start gap-3">
                      <Checkbox
                        checked={item.isCompleted}
                        onCheckedChange={(checked) => 
                          updateChecklistItem(item.id, checked as boolean)
                        }
                      />
                      <div className="flex-1">
                        <p className="text-sm font-medium">{item.item}</p>
                        {item.notes && (
                          <p className="text-xs text-gray-500 mt-1">{item.notes}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Application Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Application Info</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <span className="text-sm text-gray-500">Application Number</span>
                  <p className="font-medium">{application.applicationNumber}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Status</span>
                  <Badge className="ml-2">{application.status.replace('_', ' ')}</Badge>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Progress</span>
                  <div className="mt-1">
                    <Progress value={(currentStep / 6) * 100} className="h-2" />
                    <p className="text-xs text-gray-500 mt-1">{currentStep} of 6 steps</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}