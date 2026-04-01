# 🚀 BizArabic - Complete Business Setup Platform for Arab Countries

<div align="center">

![BizArabic Logo](https://img.shields.io/badge/BizArabic-Platform-blue?style=for-the-badge)
![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)
![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?style=for-the-badge&logo=prisma)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-06B6D4?style=for-the-badge&logo=tailwindcss)

**"Anyone can start & manage a business in Arab countries without confusion"**

[▶️ Live Demo](#) · [📖 Documentation](#documentation) · [🚀 Getting Started](#getting-started) · [💡 Features](#features)

</div>

## 🌍 About BizArabic

BizArabic is a comprehensive SaaS platform that simplifies business registration and management across Arab countries. We support entrepreneurs in setting up companies in **UAE, Saudi Arabia, Qatar, Oman, and Bahrain** with localized guidance, AI-powered assistance, and end-to-end workflow management.

### 🎯 Core Vision

Transform the complex process of business setup in Arab countries into a simple, transparent, and efficient experience through technology and expert guidance.

---

## ✨ Key Features

### 🌐 **Multi-Country Support**
- 🇦🇪 **United Arab Emirates** - Free Zones & Mainland
- 🇸🇦 **Saudi Arabia** - Vision 2030 Initiatives
- 🇶🇦 **Qatar** - Business Hub Support
- 🇴🇲 **Oman** - Economic Diversification
- 🇧🇭 **Bahrain** - Financial Services Hub

### 💰 **Real-Time Cost Calculator**
- Instant cost estimates for all business types
- Detailed breakdown of fees, licenses, and requirements
- Currency-specific calculations (AED, SAR, etc.)
- Dynamic pricing based on business needs

### 🤖 **AI Business Advisor**
- Intelligent chat-based guidance
- Personalized recommendations
- 24/7 availability for business queries
- Context-aware responses

### 📊 **Comprehensive Dashboard**
- Application tracking with progress indicators
- Document management system
- Compliance alerts and reminders
- Analytics and insights

### 👥 **Expert Consultant Network**
- Verified local consultants
- Specialized expertise by country and industry
- Commission-based marketplace
- Rating and review system

### 📋 **Business Registration Workflow**
- Step-by-step guided process
- Document upload and verification
- Status tracking
- Multi-approval workflows

---

## 🏗️ Technical Architecture

### **Frontend Stack**
```
📱 Next.js 16 (App Router)
🎨 TypeScript 5
🎯 Tailwind CSS 4
🧩 shadcn/ui Components
⚡ Framer Motion Animations
🔍 Lucide React Icons
```

### **Backend Stack**
```
🗄️ Prisma ORM with SQLite
🔐 JWT Authentication
🛡️ bcryptjs Password Hashing
✅ Zod Validation
🤖 z-ai-web-dev-sdk Integration
```

### **Database Schema**
- **20+ Models** covering complete business workflow
- **Multi-role system** (Founder, Consultant, Admin)
- **Country-specific configurations**
- **Scalable relationships** and constraints

---

## 🚀 Getting Started

### **Prerequisites**
- Node.js 18+ 
- Bun or npm package manager
- Git

### **Installation**

1. **Clone the repository**
```bash
git clone https://github.com/jitenkr2030/BizArabic.git
cd BizArabic
```

2. **Install dependencies**
```bash
bun install
```

3. **Environment Setup**
```bash
cp .env.example .env
# Configure your environment variables
```

4. **Database Setup**
```bash
bun run db:push
bun run db:generate
```

5. **Start Development Server**
```bash
bun run dev
```

6. **Open your browser**
Navigate to [http://localhost:3000](http://localhost:3000)

---

## 📁 Project Structure

```
BizArabic/
├── 📂 src/
│   ├── 📂 app/                    # Next.js App Router
│   │   ├── 📂 api/               # API Routes
│   │   │   ├── 📂 auth/          # Authentication endpoints
│   │   │   ├── 📂 calculator/    # Cost calculator API
│   │   │   └── 📂 ai/           # AI advisor API
│   │   ├── 📄 page.tsx           # Landing page
│   │   └── 📄 layout.tsx         # Root layout
│   ├── 📂 components/            # React Components
│   │   ├── 📂 ui/               # shadcn/ui components
│   │   ├── 📄 Dashboard.tsx     # User dashboard
│   │   └── 📄 CostCalculator.tsx # Cost calculator
│   ├── 📂 lib/                  # Utilities
│   │   ├── 📄 db.ts             # Prisma client
│   │   └── 📄 utils.ts          # Helper functions
│   └── 📂 hooks/                # Custom React hooks
├── 📂 prisma/
│   └── 📄 schema.prisma         # Database schema
├── 📂 public/                   # Static assets
└── 📄 README.md                 # This file
```

---

## 💼 Business Model

### **Revenue Streams**

1. **Commission-Based Services**
   - Business setup: ₹20,000 – ₹100,000 per company
   - Consultant matching: 10-15% commission
   - Premium services: Fast-track processing

2. **Subscription Plans**
   - **Free**: Basic cost calculator, limited features
   - **Basic**: ₹999/month - Full access to calculator
   - **Pro**: ₹2,999/month - AI advisor + document management
   - **Enterprise**: ₹4,999/month - Complete platform + priority support

3. **Value-Added Services**
   - Legal consultation packages
   - Document preparation services
   - Compliance management subscriptions

---

## 🎯 Target Market

### **Primary Users**
- 🌟 **Entrepreneurs** starting businesses in Arab countries
- 💼 **SMEs** expanding to Middle East markets
- 🏢 **Consultants** providing business setup services
- 📊 **Investors** exploring Arab market opportunities

### **Market Size**
- **50,000+** annual business registrations in target countries
- **$2B+** market for business setup services
- **Growing 15% YoY** with Vision 2030 initiatives

---

## 🔧 Available Features

### ✅ **Implemented**
- [x] Multi-country business setup support
- [x] Real-time cost calculator
- [x] AI business advisor chat
- [x] User authentication system
- [x] Dashboard with analytics
- [x] Document management foundation
- [x] Consultant network structure
- [x] Payment system architecture
- [x] Compliance tracking framework

### 🚧 **In Progress**
- [ ] Document upload & verification
- [ ] Payment gateway integration
- [ ] WhatsApp notifications
- [ ] Advanced analytics
- [ ] Admin panel
- [ ] Mobile app (PWA)

### 📋 **Planned**
- [ ] Multi-language support (Arabic, Hindi)
- [ ] Bank account integration
- [ ] Company name availability checker
- [ ] AI document auto-fill
- [ ] Advanced compliance automation

---

## 🛠️ API Endpoints

### **Authentication**
```http
POST /api/auth/register    # User registration
POST /api/auth/login       # User login
```

### **Cost Calculator**
```http
POST /api/calculator       # Calculate business costs
GET  /api/calculator       # Get countries & business types
```

### **AI Advisor**
```http
POST /api/ai/advisor       # Chat with AI advisor
GET  /api/ai/advisor       # Get conversation history
```

### **Business Management**
```http
GET    /api/companies           # List user companies
POST   /api/companies           # Create new company
GET    /api/applications        # List applications
POST   /api/applications        # Submit application
```

---

## 🎨 UI Components

The platform uses **shadcn/ui** components for consistent, accessible design:

- 📋 **Forms** with validation
- 🎯 **Cards** for content display
- 📊 **Tables** for data presentation
- 🎨 **Badges** for status indicators
- 📱 **Navigation** components
- 🔘 **Buttons** with multiple variants
- 📈 **Charts** for analytics

---

## 🔒 Security Features

- **JWT Authentication** with secure token handling
- **Password Hashing** using bcryptjs
- **Input Validation** with Zod schemas
- **SQL Injection Prevention** via Prisma ORM
- **XSS Protection** with React's built-in security
- **CORS Configuration** for API security

---

## 📱 Responsive Design

- **Mobile-First** approach
- **Tailwind CSS** breakpoints
- **Touch-Friendly** interfaces
- **PWA Ready** architecture
- **Cross-Browser** compatibility

---

## 🧪 Testing

```bash
# Run linting
bun run lint

# Type checking
bun run type-check

# Database operations
bun run db:push
bun run db:generate
bun run db:studio
```

---

## 📈 Performance

- **Next.js 16** with optimized bundling
- **Image Optimization** with Next.js Image component
- **Lazy Loading** for better performance
- **Tailwind CSS** with purging for minimal CSS
- **Prisma** with optimized database queries

---

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### **Development Workflow**
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **Next.js Team** for the amazing framework
- **Prisma** for the excellent ORM
- **shadcn/ui** for beautiful components
- **Tailwind CSS** for utility-first styling
- **Arab business community** for insights and feedback

---

## 📞 Contact & Support

- **📧 Email**: support@bizarabic.com
- **💬 Discord**: [Join our community](#)
- **📱 Twitter**: [@BizArabic](#)
- **📞 Phone**: +966-XXX-XXXX

---

## 🗺️ Roadmap

### **Q1 2024**
- [ ] Payment gateway integration
- [ ] Document upload system
- [ ] Mobile app development

### **Q2 2024**
- [ ] Advanced AI features
- [ ] Multi-language support
- [ ] API for third-party integrations

### **Q3 2024**
- [ ] Blockchain integration
- [ ] Advanced analytics
- [ ] Enterprise features

---

<div align="center">

**⭐ Star this repository if it helped you!**

**🚀 Let's build the future of business setup in Arab countries together!**

Made with ❤️ by the BizArabic Team

</div>