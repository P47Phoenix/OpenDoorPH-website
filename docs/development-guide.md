# Development Guide

## 🚀 Getting Started

This guide provides comprehensive instructions for setting up, developing, and deploying the OpenDoorPH website.

## 📋 Prerequisites

### Required Software
- **Node.js**: Version 12.x or higher
- **npm**: Version 6.x or higher (comes with Node.js)
- **Git**: Latest version for version control
- **AWS CLI**: For infrastructure management (optional)
- **Terraform**: For infrastructure as code (optional)

### Development Tools (Recommended)
- **VS Code**: With React extensions
- **React Developer Tools**: Browser extension
- **Git**: Command line or GUI client

## 🔧 Local Development Setup

### 1. Repository Clone
```bash
# Clone the repository
git clone https://github.com/P47Phoenix/OpenDoorPH-website.git

# Navigate to project directory
cd OpenDoorPH-website

# Navigate to the React application
cd OpenDoorWebsiteApp
```

### 2. Dependency Installation
```bash
# Install project dependencies
npm install

# Verify installation
npm list --depth=0
```

### 3. Environment Configuration
```bash
# Create environment file (if needed)
touch .env

# Add any environment variables
# (Currently no environment variables required)
```

### 4. Start Development Server
```bash
# Start the development server
npm start

# Server will start at http://localhost:3000
# Browser should automatically open to the application
```

## 📦 Dependencies Overview

### Core Dependencies
```json
{
  "react": "^16.0.0",           // Core React library
  "react-dom": "^16.0.0",       // React DOM rendering
  "react-router-dom": "^4.2.2", // Client-side routing
  "react-scripts": "^2.1.3"     // Create React App scripts
}
```

### Development Dependencies
- **ESLint**: Code linting and quality
- **Jest**: Testing framework
- **Webpack**: Module bundling (via react-scripts)
- **Babel**: JavaScript transpilation (via react-scripts)

## 🏗️ Project Structure

### Application Structure
```
OpenDoorWebsiteApp/
├── public/                 # Static public assets
│   ├── index.html         # HTML template
│   ├── manifest.json      # Web app manifest
│   └── headerphoto.jpg    # Header image
├── src/                   # Source code
│   ├── App.js            # Root component
│   ├── App.css           # Global styles
│   ├── index.js          # Application entry point
│   ├── index.css         # Base styles
│   ├── Components/       # Reusable components
│   │   ├── Footer.js     # Site footer
│   │   └── SideBar.js    # Navigation sidebar
│   ├── Pages/            # Page components
│   │   ├── Master.js     # Layout component
│   │   ├── Main.js       # Home page
│   │   ├── Video.js      # Video page
│   │   ├── Location.js   # Location page
│   │   └── About.js      # About page
│   └── [assets]          # Image and media files
├── package.json          # Project configuration
└── README.md            # Project documentation
```

## 🛠️ Development Workflow

### 1. Code Development
```bash
# Create a new feature branch
git checkout -b feature/new-feature-name

# Make code changes
# Edit files in src/ directory

# Test changes locally
npm start
```

### 2. Testing
```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run tests with coverage
npm test -- --coverage
```

### 3. Code Quality
```bash
# Run linting
npm run lint

# Fix auto-fixable linting issues
npm run lint -- --fix

# Check for formatting issues
npm run format:check
```

### 4. Build for Production
```bash
# Create production build
npm run build

# Build output will be in build/ directory
# Optimized and minified for production
```

## 📝 Component Development

### Creating New Components

#### 1. Functional Component Template
```javascript
// src/Components/NewComponent.js
import React from 'react';

export const NewComponent = ({ prop1, prop2 }) => {
    return (
        <div className="new-component">
            <h2>{prop1}</h2>
            <p>{prop2}</p>
        </div>
    );
};
```

#### 2. Class Component Template
```javascript
// src/Components/NewClassComponent.js
import React, { Component } from 'react';

export class NewClassComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            // component state
        };
    }

    render() {
        return (
            <div className="new-class-component">
                {/* component JSX */}
            </div>
        );
    }
}
```

### Adding New Pages

#### 1. Create Page Component
```javascript
// src/Pages/NewPage.js
import React from 'react';

export const NewPage = () => {
    return (
        <div>
            <h1>New Page Title</h1>
            {/* page content */}
        </div>
    );
};
```

