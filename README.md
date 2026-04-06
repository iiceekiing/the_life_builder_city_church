# Life Builder City Church

🏛️ **Building Lives, Building Destiny**

A modern, scalable digital church platform built with React and FastAPI, featuring immersive animations, comprehensive management systems, and production-ready deployment.

## ✨ **Features**

### 🎨 **Frontend (React)**
- **Animated Canvas Background** - Deep blue atmosphere with twinkling stars, nebula clouds, and glowing orbs
- **Responsive Design** - Mobile-first approach with smooth animations
- **Modern UI/UX** - Glass morphism effects, gradient accents, and elegant transitions
- **Authentication System** - Complete auth flow with JWT tokens
- **Interactive Components** - Framer Motion animations throughout

### 🚀 **Backend (FastAPI)**
- **RESTful API** - Complete CRUD operations for all entities
- **JWT Authentication** - Secure auth with refresh tokens
- **Role-Based Access Control** - Admin, Team Lead, Member roles
- **Database Models** - Users, Sermons, Courses, Events, Testimonies, Appointments
- **File Upload Support** - Media management with validation

### 📱 **Key Features**
- **Sermon System** - Streaming, download (Telegram redirect), sharing
- **Course/LMS Platform** - Enrollment, lessons, progress tracking
- **Appointment Booking** - Pastor consultation scheduling
- **Testimony Management** - User submissions with admin approval
- **Event Management** - Upcoming programs with registration
- **Admin Dashboard** - Complete management interface
- **Gallery Section** - Animated 4x4 grid with smooth transitions

## 🛠️ **Tech Stack**

### Frontend
- **React 18** - Modern UI framework
- **Framer Motion** - Advanced animations
- **Tailwind CSS** - Utility-first styling
- **React Router** - Client-side routing
- **Axios** - HTTP client with interceptors
- **Zustand** - State management

### Backend
- **FastAPI** - Modern Python web framework
- **PostgreSQL** - Production database
- **SQLAlchemy** - ORM with Alembic migrations
- **JWT** - Secure authentication
- **Pydantic** - Data validation

### DevOps
- **Docker & Docker Compose** - Containerization
- **Nginx** - Reverse proxy
- **GitHub Actions** - CI/CD ready

## 🚀 **Quick Start**

### Using Docker (Recommended)

```bash
# Clone the repository
git clone git@github.com:iiceekiing/the_life_builder_city_church.git
cd the_life_builder_city_church

# Start all services
make up

# Access the application:
# Frontend: http://localhost:3000
# Backend API: http://localhost:8000
# API Documentation: http://localhost:8000/docs
```

### Manual Development

```bash
# Backend
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

# Frontend (new terminal)
cd frontend
npm install
npm run dev
```

## 📁 **Project Structure**

```
the_life_builder_city_church/
├── backend/                 # FastAPI application
│   ├── app/
│   │   ├── api/v1/         # API endpoints
│   │   ├── core/           # Configuration & security
│   │   ├── db/             # Database setup
│   │   ├── models/         # SQLAlchemy models
│   │   └── schemas/        # Pydantic schemas
│   ├── alembic/            # Database migrations
│   └── requirements.txt    # Python dependencies
├── frontend/               # React application
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/          # Page components
│   │   ├── sections/       # Homepage sections
│   │   └── utils/          # Utility functions
│   └── package.json        # Node dependencies
├── docker-compose.yml      # Development setup
├── Makefile              # Development commands
├── DEPLOYMENT_GUIDE.md   # Production deployment
└── PROJECT_SUMMARY.md    # Complete feature list
```

## 🎨 **UI/UX Highlights**

### Canvas Animation
- **220 stars** with individual twinkle cycles and drift
- **9 blue bokeh orbs** that breathe gently
- **22 white glow orbs** that bloom, drift, and fade
- **60fps smooth performance**

### Gallery Section
- **White background** as specified
- **4x4 animated grid** (16 images)
- **Subtle rotation** (60-90s cycles)
- **Active image focus** with scale/brightness
- **Seamless image replacement** every 4-5s

### Design System
- **Colors**: Church purple, gold accents
- **Typography**: Georgia (display), DM Sans (body)
- **Animations**: Smooth, elegant, Apple-level
- **Components**: Glass morphism cards with backdrop blur

## 🔐 **Security Features**

- **JWT Authentication** with access/refresh tokens
- **Role-Based Access Control** (Admin, Team Lead, Member)
- **Password hashing** with bcrypt
- **Input validation** and sanitization
- **CORS configuration**
- **SQLAlchemy ORM** for SQL injection prevention

## 📊 **Database Models**

- **Users** - Authentication and role management
- **Sermons** - Audio/video content with categories
- **Courses** - LMS with lessons and enrollments
- **Events** - Church programs and scheduling
- **Testimonies** - User submissions with moderation
- **Appointments** - Pastor booking system
- **Media** - File management and organization

## 🌐 **Deployment**

### Development
```bash
make up          # Start development services
make logs         # View logs
make down         # Stop services
make clean        # Clean up containers
```

### Production
See [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) for complete production deployment instructions.

## 📋 **Available Commands**

```bash
# Development
make install      # Install all dependencies
make dev          # Start development servers
make build        # Build Docker images
make up           # Start all services
make down         # Stop all services
make logs         # Show logs
make clean        # Clean up containers

# Database
make migrate      # Run database migrations
make migration    # Create new migration
make backup       # Backup database
make restore      # Restore database

# Production
make deploy       # Deploy to production
```

## 🤝 **Contributing**

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 **License**

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 **Acknowledgments**

- Life Builder City Church community
- All contributors and volunteers
- Open source community

---

## 📞 **Support**

For support and questions:

- 📧 Email: info@lifebuildercitychurch.org
- 🌐 Website: https://lifebuildercitychurch.org
- 📱 Documentation: See [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)

---

**🏛️ Building Lives, Building Destiny**
