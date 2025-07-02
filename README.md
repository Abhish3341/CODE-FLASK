# CodeFlask

CodeFlask is an online judge platform that helps users practice coding problems, track their progress, and improve their programming skills.

## Features

- Multiple language support (C, C++, Java, Python)
- Secure code execution in Docker containers
- User authentication with email, Google, and GitHub
- Problem solving with real-time feedback
- Score tracking and leaderboards
- Learning resources and tutorials

## Tech Stack

- **Frontend**: React, TypeScript, Tailwind CSS
- **Backend**: Node.js, Express
- **Database**: MongoDB
- **Code Execution**: Docker containerization
- **Authentication**: JWT, OAuth (Google, GitHub)

## Getting Started

### Prerequisites

- Node.js (v18+)
- Docker and Docker Compose
- MongoDB (or use the provided Docker container)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/codeflask.git
   cd codeflask
   ```

2. Create environment files:
   ```bash
   cp .env.example .env
   ```

3. Update the environment variables in the `.env` file with your credentials.

### Running with Docker

1. Start the application using Docker Compose:
   ```bash
   docker-compose up -d
   ```

2. The application will be available at:
   - Frontend: http://localhost
   - Backend API: http://localhost:8000

### Development Mode

1. Start the development environment:
   ```bash
   docker-compose -f docker-compose.dev.yml up -d
   ```

2. Start the frontend development server:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

3. The development servers will be available at:
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:8000

## Deployment

### Northflank Deployment

The backend is configured for deployment on Northflank using the `northflank.yaml` configuration file.

### Vercel Deployment

The frontend can be deployed to Vercel:

1. Connect your GitHub repository to Vercel
2. Set the environment variables in Vercel dashboard
3. Deploy the frontend

## License

This project is licensed under the MIT License - see the LICENSE file for details.