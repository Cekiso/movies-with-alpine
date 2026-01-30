# 🎬 Movie Application (Alpine.js + Vite)

A full-stack, responsive movie web application featuring client–server architecture, user authentication, and continuous integration testing. The application enables users to browse movies from an external API, manage a personal movie library, and securely register and log in to their accounts.

---

## 📌 Overview

This project demonstrates modern frontend development using **Alpine.js** and **Vite**, combined with a lightweight backend that handles authentication and data persistence. The application is fully responsive and follows clean separation between client and server responsibilities.

---

## 🚀 Key Features

* External movie API integration using JavaScript
* Dynamic movie rendering with Alpine.js
* Personal movie library (add/remove movies)
* User authentication (Login & Signup)
* User data stored in the database
* Responsive UI across all screen sizes
* Client–Server architecture
* Automated testing with **Travis CI**

---

## 🧱 Architecture

### Client (Frontend)

Built using modern web technologies:

* **HTML5**
* **CSS3**
* **JavaScript (ES6)**
* **Alpine.js**
* **Vite**

Responsibilities:

* UI rendering
* Fetching movies from the API
* Managing application state
* Handling user interactions
* Responsive layout and design

---

### Server (Backend)

Responsibilities:

* User authentication (login and signup)
* Persisting user data
* Managing user-specific movie libraries

Technologies:

* JavaScript
* Two JSON files used for structured data storage

---

## 🎥 Movie API Integration

* Movies are retrieved using JavaScript API calls
* Data includes:

  * Movie titles
  * Posters
  * Release dates
  * Ratings
* Results are dynamically displayed without page reloads

---

## 📚 My Library Feature

* Users can save movies to a personal library
* Saved movies are displayed on the **My Library** page
* Users can remove movies from their library
* State updates instantly for a smooth user experience

---

## 🔐 Authentication System

* Dedicated Login and Signup pages
* User credentials are stored securely in the database
* Each user has an independent movie library
* Authentication ensures user-specific access and data separation

---

## 📱 Responsive Design

* Fully responsive layout
* Optimized for:

  * Mobile devices
  * Tablets
  * Desktop screens
* Built with modern CSS practices

---

## 🧪 Testing & Continuous Integration

* Application functions are tested using automated test cases
* Continuous Integration implemented with **Travis CI**
* Tests are executed automatically on every push and pull request
* Configuration managed via `travis.yml`

This ensures:

* Code reliability
* Early detection of bugs
* Stable builds across updates

---

## ⚙️ Installation & Setup

1. Clone the repository:

   ```bash
   git clone https://github.com/your-username/movie-app.git
   ```

2. Navigate to the project directory:

   ```bash
   cd movie-app
   ```

3. Install dependencies:

   ```bash
   npm install
   ```

4. Run the development server:

   ```bash
   npm run dev
   ```

5. Open in browser:

   ```
   http://localhost:5173
   ```

---

## ✅ Project Status

* ✔ Fully functional
* ✔ Client–Server architecture
* ✔ Authentication implemented
* ✔ CI testing with Travis CI
* ✔ Responsive UI

---

## 🔮 Future Enhancements

* Replace JSON storage with a full database
* Add movie search and filtering
* Improve UI animations and transitions
* Deploy application to a production environment

---

## 👨‍💻 Author

**[@Cekiso]**
Full-Stack Movie Application built with Alpine.js and Vite

---

⭐ *This project was developed to demonstrate full-stack development, API integration, authentication, and CI testing.*

---
