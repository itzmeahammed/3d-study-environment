# 🎓 3D Study Environment

An immersive, AI-powered 3D study platform built with React, Three.js, and modern web technologies. This application creates an engaging virtual learning environment where students can study, collaborate, and track their academic progress in an interactive 3D space.

## ✨ Features

### 🎮 3D Interactive Environment
- Immersive 3D study space powered by Three.js and React Three Fiber
- Interactive 3D models and visualizations
- Real-time 3D rendering with Drei utilities
- Smooth animations and transitions using Framer Motion

### 📚 Study Management
- Organize courses and study materials
- Create and manage study sessions
- Track learning progress with analytics
- Multi-subject support

### 📊 Analytics & Progress Tracking
- Real-time progress visualization using Recharts
- Performance metrics and statistics
- Study time tracking
- Achievement system

### 🌍 Multi-Language Support
- i18next integration for internationalization
- Support for multiple languages
- Easy language switching

### 🎨 Modern UI/UX
- Beautiful, responsive design with Tailwind CSS
- Smooth animations with Framer Motion
- Lucide React icons for consistent iconography
- Dark/Light mode support

### 🔐 State Management
- Zustand for efficient state management
- Form handling with React Hook Form
- Zod for schema validation

### 🌐 API Integration
- Axios for HTTP requests
- React Query for data fetching and caching
- Optimized API communication

## 🛠️ Tech Stack

### Frontend Framework
- **React 18.3**: Modern UI library
- **TypeScript**: Type-safe development
- **Vite**: Fast build tool and dev server

### 3D Graphics
- **Three.js**: 3D graphics library
- **React Three Fiber**: React renderer for Three.js
- **Drei**: Useful helpers for React Three Fiber

### Styling & UI
- **Tailwind CSS**: Utility-first CSS framework
- **Framer Motion**: Animation library
- **Lucide React**: Icon library

### State & Forms
- **Zustand**: Lightweight state management
- **React Hook Form**: Efficient form handling
- **Zod**: TypeScript-first schema validation

### Data & API
- **Axios**: HTTP client
- **React Query**: Data fetching and caching
- **Recharts**: Charting library

### Internationalization
- **i18next**: Internationalization framework
- **react-i18next**: React binding for i18next

### Routing
- **React Router DOM**: Client-side routing

### Development Tools
- **ESLint**: Code linting
- **TypeScript ESLint**: TypeScript linting
- **PostCSS**: CSS processing
- **Autoprefixer**: CSS vendor prefixing

## 📋 Requirements

- Node.js 16.x or higher
- npm or yarn package manager
- Modern web browser with WebGL support

## 🚀 Installation

### 1. Clone the Repository
```bash
git clone git@github.com:itzmeahammed/3d-study-environment.git
cd 3d-study-environment
```

### 2. Install Dependencies
```bash
npm install
# or
yarn install
```

## 🎯 Usage

### Development Server
```bash
npm run dev
# or
yarn dev
```

The application will start at `http://localhost:5173`

### Build for Production
```bash
npm run build
# or
yarn build
```

### Preview Production Build
```bash
npm run preview
# or
yarn preview
```

### Linting
```bash
npm run lint
# or
yarn lint
```

## 📁 Project Structure

```
3d-study-environment/
├── src/
│   ├── components/          # React components
│   ├── store/              # Zustand store
│   ├── types/              # TypeScript type definitions
│   ├── App.tsx             # Main App component
│   ├── main.tsx            # Entry point
│   ├── index.css           # Global styles
│   └── vite-env.d.ts       # Vite environment types
├── public/                 # Static assets
├── index.html              # HTML template
├── package.json            # Project dependencies
├── vite.config.ts          # Vite configuration
├── tailwind.config.js      # Tailwind CSS configuration
├── tsconfig.json           # TypeScript configuration
├── eslint.config.js        # ESLint configuration
├── postcss.config.js       # PostCSS configuration
└── README.md              # This file
```

## 🎮 Key Components

### 3D Environment
- Interactive 3D scene with Three.js
- Real-time rendering and updates
- Camera controls and navigation

### Study Dashboard
- Course overview and management
- Study session tracking
- Progress visualization

### Analytics Panel
- Performance charts and graphs
- Study statistics
- Achievement tracking

### Settings & Preferences
- Language selection
- Theme customization
- User preferences

## 🌐 Internationalization

The app supports multiple languages through i18next. To add a new language:

1. Create language files in the locales directory
2. Configure i18next with new language
3. Switch languages via the UI

Supported languages can be configured in the i18next configuration.

## 🎨 Customization

### Theme
- Modify Tailwind CSS configuration in `tailwind.config.js`
- Update color schemes and typography

### 3D Scene
- Customize 3D models in Three.js components
- Adjust lighting, camera, and materials

### Animations
- Edit Framer Motion configurations
- Adjust animation timings and easing

## 🔧 Configuration

### Vite Configuration
- Modify `vite.config.ts` for build settings
- Configure plugins and optimizations

### TypeScript
- Update `tsconfig.json` for compiler options
- Adjust type checking strictness

### ESLint
- Configure rules in `eslint.config.js`
- Add custom linting rules

## 📊 State Management

The app uses Zustand for state management. Store is located in `src/store/`. Key features:

- Lightweight and performant
- Easy to use and understand
- DevTools integration available

## 🔐 Form Handling

Forms are handled with React Hook Form and validated with Zod:

- Type-safe form validation
- Minimal re-renders
- Efficient error handling

## 🌐 API Integration

API calls are managed with Axios and React Query:

- Automatic caching
- Background refetching
- Error handling and retry logic

## 🐛 Troubleshooting

### WebGL Not Supported
- Ensure your browser supports WebGL
- Update graphics drivers
- Try a different browser

### Performance Issues
- Check browser console for errors
- Reduce 3D scene complexity
- Enable hardware acceleration

### Build Errors
- Clear node_modules and reinstall: `rm -rf node_modules && npm install`
- Clear Vite cache: `rm -rf .vite`
- Check Node.js version compatibility

## 📝 License

This project is open source and available under the MIT License.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit pull requests or open issues for bugs and feature requests.

## 📧 Support

For issues, questions, or suggestions, please open an issue on the GitHub repository.

## 🙏 Acknowledgments

- React team for the amazing library
- Three.js community for 3D graphics
- Tailwind CSS for utility-first styling
- All open-source contributors

---

**Happy Learning in 3D! 🎓✨**
