# Open Door Full Gospel Church Website

This is the official website for Open Door Full Gospel Church of Pleasant Hill, Missouri. The project has been successfully migrated from JavaScript to TypeScript for enhanced type safety and developer experience.

## 🚀 Technology Stack

- **Frontend Framework**: React 18.3.1
- **Language**: TypeScript 5.8.3
- **Routing**: React Router v6
- **Build Tool**: Create React App with TypeScript
- **Styling**: CSS3 with responsive design
- **Linting**: ESLint with TypeScript support

## 📋 Available Scripts

In the project directory, you can run:

### `npm start`
Runs the app in development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`
Launches the test runner in interactive watch mode.

### `npm run build`
Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

### `npm run type-check`
Runs TypeScript compiler to check for type errors without emitting files.\
Use this to validate TypeScript code quality.

### `npm run lint`
Runs ESLint to check for code quality issues in TypeScript and JavaScript files.\
Includes React and TypeScript specific rules.

## 🏗️ Project Structure

```
src/
├── Components/           # Reusable UI components
│   ├── Footer.tsx       # Website footer component
│   └── SideBar.tsx      # Sidebar with service times and links
├── Pages/               # Main page components
│   ├── About.tsx        # Church history and information
│   ├── Location.tsx     # Church location with Google Maps
│   ├── Main.tsx         # Homepage content
│   ├── Master.tsx       # Main layout and routing
│   └── Video.tsx        # YouTube video integration
├── types/               # TypeScript type definitions
│   ├── index.ts         # Component props and interfaces
│   └── routing.ts       # Routing type definitions
├── App.tsx              # Root application component
└── index.tsx            # Application entry point
```

## 🎯 Key Features

- **Responsive Design**: Mobile-friendly layout that works on all devices
- **Church Information**: Service times, location, and contact details
- **Video Integration**: YouTube playlist embedding for sermons
- **Interactive Map**: Google Maps integration for location
- **Type Safety**: Full TypeScript implementation for better code quality
- **Accessibility**: WCAG compliant with proper ARIA labels and semantic HTML

## 🛠️ Development

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn package manager

### Installation
```bash
# Clone the repository
git clone [repository-url]

# Navigate to the project directory
cd OpenDoorWebsiteApp

# Install dependencies
npm install

# Start the development server
npm start
```

### TypeScript Configuration
The project uses strict TypeScript configuration with:
- Strict mode enabled
- Path mapping for cleaner imports
- Type checking for all React components
- ESLint integration for code quality

## 📱 Pages and Features

### Home Page (`/`)
- Welcome message and church mission
- Community service information
- Upcoming events and activities

### Location Page (`/opendoor/Home/Location`)
- Church address and contact information
- Interactive Google Maps integration
- Directions and accessibility information

### About Page (`/opendoor/Home/About`)
- Church history since 1975
- Information about founding members
- Pastor and leadership information

### Video Page (`/opendoor/Home/Video`)
- YouTube playlist integration
- Sermon recordings and church events
- Responsive video player

## 🎨 Styling and Design

- Custom CSS with church branding
- Responsive grid layout
- Typography optimized for readability
- Accessible color contrast ratios
- Mobile-first responsive design

## 🔧 Configuration Files

- `tsconfig.json`: TypeScript compiler configuration
- `package.json`: Project dependencies and scripts
- `.eslintrc`: Code quality and style enforcement
- `src/types/`: TypeScript type definitions

## 📈 Future Enhancements

- Content Management System integration
- Online giving platform
- Event calendar functionality
- Member portal
- Mobile app development

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📞 Contact

Open Door Full Gospel Church of Pleasant Hill  
135 S 1st St  
Pleasant Hill, Missouri 64080

Visit us during our service times:  
**Sunday Morning Service**: 10:15 AM

## 📄 License

This project is private and proprietary to Open Door Full Gospel Church of Pleasant Hill.

---

*Built with ❤️ for the Open Door Full Gospel Church community*
