import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// Mock admin dashboard data
const mockAdminData = {
  overview: {
    totalUsers: 1247,
    totalCompanies: 856,
    totalApplications: 2341,
    totalRevenue: 2847500,
    activeSubscriptions: 423,
    pendingApplications: 67,
    overduePayments: 23,
    totalConsultants: 45
  },
  recentActivity: [
    {
      id: '1',
      type: 'user_registration',
      description: 'New user registered: john.doe@example.com',
      timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
      userId: 'user-123'
    },
    {
      id: '2',
      type: 'application_submitted',
      description: 'Application submitted: Tech Solutions LLC',
      timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
      applicationId: 'app-456'
    },
    {
      id: '3',
      type: 'payment_completed',
      description: 'Payment completed: AED 2,500 for subscription',
      timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
      paymentId: 'pay-789'
    },
    {
      id: '4',
      type: 'document_uploaded',
      description: 'Document uploaded: passport.jpg',
      timestamp: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
      documentId: 'doc-012'
    }
  ],
  userStats: {
    byRole: {
      FOUNDER: 1123,
      CONSULTANT: 89,
      ADMIN: 35
    },
    bySubscription: {
      FREE: 824,
      BASIC: 298,
      PRO: 98,
      ENTERPRISE: 27
    },
    byCountry: {
      UAE: 456,
      SAUDI: 342,
      QATAR: 234,
      OMAN: 156,
      BAHRAIN: 59
    },
    newUsers: [
      { date: '2024-01-20', count: 23 },
      { date: '2024-01-19', count: 18 },
      { date: '2024-01-18', count: 31 },
      { date: '2024-01-17', count: 27 },
      { date: '2024-01-16', count: 19 }
    ]
  },
  applicationStats: {
    byStatus: {
      DRAFT: 234,
      SUBMITTED: 456,
      UNDER_REVIEW: 123,
      APPROVED: 567,
      REJECTED: 89,
      COMPLETED: 872
    },
    byCountry: {
      UAE: 567,
      SAUDI: 445,
      QATAR: 334,
      OMAN: 234,
      BAHRAIN: 761
    },
    byBusinessType: {
      FREE_ZONE: 1234,
      MAINLAND: 876,
      OFFSHORE: 231
    },
    monthlyApplications: [
      { month: '2024-01', count: 234 },
      { month: '2023-12', count: 198 },
      { month: '2023-11', count: 187 },
      { month: '2023-10', count: 176 },
      { month: '2023-09', count: 165 }
    ]
  },
  revenueStats: {
    monthlyRevenue: [
      { month: '2024-01', amount: 284750 },
      { month: '2023-12', amount: 267890 },
      { month: '2023-11', amount: 245670 },
      { month: '2023-10', amount: 234560 },
      { month: '2023-09', amount: 223450 }
    ],
    bySource: {
      SUBSCRIPTIONS: 1847500,
      COMMISSIONS: 750000,
      PREMIUM_SERVICES: 250000
    },
    byCountry: {
      UAE: 1234500,
      SAUDI: 876000,
      QATAR: 456000,
      OMAN: 234000,
      BAHRAIN: 56000
    }
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    section = searchParams.get('section') || 'overview'

    // Return specific section data
    if (section && mockAdminData[section as keyof typeof mockAdminData]) {
      return NextResponse.json({
        [section]: mockAdminData[section as keyof typeof mockAdminData]
      })
    }

    // Return all data
    return NextResponse.json(mockAdminData)

  } catch (error) {
    console.error('Admin data fetch error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, data } = body

    // Handle different admin actions
    switch (action) {
      case 'approve_application':
        // Approve application logic
        return NextResponse.json({
          message: 'Application approved successfully',
          applicationId: data.applicationId
        })

      case 'reject_application':
        // Reject application logic
        return NextResponse.json({
          message: 'Application rejected successfully',
          applicationId: data.applicationId
        })

      case 'verify_document':
        // Verify document logic
        return NextResponse.json({
          message: 'Document verified successfully',
          documentId: data.documentId
        })

      case 'update_user_role':
        // Update user role logic
        return NextResponse.json({
          message: 'User role updated successfully',
          userId: data.userId
        })

      case 'update_pricing':
        // Update pricing logic
        return NextResponse.json({
          message: 'Pricing updated successfully',
          pricingId: data.pricingId
        })

      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        )
    }

  } catch (error) {
    console.error('Admin action error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}