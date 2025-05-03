# Magic Properties - Real Estate Marketplace

A modern, full-featured real estate property listing platform built with the MERN stack. This application allows users to browse, filter, and view detailed property listings, while providing administrators with tools to manage property content including image uploads.

## Features

- **Property Listings**: Browse properties with advanced filtering
  - Filter by property type, bedrooms, location, and price range
  - Pagination support for large property catalogs
  - Sorting options for results

- **User Authentication**: 
  - Secure registration and login
  - JWT-based authentication with HTTP-only cookies
  - Role-based access control (admin/regular user)

- **Property Management**:
  - Create, edit, and delete property listings (admin only)
  - Multiple image uploads with Cloudinary integration
  - Detailed property information management

- **Responsive Design**: Mobile-friendly interface

## Technology Stack

### Backend
- Node.js with Express
- MongoDB with Mongoose ODM
- JWT for authentication
- Cloudinary for image storage
- Multer for file upload handling

### Frontend
- React.js
- Context API for state management
- React Router for navigation
- Tailwind CSS for styling

## Installation

### Prerequisites
- Node.js (v14+)
- MongoDB
- Cloudinary account

### Setup

1. **Clone the repository**
   ```
   git clone https://github.com/Pankaj086/MagicProperties.git
   cd magic-properties
   ```

2. **Install dependencies**
   ```
   # Install backend dependencies
   cd Backend
   npm install
   
   # Install frontend dependencies
   cd ../Frontend
   npm install
   ```

3. **Environment Variables**
   
   Create a `.env` file in the Backend directory with:
   ```
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   CLOUDINARY_CLOUD_NAME=your_cloudinary_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   ```

## Running the Application

1. **Start the backend server**
   ```
   cd Backend
   npm start
   ```

2. **Start the frontend development server**
   ```
   cd Frontend
   npm run dev
   ```

3. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000

## API Endpoints

### User Routes
- `POST /api/users/register` - Register a new user
- `POST /api/users/login` - Login user
- `GET /api/users/profile` - Get user profile

### Property Routes
- `GET /api/properties` - Get all properties with filters
- `GET /api/properties/:id` - Get a specific property
- `POST /api/properties` - Create a new property (admin)
- `PUT /api/properties/:id` - Update a property (admin)
- `DELETE /api/properties/:id` - Delete a property (admin)
- `POST /api/properties/upload` - Upload property images

## Deployment

The application is configured for deployment on Vercel:
- Frontend: https://magic-properties-7psv.vercel.app
- Backend API: https://magic-properties-ivory.vercel.app

## Notes for Developers

- The backend handles file uploads differently in development vs production:
  - Development: Temporary file storage followed by Cloudinary upload
  - Production: Direct upload to Cloudinary from memory buffer

- CORS is configured to allow specific origins only