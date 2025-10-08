# 🧠 Lead Scoring Backend

A Node.js backend service that scores leads using rule-based and AI (OpenAI) logic.

## ⚙️ Tech Stack
- Node.js (Express)
- MongoDB (Mongoose)
- OpenAI API
- Jest (Testing)
- Docker (Deployment)


## 🧰 Setup & Installation

### 1️⃣ Clone the repository
```bash
git clone https://github.com/rajeev010101/https://github.com/rajeev010101/Lead-scoring.git
cd yourrepo


npm install


## create .env file

PORT=4000
MONGODB_URI=your-mongo-uri
OPENAI_API_KEY=sk-your-key


# run the server

npm run dev
or npm start


---

### 🪶 Step 5 — Add API Documentation
Use Markdown tables and code blocks:
```markdown
## 🧪 API Endpoints

| Method | Endpoint | Description |
|--------|-----------|-------------|
| POST | /offer | Create a new offer |
| POST | /leads/upload | Upload leads CSV |
| POST | /score | Run lead scoring |
| GET | /results | Get scored leads |

### Example:
```bash
curl -X POST http://localhost:4000/offer \
-H "Content-Type: application/json" \
-d '{"name":"AI Outreach Automation"}'
