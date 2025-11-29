# TaxNova Agentic CA - Detailed Implementation Plan

## Project Structure

```
taxnova/
├── frontend/                    # Next.js 14+ with App Router
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx            # Landing with persona selector
│   │   ├── upload/
│   │   │   └── page.tsx        # Upload page
│   │   ├── consult/
│   │   │   └── [jobId]/
│   │   │       └── page.tsx    # Main CA chat interface
│   │   └── final/
│   │       └── [jobId]/
│   │           └── page.tsx    # Final plan & download
│   ├── components/
│   │   ├── ui/                  # shadcn components
│   │   ├── UploadDropzone.tsx
│   │   ├── ChatUI.tsx
│   │   ├── AgentCards.tsx
│   │   ├── ProfilePanel.tsx
│   │   ├── ObservationsGrid.tsx
│   │   ├── RecommendationList.tsx
│   │   ├── SavingsBanner.tsx
│   │   └── FinalPlan.tsx
│   ├── lib/
│   │   ├── api.ts              # API client functions
│   │   └── utils.ts
│   └── package.json
├── backend/                     # FastAPI
│   ├── app/
│   │   ├── main.py             # FastAPI app entry
│   │   ├── api/
│   │   │   └── endpoints.py   # All API routes
│   │   ├── agents/
│   │   │   └── langgraph_pipeline.py  # Agent orchestration
│   │   ├── rules/
│   │   │   └── deductions.py  # Tax calculation rules
│   │   ├── models/
│   │   │   └── schemas.py     # Pydantic models
│   │   └── utils/
│   │       ├── ocr.py         # OCR utilities (mocked/real)
│   │       └── pdf_gen.py     # PDF generation
│   ├── requirements.txt
│   └── Dockerfile
├── data/
│   └── samples/                # Demo personas
│       ├── sample_salary_rajesh.json
│       └── sample_salary_priya.json
└── README.md
```

## Implementation Phases

### Phase 1: Project Setup & Foundation (30 min)

**Backend Setup:**

- Initialize FastAPI project structure
- Create `requirements.txt` with: fastapi, uvicorn, pydantic, langgraph, langchain, weasyprint, python-multipart
- Set up `app/main.py` with FastAPI app, CORS middleware
- Create base Pydantic schemas in `app/models/schemas.py`
- Set up in-memory storage (dict) for job_id → profile mapping

**Frontend Setup:**

- Initialize Next.js 14 project with TypeScript
- Install and configure Tailwind CSS
- Set up shadcn/ui components (button, card, input, dialog, toast)
- Create base layout and routing structure
- Set up API client utilities in `lib/api.ts`

**Data Preparat ion:**

- Create 2-3 sample persona JSON files in `data/samples/`
- Include realistic salary, deductions, and missing opportunities

### Phase 2: Document Upload & Parsing (45 min)

**Backend (`app/api/endpoints.py`):**

- `POST /upload` endpoint:
  - Accept file upload OR `use_sample` flag with persona name
  - If sample: load from `data/samples/`
  - If file: mock parsing (return structured JSON) or real OCR
  - Generate unique `job_id`
  - Store parsed profile in memory
  - Return `{job_id, parsed_profile}`

**Frontend (`components/UploadDropzone.tsx`):**

- Drag-and-drop file upload UI
- "Use Sample Persona" buttons (Rajesh, Priya, etc.)
- Loading state with parsing animation
- Redirect to `/consult/[jobId]` on success

**Frontend (`app/upload/page.tsx`):**

- Landing page with upload component
- Persona selector cards

### Phase 3: Chat Interview System (1 hour)

**Backend (`app/agents/langgraph_pipeline.py`):**

- Implement InterviewAgent as LangGraph node:
  - Analyzes parsed profile
  - Generates follow-up questions based on missing data
  - Stores Q&A in profile state
- Questions to cover: rent, health insurance, home loan, additional investments

**Backend (`app/api/endpoints.py`):**

- `POST /chat` endpoint:
  - Accepts `{job_id, user_message}`
  - Routes to InterviewAgent
  - Updates profile with user responses
  - Returns `{agent_reply, followup_questions[], updated_profile}`

