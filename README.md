# future_flow_placement_assistant

# Student Placements Assistant

This project is a Student Placements Assistant application built using the MERN (MongoDB, Express.js, React.js, Node.js) stack. It aims to provide a platform for students to manage their placement-related activities and connect with potential employers.

## Table of Contents

- [Project Description](#project-description)
- [Features](#features)
- [Installation](#installation)



## Project Description

The Student Placements Assistant is designed to streamline the process of job hunting and placement management for students. The application provides the following main features:

- User registration and authentication
- Profile management for students
- Job listings and search functionality
- Application tracking for receiver job applications for hr
- Communication with employers
- Interview scheduling
- Placement history and statistics

## Features

- User registration and authentication using JWT (JSON Web Tokens)
- Secure password hashing using bcrypt
- Profile creation and management for students
- Job listing creation, editing, and deletion by hr managers
- Job search and filtering by skills, department,role or other criteria
- Application submission for students
<!-- - Messaging functionality for students to communicate with employers -->
- Dashboard with placement history and statistics for admin and hr managers
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


