const express = require('express');
const bodyParser = require('body-parser');
const videoRoutes = require('./Routes/videoRoute');
const linkRoutes = require('./Routes/linkRoute');
const { authenticateToken } = require('./middlewares/auth');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./config/swagger.js');
const db = require('./config/db');
const setupSwagger = require('./config/swagger');
const sequelize = require('./config/db');
require('dotenv').config();


const app = express();

app.use(bodyParser.json());

// Swagger API Docs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Middleware to authenticate all API requests
app.use(authenticateToken);

// setupSwagger(app);

// Routes
app.use('/videos', videoRoutes);
app.use('/links', linkRoutes);

const PORT = process.env.PORT || 3000;
sequelize.sync({ force: false }).then(() => {
  console.log('Database & tables created!');
  app.listen(3000, () => {
    console.log('Server is running on port 3000');
  });
}).catch(error => {
  console.error('Unable to create tables:', error);
});

