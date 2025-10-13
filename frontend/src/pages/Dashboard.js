import React from 'react';
import { useQuery } from 'react-query';
import { Link } from 'react-router-dom';
import {
  Users,
  Briefcase,
  Calendar,
  DollarSign,
  TrendingUp,
  Clock,
  MapPin,
  AlertCircle
} from 'lucide-react';
import axios from 'axios';

const Dashboard = () => {
  // Mock data for now - in real app, these would be API calls
  const stats = {
    totalCustomers: 1247,
    activeJobs: 23,
    completedJobs: 156,
    monthlyRevenue: 87540,
    pendingInvoices: 12,
    overdueTasks: 5
  };

  const recentJobs = [
    {
      id: 1,
      jobNumber: 'JOB-2024-001',
      customer: 'John Smith',
      type: 'HVAC Maintenance',
      status: 'in_progress',
      technician: 'Mike Johnson',
      scheduledTime: '10:00 AM'
    },
    {
      id: 2,
      jobNumber: 'JOB-2024-002',
      customer: 'Sarah Williams',
      type: 'Electrical Repair',
      status: 'scheduled',
      technician: 'Tom Davis',
      scheduledTime: '2:00 PM'
    },
    {
      id: 3,
      jobNumber: 'JOB-2024-003',
      customer: 'Robert Brown',
      type: 'Plumbing Installation',
      status: 'completed',
      technician: 'Mike Johnson',
      scheduledTime: '9:00 AM'
    }
  ];

  const getStatusColor = (status) => {
    const colors = {
      scheduled: 'bg-blue-100 text-blue-800',
      in_progress: 'bg-yellow-100 text-yellow-800',
      completed: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">Welcome back! Here's what's happening with your service operations.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 text-blue-600">
              <Users className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Customers</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalCustomers.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-yellow-100 text-yellow-600">
              <Briefcase className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active Jobs</p>
              <p className="text-2xl font-bold text-gray-900">{stats.activeJobs}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 text-green-600">
              <DollarSign className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Monthly Revenue</p>
              <p className="text-2xl font-bold text-gray-900">${stats.monthlyRevenue.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100 text-purple-600">
              <TrendingUp className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Completed Jobs</p>
              <p className="text-2xl font-bold text-gray-900">{stats.completedJobs}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Jobs */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Recent Jobs</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {recentJobs.map((job) => (
                <div key={job.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div>
                      <p className="font-medium text-gray-900">{job.jobNumber}</p>
                      <p className="text-sm text-gray-600">{job.customer}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">{job.type}</p>
                      <p className="text-xs text-gray-500">Tech: {job.technician}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <p className="text-sm text-gray-600">{job.scheduledTime}</p>
                      <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(job.status)}`}>
                        {job.status.replace('_', ' ')}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6">
              <Link to="/jobs" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                View all jobs →
              </Link>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Quick Actions</h2>
          </div>
          <div className="p-6 space-y-4">
            <Link
              to="/customers/new"
              className="flex items-center p-3 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors"
            >
              <Users className="h-5 w-5 mr-3" />
              Add New Customer
            </Link>
            <Link
              to="/jobs/new"
              className="flex items-center p-3 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors"
            >
              <Briefcase className="h-5 w-5 mr-3" />
              Create New Job
            </Link>
            <Link
              to="/scheduling"
              className="flex items-center p-3 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors"
            >
              <Calendar className="h-5 w-5 mr-3" />
              Schedule Appointment
            </Link>
            <Link
              to="/invoices/new"
              className="flex items-center p-3 bg-yellow-50 text-yellow-700 rounded-lg hover:bg-yellow-100 transition-colors"
            >
              <DollarSign className="h-5 w-5 mr-3" />
              Create Invoice
            </Link>
          </div>
        </div>
      </div>

      {/* Alerts */}
      <div className="mt-6 bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Alerts & Notifications</h2>
        </div>
        <div className="p-6">
          <div className="space-y-3">
            <div className="flex items-center p-3 bg-red-50 border border-red-200 rounded-lg">
              <AlertCircle className="h-5 w-5 text-red-600 mr-3" />
              <div>
                <p className="font-medium text-red-900">5 Overdue Tasks</p>
                <p className="text-sm text-red-700">3 installations and 2 maintenance jobs are overdue</p>
              </div>
            </div>
            <div className="flex items-center p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <Clock className="h-5 w-5 text-yellow-600 mr-3" />
              <div>
                <p className="font-medium text-yellow-900">12 Pending Invoices</p>
                <p className="text-sm text-yellow-700">Total amount: $24,580</p>
              </div>
            </div>
            <div className="flex items-center p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <MapPin className="h-5 w-5 text-blue-600 mr-3" />
              <div>
                <p className="font-medium text-blue-900">3 Technicians in Field</p>
                <p className="text-sm text-blue-700">Currently servicing customers</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;