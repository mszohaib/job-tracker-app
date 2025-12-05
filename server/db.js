// laods the file and puts the varaibles in process.env
require("dotenv").config();
// Pool to maintain multiple connections for the database
const { Pool } = require("pg");
//Create pool object to manage connections
const pool = new Pool({
  host: process.env.PG_HOST,
  port: process.env.PG_PORT,
  user: process.env.PG_USER,
  password: process.env.PG_PASSWORD,
  database: process.env.PG_DATABASE,
});
// exports the pool object so other backend can use it for other db quireis
module.exports = pool;
// Create a function to initialize table if not exists
async function initDB() {
  // creating the table for the users and jobs as well
  try {
    await pool.query(`CREATE TABLE IF NOT EXISTS users(
      id SERIAL PRIMARY KEY,
      name varchar(50),
      email varchar(100) UNIQUE,
      password_hash TEXT,
      created_at TIMESTAMP DEFAULT NOW())`);
    // Creating the jobs table in db
    await pool.query(`CREATE TABLE IF NOT EXISTS jobs(
      id SERIAL PRIMARY KEY,
      //Create the user-id to match with the id in the users table if the person is same
      user_id INTEGER REFERENCES users(id),
      //The comapnay that you applied
      company TEXT,
      // For what role you applied
      title TEXT,
      // Job status
      status TEXT,
      application_date DATE,
      // Extra info 
      notes TEXT,
      created_at TIMESTAMP DEFAULT NOW()
      )`);
  } catch (error) {}
}
module.exports = { pool, initDB };
