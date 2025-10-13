import React from 'react';

const TrafficAlert = ({ alert, technicians }) => {
  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'high':
        return 'bg-red-50 border-red-500 text-red-900';
      case 'medium':
        return 'bg-yellow-50 border-yellow-500 text-yellow-900';
      case 'low':
        return 'bg-blue-50 border-blue-500 text-blue-900';
      default:
        return 'bg-gray-50 border-gray-500 text-gray-900';
    }
  };

  const getSeverityIcon = (severity) => {
    switch (severity) {
      case 'high':
        return '🚨';
      case 'medium':
        return '⚠️';
      case 'low':
        return 'ℹ️';
      default:
        return '📍';
    }
  };

  const affectedTechs = technicians.filter(t => 
    alert.affectedTechnicians?.includes(t.id)
  );

  return (
    <div className={`border-l-4 p-4 rounded-lg ${getSeverityColor(alert.severity)}`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xl">{getSeverityIcon(alert.severity)}</span>
            <h4 className="font-semibold">Traffic Alert: {alert.location}</h4>
          </div>
          <p className="text-sm mb-2">{alert.message}</p>
          {alert.estimatedDelay && (
            <p className="text-sm font-medium">
              Estimated Delay: {alert.estimatedDelay} minutes
            </p>
          )}
          {affectedTechs.length > 0 && (
            <div className="mt-2">
              <p className="text-xs font-semibold mb-1">Affected Technicians:</p>
              <div className="flex flex-wrap gap-2">
                {affectedTechs.map(tech => (
                  <span
                    key={tech.id}
                    className="px-2 py-1 bg-white rounded text-xs font-medium"
                  >
                    {tech.name}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TrafficAlert;