'use client'

import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  MessageCircle, 
  Send, 
  Phone, 
  Video, 
  MoreVertical,
  Search,
  Users,
  Bell,
  CheckCircle2,
  Clock,
  Paperclip,
  Smile,
  Mic,
  WhatsApp,
  Mail,
  Calendar
} from 'lucide-react'

interface Message {
  id: string
  senderId: string
  receiverId: string
  content: string
  applicationId?: string
  fileUrl?: string
  fileName?: string
  isRead: boolean
  readAt?: string
  createdAt: string
  sender?: {
    id: string
    name: string
    email: string
    avatar?: string
    role: string
  }
  receiver?: {
    id: string
    name: string
    email: string
    avatar?: string
    role: string
  }
}

interface Conversation {
  userId: string
  name: string
  email: string
  avatar?: string
  role: string
  lastMessage: Message
  unreadCount: number
  isOnline?: boolean
}

interface WhatsAppTemplate {
  id: string
  name: string
  content: string
  variables: string[]
}

const whatsappTemplates: WhatsAppTemplate[] = [
  {
    id: '1',
    name: 'Application Update',
    content: 'Your business application {{applicationNumber}} has been updated to {{status}}. View details in your dashboard.',
    variables: ['applicationNumber', 'status']
  },
  {
    id: '2',
    name: 'Document Required',
    content: 'We need additional documents for your application. Please upload: {{documents}}',
    variables: ['documents']
  },
  {
    id: '3',
    name: 'Payment Reminder',
    content: 'Payment of {{amount}} {{currency}} is due for your business setup. Please complete payment by {{dueDate}}.',
    variables: ['amount', 'currency', 'dueDate']
  }
]

