const mongoose = require('mongoose');

const connectDB = async () => {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: true,
        useUnifiedTopology: true
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`.italic.brightMagenta);
}

module.exports = connectDB;