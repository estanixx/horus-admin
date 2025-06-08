# Horus Admin - Guardia Costera Administration Panel

A comprehensive Next.js web application for managing stations and cameras within the Horus Guardia Costera system.

## Features

- **Authentication**: Secure Auth0 integration with protected routes
- **Station Management**: Full CRUD operations for monitoring stations
- **Camera Management**: Complete camera device registration and management
- **JWT Token Generation**: Automatic JWT token generation for camera registration
- **Responsive Design**: Modern, clean interface that works on all devices
- **Real-time Data**: GraphQL integration for efficient data fetching

## Tech Stack

- **Frontend**: Next.js (Pages Router), React, TypeScript
- **Authentication**: Auth0
- **Styling**: Tailwind CSS with Inter font
- **API**: GraphQL with graphql-request
- **Date Handling**: date-fns

## Getting Started

### Prerequisites

- Node.js 18+
- Auth0 account and application setup
- FastAPI backend with GraphQL endpoint

### Installation

1. Clone the repository
2. Install dependencies:
   \`\`\`bash
   npm install
   \`\`\`

3. Copy the environment variables:
   \`\`\`bash
   cp .env.local.example .env.local
   \`\`\`

4. Configure your environment variables in `.env.local`:

   - Set up your Auth0 credentials
   - Configure your GraphQL API endpoint
   - Generate a secure AUTH0_SECRET using `openssl rand -hex 32`

5. Run the development server:
   \`\`\`bash
   npm run dev
   \`\`\`

6. Open [http://localhost:3000](http://localhost:3000) in your browser

### Auth0 Setup

1. Create an Auth0 application (Regular Web Application)
2. Configure the following URLs in your Auth0 dashboard:

   - **Allowed Callback URLs**: `http://localhost:3000/auth/callback`
   - **Allowed Logout URLs**: `http://localhost:3000`
   - **Allowed Web Origins**: `http://localhost:3000`

3. Create an API in Auth0 for your backend
4. Update the environment variables with your Auth0 configuration

## Application Structure

### Pages

- **`/`** - Landing page with Auth0 login
- **`/dashboard`** - Overview dashboard with statistics
- **`/stations`** - Station management (list, create, edit, delete)
- **`/cameras`** - Camera management (list, create, edit, delete)

### Key Features

#### Station Management

- Create new monitoring stations with location data
- Edit existing station information
- Delete stations with confirmation modal
- View associated cameras for each station

#### Camera Management

- Register new camera devices
- Link cameras to existing stations
- Generate JWT tokens for camera authentication
- Copy-to-clipboard functionality for JWT tokens
- Edit camera specifications and station assignments

#### Security

- All routes protected with Auth0 authentication
- JWT tokens for camera-to-backend communication
- Secure GraphQL requests with Auth0 access tokens

## Environment Variables

\`\`\`env

# Auth0 Configuration

AUTH0_SECRET=your_32_byte_secret
AUTH0_BASE_URL=http://localhost:3000
AUTH0_ISSUER_BASE_URL=https://your-domain.us.auth0.com
AUTH0_CLIENT_ID=your_client_id
AUTH0_CLIENT_SECRET=your_client_secret
AUTH0_AUDIENCE=https://your-domain.com/api

# API Configuration

GRAPHQL_API_URL=http://localhost:8000/graphql
REST_API_URL=http://localhost:8000/
\`\`\`

## GraphQL Schema

The application expects the following GraphQL schema from your backend:

### Types

- `StationType`: Station information with nested cameras
- `CameraType`: Camera device information

### Queries

- `stations`: List all stations
- `station(id)`: Get specific station
- `cameras`: List all cameras
- `camera(id)`: Get specific camera

### Mutations

- `createStation(input)`: Create new station
- `updateStation(id, input)`: Update station
- `deleteStation(id)`: Delete station
- `createCamera(input)`: Create new camera (returns JWT token)
- `updateCamera(id, input)`: Update camera
- `deleteCamera(id)`: Delete camera

## Deployment

### Build for Production

\`\`\`bash
npm run build
npm start
\`\`\`

### Environment Setup for Production

1. Update `AUTH0_BASE_URL` to your production domain
2. Configure production Auth0 application settings
3. Update API endpoints to production URLs
4. Ensure all environment variables are set in your hosting platform

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is proprietary software for Horus Guardia Costera.
