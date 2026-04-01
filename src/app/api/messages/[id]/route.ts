import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { z } from 'zod'

const updateMessageSchema = z.object({
  isRead: z.boolean().optional()
})

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const messageId = params.id
    const body = await request.json()
    const validatedData = updateMessageSchema.parse(body)

    // Update message
    const message = {
      id: messageId,
      ...validatedData,
      readAt: validatedData.isRead ? new Date().toISOString() : null,
      updatedAt: new Date().toISOString()
    }

    return NextResponse.json({
      message: 'Message updated successfully',
      message
    })

  } catch (error) {
    console.error('Message update error:', error)
    
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
    const messageId = params.id

    // Mock message details
    const message = {
      id: messageId,
      senderId: 'user-1',
      receiverId: 'user-2',
      content: 'Hi, I need help with my UAE business registration',
      applicationId: 'app-1',
      fileUrl: null,
      fileName: null,
      isRead: false,
      readAt: null,
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      // Additional details
      sender: {
        id: 'user-1',
        name: 'John Doe',
        email: 'john@example.com',
        avatar: null,
        role: 'FOUNDER'
      },
      receiver: {
        id: 'user-2',
        name: 'Ahmed Hassan',
        email: 'ahmed@bizarabic.com',
        avatar: null,
        role: 'CONSULTANT'
      },
      application: {
        id: 'app-1',
        applicationNumber: 'BIZ-2024-001',
        company: {
          name: 'Tech Solutions LLC',
          country: 'UAE',
          businessType: 'FREE_ZONE'
        }
      }
    }

    return NextResponse.json({ message })

  } catch (error) {
    console.error('Message fetch error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}