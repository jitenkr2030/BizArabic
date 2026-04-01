import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { z } from 'zod'

const createArticleSchema = z.object({
  title: z.string().min(1),
  slug: z.string().min(1),
  content: z.string().min(1),
  excerpt: z.string().optional(),
  featuredImage: z.string().optional(),
  author: z.string(),
  country: z.string().optional(),
  category: z.string(),
  tags: z.string().optional(),
  status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']).default('DRAFT'),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional()
})

// Mock articles data
const mockArticles = [
  {
    id: '1',
    title: 'Complete Guide to Setting Up a Business in UAE Free Zones',
    slug: 'complete-guide-uae-free-zones',
    content: `# Complete Guide to Setting Up a Business in UAE Free Zones

## Introduction

The United Arab Emirates offers numerous free zones that provide 100% foreign ownership, tax exemptions, and streamlined company formation processes. This comprehensive guide will walk you through everything you need to know about establishing your business in UAE free zones.

## What is a Free Zone?

A free zone is a designated geographical area where goods and services can be traded without customs duties or other taxes. In the UAE, free zones are designed to attract foreign investment and facilitate international business.

## Benefits of UAE Free Zones

### 100% Foreign Ownership
Unlike mainland companies, free zone companies allow 100% foreign ownership without requiring a local sponsor.

### Tax Exemptions
- 0% corporate tax for 50 years
- 0% personal income tax
- 0% import/export duties
- Full repatriation of profits and capital

### Modern Infrastructure
State-of-the-art facilities, high-speed internet, and business-friendly regulations.

## Popular UAE Free Zones

### 1. Dubai Multi Commodities Centre (DMCC)
- Ideal for trading and commodities
- Strategic location in Dubai
- Comprehensive business support services

### 2. Dubai International Financial Centre (DIFC)
- Leading financial hub
- Independent legal system
- Ideal for fintech and financial services

### 3. Abu Dhabi Global Market (ADGM)
- International financial center
- Common law framework
- Focus on financial services and innovation

### 4. Sharjah International Free Zone (SAIF Zone)
- Cost-effective setup
- Ideal for SMEs
- Strategic location near Dubai

## Types of Companies in Free Zones

### Free Zone Establishment (FZE)
- Single shareholder company
- Minimum capital requirement varies
- Suitable for small businesses

### Free Zone Company (FZCO)
- Multiple shareholders
- Minimum 2 shareholders
- Suitable for larger businesses

## Step-by-Step Setup Process

### 1. Choose Your Free Zone
Consider factors like:
- Business activity
- Target market
- Cost structure
- Location preferences

### 2. Select Company Type
Choose between FZE and FZCO based on your business structure.

### 3. Reserve Company Name
- Check name availability
- Ensure compliance with naming conventions
- Reserve the name with the free zone authority

### 4. Prepare Required Documents
- Passport copies of shareholders
- Business plan
- Bank reference letters
- Proof of address

### 5. Submit Application
- Complete application forms
- Submit required documents
- Pay initial fees

### 6. Receive License
- Review and sign legal documents
- Receive your business license
- Open corporate bank account

## Costs Involved

### License Fees
- FZE: AED 15,000 - 25,000
- FZCO: AED 20,000 - 30,000

### Visa Costs
- Investor visa: AED 3,500 - 5,000
- Employee visas: AED 3,000 - 4,000 per person

### Office Requirements
- Physical office: AED 10,000 - 50,000 annually
- Virtual office: AED 5,000 - 15,000 annually

### Other Costs
- Agent fees: AED 5,000 - 15,000
- Legal fees: AED 2,000 - 5,000
- Government fees: AED 3,000 - 7,000

## Common Business Activities

### Permitted Activities
- Trading
- Consulting
- IT services
- E-commerce
- Marketing and advertising
- Financial services (in specific free zones)

### Restricted Activities
- Banking and finance (except in designated free zones)
- Insurance
- Oil and gas exploration
- Military and defense

## Post-Setup Requirements

### Corporate Bank Account
- Open a corporate bank account
- Maintain minimum balance requirements
- Comply with anti-money laundering regulations

### Visa and Immigration
- Apply for investor visa
- Sponsor employee visas
- Maintain visa validity

### Annual Compliance
- Renew business license annually
- Submit audited financial statements
- Comply with free zone regulations

## Tips for Success

### 1. Do Your Research
Thoroughly research different free zones to find the best fit for your business.

### 2. Plan Your Budget
Consider all costs involved and plan your budget accordingly.

### 3. Choose the Right Structure
Select between FZE and FZCO based on your long-term business goals.

### 4. Work with Professionals
Consider hiring a business setup consultant to ensure smooth process.

### 5. Stay Compliant
Maintain compliance with all free zone regulations to avoid penalties.

## Conclusion

Setting up a business in UAE free zones offers numerous advantages for foreign investors. With proper planning and professional guidance, you can establish a successful business in one of the world's most dynamic business environments.

Remember to consult with legal and business professionals before making any decisions, as regulations and requirements may change over time.`,
    excerpt: 'Complete guide to establishing a business in UAE free zones with 100% foreign ownership and tax benefits.',
    featuredImage: '/images/uae-free-zone-guide.jpg',
    author: 'BizArabic Team',
    country: 'UAE',
    category: 'Business Setup',
    tags: '["UAE", "Free Zone", "Business Setup", "Foreign Ownership"]',
    status: 'PUBLISHED',
    seoTitle: 'UAE Free Zone Business Setup Guide 2024 | Complete Instructions',
    seoDescription: 'Step-by-step guide to setting up a business in UAE free zones with 100% foreign ownership, tax benefits, and streamlined processes.',
    publishedAt: '2024-01-15T00:00:00.000Z',
    createdAt: '2024-01-15T00:00:00.000Z',
    updatedAt: '2024-01-15T00:00:00.000Z'
  },
  {
    id: '2',
    title: 'Saudi Arabia Vision 2030: Business Opportunities for Entrepreneurs',
    slug: 'saudi-vision-2030-business-opportunities',
    content: `# Saudi Arabia Vision 2030: Business Opportunities for Entrepreneurs

## Introduction

Saudi Arabia's Vision 2030 is a transformative roadmap that's reshaping the kingdom's economy and creating unprecedented opportunities for entrepreneurs. This comprehensive guide explores how Vision 2030 is opening doors for business owners and investors.

## What is Vision 2030?

Launched in 2016, Vision 2030 is Saudi Arabia's strategic framework to diversify its economy away from oil dependence. The plan aims to increase the private sector's contribution from 40% to 65% of GDP by 2030.

## Key Pillars Creating Business Opportunities

### 1. Entertainment and Tourism
The kingdom plans to invest over $64 billion in entertainment, creating opportunities for:
- Theme parks and resorts
- Cultural events and festivals
- Sports and recreation facilities
- Hospitality and tourism services

### 2. Technology and Innovation
With a focus on becoming a global tech hub, opportunities include:
- Fintech and digital banking
- E-commerce platforms
- Software development
- AI and machine learning solutions
- Cybersecurity services

### 3. Renewable Energy
Saudi Arabia aims to generate 58.7 GW of renewable energy by 2030, creating opportunities in:
- Solar and wind energy projects
- Energy storage solutions
- Smart grid technologies
- Green building consulting

### 4. Healthcare and Life Sciences
The healthcare sector is set to grow significantly, with opportunities in:
- Private hospitals and clinics
- Medical technology
- Pharmaceutical manufacturing
- Health insurance services
- Telemedicine platforms

### 5. Education and Training
With plans to increase the private sector's role in education, opportunities include:
- Private schools and universities
- EdTech solutions
- Vocational training centers
- Online learning platforms
- Corporate training programs

## Emerging Business Sectors

### Neom City
A $500 billion futuristic city featuring:
- Advanced manufacturing
- Robotics and AI
- Biotechnology
- Sustainable energy solutions
- Smart city technologies

### Red Sea Project
A luxury tourism destination creating opportunities in:
- Hotels and resorts
- Marine activities
- Entertainment venues
- Transportation services
- Retail and dining

### Qiddiya Entertainment City
The world's largest entertainment city with opportunities in:
- Theme parks and attractions
- Sports facilities
- Cultural venues
- Retail and dining
- Event management

### Industrial Cities
New industrial cities focusing on:
- Advanced manufacturing
- Logistics and warehousing
- Automotive industry
- Aerospace and defense
- Petrochemicals

## Regulatory Reforms Supporting Business

### Foreign Investment Law
- 100% foreign ownership in most sectors
- Simplified licensing procedures
- Protection for foreign investors

### Visa Reforms
- Introduction of tourist visa
- E-visa system for business visitors
- Permanent residency for investors
- Family visa reforms

### Legal System Improvements
- Specialized commercial courts
- Alternative dispute resolution
- Bankruptcy law reforms
- Intellectual property protection

## How to Get Started

### 1. Market Research
- Identify promising sectors
- Analyze competition
- Understand local regulations
- Assess market demand

### 2. Business Structure Options
- Limited Liability Company (LLC)
- Joint Stock Company (JSC)
- Sole Proprietorship
- Branch office

### 3. Licensing Process
- Choose appropriate license type
- Prepare required documents
- Submit application to relevant authority
- Obtain necessary permits

### 4. Company Registration
- Register with Ministry of Commerce
- Obtain tax registration
- Open corporate bank account
- Register for social insurance

### 5. Hire and Operate
- Recruit local talent
- Comply with labor laws
- Establish operations
- Scale your business

## Success Stories

### Ride-Hailing Apps
Companies like Careem and Uber have thrived in Saudi Arabia's evolving transportation sector.

### E-commerce Platforms
Local and international e-commerce players are capitalizing on Saudi Arabia's growing digital economy.

### Fintech Solutions
The kingdom's push for digital payments has created opportunities for innovative financial technology companies.

## Challenges and Considerations

### Cultural Adaptation
- Understanding local business culture
- Building relationships with local partners
- Navigating bureaucratic processes
- Respecting religious and cultural norms

### Competition
- Increasing competition from local and international players
- Need for differentiation
- Importance of local partnerships

### Regulatory Compliance
- Staying updated on changing regulations
- Ensuring compliance with local laws
- Maintaining proper documentation
- Adapting to policy changes

## Resources for Entrepreneurs

### Government Initiatives
- Entrepreneurship Vision Program
- Monsha'at (SME Authority)
- Technical and Vocational Training Corporation (TVTC)
- Human Resources Development Fund (HRDF)

### Funding Opportunities
- Venture capital funds
- Angel investor networks
- Government grants and subsidies
- Bank financing programs

### Support Organizations
- Chambers of commerce
- Business incubators and accelerators
- Consulting firms
- Legal and accounting services

## Future Outlook

Saudi Arabia's Vision 2030 is creating a fertile ground for entrepreneurs. With massive government investment, regulatory reforms, and a young, tech-savvy population, the kingdom is poised to become one of the Middle East's most dynamic business environments.

## Conclusion

Vision 2030 is not just a government plan – it's a transformation of Saudi Arabia's economy and society. For entrepreneurs, it represents unprecedented opportunities to be part of one of the world's most ambitious national transformation projects.

Success in Saudi Arabia's evolving business landscape requires cultural understanding, strategic planning, and the ability to adapt to rapid changes. But for those who get it right, the rewards can be substantial.

The time to enter the Saudi market is now – as the kingdom transforms, so do the opportunities for innovative entrepreneurs who can help shape its future.`,
    excerpt: 'Explore business opportunities created by Saudi Arabia Vision 2030, including entertainment, technology, renewable energy, and healthcare sectors.',
    featuredImage: '/images/saudi-vision-2030.jpg',
    author: 'BizArabic Team',
    country: 'SAUDI',
    category: 'Market Analysis',
    tags: '["Saudi Arabia", "Vision 2030", "Business Opportunities", "Investment"]',
    status: 'PUBLISHED',
    seoTitle: 'Saudi Vision 2030 Business Opportunities | Entrepreneur Guide 2024',
    seoDescription: 'Discover business opportunities in Saudi Arabia Vision 2030, including emerging sectors, regulatory reforms, and success stories for entrepreneurs.',
    publishedAt: '2024-01-10T00:00:00.000Z',
    createdAt: '2024-01-10T00:00:00.000Z',
    updatedAt: '2024-01-10T00:00:00.000Z'
  },
  {
    id: '3',
    title: 'Qatar Business Setup: Complete Guide for Foreign Investors',
    slug: 'qatar-business-setup-guide',
    content: `# Qatar Business Setup: Complete Guide for Foreign Investors

## Introduction

Qatar has emerged as one of the Middle East's most attractive destinations for foreign investment, thanks to its strategic location, business-friendly policies, and world-class infrastructure. This comprehensive guide covers everything you need to know about setting up a business in Qatar.

## Why Choose Qatar?

### Strategic Location
- Central location between Europe, Asia, and Africa
- Excellent connectivity via Hamad International Airport
- Proximity to emerging markets
- Time zone advantage for global business

### Economic Stability
- One of the highest GDP per capita globally
- Strong currency (Qatari Riyal)
- Low inflation rates
- Government budget surpluses

### Business-Friendly Environment
- 100% foreign ownership in most sectors
- No corporate taxes
- No personal income taxes
- Free repatriation of profits
- Strong legal framework

## Business Setup Options

### Mainland Company
- Operate anywhere in Qatar
- Access to local market
- Requires Qatari partner for some activities
- Trade license from Ministry of Commerce and Industry

### Free Zone Company
- 100% foreign ownership
- Tax exemptions
- Customized regulations
- Limited to free zone boundaries
- Various free zones to choose from

### Branch Office
- Extension of foreign company
- Limited business activities
- Requires parent company guarantee
- Suitable for market testing

## Popular Free Zones in Qatar

### 1. Qatar Financial Centre (QFC)
- Leading financial hub
- Independent legal system
- Ideal for banking, insurance, and asset management
- Tax benefits and incentives

### 2. Qatar Science & Technology Park (QSTP)
- Focus on technology and innovation
- Support for startups and SMEs
- Research and development facilities
- IT and telecom friendly

### 3. Qatar Free Zones Authority (QFZA)
- Manages multiple free zones
- Diverse sector focus
- One-stop shop services
- Streamlined processes

### 4. Ras Bufontas Industrial City
- Heavy industrial focus
- Manufacturing and logistics
- Port access
- Customized solutions

## Required Documents

### Personal Documents
- Valid passport copies of shareholders
- Residence permits (if applicable)
- Bank reference letters
- No-objection certificates (from current employer)

### Business Documents
- Business plan
- Feasibility study
- Financial projections
- Market analysis
- Organizational structure

### Legal Documents
- Memorandum of Association (MOA)
- Articles of Association (AOA)
- Board resolution
- Power of attorney

## Step-by-Step Setup Process

### 1. Choose Business Activity
- Select permitted activity
- Check if special approval is required
- Ensure compliance with Qatar National Vision 2030

### 2. Select Legal Structure
- Choose between mainland and free zone
- Decide on company type (LLC, branch, etc.)
- Consider ownership structure

### 3. Reserve Company Name
- Check name availability
- Ensure compliance with naming conventions
- Reserve name with relevant authority

### 4. Obtain Initial Approval
- Submit application to relevant authority
- Provide required documents
- Receive preliminary approval

### 5. Prepare Legal Documents
- Draft MOA and AOA
- Obtain necessary attestations
- Prepare board resolutions

### 6. Final Registration
- Submit all required documents
- Pay registration fees
- Obtain commercial registration

### 7. Post-Registration Requirements
- Open corporate bank account
- Obtain necessary permits and licenses
- Register for taxes and social security
- Hire employees and obtain visas

## Costs Involved

### Registration Fees
- Mainland LLC: QAR 10,000 - 20,000
- Free Zone Company: QAR 5,000 - 15,000
- Branch Office: QAR 3,000 - 10,000

### Annual Fees
- Trade license renewal: QAR 1,000 - 5,000
- Municipality fees: QAR 500 - 2,000
- Chamber of Commerce: QAR 1,000 - 3,000

### Office Requirements
- Physical office: QAR 20,000 - 100,000 annually
- Virtual office: QAR 8,000 - 25,000 annually
- Co-working space: QAR 1,000 - 5,000 monthly

### Visa Costs
- Investor visa: QAR 2,000 - 5,000
- Employee visa: QAR 1,500 - 3,000 per person
- Family visa: QAR 1,000 - 2,000 per dependent

## Banking and Finance

### Opening a Corporate Bank Account
- Choose from local and international banks
- Required documents:
  - Commercial registration
  - MOA and AOA
  - Board resolution
  - Passport copies of signatories
  - Proof of address

### Available Banking Services
- Corporate accounts
- Trade finance
- Foreign exchange
- Cash management
- Online banking

### Financing Options
- Bank loans and overdrafts
- Islamic financing (Sharia-compliant)
- Government support programs
- Angel investors and VCs

## Visas and Immigration

### Investor Visa
- Valid for 1-5 years
- Renewable
- Allows multiple entries
- Can sponsor family members

### Employee Visas
- Work residence permit
- Valid for 1-5 years
- Requires Qatar job offer
- Can sponsor family after certain conditions

### Family Visas
- Family residence permit
- For spouse and children
- Requires minimum salary
- Valid for same duration as main visa

## Taxation

### Corporate Tax
- Currently no corporate tax
- Planned 10% tax on profits over QAR 100,000 (post-2029)
- Certain sectors exempt (hydrocarbon, hospitality, etc.)

### Personal Income Tax
- No personal income tax
- No capital gains tax
- No inheritance tax
- No wealth tax

### Other Taxes
- 5% customs duty on most imports
- 100% tax on certain harmful products
- Municipality tax on commercial properties

## Legal System

### Commercial Law
- Based on civil law principles
- Regularly updated to align with international standards
- Strong intellectual property protection
- Efficient dispute resolution

### Dispute Resolution
- Commercial courts
- Arbitration centers
- Mediation services
- International arbitration recognition

## Business Culture

### Working Hours
- Standard: 8 hours per day, 48 hours per week
- Ramadan: Reduced hours for Muslim employees
- Weekend: Friday and Saturday

### Business Etiquette
- Formal business attire
- Punctuality important
- Relationship-based business
- Respect for hierarchy and seniority

### Language
- Arabic is official language
- English widely used in business
- Translation services available

## Challenges and Considerations

### Market Size
- Relatively small domestic market
- Dependence on oil and gas sector
- Competition from regional players

### Bureaucracy
- Some processes can be time-consuming
- Multiple approvals may be required
- Cultural nuances to navigate

### Cost of Living
- High rental costs
- Expensive housing
- School fees for expatriates

## Success Factors

### Local Partnerships
- Finding reliable Qatari partners
- Building strong business relationships
- Understanding local business culture

### Market Research
- Thorough market analysis
- Understanding customer needs
- Competitive landscape assessment

### Compliance
- Staying updated on regulations
- Maintaining proper documentation
- Adapting to policy changes

## Resources and Support

### Government Agencies
- Ministry of Commerce and Industry
- Qatar Financial Centre
- Qatar Free Zones Authority
- Ministry of Administrative Development

### Business Support
- Qatar Chamber of Commerce
- Qatar Development Bank
- Qatar Science & Technology Park
- Various business incubators

### Professional Services
- Law firms
- Accounting firms
- Business consultants
- Recruitment agencies

## Future Outlook

Qatar continues to invest heavily in infrastructure and diversification, creating new opportunities for foreign investors. The 2022 FIFA World Cup has further boosted the country's global profile and business-friendly environment.

## Conclusion

Qatar offers an attractive combination of economic stability, business-friendly policies, and strategic location. While there are challenges to navigate, the potential rewards for successful businesses are significant.

Success in Qatar requires patience, cultural understanding, and a long-term perspective. For entrepreneurs who can adapt to the local business environment and build strong relationships, Qatar represents a gateway to the broader Middle East market.

The country's commitment to economic diversification and development, combined with its world-class infrastructure and business-friendly policies, makes it an increasingly attractive destination for foreign investment and business setup.`,
    excerpt: 'Complete guide for foreign investors looking to set up businesses in Qatar, including free zones, costs, and legal requirements.',
    featuredImage: '/images/qatar-business-setup.jpg',
    author: 'BizArabic Team',
    country: 'QATAR',
    category: 'Business Setup',
    tags: '["Qatar", "Business Setup", "Foreign Investment", "Free Zone"]',
    status: 'PUBLISHED',
    seoTitle: 'Qatar Business Setup Guide 2024 | Complete Instructions for Investors',
    seoDescription: 'Step-by-step guide to setting up a business in Qatar with 100% foreign ownership, tax benefits, and comprehensive legal requirements.',
    publishedAt: '2024-01-05T00:00:00.000Z',
    createdAt: '2024-01-05T00:00:00.000Z',
    updatedAt: '2024-01-05T00:00:00.000Z'
  }
]

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const country = searchParams.get('country')
    const status = searchParams.get('status')
    const featured = searchParams.get('featured')

    let filteredArticles = mockArticles

    // Apply filters
    if (category) {
      filteredArticles = filteredArticles.filter(article => article.category === category)
    }
    if (country) {
      filteredArticles = filteredArticles.filter(article => article.country === country)
    }
    if (status) {
      filteredArticles = filteredArticles.filter(article => article.status === status)
    }
    if (featured === 'true') {
      filteredArticles = filteredArticles.filter(article => article.featuredImage)
    }

    return NextResponse.json({ articles: filteredArticles })

  } catch (error) {
    console.error('Articles fetch error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = createArticleSchema.parse(body)

    // Create article
    const article = {
      id: `article-${Date.now()}`,
      ...validatedData,
      publishedAt: validatedData.status === 'PUBLISHED' ? new Date().toISOString() : undefined,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    return NextResponse.json({
      message: 'Article created successfully',
      article
    })

  } catch (error) {
    console.error('Article creation error:', error)
    
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