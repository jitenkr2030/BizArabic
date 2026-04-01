# Contributing to BizArabic

Thank you for your interest in contributing to BizArabic! This document provides guidelines and information for contributors.

## 🤝 How to Contribute

### **Reporting Issues**
- Use GitHub Issues for bug reports
- Provide detailed description and steps to reproduce
- Include screenshots if applicable
- Specify your environment (OS, browser, etc.)

### **Feature Requests**
- Open an issue with "Feature Request" label
- Describe the use case and benefits
- Provide implementation suggestions if possible

### **Code Contributions**

#### **Setup Development Environment**
1. Fork the repository
2. Clone your fork locally
```bash
git clone https://github.com/YOUR-USERNAME/BizArabic.git
cd BizArabic
```

3. Add upstream remote
```bash
git remote add upstream https://github.com/jitenkr2030/BizArabic.git
```

4. Install dependencies
```bash
bun install
```

5. Create a feature branch
```bash
git checkout -b feature/your-feature-name
```

#### **Development Guidelines**
- Follow the existing code style (ESLint configuration)
- Write TypeScript for all new code
- Use shadcn/ui components for UI
- Add proper error handling
- Include comments for complex logic

#### **Testing**
- Test your changes thoroughly
- Run linting: `bun run lint`
- Check TypeScript compilation
- Test UI responsiveness

#### **Commit Guidelines**
- Use conventional commit messages
- Examples:
  - `feat: add user authentication`
  - `fix: resolve calculator bug`
  - `docs: update README`
  - `style: improve button design`

#### **Pull Request Process**
1. Update your branch with latest changes
```bash
git fetch upstream
git rebase upstream/master
```

2. Push to your fork
```bash
git push origin feature/your-feature-name
```

3. Create a Pull Request
- Provide clear description
- Link related issues
- Include screenshots for UI changes
- Request review from maintainers

## 🏗️ Project Structure

### **Key Directories**
- `src/app/` - Next.js App Router pages and API routes
- `src/components/` - React components
- `src/lib/` - Utility functions and configurations
- `prisma/` - Database schema and migrations

### **Component Guidelines**
- Use functional components with hooks
- Follow React best practices
- Implement proper TypeScript types
- Use Tailwind CSS for styling
- Make components reusable and accessible

### **API Guidelines**
- Use RESTful conventions
- Implement proper error handling
- Validate input with Zod schemas
- Return consistent response formats
- Include proper HTTP status codes

## 🎯 Areas for Contribution

### **High Priority**
- [ ] Document upload system
- [ ] Payment gateway integration
- [ ] Admin panel development
- [ ] Mobile responsiveness improvements

### **Medium Priority**
- [ ] Advanced AI features
- [ ] Multi-language support
- [ ] Performance optimizations
- [ ] Unit tests

### **Low Priority**
- [ ] Documentation improvements
- [ ] UI/UX enhancements
- [ ] Accessibility improvements
- [ ] DevOps automation

## 📝 Coding Standards

### **TypeScript**
- Use strict mode
- Define proper interfaces
- Avoid `any` type
- Use proper generics

### **React**
- Use functional components
- Implement proper hooks usage
- Follow React best practices
- Optimize performance with useMemo/useCallback

### **CSS/Tailwind**
- Use Tailwind utility classes
- Maintain consistent spacing
- Ensure responsive design
- Follow design system

### **Database**
- Follow Prisma best practices
- Use proper relationships
- Implement data validation
- Consider performance implications

## 🐛 Bug Reports

When reporting bugs, please include:
- Clear description of the issue
- Steps to reproduce
- Expected vs actual behavior
- Environment details
- Screenshots if applicable

## 💡 Feature Requests

For feature requests:
- Describe the problem you're solving
- Explain the proposed solution
- Consider alternative approaches
- Discuss implementation complexity

## 📧 Getting Help

- Create an issue for questions
- Join our Discord community
- Check existing documentation
- Review similar issues

## 📜 Code of Conduct

Please be respectful and professional in all interactions:
- Use inclusive language
- Provide constructive feedback
- Welcome newcomers
- Focus on what's best for the community

## 🏆 Recognition

Contributors will be:
- Listed in our README
- Mentioned in release notes
- Invited to our contributor Discord
- Eligible for BizArabic merchandise

Thank you for contributing to BizArabic! 🚀