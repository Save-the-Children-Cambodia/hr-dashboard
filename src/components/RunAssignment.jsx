import { toast } from 'react-hot-toast';

const RunAssignment = ({ loading, onAssignmentComplete }) => {
  const triggerAssignment = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }
      
      const response = await fetch('http://localhost:8000/api/assign-staff/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || errorData.code || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      if (data.assignments) {
        onAssignmentComplete(data.assignments);
        toast.success('Staff assignments completed successfully');
      } else {
        throw new Error('No assignments returned from server');
      }
    } catch (error) {
      console.error('Error in assignment:', error);
      toast.error('Failed to assign staff: ' + error.message);
    }
  };

  return (
    <button
      onClick={triggerAssignment}
      disabled={loading}
      className={`px-4 py-2 rounded-lg text-white ${
        loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
      }`}
    >
      {loading ? 'Assigning...' : 'Run Assignment'}
    </button>
  );
};

export default RunAssignment; 