// Import modules
const
    mongoose = require('mongoose'),
    dotenv = require('dotenv');

// Load environment variables
dotenv.config({ path: './config.env' });

// Connect to mongoDB cluster
mongoose
    .connect(process.env.DB_CONNECT, {
        useCreateIndex: true,
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false
    })
    .then(() => console.log('DB connection successful'));

// Import main express application
const app = require('./app');

// Set up the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Listening at port ${PORT}`));