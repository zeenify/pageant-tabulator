# 👑 Pageant Tabulator

A web-based pageant scoring and tabulation system built with **Laravel** + **React (Inertia.js)** + **Tailwind CSS**.

## 🚀 Features

- Manage **Categories** and **Criteria** for scoring
- **Contestant** management
- Real-time tabulation
- Clean, responsive UI

## 🛠️ Tech Stack

- **Backend:** Laravel 10
- **Frontend:** React + Inertia.js
- **Styling:** Tailwind CSS
- **Build Tool:** Vite

## ⚙️ Installation

### Prerequisites
- PHP >= 8.1
- Composer
- Node.js & npm
- MySQL

### Steps

1. Clone the repo
```bash
   git clone https://github.com/zeenify/pageant-tabulator.git
   cd pageant-tabulator
```

2. Install dependencies
```bash
   composer install
   npm install
```

3. Set up environment
```bash
   cp .env.example .env
   php artisan key:generate
```

4. Configure your `.env` database credentials
```env
   DB_DATABASE=your_db_name
   DB_USERNAME=your_username
   DB_PASSWORD=your_password
```

5. Run migrations
```bash
   php artisan migrate
```

6. Start the app
```bash
   php artisan serve
   npm run dev
```

Visit `http://localhost:8000`

## 👨‍💻 Developer

- **Edrick Martin** — [@zeenify](https://github.com/zeenify)

## 📄 License

This project is for academic purposes.