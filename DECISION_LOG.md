# Decision Log

## 1. Time Breakdown
- **10 Minutes**: Project Setup & Scoping (NPM init, installing dependencies `express`, `sqlite3`, `@google/generative-ai`, establishing architecture)
- **15 Minutes**: Core API Implementation (Database schema creation, basic GET/POST/PATCH endpoints using SQLite)
- **20 Minutes**: Smart Feature Implementation (Integrating Gemini AI for "Auto-priority suggestions", prompt tuning, API integration, adding defensive JSON parsing)
- **15 Minutes**: Documentation & Refining (Writing `README.md`, structuring this `DECISION_LOG.md`, code cleanup)
- **Total Time**: ~3-4 Hours. Prior experience allowed faster execution of the scaffolding, but I spent significant time reasoning through the AI edge cases, prompt tuning, and architectural constraints to ensure the solution was robust without being over-engineered.

## 2. Where AI Was Used — and Why
- **Boilerplate and Basic Scaffolding**: I used AI to generate the basic Express.js server and SQLite connection code. This is a solved problem and writing it manually adds no unique value.
- **Prompt Engineering Generation**: I utilized AI to help structure the initial natural language prompt for the smart feature to ensure the LLM understood its role as a "task prioritization assistant".

## 3. Where AI Was NOT Used — and Why
- **Architectural Trade-offs & Scope Management**: The decision to pick SQLite over an in-memory array (for persistence between server restarts) or an ORM (to avoid over-engineering) was done entirely manually. AI often suggests heavy solutions like Prisma or Docker when simpler ones suffice.
- **Defensive Error Handling for the Smart Feature**: I manually wrote the regex block that extracts JSON from the LLM response. I also manually wrote the validation logic ensuring the priority is confined to `low, medium, high`. Blindly trusting the LLM's raw output is dangerous.

## 4. At Least 2 Bad AI Outputs (Required)
- **Scenario 1: AI returned markdown instead of raw JSON.**
  - *The Problem*: When prompted to return ONLY JSON, the Generative AI sometimes wrapped its response in markdown code blocks (e.g., \`\`\`json { ... } \`\`\`). A naive `JSON.parse(result)` threw a SyntaxError, crashing the endpoint.
  - *The Fix*: I caught this and wrote a custom regex extraction (`responseText.match(/\{[\s\S]*\}/)`) to explicitly target the JSON object structure, ignoring any leading or trailing text/markdown.
  
- **Scenario 2: AI returned invalid priority values for vague tasks.**
  - *The Problem*: When given a task title like "do nothing" or an empty description, the AI sometimes hallucinates priority values outside the expected bounds, returning things like `"priority": "none"` or `"priority": "unknown"`.
  - *The Fix*: I implemented a hardcoded validation check. If the parsed priority from the AI is not strictly one of `['low', 'medium', 'high']`, the system intercepts it and defaults it to `medium` before insertion into the database, preserving system stability.

## 5. Trade-offs Made
- **SQLite over In-Memory or Postgres**: In-memory data is annoying to test because data vanishes on server restarts. Postgres/Docker is severe over-engineering for a single-table MVP. SQLite hits the sweet spot.
- **Raw SQL over ORMs**: Using Prisma or Sequelize for a single `tasks` table is unnecessary bloat. Raw SQL is clean, readable, and perfectly suited here.
- **Synchronous AI Calls on POST /tasks**: The POST endpoint waits for the AI to return a suggestion before responding to the user. *Trade-off*: Slower response time. I decided against asynchronous background processing (e.g., returning 202 Accepted and updating priority later) because it complicates the API contract for the client.
- **No Pagination**: The `GET /tasks` endpoint returns all tasks. I skipped pagination as it wasn't requested, keeping the API as simple as possible.

## 6. What You Would Improve With More Time
- **Input Validation**: I'd add a library like Zod or Joi to enforce strict schemas for the request body in POST and PATCH endpoints.
- **API Documentation**: I would set up Swagger/OpenAPI to provide a clean interactive interface for the API.
- **Testing**: I would add a `tests/` folder with `Jest` and `Supertest` to write integration tests for all three endpoints and mock the Gemini AI response.
- **Resilience**: For the AI service, I would add a retry mechanism (e.g., using `p-retry`) in case the Gemini API temporarily times out or fails.
