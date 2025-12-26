const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');
const app = express();

app.use(express.json());
app.use(cors()); // allow frontend to call backend

// POST /deploy – triggers Render deployment
app.post('/deploy', async (req, res) => {
    try {
        const RENDER_API_KEY = process.env.RENDER_API_KEY; // Paste your Render API key in env
        const SERVICE_ID = process.env.RENDER_SERVICE_ID; // Paste your service ID in env

        const renderResponse = await fetch(`https://api.render.com/v1/services/${SERVICE_ID}/deploys`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${RENDER_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "wait_for_web_service": true
            })
        });

        if (!renderResponse.ok) {
            return res.status(renderResponse.status).json({ success: false });
        }

        const deployData = await renderResponse.json();

        // Construct your live URL – replace with your Render static domain if needed
        const liveURL = `https://${deployData.service.name}.onrender.com`;

        res.json({ success: true, url: liveURL });

    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: err.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));
