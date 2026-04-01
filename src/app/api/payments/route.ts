import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { z } from 'zod'

const createPaymentSchema = z.object({
  amount: z.number().positive(),
  currency: z.string().default('AED'),
  description: z.string(),
  applicationId: z.string().optional(),
  paymentMethod: z.string().optional()
})

const subscriptionPlans = {
  FREE: { amount: 0, features: ['Basic cost calculator', 'Limited support'] },
  BASIC: { amount: 999, features: ['Full cost calculator', 'Email support', 'Document templates'] },
  PRO: { amount: 2999, features: ['All Basic features', 'AI advisor', 'Priority support', 'Advanced analytics'] },
  ENTERPRISE: { amount: 4999, features: ['All Pro features', 'Dedicated consultant', 'Custom solutions', 'API access'] }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Handle different payment types
    if (body.type === 'subscription') {
      const { plan } = body
      const planDetails = subscriptionPlans[plan as keyof typeof subscriptionPlans]
      
      if (!planDetails) {
        return NextResponse.json(
          { error: 'Invalid subscription plan' },
          { status: 400 }
        )
      }

      // For now, we'll use a temporary user ID
      const userId = 'temp-user-id'

      // Create subscription
      const subscription = await db.subscription.create({
        data: {
          userId,
          plan,
          amount: planDetails.amount,
          currency: 'AED',
          status: 'ACTIVE',
          startDate: new Date(),
          endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
          autoRenew: true
        }
      })

      // Create payment record
      const payment = await db.payment.create({
        data: {
          userId,
          invoiceNumber: `SUB-${Date.now()}`,
          amount: planDetails.amount,
          currency: 'AED',
          status: 'COMPLETED',
          paymentMethod: 'CREDIT_CARD',
          description: `${plan} subscription plan`,
          dueDate: new Date(),
          paidAt: new Date()
        }
      })

      return NextResponse.json({
        message: 'Subscription created successfully',
        subscription,
        payment
      })
    } else {
      // Regular payment
      const validatedData = createPaymentSchema.parse(body)
      const userId = 'temp-user-id'

      // Create payment
      const payment = await db.payment.create({
        data: {
          userId,
          applicationId: validatedData.applicationId,
          invoiceNumber: `INV-${Date.now()}`,
          amount: validatedData.amount,
          currency: validatedData.currency,
          status: 'PENDING',
          paymentMethod: validatedData.paymentMethod,
          description: validatedData.description,
          dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days from now
        }
      })

      return NextResponse.json({
        message: 'Payment created successfully',
        payment
      })
    }

  } catch (error) {
    console.error('Payment creation error:', error)
    
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

    const payments = await db.payment.findMany({
      where: {
        userId,
        ...(status && { status: status as any })
      },
      include: {
        application: {
          include: {
            company: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json({ payments })

  } catch (error) {
    console.error('Payments fetch error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}