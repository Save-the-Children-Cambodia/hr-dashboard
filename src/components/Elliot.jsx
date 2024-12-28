import React from "react";
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

const Elliot = () => {
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const data = {
    labels: months,
    datasets: [
      {
        label: 'Sales Performance',
        data: [82, 85, 87, 89, 92, 95, 88, 86, 90, 93, 96, 98], 
        fill: false,
        borderColor: 'rgb(53, 162, 235)',
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
        tension: 0.1
      },
      {
        label: 'Customer Satisfaction',
        data: [75, 78, 76, 82, 84, 85, 87, 88, 86, 89, 90, 92], 
        fill: false,
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
        tension: 0.1
      },
      {
        label: 'Task Completion Rate',
        data: [95, 93, 94, 92, 96, 95, 97, 94, 95, 96, 98, 99], 
        fill: false,
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
        tension: 0.1
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        title: {
          display: true,
          text: 'Percentage (%)'
        }
      },
      x: {
        title: {
          display: true,
          text: 'Month'
        }
      }
    },
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Monthly Performance Chart'
      }
    }
  };

  return (
    <div className="bg-white shadow-lg rounded-3xl p-8 h-[calc(100vh-9rem)]">
      <h1 className="text-3xl font-bold text-gray-900 mb-4">Elliot</h1>
      <div className="w-full h-[calc(100%-5rem)]">
        <Line data={data} options={options} />
      </div>
    </div>
  );
};

export default Elliot; 