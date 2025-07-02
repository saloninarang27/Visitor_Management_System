const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const resetPasswordRoutes = require('./routes/resetpassword');
const visitorRoutes = require('./routes/visitor');
const passesRoutes = require('./routes/passes');
const reportRoutes = require('./routes/report');
const dashboardRoutes = require('./routes/dashboard'); // ✅ NEW

const app = express();

app.use(cors());
app.use(express.json());

// Route handlers
app.use('/accounts', authRoutes);
app.use('/accounts', resetPasswordRoutes);
app.use('/visitor', visitorRoutes);
app.use('/passes', passesRoutes);
app.use('/report', reportRoutes);
app.use('/dashboard', dashboardRoutes); // ✅ NEW

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
