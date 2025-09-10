# 🏗️ CampusOLX Architecture Documentation

## System Overview

CampusOLX is a full-stack university marketplace application built with modern web technologies, emphasizing security, scalability, and user experience.

## Technology Stack

### Frontend
- **React 19**: Latest React with hooks and concurrent features
- **Vite**: Fast build tool and development server
- **Tailwind CSS 4**: Utility-first CSS framework
- **Socket.IO Client**: Real-time communication
- **Browser Image Compression**: Client-side image optimization

### Backend
- **Node.js**: JavaScript runtime environment
- **Express.js**: Web application framework
- **Socket.IO**: Real-time bidirectional communication
- **JWT**: Secure authentication tokens
- **Multer**: File upload handling
- **Express Validator**: Input validation and sanitization
- **Helmet**: Security headers
- **Express Rate Limit**: API rate limiting

### Database & Storage
- **Supabase**: Backend-as-a-Service platform
- **PostgreSQL**: Relational database
- **Row Level Security**: Database-level security
- **Supabase Storage**: File storage with CDN

## Application Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   React Client  │    │   Express API   │    │   Supabase DB   │
│                 │    │                 │    │                 │
│ • Components    │◄──►│ • REST Routes   │◄──►│ • PostgreSQL    │
│ • State Mgmt    │    │ • Authentication│    │ • RLS Policies  │
│ • API Client    │    │ • File Upload   │    │ • Real-time     │
│ • Socket.IO     │    │ • Socket.IO     │    │ • Storage       │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       
         └───────────────────────┼───────────────────────
                                 │
                    ┌─────────────────┐
                    │  External APIs  │
                    │                 │
                    │ • Email Service │
                    │ • Image CDN     │
                    │ • Analytics     │
                    └─────────────────┘
```

## Database Schema

### Core Tables

#### `profiles`
```sql
- id (UUID, Primary Key)
- email (TEXT, Unique)
- name (TEXT)
- university (TEXT)
- verified (BOOLEAN)
- admin (BOOLEAN)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

#### `items`
```sql
- id (UUID, Primary Key)
- name (TEXT)
- description (TEXT)
- price (DECIMAL)
- category (TEXT)
- seller_id (UUID, Foreign Key)
- status (TEXT: pending|approved|rejected|sold)
- images (JSONB)
- ai_analysis (JSONB)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

#### `chats`
```sql
- id (UUID, Primary Key)
- item_id (UUID, Foreign Key)
- buyer_id (UUID, Foreign Key)
- seller_id (UUID, Foreign Key)
- created_at (TIMESTAMP)
```

#### `messages`
```sql
- id (UUID, Primary Key)
- chat_id (UUID, Foreign Key)
- sender_id (UUID, Foreign Key)
- content (TEXT)
- created_at (TIMESTAMP)
```

## API Endpoints

### Authentication (`/api/auth`)
- `POST /register` - User registration
- `POST /login` - User login
- `POST /logout` - User logout
- `GET /profile` - Get user profile
- `PUT /profile` - Update user profile

### Items (`/api/items`)
- `GET /` - List all approved items
- `POST /` - Create new item
- `GET /:id` - Get item details
- `PUT /:id` - Update item
- `DELETE /:id` - Delete item
- `GET /search` - Search items
- `POST /:id/images` - Upload item images

### Chats (`/api/chats`)
- `GET /` - Get user's chats
- `POST /` - Create new chat
- `GET /:id/messages` - Get chat messages
- `POST /:id/messages` - Send message

### Admin (`/api/admin`)
- `GET /items/pending` - Get pending items
- `PUT /items/:id/approve` - Approve item
- `PUT /items/:id/reject` - Reject item
- `GET /users` - Get all users
- `GET /analytics` - Get platform analytics

### Users (`/api/users`)
- `GET /:id` - Get user profile
- `GET /:id/items` - Get user's items
- `PUT /:id/verify` - Verify user (admin only)

## Security Features

### Authentication & Authorization
- JWT tokens with secure signing
- Token expiration and refresh
- Role-based access control (user/admin)
- University email verification

### Data Protection
- Input validation and sanitization
- SQL injection prevention
- XSS protection headers
- CORS configuration
- Rate limiting per IP

### File Upload Security
- File type validation
- File size limits
- Virus scanning (integration ready)
- Secure file storage with Supabase

## Real-time Features

### Socket.IO Events
- `join_chat` - Join a chat room
- `leave_chat` - Leave a chat room
- `new_message` - Send/receive messages
- `user_online` - User presence
- `user_offline` - User presence
- `typing_start` - Typing indicators
- `typing_stop` - Typing indicators

## Performance Optimizations

### Frontend
- Code splitting with React.lazy
- Image compression before upload
- Lazy loading for product images
- Debounced search inputs
- Virtual scrolling for large lists

### Backend
- Database connection pooling
- Redis caching (integration ready)
- Image CDN with Supabase Storage
- Gzip compression
- ETag headers for caching

### Database
- Indexed columns for fast queries
- Row Level Security for data isolation
- Connection pooling
- Read replicas (future enhancement)

## Monitoring & Logging

### Error Tracking
- Structured error logging
- User action tracking
- Performance monitoring
- Health check endpoints

### Analytics
- User engagement metrics
- Item listing analytics
- Chat system usage
- Admin dashboard metrics

## Scalability Considerations

### Horizontal Scaling
- Stateless API design
- Load balancer ready
- Database connection pooling
- CDN for static assets

### Future Enhancements
- Microservices architecture
- Kubernetes deployment
- Redis for session storage
- ElasticSearch for advanced search
- AI-powered recommendations