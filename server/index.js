// Importing pool mutiple db connections to get the data from the db.
const { supabase } = require("./connections/supabase.js");
//import hashing pass packagen
const bcrypt = require("bcrypt");
const PORT = 5000;
// importing express lib
const express = require("express");
// Adding the backend to connect with front cors
const cors = require("cors");
// middlewares
const app = express();
// Applying CORS middleware
app.use(cors());
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
// User Login Route
// Server listening on ---
app.post("/api/login", async (req, res) => {
  // Requsting names
  const email = req.body.email;
  const password = req.body.password;
  //Check email and pass
  if (!email || !password) {
    return res.status(400).json({ message: "Missing Fields" });
  }
  // find user in db by email
  const { data, error } = await supabase
    .from("users")
    .select("id,email, password_hash")
    .eq("email", email);

  if (error) {
    return res.status(500).json({ message: `There is an error ${error}` });
  }
  if (data.length === 0) {
    return res.status(401).json({ message: "Invalid credentials!" });
  }
  //Compare the passwords with hash passwords
  const isMatch = await bcrypt.compare(password, data[0].password_hash);
  !isMatch
    ? res.status(401).json({ message: "invalid credentials" })
    : res.status(200).json({ message: "Login success" });
});
//Create Jobs api Route
app.post("/api/jobs", async (req, res) => {
  // Get the req.body details
  const { company, role, status, applicationDate, notes } = req.body;
  //Check for field missing
  if (!company || !role || !status) {
    return res.status(500).json({ error: "Missing Field" });
  }
  // Insert the job details only into the database
  try {
    const { data, error } = await supabase
      .from("jobs")
      .insert({ company, role, status, applicationDate, notes });
    if (error) {
      return res.status(400).json({ error: error.message });
    }
    return res
      .status(200)
      .json({ message: "Job created Successfully!,Check db" });
  } catch (error) {
    return res.status(500).json({ error: "Server Error" });
  }
});
// Updating the jobs if there any changes in it
app.put("/api/jobs/:id", async (req, res) => {
  // Get the inputs
  const { company, role, status, applicationDate, notes } = req.body;
  const jobsId = req.params.id;
  // Validate the inputs we get form client
  if (!company || !role || !status) {
    return res.status(400).json({ error: "Missing fields" });
  }
  // Query the supabase for updating it
  try {
    const { data, error } = await supabase
      .from("jobs")
      .update({ company, role, status, applicationDate, notes })
      .eq("id", jobsId)
      .select();
    if (!data || data.length === 0) {
      return res.status(404).json({ error: "No Matching Id." });
    }
    return res.status(200).json({ message: "Job updated sucessfully", data });
  } catch (error) {
    return res.status(500).json({ error: "Error" });
  }
});
// Creating the Delete route api
app.delete("/api/jobs/:id", async (req, res) => {
  //Get the id from th url user entered
  const jobId = req.params.id;
  if (!jobId) {
    return res.status(400).json({ error: "Missing the Job Id" });
  }
  try {
    // Run the query in the try method if a server crash happens its responds and only delete what the user said it
    const { data, error } = await supabase
      .from("jobs")
      .delete()
      .eq("id", jobId)
      .select();
    if (error) {
      return res.status(500).json({ error: "There is an error", error });
    }
    // To see if data is empty or not
    if (!data || data.length === 0) {
      return res.status(404).json({ error: "Job ID not found to be deleted!" });
    }
    // if success
    return res
      .status(200)
      .json({ message: "This is what has been deleted:- ", data });
  } catch (error) {
    return res.status(500).json({ error: "There is an error", error });
  }
});
//Adding the filtering job status and give only active jobs
app.get("/api/jobs", async (req, res) => {
  const { status } = req.query;
  try {
    // Get all the jobs first from the db
    let query = supabase.from("jobs").select("*");
    // If there is status applied
    if (status) {
      query = query.eq("status", status);
    }
    // Query execuetion time below
    const { data, error } = await query;
    // if any error here
    if (error) {
      console.log("Supabase error:", error);
      return res.status(500).json({ error: "Server Error" });
    }
    // Returning the data filtered/unfiletered data
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ error: "Server Error", error });
  }
});
app.listen(PORT, () => console.log(`Server has started at ${PORT}`));
