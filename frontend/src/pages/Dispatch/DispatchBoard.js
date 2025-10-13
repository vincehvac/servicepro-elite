import React, { useState, useEffect, useCallback } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { useSocket } from '../../contexts/SocketContext';
import { useNotification } from '../../contexts/NotificationContext';
import apiService from '../../services/apiService';
import MapView from '../../components/Maps/MapView';
import TrafficAlert from '../../components/Dispatch/TrafficAlert';
import RouteOptimizer from '../../components/Dispatch/RouteOptimizer';

const DispatchBoard = () => {
  const [technicians, setTechnicians] = useState([]);
  const [unassignedJobs, setUnassignedJobs] = useState([]);
  const [selectedTechnician, setSelectedTechnician] = useState(null);
  const [trafficData, setTrafficData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showMap, setShowMap] = useState(true);
  const { socket } = useSocket();
  const { showNotification } = useNotification();

  useEffect(() => {
    loadDispatchData();
    initializeRealTimeUpdates();
  }, []);

  useEffect(() => {
    if (technicians.length > 0) {
      fetchTrafficData();
      const interval = setInterval(fetchTrafficData, 300000); // Update every 5 minutes
      return () => clearInterval(interval);
    }
  }, [technicians]);

  const initializeRealTimeUpdates = () => {
    if (!socket) return;

    socket.on('job-created', (job) => {
      if (!job.technicianId) {
        setUnassignedJobs(prev => [job, ...prev]);
        showNotification(`New unassigned job: ${job.customer}`, 'info');
      } else {
        assignJobToTechnician(job.technicianId, job);
      }
    });

    socket.on('job-updated', (updatedJob) => {
      updateJobInState(updatedJob);
    });

    socket.on('technician-location-update', (data) => {
      updateTechnicianLocation(data.technicianId, data.location);
    });

    socket.on('traffic-alert', (alert) => {
      showNotification(`Traffic Alert: ${alert.message}`, 'warning');
      setTrafficData(prev => ({
        ...prev,
        alerts: [...(prev?.alerts || []), alert]
      }));
    });

    return () => {
      socket.off('job-created');
      socket.off('job-updated');
      socket.off('technician-location-update');
      socket.off('traffic-alert');
    };
  };

  const loadDispatchData = async () => {
    try {
      setLoading(true);
      const [techsResponse, jobsResponse] = await Promise.all([
        apiService.get('/technicians'),
        apiService.get('/jobs', { status: 'unassigned' })
      ]);

      const techsWithJobs = await Promise.all(
        techsResponse.data.technicians.map(async (tech) => {
          const techJobs = await apiService.get('/jobs', { technician: tech.id });
          return {
            ...tech,
            jobs: techJobs.data.jobs || []
          };
        })
      );

      setTechnicians(techsWithJobs);
      setUnassignedJobs(jobsResponse.data.jobs || []);
    } catch (error) {
      console.error('Error loading dispatch data:', error);
      showNotification('Failed to load dispatch data', 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchTrafficData = async () => {
    try {
      // Mock traffic data - in production, integrate with Google Maps Traffic API
      const mockTraffic = {
        overall: 'moderate',
        alerts: [
          {
            id: 1,
            severity: 'high',
            location: 'I-95 Northbound',
            message: 'Heavy traffic due to accident',
            affectedTechnicians: [1, 2],
            estimatedDelay: 25
          },
          {
            id: 2,
            severity: 'medium',
            location: 'Route 1',
            message: 'Construction causing delays',
            affectedTechnicians: [3],
            estimatedDelay: 10
          }
        ],
        recommendations: [
          {
            technicianId: 1,
            currentRoute: 'I-95',
            alternativeRoute: 'Route 1',
            timeSavings: 15
          }
        ]
      };

      setTrafficData(mockTraffic);
    } catch (error) {
      console.error('Error fetching traffic data:', error);
    }
  };

  const onDragEnd = async (result) => {
    const { source, destination, draggableId } = result;

    if (!destination) return;

    // Moving within the same technician
    if (source.droppableId === destination.droppableId) {
      const techId = parseInt(source.droppableId.replace('tech-', ''));
      const tech = technicians.find(t => t.id === techId);
      
      if (tech) {
        const newJobs = Array.from(tech.jobs);
        const [removed] = newJobs.splice(source.index, 1);
        newJobs.splice(destination.index, 0, removed);

        setTechnicians(prev =>
          prev.map(t => t.id === techId ? { ...t, jobs: newJobs } : t)
        );
      }
      return;
    }

    // Moving from unassigned to technician
    if (source.droppableId === 'unassigned') {
      const jobId = parseInt(draggableId.replace('job-', ''));
      const job = unassignedJobs.find(j => j.id === jobId);
      const techId = parseInt(destination.droppableId.replace('tech-', ''));

      if (job) {
        try {
          await apiService.put(`/jobs/${jobId}`, {
            technicianId: techId,
            status: 'scheduled'
          });

          setUnassignedJobs(prev => prev.filter(j => j.id !== jobId));
          setTechnicians(prev =>
            prev.map(t =>
              t.id === techId
                ? { ...t, jobs: [...t.jobs, { ...job, technicianId: techId }] }
                : t
            )
          );

          // Emit real-time update
          if (socket) {
            socket.emit('job-assigned', {
              jobId,
              technicianId: techId,
              timestamp: new Date()
            });
          }

          showNotification(`Job assigned to ${technicians.find(t => t.id === techId)?.name}`, 'success');
        } catch (error) {
          console.error('Error assigning job:', error);
          showNotification('Failed to assign job', 'error');
        }
      }
      return;
    }

    // Moving from one technician to another
    const sourceTechId = parseInt(source.droppableId.replace('tech-', ''));
    const destTechId = parseInt(destination.droppableId.replace('tech-', ''));
    const jobId = parseInt(draggableId.replace('job-', ''));

    const sourceTech = technicians.find(t => t.id === sourceTechId);
    const job = sourceTech?.jobs.find(j => j.id === jobId);

    if (job) {
      try {
        await apiService.put(`/jobs/${jobId}`, {
          technicianId: destTechId
        });

        setTechnicians(prev =>
          prev.map(t => {
            if (t.id === sourceTechId) {
              return { ...t, jobs: t.jobs.filter(j => j.id !== jobId) };
            }
            if (t.id === destTechId) {
              return { ...t, jobs: [...t.jobs, { ...job, technicianId: destTechId }] };
            }
            return t;
          })
        );

        showNotification(`Job reassigned to ${technicians.find(t => t.id === destTechId)?.name}`, 'success');
      } catch (error) {
        console.error('Error reassigning job:', error);
        showNotification('Failed to reassign job', 'error');
      }
    }
  };

  const assignJobToTechnician = (techId, job) => {
    setTechnicians(prev =>
      prev.map(t =>
        t.id === techId ? { ...t, jobs: [...t.jobs, job] } : t
      )
    );
  };

  const updateJobInState = (updatedJob) => {
    if (!updatedJob.technicianId) {
      setUnassignedJobs(prev =>
        prev.map(j => j.id === updatedJob.id ? updatedJob : j)
      );
    } else {
      setTechnicians(prev =>
        prev.map(t => ({
          ...t,
          jobs: t.jobs.map(j => j.id === updatedJob.id ? updatedJob : j)
        }))
      );
    }
  };

  const updateTechnicianLocation = (techId, location) => {
    setTechnicians(prev =>
      prev.map(t =>
        t.id === techId ? { ...t, currentLocation: location } : t
      )
    );
  };

  const optimizeRoutes = async () => {
    try {
      showNotification('Optimizing routes...', 'info');
      
      // Call route optimization API
      const response = await apiService.post('/scheduling/optimize', {
        technicians: technicians.map(t => ({
          id: t.id,
          location: t.currentLocation,
          jobs: t.jobs
        }))
      });

      if (response.data.optimizedSchedule) {
        setTechnicians(response.data.optimizedSchedule);
        showNotification('Routes optimized successfully', 'success');
      }
    } catch (error) {
      console.error('Error optimizing routes:', error);
      showNotification('Failed to optimize routes', 'error');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'available': return '#10B981';
      case 'busy': return '#F59E0B';
      case 'offline': return '#6B7280';
      default: return '#3B82F6';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Dispatch Board</h1>
            <p className="text-sm text-gray-600">
              {technicians.length} technicians • {unassignedJobs.length} unassigned jobs
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setShowMap(!showMap)}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
            >
              {showMap ? '📋 Hide Map' : '🗺️ Show Map'}
            </button>
            <button
              onClick={optimizeRoutes}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
            >
              🎯 Optimize Routes
            </button>
            <button
              onClick={loadDispatchData}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              🔄 Refresh
            </button>
          </div>
        </div>

        {/* Traffic Alerts */}
        {trafficData?.alerts && trafficData.alerts.length > 0 && (
          <div className="space-y-2">
            {trafficData.alerts.map(alert => (
              <TrafficAlert key={alert.id} alert={alert} technicians={technicians} />
            ))}
          </div>
        )}
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Map View */}
        {showMap && (
          <div className="w-1/2 border-r border-gray-200">
            <MapView
              technicians={technicians}
              selectedTechnician={selectedTechnician}
              onTechnicianSelect={setSelectedTechnician}
              trafficData={trafficData}
            />
          </div>
        )}

        {/* Dispatch Board */}
        <div className={`${showMap ? 'w-1/2' : 'w-full'} overflow-auto p-4`}>
          <DragDropContext onDragEnd={onDragEnd}>
            <div className="grid grid-cols-1 gap-4">
              {/* Unassigned Jobs */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  📋 Unassigned Jobs ({unassignedJobs.length})
                </h3>
                <Droppable droppableId="unassigned">
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={`min-h-[100px] space-y-2 ${
                        snapshot.isDraggingOver ? 'bg-blue-50' : ''
                      }`}
                    >
                      {unassignedJobs.map((job, index) => (
                        <Draggable
                          key={job.id}
                          draggableId={`job-${job.id}`}
                          index={index}
                        >
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className={`bg-white p-3 rounded-lg border-2 border-gray-200 cursor-move hover:shadow-md transition ${
                                snapshot.isDragging ? 'shadow-lg' : ''
                              }`}
                            >
                              <div className="flex justify-between items-start mb-2">
                                <div>
                                  <p className="font-semibold text-gray-900">{job.customer}</p>
                                  <p className="text-sm text-gray-600">⏰ {job.scheduledTime}</p>
                                </div>
                                {job.priority === 'high' && (
                                  <span className="px-2 py-1 bg-red-100 text-red-700 text-xs font-bold rounded">
                                    HIGH
                                  </span>
                                )}
                              </div>
                              <p className="text-sm text-gray-600">📋 {job.type}</p>
                              <p className="text-xs text-gray-500 mt-1">📍 {job.address}</p>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                      {unassignedJobs.length === 0 && (
                        <p className="text-center text-gray-400 py-8">
                          No unassigned jobs
                        </p>
                      )}
                    </div>
                  )}
                </Droppable>
              </div>

              {/* Technician Columns */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {technicians.map(tech => (
                  <div
                    key={tech.id}
                    className={`bg-white rounded-lg border-2 ${
                      selectedTechnician?.id === tech.id
                        ? 'border-purple-500'
                        : 'border-gray-200'
                    }`}
                    onClick={() => setSelectedTechnician(tech)}
                  >
                    <div className="p-4 border-b border-gray-200">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-semibold text-gray-900">{tech.name}</h3>
                          <p className="text-sm text-gray-600">{tech.specialty}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: getStatusColor(tech.status) }}
                          />
                          <span className="text-xs font-medium text-gray-600">
                            {tech.status}
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-4 text-sm text-gray-600">
                        <span>📋 {tech.jobs.length} jobs</span>
                        <span>⭐ {tech.rating}</span>
                      </div>
                    </div>

                    <Droppable droppableId={`tech-${tech.id}`}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.droppableProps}
                          className={`p-4 min-h-[200px] space-y-2 ${
                            snapshot.isDraggingOver ? 'bg-purple-50' : ''
                          }`}
                        >
                          {tech.jobs.map((job, index) => (
                            <Draggable
                              key={job.id}
                              draggableId={`job-${job.id}`}
                              index={index}
                            >
                              {(provided, snapshot) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  className={`bg-gray-50 p-3 rounded-lg border-l-4 border-purple-500 cursor-move hover:shadow-md transition ${
                                    snapshot.isDragging ? 'shadow-lg' : ''
                                  }`}
                                >
                                  <div className="flex justify-between items-start mb-1">
                                    <p className="font-medium text-gray-900 text-sm">
                                      {job.customer}
                                    </p>
                                    <span className={`px-2 py-0.5 text-xs font-semibold rounded ${
                                      job.status === 'completed' ? 'bg-green-100 text-green-700' :
                                      job.status === 'in_progress' ? 'bg-blue-100 text-blue-700' :
                                      'bg-gray-100 text-gray-700'
                                    }`}>
                                      {job.status}
                                    </span>
                                  </div>
                                  <p className="text-xs text-gray-600">⏰ {job.scheduledTime}</p>
                                  <p className="text-xs text-gray-500 mt-1">📋 {job.type}</p>
                                </div>
                              )}
                            </Draggable>
                          ))}
                          {provided.placeholder}
                          {tech.jobs.length === 0 && (
                            <p className="text-center text-gray-400 py-8 text-sm">
                              No jobs assigned
                            </p>
                          )}
                        </div>
                      )}
                    </Droppable>
                  </div>
                ))}
              </div>
            </div>
          </DragDropContext>
        </div>
      </div>
    </div>
  );
};

export default DispatchBoard;