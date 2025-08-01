# Ideal Directory Structure & Migration Plan

## 📋 Current State Analysis

The OpenDoor PH website currently has a mixed structure with some organizational issues that could be improved for better maintainability, scalability, and developer experience.

### 🔍 Current Structure Issues

#### **1. Asset Organization Problems**
- **Images scattered in `src/`**: 22+ image files (JPG, PNG, GIF) mixed with code files
- **Multiple formats**: Both JPG and PNG versions of the same images
- **Poor categorization**: Church member photos, UI elements, and graphics all in one location
- **Naming inconsistencies**: Mix of camelCase and descriptive names

#### **2. Code Organization Issues**
- **Legacy files**: `registerServiceWorker.js`, `reportWebVitals.js` in root src
- **Mixed file types**: JS and TS files coexisting
- **Configuration scattered**: Analytics config separate from other configs
- **Component hierarchy unclear**: All components in flat structure

#### **3. Documentation Structure Issues**
- **Root-level workflow files**: Should be in `.github/` or `docs/`
- **Mixed documentation purposes**: Setup, technical, and feature docs intermixed
- **Incomplete organization**: Some docs don't follow established patterns

## 🎯 Ideal Directory Structure

```
OpenDoorPH-website/
├── .github/                           # GitHub-specific files
│   ├── workflows/                     # CI/CD workflows
│   │   └── node-build.yml
│   ├── prompts/                       # AI collaboration prompts
│   │   ├── feature-development.prompts.md
│   │   ├── architecture-design.prompts.md
│   │   └── [other prompts...]
│   ├── ISSUE_TEMPLATE/                # Issue templates
│   ├── PULL_REQUEST_TEMPLATE.md       # PR template
│   └── copilot-instructions.md
│
├── .vscode/                           # VS Code settings
│   ├── settings.json
│   ├── launch.json
│   └── extensions.json                # Recommended extensions
│
├── docs/                              # All documentation
│   ├── README.md                      # Documentation index
│   ├── NAVIGATION.md                  # Doc navigation guide
│   ├── setup/                         # Setup and installation
│   │   ├── README.md
│   │   ├── quick-setup.md             # From root QUICK-SETUP.md
│   │   ├── repository-secrets.md      # From root SETUP-REPOSITORY-SECRET.md
│   │   └── google-analytics-setup.md
│   ├── development/                   # Development guides
│   │   ├── README.md
│   │   ├── development-guide.md
│   │   ├── components.md
│   │   └── api-reference.md
│   ├── architecture/                  # Technical architecture
│   │   ├── README.md
│   │   ├── system-architecture.md     # From technical/architecture.md
│   │   ├── directory-structure.md     # This file
│   │   └── deployment-architecture.md
│   ├── infrastructure/                # Infrastructure & deployment
│   │   ├── README.md
│   │   ├── aws-infrastructure.md      # From technical/infrastructure.md
│   │   ├── terraform-setup.md
│   │   ├── deployment-process.md
│   │   └── amazon-global-constructs.md
│   ├── features/                      # Feature documentation
│   │   ├── README.md
│   │   └── features.md
│   ├── updates/                       # Update logs and plans
│   │   ├── README.md
│   │   ├── library-updates/
│   │   │   ├── update-plan.md
│   │   │   └── implementation.md
│   │   └── typescript-conversion/
│   │       └── conversion-plan.md
│   └── workflows/                     # Workflow documentation
│       ├── README.md
│       ├── fix-tasks.md               # From root WORKFLOW-FIX-TASKS.md
│       └── status-updates.md          # From root WORKFLOW-STATUS-UPDATE.md
│
├── infrastructure/                    # Infrastructure as Code
│   ├── terraform/                     # Terraform configurations
│   │   ├── README.md
│   │   ├── main.tf                    # From Terraform/main.tf
│   │   ├── variables.tf
│   │   ├── outputs.tf
│   │   ├── providers.tf
│   │   └── modules/                   # Terraform modules
│   ├── docker/                        # Docker configurations
│   │   ├── Dockerfile                 # From Terraform/Dockerfile
│   │   ├── docker-compose.yml
│   │   └── .dockerignore
│   └── scripts/                       # Deployment scripts
│       ├── deploy.sh
│       ├── update-libraries.sh        # From scripts/
│       └── update-libraries.ps1       # From scripts/
│
├── src/                               # Main application source
│   ├── components/                    # React components (organized by type)
│   │   ├── layout/                    # Layout components
│   │   │   ├── Header/
│   │   │   │   ├── Header.tsx
│   │   │   │   ├── Header.module.css
│   │   │   │   └── index.ts
│   │   │   ├── Footer/
│   │   │   │   ├── Footer.tsx         # From Components/Footer.tsx
│   │   │   │   ├── Footer.module.css
│   │   │   │   └── index.ts
│   │   │   ├── SideBar/
│   │   │   │   ├── SideBar.tsx        # From Components/SideBar.tsx
│   │   │   │   ├── SideBar.module.css
│   │   │   │   └── index.ts
│   │   │   └── Navigation/
│   │   │       ├── Navigation.tsx
│   │   │       ├── Navigation.module.css
│   │   │       └── index.ts
│   │   ├── common/                    # Reusable UI components
│   │   │   ├── Button/
│   │   │   ├── Card/
│   │   │   ├── Modal/
│   │   │   └── LoadingSpinner/
│   │   ├── tracking/                  # Analytics components
│   │   │   ├── RouteTracker/
│   │   │   │   ├── RouteTracker.tsx   # From Components/RouteTracker.tsx
│   │   │   │   └── index.ts
│   │   │   └── AnalyticsProvider/
│   │   └── church/                    # Church-specific components
│   │       ├── ServiceSchedule/
│   │       ├── ChurchInfo/
│   │       └── MemberPhotos/
│   │
│   ├── pages/                         # Page components
│   │   ├── HomePage/
│   │   │   ├── HomePage.tsx           # From Pages/Main.tsx
│   │   │   ├── HomePage.module.css
│   │   │   └── index.ts
│   │   ├── AboutPage/
│   │   │   ├── AboutPage.tsx          # From Pages/About.tsx
│   │   │   ├── AboutPage.module.css
│   │   │   └── index.ts
│   │   ├── LocationPage/
│   │   │   ├── LocationPage.tsx       # From Pages/Location.tsx
│   │   │   ├── LocationPage.module.css
│   │   │   └── index.ts
│   │   ├── VideoPage/
│   │   │   ├── VideoPage.tsx          # From Pages/Video.tsx
│   │   │   ├── VideoPage.module.css
│   │   │   └── index.ts
│   │   └── MasterLayout/
│   │       ├── MasterLayout.tsx       # From Pages/Master.tsx
│   │       ├── MasterLayout.module.css
│   │       └── index.ts
│   │
│   ├── assets/                        # Static assets (organized by type)
│   │   ├── images/                    # All image assets
│   │   │   ├── church/                # Church-related photos
│   │   │   │   ├── members/           # Member photos
│   │   │   │   │   ├── pastor-and-wife.jpg    # From PastorAndWife.JPG
│   │   │   │   │   ├── board-members.jpg      # From BoardMembers.JPG
│   │   │   │   │   ├── deacons.jpg            # From Deacons.JPG
│   │   │   │   │   ├── sunday-school-teachers.jpg # From SundaySchoolTeachers.JPG
│   │   │   │   │   ├── wednesday-teachers.jpg # From WendsdayNightTeachers.JPG
│   │   │   │   │   ├── worship-team.jpg       # From WorshipTeam.JPG
│   │   │   │   │   ├── nursery.jpg            # From Nursery.JPG
│   │   │   │   │   └── linda.jpg              # From Linda.JPG
│   │   │   │   └── building/          # Church building photos
│   │   │   │       └── header-photo.jpg       # From headerphoto.jpg
│   │   │   ├── ui/                    # UI graphics and icons
│   │   │   │   ├── backgrounds/
│   │   │   │   │   ├── main-bg.gif            # From bg.gif
│   │   │   │   │   └── header-bg.gif          # From headerbg.gif
│   │   │   │   ├── icons/
│   │   │   │   │   ├── clock.gif              # From clock.gif
│   │   │   │   │   ├── comment.gif            # From comment.gif
│   │   │   │   │   └── page.gif               # From page.gif
│   │   │   │   └── tabs/
│   │   │   │       ├── tab-left.gif           # From tableft.gif
│   │   │   │       └── tab-right.gif          # From tabright.gif
│   │   │   └── logos/
│   │   │       └── react-logo.svg             # From logo.svg
│   │   ├── fonts/                     # Custom fonts
│   │   └── documents/                 # PDFs, docs, etc.
│   │
│   ├── styles/                        # Global styles
│   │   ├── globals.css                # From index.css
│   │   ├── variables.css              # CSS custom properties
│   │   ├── typography.css             # Font and text styles
│   │   ├── layout.css                 # Layout utilities
│   │   └── components.css             # Base component styles
│   │
│   ├── utils/                         # Utility functions
│   │   ├── analytics/                 # Analytics utilities
│   │   │   ├── analytics.ts           # From utils/analytics.ts
│   │   │   ├── events.ts              # Event definitions
│   │   │   └── index.ts
│   │   ├── routing/                   # Routing utilities
│   │   ├── validation/                # Input validation
│   │   ├── formatting/                # Data formatting
│   │   └── constants/                 # App constants
│   │
│   ├── config/                        # Configuration files
│   │   ├── analytics.ts               # From config/analytics.ts
│   │   ├── routes.ts                  # Route definitions
│   │   ├── api.ts                     # API configuration
│   │   ├── environment.ts             # Environment variables
│   │   └── constants.ts               # App-wide constants
│   │
│   ├── types/                         # TypeScript type definitions
│   │   ├── api.ts                     # API types
│   │   ├── components.ts              # Component prop types
│   │   ├── routing.ts                 # From types/routing.ts
│   │   ├── analytics.ts               # Analytics types
│   │   └── index.ts                   # From types/index.ts
│   │
│   ├── hooks/                         # Custom React hooks
│   │   ├── useAnalytics.ts            # Analytics hook
│   │   ├── useRouting.ts              # Routing hook
│   │   └── useLocalStorage.ts         # Local storage hook
│   │
│   ├── services/                      # External service integrations
│   │   ├── analytics/                 # Google Analytics service
│   │   ├── youtube/                   # YouTube API integration
│   │   └── maps/                      # Google Maps integration
│   │
│   ├── App.tsx                        # Main App component
│   ├── App.module.css                 # App-specific styles (from App.css)
│   ├── index.tsx                      # Application entry point
│   └── react-app-env.d.ts             # React app type definitions
│
├── public/                            # Static public assets
│   ├── index.html                     # HTML template
│   ├── manifest.json                  # PWA manifest
│   ├── robots.txt                     # SEO robots file
│   ├── sitemap.xml                    # SEO sitemap
│   └── favicon.ico                    # Site favicon
│
├── tests/                             # Test files (organized by type)
│   ├── __mocks__/                     # Mock files
│   ├── components/                    # Component tests
│   ├── pages/                         # Page tests
│   ├── utils/                         # Utility tests
│   ├── integration/                   # Integration tests
│   └── e2e/                           # End-to-end tests
│
├── tools/                             # Development tools and scripts
│   ├── build/                         # Build scripts
│   ├── generators/                    # Code generators
│   └── analyzers/                     # Code analysis tools
│
├── .env.example                       # Environment variables template
├── .env.local                         # Local environment variables
├── .gitignore                         # Git ignore rules
├── .gitattributes                     # Git attributes
├── package.json                       # Dependencies and scripts
├── package-lock.json                  # Locked dependencies
├── tsconfig.json                      # TypeScript configuration
├── tsconfig.paths.json                # TypeScript path mapping
├── jest.config.js                     # Jest testing configuration
├── README.md                          # Project overview
└── LICENSE                            # Project license
```

