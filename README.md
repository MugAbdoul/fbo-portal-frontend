# RGB Church Portal - Frontend

A modern React application for the Rwanda Governance Board Church Authorization Portal.

## Features

- **Multi-language Support**: English, Kinyarwanda, and French
- **Role-based Access Control**: Different interfaces for applicants and admins
- **Real-time Updates**: WebSocket integration for live notifications
- **Document Management**: File upload with drag-and-drop support
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **State Management**: Redux Toolkit for efficient state management
- **Form Validation**: React Hook Form with comprehensive validation
- **Charts & Analytics**: Interactive charts with Recharts
- **Certificate Verification**: QR code and manual verification system

## Tech Stack

- **React 18** - UI framework
- **Redux Toolkit** - State management
- **React Router** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **React Hook Form** - Form handling and validation
- **Socket.io Client** - Real-time communication
- **Recharts** - Chart and data visualization
- **React i18next** - Internationalization
- **Heroicons** - Beautiful SVG icons

## Getting Started

### Prerequisites

- Node.js 16+ and npm
- Backend API running on port 5000

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd rgb-church-portal/frontend
```

2. Install dependencies
```bash
npm install
```

3. Create environment file
```bash
cp .env.example .env.local
```

4. Configure environment variables
```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_SOCKET_URL=http://localhost:5000
```

5. Start development server
```bash
npm start
```

The application will open at `http://localhost:3000`

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── layouts/        # Layout components
│   └── ui/            # Basic UI components
├── pages/              # Page components
│   ├── public/        # Public pages
│   ├── auth/          # Authentication pages
│   ├── applicant/     # Applicant dashboard pages
│   └── admin/         # Admin dashboard pages
├── redux/              # Redux store and slices
│   └── slices/        # Redux slices
├── utils/              # Utility functions
├── translations/       # i18n translation files
└── App.js             # Main app component
```

## Available Scripts

- `npm start` - Start development server
- `npm build` - Build for production
- `npm test` - Run tests
- `npm run eject` - Eject from Create React App

## Key Features

### Authentication & Authorization
- JWT-based authentication
- Role-based access control (Applicant/Admin)
- Protected routes with automatic redirects

### Application Management
- Multi-step application form
- Document upload with validation
- Real-time status tracking
- ML-based risk assessment display

### Admin Features
- Application review workflow
- User management
- Analytics and reporting
- Document validation

### User Experience
- Responsive design for all devices
- Real-time notifications
- Multi-language support
- Accessible UI components
- Loading states and error handling

## Deployment

### Production Build

```bash
npm run build
```

This creates a `build` folder with optimized production files.

### Environment Variables

For production deployment, set:

```env
REACT_APP_API_URL=https://your-api-domain.com/api
REACT_APP_SOCKET_URL=https://your-api-domain.com
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.# fbo-portal-frontend
