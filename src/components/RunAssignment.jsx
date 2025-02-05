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
      
      // Handle the specific response format from the service
      if (data.status === 'success') {
        onAssignmentComplete(data.assignments);
        toast.success(data.message || 'Staff assignments completed successfully');
      } else if (data.status === 'error') {
        throw new Error(data.message || 'Assignment failed');
      } else if (typeof data === 'string') {
        // Handle case where service returns a string message
        toast.error(data);
        return;
      } else {
        throw new Error('Unexpected response format from server');
      }
    } catch (error) {
      console.error('Error in assignment:', error);
      toast.error('Failed to assign staff: ' + error.message);
    }
  };

  return (
    <div>
      <button
        onClick={triggerAssignment}
        disabled={loading}
        className={`px-4 py-2 rounded-lg text-white ${
          loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
        }`}
      >
        {loading ? 'Assigning...' : 'Run Assignment'}
      </button>
    </div>
  );
};

export default RunAssignment; 