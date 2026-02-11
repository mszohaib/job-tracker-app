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
  // Create states for the Update jobs
  const [editingId, setEditingId] = useState(null);
  const [editCompany, setEditCompany] = useState("");
  const [editRole, setEditRole] = useState("");
  const [editStatus, setEditStatus] = useState("Applied");
  const [editApplicationDate, setEditApplicationDate] = useState("");
  const [editNotes, setEditNotes] = useState("");

  // Getting the jobs function
  const fetchJobs = async () => {
    setLoading(true);
    setError("");
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
  // Create the update for the jobs functions
  // Start edit function which sees which job to edit in short
  const startEdit = (job) => {
    // Put all the value to store the current jobs details
    setEditingId(job.id);
    setEditCompany(job.company);
    setEditRole(job.role);
    setEditStatus(job.status);
    setEditApplicationDate(job.applicationDate?.slice(0, 10) || "");
    setEditNotes(job.notes || "");
  };
  // Saving the jobs details
  const handleUpdateJob = async (event) => {
    // Stop refershing from changing the data itself
    event.preventDefault();
    // Get the response from backend
    const response = fetch(`http://localhost:5000/api/jobs/${editingId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        company: editCompany,
        role: editRole,
        status: editStatus,
        applicationDate: editApplicationDate,
        notes: editNotes,
      }),
    });
    if (!response.ok) {
      alert("Update failed");
      return;
    }
    // Get the data from the backend for using it in the frontend
    const updatedJob = await response.json();
    //Getting the prev data from state and matching it with the id from the user to edit
    setJobs((prev) =>
      prev.map((job) => (job.id === editingId ? updatedJob : job)),
    );
    setEditingId(null);
  };
  // Set the cance button to remove the edit button
  const cancelEdit = () => {
    setEditingId(null);
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
      {/* Adding the job details below- Add,Edit/Update,Delete button */}
      {jobs.length === 0 ? (
        <p>No jobs found.</p>
      ) : (
        <ul>
          {/* For one item in the job only */}
          {jobs.map((job) => (
            <li key={job.id}>
              {/* Jobs display */}
              <strong>{job.company}</strong> — {job.role} ({job.status})
              {/* Delete button */}
              <button className="delBtn" onClick={() => handleDelete(job.id)}>
                Delete
              </button>
              {/* Update UI */}
              <button onClick={() => startEdit(job)}>Edit</button>
              {editingId === job.id && (
                <form onSubmit={handleUpdateJob} style={{ marginTop: "10px" }}>
                  <input
                    value={editCompany}
                    onChange={(e) => setEditCompany(e.target.value)}
                  />

                  <input
                    value={editRole}
                    onChange={(e) => setEditRole(e.target.value)}
                  />

                  <select
                    value={editStatus}
                    onChange={(e) => setEditStatus(e.target.value)}
                  >
                    <option>Applied</option>
                    <option>Interviewing</option>
                    <option>Rejected</option>
                    <option>Offer</option>
                  </select>

                  <input
                    type="date"
                    value={editApplicationDate}
                    onChange={(e) => setEditApplicationDate(e.target.value)}
                  />

                  <textarea
                    value={editNotes}
                    onChange={(e) => setEditNotes(e.target.value)}
                  />

                  <button type="submit">Save</button>
                  <button type="button" onClick={cancelEdit}>
                    Cancel
                  </button>
                </form>
              )}
            </li>
          ))}
        </ul>
      )}
      {/* Adding the add job functionality  below*/}
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
