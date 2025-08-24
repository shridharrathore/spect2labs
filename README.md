# Spec2Labs

Convert OpenAPI specifications into interactive learning tutorials.

## Overview

Spec2Labs is a full-stack web application that transforms OpenAPI/Swagger specifications into step-by-step interactive tutorials. Upload your API spec and get a guided learning experience.

## Features

- 📤 Upload OpenAPI 3.0 specifications
- 📖 Generate interactive tutorials  
- 📊 Track tutorial progress
- 🔍 Browse created tutorials
- 🎯 Modern, responsive UI

## Tech Stack

**Backend:**
- FastAPI (Python)
- SQLModel + SQLite
- Async/await support

**Frontend:**
- Next.js 15 + TypeScript
- Tailwind CSS
- React hooks

## Quick Start

### Prerequisites
- Python 3.9+
- Node.js 18+

### Backend Setup
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r ../requirements.txt
uvicorn main:app --reload --port 8000
```

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

### Access
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- API Docs: http://localhost:8000/docs

## Usage

1. **Create Tutorial**: Go to `/new` and paste your OpenAPI spec
2. **View Tutorials**: Browse created tutorials on the home page
3. **API Testing**: Use the interactive API documentation

## Project Structure

```
spect2labs/
├── backend/           # FastAPI backend
│   ├── main.py       # API endpoints
│   ├── models.py     # Database models
│   └── database.py   # Database config
├── frontend/         # Next.js frontend
│   └── src/app/      # App router pages
├── requirements.txt  # Python dependencies
└── README.md
```

## Development

**Backend API Endpoints:**
- `GET /health` - Health check
- `GET /specs` - List OpenAPI specs
- `GET /guides` - List tutorials
- `POST /ingest` - Create new tutorial

**Database Models:**
- OpenAPISpec - Stores uploaded specifications
- TutorialGuide - Generated tutorials
- TutorialStep - Individual tutorial steps
- StepAttempt - User progress tracking

## Contributing

This is a prototype/MVP. Feel free to extend functionality:
- Add tutorial step validation
- Implement AI-powered explanations
- Add user authentication
- Create sharing features

## License

MIT License
