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
      console.log(data);
      // Sorting the jobs based on the dates only
      const sorted = [...data].sort(
        (a, b) => new Date(b.created_at) - new Date(a.created_at),
      );
      setJobs(sorted);
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
      body: JSON.stringify({
        company,
        role,
        status,
        applicationDate,
        notes,
      }),
    });
    // Response from the server/backend to frontend
    const newJob = await response.json();
    // checkin for error
    if (!response.ok) {
      console.log("Add function error:-", newJob);
      return alert(newJob?.error || "Failed to create job");
    }
    //Update the state with the new job added by user
    await fetchJobs(); // refresh from DB instead

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
    const response = await fetch(
      `http://localhost:5000/api/jobs/${editingId}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          company: editCompany,
          role: editRole,
          status: editStatus,
          applicationDate: editApplicationDate,
          notes: editNotes,
        }),
      },
    );
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
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto max-w-4xl p-6 space-y-6">
        {/* Header */}
        <div className="space-y-1">
          <h2 className="text-2xl font-bold">My Job Applications</h2>
          <p className="text-sm text-slate-600">
            Track, update and manage your applications.
          </p>
        </div>
        {/* Add the dropdown status menu bar only below */}
        <div className="rounded-2xl bg-white p-4 shadow-sm border flex items-center justify-between gap-4">
          {/* Create the dropdown menu */}
          <span className="text-sm font-medium">Filter by status</span>
          <select
            className="w-48 rounded-lg border p-2"
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
        </div>
        {/* Adding the job details below- Add,Edit/Update,Delete button */}
        {jobs.length === 0 ? (
          <div className="rounded-2xl bg-white p-6 shadow-sm border text-slate-600">
            No jobs found.
          </div>
        ) : (
          <div className="space-y-3">
            {/* For one item in the job only */}
            {jobs.map((job) => (
              <div
                key={job.id}
                className="rounded-2xl bg-white p-4 shadow-sm border"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    {/* Jobs display */}
                    <p className="font-semibold">{job.company}</p>
                    <p className="text-sm text-slate-600">{job.role}</p>
                    <p className="mt-2 inline-flex rounded-full bg-slate-100 px-2 py-1 text-xs font-semibold">
                      {job.status}
                    </p>
                  </div>
                  {/*Button of edit ann delete */}
                  <div className="flex gap-2">
                    <button
                      className="rounded-lg bg-slate-900 px-3 py-2 text-sm text-white hover:opacity-90"
                      onClick={() => startEdit(job)}
                    >
                      Edit
                    </button>
                    {/* Delete button */}
                    <button
                      className="rounded-lg bg-red-600 px-3 py-2 text-sm text-white hover:opacity-90"
                      onClick={() => handleDelete(job.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
                {/* Editing form below */}
                {editingId === job.id && (
                  <form
                    onSubmit={handleUpdateJob}
                    className="mt-4 grid gap-3 md:grid-cols-5"
                  >
                    <input
                      className="rounded-lg border p-2 md:col-span-1"
                      value={editCompany}
                      onChange={(e) => setEditCompany(e.target.value)}
                      placeholder="Company"
                    />
                    <input
                      className="rounded-lg border p-2 md:col-span-1"
                      value={editRole}
                      onChange={(e) => setEditRole(e.target.value)}
                      placeholder="Role"
                    />

                    <select
                      className="rounded-lg border p-2 md:col-span-1"
                      value={editStatus}
                      onChange={(e) => setEditStatus(e.target.value)}
                    >
                      <option>Applied</option>
                      <option>Interviewing</option>
                      <option>Rejected</option>
                      <option>Offer</option>
                    </select>

                    <input
                      className="rounded-lg border p-2 md:col-span-1"
                      type="date"
                      value={editApplicationDate}
                      onChange={(e) => setEditApplicationDate(e.target.value)}
                    />

                    <textarea
                      className="rounded-lg border p-2 md:col-span-4"
                      value={editNotes}
                      onChange={(e) => setEditNotes(e.target.value)}
                      placeholder="Notes"
                    />

                    <div className="md:col-span-5 flex gap-2">
                      <button
                        className="rounded-lg bg-emerald-600 px-4 py-2 text-sm text-white hover:opacity-90"
                        type="submit"
                      >
                        Save
                      </button>
                      <button
                        className="rounded-lg bg-slate-200 px-4 py-2 text-sm hover:opacity-90"
                        type="button"
                        onClick={cancelEdit}
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                )}
              </div>
            ))}
          </div>
        )}
        {/* Adding the add job functionality  below*/}
        <div className="rounded-2xl bg-white p-5 shadow-sm border">
          <h3 className="text-lg font-semibold">Add a job</h3>
          {/* Submit the form */}
          <form
            onSubmit={handleAddJob}
            className="mt-4 grid gap-3 md-grid-col-5"
          >
            <input
              className="rounded-lg borders p-2"
              placeholder="Company"
              // Get the value from the state
              value={company}
              // On the event of typing send the value to set and update the comapny state
              onChange={(e) => setCompany(e.target.value)}
            />
            <input
              className="rounded-lg borders p-2"
              placeholder="Role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            />
            <input
              className="rounded-lg borders p-2"
              type="date"
              value={applicationDate}
              onChange={(e) => setApplicationDate(e.target.value)}
            />
            {/* Create dropdown */}
            <select
              className="rounded-lg borders p-2"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option>Applied</option>
              <option>Interviewing</option>
              <option>Rejected</option>
              <option>Offer</option>
            </select>
            {/* Area for notes */}
            <textarea
              className="rounded-lg b-slate-900 px-4 py-2 text-black hover:opacity-90"
              placeholder="Notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
            <button className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 transition">
              Add Job
            </button>
          </form>
          {/* <div className="bg-red-500 text-white p-10">Tailwind Working</div> */}
        </div>
      </div>
    </div>
  );
}

export default App;
