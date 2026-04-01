import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { z } from 'zod'

const updatePaymentSchema = z.object({
  status: z.enum(['PENDING', 'PROCESSING', 'COMPLETED', 'FAILED', 'REFUNDED', 'CANCELLED']),
  paymentMethod: z.string().optional(),
  transactionId: z.string().optional()
})

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const paymentId = params.id
    const body = await request.json()
    const validatedData = updatePaymentSchema.parse(body)

    // Update payment
    const payment = await db.payment.update({
      where: { id: paymentId },
      data: {
        ...validatedData,
        ...(validatedData.status === 'COMPLETED' && { paidAt: new Date() })
      }
    })

    // Create notification for user if payment is completed
    if (validatedData.status === 'COMPLETED') {
      await db.notification.create({
        data: {
          userId: payment.userId,
          title: 'Payment Successful',
          message: `Your payment of ${payment.currency} ${payment.amount} has been processed successfully.`,
          type: 'PAYMENT_DUE',
          metadata: {
            paymentId: payment.id,
            invoiceNumber: payment.invoiceNumber
          }
        }
      })
    }

    return NextResponse.json({
      message: 'Payment updated successfully',
      payment
    })

  } catch (error) {
    console.error('Payment update error:', error)
    
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
    const paymentId = params.id

    const payment = await db.payment.findUnique({
      where: { id: paymentId },
      include: {
        application: {
          include: {
            company: true
          }
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    })

    if (!payment) {
      return NextResponse.json(
        { error: 'Payment not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ payment })

  } catch (error) {
    console.error('Payment fetch error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}