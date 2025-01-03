import React, { useState, useEffect } from "react";

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

  const roleOptions = [
    "REALM Manager",
    "Research",
    "Evuation Specialist",
    "MEAL Coordinator",
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
          <svg className="icon-toolbar" version="1.0" xmlns="http://www.w3.org/2000/svg"
  viewBox="0 0 512.000000 512.000000"
  preserveAspectRatio="xMidYMid meet">

  <g transform="translate(0.000000,512.000000) scale(0.100000,-0.100000)"
  fill="#FFFFFF" stroke="none">
  <path d="M2055 5105 c-464 -64 -756 -344 -841 -808 -25 -135 -23 -383 5 -557
  95 -593 308 -964 646 -1126 141 -68 194 -79 385 -79 175 0 227 9 352 59 193
  78 375 261 493 495 121 243 202 587 212 906 11 366 -76 630 -276 838 -214 223
  -585 326 -976 272z"/>
  <path d="M1310 2595 c-52 -23 -162 -66 -245 -94 -82 -29 -188 -71 -235 -93
  -161 -77 -271 -221 -348 -453 -111 -337 -216 -1168 -160 -1270 24 -44 56 -71
  118 -98 272 -120 856 -252 1385 -314 245 -28 776 -21 957 13 l27 5 -25 41
  c-44 69 -100 189 -128 271 -84 252 -79 555 14 808 173 475 639 809 1128 809
  50 0 92 4 92 9 0 15 -91 104 -143 140 -58 40 -147 77 -336 142 -80 28 -184 68
  -233 91 l-88 41 -69 -66 c-222 -209 -490 -306 -816 -294 -284 10 -516 105
  -727 296 -36 34 -68 61 -70 60 -1 -1 -46 -20 -98 -44z"/>
  <path d="M3716 1969 c-409 -47 -741 -338 -843 -739 -122 -480 129 -970 595
  -1160 435 -177 951 -4 1201 401 101 164 144 319 144 519 0 150 -19 247 -73
  378 -52 124 -117 220 -214 317 -164 164 -368 261 -596 285 -112 11 -114 11
  -214 -1z m171 -390 c38 -14 83 -57 99 -96 10 -23 14 -77 14 -178 l0 -145 138
  0 c165 0 199 -8 245 -60 77 -84 54 -210 -45 -259 -39 -18 -62 -21 -191 -21
  l-147 0 0 -147 c0 -166 -14 -213 -73 -255 -47 -33 -148 -33 -196 1 -58 42 -71
  85 -71 254 l0 147 -150 0 c-130 0 -156 3 -190 20 -83 42 -115 148 -69 230 42
  74 71 85 252 88 l157 4 0 147 c0 135 2 152 23 191 38 73 129 108 204 79z"/>
  </g>
          </svg>
          <span className="pl-2 text-white">Add New Staff</span>
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">ID</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Staff Name</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Project (s)</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Role</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Start Date</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">End Date</th>
              <th className="px-6 py-3 text-sm font-medium text-gray-500 uppercase tracking-wider">Total LOE</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Action</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {staffList.map((staff) => (
              <tr key={staff.id}>
                <td className="text-left text-sm px-6 py-4 whitespace-nowrap">{staff.id}</td>  
                <td className="text-left text-sm px-6 py-4 whitespace-nowrap">{staff.staff_name}</td>
                <td className="text-left text-sm px-6 py-4 whitespace-nowrap">
                  <select 
                    className="px-1 py-2 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 border-none"
                    value={staff.projects || ""}
                  >
                    <option value="">Select Project</option>
                    {projectOptions.map((project) => (
                      <option key={project.id} value={project.id}>
                        {project.name}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="text-left text-sm px-6 py-4 whitespace-nowrap">{staff.role}</td>
                <td className="text-left text-sm px-6 py-4 whitespace-nowrap">{formatDate(staff.start_date)}</td>
                <td className="text-left text-sm px-6 py-4 whitespace-nowrap">{formatDate(staff.end_date)}</td>
                <td className="text-sm py-4 whitespace-nowrap">{staff.total_loe}%</td>
                <td className="text-left px-6 py-4 whitespace-nowrap gap-2 flex">
                  <button 
                    onClick={() => handleEdit(staff)}
                    className="bg-indigo-100 hover:bg-indigo-200 inline-flex items-center justify-center w-8 h-8 rounded-full"
                    title="Edit Staff"
                  >
                    <svg width="8" height="8" viewBox="0 0 8 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" clipRule="evenodd" d="M3.1286 7.26743L6.72982 2.61036C6.92554 2.35922 6.99513 2.06887 6.92989 1.77323C6.87335 1.50447 6.70808 1.24893 6.46016 1.05507L5.85561 0.574821C5.32934 0.156257 4.67695 0.200317 4.30291 0.680563L3.89842 1.20531C3.84623 1.27096 3.85928 1.36789 3.92452 1.42076C3.92452 1.42076 4.94661 2.24026 4.96835 2.25789C5.03794 2.32398 5.09013 2.41209 5.10318 2.51784C5.12493 2.72492 4.9814 2.91878 4.76828 2.94521C4.66825 2.95843 4.57257 2.92759 4.50298 2.87031L3.4287 2.01556C3.37651 1.97635 3.29822 1.98472 3.25473 2.03759L0.701682 5.34204C0.536408 5.54912 0.479867 5.81788 0.536408 6.07783L0.862606 7.49213C0.880003 7.56703 0.945243 7.6199 1.02353 7.6199L2.4588 7.60228C2.71976 7.59788 2.96332 7.47892 3.1286 7.26743ZM5.1383 6.82692H7.47866C7.707 6.82692 7.89271 7.01505 7.89271 7.24636C7.89271 7.47811 7.707 7.6658 7.47866 7.6658H5.1383C4.90996 7.6658 4.72424 7.47811 4.72424 7.24636C4.72424 7.01505 4.90996 6.82692 5.1383 6.82692Z" fill="#5D5FEF"/>
                    </svg>
                  </button>
                  <button 
                    onClick={() => handleDelete(staff.id)}
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
                <select 
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  value={editingPerson.role}
                  onChange={(e) => setEditingPerson({...editingPerson, role: e.target.value})}
                >
                  <option value="">Select Role</option>
                  {roleOptions.map((role) => (
                    <option key={role} value={role}>
                      {role}
                    </option>
                  ))}
                </select>
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

              <div>
                <label className="block text-sm font-medium text-gray-700">Total LOE (%)</label>
                <input 
                  type="number"
                  min="0"
                  max="100"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  value={editingPerson.total_loe}
                  onChange={(e) => setEditingPerson({...editingPerson, total_loe: e.target.value})}
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

      {/* Add New Staff Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
          <div className="bg-white p-8 rounded-lg shadow-xl w-96">
            <h2 className="text-xl font-bold mb-4">Add New Staff</h2>
            <form onSubmit={handleAddStaff} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Staff Name</label>
                <input
                  type="text"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  value={newStaff.staff_name}
                  onChange={(e) => setNewStaff({...newStaff, staff_name: e.target.value})}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Role</label>
                <select 
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  value={newStaff.role}
                  onChange={(e) => setNewStaff({...newStaff, role: e.target.value})}
                  required
                >
                  <option value="">Select Role</option>
                  {roleOptions.map((role) => (
                    <option key={role} value={role}>
                      {role}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Start Date</label>
                <input 
                  type="date"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  value={newStaff.start_date}
                  onChange={(e) => setNewStaff({...newStaff, start_date: e.target.value})}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">End Date</label>
                <input 
                  type="date"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  value={newStaff.end_date}
                  onChange={(e) => setNewStaff({...newStaff, end_date: e.target.value})}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Total LOE (%)</label>
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