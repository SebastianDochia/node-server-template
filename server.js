const express = require('express');
const dotenv = require('dotenv');
const colors = require('colors')
const morgan = require('morgan');
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');
const xss = require('xss-clean');
const rateLimit = require('express-rate-limit');
const hpp = require('hpp');
const cors = require('cors');
const coockieParser = require('cookie-parser');
const errorHandler = require('./middleware/error');
const connectDB = require('./config/db');

// Load env vars
dotenv.config({ path: './config/config.env' });

// Connect to database
connectDB();

// Route files
const workspaces = require('./routes/workspaces');
const auth = require('./routes/auth');
const user = require('./routes/user');

const app = express();

// Body parser
app.use(express.json());

// Cookie Parser
app.use(coockieParser());

// Dev logging middleware
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// Sanitize data
app.use(mongoSanitize());

// Set security headers
app.use(helmet());

// Prevent cross-site scripting attacks
app.use(xss());

// Rate limiting
const limiter = rateLimit({
    windowMs: 10 * 60 * 1000,
    max: 1000
});
app.use(limiter);

// Prevent http param pollution
app.use(hpp());

// Enable CORS
app.use(cors());

// Mount routers
app.use('/api/v1/workspaces', workspaces);
app.use('/api/v1/auth', auth);
app.use('/api/v1/user', user);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.brightBlue.bold));

// Handle unhandled promise rejections
process.on('unhadledRejection', (err, promise) => {
    console.log(`Error: ${err.message}`.red.italic);
    //Close server & exit process
    server.close(() => process.exit(1));
})
