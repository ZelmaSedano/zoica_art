import express from 'express'
import cors from 'cors'
import axios from 'axios'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// initiate that app using express
const app = express();

// middleware
app.use(cors());
// parses the incoming JSON data
app.use(express.json());

// serve static files from dist folder
// dist === distribution file for deployment
app.use(express.static(path.join(__dirname, 'dist')));

// CHATBOT RESPONSES (embedded in server.js)
const chatbotResponses = {
    "greetings": {
        "patterns": ["hello", "hi", "hey", "greetings"],
        "responses": [
            "Hello! I'm your helpful assistant.",
            "Hi there! How can I help?",
            "Hey! What's on your mind today?"
        ]
    },
    "farewell": {
        "patterns": ["bye", "goodbye", "see you", "later"],
        "responses": [
            "Goodbye! Have a great day!",
            "See you later! 👋",
            "Bye! Come back anytime!"
        ]
    },
    "help": {
        "patterns": ["help", "what can you do", "features"],
        "responses": [
            "I can help you navigate this portfolio! Try asking about projects, skills, or experience.",
            "I'm here to help! You can ask me about Val's work, skills, or just chat!"
        ]
    },
    "projects": {
        "patterns": ["projects", "portfolio", "work", "examples", "val"],
        "responses": [
            "Val has worked on WebCraft projects, UX/UI designs, and AI applications. Check the Portfolio section!",
            "There are several projects in the portfolio including web development, design work, and Python/AI projects."
        ]
    },
    "default": {
        "responses": [
            "I'm not sure about that. Try asking about projects or help!",
            "Hmm, I don't understand. Maybe ask something else?",
            "Could you rephrase that? I'm here to help!"
        ]
    }
};

// Helper function to find chatbot response
const getChatbotResponse = (input) => {
    const lowerInput = input.toLowerCase().trim();
    
    // Check each category
    for (const [category, data] of Object.entries(chatbotResponses)) {
        if (category === 'default') continue;
        
        // Check if input matches any pattern
        if (data.patterns && data.patterns.some(pattern => 
            lowerInput.includes(pattern.toLowerCase())
        )) {
            // Return random response from matched category
            const randomIndex = Math.floor(Math.random() * data.responses.length);
            return {
                message: data.responses[randomIndex],
                category
            };
        }
    }
    
    // Default response
    const defaultResponses = chatbotResponses.default.responses;
    const randomIndex = Math.floor(Math.random() * defaultResponses.length);
    return {
        message: defaultResponses[randomIndex],
        category: 'default'
    };
};

// API endpoint for chatbot
app.post('/api/chatbot', (req, res) => {
    try {
        const { message } = req.body;
        
        if (!message || typeof message !== 'string' || message.trim() === '') {
            return res.status(400).json({ 
                error: 'Message is required and must be a non-empty string' 
            });
        }
        
        const response = getChatbotResponse(message);
        res.json(response);
        
    } catch (error) {
        console.error('Chatbot API error:', error.message);
        res.status(500).json({ 
            error: 'Failed to process chatbot request',
            details: error.message 
        });
    }
});

// API endpoint for horoscope
app.get('/api/horoscope', async (req, res) => {
    try {
        const { sign } = req.query;
        if (!sign) {
            return res.status(400).json({ error: 'Sign parameter is required' });
        }
        const apiUrl = `https://horoscope-app-api.vercel.app/api/v1/get-horoscope/daily?sign=${sign}&day=today`;
        
        const response = await axios.get(apiUrl);
        res.json(response.data);
    
    } catch (error) {
        console.error('Horoscope API error:', error.message);
        res.status(500).json({ 
            error: 'Failed to fetch horoscope',
            details: error.message 
        });
    }
});

// wildcard route
// client-side routes like /about, /profile, /settings
// fall here and get the SPA's index.html
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// local development - set the port location
if (process.env.NODE_ENV !== 'production') {
    const PORT = process.env.PORT || 3003;
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}

export default app;