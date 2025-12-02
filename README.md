# PhysioMind CDSS

**Clinical Decision Support System for Physiotherapists**

A production-grade web application where physiotherapists input patient data (symptoms, imaging reports) and receive AI-generated, evidence-based diagnostic reports with structured treatment plans.

## Architecture

This is a monorepo containing:

- **`/frontend`** - Next.js 14+ web application with TypeScript, Tailwind CSS, and Shadcn/UI
- **`/backend`** - Python FastAPI backend with OpenAI integration

## Tech Stack

### Frontend
- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS with "Medical Minimalist" design system
- **UI Components**: Shadcn/UI (Radix Primitives)
- **Icons**: Lucide React
- **State Management**: 
  - TanStack Query (React Query) for server state
  - Zustand for local client state
- **Animations**: Framer Motion
- **Validation**: Zod

### Backend
- **Framework**: FastAPI (Async Python)
- **AI/LLM**: OpenAI GPT-4o with Structured Outputs
- **Validation**: Pydantic v2
- **RAG Pipeline**: Simulated medical protocol retrieval

## Design System

- **Aesthetic**: Medical Minimalist (Teal/Slate/White color palette)
- **Layout**: Dashboard with sidebar navigation, top bar, and central workspace
- **Typography**: Inter/Sans with high whitespace
- **Responsiveness**: Mobile-first approach

## Getting Started

### Prerequisites
- Node.js 18+
- Python 3.11+
- npm or yarn

### Backend Setup

```bash
cd backend
python -m venv venv
source venv/bin/activate  # or `venv\Scripts\activate` on Windows
pip install -r requirements.txt
cp .env.example .env  # Configure your OpenAI API key
uvicorn app.main:app --reload --port 8000
```

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Visit `http://localhost:3000` for the frontend and `http://localhost:8000/docs` for API documentation.

## API Endpoints

### POST /api/v1/analyze

Analyze patient data and generate AI-powered diagnosis.

**Request Body:**
```json
{
  "patient_data": {
    "pain_scale": 7,
    "subjective": {
      "chief_complaint": "Lower back pain",
      "symptom_duration": "2 weeks",
      "symptom_description": "Dull aching pain"
    },
    "objective": {
      "affected_region": "Lumbar spine"
    }
  }
}
```

**Response:**
```json
{
  "success": true,
  "diagnosis": {
    "differential_diagnosis": ["Lumbar strain", "Disc herniation"],
    "primary_diagnosis": "Lumbar mechanical dysfunction",
    "clinical_reasoning": "...",
    "risk_flags": [],
    "treatment_plan": {
      "acute_phase": "...",
      "recovery_phase": "...",
      "maintenance": "..."
    },
    "suggested_exercises": [
      {
        "name": "Bridging",
        "sets": 3,
        "reps": 10
      }
    ]
  },
  "processing_time_ms": 1234.5
}
```

## Project Structure

```
├── backend/
│   ├── app/
│   │   ├── main.py              # FastAPI application
│   │   ├── models/
│   │   │   └── schemas.py       # Pydantic data models
│   │   ├── routes/
│   │   │   └── analyze.py       # API endpoints
│   │   └── services/
│   │       └── diagnosis_service.py  # AI diagnosis logic
│   ├── tests/
│   └── requirements.txt
│
├── frontend/
│   ├── src/
│   │   ├── app/                 # Next.js App Router
│   │   ├── components/
│   │   │   ├── ui/              # Shadcn/UI components
│   │   │   ├── diagnosis-dashboard.tsx
│   │   │   ├── patient-input-form.tsx
│   │   │   ├── sidebar.tsx
│   │   │   └── topbar.tsx
│   │   ├── hooks/               # React hooks
│   │   ├── lib/                 # Utilities
│   │   ├── stores/              # Zustand stores
│   │   └── types/               # TypeScript interfaces
│   └── package.json
│
└── README.md
```

## Data Schemas

Shared data schemas are defined in:
- **Backend**: `backend/app/models/schemas.py` (Pydantic)
- **Frontend**: `frontend/src/types/schemas.ts` (TypeScript)

These provide a single source of truth for the API contract between frontend and backend.

## Disclaimer

⚠️ **This is a Clinical Decision SUPPORT Tool**

PhysioMind is designed to assist physiotherapists in their clinical decision-making process. It does NOT replace professional clinical judgment. All AI-generated suggestions must be reviewed by qualified healthcare professionals.

## License

MIT