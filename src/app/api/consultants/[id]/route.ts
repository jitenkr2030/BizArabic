import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { z } from 'zod'

const createLeadSchema = z.object({
  consultantId: z.string(),
  companyId: z.string().optional(),
  userId: z.string(),
  value: z.number().optional(),
  notes: z.string().optional()
})

const createReviewSchema = z.object({
  rating: z.number().min(1).max(5),
  review: z.string().optional()
})

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const consultantId = params.id
    const body = await request.json()
    
    // Handle different POST operations
    if (body.type === 'review') {
      const validatedData = createReviewSchema.parse(body)
      
      // In a real app, you would create a review
      return NextResponse.json({
        message: 'Review submitted successfully',
        review: {
          id: 'new-review-id',
          consultantId,
          userId: 'temp-user-id',
          rating: validatedData.rating,
          review: validatedData.review,
          createdAt: new Date().toISOString()
        }
      })
    } else if (body.type === 'contact') {
      // Handle contact request
      return NextResponse.json({
        message: 'Contact request sent successfully',
        request: {
          id: 'new-contact-id',
          consultantId,
          userId: 'temp-user-id',
          message: body.message,
          status: 'PENDING',
          createdAt: new Date().toISOString()
        }
      })
    } else {
      // Default: create lead
      const validatedData = createLeadSchema.parse(body)
      
      return NextResponse.json({
        message: 'Lead created successfully',
        lead: {
          id: 'new-lead-id',
          ...validatedData,
          status: 'ASSIGNED',
          assignedAt: new Date().toISOString(),
          createdAt: new Date().toISOString()
        }
      })
    }

  } catch (error) {
    console.error('Consultant action error:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const consultantId = params.id

    // Mock consultant details - in real app, fetch from database
    const consultant = {
      id: consultantId,
      user: {
        id: consultantId,
        name: 'Ahmed Hassan',
        email: 'ahmed@bizarabic.com',
        avatar: null
      },
      specialization: ['UAE Free Zone', 'Technology Sector', 'Startups'],
      experience: '8',
      bio: 'Expert in UAE Free Zone company formation with 8+ years of experience helping tech startups establish their presence in the region.',
      rating: 4.8,
      reviewCount: 47,
      commissionRate: 10,
      totalEarnings: 125000,
      available: true,
      languages: ['English', 'Arabic', 'Hindi'],
      certifications: ['UAE Business Formation Certified', 'Free Zone Specialist'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      // Additional details
      companies: [
        { id: '1', name: 'Tech Solutions LLC', status: 'ACTIVE' },
        { id: '2', name: 'Digital Innovations', status: 'UNDER_REVIEW' }
      ],
      leads: [
        { id: '1', companyName: 'Startup XYZ', status: 'CONTACTED', value: 25000 },
        { id: '2', companyName: 'Innovation Labs', status: 'CONVERTED', value: 45000 }
      ],
      reviews: [
        { id: '1', userId: 'user1', rating: 5, review: 'Excellent service!', createdAt: '2024-01-15' },
        { id: '2', userId: 'user2', rating: 4, review: 'Very knowledgeable and helpful.', createdAt: '2024-01-10' }
      ]
    }

    return NextResponse.json({ consultant })

  } catch (error) {
    console.error('Consultant fetch error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}