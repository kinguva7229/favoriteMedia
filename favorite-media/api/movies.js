import fs from "fs";
import path from "path";

export default function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  try {

    const filePath = path.join(process.cwd(), "movies.json");

    if (!fs.existsSync(filePath)) {
      console.error("movies.json not found at:", filePath);
      return res.status(404).json({ error: "movies.json not found" });
    }

    const data = fs.readFileSync(filePath, "utf8");
    const parsed = JSON.parse(data);

    return res.status(200).json(parsed);
  } catch (err) {
    console.error("Error reading movies.json:", err);
    return res.status(500).json({ error: "Failed to load movie data" });
  }
}


