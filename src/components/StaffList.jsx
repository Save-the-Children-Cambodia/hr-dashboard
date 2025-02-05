import React from 'react';

const StaffList = ({ staffList, projectStaffList }) => {
  return (
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
};

export default StaffList; 