## 🚀 Migration Plan

### Phase 1: Asset Organization (High Priority)

#### **1.1 Create Asset Directory Structure**
```bash
mkdir -p src/assets/{images/{church/{members,building},ui/{backgrounds,icons,tabs},logos},fonts,documents}
```

#### **1.2 Move and Rename Image Files**
```bash
# Church member photos
mv src/PastorAndWife.JPG src/assets/images/church/members/pastor-and-wife.jpg
mv src/BoardMembers.JPG src/assets/images/church/members/board-members.jpg
mv src/Deacons.JPG src/assets/images/church/members/deacons.jpg
mv src/SundaySchoolTeachers.JPG src/assets/images/church/members/sunday-school-teachers.jpg
mv src/WendsdayNightTeachers.JPG src/assets/images/church/members/wednesday-teachers.jpg
mv src/WorshipTeam.JPG src/assets/images/church/members/worship-team.jpg
mv src/Nursery.JPG src/assets/images/church/members/nursery.jpg
mv src/Linda.JPG src/assets/images/church/members/linda.jpg

# Remove duplicate PNG files (keep JPG versions)
rm src/*.PNG src/*.png

# UI graphics
mv src/bg.gif src/assets/images/ui/backgrounds/main-bg.gif
mv src/headerbg.gif src/assets/images/ui/backgrounds/header-bg.gif
mv src/clock.gif src/assets/images/ui/icons/clock.gif
mv src/comment.gif src/assets/images/ui/icons/comment.gif
mv src/page.gif src/assets/images/ui/icons/page.gif
mv src/tableft.gif src/assets/images/ui/tabs/tab-left.gif
mv src/tabright.gif src/assets/images/ui/tabs/tab-right.gif

# Logos and building photos
mv src/logo.svg src/assets/images/logos/react-logo.svg
mv public/headerphoto.jpg src/assets/images/church/building/header-photo.jpg
```

