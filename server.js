const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;
const BASE_DIR = __dirname;

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf'
};

// Simple zero-dependency .env loader
function loadEnv() {
  const envPath = path.join(BASE_DIR, '.env');
  if (fs.existsSync(envPath)) {
    try {
      const lines = fs.readFileSync(envPath, 'utf8').split(/\r?\n/);
      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith('#')) continue;
        const eqIdx = trimmed.indexOf('=');
        if (eqIdx !== -1) {
          const key = trimmed.slice(0, eqIdx).trim();
          let val = trimmed.slice(eqIdx + 1).trim();
          if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
            val = val.slice(1, -1);
          }
          if (key && !process.env[key]) {
            process.env[key] = val;
          }
        }
      }
    } catch (_) {}
  }
}
loadEnv();

const ANATOMY_SYSTEM_PROMPT = "You are an educational assistant for women's reproductive anatomy. Answer only questions about the organ provided, in 2 to 4 plain sentences. Do not diagnose, interpret symptoms, recommend medicine or doses, or say whether something is serious. For heavy bleeding, severe pain, fever with pain, chest pain, or breathlessness, tell the user to see a doctor now and call 112 in an emergency. For off-topic questions, say what you can help with.";

const server = http.createServer((req, res) => {
  // CORS headers for local development
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  // Sanitize requested URL
  let parsedUrl = req.url.split('?')[0];

  // API Route: Anatomy AI Chat
  if (req.method === 'POST' && parsedUrl === '/api/anatomy-chat') {
    let rawBody = '';
    req.on('data', chunk => {
      rawBody += chunk;
      if (rawBody.length > 1e6) req.destroy();
    });
    req.on('end', async () => {
      let body = {};
      try {
        body = JSON.parse(rawBody || '{}');
      } catch (e) {
        res.writeHead(400, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify({ error: 'Invalid JSON request payload', reply: 'Invalid request format.' }));
        return;
      }

      const organ = (body.organ || 'general').trim();
      const message = (body.message || '').trim();

      if (!message) {
        res.writeHead(400, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify({ error: 'Message cannot be empty', reply: 'Please enter a question to ask.' }));
        return;
      }

      const apiKey = process.env.ANTHROPIC_API_KEY;
      if (!apiKey || !apiKey.trim()) {
        res.writeHead(503, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify({
          error: 'ANTHROPIC_API_KEY is not configured',
          reply: 'Anatomy AI Chat is currently unavailable. Please configure ANTHROPIC_API_KEY in your .env file to enable this educational assistant.'
        }));
        return;
      }

      try {
        const response = await fetch('https://api.anthropic.com/v1/messages', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': apiKey.trim(),
            'anthropic-version': '2023-06-01'
          },
          body: JSON.stringify({
            model: 'claude-haiku-5-5',
            max_tokens: 300,
            system: ANATOMY_SYSTEM_PROMPT,
            messages: [
              {
                role: 'user',
                content: `Organ: ${organ}\nQuestion: ${message}`
              }
            ]
          })
        });

        if (!response.ok) {
          const errData = await response.json().catch(() => ({}));
          const errMsg = (errData && errData.error && errData.error.message) || 'AI service response error';
          res.writeHead(response.status >= 500 ? 502 : response.status, { 'Content-Type': 'application/json; charset=utf-8' });
          res.end(JSON.stringify({
            error: errMsg,
            reply: 'Anatomy AI Chat encountered an issue communicating with the AI service. Please verify your ANTHROPIC_API_KEY in .env.'
          }));
          return;
        }

        const data = await response.json();
        const replyText = data.content && data.content[0] && data.content[0].text
          ? data.content[0].text.trim()
          : 'I could not generate an answer at this moment.';

        res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify({ reply: replyText }));
      } catch (err) {
        res.writeHead(500, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify({
          error: 'Internal server error',
          reply: 'An error occurred while contacting the educational service. Please try again later.'
        }));
      }
    });
    return;
  }

  if (parsedUrl === '/') {
    parsedUrl = '/index.html';
  }

  const safePath = path.normalize(parsedUrl).replace(/^(\.\.[\/\\])+/, '');
  let filePath = path.join(BASE_DIR, safePath);

  // If directory requested, look for index.html
  if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
    filePath = path.join(filePath, 'index.html');
  }

  fs.readFile(filePath, (err, content) => {
    if (err) {
      if (err.code === 'ENOENT') {
        // Fallback to index.html for SPA-like experience
        const fallbackPath = path.join(BASE_DIR, 'index.html');
        fs.readFile(fallbackPath, (fbErr, fbContent) => {
          if (fbErr) {
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end('404 Not Found');
          } else {
            res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
            res.end(fbContent);
          }
        });
      } else {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end(`500 Server Error: ${err.code}`);
      }
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';
    res.writeHead(200, { 'Content-Type': contentType });
    res.end(content);
  });
});

server.listen(PORT, () => {
  console.log(`\n======================================================`);
  console.log(`  🌸 Arogini - Women's Reproductive Wellness Platform`);
  console.log(`  Local URL:   http://localhost:${PORT}`);
  console.log(`  Status:      Running smoothly`);
  console.log(`======================================================\n`);
});
