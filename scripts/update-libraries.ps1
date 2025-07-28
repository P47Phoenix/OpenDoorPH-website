# OpenDoorPH Website Library Update Script (PowerShell)
# Run this script to update all dependencies to latest versions

Write-Host "🚀 Starting OpenDoorPH Website Library Update" -ForegroundColor Green
Write-Host "=============================================" -ForegroundColor Green

# Check if we're in the right directory
if (-not (Test-Path "package.json")) {
    Write-Host "❌ Error: package.json not found. Please run this script from the OpenDoorWebsiteApp directory." -ForegroundColor Red
    exit 1
}

Write-Host "📋 Step 1: Creating backup..." -ForegroundColor Cyan
try {
    git checkout -b library-update-backup 2>$null
} catch {
    Write-Host "Branch already exists" -ForegroundColor Yellow
}
Copy-Item package.json package.json.backup
Write-Host "✅ Backup created" -ForegroundColor Green

Write-Host "📋 Step 2: Creating feature branch..." -ForegroundColor Cyan
try {
    git checkout -b feature/library-updates 2>$null
} catch {
    git checkout feature/library-updates
}
Write-Host "✅ Feature branch ready" -ForegroundColor Green

Write-Host "📋 Step 3: Cleaning existing installation..." -ForegroundColor Cyan
Remove-Item -Recurse -Force node_modules -ErrorAction SilentlyContinue
Remove-Item package-lock.json -ErrorAction SilentlyContinue
Remove-Item yarn.lock -ErrorAction SilentlyContinue
Write-Host "✅ Clean installation prepared" -ForegroundColor Green

Write-Host "📋 Step 4: Updating package.json..." -ForegroundColor Cyan
$packageJson = @'
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
'@
$packageJson | Out-File -FilePath "package.json" -Encoding utf8
Write-Host "✅ package.json updated" -ForegroundColor Green

Write-Host "📋 Step 5: Installing dependencies..." -ForegroundColor Cyan
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ npm install failed. Check error messages above." -ForegroundColor Red
    exit 1
}
Write-Host "✅ Dependencies installed" -ForegroundColor Green

Write-Host "📋 Step 6: Updating source code..." -ForegroundColor Cyan

# Update src/index.js for React 18
$indexJs = @'
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
'@
$indexJs | Out-File -FilePath "src/index.js" -Encoding utf8

# Create reportWebVitals.js
$reportWebVitals = @'
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
'@
$reportWebVitals | Out-File -FilePath "src/reportWebVitals.js" -Encoding utf8

# Update setupTests.js
$setupTests = @'
// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';
'@
$setupTests | Out-File -FilePath "src/setupTests.js" -Encoding utf8

# Update App.test.js
$appTest = @'
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders Open Door church app', () => {
  render(<App />);
  const linkElement = screen.getByText(/Open Door/i);
  expect(linkElement).toBeInTheDocument();
});
'@
$appTest | Out-File -FilePath "src/App.test.js" -Encoding utf8

Write-Host "✅ Source code updated" -ForegroundColor Green

Write-Host "📋 Step 7: Running security audit..." -ForegroundColor Cyan
npm audit fix --audit-level=high
Write-Host "✅ Security audit completed" -ForegroundColor Green

Write-Host "📋 Step 8: Testing installation..." -ForegroundColor Cyan
Write-Host "Starting test build..." -ForegroundColor Yellow
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Build failed. Please check the errors above." -ForegroundColor Red
    exit 1
}
Write-Host "✅ Build test passed" -ForegroundColor Green

Write-Host ""
Write-Host "🎉 Library update completed successfully!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "📊 Update Summary:" -ForegroundColor Cyan
Write-Host "  • React: 16.x → 18.3.1" -ForegroundColor White
Write-Host "  • React DOM: 16.x → 18.3.1" -ForegroundColor White
Write-Host "  • React Router: 4.x → 6.26.2" -ForegroundColor White
Write-Host "  • React Scripts: 2.x → 5.0.1" -ForegroundColor White
Write-Host "  • Added modern testing libraries" -ForegroundColor White
Write-Host "  • Added web vitals for performance monitoring" -ForegroundColor White
Write-Host ""
Write-Host "🔧 Manual steps still required:" -ForegroundColor Yellow
Write-Host "  1. Update src/Pages/Master.js to use React Router v6 syntax" -ForegroundColor White
Write-Host "  2. Test all functionality thoroughly" -ForegroundColor White
Write-Host "  3. Commit and push changes" -ForegroundColor White
Write-Host ""
Write-Host "📋 Next commands to run:" -ForegroundColor Cyan
Write-Host "  npm start    # Start development server" -ForegroundColor White
Write-Host "  npm test     # Run tests" -ForegroundColor White
Write-Host "  npm audit    # Check for remaining vulnerabilities" -ForegroundColor White
Write-Host ""
Write-Host "⚠️  IMPORTANT: Test the Router update in Master.js" -ForegroundColor Red
Write-Host "   Replace <Switch> with <Routes> and update <Route> syntax" -ForegroundColor Yellow
Write-Host "   See docs/library-update-implementation.md for details" -ForegroundColor Yellow