**Frontend (`components/ChatUI.tsx`):**

- Chat interface with message bubbles
- User input field
- Quick-reply buttons for yes/no questions
- Number input modal for numerical questions
- Show agent thinking state

**Frontend (`components/ProfilePanel.tsx`):**

- Side panel showing parsed profile data
- Auto-updates as chat progresses
- Fields: basic salary, HRA, rent, investments, etc.

### Phase 4: Rule Engine & Observations (1 hour)

**Backend (`app/rules/deductions.py`):**

- `calc_hra_exempt(basic, hra_received, rent, city_type)` → returns exemption amount
- `calc_80c_current(pf, elss, other)` → current 80C utilization
- `max_80c_remaining()` → calculates remaining 80C limit
- `estimate_tax(taxable_income, regime)` → tax calculation (both old/new regime)
- `recommend_80c_fill(remaining)` → generates recommendation object
- `recommend_nps(amount)` → NPS recommendation
- `recommend_increase_80d(delta)` → health insurance recommendation
- All functions return both numeric results and textual justifications

**Backend (`app/agents/langgraph_pipeline.py`):**

- ObservationAgent node:
  - Runs all deduction rules
  - Identifies missed opportunities
  - Generates Observation objects with evidence
  - Creates Recommendation objects with estimated savings

**Backend (`app/api/endpoints.py`):**

- `GET /observations/{job_id}`:
  - Triggers ObservationAgent
  - Returns `{observations[], recommendations[]}`

**Frontend (`components/ObservationsGrid.tsx`):**

- Grid of observation cards
- Each card shows: title, description, evidence preview
- Visual indicators for high/medium/low impact

**Frontend (`components/RecommendationList.tsx`):**

- List of recommendations with:
  - Toggle switches
  - Estimated tax savings (₹X)
  - Required amount to invest
  - Evidence list
  - Feasibility indicator

### Phase 5: Tax Calculation & Savings (45 min)

**Backend (`app/api/endpoints.py`):**

- `POST /apply_recommendations/{job_id}`:
  - Accepts list of recommendation IDs
  - Recalculates tax with selected recommendations applied
  - Computes before/after comparison
  - Generates final plan object
  - Returns `{before_tax, after_tax, savings, final_plan}`

**Frontend (`components/SavingsBanner.tsx`):**

- Large animated card showing:
  - Before: ₹X tax liability
  - After: ₹Y tax liability  
  - Savings: ₹Z (animated number counter)
- Updates in real-time as recommendations are toggled

**Frontend (`app/consult/[jobId]/page.tsx`):**

- Main layout combining:
  - ChatUI (left)
  - ProfilePanel (right sidebar)
  - AgentCards (top)
  - ObservationsGrid (middle)
  - RecommendationList (bottom)
  - SavingsBanner (prominent)

### Phase 6: Agent Pipeline Visualization (30 min)

**Backend (`app/api/endpoints.py`):**

- `GET /agents/status/{job_id}`:
  - Returns status of each agent in pipeline
  - Format: `{parser: {status, output}, interview: {...}, observation: {...}, optimizer: {...}, report: {...}}`

**Backend (`app/agents/langgraph_pipeline.py`):**

- Implement remaining agents:
  - OptimizerAgent: ranks recommendations by impact
  - ReportAgent: prepares final plan structure

**Frontend (`components/AgentCards.tsx`):**

- Horizontal card layout showing 5 agents:
  - Parser Agent
  - Interview Agent
  - Observation Agent
  - Optimizer Agent
  - Report Agent
- Each card shows: status (idle/processing/complete), short output snippet
- Animated transitions between states
- Flashy visual indicator of agentic flow

### Phase 7: PDF Generation & Final Plan (45 min)

**Backend (`app/utils/pdf_gen.py`):**

- Create HTML template (Jinja2) for CA-style plan:
  - User summary section
  - Evidence thumbnails/references
  - Before/After tax calculation (detailed breakdown)
  - Selected recommendations with step-by-step actions
  - Disclaimer text
- Use WeasyPrint to convert HTML → PDF

**Backend (`app/api/endpoints.py`):**

- `GET /download/plan/{job_id}`:
  - Generates PDF using ReportAgent
  - Returns PDF file as download

