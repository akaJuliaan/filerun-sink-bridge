import express, { Express, Request, Response } from "express";
import { customAlphabet } from "nanoid";
import dotenv from "dotenv";

dotenv.config();

// Validate essential environment variables at startup
const PORT = process.env.PORT || 3000;
const SLUG_LENGTH = parseInt(process.env.SLUG_LENGTH || "6");
const SINK_URL = process.env.SINK_URL;

if (!PORT || !SINK_URL) {
  throw new Error("Missing required environment variables: PORT, SINK_URL");
}

const app: Express = express();

// Initialize nanoid function
const nanoid = customAlphabet("23456789abcdefghjkmnpqrstuvwxyz", SLUG_LENGTH);

// Root route
app.get("/", (_, res: Response) => {
  res.json({ message: "API is working!" });
});

// Short URL creation route
app.all("/short", async (req: Request<unknown, unknown, unknown, { url?: string; token?: string }>, res: Response) => {
  const { url: longUrl, token } = req.query;

  if (!longUrl) {
    res.status(400).json({ error: "Missing 'url' query parameter" });
    return;
  }

  if (!token) {
    res.status(400).json({ error: "Missing 'token' query parameter" });
    return;
  }

  try {
    const response = await fetch(`${SINK_URL}/api/link/create`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        url: longUrl,
        slug: nanoid(),
      }),
    });

    if (!response.ok) {
      res.status(response.status).json({ error: "Failed to create short link" });
      return;
    }

    const result = await response.json();
    res.status(200).send(result.shortLink);
  } catch (error) {
    console.error("Error creating short link:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`[server]: Server is running on port ${PORT}`);
});
