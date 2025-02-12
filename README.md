# Full Stack Startup Network Project

## Overview
This is a full-stack web application designed to connect startups with investors and mentors. The application consists of a frontend (React) and a backend (Node.js with Express and Prisma ORM), using PostgreSQL as the database.

## Features
- User authentication with JWT
- Investor and mentor search functionality
- Credit-based access system
- AI-powered query classification using Gemini API
- Automated email notifications
- Logging system for errors and warnings

## Tech Stack
### Backend:
- Node.js with Express.js
- Prisma ORM with PostgreSQL
- JWT authentication
- Nodemailer for email services
- Gemini API for AI classification
- Winston for logging

### Frontend:
- React.js (Vite)
- Redux for state management
- Tailwind CSS for styling
- Axios for API calls

## Installation
### Prerequisites
- Node.js (v22 or later)
- PostgreSQL (Ensure the database is running)

### Backend Setup
1. Clone the repository:
   ```bash
   git clone https://github.com/SouptikTaran/Startup-Network
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `backend` folder and configure the following variables:
   ```env
   DATABASE_URL=""
   JWT_SECRET=""
   GEMINI_API_KEY=""
   NODE_MAILER_PASSWORD=""
   NODE_MAILER_USER=""
   process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
   ```
4. Run database migrations:
   ```bash
   npx prisma migrate dev --name init
   ```
5. Start the backend server:
   ```bash
   npm start
   ```

### Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd ../frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the frontend server:
   ```bash
   npm run dev
   ```

## Logging System
- Uses `winston` to log errors and warnings.
- Logs are stored in the `logs/` directory.
- Check `logs/error.log` for errors and `logs/combined.log` for all logs.

## API Routes
### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - User login

### Investors & Mentors
- `POST /api/investors-mentors` - Search for investors or mentors

### Credits
- Users need credits to search for investors/mentors
- If credits run out, an email is sent for recharge

## Cron Jobs
- A cron job runs every 20 seconds to check emails using `node-cron`.

## Deployment
- Backend: Hosted on AWS EC2 with Docker
- Frontend: Deployed on Netlify

## Contributing
1. Fork the repository.
2. Create a feature branch: `git checkout -b feature-branch`
3. Commit changes: `git commit -m "Add new feature"`
4. Push to the branch: `git push origin feature-branch`
5. Create a pull request.

## License
This project is licensed under the MIT License.

## Contact
For queries, contact **Souptik Taran** at **mr.souptiktaran@gmail.com**.

