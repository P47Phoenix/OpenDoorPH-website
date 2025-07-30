# Architecture Documentation

## 🏗️ System Architecture Overview

The OpenDoorPH website follows a modern single-page application (SPA) architecture built with React and deployed on AWS infrastructure. The system is designed for simplicity, performance, and cost-effectiveness.

## 📐 Architecture Diagram

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Web Browser   │    │   CloudFront     │    │   S3 Bucket     │
│                 │◄──►│   (CDN)          │◄──►│   (Static       │
│   - React App   │    │   - SSL/TLS      │    │    Hosting)     │
│   - Routing     │    │   - Caching      │    │   - HTML/CSS/JS │
│   - Components  │    │   - Global Dist. │    │   - Images      │
└─────────────────┘    └──────────────────┘    └─────────────────┘
                                ▲
                                │
                       ┌─────────────────┐
                       │   Route 53      │
                       │   (DNS)         │
                       │   - Domain Mgmt │
                       └─────────────────┘
```

## 🏛️ Frontend Architecture

### Technology Stack
- **Framework**: React 16.x
- **Routing**: React Router DOM v4.2.2
- **Build Tool**: Create React App (react-scripts 2.1.3)
- **Language**: JavaScript (ES6+)
- **Styling**: CSS with custom stylesheets

### Component Architecture

```
App (Root Component)
└── Master (Layout Component)
    ├── Header (Navigation & Branding)
    ├── SideBar (Service Info & Links)
    ├── Router (Route Management)
    │   ├── Main (Home Page)
    │   ├── Video (Video Content)
    │   ├── Location (Church Location)
    │   └── About (Church Information)
    └── Footer (Site Footer)
```

### Directory Structure
```
src/
├── App.js                 # Root application component
├── App.css               # Global application styles
├── index.js              # Application entry point
├── index.css             # Base styles
├── Components/           # Reusable UI components
│   ├── Footer.js         # Site footer component
│   └── SideBar.js        # Sidebar navigation
├── Pages/                # Page-level components
│   ├── Master.js         # Layout master component
│   ├── Main.js           # Home page content
│   ├── Video.js          # Video content page
│   ├── Location.js       # Location information
│   └── About.js          # About church page
└── Assets/               # Static assets (images, etc.)
```

## ☁️ Infrastructure Architecture

### AWS Services Used

#### S3 (Simple Storage Service)
- **Purpose**: Static website hosting
- **Configuration**: 
  - Bucket: `{sitename}sitebucket`
  - ACL: Private (secured via CloudFront)
  - Content: Built React application files

#### CloudFront (Content Delivery Network)
- **Purpose**: Global content distribution and SSL termination
- **Features**:
  - Origin Access Identity (OAI) for S3 security
  - SSL/TLS certificate management
  - Global edge locations for performance
  - Caching strategies for static assets

#### Route 53 (DNS Service)
- **Purpose**: Domain name management and DNS routing
- **Configuration**: Domain routing to CloudFront distribution

### Infrastructure as Code
- **Tool**: Terraform
- **Configuration**: `Terraform/main.tf`
- **Features**:
  - Automated infrastructure provisioning
  - Version-controlled infrastructure
  - Repeatable deployments

## 🔧 Build and Deployment Architecture

### Build Process
1. **Development**: React development server (`npm start`)
2. **Testing**: Jest test runner (`npm test`)
3. **Production Build**: Create React App build process (`npm run build`)
4. **Optimization**: Automatic code splitting, minification, and optimization

### Deployment Pipeline
1. **Source**: Code committed to repository
2. **Build**: React application built for production
3. **Infrastructure**: Terraform provisions AWS resources
4. **Deploy**: Built files uploaded to S3 bucket
5. **Distribution**: CloudFront invalidation and content distribution

### Environment Configuration
- **Development**: Local development server (localhost:3000)
- **Production**: AWS S3 + CloudFront + Route 53

## 🔒 Security Architecture

### Frontend Security
- **HTTPS**: Enforced via CloudFront SSL/TLS
- **Content Security**: Static content served from trusted CDN
- **Client-side Routing**: React Router handles navigation

### Infrastructure Security
- **S3 Bucket**: Private access via Origin Access Identity
- **CloudFront**: Public access layer with caching and SSL
- **IAM**: Least privilege access policies

### Data Protection
- **No Sensitive Data**: Static website with no user authentication
- **SSL/TLS**: All traffic encrypted in transit
- **Content Validation**: Static content with no dynamic data processing

## 📱 Responsive Design Architecture

### Viewport Support
- **Desktop**: Primary design target
- **Tablet**: Responsive CSS adaptation
- **Mobile**: Mobile-first responsive design

### Asset Management
- **Images**: Optimized static images
- **Fonts**: Web-safe fonts and fallbacks
- **CSS**: Responsive grid and flexbox layouts

## 🚀 Performance Architecture

### Optimization Strategies
- **Code Splitting**: Automatic via Create React App
- **Asset Minification**: Production build optimization
- **CDN Distribution**: Global CloudFront edge locations
- **Browser Caching**: CloudFront caching policies

### Performance Metrics
- **First Contentful Paint**: Optimized via CDN
- **Time to Interactive**: Minimized JavaScript bundles
- **Cumulative Layout Shift**: Stable layout design

## 🔄 Scalability Considerations

### Current Scale
- **Traffic**: Local community (Pleasant Hill, MO)
- **Content**: Static content with minimal updates
- **Users**: Church members and local community

### Future Scalability
- **Content Management**: Potential CMS integration
- **User Authentication**: Member portal capabilities
- **Dynamic Content**: Event management and registration
- **API Integration**: Third-party service integrations

## 🔧 Development Architecture

### Local Development
- **Environment**: Node.js development server
- **Hot Reload**: Automatic code reloading
- **DevTools**: React Developer Tools support

### Code Quality
- **Linting**: ESLint configuration
- **Testing**: Jest testing framework
- **Build Validation**: Production build verification

## 📈 Monitoring and Analytics

### Current Monitoring
- **Basic Metrics**: CloudFront access logs
- **Error Tracking**: Browser console monitoring

### Future Monitoring
- **Analytics**: Google Analytics integration
- **Performance**: Real User Monitoring (RUM)
- **Uptime**: Service health monitoring
- **User Experience**: Core Web Vitals tracking
