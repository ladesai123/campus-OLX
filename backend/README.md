# CampusOLX Backend API

This is the backend server for the CampusOLX marketplace application.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Supabase account

### Installation

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
cp .env.example .env
```

3. Configure your `.env` file with:
- Supabase credentials
- JWT secret
- Other API keys

4. Start the development server:
```bash
npm run dev
```

## 📁 Project Structure

```
backend/
├── config/
│   └── database.js          # Supabase configuration
├── middleware/
│   ├── auth.js              # Authentication middleware
│   └── errorHandler.js      # Error handling
├── routes/
│   ├── auth.js              # Authentication routes
│   ├── users.js             # User management
│   ├── items.js             # Item/product routes
│   ├── chats.js             # Chat/messaging
│   └── admin.js             # Admin panel routes
├── utils/
│   └── ...                  # Utility functions
├── server.js                # Main server file
└── package.json
```

## 🔗 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/google` - Google OAuth
- `GET /api/auth/verify` - Verify token

### Items
- `GET /api/items` - Get all items (with filters)
- `GET /api/items/:id` - Get single item
- `POST /api/items` - Create new item
- `PUT /api/items/:id` - Update item
- `DELETE /api/items/:id` - Delete item

### Users
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update profile
- `GET /api/users/:id` - Get public user info

### Chats
- `GET /api/chats` - Get user's chats
- `GET /api/chats/:id` - Get chat with messages
- `POST /api/chats` - Create new chat
- `POST /api/chats/:id/messages` - Send message

### Admin
- `GET /api/admin/stats` - Dashboard stats
- `GET /api/admin/items/pending` - Pending items
- `POST /api/admin/items/:id/approve` - Approve item
- `POST /api/admin/items/:id/reject` - Reject item

## 🔒 Security Features

- JWT authentication
- Rate limiting
- CORS protection
- Helmet security headers
- Input validation
- File upload restrictions

## 🚀 Deployment

### Production Build
```bash
npm start
```

### Environment Variables
See `.env.example` for required environment variables.

## 📝 License

MIT License