const LOEDistributionChart = ({ workloadOverview, staffList }) => {
  return (
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
};

export default LOEDistributionChart; 