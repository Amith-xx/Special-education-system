import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const logFile = path.resolve(__dirname, '../debug_log.txt');

function log(msg) {
    fs.appendFileSync(logFile, msg + '\n');
    console.log(msg);
}

log("Script started");

const envPath = path.resolve(__dirname, '../.env');
log(`Loading .env from: ${envPath}`);
dotenv.config({ path: envPath });

const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
    log("MONGO_URI is missing!");
    process.exit(1);
}

log("Connecting to DB...");

import Class from "../models/ClassModel.js";
import User from "../models/UserModel.js";

mongoose.connect(MONGO_URI)
    .then(async () => {
        log("DB connected successfully.");
        await debug();
        log("Done.");
        mongoose.connection.close();
    })
    .catch(err => {
        log(`DB Connection Error: ${err}`);
        process.exit(1);
    });

async function debug() {
    try {
        const teachers = await User.find({ role: "teacher" });
        log(`Found ${teachers.length} teachers.`);

        for (const teacher of teachers) {
            log(`\nTeacher: ${teacher.fullName} (ID: ${teacher._id})`);

            const classes = await Class.find({ teacherId: teacher._id });
            log(`  Classes (ObjectId): ${classes.length}`);

            if (classes.length === 0) {
                log("  No classes found for this teacher.");
                // Debug first class found in DB
                const any = await Class.findOne();
                if (any) {
                    const anyTeacherId = any.teacherId;
                    log(`  Sample class ID: ${any._id}`);
                    log(`  Sample teacherId: ${anyTeacherId} (Type: ${typeof anyTeacherId})`);
                    if (anyTeacherId) {
                        log(`  String comparison: ${anyTeacherId.toString()} === ${teacher._id.toString()} ? ${anyTeacherId.toString() === teacher._id.toString()}`);
                    }
                } else {
                    log("  DB is empty of classes.");
                }
            }
        }
    } catch (error) {
        log(`Error in debug: ${error}`);
    }
}
