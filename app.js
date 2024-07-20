const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const connectDB = require('./config/db');
const errorHandler = require('./middlewares/errorHandler');
const logger = require('./config/logger');

// Load environment variables
dotenv.config();

// Connect to database
connectDB();

// Initialize Express
const app = express();

// Middleware
app.use(bodyParser.json());

// Routes
const paymentRoutes = require('./routes/payments');
app.use('/payments', paymentRoutes);

// Swagger setup
const swaggerOptions = {
    swaggerDefinition: {
        
        info: {
            title: 'Payment Service API',
            version: '1.0.0',
            description: 'API documentation for Payment Service',
        },
    },
    apis: ['./routes/*.js'],
};
const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Error handling middleware
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    logger.info(`Server is running on port ${PORT}`);
});
