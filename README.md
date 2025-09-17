# 🍕 Food Backend API

A complete backend API for a food delivery application built with Node.js, Express, TypeScript, and Prisma.

## 🚀 Features

- **Authentication & Authorization** with JWT
- **User Management** (Register, Login, Profile)
- **Product Management** (CRUD operations)
- **Category Management** (CRUD operations)
- **Order Management** (Create, Track, Update status)
- **Role-based Access Control** (USER/ADMIN)
- **Database** with PostgreSQL and Prisma ORM
- **TypeScript** for type safety

## 📋 Prerequisites

- Node.js (v16 or higher)
- PostgreSQL database
- npm or yarn

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/ntminhbnvn/FoodMobileapp.git
   cd foodback-end
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env` file in the root directory:
   ```env
   # Database
   DATABASE_URL="postgresql://username:password@localhost:5432/food_db?schema=public"
   
   # JWT Secret
   JWT_SECRET="your-super-secret-jwt-key-here-make-it-long-and-random"
   
   # Server
   PORT=3000
   NODE_ENV=development
   ```

4. **Database Setup**
   ```bash
   # Generate Prisma client
   npm run db:generate
   
   # Push schema to database
   npm run db:push
   
   # Seed sample data
   npm run db:seed
   ```

5. **Start the server**
   ```bash
   npm run dev
   ```

## 📚 API Endpoints

### Authentication
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login user
- `GET /auth/profile` - Get user profile (requires token)
- `PUT /auth/profile` - Update user profile (requires token)

### Categories
- `GET /categories` - Get all categories
- `GET /categories/:id` - Get category by ID
- `POST /categories` - Create category (requires token)
- `PUT /categories/:id` - Update category (requires token)
- `DELETE /categories/:id` - Delete category (requires token)

### Products
- `GET /products` - Get all products
- `GET /products/:id` - Get product by ID
- `POST /products` - Create product (requires token)
- `PUT /products/:id` - Update product (requires token)
- `DELETE /products/:id` - Delete product (requires token)

### Orders
- `GET /orders/list` - Get orders (requires token)
- `GET /orders/:id` - Get order by ID (requires token)
- `POST /orders` - Create new order (requires token)
- `PUT /orders/:id/status` - Update order status (admin only)
- `PUT /orders/:id/cancel` - Cancel order (requires token)

## 🔐 Authentication

Include the JWT token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

## 👤 Default Admin User

After running the seed script, you can login with:
- **Email**: admin@foodapp.com
- **Password**: admin123

## 🗄️ Database Schema

### Models
- **User** - User accounts with roles
- **Category** - Product categories
- **Product** - Food items
- **Order** - Customer orders
- **OrderItem** - Individual items in orders

### Relationships
- User has many Orders
- Category has many Products
- Order has many OrderItems
- Product belongs to Category
- OrderItem belongs to Order and Product

## 🛠️ Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run db:generate` - Generate Prisma client
- `npm run db:push` - Push schema to database
- `npm run db:migrate` - Create and run migrations
- `npm run db:seed` - Seed sample data
- `npm run db:studio` - Open Prisma Studio

## 🧪 Testing the API

You can test the API using:
- **Postman** or **Insomnia**
- **curl** commands
- **Thunder Client** (VS Code extension)

### Example: Register a new user
```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123",
    "name": "John Doe"
  }'
```

### Example: Login
```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }'
```

## 📁 Project Structure

```
src/
├── controllers/     # Route handlers
├── middleware/      # Custom middleware
├── prisma/         # Database client
├── routes/         # API routes
└── server.ts       # Main server file

prisma/
├── migrations/     # Database migrations
├── schema.prisma   # Database schema
└── seed.ts         # Seed data
```

## 🚀 Deployment

1. Build the project:
   ```bash
   npm run build
   ```

2. Set production environment variables

3. Start the production server:
   ```bash
   npm start
   ```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

This project is licensed under the ISC License.
