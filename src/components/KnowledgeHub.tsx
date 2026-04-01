'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import { 
  Search, 
  BookOpen, 
  Calendar, 
  User, 
  Tag, 
  TrendingUp,
  Clock,
  Eye,
  Share2,
  Bookmark,
  Filter,
  Globe,
  MapPin,
  ChevronRight,
  Star,
  Heart,
  MessageCircle
} from 'lucide-react'

interface Article {
  id: string
  title: string
  slug: string
  content: string
  excerpt: string
  featuredImage: string
  author: string
  country: string
  category: string
  tags: string[]
  status: string
  seoTitle: string
  seoDescription: string
  publishedAt: string
  createdAt: string
  updatedAt: string
  readTime?: number
  views?: number
  likes?: number
  comments?: number
}

interface ArticleDetail extends Article {
  relatedArticles: Article[]
}

const categories = [
  { value: 'all', label: 'All Categories' },
  { value: 'Business Setup', label: 'Business Setup' },
  { value: 'Market Analysis', label: 'Market Analysis' },
  { value: 'Legal & Compliance', label: 'Legal & Compliance' },
  { value: 'Technology', label: 'Technology' },
  { value: 'Finance', label: 'Finance' },
  { value: 'Marketing', label: 'Marketing' }
]

const countries = [
  { value: 'all', label: 'All Countries' },
  { value: 'UAE', label: 'UAE' },
  { value: 'SAUDI', label: 'Saudi Arabia' },
  { value: 'QATAR', label: 'Qatar' },
  { value: 'OMAN', label: 'Oman' },
  { value: 'BAHRAIN', label: 'Bahrain' }
]

