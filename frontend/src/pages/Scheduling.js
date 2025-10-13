import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import { useQuery } from 'react-query';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import {
  Plus,
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  User,
  Filter,
  Search
} from 'lucide-react';
import axios from 'axios';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const localizer = momentLocalizer(moment);

const Scheduling = () => {
  const [view, setView] = useState('week');
  const [date, setDate] = useState(new Date());
  const [selectedTechnician, setSelectedTechnician] = useState('');
  const [showNewAppointmentModal, setShowNewAppointmentModal] = useState(false);

  // Mock technicians data
  const technicians = [
    { id: 1, name: 'Mike Johnson', specialty: 'HVAC', color: '#3B82F6' },
    { id: 2, name: 'Tom Davis', specialty: 'Electrical', color: '#10B981' },
    { id: 3, name: 'Sarah Wilson', specialty: 'Plumbing', color: '#F59E0B' },
    { id: 4, name: 'Robert Brown', specialty: 'General', color: '#EF4444' }
  ];

  // Mock appointments data
  const appointments = [
    {
      id: 1,
      title: 'HVAC Maintenance - John Smith',
      start: new Date(2024, 0, 15, 10, 0),
      end: new Date(2024, 0, 15, 12, 0),
      technician: 'Mike Johnson',
      technicianId: 1,
      jobNumber: 'JOB-2024-001',
      customer: 'John Smith',
      address: '123 Main St, Anytown, USA',
      status: 'scheduled',
      priority: 'normal'
    },
    {
      id: 2,
      title: 'Electrical Repair - Sarah Williams',
      start: new Date(2024, 0, 15, 14, 0),
      end: new Date(2024, 0, 15, 16, 0),
      technician: 'Tom Davis',
      technicianId: 2,
      jobNumber: 'JOB-2024-002',
      customer: 'Sarah Williams',
      address: '456 Oak Ave, Anytown, USA',
      status: 'scheduled',
      priority: 'high'
    },
    {
      id: 3,
      title: 'Plumbing Installation - Robert Brown',
      start: new Date(2024, 0, 16, 9, 0),
      end: new Date(2024, 0, 16, 11, 0),
      technician: 'Sarah Wilson',
      technicianId: 3,
      jobNumber: 'JOB-2024-003',
      customer: 'Robert Brown',
      address: '789 Pine Rd, Anytown, USA',
      status: 'scheduled',
      priority: 'normal'
    }
  ];

  const events = appointments.map(apt => ({
    ...apt,
    resourceId: apt.technicianId,
    style: {
      backgroundColor: technicians.find(t => t.id === apt.technicianId)?.color || '#6B7280',
      border: 'none',
      borderRadius: '4px',
      color: 'white'
    }
  }));

  const eventStyleGetter = (event) => {
    return {
      style: event.style
    };
  };

  const handleSelectEvent = (event) => {
    console.log('Selected event:', event);
    // Open appointment details modal
  };

  const handleSelectSlot = (slotInfo) => {
    console.log('Selected slot:', slotInfo);
    setShowNewAppointmentModal(true);
  };

  const handleNavigate = (newDate) => {
    setDate(newDate);
  };

  const handleViewChange = (newView) => {
    setView(newView);
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Scheduling</h1>
            <p className="text-gray-600 mt-1">Manage appointments and dispatch technicians</p>
          </div>
          <button
            onClick={() => setShowNewAppointmentModal(true)}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="h-5 w-5 mr-2" />
            New Appointment
          </button>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-4 bg-white p-4 rounded-lg shadow">
          <div className="flex items-center space-x-2">
            <CalendarIcon className="h-5 w-5 text-gray-500" />
            <input
              type="date"
              value={moment(date).format('YYYY-MM-DD')}
              onChange={(e) => setDate(new Date(e.target.value))}
              className="border border-gray-300 rounded-md px-3 py-2 text-sm"
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <User className="h-5 w-5 text-gray-500" />
            <select
              value={selectedTechnician}
              onChange={(e) => setSelectedTechnician(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 text-sm"
            >
              <option value="">All Technicians</option>
              {technicians.map(tech => (
                <option key={tech.id} value={tech.id}>{tech.name}</option>
              ))}
            </select>
          </div>

          <button className="flex items-center px-3 py-2 text-gray-600 hover:text-gray-800">
            <Filter className="h-4 w-4 mr-2" />
            More Filters
          </button>

          <div className="flex items-center space-x-2 ml-auto">
            <Search className="h-5 w-5 text-gray-500" />
            <input
              type="text"
              placeholder="Search appointments..."
              className="border border-gray-300 rounded-md px-3 py-2 text-sm w-64"
            />
          </div>
        </div>
      </div>

      {/* Calendar */}
      <div className="bg-white rounded-lg shadow" style={{ height: '600px' }}>
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: '100%', padding: '20px' }}
          view={view}
          onView={handleViewChange}
          date={date}
          onNavigate={handleNavigate}
          onSelectEvent={handleSelectEvent}
          onSelectSlot={handleSelectSlot}
          selectable
          popup
          eventPropGetter={eventStyleGetter}
          resources={technicians}
          resourceIdAccessor="id"
          resourceTitleAccessor="name"
          step={30}
          timeslots={2}
          defaultView="week"
          views={['month', 'week', 'day', 'agenda']}
          components={{
            event: ({ event }) => (
              <div className="p-1">
                <div className="font-medium text-sm">{event.title}</div>
                <div className="text-xs opacity-90">
                  <Clock className="inline h-3 w-3 mr-1" />
                  {moment(event.start).format('h:mm A')} - {moment(event.end).format('h:mm A')}
                </div>
                {event.priority === 'high' && (
                  <div className="text-xs font-medium text-yellow-200">HIGH PRIORITY</div>
                )}
              </div>
            ),
            toolbar: (props) => (
              <div className="rbc-toolbar">
                <span className="rbc-btn-group">
                  <button
                    type="button"
                    onClick={() => props.onNavigate('PREVIOUS')}
                    className="px-3 py-1 border border-gray-300 rounded-l-md hover:bg-gray-50"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={() => props.onNavigate('TODAY')}
                    className="px-3 py-1 border-t border-b border-gray-300 hover:bg-gray-50"
                  >
                    Today
                  </button>
                  <button
                    type="button"
                    onClick={() => props.onNavigate('NEXT')}
                    className="px-3 py-1 border border-gray-300 rounded-r-md hover:bg-gray-50"
                  >
                    Next
                  </button>
                </span>
                <span className="rbc-toolbar-label text-lg font-semibold">
                  {props.label}
                </span>
                <span className="rbc-btn-group">
                  {props.views.map((view) => (
                    <button
                      key={view}
                      type="button"
                      onClick={() => props.onView(view)}
                      className={`px-3 py-1 border border-gray-300 hover:bg-gray-50 ${
                        props.view === view ? 'bg-blue-600 text-white' : ''
                      }`}
                    >
                      {view.charAt(0).toUpperCase() + view.slice(1)}
                    </button>
                  ))}
                </span>
              </div>
            )
          }}
        />
      </div>

      {/* Technician Legend */}
      <div className="mt-6 bg-white rounded-lg shadow p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Technicians</h3>
        <div className="flex flex-wrap gap-4">
          {technicians.map(tech => (
            <div key={tech.id} className="flex items-center space-x-2">
              <div 
                className="w-4 h-4 rounded"
                style={{ backgroundColor: tech.color }}
              ></div>
              <span className="text-sm text-gray-700">{tech.name}</span>
              <span className="text-xs text-gray-500">({tech.specialty})</span>
            </div>
          ))}
        </div>
      </div>

      {/* New Appointment Modal - Placeholder */}
      {showNewAppointmentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">New Appointment</h2>
            <p className="text-gray-600 mb-4">Appointment creation form would go here</p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowNewAppointmentModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={() => setShowNewAppointmentModal(false)}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Create Appointment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Scheduling;