**Frontend (`components/FinalPlan.tsx`):**

- Checklist view of selected recommendations
- Action items with checkboxes
- Download PDF button
- Summary statistics

**Frontend (`app/final/[jobId]/page.tsx`):**

- Final plan page with:
  - FinalPlan component
  - Savings summary
  - Download button

### Phase 8: Polish & Animations (30 min)

**Frontend:**

- Add Framer Motion animations:
  - Page transitions
  - SavingsBanner number counter animation
  - Recommendation toggle animations
  - Agent card state transitions
- Add React Hot Toast notifications for:
  - Upload success
  - Recommendation applied
  - PDF generated
- Loading states and skeletons
- Error handling UI

**Backend:**

- Add error handling and validation
- Add logging for demo visibility
- Optimize response times

### Phase 9: Demo Preparation (30 min)

**Testing:**

- Test end-to-end with 2 personas
- Verify all calculations
- Test PDF generation
- Record backup demo video (1 minute)

**Documentation:**

- Update README with setup instructions
- Create demo script document
- Prepare pitch talking points

**Final Checks:**

- Ensure all sample personas work
- Verify agent pipeline visualization
- Test on different screen sizes
- Prepare fallback demo data

## Key Implementation Details

### Data Models (Pydantic Schemas)

```python
# app/models/schemas.py
class ParsedPayroll(BaseModel):
    gross_salary: int
    basic_salary: int
    hra_received: int
    pf: int
    allowances: Dict[str, int]

class UserProfile(BaseModel):
    job_id: str
    city: str
    rent_annually: Optional[int]
    has_home_loan: bool
    investments_80c: int
    health_premium: int
    parsed_payroll: ParsedPayroll
    chat_history: List[Dict]

class Recommendation(BaseModel):
    id: str
    title: str
    description: str
    required_amount: int
    estimated_tax_savings: int
    evidence: List[str]
    feasibility: str
    category: str
```

### LangGraph Agent Structure

```python
# Simplified agent nodes for hackathon
def parser_agent(files) -> ParsedPayroll
def interview_agent(profile) -> List[str]  # questions
def observation_agent(profile) -> Tuple[List[Observation], List[Recommendation]]
def optimizer_agent(recommendations) -> List[Recommendation]  # ranked
def report_agent(profile, selected_recs) -> FinalPlan
```

### Tax Calculation Logic

- Support both Old and New tax regimes
- Accurate tax slabs (2024-25)
- All major sections: 80C (1.5L), 80D, HRA, Standard Deduction (50k)
- Calculate taxable income correctly
- Refund estimation

### API Endpoints Summary

1. `POST /upload` - Upload documents or use sample
2. `POST /chat` - Chat with CA agent
3. `GET /observations/{job_id}` - Get observations and recommendations
4. `POST /apply_recommendations/{job_id}` - Apply selected recommendations
5. `GET /agents/status/{job_id}` - Get agent pipeline status
6. `GET /download/plan/{job_id}` - Download PDF plan

## Demo Flow

1. Landing page → Select "Use Sample Rajesh"
2. Upload page → Shows parsing animation → Redirects to consult
3. Consult page → Agent asks 3-4 follow-up questions → User responds
4. Observations appear → User sees missed deductions
5. Recommendations list → User toggles recommendations → SavingsBanner animates
6. Click "Generate Plan" → Final page with checklist
7. Download PDF → Shows complete action plan
8. Highlight AgentCards showing pipeline flow

## Success Criteria

- ✅ Document upload works (sample or file)
- ✅ Chat interview asks relevant follow-ups
- ✅ Observations identify real missed opportunities
- ✅ Recommendations have accurate tax savings
- ✅ Before/After comparison is correct
- ✅ PDF download works
- ✅ Agent pipeline is visually demonstrated
- ✅ Smooth UI with animations
- ✅ Demo runs without errors

## Risk Mitigation

- **OCR fails**: Use pre-parsed sample JSONs (primary path)
- **LangGraph issues**: Implement agents as simple functions, present as agents in UI
- **PDF issues**: Have pre-generated backup PDF ready
- **Time runs out**: Prioritize: upload → chat → observations → savings → export