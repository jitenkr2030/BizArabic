'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import { Calculator, TrendingUp, Building2, Users, FileText, Shield } from 'lucide-react'

interface CostCalculation {
  country: string
  businessType: string
  currency: string
  costs: {
    licenseFee: number
    visaFee: number
    officeFee: number
    governmentFees: number
    agentFee: number
    totalCost: number
  }
  breakdown: {
    licenseFee: { amount: number; description: string }
    visaFee: { amount: number; description: string }
    officeFee: { amount: number; description: string }
    governmentFees: { amount: number; description: string }
    agentFee: { amount: number; description: string }
  }
}

export default function CostCalculator() {
  const [country, setCountry] = useState('UAE')
  const [businessType, setBusinessType] = useState('FREE_ZONE')
  const [employees, setEmployees] = useState([1])
  const [officeRequired, setOfficeRequired] = useState(true)
  const [visaRequired, setVisaRequired] = useState(true)
  const [calculation, setCalculation] = useState<CostCalculation | null>(null)
  const [loading, setLoading] = useState(false)

  const countries = [
    { code: 'UAE', name: 'United Arab Emirates', flag: '🇦🇪' },
    { code: 'SAUDI', name: 'Saudi Arabia', flag: '🇸🇦' },
    { code: 'QATAR', name: 'Qatar', flag: '🇶🇦' },
    { code: 'OMAN', name: 'Oman', flag: '🇴🇲' },
    { code: 'BAHRAIN', name: 'Bahrain', flag: '🇧🇭' }
  ]

  const businessTypes = [
    { 
      code: 'FREE_ZONE', 
      name: 'Free Zone', 
      description: '100% foreign ownership, tax benefits',
      icon: Building2,
      popular: true
    },
    { 
      code: 'MAINLAND', 
      name: 'Mainland', 
      description: 'Access to local market',
      icon: TrendingUp,
      popular: false
    },
    { 
      code: 'OFFSHORE', 
      name: 'Offshore', 
      description: 'International business, tax optimization',
      icon: Shield,
      popular: false
    }
  ]

  const calculateCosts = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/calculator', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          country,
          businessType,
          employees: employees[0],
          officeRequired,
          visaRequired
        })
      })

      if (response.ok) {
        const data = await response.json()
        setCalculation(data.calculation)
      }
    } catch (error) {
      console.error('Calculation error:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    calculateCosts()
  }, [country, businessType, employees, officeRequired, visaRequired])

  return (
    <div className="w-full max-w-6xl mx-auto p-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-4">Business Setup Cost Calculator</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Get instant, accurate cost estimates for setting up your business in Arab countries.
          Our calculator includes all fees, taxes, and requirements.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Calculator Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="w-5 h-5" />
              Configure Your Business
            </CardTitle>
            <CardDescription>
              Select your preferences to get accurate cost estimates
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Country Selection */}
            <div className="space-y-3">
              <Label className="text-base font-medium">Target Country</Label>
              <div className="grid grid-cols-2 gap-3">
                {countries.map((c) => (
                  <Button
                    key={c.code}
                    variant={country === c.code ? "default" : "outline"}
                    className="h-auto p-3 justify-start"
                    onClick={() => setCountry(c.code)}
                  >
                    <span className="text-xl mr-2">{c.flag}</span>
                    <div className="text-left">
                      <div className="font-medium">{c.name.split(' ')[0]}</div>
                      <div className="text-xs opacity-70">{c.code}</div>
                    </div>
                  </Button>
                ))}
              </div>
            </div>

            {/* Business Type Selection */}
            <div className="space-y-3">
              <Label className="text-base font-medium">Business Type</Label>
              <div className="space-y-2">
                {businessTypes.map((type) => {
                  const Icon = type.icon
                  return (
                    <Button
                      key={type.code}
                      variant={businessType === type.code ? "default" : "outline"}
                      className="w-full h-auto p-3 justify-start"
                      onClick={() => setBusinessType(type.code)}
                    >
                      <Icon className="w-4 h-4 mr-3" />
                      <div className="text-left">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{type.name}</span>
                          {type.popular && (
                            <Badge variant="secondary" className="text-xs">Popular</Badge>
                          )}
                        </div>
                        <div className="text-xs opacity-70">{type.description}</div>
                      </div>
                    </Button>
                  )
                })}
              </div>
            </div>

            {/* Employees Slider */}
            <div className="space-y-3">
              <Label className="text-base font-medium">
                Number of Employees: <span className="text-blue-600">{employees[0]}</span>
              </Label>
              <Slider
                value={employees}
                onValueChange={setEmployees}
                max={10}
                min={1}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500">
                <span>1</span>
                <span>5</span>
                <span>10</span>
              </div>
            </div>

            {/* Options */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base font-medium">Office Required</Label>
                  <p className="text-sm text-gray-500">Physical office space for business registration</p>
                </div>
                <Switch
                  checked={officeRequired}
                  onCheckedChange={setOfficeRequired}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base font-medium">Visa Required</Label>
                  <p className="text-sm text-gray-500">Residence visas for employees</p>
                </div>
                <Switch
                  checked={visaRequired}
                  onCheckedChange={setVisaRequired}
                />
              </div>
            </div>

            <Button 
              onClick={calculateCosts} 
              disabled={loading}
              className="w-full"
              size="lg"
            >
              {loading ? 'Calculating...' : 'Update Calculation'}
            </Button>
          </CardContent>
        </Card>

        {/* Results */}
        <div className="space-y-6">
          {calculation && (
            <>
              {/* Total Cost Card */}
              <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                <CardContent className="p-6">
                  <div className="text-center">
                    <p className="text-blue-100 mb-2">Estimated Total Cost</p>
                    <p className="text-4xl font-bold mb-4">
                      {calculation.currency} {calculation.costs.totalCost.toLocaleString()}
                    </p>
                    <p className="text-sm text-blue-100">
                      Valid until {new Date(calculation.validUntil).toLocaleDateString()}
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Cost Breakdown */}
              <Card>
                <CardHeader>
                  <CardTitle>Cost Breakdown</CardTitle>
                  <CardDescription>Detailed breakdown of all fees and charges</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {Object.entries(calculation.breakdown).map(([key, item]) => (
                    <div key={key} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                          {key === 'licenseFee' && <Building2 className="w-4 h-4 text-gray-600" />}
                          {key === 'visaFee' && <Users className="w-4 h-4 text-gray-600" />}
                          {key === 'officeFee' && <Building2 className="w-4 h-4 text-gray-600" />}
                          {key === 'governmentFees' && <FileText className="w-4 h-4 text-gray-600" />}
                          {key === 'agentFee' && <Calculator className="w-4 h-4 text-gray-600" />}
                        </div>
                        <div>
                          <p className="font-medium capitalize">
                            {key.replace(/([A-Z])/g, ' $1').trim()}
                          </p>
                          <p className="text-sm text-gray-500">{item.description}</p>
                        </div>
                      </div>
                      <p className="font-semibold">
                        {calculation.currency} {item.amount.toLocaleString()}
                      </p>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Next Steps */}
              <Card>
                <CardHeader>
                  <CardTitle>Ready to Get Started?</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button className="w-full">
                    Start Application Process
                  </Button>
                  <Button variant="outline" className="w-full">
                    Schedule Consultation
                  </Button>
                  <Button variant="outline" className="w-full">
                    Download Detailed Report
                  </Button>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </div>
    </div>
  )
}