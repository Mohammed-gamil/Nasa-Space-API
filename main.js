const express = require('express');
const fs = require('fs');
const path = require('path');
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Initialize Express app
const app = express();
app.use(express.json());

// Enable CORS for demo client
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }
    next();
});
// Load instructions from file
function loadInstructions(state = 'default') {
    let instructionsPath = "../instructions_beginner.txt";
    
    switch (state) {
        case 'Earth Json':
            instructionsPath = path.join(__dirname , 'instructions_Earth.txt');
            break;
        case 'Search cosmic':
            instructionsPath = path.join(__dirname , 'instructions_cosmic.txt');
            break;
        case 'beginner':
            instructionsPath = path.join(__dirname , 'instructions_beginner.txt');
            break;
        case 'advanced':
            instructionsPath = path.join(__dirname , 'instructions_advanced.txt');
            break;

    }

    try {
        const instructions = fs.readFileSync(instructionsPath, 'utf-8');
        return instructions;
    } catch (error) {
        console.error(`Error loading instructions file (${instructionsPath}):`, error.message);
        return '';
    }
}

// Utility: Clean LLM response text based on mode
function cleanLLMResponse(text, mode = 'default') {
    if (!text || typeof text !== 'string') return '';
    let cleaned = text.trim();

    // Strip leading/trailing code fence markers (```json / ```)
    cleaned = cleaned.replace(/^```json\s*|^```\s*/i, '');
    cleaned = cleaned.replace(/```\s*$/i, '');

    // Remove any remaining fenced blocks inside just in case
    cleaned = cleaned.replace(/```[\s\S]*?```/g, m => m.replace(/^```\w*\s*/i, '').replace(/```$/, ''));

    cleaned = cleaned.trim();

    // Apply Earth Json mode trimming: remove first 7 and last 3 characters
    if (mode === 'Earth Json') {
        if (cleaned.length >= 10) {
            cleaned = cleaned.slice(7, -3);
        } else {
            cleaned = '';
        }
    }
    return cleaned;
}

// Initialize Gemini AI
const API_KEY = process.env.GEMINI_API_KEY || 'AIzaSyDpgt6Jt6I-7mAH7NVz6NGHsgKLoqL_9IQ';
const genAI = new GoogleGenerativeAI(API_KEY);
// load default system instructions at startup
let systemInstructions = loadInstructions();

// Gemini chat function - accepts per-request system instructions
async function chat(prompt, systemInstructions = '', mode = 'default') {
    try {
        let generationConfig = {
            temperature: 0.7,
        };

        // Apply token constraints for advanced mode
        if (mode === 'advanced') {
            generationConfig.maxOutputTokens = 250; // Constrain to 1000 tokens for advanced mode
            generationConfig.temperature = 0.3; // Lower temperature for more focused responses
        }

        const model = genAI.getGenerativeModel({
            model: 'gemini-2.0-flash-exp',
            systemInstruction: systemInstructions,
            generationConfig: generationConfig
        });

        const result = await model.generateContent(prompt);
        const response = await result.response;
        return response.text();
    } catch (error) {
        console.error('Error calling Gemini API:', error);
        throw error;
    }
}

// Serve static files
app.use(express.static(__dirname));

// Routes
app.get('/api', (req, res) => {
    res.json({ message: 'Cosmos Canvas' });
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'demo.html'));
});

app.post('/chat', async (req, res) => {
    try {
        let { prompt } = req.body;

        if (!prompt) {
            return res.status(400).json({ error: 'Prompt is required' });
        }

        // Determine mode based on prompt prefix and load corresponding instructions
    let perRequestInstructions = loadInstructions('default');
    let modeUsed = 'default';

        if (prompt.toLowerCase().startsWith('use earth methods')) {
            prompt = prompt.substring('use earth methods'.length).trim();
            perRequestInstructions = loadInstructions('Earth Json');
            modeUsed = 'Earth Json';
        } else if (prompt.toLowerCase().startsWith('search cosmic')) {
            prompt = prompt.substring('search cosmic'.length).trim();
            perRequestInstructions = loadInstructions('Search cosmic');
            modeUsed = 'Search cosmic';
        } else if (prompt.toLowerCase().startsWith('beginner mode')) {
            prompt = prompt.substring('beginner mode'.length).trim();
            perRequestInstructions = loadInstructions('beginner');
            modeUsed = 'beginner';
        } else if (prompt.toLowerCase().startsWith('advanced mode')) {
            prompt = prompt.substring('advanced mode'.length).trim();
            perRequestInstructions = loadInstructions('advanced');
            modeUsed = 'advanced';
        }

        const responseText = await chat(prompt, perRequestInstructions, modeUsed);
        const cleaned = cleanLLMResponse(responseText, modeUsed);
        res.json({ response: cleaned });
    } catch (error) {
        console.error('Error in /chat endpoint:', error);
        res.status(500).json({
            error: 'Failed to generate response',
            details: error.message
        });
    }
});


// Start server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log(`🌌 Cosmos Canvas server running on http://localhost:${PORT}`);
    console.log(`📡 System instructions loaded: ${systemInstructions.length} characters`);
});

module.exports = app;
