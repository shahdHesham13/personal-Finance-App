const mongoose = require('mongoose');

const connect = async () => {
    try {
        mongoose.set('strictQuery', true); // Suppress strictQuery warning
        console.log('Attempting to connect ');
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to the database');
    } catch (error) {
        console.log("Failed to connect to the database:", error.message);
        process.exit(1);
    }
};

module.exports = connect;