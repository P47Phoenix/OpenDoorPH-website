# Component Reference

## 📦 Component Architecture Overview

The OpenDoorPH website follows a component-based architecture using React functional and class components. This document provides detailed reference for all components in the application.

## 🏗️ Component Hierarchy

```
App (Root)
└── Master (Layout)
    ├── Header (Inline)
    ├── SideBar
    ├── Router
    │   ├── Main
    │   ├── Video
    │   ├── Location
    │   └── About
    └── Footer
```

## 🎯 Root Component

### App.js
**Type**: Class Component  
**Purpose**: Application root and entry point  
**Location**: `src/App.js`

#### Component Details
```javascript
class App extends Component {
  render() {
    return (
      <Master/>
    );
  }
}
```

#### Responsibilities
- Application initialization
- Root component rendering
- Master layout mounting

#### Props
- **None**: Root component with no props

#### Dependencies
- `React.Component`
- `Master` component
- `App.css` for global styles

---

## 🎨 Layout Components

### Master.js
**Type**: Class Component  
**Purpose**: Main layout and routing container  
**Location**: `src/Pages/Master.js`

#### Component Structure
```javascript
export class Master extends Component {
    render() {
        return (
            <div>
                {/* Header Section */}
                <div id="header">
                    <h1 id="logo">
                        Open&nbsp;<span className="green">Door</span>&nbsp;Full&nbsp;<span className="gray">Gospel</span>
                        <span className="small">&nbsp;church of pleasant hill mo</span>
                    </h1>
                    <h2 id="slogan">
                        Brethren, if a man is overtaken in any trespass, you who are spiritual restore such
                        a one in a spirit of gentleness, considering yourself lest you also be tempted.
                        Galatians 6:1
                    </h2>
                    {/* Navigation Menu */}
                    <ul>
                        <li><a href="/opendoor" title="Open door home page"><span>Home</span></a></li>
                        <li><a href="/opendoor/Home/Location" title="Open door location page"><span>Location</span></a></li>
                        <li><a href="/opendoor/Home/About" title="Open door about page"><span>About</span></a></li>
                    </ul>
                </div>
                
                {/* Content Section */}
                <div id="content-wrap">
                    <img src="/headerphoto.jpg" width="820" height="120" alt="headerphoto" className="header-photo"/>
                    <SideBar />
                </div>
                
                {/* Main Content Area */}
                <div id="main">
                    <Router>
                        <div>
                            <Route exact={true} path="/" render={Main}/>
                            <Route exact={true} path="/opendoor" render={Main}/>
                            <Route exact={true} path="/opendoor/Home/Video" render={Video}/>
                            <Route exact={true} path="/opendoor/Home/Location" render={Location}/>
                            <Route exact={true} path="/opendoor/Home/About" render={About}/>
                        </div>
                    </Router>
                </div>
                
                {/* Footer */}
                <Footer/>
            </div>
        );
    }
}
```

#### Responsibilities
- Overall page layout structure
- Header and branding display
- Navigation menu rendering
- Route configuration and management
- Footer integration

#### Key Features
- **Church Branding**: Logo with color-coded text
- **Biblical Quote**: Galatians 6:1 inspirational message
- **Navigation**: Three main navigation links
- **Header Image**: Church photo display
- **Responsive Layout**: Flexible content areas

#### Dependencies
- `React.Component`
- `react-router-dom` (BrowserRouter, Route)
- `SideBar` component
- `Footer` component
- All page components (Main, Video, Location, About)

#### CSS Classes
- `#header` - Header container
- `#logo` - Church name styling
- `.green`, `.gray`, `.small` - Text color and size modifiers
- `#slogan` - Biblical quote styling
- `#content-wrap` - Content container
- `.header-photo` - Header image styling
- `#main` - Main content area

---

## 🧭 Navigation Components

### SideBar.js
**Type**: Class Component  
**Purpose**: Service information and external links  
**Location**: `src/Components/SideBar.js`

#### Component Structure
```javascript
export class SideBar extends Component {
    render() {
        return (
            <div id="sidebar">
                <h3>Sunday</h3>
                <div>
                    <p>Morning Service: 10:15 AM</p>
                </div>
                <div>
                    <ul className="sidemenu">
                        <li>
                            <a href="https://www.facebook.com/pg/Open-Door-Full-Gospel-Of-Pleasant-Hill-MO-217411360471/videos">
                                Facebook Video
                            </a>
                        </li>
                    </ul>
                </div>
            </div>
        );
    }
}
```

#### Responsibilities
- Display service schedule information
- Provide external links to social media
- Quick access to important church information

#### Key Features
- **Service Times**: Sunday morning service at 10:15 AM
- **Facebook Integration**: Direct link to church Facebook videos
- **Consistent Placement**: Available on all pages

#### CSS Classes
- `#sidebar` - Sidebar container
- `.sidemenu` - Menu list styling

#### External Links
- **Facebook Videos**: Links to church Facebook video content
- **URL**: `https://www.facebook.com/pg/Open-Door-Full-Gospel-Of-Pleasant-Hill-MO-217411360471/videos`

---

## 📄 Page Components

