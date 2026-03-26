
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/UserModel.js';
import Class from './models/ClassModel.js';

dotenv.config();

const run = async () => {
    try {
        console.log('Connecting...');
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to DB');

        const teachers = await User.find({ role: 'teacher' });
        console.log(`Found ${teachers.length} teachers`);

        const classes = await Class.find({});
        console.log(`Found ${classes.length} classes`);

        for (const t of teachers) {
            const count = await Class.countDocuments({ teacherId: t._id });
            console.log(`Teacher ${t.fullName} has ${count} classes`);
        }

    } catch (err) {
        console.error('Error:', err);
    } finally {
        await mongoose.disconnect();
        console.log('Disconnected');
    }
};
run();

