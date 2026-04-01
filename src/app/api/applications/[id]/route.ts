import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { z } from 'zod'

const updateApplicationSchema = z.object({
  currentStep: z.number().min(1).max(6).optional(),
  status: z.enum(['DRAFT', 'SUBMITTED', 'UNDER_REVIEW', 'ADDITIONAL_INFO_REQUIRED', 'APPROVED', 'REJECTED', 'COMPLETED']).optional(),
  notes: z.string().optional()
})

const updateChecklistSchema = z.object({
  checklistId: z.string(),
  isCompleted: z.boolean(),
  notes: z.string().optional()
})

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const applicationId = params.id
    const body = await request.json()
    
    // Handle different update types
    if (body.type === 'checklist') {
      const validatedData = updateChecklistSchema.parse(body)
      
      // Update checklist item
      const checklistItem = await db.applicationChecklist.update({
        where: { id: validatedData.checklistId },
        data: {
          isCompleted: validatedData.isCompleted,
          notes: validatedData.notes,
          completedAt: validatedData.isCompleted ? new Date() : null
        }
      })

      // Check if all items for current step are completed
      const application = await db.businessApplication.findUnique({
        where: { id: applicationId },
        include: { checklists: true }
      })

      if (application) {
        const currentStepItems = application.checklists.filter(item => item.step === application.currentStep)
        const allCompleted = currentStepItems.every(item => item.isCompleted)

        if (allCompleted && application.currentStep < 6) {
          // Move to next step
          await db.businessApplication.update({
            where: { id: applicationId },
            data: { currentStep: application.currentStep + 1 }
          })

          // Add timeline entry
          await db.applicationTimeline.create({
            data: {
              applicationId,
              event: `Step ${application.currentStep + 1} Started`,
              description: `Completed step ${application.currentStep}, moving to step ${application.currentStep + 1}`,
              createdBy: 'temp-user-id'
            }
          })
        }
      }

      return NextResponse.json({
        message: 'Checklist updated successfully',
        checklistItem
      })
    } else {
      const validatedData = updateApplicationSchema.parse(body)
      
      // Update application
      const application = await db.businessApplication.update({
        where: { id: applicationId },
        data: {
          ...(validatedData.currentStep && { currentStep: validatedData.currentStep }),
          ...(validatedData.status && { status: validatedData.status }),
          ...(validatedData.notes && { notes: validatedData.notes }),
          ...(validatedData.status === 'SUBMITTED' && { submittedAt: new Date() }),
          ...(validatedData.status === 'APPROVED' && { approvedAt: new Date() }),
          ...(validatedData.status === 'REJECTED' && { 
            rejectedAt: new Date(),
            rejectionReason: validatedData.notes 
          })
        }
      })

      // Add timeline entry
      if (validatedData.status) {
        await db.applicationTimeline.create({
          data: {
            applicationId,
            event: `Status Changed to ${validatedData.status}`,
            description: validatedData.notes || `Application status updated to ${validatedData.status}`,
            createdBy: 'temp-user-id'
          }
        })
      }

      return NextResponse.json({
        message: 'Application updated successfully',
        application
      })
    }

  } catch (error) {
    console.error('Application update error:', error)
    
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
    const applicationId = params.id

    const application = await db.businessApplication.findUnique({
      where: { id: applicationId },
      include: {
        company: true,
        checklists: {
          orderBy: { step: 'asc' }
        },
        timeline: {
          orderBy: { createdAt: 'desc' }
        },
        payments: {
          orderBy: { createdAt: 'desc' }
        }
      }
    })

    if (!application) {
      return NextResponse.json(
        { error: 'Application not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ application })

  } catch (error) {
    console.error('Application fetch error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}