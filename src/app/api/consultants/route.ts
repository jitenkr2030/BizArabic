import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { z } from 'zod'

// Mock consultants data - in real app, this would come from database
const mockConsultants = [
  {
    id: '1',
    user: {
      id: '1',
      name: 'Ahmed Hassan',
      email: 'ahmed@bizarabic.com',
      avatar: null
    },
    specialization: '["UAE Free Zone", "Technology Sector", "Startups"]',
    experience: '8',
    bio: 'Expert in UAE Free Zone company formation with 8+ years of experience helping tech startups establish their presence in the region.',
    rating: 4.8,
    reviewCount: 47,
    commissionRate: 10,
    totalEarnings: 125000,
    available: true,
    languages: '["English", "Arabic", "Hindi"]',
    certifications: '["UAE Business Formation Certified", "Free Zone Specialist"]',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '2',
    user: {
      id: '2',
      name: 'Sarah Johnson',
      email: 'sarah@bizarabic.com',
      avatar: null
    },
    specialization: '["Saudi Mainland", "Trading Business", "Manufacturing"]',
    experience: '12',
    bio: 'Specialist in Saudi mainland business setup with extensive experience in trading and manufacturing sectors.',
    rating: 4.9,
    reviewCount: 63,
    commissionRate: 12,
    totalEarnings: 187000,
    available: true,
    languages: '["English", "Arabic"]',
    certifications: '["Saudi Business Law Certified", "Investment Advisor"]',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '3',
    user: {
      id: '3',
      name: 'Mohammed Al-Rashid',
      email: 'mohammed@bizarabic.com',
      avatar: null
    },
    specialization: '["Qatar Free Zone", "Finance Sector", "Professional Services"]',
    experience: '6',
    bio: 'Qatar business formation expert with focus on finance and professional services companies.',
    rating: 4.7,
    reviewCount: 31,
    commissionRate: 10,
    totalEarnings: 89000,
    available: false,
    languages: '["English", "Arabic", "French"]',
    certifications: '["Qatar Financial Center Certified", "Professional Services Specialist"]',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '4',
    user: {
      id: '4',
      name: 'Fatima Al-Mansouri',
      email: 'fatima@bizarabic.com',
      avatar: null
    },
    specialization: '["Oman Business Setup", "Tourism & Hospitality", "Retail"]',
    experience: '10',
    bio: 'Oman business specialist with expertise in tourism, hospitality, and retail sectors.',
    rating: 4.6,
    reviewCount: 28,
    commissionRate: 8,
    totalEarnings: 95000,
    available: true,
    languages: '["English", "Arabic", "German"]',
    certifications: '["Oman Business Formation Certified", "Tourism Sector Specialist"]',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '5',
    user: {
      id: '5',
      name: 'Khalid Mahmoud',
      email: 'khalid@bizarabic.com',
      avatar: null
    },
    specialization: '["Bahrain FinTech", "Offshore Companies", "Investment Funds"]',
    experience: '15',
    bio: 'Senior consultant with 15+ years of experience in Bahrain FinTech and offshore company formation.',
    rating: 4.9,
    reviewCount: 82,
    commissionRate: 15,
    totalEarnings: 245000,
    available: true,
    languages: '["English", "Arabic", "Urdu"]',
    certifications: '["Bahrain FinTech Certified", "Offshore Specialist", "Investment Fund Advisor"]',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
]

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const country = searchParams.get('country')
    const specialization = searchParams.get('specialization')
    const available = searchParams.get('available')

    let filteredConsultants = mockConsultants

    // Filter by country/specialization
    if (country || specialization) {
      filteredConsultants = filteredConsultants.filter(consultant => {
        const specs = JSON.parse(consultant.specialization)
        const countryMatch = !country || specs.some((spec: string) => 
          spec.toLowerCase().includes(country.toLowerCase())
        )
        const specMatch = !specialization || specs.some((spec: string) => 
          spec.toLowerCase().includes(specialization.toLowerCase())
        )
        return countryMatch && specMatch
      })
    }

    // Filter by availability
    if (available === 'true') {
      filteredConsultants = filteredConsultants.filter(consultant => consultant.available)
    }

    // Transform the data to match expected format
    const transformedConsultants = filteredConsultants.map(consultant => ({
      ...consultant,
      specialization: JSON.parse(consultant.specialization),
      languages: JSON.parse(consultant.languages),
      certifications: JSON.parse(consultant.certifications)
    }))

    return NextResponse.json({ consultants: transformedConsultants })

  } catch (error) {
    console.error('Consultants fetch error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // In a real app, you would create a new consultant profile
    // For now, we'll just return success
    return NextResponse.json({
      message: 'Consultant profile created successfully',
      consultant: {
        id: 'new-consultant-id',
        ...body
      }
    })

  } catch (error) {
    console.error('Consultant creation error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}