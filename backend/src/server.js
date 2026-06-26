require('dotenv').config();
require('express-async-errors');
const app    = require('./app');
const initDB = require('./config/initDB');

const PORT = process.env.PORT || 5000;

(async () => {
  await initDB();
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
  });
})();
