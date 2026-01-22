// Importing pool mutiple db connections to get the data from the db.
const { supabase } = require("./connections/supabase.js");
//import hashing pass package
const bcrypt = require("bcrypt");
const PORT = 5000;
// importing express lib
const express = require("express");
// middleware
const app = express();
// Applying the text to json converter to every request recived
app.use(express.json());

// Adding the routes and checking the server
app.get("/api/health", async (req, res) => {
  // Convert into the js object into js text
  const { data, error } = await supabase.from("users").select("*");

  res.json({ status: data });
});
// Add the post route for user signup/register
app.post("/api/register", async (req, res) => {
  // Get data from the frontend
  const name = req.body.name;
  const email = req.body.email;
  const password = req.body.password;
  //   condition to checkif any of the above is missing
  // Validate missing fields
  if (!name || !email || !password) {
    return res.status(400).json({ error: "All of the fields are required!!" });
  }
  // Dupicate Email checking:- //The data is the values that you want from db which is id
  const { data, error } = await supabase
    .from("users")
    .select("id")
    .eq("email", email); //Comparing the frontend email and the email in the db

  if (error) {
    return res.status(500).json({ message: " Server error" });
  }

  if (data.length > 0) {
    return res.status(409).json({ message: "Email already exists" });
  }
  //Hash the password
  const hashedPassword = await bcrypt.hash(password, 10);
  //Insert the new user if the email is not there in db
  const { insertData, insertError } = await supabase
    .from("users")
    .insert({ name, email, password_hash: hashedPassword });

  if (insertError) {
    return res.status(500).json({ message: "User creation failed" });
  }
  return res
    .status(201)
    .json({ message: "The user is saved perfectly fine !!!" });
});
// Server listening on ---
app.listen(PORT, () => console.log(`Server has started at ${PORT}`));
