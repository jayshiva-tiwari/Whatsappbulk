import cors from "cors";
import express from "express";
import helmet from "helmet";
import path from "path";
import { fileURLToPath } from "url";
import routes from "./routes.js";
import { AppError } from "./utils/errors.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const clientDistPath = path.resolve(__dirname, "../../client/dist");

const app = express();
const port = process.env.PORT || 8080;

app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginResourcePolicy: false
  })
);
app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  if (req.headers['x-forwarded-proto'] && req.headers['x-forwarded-proto'] !== 'https') {
    return res.redirect(301, 'https://' + req.headers.host + req.url);
  }
  next();
});

// API Routes
app.use("/api", routes);

app.get('/robots.txt', (req, res) => {
  res.type('text/plain');
  res.send('User-agent: *\nAllow: /\nSitemap: https://whatsappbulk-lvvt.onrender.com/sitemap.xml');
});

app.get('/sitemap.xml', (req, res) => {
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    <url>
      <loc>https://whatsappbulk-lvvt.onrender.com/</loc>
      <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
      <changefreq>weekly</changefreq>
      <priority>1.0</priority>
    </url>
  </urlset>`;
  res.header('Content-Type', 'application/xml');
  res.send(sitemap);
});

// Serve Static Files (Client)
app.use(express.static(clientDistPath, {
  setHeaders: (res, path) => {
    if (path.match(/\.(js|css|png|jpg|jpeg|gif|ico|svg)$/)) {
      res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    }
  }
}));

// Catch-all for SPA navigation: Serve index.html for all non-API routes
app.use((request, response, next) => {
  if (request.path.startsWith("/api")) {
    return next();
  }
  response.setHeader('X-Robots-Tag', 'index, follow');
  response.sendFile(path.join(clientDistPath, "index.html"));
});

// Error Handler
app.use((error, _request, response, _next) => {
  const statusCode = error instanceof AppError ? error.statusCode : 500;
  const message = statusCode === 500 ? "Something went wrong while processing the request." : error.message;

  if (statusCode === 500) {
    console.error(error);
  }

  response.status(statusCode).json({ message });
});

app.listen(port, () => {
  console.log(`API server listening on http://localhost:${port}`);
});