export default function CommunicationSystem() {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [loading, setLoading] = useState(true)
  const [sendingMessage, setSendingMessage] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [showWhatsAppDialog, setShowWhatsAppDialog] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [whatsappMessage, setWhatsappMessage] = useState('')
  const [templateVariables, setTemplateVariables] = useState<Record<string, string>>({})
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    fetchConversations()
  }, [])

  useEffect(() => {
    if (selectedConversation) {
      fetchMessages(selectedConversation.userId)
    }
  }, [selectedConversation])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const fetchConversations = async () => {
    try {
      const response = await fetch('/api/messages?userId=temp-user-id')
      if (response.ok) {
        const data = await response.json()
        setConversations(data.conversations)
      }
    } catch (error) {
      console.error('Failed to fetch conversations:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchMessages = async (userId: string) => {
    try {
      const response = await fetch(`/api/messages?userId=temp-user-id&conversationId=${userId}`)
      if (response.ok) {
        const data = await response.json()
        setMessages(data.messages)
        
        // Mark messages as read
        data.messages.forEach((msg: Message) => {
          if (!msg.isRead && msg.receiverId === 'temp-user-id') {
            markAsRead(msg.id)
          }
        })
      }
    } catch (error) {
      console.error('Failed to fetch messages:', error)
    }
  }

  const markAsRead = async (messageId: string) => {
    try {
      await fetch(`/api/messages/${messageId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isRead: true })
      })
    } catch (error) {
      console.error('Failed to mark message as read:', error)
    }
  }

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation) return

    setSendingMessage(true)
    try {
      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          receiverId: selectedConversation.userId,
          content: newMessage
        })
      })

      if (response.ok) {
        setNewMessage('')
        fetchMessages(selectedConversation.userId)
        fetchConversations()
      }
    } catch (error) {
      console.error('Failed to send message:', error)
    } finally {
      setSendingMessage(false)
    }
  }

  const sendWhatsAppMessage = async () => {
    if (!phoneNumber || !whatsappMessage.trim()) return

    try {
      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'whatsapp',
          phoneNumber,
          message: whatsappMessage
        })
      })

      if (response.ok) {
        setShowWhatsAppDialog(false)
        setPhoneNumber('')
        setWhatsappMessage('')
        setSelectedTemplate('')
        setTemplateVariables({})
        alert('WhatsApp message sent successfully!')
      }
    } catch (error) {
      console.error('Failed to send WhatsApp message:', error)
    }
  }

  const handleTemplateSelect = (templateId: string) => {
    const template = whatsappTemplates.find(t => t.id === templateId)
    if (template) {
      setSelectedTemplate(templateId)
      setWhatsappMessage(template.content)
      
      // Initialize variables
      const vars: Record<string, string> = {}
      template.variables.forEach(variable => {
        vars[variable] = ''
      })
      setTemplateVariables(vars)
    }
  }

  const updateTemplateVariable = (variable: string, value: string) => {
    const updated = { ...templateVariables, [variable]: value }
    setTemplateVariables(updated)
    
    // Update message with variables
    const template = whatsappTemplates.find(t => t.id === selectedTemplate)
    if (template) {
      let message = template.content
      Object.entries(updated).forEach(([key, val]) => {
        message = message.replace(`{{${key}}}`, val)
      })
      setWhatsappMessage(message)
    }
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit' 
    })
  }

  const filteredConversations = conversations.filter(conv =>
    conv.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading conversations...</p>
        </div>
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
                <MessageCircle className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-semibold text-gray-900">Communication Center</h1>
                <p className="text-sm text-gray-500">Messages and WhatsApp integration</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" onClick={() => setShowWhatsAppDialog(true)}>
                <WhatsApp className="w-4 h-4 mr-2" />
                Send WhatsApp
              </Button>
              <Button variant="outline">
                <Bell className="w-4 h-4 mr-2" />
                Notifications
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 h-[calc(100vh-80px)]">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-full">
          {/* Conversations List */}
          <div className="lg:col-span-1">
            <Card className="h-full flex flex-col">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Messages</CardTitle>
                  <Badge variant="outline">
                    {conversations.reduce((sum, conv) => sum + conv.unreadCount, 0)} unread
                  </Badge>
                </div>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search conversations..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </CardHeader>
              <CardContent className="flex-1 p-0">
                <ScrollArea className="h-[calc(100%-8rem)]">
                  <div className="space-y-1 p-2">
                    {filteredConversations.map((conversation) => (
                      <div
                        key={conversation.userId}
                        className={`p-3 rounded-lg cursor-pointer transition-colors ${
                          selectedConversation?.userId === conversation.userId
                            ? 'bg-blue-50 border-blue-200'
                            : 'hover:bg-gray-50'
                        }`}
                        onClick={() => setSelectedConversation(conversation)}
                      >
                        <div className="flex items-start gap-3">
                          <div className="relative">
                            <Avatar className="w-10 h-10">
                              <AvatarImage src={conversation.avatar} />
                              <AvatarFallback>
                                {conversation.name.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                            {conversation.isOnline && (
                              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                              <p className="font-medium text-sm truncate">{conversation.name}</p>
                              {conversation.unreadCount > 0 && (
                                <Badge variant="destructive" className="text-xs">
                                  {conversation.unreadCount}
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-gray-500 truncate">
                              {conversation.lastMessage.content}
                            </p>
                            <p className="text-xs text-gray-400">
                              {formatTime(conversation.lastMessage.createdAt)}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>

          {/* Chat Area */}
          <div className="lg:col-span-3">
            {selectedConversation ? (
              <Card className="h-full flex flex-col">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar className="w-10 h-10">
                        <AvatarImage src={selectedConversation.avatar} />
                        <AvatarFallback>
                          {selectedConversation.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{selectedConversation.name}</p>
                        <p className="text-sm text-gray-500">
                          {selectedConversation.role} • 
                          {selectedConversation.isOnline ? 'Online' : 'Offline'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm">
                        <Phone className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Video className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="flex-1 p-0">
                  <ScrollArea className="h-[calc(100%-8rem)]">
                    <div className="p-4 space-y-4">
                      {messages.map((message) => {
                        const isFromMe = message.senderId === 'temp-user-id'
                        return (
                          <div
                            key={message.id}
                            className={`flex ${isFromMe ? 'justify-end' : 'justify-start'}`}
                          >
                            <div className={`max-w-xs lg:max-w-md ${
                              isFromMe ? 'bg-blue-500 text-white' : 'bg-gray-100'
                            } rounded-lg p-3`}>
                              <p className="text-sm">{message.content}</p>
                              {message.fileUrl && (
                                <div className="mt-2">
                                  <a
                                    href={message.fileUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 text-xs underline"
                                  >
                                    <Paperclip className="w-3 h-3" />
                                    {message.fileName}
                                  </a>
                                </div>
                              )}
                              <p className={`text-xs mt-1 ${
                                isFromMe ? 'text-blue-100' : 'text-gray-500'
                              }`}>
                                {formatTime(message.createdAt)}
                                {message.isRead && isFromMe && (
                                  <span className="ml-2">✓ Read</span>
                                )}
                              </p>
                            </div>
                          </div>
                        )
                      })}
                      <div ref={messagesEndRef} />
                    </div>
                  </ScrollArea>
                </CardContent>

                <CardHeader className="pt-0 pb-4">
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm">
                      <Paperclip className="w-4 h-4" />
                    </Button>
                    <div className="flex-1 relative">
                      <Input
                        placeholder="Type a message..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && sendMessage()}
                        className="pr-10"
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        className="absolute right-1 top-1/2 transform -translate-y-1/2"
                        onClick={sendMessage}
                        disabled={sendingMessage || !newMessage.trim()}
                      >
                        <Send className="w-4 h-4" />
                      </Button>
                    </div>
                    <Button variant="ghost" size="sm">
                      <Smile className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Mic className="w-4 h-4" />
                    </Button>
                  </div>
                </CardHeader>
              </Card>
            ) : (
              <Card className="h-full flex items-center justify-center">
                <CardContent className="text-center">
                  <MessageCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Select a conversation</h3>
                  <p className="text-gray-600">Choose a conversation from the list to start messaging</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>

      {/* WhatsApp Dialog */}
      <Dialog open={showWhatsAppDialog} onOpenChange={setShowWhatsAppDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Send WhatsApp Message</DialogTitle>
            <DialogDescription>
              Send a WhatsApp message to a user or use templates for common communications
            </DialogDescription>
          </DialogHeader>
          
          <Tabs defaultValue="direct" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="direct">Direct Message</TabsTrigger>
              <TabsTrigger value="template">Use Template</TabsTrigger>
            </TabsList>
            
            <TabsContent value="direct" className="space-y-4">
              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  placeholder="+971501234567"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="message">Message</Label>
                <Textarea
                  id="message"
                  placeholder="Type your message here..."
                  value={whatsappMessage}
                  onChange={(e) => setWhatsappMessage(e.target.value)}
                  rows={4}
                />
              </div>
            </TabsContent>
            
            <TabsContent value="template" className="space-y-4">
              <div>
                <Label htmlFor="template">Select Template</Label>
                <Select value={selectedTemplate} onValueChange={handleTemplateSelect}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a template" />
                  </SelectTrigger>
                  <SelectContent>
                    {whatsappTemplates.map((template) => (
                      <SelectItem key={template.id} value={template.id}>
                        {template.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              {selectedTemplate && (
                <>
                  <div>
                    <Label>Template Variables</Label>
                    <div className="space-y-2 mt-2">
                      {whatsappTemplates
                        .find(t => t.id === selectedTemplate)
                        ?.variables.map((variable) => (
                          <div key={variable} className="flex items-center gap-2">
                            <Label className="text-sm min-w-24">
                              {variable}
                            </Label>
                            <Input
                              placeholder={`Enter ${variable}`}
                              value={templateVariables[variable] || ''}
                              onChange={(e) => updateTemplateVariable(variable, e.target.value)}
                            />
                          </div>
                        ))}
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      placeholder="+971501234567"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="preview">Message Preview</Label>
                    <Textarea
                      id="preview"
                      value={whatsappMessage}
                      onChange={(e) => setWhatsappMessage(e.target.value)}
                      rows={4}
                      readOnly
                    />
                  </div>
                </>
              )}
            </TabsContent>
          </Tabs>
          
          <div className="flex justify-end gap-3 mt-6">
            <Button variant="outline" onClick={() => setShowWhatsAppDialog(false)}>
              Cancel
            </Button>
            <Button onClick={sendWhatsAppMessage}>
              <WhatsApp className="w-4 h-4 mr-2" />
              Send Message
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}