# future_flow_placement_assistant

# Student Placements Assistant

This project is a Student Placements Assistant application built using the MERN (MongoDB, Express.js, React.js, Node.js) stack. It aims to provide a platform for students to manage their placement-related activities and connect with potential employers.

## Table of Contents

- [Project Description](#project-description)
- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Contributing](#contributing)
- [License](#license)

## Project Description

The Student Placements Assistant is designed to streamline the process of job hunting and placement management for students. The application provides the following main features:

- User registration and authentication
- Profile management for students
- Job listings and search functionality
- Application tracking for submitted job applications
- Communication with employers
- Interview scheduling and reminders
- Placement history and statistics

## Features

- User registration and authentication using JWT (JSON Web Tokens)
- Secure password hashing using bcrypt
- Profile creation and management for students
- Job listing creation, editing, and deletion by administrators
- Job search and filtering by location, industry, or other criteria
- Application submission and tracking for students
- Messaging functionality for students to communicate with employers
- Interview scheduling with calendar integration
- Dashboard with placement history and statistics for students
- Responsive user interface using React.js

## Installation

To run the Student Placements Assistant locally on your machine, follow these steps:

1. Clone the repository: `$ git clone https://github.com/your-username/student-placements-assistant.git`
2. Change to the project directory: `$ cd student-placements-assistant`
3. Install backend dependencies: `$ npm install`
4. Change to the client directory: `$ cd client`
5. Install frontend dependencies: `$ npm install`
6. Go back to the project directory: `$ cd ..`
7. Set up environment variables:
   - Create a `.env` file in the project root directory
   - Add the following variables:
     ```
     PORT=3000
     MONGODB_URI=<your_mongodb_connection_uri>
     JWT_SECRET=<your_jwt_secret_key>
     ```
8. Start the development server:
   - For running the backend: `$ npm run server`
   - For running the frontend: `$ npm run client`
   - For running both concurrently: `$ npm run dev`

## Usage

Once the development server is running, open your web browser and navigate to `http://localhost:3000` to access the Student Placements Assistant application.

Here are some example login credentials for testing:

- Student account:
  - Email: student@example.com
  - Password: password123
- Admin account:
  - Email: admin@example.com
  - Password: admin123

Feel free to create your own accounts and explore the features of the application.

## API Endpoints

The following API endpoints are available:

- `POST /api/auth/register`: Register a new user
- `POST /api/auth/login`: Log in and get an access token
- `GET /api/auth/user`: Get the current user's details
- `PUT /api/auth/user`: Update the current user's profile
- `GET /api/jobs`: Get a list of available jobs
- `POST /api/jobs`: Create a new job listing
- `GET /api/jobs/:id`: Get details of a specific job listing
- `PUT /api/jobs/:id`: Update a job listing
- `DELETE /api/jobs/:id`: Delete a job listing
- ...

For

