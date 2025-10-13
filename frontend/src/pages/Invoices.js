import React from 'react';

const Invoices = () => {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-900">Invoices</h1>
      <p className="text-gray-600 mt-2">Invoice and billing management - Coming Soon</p>
      <div className="mt-6 bg-white rounded-lg shadow p-6">
        <p>This module will include:</p>
        <ul className="list-disc list-inside mt-2 space-y-1">
          <li>Invoice generation</li>
          <li>Payment processing</li>
          <li>Billing automation</li>
          <li>Payment tracking</li>
          <li>Revenue reporting</li>
          <li>Tax calculations</li>
          <li>Integration with accounting systems</li>
        </ul>
      </div>
    </div>
  );
};

export default Invoices;