#### **1.3 Update Import Statements**
- Update all components to use new asset paths
- Create asset index files for easier imports
- Update CSS files to reference new image locations

### Phase 2: Code Organization (High Priority)

#### **2.1 Create Component Directory Structure**
```bash
mkdir -p src/components/{layout/{Header,Footer,SideBar,Navigation},common,tracking/{RouteTracker,AnalyticsProvider},church}
mkdir -p src/pages/{HomePage,AboutPage,LocationPage,VideoPage,MasterLayout}
```

#### **2.2 Move and Restructure Components**
```bash
# Layout components
mv src/Components/Footer.tsx src/components/layout/Footer/Footer.tsx
mv src/Components/SideBar.tsx src/components/layout/SideBar/SideBar.tsx
mv src/Components/RouteTracker.tsx src/components/tracking/RouteTracker/RouteTracker.tsx

# Page components
mv src/Pages/Main.tsx src/pages/HomePage/HomePage.tsx
mv src/Pages/About.tsx src/pages/AboutPage/AboutPage.tsx
mv src/Pages/Location.tsx src/pages/LocationPage/LocationPage.tsx
mv src/Pages/Video.tsx src/pages/VideoPage/VideoPage.tsx
mv src/Pages/Master.tsx src/pages/MasterLayout/MasterLayout.tsx
```

