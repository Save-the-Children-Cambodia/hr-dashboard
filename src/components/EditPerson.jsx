import React, { useState, useEffect } from "react";
import ChevronDownIcon from "../assets/chevron-down.svg"
import ChevronUpIcon from "../assets/chevron-up.svg"

const formatDate = (dateString) => {
  if (!dateString) return '';
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
};

const EditPerson = () => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingPerson, setEditingPerson] = useState(null);
  const [newStaff, setNewStaff] = useState({
    staff_name: '',
    role: '',
    start_date: '',
    end_date: '',
    total_loe: ''
  });
  const [staffList, setStaffList] = useState([]);

  const projectOptions = [
    { id: 1, name: "FCF USAID" },
    { id: 2, name: "USAID DCA" },
  ];

  const handleEdit = (staff) => {
    setEditingPerson({
      id: staff.id,
      staff_name: staff.staff_name,
      role: staff.role,
      start_date: staff.start_date.split('T')[0],
      end_date: staff.end_date.split('T')[0],
      total_loe: staff.total_loe
    });
    setIsEditModalOpen(true);
  };

  const fetchStaffList = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/staff/list/');
      if (!response.ok) {
        throw new Error('Failed to fetch staff list');
      }
      const data = await response.json();
      setStaffList(data);
    } catch (error) {
      console.error('Error fetching staff list:', error);
    }
  };

  useEffect(() => {
    fetchStaffList();
  }, []);

  useEffect(() => {
    window.refreshStaffList = fetchStaffList;
    return () => {
      window.refreshStaffList = null;
    };
  }, []);

  const handleAddStaff = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:8000/api/staff/add/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newStaff)
      });

      if (!response.ok) {
        throw new Error('Failed to add staff');
      }

      const data = await response.json();
      console.log('Staff added successfully:', data);
      
      // Reset form and close modal
      setNewStaff({
        staff_name: '',
        role: '',
        start_date: '',
        end_date: '',
        total_loe: ''
      });
      setIsAddModalOpen(false);
      
      // Refresh the staff list
      fetchStaffList();
    } catch (error) {
      console.error('Error adding staff:', error);
    }
  };

  const handleDelete = async (staffId) => {
    if (window.confirm('Are you sure you want to delete this staff member?')) {
      try {
        const response = await fetch(`http://localhost:8000/api/staff/delete/${staffId}/`, {
          method: 'DELETE',
        });

        if (!response.ok) {
          throw new Error('Failed to delete staff');
        }

        // Refresh the staff list after successful deletion
        fetchStaffList();
      } catch (error) {
        console.error('Error deleting staff:', error);
      }
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:8000/api/staff/update/${editingPerson.id}/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editingPerson)
      });

      if (!response.ok) {
        throw new Error('Failed to update staff');
      }

      // Close modal and refresh list
      setIsEditModalOpen(false);
      fetchStaffList();
    } catch (error) {
      console.error('Error updating staff:', error);
    }
  };

  return (
    <div className="bg-white shadow-lg rounded-3xl p-8">
      <div className="flex justify-between items-center mb-5">
        <h1 className="text-2xl font-bold text-gray-900">Edit Person</h1>
        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center bg-indigo-500 px-4 py-2 rounded-md hover:bg-indigo-600"
        >
          <span className="text-white">Add New Staff</span>
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Staff Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Projects</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Start Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">End Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {staffList.map((staff) => (
              <tr key={staff.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-left whitespace-nowrap">{staff.staff_name}</td>
                <td className="px-6 py-4 text-left whitespace-nowrap">{staff.role}</td>
                <td className="px-6 py-4 text-left ">
                  <select 
                    className="block rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm"
                    defaultValue=""
                  >
                    {staff.projects && staff.projects.map((project, index) => (
                      <option key={index} value={project.id}>
                        {project.award_name}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="px-6 py-4 text-left whitespace-nowrap">{formatDate(staff.start_date)}</td>
                <td className="px-6 py-4 text-left whitespace-nowrap">{formatDate(staff.end_date)}</td>
                <td className="px-6 py-4 text-left whitespace-nowrap">
                  <button
                    onClick={() => handleEdit(staff)}
                    className="text-indigo-600 hover:text-indigo-900 mr-4"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(staff.id)}
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

      {/* Edit Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
          <div className="bg-white p-8 rounded-lg shadow-xl w-96">
            <h2 className="text-xl font-bold mb-4">Edit Staff</h2>
            <form onSubmit={handleUpdate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Project(s)</label>
                <select 
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  value={editingPerson.projects}
                  onChange={(e) => setEditingPerson({...editingPerson, projects: e.target.value})}
                >
                  <option value="">Select Project</option>
                  {projectOptions.map((project) => (
                    <option key={project.id} value={project.id}>
                      {project.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Role</label>
                <input 
                  type="text"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  value={editingPerson.role}
                  onChange={(e) => setEditingPerson({...editingPerson, role: e.target.value})}
                  placeholder="Enter role"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Start Date</label>
                <input 
                  type="date"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  value={editingPerson.start_date}
                  onChange={(e) => setEditingPerson({...editingPerson, start_date: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">End Date</label>
                <input 
                  type="date"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  value={editingPerson.end_date}
                  onChange={(e) => setEditingPerson({...editingPerson, end_date: e.target.value})}
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

      {/* Add Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
          <div className="bg-white p-8 rounded-lg shadow-xl w-96">
            <h2 className="text-xl font-bold mb-4">Add New Staff</h2>
            <form onSubmit={handleAddStaff} className="space-y-4">
              <div>
                <label className="block text-left text-sm font-medium text-gray-700">Staff Name</label>
                <input
                  type="text"
                  placeholder="Enter name"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  value={newStaff.staff_name}
                  onChange={(e) => setNewStaff({...newStaff, staff_name: e.target.value})}
                  required
                />
              </div>

              <div>
                <label className="block text-left text-sm font-medium text-gray-700">Role</label>
                <input 
                  type="text"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  value={newStaff.role}
                  onChange={(e) => setNewStaff({...newStaff, role: e.target.value})}
                  placeholder="Enter role"
                  required
                />
              </div>

              <div>
                <label className="block text-left text-sm font-medium text-gray-700">Start Date</label>
                <input 
                  type="date"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  value={newStaff.start_date}
                  onChange={(e) => setNewStaff({...newStaff, start_date: e.target.value})}
                  required
                />
              </div>

              <div>
                <label className="block text-left text-sm font-medium text-gray-700">End Date</label>
                <input 
                  type="date"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  value={newStaff.end_date}
                  onChange={(e) => setNewStaff({...newStaff, end_date: e.target.value})}
                  required
                />
              </div>

              <div>
                <label className="block text-left text-sm font-medium text-gray-700">Total LOE (%)</label>
                <input 
                  type="number"
                  min="0"
                  max="100"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  value={newStaff.total_loe}
                  onChange={(e) => setNewStaff({...newStaff, total_loe: e.target.value})}
                  required
                />
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="bg-gray-200 px-4 py-2 rounded-md hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
                >
                  Add Staff
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditPerson; 