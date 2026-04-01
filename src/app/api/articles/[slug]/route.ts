import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const slug = params.slug

    // Mock article details - in real app, fetch from database
    const article = mockArticles.find(article => article.slug === slug)

    if (!article) {
      return NextResponse.json(
        { error: 'Article not found' },
        { status: 404 }
      )
    }

    // Add related articles
    const relatedArticles = mockArticles
      .filter(a => a.id !== article.id && a.category === article.category)
      .slice(0, 3)

    return NextResponse.json({ 
      article,
      relatedArticles
    })

  } catch (error) {
    console.error('Article fetch error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Mock data (in real app, this would be in a shared file)
const mockArticles = [
  {
    id: '1',
    title: 'Complete Guide to Setting Up a Business in UAE Free Zones',
    slug: 'complete-guide-uae-free-zones',
    content: `# Complete Guide to Setting Up a Business in UAE Free Zones`,
    excerpt: 'Complete guide to establishing a business in UAE free zones.',
    featuredImage: '/images/uae-free-zone-guide.jpg',
    author: 'BizArabic Team',
    country: 'UAE',
    category: 'Business Setup',
    tags: '["UAE", "Free Zone", "Business Setup"]',
    status: 'PUBLISHED',
    publishedAt: '2024-01-15T00:00:00.000Z',
    createdAt: '2024-01-15T00:00:00.000Z',
    updatedAt: '2024-01-15T00:00:00.000Z'
  }
]