// const express = require('express');
// const app = express();
// const userRoutes = require('./routes/userRoutes');
// const chitFundRoutes = require('./routes/chitFundRoutes');
// const organizationRoutes = require('./routes/organizationRoutes');

// app.use(express.json());

// app.use('/api', userRoutes);
// app.use('/api', chitFundRoutes);
// app.use('/api', organizationRoutes);

// module.exports = app;


const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const connectDB = require('./config/dbConfig');
const app = express();

// Connect to database
connectDB();

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/organizations', require('./routes/organizationRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/chit-funds', require('./routes/chitFundRoutes'));
app.use('/api/transactions', require('./routes/transactionRoutes'));


// Start the server
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });

module.exports = app;
