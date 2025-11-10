import fs from "fs";
import path from "path";

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");

  try {
    const cwd = process.cwd();
    const filePath = path.join(cwd, "api", "moviesNames.json");

    // log everything useful
    console.log("🧭 process.cwd():", cwd);
    console.log("📄 Expected path:", filePath);
    console.log("📦 Exists?", fs.existsSync(filePath));
    console.log("📁 Directory listing:", fs.readdirSync(path.join(cwd, "api")));

    const data = fs.readFileSync(filePath, "utf-8");
    const parsed = JSON.parse(data);
    res.status(200).json(parsed.movies || parsed);
  } catch (err) {
    console.error("Error reading moviesNames.json:", err);
    res.status(500).json({ error: "Failed to load movie data" });
  }
}




