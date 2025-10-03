# Cosmos Canvas - JavaScript Implementation 🌌🚀

Node.js/Express implementation of the Cosmos Canvas AI assistant for NASA's Gigapixel Explorer mission.

## Features

- 🤖 Gemini AI integration with structured space object responses
- 🚀 Express.js REST API
- 🌍 Loads system instructions from `instructions.txt`
- 📡 `/chat` endpoint for conversational AI

## Quick Start

### 1. Install Dependencies

```powershell
cd "d:\pojects\Nasa\Java script"
npm install
```

### 2. Configure Environment (Optional)

Copy `.env.example` to `.env` and add your Gemini API key:

```powershell
copy .env.example .env
```

Edit `.env`:
```
GEMINI_API_KEY=your_actual_api_key_here
PORT=8000
```

### 3. Run the Server

```powershell
npm start
```

For development with auto-reload:
```powershell
npm run dev
```

## API Endpoints

### GET `/`
Health check endpoint
```json
{ "message": "Cosmos Canvas" }
```

### POST `/chat`
Chat with Cosmos Canvas AI

**Request:**
```json
{
  "prompt": "Tell me about Mars"
}
```

**Response:**
```json
{
  "response": "Mars is the red planet! 🔴..."
}
```

## Test the API

Using PowerShell:
```powershell
$body = @{
    prompt = "Tell me about the Andromeda galaxy"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:8000/chat" -Method POST -Body $body -ContentType "application/json"
```

## Structure

- `main.js` - Express server with Gemini AI integration
- `package.json` - Dependencies and scripts
- `.env` - Environment variables (create from `.env.example`)
- `../instructions.txt` - System instructions for AI

## Requirements

- Node.js >= 18.0.0
- npm or yarn
- Gemini API key

## Notes

- The server reads `instructions.txt` from the parent directory
- Default port is 8000 (configurable via PORT env variable)
- Uses Gemini 2.0 Flash model with system instructions
