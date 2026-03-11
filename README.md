# MERN Stack Blog Application

## Project Overview

This project was developed as part of my **Capstone Project**, where I built a full-stack blog application using the **MERN Stack (MongoDB, Express.js, React.js, and Node.js)**.

The application allows users to read blog posts, comment on posts, and enables authors to create and manage blog content. It also includes **social login authentication** and **role-based access control** for users and authors.

---

## Tech Stack

**Frontend**

* React.js
* CSS / Bootstrap
* Axios

**Backend**

* Node.js
* Express.js

**Database**

* MongoDB

**Authentication**

* Clerk (Social login with Google, LinkedIn, GitHub)

---

## Features

* User authentication with **social login**
* **Role-based access** (User / Author)
* Create, read, update, and delete blog posts
* Comment system for blog posts
* Secure authentication using **JWT tokens**
* Responsive user interface

---

## Social Login Flow

1. When the user clicks on the **Sign In** button, the React application communicates with **Clerk** for authentication.
2. Clerk connects with authentication providers such as **Google, LinkedIn, or GitHub**.
3. These providers verify the user's credentials and return an **ID token (JWT)**.
4. Clerk creates a session and allows the React application to access the authenticated user using hooks like **useAuth()** and **useUser()**.

---

## Role-Based Navigation

After successful login, the application redirects the user based on their role stored in the database.

* **User → User Dashboard**
* **Author → Author Dashboard**

### First-Time Login

* If the user logs in for the first time, no user record exists in the database.
* The application redirects the user to a **Role Selection page**.
* The user selects either **User** or **Author**.
* A new user record is then created in the database with the selected role.

### Existing Users

* If the user already exists in the database, they are redirected directly to their respective dashboard.

---

## Author Actions

Authors can:

* Create new blog posts
* Read all blog posts
* Update blog posts
* Delete blog posts

---

## User Actions

Users can:

* Read blog posts
* Comment on blog posts

---

## Installation

Clone the repository

git clone https://github.com/Revanth-432/Blog_App.git

Navigate to the project folder

cd Blog_App

Install dependencies for backend

cd backend
npm install

Install dependencies for frontend

cd ../frontend
npm install

Start backend server

cd ../backend
npm start

Start frontend

cd ../frontend
npm start

---

## Future Improvements

* Blog search functionality
* Like and share features
* Image uploads for blog posts
* Rich text editor for writing blogs

---

## Author

**Revanth**

Capstone Project – Full Stack MERN Application
