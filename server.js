const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();

app.use(express.json());
app.use(cors());

// Serve frontend files from public folder
app.use(express.static(path.join(__dirname, 'public')));

// API route for deployment
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

app.post('/deploy', async (req, res) => {
    try {
        const RENDER_API_KEY = process.env.RENDER_API_KEY;
        const SERVICE_ID = process.env.RENDER_SERVICE_ID;

        if (!RENDER_API_KEY || !SERVICE_ID)
            return res.status(400).json({ success: false, error: "Missing API key or Service ID" });

        const response = await fetch(`https://api.render.com/v1/services/${SERVICE_ID}/deploys`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${RENDER_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ "wait_for_web_service": true })
        });

        if (!response.ok) {
            const text = await response.text();
            return res.status(response.status).json({ success: false, error: text });
        }

        const deployData = await response.json();
        const liveURL = `https://${deployData.service.name}.onrender.com`;

        res.json({ success: true, url: liveURL });

    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: err.message });
    }
});

// Fallback for frontend routing
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
