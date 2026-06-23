# Lost & Found Portal

[![Live Demo](https://img.shields.io/badge/Live-Demo-success)](https://lost-found-item-f.onrender.com/)
[![React](https://img.shields.io/badge/Frontend-React-blue)]()
[![Node.js](https://img.shields.io/badge/Backend-Node.js-green)]()
[![MongoDB](https://img.shields.io/badge/Database-MongoDB-darkgreen)]()

A full-stack MERN application that helps users report, discover, and reclaim lost items. The platform enables users to create lost or found item listings, upload images, receive claim notifications, and find potential matches through an intelligent recommendation system.

##  Live Demo

🌐 https://lost-found-item-f.onrender.com/

---

##  Overview

Lost & Found Portal is designed to simplify the process of recovering misplaced belongings. Users can securely create accounts, post lost or found items with images, browse listings, submit claims, and receive notifications when someone interacts with their items.

The application also includes a recommendation engine that suggests potential matches between lost and found items based on item details and location similarity.

---

##  Features

###  Authentication & Authorization
- User registration and login
- JWT-based authentication
- Secure cookie-based sessions
- Protected routes for authenticated users

###  Item Management
- Create Lost or Found item listings
- Upload item images
- Browse all available items
- View personal item listings
- Delete owned listings

###  Notification System
- Receive notifications when another user claims an item
- Track claim requests efficiently
- Improved communication between item owners and claimants

###  Recommendation Engine
- Matches lost and found items automatically
- Analyzes:
  - Item title
  - Item name
  - Location similarity
- Helps users identify potential matches quickly

###  Cloudinary Integration
- Secure image upload and storage
- Optimized image delivery
- Automatic cloud-based media management

---

##  Tech Stack

### Frontend
- React.js
- React Router DOM
- Context API
- CSS

### Backend
- Node.js
- Express.js

### Database
- MongoDB
- Mongoose

### Authentication
- JWT (JSON Web Tokens)
- Cookie-based Authentication

### Cloud Services
- Cloudinary

---

##  System Architecture

```text
User
 ↓
React Frontend
 ↓
Express API
 ↓
JWT Authentication
 ↓
MongoDB Database
 ↓
Cloudinary Storage
```

---

##  Project Structure

```text
lost-found-portal/
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── partials/
│   │   └── App.jsx
│   └── package.json
│
├── backend/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── service/
│   ├── cloudinary/
│   └── index.js
│
└── README.md
```

---

##  Core Functionalities

### Create Item Listing

Users can create Lost or Found listings by providing:

- Item Title
- Item Name
- Description
- Location
- Item Image

### Claim Item

Users can claim items they believe belong to them.

When a claim is submitted:

1. Claim information is stored.
2. A notification is generated.
3. The item owner is informed about the claim request.

### Recommendation System

The recommendation engine compares:

- Item titles
- Item names
- Locations

and calculates a matching score to suggest the most relevant lost/found item pairs.

---

##  Installation

### Clone Repository

```bash
git clone https://github.com/veerct101/lost-found-portal.git
cd lost-found-portal
```

### Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file:

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

Start Backend:

```bash
npm start
```

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

---


##  Future Enhancements

- Real-time notifications using WebSockets
- Advanced recommendation algorithms
- AI-powered image similarity matching
- Direct chat between owners and claimants
- Email notifications
- Item status tracking (Lost → Claimed → Returned)
- Admin dashboard and analytics

---

##  Key Highlights

- Full-stack MERN application
- JWT Authentication & Authorization
- Cloudinary Image Storage
- RESTful API Architecture
- Recommendation Engine for Item Matching
- Notification-Based Claim Workflow
- Responsive User Interface

---

##  Author

**Veer Tejani**

GitHub: https://github.com/veerct101

Project Link: https://lost-found-item-f.onrender.com/

---

 If you found this project useful, consider giving it a star on GitHub.
