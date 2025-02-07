import { toast } from 'react-hot-toast';

const RunAssignment = ({ loading, onAssignmentComplete }) => {
  const triggerAssignment = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/assign-staff/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || data.error || 'Failed to assign staff');
      }
      
      if (data.status === 'success') {
        onAssignmentComplete(data.assignments);
        toast.success('Staff assignments completed successfully');
      } else {
        throw new Error(data.detail || 'Assignment process failed');
      }
    } catch (error) {
      console.error('Error assigning staff:', error);
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