'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Search, 
  Star, 
  MapPin, 
  Users, 
  DollarSign, 
  Award,
  MessageCircle,
  Calendar,
  CheckCircle2,
  Clock,
  Filter,
  Briefcase,
  Globe,
  Phone,
  Mail,
  Send
} from 'lucide-react'

interface Consultant {
  id: string
  user: {
    id: string
    name: string
    email: string
    avatar: string | null
  }
  specialization: string[]
  experience: string
  bio: string
  rating: number
  reviewCount: number
  commissionRate: number
  totalEarnings: number
  available: boolean
  languages: string[]
  certifications: string[]
  companies?: Array<{
    id: string
    name: string
    status: string
  }>
  leads?: Array<{
    id: string
    companyName: string
    status: string
    value: number
  }>
  reviews?: Array<{
    id: string
    userId: string
    rating: number
    review: string
    createdAt: string
  }>
}

const countries = [
  { code: 'UAE', name: 'UAE' },
  { code: 'SAUDI', name: 'Saudi Arabia' },
  { code: 'QATAR', name: 'Qatar' },
  { code: 'OMAN', name: 'Oman' },
  { code: 'BAHRAIN', name: 'Bahrain' }
]

const specializations = [
  'Free Zone',
  'Mainland',
  'Technology',
  'Trading',
  'Manufacturing',
  'Finance',
  'Tourism',
  'Professional Services',
  'FinTech',
  'Offshore'
]

