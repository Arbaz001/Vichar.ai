```markdown
# 💡 Vichar.ai API

A Node.js/Express/MongoDB backend for managing and analyzing startup ideas with AI feedback features.

**Key Features**:
- ✅ User authentication (JWT)
- ✅ Idea management (CRUD)
- ✅ Voting & commenting system
- 🧠 AI-powered feedback (Hugging Face)
- 📊 Popular/Trending ideas algorithms

## 📦 Installation

### Prerequisites
- Node.js (v18+)
- MongoDB (local or Atlas)
- Hugging Face API key (free)

### Setup Steps
```bash
# 1. Clone repository
git clone https://github.com/yourusername/Vichar.ai-api.git
cd Vichar.ai-api

# 2. Install dependencies
npm install

# 3. Configure environment
cp .env.example .env
# Edit .env with your credentials

# 4. Start server
npm run dev
```

## 🌐 API Endpoints

### Authentication
| Method | Endpoint       | Description          |
|--------|----------------|----------------------|
| POST   | /api/register  | User registration    |
| POST   | /api/login     | User login           |
| GET    | /api/me        | Get user profile     |

### Ideas Management
| Method | Endpoint               | Description                     |
|--------|------------------------|---------------------------------|
| POST   | /api/ideas             | Create new idea                 |
| GET    | /api/ideas             | Get all public ideas            |
| GET    | /api/ideas/my          | Get user's ideas                |
| GET    | /api/ideas/:id         | Get single idea                 |
| PUT    | /api/ideas/:id         | Update idea                     |
| DELETE | /api/ideas/:id         | Delete idea                     |

### Engagement
| Method | Endpoint               | Description                     |
|--------|------------------------|---------------------------------|
| POST   | /api/ideas/:id/vote    | Upvote/downvote idea            |
| POST   | /api/ideas/:id/comment | Add comment                     |
| GET    | /api/ideas/:id/comments| Get all comments                |

### AI Features
| Method | Endpoint               | Description                     |
|--------|------------------------|---------------------------------|
| POST   | /api/ideas/:id/feedback| Get AI analysis (Hugging Face)  |

## 🛠️ Tech Stack
- **Backend**: Node.js + Express
- **Database**: MongoDB + Mongoose
- **Authentication**: JWT
- **AI Integration**: Hugging Face Inference API
- **Security**: Helmet, rate limiting

## 📂 Project Structure
```
ideas-incubator-api/
├── controllers/       # Business logic
├── models/           # MongoDB schemas
├── routes/           # API endpoints
├── middlewares/      # Auth & other middlewares
├── utils/            # AI utilities
├── config/           # DB connection
└── server.js         # Entry point
```

## 🌟 Special Feature

### AI Feedback Response
```json
{
  "summary": "This idea solves XYZ problem...",
  "pros": ["Innovative", "Low cost"],
  "cons": ["High competition"],
  "rating": 7.5
}
```
## 📜 License
MIT License - Free for personal and commercial use

---

**Made with ❤️ in India** | [Contribute](#) | [Report Issues](#)
