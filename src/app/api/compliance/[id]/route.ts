import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { z } from 'zod'

const updateComplianceSchema = z.object({
  status: z.enum(['PENDING', 'IN_PROGRESS', 'COMPLETED', 'OVERDUE']),
  notes: z.string().optional()
})

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const complianceId = params.id
    const body = await request.json()
    const validatedData = updateComplianceSchema.parse(body)

    // Update compliance item
    const complianceItem = {
      id: complianceId,
      ...validatedData,
      completedAt: validatedData.status === 'COMPLETED' ? new Date().toISOString() : undefined,
      updatedAt: new Date().toISOString()
    }

    // Create notification if completed
    if (validatedData.status === 'COMPLETED') {
      await db.notification.create({
        data: {
          userId: 'temp-user-id',
          title: 'Compliance Item Completed',
          message: `Compliance requirement has been completed successfully.`,
          type: 'COMPLIANCE_REMINDER',
          metadata: {
            complianceItemId: complianceId
          }
        }
      })
    }

    return NextResponse.json({
      message: 'Compliance item updated successfully',
      complianceItem
    })

  } catch (error) {
    console.error('Compliance update error:', error)
    
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
    const complianceId = params.id

    // Mock compliance item details
    const complianceItem = {
      id: complianceId,
      companyId: 'company-1',
      title: 'Trade License Renewal',
      description: 'Annual trade license renewal for UAE Free Zone company. Submit all required documents and pay renewal fees.',
      type: 'LICENSE_RENEWAL',
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'PENDING',
      priority: 'HIGH',
      notes: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      completedAt: null,
      // Additional details
      requirements: [
        'Updated trade license application',
        'Valid passport copies',
        'Office lease agreement',
        'Renewal fee payment'
      ],
      documents: [
        { name: 'Passport Copy', status: 'UPLOADED', uploadedAt: '2024-01-15' },
        { name: 'Office Lease', status: 'PENDING', uploadedAt: null },
        { name: 'Application Form', status: 'PENDING', uploadedAt: null }
      ],
      checklist: [
        { item: 'Prepare renewal application', completed: true },
        { item: 'Gather required documents', completed: false },
        { item: 'Submit to authorities', completed: false },
        { item: 'Pay renewal fees', completed: false }
      ]
    }

    return NextResponse.json({ complianceItem })

  } catch (error) {
    console.error('Compliance fetch error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}