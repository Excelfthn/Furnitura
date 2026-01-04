# Furnitura - AI Interior Design Tool

An AI-powered interior design application that allows users to drag and drop furniture onto room photos and generate photorealistic renders using Flux 2 Pro.

## Features

- 🖼️ **Image Upload & Optimization** - Auto-resize images to 1MP for optimal API performance
- 🪑 **Furniture Library** - Powered by Snowflake database with search and filtering
- 🎨 **Interactive Canvas** - Drag, resize, and rotate furniture on your room photo
- 🤖 **AI Generation** - Precise placement instructions sent to Flux 2 Pro for photorealistic results

## Tech Stack

- **Frontend**: React + Vite + TailwindCSS + react-rnd
- **Backend**: Express.js + Snowflake SDK
- **Database**: Snowflake
- **AI**: OpenRouter (Flux 2 Pro)

## Prerequisites

- Node.js 18+
- Snowflake account
- OpenRouter API key

## Setup

### 1. Install Dependencies

```bash
# Frontend
npm install

# Backend
cd backend
npm install
```

### 2. Configure Environment Variables

Create `backend/.env`:
```env
SNOWFLAKE_ACCOUNT=your_account
SNOWFLAKE_USERNAME=your_username
SNOWFLAKE_PASSWORD=your_password
SNOWFLAKE_WAREHOUSE=FURNITURA
SNOWFLAKE_DATABASE=FURNITURA
SNOWFLAKE_SCHEMA=FURNITURA
SNOWFLAKE_ROLE=ACCOUNTADMIN
PORT=3001
```

### 3. Setup Snowflake Database

Run the SQL commands in `backend/setup_snowflake.sql` in your Snowflake console.

### 4. Add OpenRouter API Key

Enter your OpenRouter API key in the app's settings (gear icon).

## Running the App

```bash
# Terminal 1: Backend
cd backend
npm start

# Terminal 2: Frontend
npm run dev
```

Open http://localhost:5173

## Usage

1. Upload a room photo
2. Drag furniture from the library sidebar
3. Position and resize items on the canvas
4. Click "Done - Generate Final Image"
5. Download your AI-generated result

## Project Structure

```
Furnitura/
├── src/                    # Frontend React app
│   ├── components/         # UI components
│   ├── services/          # API services
│   └── utils/             # Helper functions
├── backend/               # Express backend
│   ├── server.js          # Main server
│   ├── snowflake.js       # DB connection
│   └── setup_snowflake.sql # DB schema
└── README.md
```

## License

MIT
