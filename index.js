const app = require('./app');
require('./config/dbConfig'); // Connect to MongoDB

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