#### 2. Add Route to Master.js
```javascript
// Import the new page
import { NewPage } from './NewPage';

// Add route in Router component
<Route exact={true} path="/opendoor/Home/NewPage" render={NewPage}/>
```

#### 3. Add Navigation Link
```javascript
// Add navigation link in Master.js header
<li><a href="/opendoor/Home/NewPage" title="New page"><span>New Page</span></a></li>
```

## 🎨 Styling Guidelines

### CSS Organization
- **Global Styles**: `src/index.css` and `src/App.css`
- **Component Styles**: Include styles in component files or separate CSS files
- **Responsive Design**: Use media queries for different screen sizes

### CSS Best Practices
```css
/* Use consistent naming conventions */
.component-name {
    /* styles */
}

.component-name__element {
    /* BEM methodology */
}

.component-name--modifier {
    /* state or variant styles */
}

/* Responsive design */
@media (max-width: 768px) {
    .component-name {
        /* mobile styles */
    }
}
```

## 🧪 Testing Strategy

### Test Types
- **Unit Tests**: Individual component testing
- **Integration Tests**: Component interaction testing
- **End-to-End Tests**: Full user workflow testing

### Writing Tests
```javascript
// src/Components/__tests__/NewComponent.test.js
import React from 'react';
import { render, screen } from '@testing-library/react';
import { NewComponent } from '../NewComponent';

test('renders component correctly', () => {
    render(<NewComponent prop1="Test" prop2="Content" />);
    
    expect(screen.getByText('Test')).toBeInTheDocument();
    expect(screen.getByText('Content')).toBeInTheDocument();
});
```

## 🚀 Deployment Guide

### Local Production Build
```bash
# Create production build
npm run build

# Serve build locally (optional)
npx serve -s build
```

### AWS Deployment

#### 1. Infrastructure Setup (Terraform)
```bash
# Navigate to Terraform directory
cd ../Terraform

# Initialize Terraform
terraform init

# Plan infrastructure changes
terraform plan

# Apply infrastructure changes
terraform apply
```

#### 2. Deploy to S3
```bash
# Build the application
npm run build

# Upload build files to S3 bucket
aws s3 sync build/ s3://opendoorsitebucket --delete

# Invalidate CloudFront cache
aws cloudfront create-invalidation --distribution-id YOUR_DISTRIBUTION_ID --paths "/*"
```

## 🔧 Configuration Management

### Environment Variables
```bash
# Development environment (.env.local)
REACT_APP_ENV=development
REACT_APP_API_URL=http://localhost:3001

# Production environment
REACT_APP_ENV=production
REACT_APP_API_URL=https://api.opendoorph.com
```

### Build Configuration
- **Build Tool**: Create React App (react-scripts)
- **Bundler**: Webpack (configured by react-scripts)
- **Transpiler**: Babel (configured by react-scripts)
- **Optimization**: Automatic code splitting and minification

## 🐛 Debugging and Troubleshooting

### Common Issues

#### 1. npm install failures
```bash
# Clear npm cache
npm cache clean --force

# Remove node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

#### 2. Port conflicts
```bash
# Use different port
PORT=3001 npm start

# Or kill process using port 3000
npx kill-port 3000
```

#### 3. Build failures
```bash
# Check for linting errors
npm run lint

# Clear build cache
rm -rf build/
npm run build
```

### Debugging Tools
- **React Developer Tools**: Browser extension for React debugging
- **Chrome DevTools**: Network, Console, and Performance tabs
- **VS Code Debugger**: Integrated debugging support

## 📚 Additional Resources

### Documentation
- [React Documentation](https://reactjs.org/docs/)
- [React Router Documentation](https://reactrouter.com/)
- [Create React App Documentation](https://create-react-app.dev/)
- [AWS S3 Static Website Hosting](https://docs.aws.amazon.com/s3/latest/userguide/WebsiteHosting.html)

### Best Practices
- [React Best Practices](https://reactjs.org/docs/thinking-in-react.html)
- [JavaScript Style Guide](https://github.com/airbnb/javascript)
- [Accessibility Guidelines](https://reactjs.org/docs/accessibility.html)

## 🤝 Contributing Guidelines

### Code Review Process
1. Create feature branch from master
2. Implement changes with tests
3. Submit pull request with description
4. Code review and approval
5. Merge to master branch

### Commit Message Format
```
type(scope): description

Examples:
feat(pages): add new video page component
fix(navigation): resolve mobile menu issue
docs(readme): update installation instructions
```