export default function KnowledgeHub() {
  const [articles, setArticles] = useState<Article[]>([])
  const [featuredArticles, setFeaturedArticles] = useState<Article[]>([])
  const [selectedArticle, setSelectedArticle] = useState<ArticleDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedCountry, setSelectedCountry] = useState('all')
  const [sortBy, setSortBy] = useState('publishedAt')
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    fetchArticles()
  }, [selectedCategory, selectedCountry, sortBy])

  const fetchArticles = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (selectedCategory !== 'all') params.append('category', selectedCategory)
      if (selectedCountry !== 'all') params.append('country', selectedCountry)
      if (sortBy) params.append('sort', sortBy)

      const response = await fetch(`/api/articles?${params}`)
      if (response.ok) {
        const data = await response.json()
        setArticles(data.articles)
        
        // Get featured articles separately
        const featuredResponse = await fetch('/api/articles?featured=true')
        if (featuredResponse.ok) {
          const featuredData = await featuredResponse.json()
          setFeaturedArticles(featuredData.articles)
        }
      }
    } catch (error) {
      console.error('Failed to fetch articles:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchArticleDetail = async (slug: string) => {
    try {
      const response = await fetch(`/api/articles/${slug}`)
      if (response.ok) {
        const data = await response.json()
        setSelectedArticle(data)
      }
    } catch (error) {
      console.error('Failed to fetch article:', error)
    }
  }

  const handleSearch = (value: string) => {
    setSearchTerm(value)
  }

  const filteredArticles = articles.filter(article =>
    article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    article.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
    article.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  const sortedArticles = [...filteredArticles].sort((a, b) => {
    switch (sortBy) {
      case 'publishedAt':
        return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
      case 'title':
        return a.title.localeCompare(b.title)
      case 'views':
        return (b.views || 0) - (a.views || 0)
      default:
        return 0
    }
  })

  const getReadingTime = (content: string) => {
    const wordsPerMinute = 200
    const words = content.split(/\s+/).length
    return Math.ceil(words / wordsPerMinute)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'Business Setup': 'bg-blue-100 text-blue-800',
      'Market Analysis': 'bg-green-100 text-green-800',
      'Legal & Compliance': 'bg-purple-100 text-purple-800',
      'Technology': 'bg-orange-100 text-orange-800',
      'Finance': 'bg-yellow-100 text-yellow-800',
      'Marketing': 'bg-pink-100 text-pink-800'
    }
    return colors[category] || 'bg-gray-100 text-gray-800'
  }

  const getCountryFlag = (country: string) => {
    const flags: Record<string, string> = {
      'UAE': '🇦🇪',
      'SAUDI': '🇸🇦',
      'QATAR': '🇶🇦',
      'OMAN': '🇴🇲',
      'BAHRAIN': '🇧🇭'
    }
    return flags[country] || ''
  }

  if (selectedArticle) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white border-b sticky top-0 z-40">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <Button 
                variant="ghost" 
                onClick={() => setSelectedArticle(null)}
                className="flex items-center gap-2"
              >
                <ChevronRight className="w-4 h-4 rotate-180" />
                Back to Articles
              </Button>
              <div className="flex items-center gap-3">
                <Button variant="ghost" size="sm">
                  <Share2 className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <Bookmark className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <Heart className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </header>

        <article className="container mx-auto px-4 py-8 max-w-4xl">
          {/* Article Header */}
          <header className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <Badge className={getCategoryColor(selectedArticle.category)}>
                {selectedArticle.category}
              </Badge>
              <div className="flex items-center gap-1 text-sm text-gray-500">
                <span>{getCountryFlag(selectedArticle.country)}</span>
                <span>{selectedArticle.country}</span>
              </div>
            </div>
            
            <h1 className="text-4xl font-bold mb-4 leading-tight">
              {selectedArticle.title}
            </h1>
            
            <p className="text-xl text-gray-600 mb-6">
              {selectedArticle.excerpt}
            </p>

            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <Avatar className="w-10 h-10">
                  <AvatarImage src="/logo.svg" />
                  <AvatarFallback>BZ</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{selectedArticle.author}</p>
                  <p className="text-sm text-gray-500">
                    {formatDate(selectedArticle.publishedAt)}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>{getReadingTime(selectedArticle.content)} min read</span>
                </div>
                <div className="flex items-center gap-1">
                  <Eye className="w-4 h-4" />
                  <span>{(selectedArticle.views || 0).toLocaleString()} views</span>
                </div>
              </div>
            </div>
          </header>

          {/* Featured Image */}
          {selectedArticle.featuredImage && (
            <div className="mb-8">
              <img
                src={selectedArticle.featuredImage}
                alt={selectedArticle.title}
                className="w-full h-96 object-cover rounded-lg"
              />
            </div>
          )}

          {/* Article Content */}
          <div className="prose prose-lg max-w-none mb-8">
            <div dangerouslySetInnerHTML={{ __html: selectedArticle.content }} />
          </div>

          {/* Tags */}
          {selectedArticle.tags && selectedArticle.tags.length > 0 && (
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-4">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {selectedArticle.tags.map((tag, index) => (
                  <Badge key={index} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Related Articles */}
          {selectedArticle.relatedArticles && selectedArticle.relatedArticles.length > 0 && (
            <div>
              <h3 className="text-2xl font-bold mb-6">Related Articles</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {selectedArticle.relatedArticles.map((article) => (
                  <Card key={article.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge className={getCategoryColor(article.category)}>
                          {article.category}
                        </Badge>
                        <div className="flex items-center gap-1 text-xs text-gray-500">
                          <span>{getCountryFlag(article.country)}</span>
                          <span>{article.country}</span>
                        </div>
                      </div>
                      <h4 className="font-semibold mb-2">{article.title}</h4>
                      <p className="text-sm text-gray-600 mb-3">{article.excerpt}</p>
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>{formatDate(article.publishedAt)}</span>
                        <span>{getReadingTime(article.content)} min read</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </article>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-semibold text-gray-900">Knowledge Hub</h1>
                <p className="text-sm text-gray-500">Business guides and resources</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline">
                <Search className="w-4 h-4 mr-2" />
                Search
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Featured Articles */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-3xl font-bold mb-2">Featured Articles</h2>
              <p className="text-gray-600">Comprehensive guides for business success</p>
            </div>
            <Button variant="outline">
              View All Articles
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredArticles.slice(0, 6).map((article) => (
              <Card key={article.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                <div className="relative">
                  <img
                    src={article.featuredImage}
                    alt={article.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute top-4 left-4">
                    <Badge className={getCategoryColor(article.category)}>
                      {article.category}
                    </Badge>
                  </div>
                </div>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <span>{getCountryFlag(article.country)}</span>
                      <span>{article.country}</span>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <Clock className="w-3 h-3" />
                      <span>{getReadingTime(article.content)} min read</span>
                    </div>
                  </div>
                  <h3 className="font-semibold mb-2 line-clamp-2">{article.title}</h3>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">{article.excerpt}</p>
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-500">{formatDate(article.publishedAt)}</p>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => fetchArticleDetail(article.slug)}
                    >
                      Read More
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* All Articles */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-3xl font-bold mb-2">All Articles</h2>
              <p className="text-gray-600">Browse our complete collection of business guides</p>
            </div>
            <Button variant="outline" onClick={() => setShowFilters(!showFilters)}>
              <Filter className="w-4 h-4 mr-2" />
              Filters
            </Button>
          </div>

          {/* Filters */}
          {showFilters && (
            <Card className="mb-6">
              <CardContent className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2">Search</label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        placeholder="Search articles..."
                        value={searchTerm}
                        onChange={(e) => handleSearch(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium mb-2">Category</label>
                    <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category.value} value={category.value}>
                            {category.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium mb-2">Country</label>
                    <Select value={selectedCountry} onValueChange={setSelectedCountry}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {countries.map((country) => (
                          <SelectItem key={country.value} value={country.value}>
                            {country.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="flex items-center justify-between mt-4">
                  <div className="flex items-center gap-2">
                    <label className="text-sm font-medium">Sort by:</label>
                    <Select value={sortBy} onValueChange={setSortBy}>
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="publishedAt">Latest</SelectItem>
                        <SelectItem value="title">Title</SelectItem>
                        <SelectItem value="views">Most Popular</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <Button variant="outline" size="sm" onClick={() => {
                    setSearchTerm('')
                    setSelectedCategory('all')
                    setSelectedCountry('all')
                    setSortBy('publishedAt')
                  }}>
                    Reset Filters
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Articles Grid */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, index) => (
                <Card key={index} className="animate-pulse">
                  <div className="h-48 bg-gray-200"></div>
                  <CardContent className="p-4">
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sortedArticles.map((article) => (
                <Card key={article.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge className={getCategoryColor(article.category)}>
                        {article.category}
                      </Badge>
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <span>{getCountryFlag(article.country)}</span>
                        <span>{article.country}</span>
                      </div>
                    </div>
                    <h3 className="font-semibold mb-2 line-clamp-2">{article.title}</h3>
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">{article.excerpt}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 text-xs text-gray-500">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          <span>{formatDate(article.publishedAt)}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>{getReadingTime(article.content)} min read</span>
                        </div>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => fetchArticleDetail(article.slug)}
                      >
                        Read More
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {sortedArticles.length === 0 && !loading && (
            <div className="text-center py-12">
              <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No articles found</h3>
              <p className="text-gray-600">Try adjusting your search criteria or filters</p>
            </div>
          )}
        </section>
      </div>
    </div>
  )
}