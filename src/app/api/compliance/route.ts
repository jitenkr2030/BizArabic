import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { z } from 'zod'

const createComplianceItemSchema = z.object({
  companyId: z.string(),
  title: z.string(),
  description: z.string(),
  type: z.enum(['LICENSE_RENEWAL', 'VISA_RENEWAL', 'ANNUAL_AUDIT', 'TAX_FILING', 'OTHER']),
  dueDate: z.string(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']).default('MEDIUM')
})

// Mock compliance data
const mockComplianceItems = [
  {
    id: '1',
    companyId: 'company-1',
    title: 'Trade License Renewal',
    description: 'Annual trade license renewal for UAE Free Zone company',
    type: 'LICENSE_RENEWAL',
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'PENDING',
    priority: 'HIGH',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '2',
    companyId: 'company-1',
    title: 'Employee Visa Renewal',
    description: 'Renewal of residence visa for 2 employees',
    type: 'VISA_RENEWAL',
    dueDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'PENDING',
    priority: 'MEDIUM',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '3',
    companyId: 'company-1',
    title: 'Annual Audit Report',
    description: 'Submit annual financial audit report to authorities',
    type: 'ANNUAL_AUDIT',
    dueDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'PENDING',
    priority: 'MEDIUM',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
]

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const companyId = searchParams.get('companyId')
    const status = searchParams.get('status')
    const type = searchParams.get('type')
    const userId = 'temp-user-id' // Would get from JWT token

    // For demo, return mock data filtered by company
    let filteredItems = mockComplianceItems

    if (companyId) {
      filteredItems = filteredItems.filter(item => item.companyId === companyId)
    }

    if (status) {
      filteredItems = filteredItems.filter(item => item.status === status)
    }

    if (type) {
      filteredItems = filteredItems.filter(item => item.type === type)
    }

    return NextResponse.json({ complianceItems: filteredItems })

  } catch (error) {
    console.error('Compliance fetch error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = createComplianceItemSchema.parse(body)

    // Create compliance item
    const complianceItem = {
      id: `compliance-${Date.now()}`,
      ...validatedData,
      status: 'PENDING',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    // Create notification for user
    await db.notification.create({
      data: {
        userId: 'temp-user-id',
        title: 'New Compliance Requirement',
        message: `New compliance item: ${validatedData.title} due on ${new Date(validatedData.dueDate).toLocaleDateString()}`,
        type: 'COMPLIANCE_REMINDER',
        metadata: {
          complianceItemId: complianceItem.id,
          type: validatedData.type
        }
      }
    })

    return NextResponse.json({
      message: 'Compliance item created successfully',
      complianceItem
    })

  } catch (error) {
    console.error('Compliance creation error:', error)
    
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