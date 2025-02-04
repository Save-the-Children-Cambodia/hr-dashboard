import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import Select from 'react-select';
import RunAssignment from '../components/RunAssignment';

const AssignTasks = () => {
  const [loading, setLoading] = useState(false);
  const [assignments, setAssignments] = useState([]);
  const [showAddTask, setShowAddTask] = useState(false);
  const [newTask, setNewTask] = useState({
    title: '',
    required_skills: '',
    required_loe: 0,
    deadline: new Date().toISOString().split('T')[0],
    status: 'unassigned',
    project: '',
    dependencies: [],
  });
  const [filters, setFilters] = useState({
    sortBy: 'deadline', // 'deadline', 'effort', 'project'
    availabilityThreshold: 0,
    skillFilter: 'all',
  });
  const [staffList, setStaffList] = useState([]);
  const [projects, setProjects] = useState([]);
  const [projectStaffList, setProjectStaffList] = useState([]);
  const [workloadOverview, setWorkloadOverview] = useState({
    distribution: { under_utilized: 0, optimal: 0, overloaded: 0 },
    bottlenecks: []
  });
  const [error, setError] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [taskStats, setTaskStats] = useState({
    total: 0,
    unassigned: 0,
    in_progress: 0,
    completed: 0
  });
  const [skills, setSkills] = useState([]);
  const [selectedSkills, setSelectedSkills] = useState([]);

  // Add this constant for custom styles
  const customStyles = {
    control: (base) => ({
      ...base,
      minHeight: '42px',
      border: '1px solid #D1D5DB',
      borderRadius: '0.375rem',
      boxShadow: 'none',
      '&:hover': {
        borderColor: '#9CA3AF'
      }
    }),
    option: (base, state) => ({
      ...base,
      backgroundColor: state.isSelected 
        ? '#4F46E5' 
        : state.isFocused 
          ? '#EEF2FF' 
          : 'white',
      color: state.isSelected ? 'white' : '#374151',
      '&:hover': {
        backgroundColor: state.isSelected ? '#4F46E5' : '#EEF2FF'
      }
    }),
    multiValue: (base) => ({
      ...base,
      backgroundColor: '#EEF2FF',
      borderRadius: '0.25rem'
    }),
    multiValueLabel: (base) => ({
      ...base,
      color: '#4F46E5',
      fontWeight: 500
    }),
    multiValueRemove: (base) => ({
      ...base,
      color: '#4F46E5',
      '&:hover': {
        backgroundColor: '#E0E7FF',
        color: '#4338CA'
      }
    })
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        await Promise.all([
          fetchStaffList(),
          fetchProjects(),
          fetchProjectStaffList(),
          fetchTasks(),
          fetchTaskStats(),
          fetchSkills()
        ]);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const fetchStaffList = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/staff/list/');
      if (!response.ok) throw new Error('Failed to fetch staff list');
      const data = await response.json();
      setStaffList(data);
    } catch (error) {
      console.error('Error fetching staff list:', error);
      setError('Failed to fetch staff list');
    }
  };

  const fetchProjects = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/projects/');
      if (!response.ok) throw new Error('Failed to fetch projects');
      const data = await response.json();
      setProjects(data);
    } catch (error) {
      console.error('Error fetching projects:', error);
      setError('Failed to fetch projects');
    }
  };

  const fetchProjectStaffList = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/project-staff/');
      if (!response.ok) throw new Error('Failed to fetch project staff');
      const data = await response.json();
      setProjectStaffList(data);
    } catch (error) {
      console.error('Error fetching project staff:', error);
      setError('Failed to fetch project staff');
    } finally {
      setLoading(false);
    }
  };

  const fetchTasks = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/tasks/');
      if (!response.ok) throw new Error('Failed to fetch tasks');
      const data = await response.json();
      setTasks(data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      setError('Failed to fetch tasks');
    }
  };

  const fetchTaskStats = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/tasks/stats/');
      if (!response.ok) throw new Error('Failed to fetch task stats');
      const data = await response.json();
      setTaskStats(data);
    } catch (error) {
      console.error('Error fetching task stats:', error);
    }
  };

  const fetchSkills = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/skills/');
      if (!response.ok) {
        throw new Error('Failed to fetch skills');
      }
      const data = await response.json();
      setSkills(data);
    } catch (error) {
      console.error('Error fetching skills:', error);
    }
  };

  // Calculate workload overview from staff details
  const calculateWorkloadOverview = () => {
    const distribution = {
      under_utilized: 0,
      optimal: 0,
      overloaded: 0
    };
    
    const bottlenecks = [];
    
    staffList?.forEach(staff => {
      // Ensure assignments exists and is an array
      const staffAssignments = projectStaffList.filter(ps => ps.staff.id === staff.id);
      const totalLOE = staffAssignments.reduce((sum, ps) => sum + (parseFloat(ps.loe_percentage) || 0), 0);
      
      if (totalLOE < 90) {
        distribution.under_utilized++;
      } else if (totalLOE <= 100) {
        distribution.optimal++;
      } else {
        distribution.overloaded++;
        bottlenecks.push({
          staff_name: staff.staff_name || staff.name,
          current_loe: totalLOE,
          suggestion: `Consider redistributing tasks from ${staff.staff_name || staff.name}`
        });
      }
    });
    
    setWorkloadOverview({ distribution, bottlenecks });
  };

  // Update useEffect to calculate workload overview when staff details change
  useEffect(() => {
    calculateWorkloadOverview();
  }, [staffList]);

  const handleAddTask = async (e) => {
    e.preventDefault();
    try {
      const deadline = new Date(newTask.deadline);
      deadline.setHours(23, 59, 59);

      const taskData = {
        ...newTask,
        deadline: deadline.toISOString(),
        project: newTask.project ? newTask.project.toString() : null  // Convert to string
      };

      const response = await fetch('http://localhost:8000/api/tasks/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(taskData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create task');
      }
      
      await Promise.all([fetchTasks(), fetchTaskStats()]);
      setNewTask({
        title: '',
        required_skills: '',
        required_loe: 0,
        deadline: new Date().toISOString().split('T')[0],
        status: 'unassigned',
        project: '',
        dependencies: []
      });
      setShowAddTask(false);
      toast.success('Task created successfully');
    } catch (error) {
      console.error('Error creating task:', error);
      toast.error(error.message || 'Failed to create task');
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      const response = await fetch(`http://localhost:8000/api/tasks/${taskId}/`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete task');
      
      await Promise.all([fetchTasks(), fetchTaskStats()]);
      toast.success('Task deleted successfully');
    } catch (error) {
      console.error('Error deleting task:', error);
      toast.error('Failed to delete task');
    }
  };

  const handleAssignmentComplete = async (newAssignments) => {
    setAssignments(newAssignments);
    await Promise.all([
      fetchStaffList(),
      fetchProjects(),
      fetchProjectStaffList(),
      fetchTasks(),
      fetchTaskStats()
    ]);
  };

  // Update the LOE Distribution Chart section with null check
  const renderLOEDistributionChart = () => (
    <div className="bg-white p-4 rounded-lg shadow-sm">
      <h3 className="text-md font-medium mb-3">Team LOE Distribution</h3>
      <div className="h-48 bg-gray-100 rounded flex items-end justify-around p-4">
        <div 
          className="w-8 bg-green-500" 
          style={{ 
            height: `${((workloadOverview?.distribution?.under_utilized || 0) / (staffList?.length || 1)) * 100}%` 
          }}
        />
        <div 
          className="w-8 bg-yellow-500" 
          style={{ 
            height: `${((workloadOverview?.distribution?.optimal || 0) / (staffList?.length || 1)) * 100}%` 
          }}
        />
        <div 
          className="w-8 bg-red-500" 
          style={{ 
            height: `${((workloadOverview?.distribution?.overloaded || 0) / (staffList?.length || 1)) * 100}%` 
          }}
        />
      </div>
      <div className="mt-2 text-sm text-gray-600 flex justify-between">
        <span>Under Utilized ({workloadOverview?.distribution?.under_utilized || 0})</span>
        <span>Optimal ({workloadOverview?.distribution?.optimal || 0})</span>
        <span>Overloaded ({workloadOverview?.distribution?.overloaded || 0})</span>
      </div>
    </div>
  );

  // Update the Bottleneck Analysis section with null check
  const renderBottleneckAnalysis = () => (
    <div className="bg-white p-4 rounded-lg shadow-sm">
      <h3 className="text-md font-medium mb-3">Potential Bottlenecks</h3>
      <div className="space-y-3">
        {workloadOverview?.bottlenecks?.map((bottleneck, index) => (
          <div key={index} className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center text-red-700">
              <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <span className="font-medium">
                {bottleneck.staff_name} is overloaded ({bottleneck.current_loe}% LOE)
              </span>
            </div>
            <p className="mt-1 text-sm text-red-600">{bottleneck.suggestion}</p>
          </div>
        ))}
      </div>
    </div>
  );

  // Update the Staff List section with null check
  const renderStaffList = () => (
    <div className="col-span-8 bg-gray-50 rounded-lg p-4">
      <h2 className="text-lg font-semibold mb-4">Staff Members</h2>
      <div className="space-y-4">
        {staffList?.map((staff) => {
          const staffAssignments = projectStaffList.filter(ps => ps.staff.id === staff.id);
          const totalLOE = staffAssignments.reduce((sum, ps) => sum + (parseFloat(ps.loe_percentage) || 0), 0);

          return (
            <div key={staff.id} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium">{staff.staff_name}</h3>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-600">
                      Current LOE: {totalLOE}%
                    </span>
                    {totalLOE > 90 && (
                      <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800">
                        {totalLOE > 100 ? 'Overloaded' : 'Near Capacity'}
                      </span>
                    )}
                  </div>
                  <div className="mt-1 flex flex-wrap gap-2">
                    {staff.skills?.map((skill) => (
                      <span 
                        key={skill.id} 
                        className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800"
                      >
                        {skill.name}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="w-32">
                  <div className="h-2 bg-gray-200 rounded-full">
                    <div
                      className="h-2 rounded-full transition-all duration-300"
                      style={{
                        width: `${totalLOE}%`,
                        backgroundColor: 
                          totalLOE > 100 ? '#EF4444' : 
                          totalLOE > 90 ? '#F59E0B' : '#10B981'
                      }}
                    ></div>
                  </div>
                </div>
              </div>
              <div className="mt-3">
                <h4 className="text-sm font-medium">Assigned Projects</h4>
                <div className="mt-2 space-y-2">
                  {staffAssignments.map((assignment, index) => (
                    <div key={index} className="bg-gray-50 p-2 rounded text-sm flex justify-between items-center">
                      <span>{assignment.project.award_name} ({assignment.loe_percentage}% LOE)</span>
                      <span className="text-xs text-gray-500">
                        Due: {new Date(assignment.end_date).toLocaleDateString()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  // Update the task pool render section
  const renderTaskPool = () => (
    <div className="col-span-4 bg-gray-50 rounded-lg p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Task Pool</h2>
        <button
          onClick={() => setShowAddTask(!showAddTask)}
          className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
        >
          Add Task
        </button>
      </div>
      {showAddTask && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <h2 className="text-lg font-semibold mb-4">Add New Task</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Task Title
              </label>
              <input
                type="text"
                value={newTask.title}
                onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Required Skills
              </label>
              <Select
                isMulti
                options={skills.map(skill => ({
                  value: skill.id,
                  label: skill.name,
                  category: skill.category
                }))}
                value={selectedSkills}
                onChange={(selected) => {
                  setSelectedSkills(selected);
                  setNewTask({
                    ...newTask,
                    required_skills: selected ? selected.map(s => s.value) : []
                  });
                }}
                className="basic-multi-select"
                classNamePrefix="select"
                placeholder="Select required skills..."
                formatOptionLabel={option => (
                  <div className="flex justify-between">
                    <span>{option.label}</span>
                    <span className="text-gray-500 text-sm">{option.category}</span>
                  </div>
                )}
                styles={customStyles}
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
                value={newTask.required_loe}
                onChange={(e) => setNewTask({ ...newTask, required_loe: parseInt(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Deadline
              </label>
              <input
                type="date"
                value={newTask.deadline}
                onChange={(e) => setNewTask({ ...newTask, deadline: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                min={new Date().toISOString().split('T')[0]}
                required
              />
              <p className="mt-1 text-sm text-gray-500">
                Duration: {calculateDuration(new Date(), new Date(newTask.deadline))} days
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                value={newTask.status}
                onChange={(e) => setNewTask({ ...newTask, status: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                required
              >
                <option value="unassigned">Unassigned</option>
                <option value="assigned">Assigned</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Project
              </label>
              <select
                value={newTask.project}
                onChange={(e) => setNewTask({ ...newTask, project: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              >
                <option value="">Select a Project</option>
                {projects.map((project) => (
                  <option key={project.id} value={project.id}>
                    {project.award_name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Dependencies
              </label>
              <select
                multiple
                value={newTask.dependencies}
                onChange={(e) => setNewTask({
                  ...newTask,
                  dependencies: Array.from(e.target.selectedOptions, option => option.value)
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                {tasks.map((task) => (
                  <option key={task.id} value={task.id}>
                    {task.title}
                  </option>
                ))}
              </select>
              <p className="mt-1 text-sm text-gray-500">
                Hold Ctrl/Cmd to select multiple tasks
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Complexity Level
              </label>
              <p className="text-sm text-gray-600">
                Will be automatically calculated based on task properties
              </p>
            </div>
            <div className="flex justify-end space-x-2">
              <button
                type="button"
                onClick={() => setShowAddTask(false)}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Add Task
              </button>
            </div>
          </form>
        </div>
      )}
      <div className="space-y-3">
        {tasks.map((task) => (
          <div key={task.id} className="bg-white p-3 rounded-lg shadow-sm border border-gray-200 cursor-move">
            <div className="flex justify-between items-start">
              <h3 className="font-medium">{task.title}</h3>
              <span className={`text-xs px-2 py-1 rounded-full ${
                task.status === 'completed' ? 'bg-green-100 text-green-800' :
                task.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                task.status === 'assigned' ? 'bg-yellow-100 text-yellow-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {task.status}
              </span>
            </div>
            <div className="text-sm text-gray-600 mt-2">
              <p>LOE: {task.required_loe}%</p>
              <p>Duration: {calculateDuration(new Date(), new Date(task.deadline))} days</p>
              <p>Deadline: {new Date(task.deadline).toLocaleDateString()}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderTaskStats = () => (
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

  // Add helper function to calculate duration
  const calculateDuration = (startDate, endDate) => {
    const diffTime = Math.abs(endDate - startDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const taskData = {
        ...newTask,
        deadline: new Date(newTask.deadline).toISOString(), // Ensure proper date format
        required_skills: selectedSkills.map(skill => skill.value)
      };

      const response = await fetch('http://localhost:8000/api/tasks/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(taskData)
      });
      
      if (!response.ok) {
        throw new Error('Failed to create task');
      }
      
      // Handle successful creation
      const data = await response.json();
      console.log('Task created:', data);
      
      // Reset form
      setNewTask({
        title: '',
        required_skills: [],
        required_loe: 0,
        deadline: new Date().toISOString().split('T')[0],
        status: 'unassigned',
        project: '',
        dependencies: [],
      });
      setSelectedSkills([]);
      
    } catch (error) {
      console.error('Error creating task:', error);
    }
  };

  return (
    <div className="bg-white shadow-lg rounded-3xl p-8">
      {/* Header with View Toggle */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-4">
          <h1 className="text-2xl font-bold text-gray-900">Staff Assignment</h1>
        </div>
        <div className="space-x-4">
          <RunAssignment 
            loading={loading} 
            onAssignmentComplete={handleAssignmentComplete}
          />
        </div>
      </div>

      {/* Filters and Sorting Panel */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Filters & Sorting</h2>
          <div className="flex space-x-4">
            <select
              value={filters.sortBy}
              onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })}
              className="px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500"
            >
              <option value="deadline">Sort by Deadline</option>
              <option value="effort">Sort by Effort</option>
              <option value="project">Sort by Project</option>
            </select>
            <input
              type="number"
              placeholder="Min. Availability %"
              value={filters.availabilityThreshold}
              onChange={(e) => setFilters({ ...filters, availabilityThreshold: e.target.value })}
              className="px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 w-40"
            />
            <select
              value={filters.skillFilter}
              onChange={(e) => setFilters({ ...filters, skillFilter: e.target.value })}
              className="px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500"
            >
              <option value="all">All Skills</option>
              <option value="frontend">Frontend</option>
              <option value="backend">Backend</option>
              <option value="design">Design</option>
            </select>
          </div>
        </div>
      </div>

      {/* Interactive Reports Section */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <h2 className="text-lg font-semibold mb-4">Workload Overview</h2>
        <div className="grid grid-cols-2 gap-6">
          {renderLOEDistributionChart()}
          {renderBottleneckAnalysis()}
        </div>
      </div>

      {renderTaskStats()}

      {/* Main Content Area */}
      <div className="grid grid-cols-12 gap-6">
        {renderTaskPool()}
        {renderStaffList()}
      </div>

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