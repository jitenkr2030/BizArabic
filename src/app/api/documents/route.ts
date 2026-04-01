import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { z } from 'zod'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { v4 as uuidv4 } from 'uuid'

const uploadSchema = z.object({
  documentType: z.enum(['PASSPORT', 'VISA', 'ADDRESS_PROOF', 'BANK_STATEMENT', 'PHOTOGRAPH', 'BUSINESS_PLAN', 'CV', 'CERTIFICATE', 'OTHER']),
  companyId: z.string().optional(),
  fileName: z.string(),
  fileSize: z.number(),
  mimeType: z.string()
})

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const documentType = formData.get('documentType') as string
    const companyId = formData.get('companyId') as string

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      )
    }

    // Validate input
    const validatedData = uploadSchema.parse({
      documentType,
      companyId: companyId || undefined,
      fileName: file.name,
      fileSize: file.size,
      mimeType: file.type
    })

    // For now, we'll use a temporary user ID
    // In a real app, you'd get this from JWT token
    const userId = 'temp-user-id'

    // Create uploads directory if it doesn't exist
    const uploadsDir = join(process.cwd(), 'uploads')
    try {
      await mkdir(uploadsDir, { recursive: true })
    } catch (error) {
      // Directory might already exist
    }

    // Generate unique filename
    const fileExtension = file.name.split('.').pop()
    const uniqueFileName = `${uuidv4()}.${fileExtension}`
    const filePath = join(uploadsDir, uniqueFileName)

    // Save file to disk
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    await writeFile(filePath, buffer)

    // Save document record to database
    const document = await db.userDocument.create({
      data: {
        userId,
        companyId: validatedData.companyId,
        documentType: validatedData.documentType,
        fileName: validatedData.fileName,
        fileUrl: `/uploads/${uniqueFileName}`,
        fileSize: validatedData.fileSize,
        mimeType: validatedData.mimeType,
        status: 'UPLOADED'
      }
    })

    return NextResponse.json({
      message: 'Document uploaded successfully',
      document: {
        id: document.id,
        fileName: document.fileName,
        documentType: document.documentType,
        status: document.status,
        uploadedAt: document.uploadedAt
      }
    })

  } catch (error) {
    console.error('Document upload error:', error)
    
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
    const companyId = searchParams.get('companyId')
    const userId = 'temp-user-id' // Would get from JWT token

    const documents = await db.userDocument.findMany({
      where: {
        userId,
        ...(companyId && { companyId })
      },
      orderBy: { uploadedAt: 'desc' }
    })

    return NextResponse.json({ documents })

  } catch (error) {
    console.error('Document list error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}