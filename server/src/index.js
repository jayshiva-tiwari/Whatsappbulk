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

// API Routes
app.use("/api", routes);

// Serve Static Files (Client)
app.use(express.static(clientDistPath));

// Catch-all for SPA navigation: Serve index.html for all non-API routes
app.use((request, response, next) => {
  if (request.path.startsWith("/api")) {
    return next();
  }
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
