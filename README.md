# Miraa — AI Study Companion

Miraa is a React website that helps students solve academic problems with
step-by-step explanations. It ships as a **static website** that runs fully in
the browser, and can optionally connect to the included Node.js/Express +
MongoDB backend.

## Miraa website (React)

```bash
cd frontend
npm install
npm run dev      # http://localhost:3000
npm run build    # production build in frontend/dist
```

**Pages:** `/` landing page · `/solve` ask a question · `/result` answer with steps ·
`/history` saved questions · `/profile` stats & plans.

**Standalone mode (default).** With no `VITE_API_URL` set, Miraa solves
problems in the browser (`src/services/localEngine.js`) and keeps history in
`localStorage`. The browser engine gives exact, worked solutions for:

- arithmetic (`(3 + 4) * 2^3 - 10 / 4`, `sqrt(144) + 3^2`)
- percentages (`What is 15% of 80?`)
- linear equations (`3(y - 2) = 2y + 5`)
- quadratic equations (`x^2 - 5x + 6 = 0`)

Any other question gets a guided study plan.

**Backend mode.** Set `VITE_API_URL=http://localhost:5000/api` in
`frontend/.env` to use the Express API. If the API can't be reached, Miraa
falls back to the browser engine.

**Deploying.** `frontend/dist` is a static single-page app. `vercel.json`
(Vercel) and `public/_redirects` (Netlify) send every route to `index.html`.
On Vercel or Netlify, set the project root to `frontend`, the build command to
`npm run build` and the output folder to `dist`.

## Features

### Frontend (React + TailwindCSS)
- **Home Page**: Upload images or enter text problems to solve
- **Result Page**: View detailed solutions with step-by-step explanations
- **History Page**: Browse previously solved problems with search and filtering
- **Profile Page**: User dashboard with subscription plans and usage statistics
- **Responsive Design**: Modern UI with TailwindCSS
- **State Management**: React Context for global state

### Backend (Node.js + Express)
- **RESTful API**: Clean endpoints for problem solving and history management
- **MongoDB Integration**: Persistent storage with Mongoose ODM
- **MVC Architecture**: Organized controllers, models, and routes
- **Error Handling**: Comprehensive error handling middleware
- **CORS Support**: Cross-origin requests enabled for frontend

## Tech Stack

### Frontend
- React 18
- React Router DOM
- TailwindCSS
- Axios
- Lucide React (icons)
- Vite (build tool)

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- CORS
- dotenv

## Quick Start

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ai-study-companion
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   
   # Create .env file (already created with default values)
   # Update MONGODB_URI if needed
   
   # Start the backend server
   npm start
   ```
   
   The backend will run on `http://localhost:5000`

3. **Frontend Setup**
   ```bash
   cd ../frontend
   npm install
   
   # Start the development server
   npm run dev
   ```
   
   The frontend will run on `http://localhost:3000`

### MongoDB Setup

**Option 1: Local MongoDB**
- Install MongoDB locally
- Start MongoDB service
- Use default connection string: `mongodb://localhost:27017/ai-study-companion`

**Option 2: MongoDB Atlas**
- Create a free cluster at [MongoDB Atlas](https://www.mongodb.com/atlas)
- Get your connection string
- Update `MONGODB_URI` in `backend/.env`

## Project Structure

```
ai-study-companion/
├── backend/
│   ├── config/
│   │   └── database.js
│   ├── controllers/
│   │   ├── historyController.js
│   │   └── solveController.js
│   ├── middleware/
│   │   └── errorHandler.js
│   ├── models/
│   │   ├── Problem.js
│   │   └── Solution.js
│   ├── routes/
│   │   ├── history.js
│   │   └── solve.js
│   ├── .env
│   ├── package.json
│   └── server.js
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ErrorMessage.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── HistoryList.jsx
│   │   │   ├── LoadingSpinner.jsx
│   │   │   ├── Navbar.jsx
│   │   │   └── ProblemCard.jsx
│   │   ├── context/
│   │   │   └── AppContext.jsx
│   │   ├── pages/
│   │   │   ├── History.jsx
│   │   │   ├── Home.jsx
│   │   │   ├── Profile.jsx
│   │   │   └── Result.jsx
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   ├── postcss.config.js
│   ├── tailwind.config.js
│   └── vite.config.js
└── README.md
```

## API Endpoints

### Problem Solving
- `POST /api/solve` - Solve a problem
  ```json
  {
    "text": "What is 2 + 2?",
    "type": "text"
  }
  ```

### History Management
- `GET /api/history` - Get all solved problems
- `GET /api/history/:id` - Get specific problem details
- `POST /api/history` - Save problem to history

### Health Check
- `GET /api/health` - Check API status

## Development

### Backend Development
```bash
cd backend
npm run dev  # Uses nodemon for auto-restart
```

### Frontend Development
```bash
cd frontend
npm run dev  # Vite dev server with hot reload
```

### Building for Production
```bash
# Frontend
cd frontend
npm run build

# Backend
cd backend
npm start
```

## Current AI Integration

The app currently uses a **dummy AI solver** that returns placeholder solutions. This is designed to be easily replaced with:

- **OpenAI API** integration
- **Custom ML models**
- **Python-based AI services**
- **Other AI/ML APIs**

### Replacing the Dummy Solver

Update `backend/controllers/solveController.js`:

```javascript
// Replace the dummySolver function with real AI integration
const realAISolver = async (problemText) => {
  // Integrate with OpenAI, custom ML model, etc.
  const response = await openai.completions.create({
    // ... your AI configuration
  });
  
  return {
    answer: response.answer,
    steps: response.steps,
    confidence: response.confidence
  };
};
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support, please contact [your-email@example.com] or create an issue in the repository.

## Roadmap

- [ ] Real AI integration (OpenAI API)
- [ ] Image upload and OCR processing
- [ ] User authentication and accounts
- [ ] Payment integration for Pro plans
- [ ] Mobile app development
- [ ] Advanced analytics and reporting
- [ ] Collaborative study features