'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import CostCalculator from '@/components/CostCalculator'
import { 
  Building2, 
  Globe, 
  Calculator, 
  MessageCircle, 
  FileText, 
  Users, 
  CheckCircle2, 
  TrendingUp,
  Shield,
  Clock,
  DollarSign,
  ArrowRight,
  Star,
  MapPin,
  Briefcase,
  Award
} from 'lucide-react'

export default function Home() {
  const [selectedCountry, setSelectedCountry] = useState('UAE')
  const [showCalculator, setShowCalculator] = useState(false)

  const countries = [
    { code: 'UAE', name: 'United Arab Emirates', flag: '🇦🇪' },
    { code: 'SAUDI', name: 'Saudi Arabia', flag: '🇸🇦' },
    { code: 'QATAR', name: 'Qatar', flag: '🇶🇦' },
    { code: 'OMAN', name: 'Oman', flag: '🇴🇲' },
    { code: 'BAHRAIN', name: 'Bahrain', flag: '🇧🇭' }
  ]

  const features = [
    {
      icon: Building2,
      title: 'Multi-Country Support',
      description: 'Start your business in UAE, Saudi, Qatar, Oman, or Bahrain with localized guidance.'
    },
    {
      icon: Calculator,
      title: 'Real-time Cost Calculator',
      description: 'Get instant calculations for license fees, visa costs, and office requirements.'
    },
    {
      icon: MessageCircle,
      title: 'AI Business Advisor',
      description: 'Chat with our AI assistant to get personalized recommendations and answers.'
    },
    {
      icon: FileText,
      title: 'Document Management',
      description: 'Upload, track, and manage all your business registration documents in one place.'
    },
    {
      icon: Users,
      title: 'Expert Consultant Network',
      description: 'Connect with verified business consultants who specialize in your target country.'
    },
    {
      icon: Shield,
      title: 'Compliance & Alerts',
      description: 'Never miss important deadlines with automated renewal reminders and compliance alerts.'
    }
  ]

  const businessTypes = [
    {
      type: 'Free Zone',
      description: '100% foreign ownership, tax benefits, simplified setup',
      benefits: ['No corporate tax', 'Full repatriation', 'No currency restrictions'],
      popular: true
    },
    {
      type: 'Mainland',
      description: 'Access to local market, government contracts, trade licenses',
      benefits: ['Trade with local market', 'Government projects', 'Multiple visas'],
      popular: false
    },
    {
      type: 'Offshore',
      description: 'International business, asset protection, tax optimization',
      benefits: ['Tax optimization', 'Asset protection', 'Privacy'],
      popular: false
    }
  ]

  const stats = [
    { label: 'Businesses Registered', value: '2,500+', icon: Building2 },
    { label: 'Expert Consultants', value: '150+', icon: Users },
    { label: 'Countries Covered', value: '5', icon: Globe },
    { label: 'Success Rate', value: '98%', icon: TrendingUp }
  ]

  const testimonials = [
    {
      name: 'Ahmed Hassan',
      role: 'Tech Entrepreneur',
      content: 'BizArabic made setting up my UAE company incredibly simple. The AI advisor helped me choose the right free zone, and the cost calculator was spot on.',
      rating: 5,
      country: '🇦🇪 UAE'
    },
    {
      name: 'Sarah Johnson',
      role: 'Consulting Firm Owner',
      content: 'The consultant network connected me with the perfect local partner in Saudi Arabia. My business was registered in just 3 weeks!',
      rating: 5,
      country: '🇸🇦 Saudi'
    },
    {
      name: 'Mohammed Al-Rashid',
      role: 'Import/Export Business',
      content: 'The compliance alerts saved me thousands in potential fines. I never miss a renewal deadline anymore.',
      rating: 5,
      country: '🇶🇦 Qatar'
    }
  ]

  if (showCalculator) {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white border-b sticky top-0 z-50">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Building2 className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                BizArabic
              </span>
            </div>
            <Button variant="outline" onClick={() => setShowCalculator(false)}>
              ← Back to Home
            </Button>
          </div>
        </header>
        <div className="py-8">
          <CostCalculator />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <Building2 className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              BizArabic
            </span>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <Button variant="ghost">Features</Button>
            <Button variant="ghost">Pricing</Button>
            <Button variant="ghost">About</Button>
            <Button variant="ghost">Contact</Button>
          </nav>
          <div className="flex items-center gap-3">
            <Button variant="outline">Sign In</Button>
            <Button>Get Started</Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center max-w-4xl">
          <Badge className="mb-4 bg-purple-100 text-purple-800 hover:bg-purple-100">
            🚀 Now Supporting 5 Arab Countries
          </Badge>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Start Your Business in Arab Countries
            <br />
            <span className="text-3xl md:text-4xl text-gray-900">Without Confusion</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            Complete business setup solution for UAE, Saudi Arabia, Qatar, Oman, and Bahrain. 
            From company registration to compliance management - all in one platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
              Start Free Application
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Button size="lg" variant="outline" onClick={() => setShowCalculator(true)}>
              <Calculator className="mr-2 w-5 h-5" />
              Calculate Costs
            </Button>
          </div>

          {/* Country Selector */}
          <div className="bg-white rounded-2xl shadow-lg p-6 max-w-2xl mx-auto">
            <h3 className="text-lg font-semibold mb-4">Choose Your Target Country</h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {countries.map((country) => (
                <Button
                  key={country.code}
                  variant={selectedCountry === country.code ? "default" : "outline"}
                  className="h-auto p-3 flex flex-col gap-1"
                  onClick={() => setSelectedCountry(country.code)}
                >
                  <span className="text-2xl">{country.flag}</span>
                  <span className="text-xs">{country.name.split(' ')[0]}</span>
                </Button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="flex justify-center mb-2">
                  <stat.icon className="w-8 h-8" />
                </div>
                <div className="text-3xl font-bold mb-1">{stat.value}</div>
                <div className="text-blue-100">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Everything You Need to Succeed</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              From initial planning to ongoing compliance, we've got you covered every step of the way.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center mb-4">
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle>{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Business Types Section */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Choose Your Business Type</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Select the right business structure for your goals and requirements.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {businessTypes.map((type, index) => (
              <Card key={index} className={`relative ${type.popular ? 'border-2 border-blue-500' : ''}`}>
                {type.popular && (
                  <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-blue-500">
                    Most Popular
                  </Badge>
                )}
                <CardHeader className="text-center">
                  <CardTitle className="text-2xl">{type.type}</CardTitle>
                  <p className="text-gray-600">{type.description}</p>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 mb-6">
                    {type.benefits.map((benefit, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
                        <span className="text-sm">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                  <Button className="w-full" variant={type.popular ? "default" : "outline"}>
                    Learn More
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-bold mb-4">Ready to Start Your Business?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto text-blue-100">
            Join thousands of entrepreneurs who have successfully launched their businesses in Arab countries.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" className="bg-white text-blue-600 hover:bg-gray-100">
              Start Your Application
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600" onClick={() => setShowCalculator(true)}>
              Calculate Costs
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <Building2 className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold">BizArabic</span>
              </div>
              <p className="text-gray-400">
                Your complete business setup solution for Arab countries.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Button variant="link" className="text-gray-400 hover:text-white p-0">Features</Button></li>
                <li><Button variant="link" className="text-gray-400 hover:text-white p-0">Pricing</Button></li>
                <li><Button variant="link" className="text-gray-400 hover:text-white p-0">Success Stories</Button></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Button variant="link" className="text-gray-400 hover:text-white p-0">Business Guides</Button></li>
                <li><Button variant="link" className="text-gray-400 hover:text-white p-0">Country Info</Button></li>
                <li><Button variant="link" className="text-gray-400 hover:text-white p-0">Blog</Button></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Button variant="link" className="text-gray-400 hover:text-white p-0">About Us</Button></li>
                <li><Button variant="link" className="text-gray-400 hover:text-white p-0">Contact</Button></li>
                <li><Button variant="link" className="text-gray-400 hover:text-white p-0">Support</Button></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
            <p>&copy; 2024 BizArabic. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}