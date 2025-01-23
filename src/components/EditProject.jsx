import React, { useState, useEffect } from "react";

const EditProject = () => {
  const [projects, setProjects] = useState([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState({
    award_name: '',
    status: '',
    project_start_date: '',
    project_end_date: '',
    staff: []
  });

  const handleEdit = (project) => {
    setEditingProject({
      id: project.id || '',
      award_name: project.award_name || '',
      status: project.status || '',
      project_start_date: project.project_start_date ? project.project_start_date.split('T')[0] : '',
      project_end_date: project.project_end_date ? project.project_end_date.split('T')[0] : '',
      staff: project.staff || []
    });
    setIsEditModalOpen(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:8000/api/projects/${editingProject.id}/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editingProject)
      });

      if (!response.ok) {
        throw new Error('Failed to update project');
      }

      setIsEditModalOpen(false);
      fetchProjectList();
    } catch (error) {
      console.error('Error updating project:', error);
    }
  };

  const fetchProjectList = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/projects/');
      if (!response.ok) {
        throw new Error('Failed to fetch projects');
      }
      const data = await response.json();
      setProjects(data);
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  };

  const handleDelete = async (projectId) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      try {
        const response = await fetch(`http://localhost:8000/api/projects/${projectId}/`, {
          method: 'DELETE',
        });

        if (!response.ok) {
          throw new Error('Failed to delete project');
        }

        // Refresh the projects list after successful deletion
        fetchProjectList();
      } catch (error) {
        console.error('Error deleting project:', error);
      }
    }
  };

  useEffect(() => {
    fetchProjectList();
    window.refreshProjectList = fetchProjectList;
    return () => {
      window.refreshProjectList = null;
    };
  }, []);

  return (
    <div className="bg-white shadow-lg rounded-3xl p-8">
      <h1 className="text-left text-2xl font-bold text-gray-900 mb-5">Edit Project</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Staff Name (s)</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Project</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status of Award</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Start Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">End Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {projects.map((project) => (
              <tr key={project.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-left whitespace-nowrap">{project.id}</td>
                <td className="px-6 py-4 text-left whitespace-nowrap">
                  {/* Add an endpoint to fetch staff for this project */}
                  <select className="py-2 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 border-none">
                    {project.staff && project.staff.map((staff) => (
                      <option key={staff.id} value={staff.id}>
                        {staff.staff_name}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="px-6 py-4 text-left whitespace-nowrap">{project.award_name}</td>
                <td className="px-6 py-4 text-left whitespace-nowrap">{project.status}</td>
                <td className="px-6 py-4 text-left whitespace-nowrap">{new Date(project.project_start_date).toLocaleDateString()}</td>
                <td className="px-6 py-4 text-left whitespace-nowrap">{new Date(project.project_end_date).toLocaleDateString()}</td>
                <td className="px-6 py-4 whitespace-nowrap flex gap-2">
                  <button 
                    onClick={() => handleEdit(project)}
                    className="bg-indigo-100 hover:bg-indigo-200 inline-flex items-center justify-center w-8 h-8 rounded-full"
                    title="Edit Staff"
                  >
                    <svg width="8" height="8" viewBox="0 0 8 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" clipRule="evenodd" d="M3.1286 7.26743L6.72982 2.61036C6.92554 2.35922 6.99513 2.06887 6.92989 1.77323C6.87335 1.50447 6.70808 1.24893 6.46016 1.05507L5.85561 0.574821C5.32934 0.156257 4.67695 0.200317 4.30291 0.680563L3.89842 1.20531C3.84623 1.27096 3.85928 1.36789 3.92452 1.42076C3.92452 1.42076 4.94661 2.24026 4.96835 2.25789C5.03794 2.32398 5.09013 2.41209 5.10318 2.51784C5.12493 2.72492 4.9814 2.91878 4.76828 2.94521C4.66825 2.95843 4.57257 2.92759 4.50298 2.87031L3.4287 2.01556C3.37651 1.97635 3.29822 1.98472 3.25473 2.03759L0.701682 5.34204C0.536408 5.54912 0.479867 5.81788 0.536408 6.07783L0.862606 7.49213C0.880003 7.56703 0.945243 7.6199 1.02353 7.6199L2.4588 7.60228C2.71976 7.59788 2.96332 7.47892 3.1286 7.26743ZM5.1383 6.82692H7.47866C7.707 6.82692 7.89271 7.01505 7.89271 7.24636C7.89271 7.47811 7.707 7.6658 7.47866 7.6658H5.1383C4.90996 7.6658 4.72424 7.47811 4.72424 7.24636C4.72424 7.01505 4.90996 6.82692 5.1383 6.82692Z" fill="#5D5FEF"/>
                    </svg>
                  </button>
                  <button 
                    onClick={() => handleDelete(project)}
                    className="bg-red-100 hover:bg-red-200 inline-flex items-center justify-center w-8 h-8 rounded-full"
                    title="Delete Staff"
                  >
                    <svg width="9" height="10" viewBox="0 0 9 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" clipRule="evenodd" d="M8.38402 1.89467C8.56738 1.89467 8.72003 2.04692 8.72003 2.24064V2.41974C8.72003 2.60875 8.56738 2.76571 8.38402 2.76571H0.57231C0.388489 2.76571 0.23584 2.60875 0.23584 2.41974V2.24064C0.23584 2.04692 0.388489 1.89467 0.57231 1.89467H1.94661C2.22578 1.89467 2.46874 1.69624 2.53154 1.41626L2.60351 1.09481C2.71536 0.656936 3.08346 0.366119 3.50474 0.366119H5.45113C5.86783 0.366119 6.24005 0.656936 6.34778 1.07171L6.42479 1.41579C6.48713 1.69624 6.73009 1.89467 7.00972 1.89467H8.38402ZM7.68584 8.44223C7.82932 7.10504 8.08053 3.92821 8.08053 3.89616C8.0897 3.79906 8.05807 3.70715 7.99527 3.63315C7.92788 3.56386 7.84262 3.52286 7.74864 3.52286H1.21085C1.11641 3.52286 1.02657 3.56386 0.964223 3.63315C0.900963 3.70715 0.869792 3.79906 0.874376 3.89616C0.875218 3.90205 0.884232 4.01395 0.899302 4.20103C0.966247 5.03213 1.1527 7.34689 1.27319 8.44223C1.35845 9.24916 1.88791 9.75632 2.65483 9.7747C3.24663 9.78837 3.85631 9.79308 4.47974 9.79308C5.06696 9.79308 5.66335 9.78837 6.27349 9.7747C7.06699 9.76103 7.59599 9.26283 7.68584 8.44223Z" fill="#FF0000"/>
                    </svg>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isEditModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
          <div className="bg-white p-8 rounded-lg shadow-xl w-96">
            <h2 className="text-xl font-bold mb-4">Edit Project</h2>
            <form onSubmit={handleUpdate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Project Name</label>
                <input 
                  type="text"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  value={editingProject.award_name}
                  onChange={(e) => setEditingProject({...editingProject, award_name: e.target.value})}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Status</label>
                <select 
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  value={editingProject.status}
                  onChange={(e) => setEditingProject({...editingProject, status: e.target.value})}
                  required
                >
                  <option value="">Select Status</option>
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                  <option value="Pending">Pending</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Start Date</label>
                <input 
                  type="date"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  value={editingProject.project_start_date}
                  onChange={(e) => setEditingProject({...editingProject, project_start_date: e.target.value})}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">End Date</label>
                <input 
                  type="date"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  value={editingProject.project_end_date}
                  onChange={(e) => setEditingProject({...editingProject, project_end_date: e.target.value})}
                  required
                />
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="bg-gray-200 px-4 py-2 rounded-md hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditProject; 