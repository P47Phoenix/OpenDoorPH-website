#!/bin/bash
# OpenDoorPH Website Library Update Script
# Run this script to update all dependencies to latest versions

echo "🚀 Starting OpenDoorPH Website Library Update"
echo "============================================="

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Please run this script from the OpenDoorWebsiteApp directory."
    exit 1
fi

echo "📋 Step 1: Creating backup..."
git checkout -b library-update-backup 2>/dev/null || echo "Branch already exists"
cp package.json package.json.backup
echo "✅ Backup created"

echo "📋 Step 2: Creating feature branch..."
git checkout -b feature/library-updates 2>/dev/null || git checkout feature/library-updates
echo "✅ Feature branch ready"

echo "📋 Step 3: Cleaning existing installation..."
rm -rf node_modules package-lock.json yarn.lock 2>/dev/null
echo "✅ Clean installation prepared"

echo "📋 Step 4: Updating package.json..."
cat > package.json << 'EOF'
{
  "name": "opendoorwebsiteapp",
  "version": "0.2.0",
  "private": true,
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "react-router-dom": "^6.26.2",
    "react-scripts": "^5.0.1",
    "@testing-library/jest-dom": "^6.5.0",
    "@testing-library/react": "^16.0.1",
    "@testing-library/user-event": "^14.5.2",
    "web-vitals": "^4.2.3"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test",
    "eject": "react-scripts eject",
    "lint": "eslint src/**/*.{js,jsx}",
    "lint:fix": "eslint src/**/*.{js,jsx} --fix"
  },
  "eslintConfig": {
    "extends": [
      "react-app",
      "react-app/jest"
    ]
  },
  "browserslist": {
    "production": [
      ">0.2%",
      "not dead",
      "not op_mini all"
    ],
    "development": [
      "last 1 chrome version",
      "last 1 firefox version",
      "last 1 safari version"
    ]
  }
}
if [ ! -f "package.json.template" ]; then
    echo "❌ Error: package.json.template not found. Please provide a template file."
    exit 1
fi
cp package.json.template package.json
echo "✅ package.json updated"

echo "📋 Step 5: Installing dependencies..."
npm install
if [ $? -ne 0 ]; then
    echo "❌ npm install failed. Check error messages above."
    exit 1
fi
echo "✅ Dependencies installed"

echo "📋 Step 6: Updating source code..."

# Update src/index.js for React 18
cat > src/index.js << 'EOF'
import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

const container = document.getElementById('root');
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
EOF

# Create reportWebVitals.js
cat > src/reportWebVitals.js << 'EOF'
const reportWebVitals = onPerfEntry => {
  if (onPerfEntry && onPerfEntry instanceof Function) {
    import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
      getCLS(onPerfEntry);
      getFID(onPerfEntry);
      getFCP(onPerfEntry);
      getLCP(onPerfEntry);
      getTTFB(onPerfEntry);
    });
  }
};

export default reportWebVitals;
EOF

# Update setupTests.js
cat > src/setupTests.js << 'EOF'
// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';
EOF

# Update App.test.js
cat > src/App.test.js << 'EOF'
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders Open Door church app', () => {
  render(<App />);
  const linkElement = screen.getByText(/Open Door/i);
  expect(linkElement).toBeInTheDocument();
});
EOF

echo "✅ Source code updated"

echo "📋 Step 7: Running security audit..."
npm audit fix --audit-level=high
echo "✅ Security audit completed"

echo "📋 Step 8: Testing installation..."
echo "Starting test build..."
npm run build
if [ $? -ne 0 ]; then
    echo "❌ Build failed. Please check the errors above."
    exit 1
fi
echo "✅ Build test passed"

echo ""
echo "🎉 Library update completed successfully!"
echo "========================================"
echo ""
echo "📊 Update Summary:"
echo "  • React: 16.x → 18.3.1"
echo "  • React DOM: 16.x → 18.3.1" 
echo "  • React Router: 4.x → 6.26.2"
echo "  • React Scripts: 2.x → 5.0.1"
echo "  • Added modern testing libraries"
echo "  • Added web vitals for performance monitoring"
echo ""
echo "🔧 Manual steps still required:"
echo "  1. Update src/Pages/Master.js to use React Router v6 syntax"
echo "  2. Test all functionality thoroughly"
echo "  3. Commit and push changes"
echo ""
echo "📋 Next commands to run:"
echo "  npm start    # Start development server"
echo "  npm test     # Run tests"
echo "  npm audit    # Check for remaining vulnerabilities"
echo ""
echo "⚠️  IMPORTANT: Test the Router update in Master.js"
echo "   Replace <Switch> with <Routes> and update <Route> syntax"
echo "   See docs/library-update-implementation.md for details"
