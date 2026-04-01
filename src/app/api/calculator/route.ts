import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

const calculatorSchema = z.object({
  country: z.enum(['UAE', 'SAUDI', 'QATAR', 'OMAN', 'BAHRAIN']),
  businessType: z.enum(['FREE_ZONE', 'MAINLAND', 'OFFSHORE']),
  employees: z.number().min(1).default(1),
  officeRequired: z.boolean().default(true),
  visaRequired: z.boolean().default(true)
})

// Pricing data for different countries and business types
const pricingData = {
  UAE: {
    FREE_ZONE: {
      baseLicenseFee: 15000,
      visaFee: 3500,
      officeFee: 12000,
      governmentFees: 3000,
      agentFee: 5000
    },
    MAINLAND: {
      baseLicenseFee: 20000,
      visaFee: 4000,
      officeFee: 15000,
      governmentFees: 5000,
      agentFee: 7000
    },
    OFFSHORE: {
      baseLicenseFee: 8000,
      visaFee: 0,
      officeFee: 0,
      governmentFees: 1500,
      agentFee: 3000
    }
  },
  SAUDI: {
    FREE_ZONE: {
      baseLicenseFee: 12000,
      visaFee: 3000,
      officeFee: 10000,
      governmentFees: 2500,
      agentFee: 4500
    },
    MAINLAND: {
      baseLicenseFee: 18000,
      visaFee: 3500,
      officeFee: 13000,
      governmentFees: 4000,
      agentFee: 6000
    },
    OFFSHORE: {
      baseLicenseFee: 7000,
      visaFee: 0,
      officeFee: 0,
      governmentFees: 1200,
      agentFee: 2500
    }
  },
  QATAR: {
    FREE_ZONE: {
      baseLicenseFee: 14000,
      visaFee: 3200,
      officeFee: 11000,
      governmentFees: 2800,
      agentFee: 4800
    },
    MAINLAND: {
      baseLicenseFee: 19000,
      visaFee: 3800,
      officeFee: 14000,
      governmentFees: 4500,
      agentFee: 6500
    },
    OFFSHORE: {
      baseLicenseFee: 7500,
      visaFee: 0,
      officeFee: 0,
      governmentFees: 1300,
      agentFee: 2800
    }
  },
  OMAN: {
    FREE_ZONE: {
      baseLicenseFee: 11000,
      visaFee: 2800,
      officeFee: 9000,
      governmentFees: 2200,
      agentFee: 4000
    },
    MAINLAND: {
      baseLicenseFee: 16000,
      visaFee: 3200,
      officeFee: 12000,
      governmentFees: 3500,
      agentFee: 5500
    },
    OFFSHORE: {
      baseLicenseFee: 6500,
      visaFee: 0,
      officeFee: 0,
      governmentFees: 1000,
      agentFee: 2200
    }
  },
  BAHRAIN: {
    FREE_ZONE: {
      baseLicenseFee: 10000,
      visaFee: 2500,
      officeFee: 8000,
      governmentFees: 2000,
      agentFee: 3500
    },
    MAINLAND: {
      baseLicenseFee: 15000,
      visaFee: 3000,
      officeFee: 11000,
      governmentFees: 3000,
      agentFee: 5000
    },
    OFFSHORE: {
      baseLicenseFee: 6000,
      visaFee: 0,
      officeFee: 0,
      governmentFees: 900,
      agentFee: 2000
    }
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = calculatorSchema.parse(body)

    const { country, businessType, employees, officeRequired, visaRequired } = validatedData
    
    // Get base pricing
    const basePricing = pricingData[country][businessType]
    
    // Calculate costs
    let licenseFee = basePricing.baseLicenseFee
    let visaFee = visaRequired ? (basePricing.visaFee * employees) : 0
    let officeFee = officeRequired ? basePricing.officeFee : 0
    let governmentFees = basePricing.governmentFees
    let agentFee = basePricing.agentFee

    // Additional employee costs for mainland
    if (businessType === 'MAINLAND' && employees > 1) {
      governmentFees += (employees - 1) * 500
    }

    const totalCost = licenseFee + visaFee + officeFee + governmentFees + agentFee

    // Create detailed breakdown
    const breakdown = {
      licenseFee: {
        amount: licenseFee,
        description: `${businessType.replace('_', ' ')} license registration fee`
      },
      visaFee: {
        amount: visaFee,
        description: visaRequired ? `Visa fees for ${employees} employee(s)` : 'No visa required'
      },
      officeFee: {
        amount: officeFee,
        description: officeRequired ? 'Office space requirement' : 'No office required'
      },
      governmentFees: {
        amount: governmentFees,
        description: 'Government processing and administrative fees'
      },
      agentFee: {
        amount: agentFee,
        description: 'Professional service and consultation fees'
      }
    }

    // Currency based on country
    const currency = country === 'SAUDI' ? 'SAR' : 'AED'

    // Valid for 30 days
    const validUntil = new Date()
    validUntil.setDate(validUntil.getDate() + 30)

    const calculation = {
      country,
      businessType,
      currency,
      costs: {
        licenseFee,
        visaFee,
        officeFee,
        governmentFees,
        agentFee,
        totalCost
      },
      breakdown,
      validUntil: validUntil.toISOString(),
      assumptions: {
        employees,
        officeRequired,
        visaRequired,
        pricingDate: new Date().toISOString()
      }
    }

    return NextResponse.json({
      message: 'Cost calculation completed successfully',
      calculation
    })

  } catch (error) {
    console.error('Calculator error:', error)
    
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

// GET endpoint to retrieve available countries and business types
export async function GET() {
  try {
    const countries = Object.keys(pricingData).map(country => ({
      code: country,
      name: {
        UAE: 'United Arab Emirates',
        SAUDI: 'Saudi Arabia',
        QATAR: 'Qatar',
        OMAN: 'Oman',
        BAHRAIN: 'Bahrain'
      }[country]
    }))

    const businessTypes = [
      {
        code: 'FREE_ZONE',
        name: 'Free Zone',
        description: '100% foreign ownership, tax benefits'
      },
      {
        code: 'MAINLAND',
        name: 'Mainland',
        description: 'Access to local market'
      },
      {
        code: 'OFFSHORE',
        name: 'Offshore',
        description: 'International business, tax optimization'
      }
    ]

    return NextResponse.json({
      countries,
      businessTypes
    })

  } catch (error) {
    console.error('Calculator GET error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}