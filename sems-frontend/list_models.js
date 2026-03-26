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
    process.exit(1);
}

const API_KEY = process.env.VITE_GEMINI_API_KEY;

if (!API_KEY) {
    console.error("❌ API Key not found in .env file!");
    process.exit(1);
}

console.log("Fetching available Gemini models...");

// Since the SDK doesn't expose a simple listModels method directly on the client instance in some versions,
// we'll try to use the model's info or just hit the REST API if needed, 
// but let's try a direct approach using the API key first with a fetch to the endpoint.

import https from 'https';

const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${API_KEY}`;

https.get(url, (res) => {
    let data = '';

    res.on('data', (chunk) => {
        data += chunk;
    });

    res.on('end', () => {
        try {
            const response = JSON.parse(data);
            if (response.error) {
                console.error("Error fetching models:", response.error.message);
                return;
            }

            if (!response.models) {
                console.log("No models found.");
                return;
            }

            console.log("\nAvailable Gemini Models:");
            console.log("--------------------------------------------------");
            response.models.forEach(model => {
                if (model.name.includes("gemini")) {
                    console.log(`Model: ${model.name.replace('models/', '')}`);
                    console.log(`Description: ${model.description}`);
                    console.log(`Supported Generation Methods: ${model.supportedGenerationMethods.join(", ")}`);
                    console.log("--------------------------------------------------");
                }
            });
        } catch (e) {
            console.error("Error parsing response:", e.message);
        }
    });

}).on('error', (err) => {
    console.error("Error with request:", err.message);
});
