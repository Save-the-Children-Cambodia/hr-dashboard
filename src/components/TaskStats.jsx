import React from 'react';

const TaskStats = ({ taskStats }) => {
  return (
    <div className="grid grid-cols-4 gap-4 mb-6">
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-gray-500">Total Tasks</h3>
        <p className="text-2xl font-bold">{taskStats.total}</p>
      </div>
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-gray-500">Unassigned</h3>
        <p className="text-2xl font-bold text-yellow-600">{taskStats.unassigned}</p>
      </div>
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-gray-500">In Progress</h3>
        <p className="text-2xl font-bold text-blue-600">{taskStats.in_progress}</p>
      </div>
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-gray-500">Completed</h3>
        <p className="text-2xl font-bold text-green-600">{taskStats.completed}</p>
      </div>
    </div>
  );
};

export default TaskStats; 