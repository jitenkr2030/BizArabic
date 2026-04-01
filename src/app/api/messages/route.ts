import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { z } from 'zod'

const createMessageSchema = z.object({
  receiverId: z.string(),
  content: z.string().min(1),
  applicationId: z.string().optional(),
  fileUrl: z.string().optional(),
  fileName: z.string().optional()
})

const sendMessageSchema = z.object({
  phoneNumber: z.string(),
  message: z.string(),
  templateName: z.string().optional()
})

// Mock messages data
const mockMessages = [
  {
    id: '1',
    senderId: 'user-1',
    receiverId: 'user-2',
    content: 'Hi, I need help with my UAE business registration',
    applicationId: 'app-1',
    fileUrl: null,
    fileName: null,
    isRead: false,
    readAt: null,
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
  },
  {
    id: '2',
    senderId: 'user-2',
    receiverId: 'user-1',
    content: 'Hello! I\'d be happy to help you with your UAE business registration. What type of business are you planning to start?',
    applicationId: 'app-1',
    fileUrl: null,
    fileName: null,
    isRead: true,
    readAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString()
  },
  {
    id: '3',
    senderId: 'user-1',
    receiverId: 'user-2',
    content: 'I\'m planning to start a technology consulting company in Dubai Free Zone',
    applicationId: 'app-1',
    fileUrl: null,
    fileName: null,
    isRead: false,
    readAt: null,
    createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString()
  }
]

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Handle different message types
    if (body.type === 'whatsapp') {
      const validatedData = sendMessageSchema.parse(body)
      
      // Simulate WhatsApp API call
      const whatsappResponse = {
        messageId: `wa-${Date.now()}`,
        status: 'sent',
        phoneNumber: validatedData.phoneNumber,
        message: validatedData.message,
        sentAt: new Date().toISOString()
      }

      // Create notification for user
      await db.notification.create({
        data: {
          userId: 'temp-user-id',
          title: 'WhatsApp Message Sent',
          message: `Message sent to ${validatedData.phoneNumber}: ${validatedData.message}`,
          type: 'MESSAGE',
          metadata: {
            type: 'whatsapp',
            messageId: whatsappResponse.messageId
          }
        }
      })

      return NextResponse.json({
        message: 'WhatsApp message sent successfully',
        whatsappResponse
      })
    } else {
      // Regular chat message
      const validatedData = createMessageSchema.parse(body)
      
      // Create message
      const message = {
        id: `msg-${Date.now()}`,
        senderId: 'temp-user-id',
        ...validatedData,
        isRead: false,
        readAt: null,
        createdAt: new Date().toISOString()
      }

      // Create notification for receiver
      await db.notification.create({
        data: {
          userId: validatedData.receiverId,
          title: 'New Message',
          message: `New message from ${message.senderId}: ${message.content.substring(0, 50)}...`,
          type: 'MESSAGE',
          metadata: {
            messageId: message.id,
            senderId: message.senderId
          }
        }
      })

      return NextResponse.json({
        message: 'Message sent successfully',
        message
      })
    }

  } catch (error) {
    console.error('Message creation error:', error)
    
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
    const userId = searchParams.get('userId')
    const conversationId = searchParams.get('conversationId')

    if (conversationId) {
      // Return messages for specific conversation
      const conversationMessages = mockMessages.filter(msg => 
        (msg.senderId === userId || msg.receiverId === userId)
      )
      
      return NextResponse.json({ 
        messages: conversationMessages.sort((a, b) => 
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        )
      })
    }

    // Return all conversations for user
    const userConversations = mockMessages
      .filter(msg => msg.senderId === userId || msg.receiverId === userId)
      .reduce((acc, msg) => {
        const otherUserId = msg.senderId === userId ? msg.receiverId : msg.senderId
        if (!acc[otherUserId]) {
          acc[otherUserId] = {
            userId: otherUserId,
            lastMessage: msg,
            unreadCount: msg.senderId !== userId && !msg.isRead ? 1 : 0
          }
        } else {
          acc[otherUserId].lastMessage = msg
          if (msg.senderId !== userId && !msg.isRead) {
            acc[otherUserId].unreadCount++
          }
        }
        return acc
      }, {} as Record<string, any>)

    return NextResponse.json({ 
      conversations: Object.values(userConversations).sort((a, b) => 
        new Date(b.lastMessage.createdAt).getTime() - new Date(a.lastMessage.createdAt).getTime()
      )
    })

  } catch (error) {
    console.error('Messages fetch error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}