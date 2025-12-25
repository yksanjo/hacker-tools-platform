# Setup Instructions

## Prerequisites

- Python 3.8+ 
- Node.js 16+ and npm
- Git (optional)

## Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Create a virtual environment:
```bash
python -m venv venv
```

3. Activate the virtual environment:
```bash
# On macOS/Linux:
source venv/bin/activate

# On Windows:
venv\Scripts\activate
```

4. Install dependencies:
```bash
pip install -r requirements.txt
```

5. Run the backend server:
```bash
uvicorn main:app --reload
```

The backend API will be available at `http://localhost:8000`
- API Documentation: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

## Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The frontend will be available at `http://localhost:3000`

## Running Both Services

### Option 1: Separate Terminals

Open two terminal windows:

**Terminal 1 (Backend):**
```bash
cd backend
source venv/bin/activate  # or venv\Scripts\activate on Windows
uvicorn main:app --reload
```

**Terminal 2 (Frontend):**
```bash
cd frontend
npm run dev
```

### Option 2: Background Processes

**Backend:**
```bash
cd backend
source venv/bin/activate
uvicorn main:app --reload &
```

**Frontend:**
```bash
cd frontend
npm run dev &
```

## First Run

On first run, the backend will automatically:
- Create the SQLite database
- Initialize the database schema
- Add sample security tools (Nmap, Metasploit, Burp Suite, etc.)

## Testing the Application

1. Open `http://localhost:3000` in your browser
2. Browse the sample tools
3. Click on any tool to see details
4. Try submitting a new tool
5. Rate existing tools

## API Testing

You can test the API directly using:
- Swagger UI at `http://localhost:8000/docs`
- curl commands
- Postman or similar tools

Example API call:
```bash
curl http://localhost:8000/api/tools
```

## Troubleshooting

### Backend Issues

- **Port 8000 already in use**: Change the port in the uvicorn command:
  ```bash
  uvicorn main:app --reload --port 8001
  ```
  Then update the frontend proxy in `frontend/vite.config.ts`

- **Database errors**: Delete `hacker_tools.db` and restart the server

### Frontend Issues

- **Port 3000 already in use**: Vite will automatically use the next available port
- **API connection errors**: Make sure the backend is running on port 8000
- **Module not found**: Run `npm install` again

## Production Build

### Backend
The backend is ready for production. For deployment:
- Use a production ASGI server like Gunicorn with Uvicorn workers
- Set up a proper database (PostgreSQL recommended)
- Configure environment variables
- Set up proper CORS origins

### Frontend
Build for production:
```bash
cd frontend
npm run build
```

The built files will be in `frontend/dist/`

## Next Steps

- Add user authentication
- Implement tool favorites/bookmarks
- Add tool version tracking
- Integrate with GitHub API for automatic updates
- Add tool comparison features
- Implement advanced search with filters

