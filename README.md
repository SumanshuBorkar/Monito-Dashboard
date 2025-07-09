# Service Dashboard Application

A real-time service monitoring dashboard built with React that allows you to track the health and status of various services in your infrastructure.

## 🚀 Features

- **Real-time Service Monitoring**: Track service status with automatic updates every 10 seconds
- **CRUD Operations**: Add, edit, and delete services with instant UI updates
- **Advanced Filtering**: Search services by name and filter by status (Online, Degraded, Offline)
- **Status Summary**: Visual overview of all services with count breakdowns
- **Service Details**: Detailed view with event history and service information
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Dark Mode Support**: Toggle between light and dark themes
- **Event History**: Track all status changes and service updates over time

## 🏗️ Architecture Overview

### Design Philosophy

This application follows a **simple, pragmatic architecture** that prioritizes:
- **Maintainability**: Clean, readable code with clear separation of concerns
- **Performance**: Efficient state management and minimal re-renders
- **Reliability**: Simple data flow without over-engineering
- **Developer Experience**: Easy to understand and extend

### Architecture Decisions

#### 1. **Simple In-Memory Data Store**
Instead of complex mock APIs or service workers, I chose a straightforward in-memory data store (\`src/data/services.js\`) because:
- **Simplicity**: No network complexity or mock service worker setup
- **Reliability**: Eliminates potential issues with service worker registration
- **Performance**: Instant responses without network simulation delays
- **Development Speed**: Easy to modify and extend data structures

#### 2. **React Context for State Management**
Used React Context (\`src/context/ServicesContext.js\`) instead of Redux because:
- **Right-sized Solution**: Application state is not complex enough to warrant Redux
- **Built-in**: No additional dependencies required
- **Performance**: Adequate for this scale of application
- **Simplicity**: Easier to understand and maintain

#### 3. **Component Structure**
Organized components by feature rather than type:
\`\`\`
src/components/
├── dashboard/          # Dashboard-specific components
├── details/           # Service details page
└── ui/               # Reusable UI components
\`\`\`

This structure provides:
- **Feature Cohesion**: Related components are grouped together
- **Reusability**: UI components can be shared across features
- **Scalability**: Easy to add new features without restructuring

#### 4. **Real-time Updates**
Implemented using simple polling (\`usePolling\` hook) because:
- **Simplicity**: No WebSocket complexity or server requirements
- **Reliability**: Works in all environments without additional setup
- **Control**: Easy to adjust polling intervals and pause when needed
- **Browser Optimization**: Automatically pauses when tab is not visible

## 📚 Libraries and Dependencies

### Core Dependencies

#### **React 18**
- **Why**: Latest stable version with concurrent features and improved performance
- **Usage**: Core framework for building the user interface

#### **React Router DOM**
- **Why**: De facto standard for React routing with excellent documentation
- **Usage**: Navigation between dashboard and service details pages

#### **Tailwind CSS**
- **Why**: 
  - Utility-first approach for rapid development
  - Excellent responsive design utilities
  - Built-in dark mode support
  - Smaller bundle size compared to component libraries
- **Usage**: All styling and responsive design

#### **Heroicons**
- **Why**: 
  - Official icon library from Tailwind team
  - Consistent design language
  - Tree-shakeable SVG icons
  - Excellent React integration
- **Usage**: All icons throughout the application

### Development Dependencies

#### **Create React App**
- **Why**: 
  - Zero-configuration setup
  - Built-in development server and build tools
  - Hot reloading and error overlay
  - Production-ready build optimization
- **Usage**: Development environment and build process

### Architectural Patterns Used

#### 1. **Custom Hooks**
- \`usePolling\`: Manages real-time updates with visibility detection
- \`usePageVisibility\`: Optimizes polling when tab is not active

#### 2. **Context + Reducer Pattern**
- Centralized state management for services
- Predictable state updates with reducer pattern
- Easy to test and debug

#### 3. **Compound Components**
- ServiceTable + ServiceRow work together
- EditServiceForm as a modal overlay
- Promotes reusability and composition

#### 4. **Error Boundaries** (Implicit)
- Graceful error handling throughout the application
- User-friendly error messages
- Fallback UI states

## 🛠️ Getting Started

### Prerequisites

- **Node.js** (version 14 or higher)
- **npm** or **yarn** package manager

### Installation

1. **Clone the repository**
   \`\`\`bash
   git clone <repository-url>
   cd dashboard-app
   \`\`\`

2. **Install dependencies**
   \`\`\`bash
   npm install
   # or
   yarn install
   \`\`\`

3. **Start the development server**
   \`\`\`bash
   npm start
   # or
   yarn start
   \`\`\`

4. **Open your browser**
   Navigate to \`http://localhost:3000\`

### Build for Production

\`\`\`bash
npm run build
# or
yarn build
\`\`\`

This creates an optimized production build in the \`build\` folder.

### Run Tests

\`\`\`bash
npm test
# or
yarn test
\`\`\`

## 📁 Project Structure

\`\`\`
src/
├── components/
│   ├── dashboard/
│   │   ├── Dashboard.js          # Main dashboard page
│   │   ├── ServiceTable.js       # Services table component
│   │   ├── ServiceRow.js         # Individual service row
│   │   ├── ServiceForm.js        # Add service modal
│   │   ├── EditServiceForm.js    # Edit service modal
│   │   ├── FilterBar.js          # Search and filter controls
│   │   ├── StatusSummary.js      # Status overview cards
│   │   └── StatusBadge.js        # Status indicator component
│   ├── details/
│   │   └── ServiceDetails.js     # Service details page
│   ├── ui/
│   │   ├── Notification.js       # Toast notifications
│   │   ├── Skeleton.js          # Loading skeletons
│   │   └── InfiniteLoader.js    # Infinite scroll component
│   └── ThemeToggle.js           # Dark mode toggle
├── context/
│   ├── ServicesContext.js       # Services state management
│   └── ThemeContext.js          # Theme state management
├── data/
│   └── services.js              # In-memory data store
├── hooks/
│   ├── usePolling.js            # Real-time polling hook
│   └── usePageVisibility.js     # Tab visibility detection
├── utils/
│   └── helpers.js               # Utility functions
├── App.js                       # Main app component
├── index.js                     # App entry point
└── index.css                    # Global styles
\`\`\`

## 🔧 Configuration

### Environment Variables

The application doesn't require any environment variables for basic functionality. All configuration is handled through the in-memory data store.

### Customization

#### Adding New Service Types
Edit \`src/data/services.js\` and add new types to the service creation functions.

#### Changing Polling Intervals
Modify the interval in \`src/context/ServicesContext.js\`:
\`\`\`javascript
// Change from 10000ms (10 seconds) to desired interval
const interval = setInterval(fetchServices, 10000)
\`\`\`

#### Customizing Status Types
Update the status arrays in \`src/data/services.js\` and corresponding UI components.

## 🎨 Styling and Theming

### Tailwind CSS Configuration

The application uses a custom Tailwind configuration (\`tailwind.config.js\`) with:
- **Dark mode**: Class-based dark mode support
- **Custom colors**: Consistent color palette
- **Responsive breakpoints**: Mobile-first design approach

### Dark Mode

Dark mode is implemented using:
- Tailwind's built-in dark mode utilities
- React Context for theme state management
- Local storage persistence
- System preference detection

## 🚀 Performance Optimizations

### Implemented Optimizations

1. **Efficient Re-renders**
   - \`useCallback\` and \`useMemo\` for expensive operations
   - Proper dependency arrays in useEffect hooks

2. **Smart Polling**
   - Pauses when browser tab is not visible
   - Configurable intervals
   - Automatic cleanup on component unmount

3. **Component Optimization**
   - Lazy loading for non-critical components
   - Skeleton loading states
   - Debounced search input

4. **Bundle Optimization**
   - Tree-shaking enabled
   - Code splitting with React.lazy (ready for implementation)
   - Optimized production builds

## 🧪 Testing Strategy

### Current Testing Setup

- **Jest**: Unit testing framework
- **React Testing Library**: Component testing utilities
- **Test Structure**: Tests co-located with components

### Testing Philosophy

- **User-centric**: Test behavior, not implementation
- **Integration over Unit**: Focus on component integration
- **Accessibility**: Ensure components work with screen readers

## 🔮 Future Enhancements

### Planned Features

1. **Real Backend Integration**
   - Replace in-memory store with actual API calls
   - WebSocket support for real-time updates
   - Authentication and authorization

2. **Advanced Monitoring**
   - Service health metrics and charts
   - Alert notifications
   - Historical data persistence

3. **Enhanced UI**
   - Service dependency visualization
   - Advanced filtering options
   - Bulk operations

4. **Performance**
   - Virtual scrolling for large service lists
   - Service worker for offline support
   - Progressive Web App features

## 🤝 Contributing

### Development Workflow

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

### Code Style

- **ESLint**: Enforced code style rules
- **Prettier**: Automatic code formatting
- **Conventional Commits**: Structured commit messages

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Troubleshooting

### Common Issues

#### Services not loading
- Check browser console for errors
- Ensure all dependencies are installed
- Try clearing browser cache

#### Dark mode not working
- Check if system preferences are overriding
- Clear local storage and refresh

#### Performance issues
- Check if polling interval is too aggressive
- Monitor browser dev tools for memory leaks

### Getting Help

- Check the GitHub issues for similar problems
- Create a new issue with detailed reproduction steps
- Include browser version and error messages

---

**Built with ❤️ using React and Tailwind CSS**
\`\`\`

