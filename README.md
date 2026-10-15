# ShopKart — Full-Stack E-Commerce Application

ShopKart is a full-stack e-commerce web application built while learning the MERN stack. It allows users to browse products, search and filter categories, manage a cart and wishlist, place orders, and test checkout using Razorpay.

## Features

- User registration, login, and logout
- Product catalog with search and category filtering
- Product details pages
- Shopping cart and wishlist
- Order placement and order history
- Razorpay test-mode payment integration
- Responsive interface built with React and Tailwind CSS

## Tech Stack

**Frontend:** React, Vite, Tailwind CSS  
**Backend:** Node.js, Express.js  
**Database:** MongoDB with Mongoose  
**Authentication:** JWT and cookies  
**Payments:** Razorpay Test Mode

## Project Structure

```text
ShopKart/
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   └── index.js
├── frontend/
│   └── src/
├── package.json
└── README.md
```

## Prerequisites

- Node.js and npm
- MongoDB or a MongoDB Atlas database
- Razorpay test account for payment testing

## Setup Instructions

### 1. Clone the repository

```bash
git clone https://github.com/tejuu27/ShopKart.git
cd ShopKart
npm install
```

### 2. Configure environment variables

Create the required `.env` file(s) locally, following the variable names used by the backend configuration and frontend code. Add your MongoDB connection string, JWT secret, and Razorpay test credentials where required.

Never commit `.env` files or private credentials to GitHub.

### 3. Start the backend

Open a terminal in the backend directory:

```bash
cd backend
npm install
node index.js
```

The backend runs on port `6010` when configured with the project's current settings.

### 4. Start the frontend

Open a second terminal:

```bash
cd frontend
npm install
npm run dev
```

Open the local URL printed by Vite, usually `http://localhost:5173`.

## Testing Payments

ShopKart uses Razorpay Test Mode. Use test credentials and the test payment details provided by Razorpay. Do not use live payment credentials in this learning project.

## Notes

- MongoDB must be reachable for database-dependent features to work.
- Configure the frontend API URL and backend CORS settings appropriately if running on different hosts.
- This project is intended for learning and demonstration purposes.