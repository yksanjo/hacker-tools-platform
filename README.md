# Security Tool Discovery & Sharing Platform

A modern platform for the hacker community to discover, share, and rate security tools. Built for security researchers, penetration testers, and cybersecurity enthusiasts.

## Features

- 🔍 **Tool Discovery**: Browse and search security tools by category, language, and tags
- ⭐ **Rating System**: Rate and review tools with community feedback
- 📝 **Tool Sharing**: Submit new tools with descriptions, installation guides, and examples
- 🏷️ **Tagging System**: Organize tools with tags (crypto, web, network, etc.)
- 📊 **Trending Tools**: See what's popular in the community
- 🔗 **GitHub Integration**: Direct links to repositories and documentation
- 💬 **Community Reviews**: Read and write reviews from other security researchers

## Tech Stack

- **Backend**: FastAPI (Python)
- **Frontend**: React with TypeScript
- **Database**: SQLite (easily upgradeable to PostgreSQL)
- **Styling**: Tailwind CSS

## Quick Start

### Backend Setup

```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload
```

Backend will run on `http://localhost:8000`

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend will run on `http://localhost:3000`

### API Documentation

Once the backend is running, visit:
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

## Project Structure

```
hacker-tools-platform/
├── backend/
│   ├── main.py              # FastAPI application
│   ├── schemas.py           # Pydantic schemas
│   ├── database.py          # Database models and setup
│   └── requirements.txt     # Python dependencies
├── frontend/
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── pages/           # Page components
│   │   └── App.tsx          # Main app component
│   └── package.json
└── README.md
```

## API Endpoints

- `GET /api/tools` - List all tools with filtering
- `GET /api/tools/{id}` - Get tool details
- `POST /api/tools` - Submit a new tool
- `PUT /api/tools/{id}` - Update tool information
- `POST /api/tools/{id}/ratings` - Rate a tool
- `GET /api/tools/trending` - Get trending tools
- `GET /api/categories` - Get all categories

## Deployment

The repository is ready to be pushed to GitHub. See `DEPLOYMENT.md` for detailed deployment instructions.

### Quick GitHub Setup

1. Create a new repository on GitHub (don't initialize with README)
2. Run these commands:

```bash
git remote add origin https://github.com/YOUR_USERNAME/hacker-tools-platform.git
git push -u origin main
```

Replace `YOUR_USERNAME` with your GitHub username.

## Contributing

This is a community-driven platform. Feel free to submit tools, improvements, and feedback!

## License

MIT

