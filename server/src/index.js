import cors from "cors";
import express from "express";
import helmet from "helmet";
import routes from "./routes.js";
import { AppError } from "./utils/errors.js";

const app = express();
const port = process.env.PORT || 8080;

app.use(
  helmet({
    crossOriginResourcePolicy: false
  })
);
app.use(cors());
app.use("/api", routes);

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
