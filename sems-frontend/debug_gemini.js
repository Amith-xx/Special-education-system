import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

// Load env vars
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const envPath = path.join(__dirname, ".env");

if (fs.existsSync(envPath)) {
    dotenv.config({ path: envPath });
} else {
    console.log("No .env file found at:", envPath);
}

const API_KEY = process.env.VITE_GEMINI_API_KEY;

console.log("Checking API Key...");
if (!API_KEY) {
    console.error("❌ API Key not found in .env file!");
    process.exit(1);
} else {
    console.log("✅ API Key found (starts with: " + API_KEY.substring(0, 5) + "...)");
}

async function listModels() {
    const genAI = new GoogleGenerativeAI(API_KEY);
    console.log("Testing generation with model: gemini-2.0-flash-lite");

    try {
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-lite" });
        const result = await model.generateContent("Hello, are you working?");
        const response = await result.response;
        console.log("✅ Success! Response:", response.text());
    } catch (error) {
        console.error("❌ Error testing gemini-2.0-flash-lite:", error.message);

        console.log("\nTrying fallback model: gemini-1.5-flash");
        try {
            const modelPro = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
            const resultPro = await modelPro.generateContent("Hello, are you working?");
            const responsePro = await resultPro.response;
            console.log("✅ Success with gemini-1.5-flash! Response:", responsePro.text());
        } catch (errPro) {
            console.error("❌ Error testing gemini-pro:", errPro.message);
        }
    }
}

listModels();
