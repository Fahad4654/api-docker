require('dotenv').config();
const express = require('express');
const { exec } = require('child_process');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const fs = require('fs');
const path = require('path');
const basicAuth = require('express-basic-auth');

console.log(`Loaded env variables: ADMIN=${process.env.ADMIN}, PASS=${process.env.PASS}, PORT=${process.env.PORT}`);


const app = express();
app.use(bodyParser.json());

// Basic Authentication middleware
app.use(basicAuth({
    users: { [process.env.ADMIN]: process.env.PASS },
    challenge: true,
    unauthorizedResponse: 'Unauthorized'
}));

// Middleware to log IP address and timestamp
app.use((req, res, next) => {
    const clientIp = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] Client IP: ${clientIp} - ${req.method} ${req.url}`);
    next();
});

// Use morgan for logging requests with custom format
app.use(morgan(':date[iso] :remote-addr :method :url :status :response-time ms'));

// Endpoint to execute Docker commands
app.post('/run-docker', (req, res) => {
    const { command } = req.body;

    if (!command) {
        return res.status(400).send({ error: 'No command provided' });
    }

    const clientIp = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] Executing Docker command from ${clientIp}: ${command}`);

    // Execute Docker command
    exec(`docker ${command}`, (error, stdout, stderr) => {
        if (error) {
            console.error(`[${timestamp}] [ERROR] Error executing command from ${clientIp}: ${error.message}`);
            return res.status(500).send({ error: error.message });
        }
        if (stderr) {
            console.warn(`[${timestamp}] [WARN] Command stderr from ${clientIp}: ${stderr}`);
            return res.status(400).send({ error: stderr });
        }
        res.send({ output: stdout });
    });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