### Main.js (Home Page)
**Type**: Functional Component  
**Purpose**: Primary landing page content  
**Location**: `src/Pages/Main.js`

#### Component Structure
```javascript
export const Main = () => {
    return (
        <div>
            <p>
                Open Door Full Gospel is committed to being a rock solid church through prayer,
                bible study, and community service. We strive to reach out to the community in any
                way we can. We provide solid foundations through biblically sound programs for youth,
                children, Nursery, and young adults (classes coming soon). Our pastor, Dennis Gulley,
                brings the truth of the Bible and applies it to everyday life.
            </p>
            <p>
                In the summer of 2009 we held a clothes drive. All the clothes we gathered were
                given away to the community free. We also held our first annual Vacation Bible School.
                In the fall of 2009 we held a food drive. All the food gathered was donated to Harvesters.
                We were able to help pack boxes of bread to be sent out into community pantries.
                At the end of 2009 we were privileged to be able to work with Uplift in feeding
                the homeless. Coats, sleeping bags, clothes, and food were gathered to be donated
                to the organization. We are looking forward to being able to work with them again
                and encourage all to look into what a wonderful group this is.
            </p>
            <p>
                In 2010 we will be working with Kansas City Rescue Mission to prepare and serve
                hot meals to the homeless. Plans are under way for our Second annual VBS as well
                as plans to work with Uplift again. These are just a few of the things going on
                at Open Door. Come by and experience the love of Christ. We would love to have you
                as part of our church family.
            </p>
        </div>
    );
};
```

#### Content Sections
1. **Church Mission**: Core values and commitment statement
2. **2009 Community Service**: Historical community outreach activities
3. **2010 Plans**: Future community service initiatives

#### Key Messages
- **Pastor Information**: Dennis Gulley leadership
- **Community Service**: Extensive outreach programs
- **Youth Programs**: Educational and spiritual development
- **Partnership Organizations**: Harvesters, Uplift, Kansas City Rescue Mission

### Video.js
**Type**: Functional Component  
**Purpose**: Video content display  
**Location**: `src/Pages/Video.js`

#### Component Purpose
- Display church video content
- Integration with video platforms
- Multimedia content presentation

### Location.js
**Type**: Functional Component  
**Purpose**: Church location and contact information  
**Location**: `src/Pages/Location.js`

#### Expected Content
- Church physical address
- Service times and schedule
- Contact information
- Directions and accessibility

### About.js
**Type**: Functional Component  
**Purpose**: Detailed church information  
**Location**: `src/Pages/About.js`

#### Expected Content
- Church history and background
- Leadership team information
- Ministry programs and services
- Church beliefs and philosophy

---

## 🦶 Footer Component

### Footer.js
**Type**: Component (Implementation not shown)  
**Purpose**: Site footer information  
**Location**: `src/Components/Footer.js`

#### Expected Features
- Copyright information
- Contact details
- Additional navigation links
- Site information

---

## 🎨 Styling and Assets

### CSS Integration
Each component utilizes CSS classes for styling:

#### Global Styles
- `src/App.css` - Application-wide styles
- `src/index.css` - Base HTML and body styles

#### Component-Specific Styles
- Header styling for branding and navigation
- Sidebar styling for service information
- Content area styling for readability
- Responsive design considerations

### Image Assets
- **Header Photo**: `public/headerphoto.jpg` (820x120 pixels)
- **Additional Images**: Various church-related images in `src/` directory
  - Board Members photos (JPG/PNG)
  - Pastor and Wife photos
  - Ministry team photos
  - Church activity images

---

## 🔄 State Management

### Current State Approach
- **No Global State**: Components are primarily presentational
- **Local State**: Minimal local state usage
- **Props Flow**: Simple parent-to-child data flow

### Future State Considerations
- **Context API**: For shared application state
- **Redux**: For complex state management needs
- **Local Storage**: For user preferences

---

## 🧪 Testing Considerations

### Component Testing Strategy
```javascript
// Example test structure for components
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';

// Test wrapper for router-dependent components
const renderWithRouter = (component) => {
    return render(
        <BrowserRouter>
            {component}
        </BrowserRouter>
    );
};

// Component-specific tests
test('SideBar displays service time', () => {
    render(<SideBar />);
    expect(screen.getByText('Morning Service: 10:15 AM')).toBeInTheDocument();
});
```

---

## 📈 Performance Considerations

### Component Optimization
- **Functional Components**: Lighter weight than class components
- **Code Splitting**: Potential for lazy loading of page components
- **Memoization**: Opportunities for React.memo optimization

### Rendering Optimization
- **Static Content**: Most components render static content
- **Minimal Re-renders**: Simple component structure reduces re-render complexity
- **Image Optimization**: Properly sized images for performance

---

## 🔮 Future Enhancements

### Component Improvements
- **TypeScript**: Type safety for component props and state
- **Hooks Migration**: Convert class components to functional components with hooks
- **Accessibility**: Enhanced ARIA labels and semantic HTML
- **Animation**: Smooth transitions and micro-interactions

### New Component Opportunities
- **EventCard**: For church events and announcements
- **ContactForm**: For visitor inquiries
- **NewsletterSignup**: For community engagement
- **DonationButton**: For online giving capabilities
