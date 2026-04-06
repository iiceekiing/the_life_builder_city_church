# Life Builder City Church

A modern, scalable digital church platform built with React and FastAPI.

## 🚀 Features

- **Public Website**: Immersive UI with animated backgrounds
- **Sermon System**: Streaming, download, and categorization
- **Learning Management**: Courses, lessons, and certificates
- **Appointment Booking**: Pastor consultation scheduling
- **Testimony System**: User-generated content with moderation
- **Giving & Partnership**: Multiple partnership categories
- **Admin Dashboard**: Role-based content management

## 🛠️ Tech Stack

### Frontend
- React 18
- Framer Motion (animations)
- Tailwind CSS
- React Router
- Axios

### Backend
- FastAPI (Python)
- PostgreSQL
- SQLAlchemy
- JWT Authentication
- Alembic (migrations)

### DevOps
- Docker & Docker Compose
- GitHub Actions (CI/CD)
- Nginx (reverse proxy)

## 📁 Project Structure

```
the_life_builder_city_church/
├── frontend/          # React application
├── backend/           # FastAPI application
├── docker/           # Docker configurations
├── docker-compose.yml
└── README.md
```

## 🚀 Quick Start

### Prerequisites
- Docker & Docker Compose
- Node.js 18+ (for local development)
- Python 3.11+ (for local development)

### Development Setup

1. Clone the repository
```bash
git clone git@github.com:iiceekiing/the_life_builder_city_church.git
cd the_life_builder_city_church
```

2. Start with Docker Compose
```bash
docker-compose up -d
```

3. Access the application
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- Admin Dashboard: http://localhost:3000/admin

### Local Development

#### Frontend
```bash
cd frontend
npm install
npm run dev
```

#### Backend
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```

## 📖 Documentation

- [API Documentation](http://localhost:8000/docs)
- [Database Schema](./docs/database-schema.md)
- [Deployment Guide](./docs/deployment.md)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feat/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feat/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Life Builder City Church community
- All contributors and volunteers

---

**Building Lives, Building Destiny** 🏛️