#### **2.3 Create Index Files and Module CSS**
- Add `index.ts` files for each component directory
- Convert global CSS to CSS modules for component isolation
- Create component-specific stylesheets

### Phase 3: Styles and Configuration (Medium Priority)

#### **3.1 Create Styles Directory Structure**
```bash
mkdir -p src/styles
mv src/index.css src/styles/globals.css
mv src/App.css src/styles/App.module.css
```

#### **3.2 Reorganize Configuration**
```bash
mkdir -p src/config src/utils/analytics
mv src/config/analytics.ts src/config/analytics.ts
mv src/utils/analytics.ts src/utils/analytics/analytics.ts
```

#### **3.3 Clean Up Legacy Files**
```bash
# Remove or update legacy files
rm src/setupTests.js  # Replace with TypeScript version
rm src/reportWebVitals.js  # Replace with TypeScript version
rm src/registerServiceWorker.js  # Update to modern service worker
```

### Phase 4: Documentation Reorganization (Medium Priority)

#### **4.1 Create Documentation Structure**
```bash
mkdir -p docs/{setup,architecture,infrastructure,workflows}
```

#### **4.2 Move Root Documentation Files**
```bash
mv QUICK-SETUP.md docs/setup/quick-setup.md
mv SETUP-REPOSITORY-SECRET.md docs/setup/repository-secrets.md
mv WORKFLOW-FIX-TASKS.md docs/workflows/fix-tasks.md
mv WORKFLOW-STATUS-UPDATE.md docs/workflows/status-updates.md
```

#### **4.3 Reorganize Technical Documentation**
```bash
mv docs/technical/architecture.md docs/architecture/system-architecture.md
mv docs/technical/infrastructure.md docs/infrastructure/aws-infrastructure.md
mv docs/technical/deployment-process.md docs/infrastructure/deployment-process.md
mv docs/technical/amazon-global-constructs-setup.md docs/infrastructure/amazon-global-constructs.md
```

### Phase 5: Infrastructure and Scripts (Low Priority)

#### **5.1 Create Infrastructure Directory**
```bash
mkdir -p infrastructure/{terraform,docker,scripts}
mv Terraform/* infrastructure/terraform/
mv scripts/* infrastructure/scripts/
```

#### **5.2 Organize Docker Files**
```bash
mv Terraform/Dockerfile infrastructure/docker/Dockerfile
```

