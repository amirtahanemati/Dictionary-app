# 📖 Dictionary App — Persian Dictionary

A lightweight, fast, and user-friendly online dictionary application built with **FastAPI**, **HTML/CSS/JS**, **Docker**, and **nginx**.  
This project leverages the **MajidAPI** to provide meanings and examples for English words, with plans to support Persian and other languages.

---

## 🎯 Project Overview

The Dictionary App is designed to deliver a seamless experience for users looking up word meanings. It consists of three core components:

- 🐍 **Backend**: Built with FastAPI, acting as an API gateway to handle requests to MajidAPI securely.
- 🌐 **Frontend**: A clean, responsive UI crafted with HTML, CSS, and JavaScript for user input and result display.
- 🧭 **Nginx**: Efficiently routes requests and serves the frontend, ensuring smooth performance.

---

## 🛠️ Technologies Used

| Technology        | Description |
|-------------------|-------------|
| **FastAPI**       | High-performance Python framework for API creation and MajidAPI integration |
| **JavaScript**    | Handles client-side events and API requests |
| **nginx**         | Routes requests and serves static frontend files |
| **Docker**        | Runs services in isolated containers for consistency |
| **Docker Compose**| Orchestrates multi-container setup with a single command |
| **httpx**         | Asynchronous HTTP client for interacting with MajidAPI |
| **CORS Middleware**| Enables secure cross-origin requests |

---

## 📂 Project Structure

```
dictionary-app/
├── backend/
│   ├── main.py               # FastAPI application
│   ├── requirements.txt      # Python dependencies
│   └── .env                 # Environment variables (not tracked in Git)
├── frontend/
│   ├── index.html           # Main HTML file
│   ├── styles.css           # Custom CSS for styling
│   └── app.js               # JavaScript for frontend logic
├── nginx/
│   └── nginx.conf           # Nginx configuration
├── docker-compose.yml       # Docker Compose configuration
└── README.md                # Project documentation
```

---

## 🚀 Getting Started

### 1. Create the `.env` File

In the `backend/` directory, create a `.env` file with your MajidAPI token:

```
API_TOKEN=your_real_token_here
```

> ⚠️ **Note**: The `.env` file is included in `.gitignore` to prevent it from being tracked by Git.

---

### 2. Run with Docker Compose

Build and start the application with a single command:

```bash
docker-compose up --build
```

This will:
- Launch the FastAPI backend on port `8000`.
- Serve the frontend via nginx on port `80`.
- Route all `/api/*` requests to the backend.

---

### 3. Access the Application

Open your browser and navigate to:

```
http://localhost
```

---

## ⚙️ How It Works

1. The user enters a word in the frontend input field.
2. A request is sent to `/api/lookup?word=<word>&lang=en`.
3. The FastAPI backend attaches the API token and forwards the request to MajidAPI.
4. The response, including meanings and examples, is processed and displayed to the user.

---

## 🔐 Security Features

- **API Token Protection**: The API token is stored securely in the backend `.env` file and never exposed in the frontend or Git.
- **Gitignore**: The `.env` file is excluded from version control.
- **Backend-Only Requests**: All API calls to MajidAPI are handled server-side to prevent token exposure.

---

## 🧪 Local Development (Without Docker)

For quick testing without Docker:

1. Install backend dependencies:

```bash
cd backend
pip install -r requirements.txt
```

2. Run the FastAPI server:

```bash
uvicorn main:app --reload
```

3. Serve the frontend using a local server (e.g., VS Code Live Server or Python's HTTP server):

```bash
cd frontend
python -m http.server 8080
```

4. Access the app at `http://localhost:8080`.

---

## 👨‍💻 Developer

- **Lead Developer**: Amirtaha nemati
- **GitHub**: [@amirtahanemati](https://github.com/amirtahanemati)
- **Email**: amirtahanemati0@gmail.com

---

## 📜 License

This project is proprietary and all rights are reserved by the developer. Unauthorized use, modification, or distribution of this project without explicit permission from the developer is prohibited. For any usage requests, please contact [@amirtahanemati](https://github.com/amirtahanemati).

---

## 🌟 Support the Project

If you find this project helpful:
- 💬 **Contribute** by opening an issue or contacting the developer.
- 📢 **Share** with your network to spread the word!

---

## 📌 Adding to GitHub

To commit the `README.md` file:

```bash
git add README.md
git commit -m "Add restricted license README file"
git push
```
