import React, { useState } from 'react';

const [newStaff, setNewStaff] = useState({
  staff_name: '',
  role: '',
  skills: '',
  start_date: new Date().toISOString().split('T')[0],
  end_date: new Date().toISOString().split('T')[0],
  total_loe: 100
});

// In your form JSX
<div className="mb-4">
  <label className="block text-sm font-medium text-gray-700">Skills (comma-separated)</label>
  <input
    type="text"
    value={newStaff.skills}
    onChange={(e) => setNewStaff({ ...newStaff, skills: e.target.value })}
    placeholder="python,react,django"
    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
  />
  <p className="mt-1 text-sm text-gray-500">
    Enter skills separated by commas (e.g., python,react,django)
  </p>
</div> 