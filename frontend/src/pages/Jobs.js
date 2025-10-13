import React from 'react';

const Jobs = () => {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-900">Jobs</h1>
      <p className="text-gray-600 mt-2">Job management and tracking - Coming Soon</p>
      <div className="mt-6 bg-white rounded-lg shadow p-6">
        <p>This module will include:</p>
        <ul className="list-disc list-inside mt-2 space-y-1">
          <li>Job creation and management</li>
          <li>Work order tracking</li>
          <li>Job status updates</li>
          <li>Technician assignment</li>
          <li>Service history</li>
          <li>Digital forms and checklists</li>
        </ul>
      </div>
    </div>
  );
};

export default Jobs;