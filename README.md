<<<<<<< HEAD
# Blog Post App

A modern, full-stack blog application with enhanced UI and features.

## Features

- ✨ Modern, responsive UI with beautiful design
- 🔍 Real-time search and filtering
- 🏷️ Tags support for blog categorization
- 📊 Word count and reading time estimation
- 🔔 Toast notifications for user feedback
- 📱 Fully responsive design

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or cloud instance like MongoDB Atlas)
- npm or yarn

## Setup Instructions

### 1. Backend Setup

Navigate to the backend directory:
```bash
cd blog-backend
```

Install dependencies:
```bash
npm install
```

Set up environment variables. Create a `.env` file in the `blog-backend` directory:
```env
MONGO_URI=your_mongodb_connection_string
PORT=5000
```

**For MongoDB Atlas (Cloud):**
- Get your connection string from MongoDB Atlas dashboard
- Format: `mongodb+srv://username:password@cluster.mongodb.net/database_name?retryWrites=true&w=majority`

**For Local MongoDB:**
- Format: `mongodb://localhost:27017/blog-app`

### 2. Start the Backend Server

**Development mode (with auto-reload):**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

The server will start on `http://localhost:5000` (or the PORT specified in your .env file).

### 3. Frontend Setup

The frontend is a static HTML/CSS/JS application. You can:

**Option 1: Open directly in browser**
- Simply open `blog-frontend/index.html` in your web browser
- Note: Make sure the API URL in `blog.js` matches your backend server URL

**Option 2: Use a local server (recommended)**

Using Python:
```bash
cd blog-frontend
python -m http.server 8000
```

Using Node.js (http-server):
```bash
npm install -g http-server
cd blog-frontend
http-server -p 8000
```

Using VS Code Live Server extension:
- Right-click on `index.html` → "Open with Live Server"

Then open `http://localhost:8000` in your browser.

### 4. Update API URL (if needed)

If your backend is running on a different URL, update the API URL in `blog-frontend/blog.js`:

```javascript
const api = 'http://localhost:5000/api/blogs';  // For local development
// or
const api = 'https://your-deployed-backend.com/api/blogs';  // For production
```

## Project Structure

```
blog-post-app/
├── blog-backend/
│   ├── models/
│   │   └── Blog.js          # Blog data model
│   ├── routes/
│   │   └── blogs.js         # API routes
│   ├── server.js            # Express server setup
│   └── package.json         # Backend dependencies
│
└── blog-frontend/
    ├── index.html           # Main HTML file
    ├── blog.js              # Frontend JavaScript
    └── styles.css           # Styling
```

## API Endpoints

- `GET /api/blogs` - Get all blogs
- `GET /api/blogs/:id` - Get a single blog
- `POST /api/blogs` - Create a new blog
- `PUT /api/blogs/:id` - Update a blog
- `DELETE /api/blogs/:id` - Delete a blog

## Troubleshooting

**MongoDB Connection Error:**
- Verify your `MONGO_URI` is correct
- Check if MongoDB is running (for local instances)
- Ensure your IP is whitelisted (for MongoDB Atlas)

**Port Already in Use:**
- Change the PORT in your `.env` file
- Or kill the process using the port

**CORS Issues:**
- The backend is configured to allow all origins
- For production, update CORS settings in `server.js`

## Development Tips

- Use `npm run dev` for development (auto-reloads on file changes)
- Check browser console for any JavaScript errors
- Use Network tab in browser DevTools to debug API calls
=======
full stack blog post app
>>>>>>> 641ac69eab0579ce210bccd7a6163e70e3fd3ebf