### Phase 6: Testing and Tools (Low Priority)

#### **6.1 Create Testing Structure**
```bash
mkdir -p tests/{__mocks__,components,pages,utils,integration,e2e}
mkdir -p tools/{build,generators,analyzers}
```

#### **6.2 Move Test Files**
```bash
mv src/App.test.tsx tests/components/App.test.tsx
# Move other test files as they're created
```

## 🎯 Benefits of New Structure

### **1. Developer Experience**
- **Clear separation of concerns**: Components, pages, assets, and utilities are logically grouped
- **Consistent naming**: All files follow consistent naming conventions
- **Easy navigation**: Developers can quickly find what they need
- **Scalable structure**: Easy to add new features without cluttering

### **2. Maintainability**
- **Modular components**: Each component has its own directory with related files
- **Asset organization**: Images are categorized by purpose and type
- **Configuration centralization**: All config files in dedicated locations
- **Documentation structure**: Easy to find and update documentation

### **3. Performance**
- **Optimized imports**: Tree shaking works better with organized modules
- **Asset loading**: Images can be lazy-loaded by category
- **Bundle optimization**: Better code splitting opportunities
- **Caching strategies**: Assets can be cached by type/frequency of change

### **4. Team Collaboration**
- **Clear ownership**: Each directory has a clear purpose and owner
- **Consistent patterns**: New team members can follow established patterns
- **Reduced conflicts**: Less chance of merge conflicts with organized structure
- **Better code reviews**: Easier to review changes when files are well-organized

## ⚠️ Migration Considerations

### **1. Breaking Changes**
- **Import paths**: All import statements will need to be updated
- **Asset references**: CSS and component files referencing assets need updates
- **Build processes**: May need to update build scripts for new paths
- **Deployment**: CI/CD pipelines may need path adjustments

### **2. Incremental Migration Strategy**
- **Phase-by-phase**: Implement changes in phases to minimize disruption
- **Backward compatibility**: Keep old imports working during transition
- **Testing**: Thoroughly test each phase before moving to the next
- **Documentation**: Update documentation as changes are made

### **3. Tools and Automation**
- **Path mapping**: Use TypeScript path mapping for cleaner imports
- **Build tools**: Update webpack/build configs for new structure
- **Linting**: Update ESLint rules for new file organization
- **IDE support**: Configure VS Code settings for new structure

## 📋 Implementation Checklist

### Pre-Migration
- [ ] Backup current repository
- [ ] Create feature branch for migration
- [ ] Document current import dependencies
- [ ] Plan rollback strategy

### Phase 1: Assets
- [ ] Create asset directory structure
- [ ] Move and rename image files
- [ ] Update asset import statements
- [ ] Test image loading in all components
- [ ] Update CSS references to images

### Phase 2: Components
- [ ] Create component directory structure
- [ ] Move component files to new locations
- [ ] Create component index files
- [ ] Convert to CSS modules
- [ ] Update all import statements
- [ ] Test all components render correctly

### Phase 3: Configuration
- [ ] Move configuration files
- [ ] Update import statements for configs
- [ ] Test analytics and other services
- [ ] Update environment variable references

### Phase 4: Documentation
- [ ] Create documentation structure
- [ ] Move documentation files
- [ ] Update internal documentation links
- [ ] Update README navigation
- [ ] Test all documentation links

### Phase 5: Testing
- [ ] Run all existing tests
- [ ] Update test imports
- [ ] Verify build process
- [ ] Test deployment pipeline
- [ ] Performance testing

### Post-Migration
- [ ] Update CI/CD configurations
- [ ] Update development documentation
- [ ] Train team on new structure
- [ ] Monitor for any issues
- [ ] Clean up old unused files

## 🔧 Recommended Tools

### **Development Tools**
- **Path Mapping**: TypeScript path mapping for cleaner imports
- **Asset Pipeline**: Consider webpack plugins for asset optimization
- **Component Generation**: Create templates for new components
- **Import Sorting**: ESLint rules for consistent import organization

### **Migration Tools**
- **Search and Replace**: VS Code's global search/replace for import updates
- **Refactoring Tools**: TypeScript's automated refactoring capabilities
- **Git Tools**: Use git mv to preserve file history during moves
- **Build Tools**: Update build processes incrementally

This migration will significantly improve the maintainability, scalability, and developer experience of the OpenDoor PH website while preserving all existing functionality.
