import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const AssignTasks = () => {
  const [loading, setLoading] = useState(false);
  const [assignments, setAssignments] = useState([]);
  const [showAddTask, setShowAddTask] = useState(false);
  const [newTask, setNewTask] = useState({
    title: '',
    requiredLOE: 0,
  });

  const triggerAssignment = async () => {
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:8000/api/assign-staff/');
      
      if (response.data.status === 'success') {
        setAssignments(response.data.assignments);
        toast.success('Staff assignments completed successfully');
      } else {
        toast.error(response.data.message || 'Failed to assign staff');
      }
    } catch (error) {
      console.error('Assignment error:', error);
      toast.error('Error assigning staff to projects');
    } finally {
      setLoading(false);
    }
  };

  const handleAddTask = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8000/api/tasks/create/', newTask);
      toast.success('Task created successfully');
      setNewTask({ title: '', requiredLOE: 0 }); // Reset form
      setShowAddTask(false); // Close form
      // Optionally trigger reassignment
      await triggerAssignment();
    } catch (error) {
      console.error('Task creation error:', error);
      toast.error('Error creating task');
    }
  };

  return (
    <div className="bg-white shadow-lg rounded-3xl p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Staff Assignment</h1>
        <div className="space-x-4">
          <button
            onClick={() => setShowAddTask(!showAddTask)}
            className="px-4 py-2 rounded-lg text-white bg-green-600 hover:bg-green-700"
          >
            {showAddTask ? 'Cancel' : 'Add Task'}
          </button>
          <button
            onClick={triggerAssignment}
            disabled={loading}
            className={`px-4 py-2 rounded-lg text-white ${
              loading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {loading ? 'Assigning...' : 'Run Assignment'}
          </button>
        </div>
      </div>

      {/* Add Task Form */}
      {showAddTask && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <h2 className="text-lg font-semibold mb-4">Add New Task</h2>
          <form onSubmit={handleAddTask} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Task Title
              </label>
              <input
                type="text"
                value={newTask.title}
                onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Required LOE (%)
              </label>
              <input
                type="number"
                min="0"
                max="100"
                value={newTask.requiredLOE}
                onChange={(e) => setNewTask({ ...newTask, requiredLOE: Number(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                required
              />
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Create Task
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Assignment Results */}
      {assignments.length > 0 && (
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-4">Assignment Results</h2>
          <div className="space-y-4">
            {assignments.map((assignment, index) => (
              <div
                key={index}
                className="bg-gray-50 rounded-lg p-4 border border-gray-200"
              >
                <p className="text-gray-800">{assignment}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {loading && (
        <div className="flex justify-center items-center mt-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      )}
    </div>
  );
};

export default AssignTasks;