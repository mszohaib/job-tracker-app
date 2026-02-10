import { useEffect, useState } from "react";

function App() {
  // Use state hooks of reacts
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState("All");
  // State for creating the jobs on the ui
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [status, setStatus] = useState("Applied");
  const [applicationDate, setApplicationDate] = useState("");
  const [notes, setNotes] = useState("");

  // Getting the jobs function
  const fetchJobs = async () => {
    try {
      // To choose which url to call based on request
      const getJobs = "http://localhost:5000/api/jobs";
      const getStatusData = `http://localhost:5000/api/jobs?status=${encodeURIComponent(statusFilter)}`;
      // Get the data from the backend server
      const url = statusFilter === "All" ? getJobs : getStatusData;
      const response = await fetch(url);
      // To check the response
      if (!response.ok) {
        throw new Error("Failed to fetch jobs");
      }

      const data = await response.json();
      setJobs(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  // Creating the handle delete function
  const handleDelete = async (jobId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/jobs/${jobId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete job");
      }

      // Refresh jobs after successful delete
      fetchJobs();
    } catch (err) {
      alert(err.message);
    }
  };
  // Adding the add jobs function for the ui to add
  const handleAddJob = async (event) => {
    // Stops the page from reloading
    event.preventDefault();
    // Get response from server
    const response = await fetch("http://localhost:5000/api/jobs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stingify({
        company,
        role,
        status,
        applicationDate,
        notes,
      }),
    });
    // checkin for error
    if (!response.ok) return alert("Failed to create Jobs!");
    // Response from the server/backend to frontend
    const newJob = await response.json();
    //Update the state with the new job added by user
    setJobs((previousJobs) => [newJob, ...previousJobs]);
    // Clear the value for the other ones
    // clear form
    setCompany("");
    setRole("");
    setStatus("Applied");
    setApplicationDate("");
    setNotes("");
  };
  // Calling the function when the page loads when the status changes
  useEffect(() => {
    fetchJobs();
  }, [statusFilter]);

  if (loading) return <p>Loading jobs...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h2>My Job Applications</h2>
      {/* Add the dropdown status menu bar only below */}
      <label>
        {/* Create the dropdown menu */}
        Filter by status: {""}
        <select
          value={statusFilter}
          // e= event represents what the user clicked on then what to do next yeah
          onChange={(e) => {
            setLoading(true);
            setStatusFilter(e.target.value);
          }}
        >
          {/* Giving the opttions that the user needs and actually shows thats it */}
          <option value="All">All</option>
          <option value="Applied">Applied</option>
          <option value="Interviewing">Interviewing</option>
          <option value="Rejected">Rejected</option>
          <option value="Offer">Offer</option>
        </select>
      </label>
      {/* Adding the job details below */}
      {jobs.length === 0 ? (
        <p>No jobs found.</p>
      ) : (
        <ul>
          {jobs.map((job) => (
            <li key={job.id}>
              <strong>{job.company}</strong> — {job.role} ({job.status})
              <button className="delBtn" onClick={() => handleDelete(job.id)}>
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
      {/* Adding the add job functionality only below*/}
      <form onSubmit={handleAddJob}>
        <input
          placeholder="Company"
          // Get the value from the state
          value={company}
          // On the event of typing send the value to set and update the comapny state
          onChange={(e) => setCompany(e.target.value)}
        />
        <input
          placeholder="Role"
          value={role}
          onChange={(e) => setRole(e.target.value)}
        />
        <input
          type="date"
          value={applicationDate}
          onChange={(e) => setApplicationDate(e.target.value)}
        />
        {/* Create dropdown */}
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option>Applied</option>
          <option>Interviewing</option>
          <option>Rejected</option>
          <option>Offer</option>
        </select>
        {/* Area for notes */}
        <textarea
          placeholder="Notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
        <button>Add Job</button>
      </form>
    </div>
  );
}
export default App;
