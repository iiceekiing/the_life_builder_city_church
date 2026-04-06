# 🚀 Deployment Guide - Life Builder City Church

## 📋 Prerequisites

- Docker & Docker Compose installed
- Git installed
- Domain name (for production)
- SSL certificate (recommended for production)

---

## 🏗️ Quick Start (Development)

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

---

## 🌐 Production Deployment

### 1. Environment Setup

Create a `.env` file in the project root:

```bash
# Backend Environment
DATABASE_URL=postgresql://church_user:your_secure_password@postgres:5432/church_db
SECRET_KEY=your-super-secret-key-change-this-in-production
ENVIRONMENT=production
DEBUG=false
CORS_ORIGINS='["https://yourdomain.com"]'

# Email Configuration (optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
EMAIL_FROM=noreply@yourdomain.com
```

### 2. Production Docker Compose

Create `docker-compose.prod.yml`:

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: church_db
      POSTGRES_USER: church_user
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    restart: unless-stopped

  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    environment:
      DATABASE_URL: postgresql://church_user:${POSTGRES_PASSWORD}@postgres:5432/church_db
      SECRET_KEY: ${SECRET_KEY}
      ENVIRONMENT: production
      DEBUG: false
      CORS_ORIGINS: '["https://yourdomain.com"]'
    depends_on:
      - postgres
    restart: unless-stopped

  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    restart: unless-stopped

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/nginx.conf
      - ./nginx/ssl:/etc/nginx/ssl
    depends_on:
      - frontend
      - backend
    restart: unless-stopped

volumes:
  postgres_data:
```

### 3. Nginx Configuration

Create `nginx/nginx.conf`:

```nginx
events {
    worker_connections 1024;
}

http {
    upstream backend {
        server backend:8000;
    }

    upstream frontend {
        server frontend:80;
    }

    # HTTP redirect to HTTPS
    server {
        listen 80;
        server_name yourdomain.com www.yourdomain.com;
        return 301 https://$server_name$request_uri;
    }

    # HTTPS server
    server {
        listen 443 ssl http2;
        server_name yourdomain.com www.yourdomain.com;

        ssl_certificate /etc/nginx/ssl/cert.pem;
        ssl_certificate_key /etc/nginx/ssl/key.pem;
        ssl_protocols TLSv1.2 TLSv1.3;
        ssl_ciphers HIGH:!aNULL:!MD5;

        # Frontend
        location / {
            proxy_pass http://frontend;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }

        # Backend API
        location /api/ {
            proxy_pass http://backend;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }

        # API docs
        location /docs {
            proxy_pass http://backend;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }
    }
}
```

### 4. Deploy Commands

```bash
# Build and start production services
docker-compose -f docker-compose.prod.yml up -d --build

# Run database migrations
docker-compose -f docker-compose.prod.yml exec backend alembic upgrade head

# Create admin user
docker-compose -f docker-compose.prod.yml exec backend python -c "
from app.db.session import SessionLocal
from app.models.user import User
from app.core.security import get_password_hash

db = SessionLocal()
admin = User(
    full_name='Admin User',
    email='admin@yourdomain.com',
    hashed_password=get_password_hash('your_secure_password'),
    role='admin',
    is_active=True,
    is_verified=True
)
db.add(admin)
db.commit()
db.close()
print('Admin user created successfully!')
"
```

---

## 🔧 Maintenance Commands

```bash
# View logs
docker-compose -f docker-compose.prod.yml logs -f

# Backup database
docker-compose -f docker-compose.prod.yml exec postgres pg_dump -U church_user church_db > backup_$(date +%Y%m%d).sql

# Update application
git pull origin main
docker-compose -f docker-compose.prod.yml up -d --build

# Restart services
docker-compose -f docker-compose.prod.yml restart

# Stop services
docker-compose -f docker-compose.prod.yml down
```

---

## 🔒 Security Best Practices

1. **Change Default Passwords**
   - Database password
   - JWT secret key
   - Admin user password

2. **Enable HTTPS**
   - Use SSL certificates (Let's Encrypt recommended)
   - Redirect HTTP to HTTPS

3. **Regular Backups**
   - Database backups
   - File system backups

4. **Monitor Logs**
   - Application logs
   - Nginx access logs
   - Error logs

5. **Keep Updated**
   - Regular security updates
   - Dependency updates
   - System updates

---

## 📊 Monitoring

### Health Checks

```bash
# Backend health
curl https://yourdomain.com/api/v1/health

# Frontend availability
curl https://yourdomain.com

# Database connection
docker-compose -f docker-compose.prod.yml exec backend python -c "
from app.db.session import engine
try:
    with engine.connect() as conn:
        print('Database connection: OK')
except Exception as e:
    print(f'Database connection: ERROR - {e}')
"
```

### Log Monitoring

```bash
# Real-time logs
docker-compose -f docker-compose.prod.yml logs -f

# Error logs only
docker-compose -f docker-compose.prod.yml logs backend | grep ERROR

# Access logs
docker-compose -f docker-compose.prod.yml logs nginx
```

---

## 🚀 Performance Optimization

1. **Enable Caching**
   - Redis for session storage
   - CDN for static assets

2. **Database Optimization**
   - Regular vacuuming
   - Index optimization
   - Connection pooling

3. **Frontend Optimization**
   - Minify CSS/JS
   - Image optimization
   - Lazy loading

---

## 🆘 Troubleshooting

### Common Issues

1. **Database Connection Failed**
   ```bash
   # Check database status
   docker-compose -f docker-compose.prod.yml ps postgres
   
   # Check logs
   docker-compose -f docker-compose.prod.yml logs postgres
   ```

2. **Frontend Not Loading**
   ```bash
   # Check nginx status
   docker-compose -f docker-compose.prod.yml ps nginx
   
   # Check nginx configuration
   docker-compose -f docker-compose.prod.yml exec nginx nginx -t
   ```

3. **API Not Responding**
   ```bash
   # Check backend logs
   docker-compose -f docker-compose.prod.yml logs backend
   
   # Restart backend
   docker-compose -f docker-compose.prod.yml restart backend
   ```

---

## 📞 Support

For deployment issues:

1. Check the logs first
2. Verify environment variables
3. Ensure all services are running
4. Check network connectivity
5. Review configuration files

---

## 🎉 Success!

Your Life Builder City Church website is now live! 🎊

**Building Lives, Building Destiny** 🏛️
