import fs from "fs";
import path from "path";

export default async function handler(req, res) {
  res.setHeader("Cache-Control", "max-age=0, s-maxage=1800");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS,PATCH,DELETE,POST,PUT");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version"
  );

  try {
    const filePath = path.join(process.cwd(), "movies.json");
    const data = fs.readFileSync(filePath, "utf-8");
    const parsed = JSON.parse(data);
    res.status(200).json(parsed.movies);
  } catch (err) {
    console.error("Error reading movies.json:", err);
    res.status(500).json({ error: "Failed to load movie data" });
  }
}
