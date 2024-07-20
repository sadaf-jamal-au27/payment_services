const mongoose = require('mongoose');
const logger = require('./logger');

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI, {
           
        });
        logger.info('Database is successfully connected...');
    } catch (err) {
        logger.error(err.message);
        process.exit(1);
    }
};

module.exports = connectDB;
