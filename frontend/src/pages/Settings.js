import React from 'react';

const Settings = () => {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
      <p className="text-gray-600 mt-2">System configuration and preferences - Coming Soon</p>
      <div className="mt-6 bg-white rounded-lg shadow p-6">
        <p>This module will include:</p>
        <ul className="list-disc list-inside mt-2 space-y-1">
          <li>Company settings</li>
          <li>User management</li>
          <li>Role permissions</li>
          <li>Integration settings</li>
          <li>Notification preferences</li>
          <li>Billing configuration</li>
          <li>Custom fields setup</li>
        </ul>
      </div>
    </div>
  );
};

export default Settings;