import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const Panhathun = ({ staffId }) => {
  const [staffData, setStaffData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStaffData = async () => {
      try {
        const staffResponse = await fetch('http://localhost:8000/api/staff/list/');
        const tasksResponse = await fetch('http://localhost:8000/api/tasks/');
        
        const staffList = await staffResponse.json();
        const tasksList = await tasksResponse.json();

        // Find the specific staff member by ID
        const staffMember = staffList.find(staff => staff.id === staffId);
        
        if (staffMember) {
          const staffTasks = tasksList.filter(task => 
            task.assigned_staff && task.assigned_staff.id === staffMember.id
          );

          // Calculate monthly task counts and average LOE
          const monthlyData = Array(12).fill(0);
          const monthlyLOE = Array(12).fill(staffMember.total_loe);
          
          staffTasks.forEach(task => {
            const taskMonth = new Date(task.deadline).getMonth();
            monthlyData[taskMonth]++;
          });

          setStaffData({
            name: staffMember.staff_name,
            taskData: monthlyData,
            loeData: monthlyLOE
          });
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
      setLoading(false);
    };

    if (staffId) {
      fetchStaffData();
    }
  }, [staffId]);

  const data = {
    labels: [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ],
    datasets: [
      {
        label: 'Level of Effort (%)',
        data: staffData?.loeData || [],
        fill: false,
        borderColor: 'rgb(53, 162, 235)',
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
        tension: 0.1,
        yAxisID: 'y'
      },
      {
        label: 'Number of Tasks',
        data: staffData?.taskData || [],
        fill: false,
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
        tension: 0.1,
        yAxisID: 'y1'
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        type: 'linear',
        display: true,
        position: 'left',
        beginAtZero: true,
        max: 100,
        title: {
          display: true,
          text: 'Level of Effort (%)'
        }
      },
      y1: {
        type: 'linear',
        display: true,
        position: 'right',
        beginAtZero: true,
        title: {
          display: true,
          text: 'Number of Tasks'
        },
        grid: {
          drawOnChartArea: false,
        },
      }
    },
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Staff Performance Overview'
      }
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="bg-white shadow-lg rounded-3xl p-8 h-[calc(100vh-9rem)]">
      <h1 className="text-3xl font-bold text-gray-900 mb-4">
        {staffData?.name || 'Staff Member'}
      </h1>
      <div className="w-full h-[calc(100%-5rem)]">
        <Line data={data} options={options} />
      </div>
    </div>
  );
};

export default Panhathun; 