export default function PartnerNetwork() {
  const [consultants, setConsultants] = useState<Consultant[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCountry, setSelectedCountry] = useState('')
  const [selectedSpecialization, setSelectedSpecialization] = useState('')
  const [availableOnly, setAvailableOnly] = useState(false)
  const [selectedConsultant, setSelectedConsultant] = useState<Consultant | null>(null)
  const [contactMessage, setContactMessage] = useState('')
  const [contacting, setContacting] = useState(false)

  useEffect(() => {
    fetchConsultants()
  }, [selectedCountry, selectedSpecialization, availableOnly])

  const fetchConsultants = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (selectedCountry) params.append('country', selectedCountry)
      if (selectedSpecialization) params.append('specialization', selectedSpecialization)
      if (availableOnly) params.append('available', 'true')

      const response = await fetch(`/api/consultants?${params}`)
      if (response.ok) {
        const data = await response.json()
        setConsultants(data.consultants)
      }
    } catch (error) {
      console.error('Failed to fetch consultants:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleContactConsultant = async (consultantId: string) => {
    if (!contactMessage.trim()) return

    setContacting(true)
    try {
      const response = await fetch(`/api/consultants/${consultantId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'contact',
          message: contactMessage
        })
      })

      if (response.ok) {
        setContactMessage('')
        // Show success message
        alert('Message sent successfully!')
      }
    } catch (error) {
      console.error('Failed to send message:', error)
    } finally {
      setContacting(false)
    }
  }

  const handleCreateLead = async (consultantId: string) => {
    try {
      const response = await fetch(`/api/consultants/${consultantId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'lead',
          companyId: 'temp-company-id',
          userId: 'temp-user-id',
          value: 30000,
          notes: 'Interested in business setup services'
        })
      })

      if (response.ok) {
        alert('Lead created successfully! The consultant will contact you soon.')
      }
    } catch (error) {
      console.error('Failed to create lead:', error)
    }
  }

  const filteredConsultants = consultants.filter(consultant =>
    consultant.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    consultant.specialization.some(spec => spec.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
      />
    ))
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading consultants...</p>
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
                <Users className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-semibold text-gray-900">Expert Consultants</h1>
                <p className="text-sm text-gray-500">Connect with verified business setup experts</p>
              </div>
            </div>
            <Button>
              <Briefcase className="w-4 h-4 mr-2" />
              Become a Consultant
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Search and Filters */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="grid lg:grid-cols-4 gap-4">
              <div className="lg:col-span-1">
                <Label htmlFor="search">Search Consultants</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    id="search"
                    placeholder="Search by name or expertise..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="country">Country</Label>
                <Select value={selectedCountry} onValueChange={setSelectedCountry}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Countries" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Countries</SelectItem>
                    {countries.map((country) => (
                      <SelectItem key={country.code} value={country.code}>
                        {country.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="specialization">Specialization</Label>
                <Select value={selectedSpecialization} onValueChange={setSelectedSpecialization}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Specializations" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Specializations</SelectItem>
                    {specializations.map((spec) => (
                      <SelectItem key={spec} value={spec}>
                        {spec}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-end">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="available"
                    checked={availableOnly}
                    onChange={(e) => setAvailableOnly(e.target.checked)}
                    className="rounded border-gray-300"
                  />
                  <Label htmlFor="available" className="text-sm">Available Only</Label>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-blue-600">{consultants.length}</div>
              <div className="text-sm text-gray-500">Total Consultants</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-green-600">
                {consultants.filter(c => c.available).length}
              </div>
              <div className="text-sm text-gray-500">Available Now</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-purple-600">
                {consultants.reduce((sum, c) => sum + c.reviewCount, 0)}
              </div>
              <div className="text-sm text-gray-500">Total Reviews</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-orange-600">
                {Math.round(consultants.reduce((sum, c) => sum + c.rating, 0) / consultants.length * 10) / 10}
              </div>
              <div className="text-sm text-gray-500">Avg Rating</div>
            </CardContent>
          </Card>
        </div>

        {/* Consultants Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredConsultants.map((consultant) => (
            <Card key={consultant.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-semibold text-lg">
                        {consultant.user.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div>
                      <CardTitle className="text-lg">{consultant.user.name}</CardTitle>
                      <div className="flex items-center gap-1">
                        {renderStars(Math.round(consultant.rating))}
                        <span className="text-sm text-gray-500 ml-1">
                          ({consultant.reviewCount})
                        </span>
                      </div>
                    </div>
                  </div>
                  <Badge variant={consultant.available ? 'default' : 'secondary'}>
                    {consultant.available ? 'Available' : 'Busy'}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600 line-clamp-2">{consultant.bio}</p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Briefcase className="w-4 h-4 text-gray-500" />
                    <span>{consultant.experience} years experience</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="w-4 h-4 text-gray-500" />
                    <span>{consultant.specialization.slice(0, 2).join(', ')}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Globe className="w-4 h-4 text-gray-500" />
                    <span>{consultant.languages.slice(0, 2).join(', ')}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <DollarSign className="w-4 h-4 text-gray-500" />
                    <span>{consultant.commissionRate}% commission</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1">
                  {consultant.specialization.slice(0, 3).map((spec, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {spec}
                    </Badge>
                  ))}
                  {consultant.specialization.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{consultant.specialization.length - 3} more
                    </Badge>
                  )}
                </div>

                <div className="flex gap-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" className="flex-1" onClick={() => setSelectedConsultant(consultant)}>
                        <Users className="w-4 h-4 mr-2" />
                        View Profile
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                      {selectedConsultant && (
                        <>
                          <DialogHeader>
                            <DialogTitle className="flex items-center gap-3">
                              <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                                <span className="text-white font-bold text-xl">
                                  {selectedConsultant.user.name.split(' ').map(n => n[0]).join('')}
                                </span>
                              </div>
                              <div>
                                <div className="font-semibold text-xl">{selectedConsultant.user.name}</div>
                                <div className="flex items-center gap-1">
                                  {renderStars(Math.round(selectedConsultant.rating))}
                                  <span className="text-sm text-gray-500">
                                    ({selectedConsultant.reviewCount} reviews)
                                  </span>
                                </div>
                              </div>
                            </DialogTitle>
                            <DialogDescription>
                              Expert business setup consultant
                            </DialogDescription>
                          </DialogHeader>

                          <Tabs defaultValue="about" className="w-full">
                            <TabsList className="grid w-full grid-cols-4">
                              <TabsTrigger value="about">About</TabsTrigger>
                              <TabsTrigger value="expertise">Expertise</TabsTrigger>
                              <TabsTrigger value="reviews">Reviews</TabsTrigger>
                              <TabsTrigger value="contact">Contact</TabsTrigger>
                            </TabsList>

                            <TabsContent value="about" className="space-y-4">
                              <div>
                                <h4 className="font-semibold mb-2">Profile</h4>
                                <p className="text-gray-600">{selectedConsultant.bio}</p>
                              </div>

                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <span className="text-sm text-gray-500">Experience</span>
                                  <p className="font-medium">{selectedConsultant.experience} years</p>
                                </div>
                                <div>
                                  <span className="text-sm text-gray-500">Commission Rate</span>
                                  <p className="font-medium">{selectedConsultant.commissionRate}%</p>
                                </div>
                                <div>
                                  <span className="text-sm text-gray-500">Total Earnings</span>
                                  <p className="font-medium">${selectedConsultant.totalEarnings.toLocaleString()}</p>
                                </div>
                                <div>
                                  <span className="text-sm text-gray-500">Status</span>
                                  <p className="font-medium">{selectedConsultant.available ? 'Available' : 'Busy'}</p>
                                </div>
                              </div>

                              <div>
                                <h4 className="font-semibold mb-2">Languages</h4>
                                <div className="flex flex-wrap gap-2">
                                  {selectedConsultant.languages.map((lang, index) => (
                                    <Badge key={index} variant="outline">{lang}</Badge>
                                  ))}
                                </div>
                              </div>
                            </TabsContent>

                            <TabsContent value="expertise" className="space-y-4">
                              <div>
                                <h4 className="font-semibold mb-2">Specializations</h4>
                                <div className="flex flex-wrap gap-2">
                                  {selectedConsultant.specialization.map((spec, index) => (
                                    <Badge key={index}>{spec}</Badge>
                                  ))}
                                </div>
                              </div>

                              <div>
                                <h4 className="font-semibold mb-2">Certifications</h4>
                                <ul className="space-y-1">
                                  {selectedConsultant.certifications.map((cert, index) => (
                                    <li key={index} className="flex items-center gap-2 text-sm">
                                      <Award className="w-4 h-4 text-green-600" />
                                      {cert}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            </TabsContent>

                            <TabsContent value="reviews" className="space-y-4">
                              {selectedConsultant.reviews?.map((review) => (
                                <div key={review.id} className="border-b pb-3">
                                  <div className="flex items-center gap-2 mb-2">
                                    {renderStars(review.rating)}
                                    <span className="text-sm text-gray-500">
                                      {new Date(review.createdAt).toLocaleDateString()}
                                    </span>
                                  </div>
                                  <p className="text-sm text-gray-600">{review.review}</p>
                                </div>
                              ))}
                            </TabsContent>

                            <TabsContent value="contact" className="space-y-4">
                              <div>
                                <h4 className="font-semibold mb-2">Send Message</h4>
                                <Textarea
                                  placeholder="Describe your business requirements and how this consultant can help you..."
                                  value={contactMessage}
                                  onChange={(e) => setContactMessage(e.target.value)}
                                  rows={4}
                                />
                                <Button 
                                  className="w-full mt-2"
                                  onClick={() => handleContactConsultant(selectedConsultant.id)}
                                  disabled={contacting || !contactMessage.trim()}
                                >
                                  {contacting ? 'Sending...' : 'Send Message'}
                                </Button>
                              </div>

                              <div className="border-t pt-4">
                                <h4 className="font-semibold mb-2">Contact Information</h4>
                                <div className="space-y-2 text-sm">
                                  <div className="flex items-center gap-2">
                                    <Mail className="w-4 h-4 text-gray-500" />
                                    <span>{selectedConsultant.user.email}</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Phone className="w-4 h-4 text-gray-500" />
                                    <span>+966-XXX-XXXX</span>
                                  </div>
                                </div>
                              </div>
                            </TabsContent>
                          </Tabs>
                        </>
                      )}
                    </DialogContent>
                  </Dialog>

                  <Button 
                    className="flex-1"
                    onClick={() => handleCreateLead(consultant.id)}
                  >
                    <Send className="w-4 h-4 mr-2" />
                    Get Help
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredConsultants.length === 0 && (
          <div className="text-center py-12">
            <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No consultants found</h3>
            <p className="text-gray-600">Try adjusting your search criteria or filters</p>
          </div>
        )}
      </div>
    </div>
  )
}