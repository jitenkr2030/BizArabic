import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { z } from 'zod'

const verifySchema = z.object({
  status: z.enum(['APPROVED', 'REJECTED']),
  verificationNotes: z.string().optional()
})

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const documentId = params.id
    const body = await request.json()
    const validatedData = verifySchema.parse(body)

    // For now, we'll use a temporary admin ID
    // In a real app, you'd get this from JWT token
    const adminId = 'temp-admin-id'

    // Update document status
    const document = await db.userDocument.update({
      where: { id: documentId },
      data: {
        status: validatedData.status,
        verificationNotes: validatedData.verificationNotes,
        verifiedAt: new Date(),
        verifiedBy: adminId
      }
    })

    // Create notification for user
    await db.notification.create({
      data: {
        userId: document.userId,
        title: `Document ${validatedData.status}`,
        message: `Your document "${document.fileName}" has been ${validatedData.status.toLowerCase()}${validatedData.verificationNotes ? ': ' + validatedData.verificationNotes : ''}`,
        type: 'APPLICATION_UPDATE',
        metadata: {
          documentId: document.id,
          documentType: document.documentType
        }
      }
    })

    return NextResponse.json({
      message: `Document ${validatedData.status.toLowerCase()} successfully`,
      document
    })

  } catch (error) {
    console.error('Document verification error:', error)
    
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