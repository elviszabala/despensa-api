const { neon } = require('@neondatabase/serverless');
const dotenv = require('dotenv');
dotenv.config();

const sql = neon(process.env.DATABASE_URL);

module.exports = sql;
// Export the Neon SQL client for use in other parts of the application
// This allows you to use the sql client to run queries against your Neon database
// Make sure to set the DATABASE_URL environment variable in your .env file