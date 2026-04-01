import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { z } from 'zod'

const messageSchema = z.object({
  message: z.string().min(1),
  conversationId: z.string().optional(),
  context: z.object({
    country: z.string().optional(),
    businessType: z.string().optional(),
    industry: z.string().optional(),
    budget: z.number().optional()
  }).optional()
})

// Predefined responses for common questions
const knowledgeBase = {
  'uae cost': {
    answer: "The cost to start a business in UAE varies by business type:\n\n• Free Zone: AED 15,000-25,000\n• Mainland: AED 20,000-30,000\n• Offshore: AED 8,000-12,000\n\nThis includes license fees, visa costs, and basic setup. Would you like a detailed calculation for your specific needs?",
    followUp: ["Get detailed cost calculation", "Learn about business types", "Compare with other countries"]
  },
  'saudi cost': {
    answer: "Starting a business in Saudi Arabia typically costs:\n\n• Free Zone: SAR 12,000-20,000\n• Mainland: SAR 18,000-28,000\n• Offshore: SAR 7,000-10,000\n\nSaudi Arabia offers excellent opportunities with Vision 2030 initiatives. Are you interested in a specific sector?",
    followUp: ["Calculate exact costs", "Explore Vision 2030 benefits", "Find local partners"]
  },
  'documents required': {
    answer: "Common documents required for business registration:\n\n• Passport copies of shareholders\n• Visa/Residence permit (if applicable)\n• Bank reference letters\n• Business plan\n• Proof of address\n• Professional qualifications (for specific activities)\n\nThe exact requirements vary by country and business type. Which country are you targeting?",
    followUp: ["Country-specific requirements", "Document upload assistance", "Schedule consultation"]
  },
  'business type': {
    answer: "Choosing the right business type is crucial:\n\n**Free Zone**: 100% foreign ownership, tax benefits, but limited to local market\n**Mainland**: Access to local market, can trade anywhere, but requires local sponsor\n**Offshore**: International business, no physical office, asset protection\n\nConsider your business goals and target market. What's your primary business activity?",
    followUp: ["Compare all options", "Get personalized recommendation", "See success stories"]
  },
  'timeline': {
    answer: "Typical business setup timelines:\n\n• Free Zone: 2-4 weeks\n• Mainland: 4-8 weeks\n• Offshore: 1-2 weeks\n\nTimeline depends on document readiness and specific requirements. We can help expedite the process. What's your preferred timeline?",
    followUp: ["Expedite setup process", "Track application status", "Consult with expert"]
  }
}

function findBestAnswer(message: string) {
  const lowerMessage = message.toLowerCase()
  
  // Keyword matching
  for (const [key, response] of Object.entries(knowledgeBase)) {
    if (lowerMessage.includes(key)) {
      return response
    }
  }
  
  // Check for country mentions
  if (lowerMessage.includes('uae') || lowerMessage.includes('dubai') || lowerMessage.includes('abu dhabi')) {
    if (lowerMessage.includes('cost') || lowerMessage.includes('price') || lowerMessage.includes('fee')) {
      return knowledgeBase['uae cost']
    }
  }
  
  if (lowerMessage.includes('saudi') || lowerMessage.includes('riyadh')) {
    if (lowerMessage.includes('cost') || lowerMessage.includes('price') || lowerMessage.includes('fee')) {
      return knowledgeBase['saudi cost']
    }
  }
  
  if (lowerMessage.includes('document') || lowerMessage.includes('paper') || lowerMessage.includes('requirement')) {
    return knowledgeBase['documents required']
  }
  
  if (lowerMessage.includes('type') || lowerMessage.includes('free zone') || lowerMessage.includes('mainland') || lowerMessage.includes('offshore')) {
    return knowledgeBase['business type']
  }
  
  if (lowerMessage.includes('time') || lowerMessage.includes('how long') || lowerMessage.includes('duration')) {
    return knowledgeBase['timeline']
  }
  
  return null
}

function generateAIResponse(message: string, context?: any) {
  // Try to find a predefined answer first
  const predefinedAnswer = findBestAnswer(message)
  if (predefinedAnswer) {
    return {
      content: predefinedAnswer.answer,
      metadata: {
        type: 'predefined',
        followUp: predefinedAnswer.followUp,
        confidence: 'high'
      }
    }
  }
  
  // Generate contextual response
  let response = "I'd be happy to help you with your business setup in Arab countries! "
  
  if (context?.country) {
    response += `I see you're interested in ${context.country}. `
  }
  
  if (context?.businessType) {
    response += `For ${context.businessType.toLowerCase()} businesses, `
  }
  
  response += "Could you please provide more details about:\n\n"
  response += "• Which country you're targeting\n"
  response += "• Your business activity/industry\n"
  response += "• Your budget range\n"
  response += "• Timeline for setup\n\n"
  response += "This will help me give you more specific and accurate guidance."
  
  return {
    content: response,
    metadata: {
      type: 'contextual',
      followUp: ["Get cost calculation", "Explore business types", "Talk to consultant"],
      confidence: 'medium'
    }
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = messageSchema.parse(body)
    
    // For now, we'll simulate user authentication
    // In a real app, you'd verify JWT token
    const userId = 'temp-user-id'
    
    let conversationId = validatedData.conversationId
    
    // Create new conversation if not provided
    if (!conversationId) {
      const conversation = await db.aiConversation.create({
        data: {
          userId,
          title: validatedData.message.substring(0, 50) + '...',
          context: validatedData.context || {}
        }
      })
      conversationId = conversation.id
    }
    
    // Generate AI response
    const aiResponse = generateAIResponse(validatedData.message, validatedData.context)
    
    // Save user message
    await db.aiMessage.create({
      data: {
        conversationId,
        role: 'user',
        content: validatedData.message
      }
    })
    
    // Save AI response
    await db.aiMessage.create({
      data: {
        conversationId,
        role: 'assistant',
        content: aiResponse.content,
        metadata: aiResponse.metadata
      }
    })
    
    return NextResponse.json({
      message: aiResponse.content,
      conversationId,
      metadata: aiResponse.metadata
    })
    
  } catch (error) {
    console.error('AI Advisor error:', error)
    
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

// GET endpoint to retrieve conversation history
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const conversationId = searchParams.get('conversationId')
    const userId = 'temp-user-id' // Would get from JWT token
    
    if (!conversationId) {
      // Return all conversations for the user
      const conversations = await db.aiConversation.findMany({
        where: { userId },
        include: {
          messages: {
            orderBy: { createdAt: 'asc' },
            take: 1 // Just get first message for preview
          }
        },
        orderBy: { updatedAt: 'desc' }
      })
      
      return NextResponse.json({ conversations })
    }
    
    // Return specific conversation with all messages
    const conversation = await db.aiConversation.findFirst({
      where: { 
        id: conversationId,
        userId
      },
      include: {
        messages: {
          orderBy: { createdAt: 'asc' }
        }
      }
    })
    
    if (!conversation) {
      return NextResponse.json(
        { error: 'Conversation not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json({ conversation })
    
  } catch (error) {
    console.error('AI Advisor GET error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}