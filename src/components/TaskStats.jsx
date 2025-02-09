import React, { useState, useEffect } from 'react';

const TaskStats = () => {
  const [taskStats, setTaskStats] = useState({
    total: 0,
    unassigned: 0,
    assigned: 0,
    in_progress: 0,
    completed: 0
  });
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTaskStats = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/tasks/stats/');
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to fetch task stats');
        }
        const data = await response.json();
        setTaskStats(data);
        setError(null);
      } catch (error) {
        console.error('Error fetching task stats:', error);
        setError(error.message);
        setTaskStats({
          total: 0,
          unassigned: 0,
          assigned: 0,
          in_progress: 0,
          completed: 0
        });
      }
    };

    fetchTaskStats();
  }, []);

  return (
    <div>
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4" role="alert">
          <p>{error}</p>
        </div>
      )}
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
          <h3 className="text-gray-500">Assigned</h3>
          <p className="text-2xl font-bold text-orange-600">{taskStats.assigned}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-gray-500">Completed</h3>
          <p className="text-2xl font-bold text-green-600">{taskStats.completed}</p>
        </div>
      </div>
    </div>
  );
};

export default TaskStats; 