import fs from "fs";
import path from "path";

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");

  try {
    const filePath = path.join(path.dirname(new URL(import.meta.url).pathname), "moviesNames.json");
    const data = fs.readFileSync(filePath, "utf-8");
    const parsed = JSON.parse(data);

    res.status(200).json({ movies: parsed.movies || parsed });
  } catch (err) {
    console.error(" Error reading moviesNames.json:", err.message);
    res.status(500).json({ error: "Failed to load movie data" });
  }
}




