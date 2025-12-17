const express = require('express');
const helmet = require('helmet');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// --- OWASP SECURITY HEADERS ---
// Using Helmet to set secure headers
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            "default-src": ["'self'"],
            "script-src": ["'self'", "'unsafe-inline'", "https://appssdk.zoom.us"],
            "style-src": ["'self'", "'unsafe-inline'", "https://cdn.jsdelivr.net"],
            "img-src": ["'self'", "data:", "https://images.unsplash.com"],
            "connect-src": ["'self'"],
            // Crucial for Zoom Apps: Allow the app to be embedded in Zoom
            "frame-ancestors": ["'self'", "https://zoom.us", "https://*.zoom.us"]
        },
    },
    // Prevent Clickjacking
    crossOriginEmbedderPolicy: false,
    crossOriginResourcePolicy: { policy: "cross-origin" }
}));

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Mock Auth endpoint for Zoom
app.get('/auth', (req, res) => {
    const code = req.query.code;
    // In a real app, exchange 'code' for an access token here
    res.redirect('/');
});

// CRM Data API Mock
app.get('/api/customer', (req, res) => {
    res.json({
        id: "CC-9921",
        name: "Alex Johnson",
        status: "Premium",
        email: "alex.j@example.com",
        phone: "+1 (555) 012-3456",
        lastPurchase: "2023-11-15",
        notes: "Interested in cloud migration services. Prefers morning calls.",
        history: [
            { date: "2023-10-01", type: "Email", subject: "Inquiry about pricing" },
            { date: "2023-09-12", type: "Call", subject: "Initial discovery" }
        ]
    });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});