import { useEffect, useState } from "react";

function App() {
  // Use state hooks of reacts
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState("All");

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
    </div>
  );
}
export default App;
