import fs from "fs";
import path from "path";

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");

  try {
    const filePath = path.join(process.cwd(), "movies.json");
    console.log("📁 process.cwd():", process.cwd());
    console.log("📄 Looking for:", filePath);
    console.log("📦 Exists?", fs.existsSync(filePath));

    const data = fs.readFileSync(filePath, "utf-8");
    const parsed = JSON.parse(data);
    res.status(200).json(parsed.movies);
  } catch (err) {
    console.error("Error reading movies.json:", err);
    res.status(500).json({ error: "Failed to load movie data" });
  }
}




