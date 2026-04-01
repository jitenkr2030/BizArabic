import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { z } from 'zod'

const createApplicationSchema = z.object({
  companyId: z.string(),
  businessName: z.string().min(2),
  legalForm: z.string(),
  industry: z.string(),
  description: z.string().optional(),
  estimatedBudget: z.number().optional()
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = createApplicationSchema.parse(body)

    // For now, we'll use a temporary user ID
    // In a real app, you'd get this from JWT token
    const userId = 'temp-user-id'

    // Generate unique application number
    const applicationNumber = `BIZ-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`

    // Create business application
    const application = await db.businessApplication.create({
      data: {
        companyId: validatedData.companyId,
        userId,
        applicationNumber,
        currentStep: 1,
        totalSteps: 6,
        status: 'DRAFT'
      },
      include: {
        company: true,
        checklists: true,
        timeline: true
      }
    })

    // Create initial checklist items
    const checklistItems = [
      { step: 1, item: 'Choose target country and business type' },
      { step: 2, item: 'Upload required documents' },
      { step: 3, item: 'Complete business information' },
      { step: 4, item: 'Review and confirm details' },
      { step: 5, item: 'Make payment' },
      { step: 6, item: 'Submit application' }
    ]

    await db.applicationChecklist.createMany({
      data: checklistItems.map(item => ({
        applicationId: application.id,
        step: item.step,
        item: item.item
      }))
    })

    // Create initial timeline entry
    await db.applicationTimeline.create({
      data: {
        applicationId: application.id,
        event: 'Application Created',
        description: `Business application ${applicationNumber} created successfully`,
        createdBy: userId
      }
    })

    return NextResponse.json({
      message: 'Application created successfully',
      application
    })

  } catch (error) {
    console.error('Application creation error:', error)
    
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

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const userId = 'temp-user-id' // Would get from JWT token

    const applications = await db.businessApplication.findMany({
      where: {
        userId,
        ...(status && { status: status as any })
      },
      include: {
        company: true,
        checklists: {
          orderBy: { step: 'asc' }
        },
        timeline: {
          orderBy: { createdAt: 'desc' },
          take: 5
        },
        payments: {
          orderBy: { createdAt: 'desc' },
          take: 3
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json({ applications })

  } catch (error) {
    console.error('Applications list error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}