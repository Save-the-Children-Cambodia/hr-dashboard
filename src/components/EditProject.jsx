import React, { useState, useEffect } from "react";

const EditProject = () => {
  const [projects, setProjects] = useState([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState({
    award_name: '',
    status: '',
    project_start_date: '',
    project_end_date: '',
    loe_percentage: '',
    staff: []
  });

  const handleEdit = (project) => {
    setEditingProject({
      id: project.id || '',
      award_name: project.award_name || '',
      status: project.status || '',
      project_start_date: project.project_start_date ? project.project_start_date.split('T')[0] : '',
      project_end_date: project.project_end_date ? project.project_end_date.split('T')[0] : '',
      loe_percentage: project.loe_percentage || '',
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
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">LOE %</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {projects.map((project) => (
              <tr key={project.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">{project.id}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {/* Add an endpoint to fetch staff for this project */}
                  <select className="py-2 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 border-none">
                    {project.staff && project.staff.map((staff) => (
                      <option key={staff.id} value={staff.id}>
                        {staff.staff_name}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">{project.award_name}</td>
                <td className="px-6 py-4 whitespace-nowrap">{project.status}</td>
                <td className="px-6 py-4 whitespace-nowrap">{new Date(project.project_start_date).toLocaleDateString()}</td>
                <td className="px-6 py-4 whitespace-nowrap">{new Date(project.project_end_date).toLocaleDateString()}</td>
                <td className="px-6 py-4 whitespace-nowrap">{project.loe_percentage}%</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button
                    onClick={() => handleEdit(project)}
                    className="text-indigo-600 hover:text-indigo-900 mr-4"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(project.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    Delete
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

              <div>
                <label className="block text-sm font-medium text-gray-700">LOE Percentage</label>
                <input 
                  type="number"
                  min="0"
                  max="100"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  value={editingProject.loe_percentage}
                  onChange={(e) => setEditingProject({...editingProject, loe_percentage: e.target.value})}
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