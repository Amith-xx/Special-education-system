import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "./models/UserModel.js";
import Class from "./models/ClassModel.js";

dotenv.config();

const run = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to DB");

        console.log("\n--- TEACHERS ---");
        const teachers = await User.find({ role: "teacher" });
        teachers.forEach(t => {
            console.log(`Teacher: ${t.fullName} (${t.email}) ID: ${t._id}`);
        });

        if (teachers.length === 0) {
            console.log("No teachers found!");
        }

        console.log("\n--- CLASSES ---");
        const classes = await Class.find({});
        classes.forEach(c => {
            console.log(`Class: ${c.name} | TeacherID in Class: ${c.teacherId} (Type: ${typeof c.teacherId})`);
        });

        if (classes.length === 0) {
            console.log("No classes found!");
        }

        console.log("\n--- MATCHING CHECKS ---");
        for (const teacher of teachers) {
            const matches = await Class.find({ teacherId: teacher._id });
            console.log(`Teacher ${teacher.fullName} has ${matches.length} classes assigned.`);
            if (matches.length > 0) {
                matches.forEach(m => console.log(`  - ${m.name}`));
            }
        }

    } catch (err) {
        console.error("Error:", err);
    } finally {
        await mongoose.disconnect();
    }
};

run();
