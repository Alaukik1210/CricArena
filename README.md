# 🏏 CricArena

CricArena is a web-based platform built to simplify cricket tournament management, team coordination, and real-time ground booking. Whether you're a player, organizer, or admin — CricArena provides an intuitive interface to manage matches, register teams, and book grounds seamlessly.

---

## 🚀 Features

- 👥 **User Roles**: Supports Admin, Player, and Organizer dashboards
- 📋 **Tournament Registration**: View and register for active tournaments
- ⏱ **Real-Time Ground Booking**: Interactive slot-based ground booking system with live updates using Socket.IO
- 📊 **Team and Player Management**: Add teams, assign players, and manage stats
- 📄 **Quotation Requests**: Request custom quotes for organizing tournaments or booking grounds
- 🔒 **Authentication**: Secure login and registration system
- 📱 **Responsive UI**: Fully responsive design using Tailwind CSS v4
- ⚙️ **Tech Stack**: React, TypeScript, Tailwind CSS, Node.js, Express, PostgreSQL, Prisma, Socket.IO

---

## 🛠️ Tech Stack

| Frontend | Backend | Database | Real-time | Styling |
|----------|---------|----------|-----------|---------|
| React + TypeScript | Node.js + Express | PostgreSQL with Prisma ORM | Socket.IO | Tailwind CSS v4 |

---

## 📦 Installation

1. **Clone the Repository**
   ```bash
   git clone https://github.com/your-username/cricarena.git
   cd cricarena

Frontend Setup:

cd client
npm install
npm run dev

Backend Setup:

cd server
npm install
npx prisma generate
npx prisma migrate dev
npm start


.env
DATABASE_URL=your_postgres_url
JWT_SECRET=your_jwt_secret
