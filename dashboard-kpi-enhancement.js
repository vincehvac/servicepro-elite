// Main Dashboard KPI Enhancement - Tasks 2.1 to 2.12
// This script adds comprehensive KPI dashboard with charts and features

document.addEventListener('DOMContentLoaded', function() {
    // Load Chart.js from CDN if not already loaded
    if (typeof Chart === 'undefined') {
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js';
        script.onload = initializeDashboard;
        document.head.appendChild(script);
    } else {
        initializeDashboard();
    }
});

function initializeDashboard() {
    // Task 2.1-2.6: Create KPI Overview Panel
    createKPIPanel();
    
    // Task 2.7-2.8: Create Job Queue Widget
    createJobQueueWidget();
    
    // Task 2.9: Create Notifications Panel
    createNotificationsPanel();
    
    // Task 2.10: Enable drag-and-drop (already implemented in base)
    
    // Task 2.11: Add Export Report button
    addExportReportButton();
    
    // Task 2.12: Add AI-powered alerts
    addAIPoweredAlerts();
}

// Task 2.1-2.6: KPI Overview Panel with Charts
function createKPIPanel() {
    const container = document.getElementById('main-content') || document.querySelector('.container');
    if (!container) return;
    
    // Check if KPI panel already exists
    if (document.getElementById('kpi-panel')) return;
    
    const kpiPanel = document.createElement('div');
    kpiPanel.id = 'kpi-panel';
    kpiPanel.className = 'kpi-panel';
    kpiPanel.innerHTML = `
        <div class="kpi-header">
            <h2>📊 Key Performance Indicators</h2>
            <div class="kpi-controls">
                <select id="dateRangeFilter" class="form-select" onchange="updateKPIData()">
                    <option value="today">Today</option>
                    <option value="7days" selected>Last 7 Days</option>
                    <option value="30days">Last 30 Days</option>
                    <option value="90days">Last 90 Days</option>
                    <option value="custom">Custom Range</option>
                </select>
                <button class="btn btn-sm btn-secondary" onclick="refreshKPIData()">
                    🔄 Refresh
                </button>
            </div>
        </div>
        
        <div class="kpi-summary">
            <div class="kpi-card">
                <div class="kpi-icon">📋</div>
                <div class="kpi-content">
                    <div class="kpi-value" id="totalJobs">0</div>
                    <div class="kpi-label">Total Jobs</div>
                    <div class="kpi-change positive">+12% vs last period</div>
                </div>
            </div>
            <div class="kpi-card">
                <div class="kpi-icon">💰</div>
                <div class="kpi-content">
                    <div class="kpi-value" id="totalRevenue">$0</div>
                    <div class="kpi-label">Total Revenue</div>
                    <div class="kpi-change positive">+8% vs last period</div>
                </div>
            </div>
            <div class="kpi-card">
                <div class="kpi-icon">✅</div>
                <div class="kpi-content">
                    <div class="kpi-value" id="completionRate">0%</div>
                    <div class="kpi-label">Completion Rate</div>
                    <div class="kpi-change positive">+5% vs last period</div>
                </div>
            </div>
            <div class="kpi-card">
                <div class="kpi-icon">⭐</div>
                <div class="kpi-content">
                    <div class="kpi-value" id="avgRating">0.0</div>
                    <div class="kpi-label">Avg Rating</div>
                    <div class="kpi-change positive">+0.3 vs last period</div>
                </div>
            </div>
        </div>
        
        <div class="kpi-charts">
            <div class="chart-container">
                <h3>Jobs Completed This Week</h3>
                <canvas id="jobsChart"></canvas>
            </div>
            <div class="chart-container">
                <h3>Revenue This Month</h3>
                <canvas id="revenueChart"></canvas>
            </div>
            <div class="chart-container">
                <h3>Technician Performance</h3>
                <canvas id="performanceChart"></canvas>
            </div>
        </div>
    `;
    
    // Insert at the top of the container
    container.insertBefore(kpiPanel, container.firstChild);
    
    // Initialize charts
    setTimeout(() => {
        initializeCharts();
        updateKPIData();
    }, 100);
}

// Task 2.2-2.4: Initialize Chart.js charts
function initializeCharts() {
    // Task 2.2: Jobs Completed Bar Chart
    const jobsCtx = document.getElementById('jobsChart');
    if (jobsCtx) {
        window.jobsChart = new Chart(jobsCtx, {
            type: 'bar',
            data: {
                labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                datasets: [{
                    label: 'Jobs Completed',
                    data: [12, 19, 15, 17, 14, 22, 18],
                    backgroundColor: '#0047AB',
                    borderColor: '#003580',
                    borderWidth: 1,
                    borderRadius: 6
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        backgroundColor: '#333333',
                        titleColor: '#ffffff',
                        bodyColor: '#ffffff',
                        borderColor: '#0047AB',
                        borderWidth: 1,
                        padding: 12,
                        displayColors: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            stepSize: 5
                        }
                    }
                }
            }
        });
    }
    
    // Task 2.3: Revenue Line Chart
    const revenueCtx = document.getElementById('revenueChart');
    if (revenueCtx) {
        window.revenueChart = new Chart(revenueCtx, {
            type: 'line',
            data: {
                labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
                datasets: [{
                    label: 'Revenue',
                    data: [12500, 15800, 14200, 18900],
                    borderColor: '#0047AB',
                    backgroundColor: 'rgba(0, 71, 171, 0.1)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4,
                    pointRadius: 6,
                    pointHoverRadius: 8,
                    pointBackgroundColor: '#0047AB',
                    pointBorderColor: '#ffffff',
                    pointBorderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        backgroundColor: '#333333',
                        titleColor: '#ffffff',
                        bodyColor: '#ffffff',
                        borderColor: '#0047AB',
                        borderWidth: 1,
                        padding: 12,
                        displayColors: false,
                        callbacks: {
                            label: function(context) {
                                return '$' + context.parsed.y.toLocaleString();
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) {
                                return '$' + value.toLocaleString();
                            }
                        }
                    }
                }
            }
        });
    }
    
    // Task 2.4: Technician Performance Pie Chart
    const performanceCtx = document.getElementById('performanceChart');
    if (performanceCtx) {
        window.performanceChart = new Chart(performanceCtx, {
            type: 'doughnut',
            data: {
                labels: ['Completed', 'In Progress', 'Delayed'],
                datasets: [{
                    data: [65, 25, 10],
                    backgroundColor: ['#10b981', '#F5A623', '#ef4444'],
                    borderColor: '#ffffff',
                    borderWidth: 3
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            padding: 15,
                            font: {
                                size: 13
                            }
                        }
                    },
                    tooltip: {
                        backgroundColor: '#333333',
                        titleColor: '#ffffff',
                        bodyColor: '#ffffff',
                        borderColor: '#0047AB',
                        borderWidth: 1,
                        padding: 12,
                        callbacks: {
                            label: function(context) {
                                return context.label + ': ' + context.parsed + '%';
                            }
                        }
                    }
                }
            }
        });
    }
}

// Task 2.6: Update KPI Data based on date range
function updateKPIData() {
    const dateRange = document.getElementById('dateRangeFilter').value;
    
    // Simulate data update based on date range
    const data = getKPIDataForRange(dateRange);
    
    // Update summary cards
    document.getElementById('totalJobs').textContent = data.totalJobs;
    document.getElementById('totalRevenue').textContent = '$' + data.totalRevenue.toLocaleString();
    document.getElementById('completionRate').textContent = data.completionRate + '%';
    document.getElementById('avgRating').textContent = data.avgRating.toFixed(1);
    
    // Update charts
    if (window.jobsChart) {
        window.jobsChart.data.datasets[0].data = data.jobsData;
        window.jobsChart.update();
    }
    
    if (window.revenueChart) {
        window.revenueChart.data.datasets[0].data = data.revenueData;
        window.revenueChart.update();
    }
    
    if (window.performanceChart) {
        window.performanceChart.data.datasets[0].data = data.performanceData;
        window.performanceChart.update();
    }
}

function getKPIDataForRange(range) {
    // Simulate different data for different ranges
    const dataMap = {
        'today': {
            totalJobs: 8,
            totalRevenue: 3200,
            completionRate: 87,
            avgRating: 4.6,
            jobsData: [2, 3, 1, 2, 0, 0, 0],
            revenueData: [800, 1200, 600, 600],
            performanceData: [70, 20, 10]
        },
        '7days': {
            totalJobs: 117,
            totalRevenue: 61400,
            completionRate: 92,
            avgRating: 4.7,
            jobsData: [12, 19, 15, 17, 14, 22, 18],
            revenueData: [12500, 15800, 14200, 18900],
            performanceData: [65, 25, 10]
        },
        '30days': {
            totalJobs: 486,
            totalRevenue: 248500,
            completionRate: 94,
            avgRating: 4.8,
            jobsData: [45, 52, 48, 51, 49, 58, 53],
            revenueData: [58000, 62000, 59500, 69000],
            performanceData: [68, 22, 10]
        },
        '90days': {
            totalJobs: 1425,
            totalRevenue: 725000,
            completionRate: 93,
            avgRating: 4.7,
            jobsData: [135, 148, 142, 155, 145, 168, 162],
            revenueData: [175000, 185000, 178000, 187000],
            performanceData: [66, 24, 10]
        }
    };
    
    return dataMap[range] || dataMap['7days'];
}

function refreshKPIData() {
    showToast('Refreshing KPI data...', 'info');
    setTimeout(() => {
        updateKPIData();
        showToast('KPI data updated', 'success');
    }, 500);
}

// Task 2.7-2.8: Job Queue Widget
function createJobQueueWidget() {
    const container = document.getElementById('main-content') || document.querySelector('.container');
    if (!container || document.getElementById('job-queue-widget')) return;
    
    const jobQueue = document.createElement('div');
    jobQueue.id = 'job-queue-widget';
    jobQueue.className = 'job-queue-widget';
    jobQueue.innerHTML = `
        <div class="widget-header">
            <h2>📋 Job Queue</h2>
            <div class="widget-filters">
                <select id="statusFilter" class="form-select" onchange="filterJobQueue()">
                    <option value="all">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="in-progress">In Progress</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                </select>
                <select id="priorityFilter" class="form-select" onchange="filterJobQueue()">
                    <option value="all">All Priority</option>
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                </select>
                <select id="technicianFilter" class="form-select" onchange="filterJobQueue()">
                    <option value="all">All Technicians</option>
                    <option value="tech1">John Smith</option>
                    <option value="tech2">Sarah Johnson</option>
                    <option value="tech3">Mike Davis</option>
                    <option value="tech4">Emily Brown</option>
                </select>
            </div>
        </div>
        
        <div class="table-container">
            <table class="table" id="jobQueueTable">
                <thead>
                    <tr>
                        <th>Job ID</th>
                        <th>Customer</th>
                        <th>Status</th>
                        <th>Priority</th>
                        <th>Assigned To</th>
                        <th>Scheduled Date</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody id="jobQueueBody">
                    <!-- Jobs will be populated here -->
                </tbody>
            </table>
        </div>
    `;
    
    container.appendChild(jobQueue);
    populateJobQueue();
}

function populateJobQueue() {
    const tbody = document.getElementById('jobQueueBody');
    if (!tbody) return;
    
    const jobs = [
        { id: 'J-1001', customer: 'ABC Corp', status: 'in-progress', priority: 'high', tech: 'John Smith', date: '2025-10-15' },
        { id: 'J-1002', customer: 'XYZ Inc', status: 'pending', priority: 'medium', tech: 'Sarah Johnson', date: '2025-10-16' },
        { id: 'J-1003', customer: 'Tech Solutions', status: 'completed', priority: 'low', tech: 'Mike Davis', date: '2025-10-14' },
        { id: 'J-1004', customer: 'Global Systems', status: 'in-progress', priority: 'high', tech: 'Emily Brown', date: '2025-10-15' },
        { id: 'J-1005', customer: 'Smart Buildings', status: 'pending', priority: 'medium', tech: 'John Smith', date: '2025-10-17' }
    ];
    
    tbody.innerHTML = jobs.map(job => `
        <tr data-status="${job.status}" data-priority="${job.priority}" data-tech="${getTechId(job.tech)}">
            <td><strong>${job.id}</strong></td>
            <td>${job.customer}</td>
            <td><span class="badge badge-${getStatusClass(job.status)}">${job.status}</span></td>
            <td><span class="badge badge-${getPriorityClass(job.priority)}">${job.priority}</span></td>
            <td>${job.tech}</td>
            <td>${formatDate(job.date)}</td>
            <td>
                <button class="btn btn-sm btn-primary" onclick="viewJob('${job.id}')">View</button>
            </td>
        </tr>
    `).join('');
}

function filterJobQueue() {
    const statusFilter = document.getElementById('statusFilter').value;
    const priorityFilter = document.getElementById('priorityFilter').value;
    const techFilter = document.getElementById('technicianFilter').value;
    
    const rows = document.querySelectorAll('#jobQueueBody tr');
    
    rows.forEach(row => {
        const status = row.dataset.status;
        const priority = row.dataset.priority;
        const tech = row.dataset.tech;
        
        const statusMatch = statusFilter === 'all' || status === statusFilter;
        const priorityMatch = priorityFilter === 'all' || priority === priorityFilter;
        const techMatch = techFilter === 'all' || tech === techFilter;
        
        row.style.display = (statusMatch && priorityMatch && techMatch) ? '' : 'none';
    });
}

// Task 2.9: Notifications Panel
function createNotificationsPanel() {
    const container = document.getElementById('main-content') || document.querySelector('.container');
    if (!container || document.getElementById('notifications-panel')) return;
    
    const notificationsPanel = document.createElement('div');
    notificationsPanel.id = 'notifications-panel';
    notificationsPanel.className = 'notifications-panel';
    notificationsPanel.innerHTML = `
        <div class="widget-header">
            <h2>🔔 Notifications & Alerts</h2>
            <button class="btn btn-sm btn-secondary" onclick="markAllAsRead()">Mark All Read</button>
        </div>
        <div class="notifications-list" id="notificationsList">
            <!-- Notifications will be populated here -->
        </div>
    `;
    
    container.appendChild(notificationsPanel);
    populateNotifications();
}

function populateNotifications() {
    const list = document.getElementById('notificationsList');
    if (!list) return;
    
    const notifications = [
        { id: 1, type: 'urgent', message: 'Job J-1001 is overdue by 2 hours', time: '5 min ago', unread: true },
        { id: 2, type: 'warning', message: 'Low inventory: R-410A refrigerant (3 units left)', time: '15 min ago', unread: true },
        { id: 3, type: 'info', message: 'New job assigned to John Smith', time: '1 hour ago', unread: false },
        { id: 4, type: 'success', message: 'Job J-0998 completed successfully', time: '2 hours ago', unread: false }
    ];
    
    list.innerHTML = notifications.map(notif => `
        <div class="notification-item ${notif.unread ? 'unread' : ''}" data-id="${notif.id}">
            <div class="notification-icon ${notif.type}">${getNotificationIcon(notif.type)}</div>
            <div class="notification-content">
                <p>${notif.message}</p>
                <span class="notification-time">${notif.time}</span>
            </div>
            ${notif.unread ? '<div class="notification-badge"></div>' : ''}
        </div>
    `).join('');
}

// Task 2.11: Export Report Button
function addExportReportButton() {
    const kpiHeader = document.querySelector('.kpi-header .kpi-controls');
    if (!kpiHeader || document.getElementById('exportReportBtn')) return;
    
    const exportBtn = document.createElement('button');
    exportBtn.id = 'exportReportBtn';
    exportBtn.className = 'btn btn-sm btn-success';
    exportBtn.innerHTML = '📄 Export Report';
    exportBtn.onclick = exportDashboardReport;
    
    kpiHeader.appendChild(exportBtn);
}

function exportDashboardReport() {
    showToast('Generating PDF report...', 'info');
    
    // In production, this would generate a real PDF
    setTimeout(() => {
        showToast('Report exported successfully!', 'success');
        console.log('Dashboard report exported');
    }, 1500);
}

// Task 2.12: AI-Powered Alerts
function addAIPoweredAlerts() {
    // Analyze jobs and create AI alerts
    const alerts = analyzeJobsForRisks();
    
    if (alerts.length > 0) {
        alerts.forEach(alert => {
            showToast(alert.message, alert.type);
        });
    }
}

function analyzeJobsForRisks() {
    // Simulate AI analysis
    return [
        { message: '⚠️ AI Alert: Job J-1001 has high risk of delay based on technician workload', type: 'warning' },
        { message: '🤖 AI Insight: Consider reassigning jobs to balance technician workload', type: 'info' }
    ];
}

// Helper functions
function getStatusClass(status) {
    const map = {
        'pending': 'warning',
        'in-progress': 'primary',
        'completed': 'success',
        'cancelled': 'danger'
    };
    return map[status] || 'secondary';
}

function getPriorityClass(priority) {
    const map = {
        'high': 'danger',
        'medium': 'warning',
        'low': 'success'
    };
    return map[priority] || 'secondary';
}

function getTechId(techName) {
    const map = {
        'John Smith': 'tech1',
        'Sarah Johnson': 'tech2',
        'Mike Davis': 'tech3',
        'Emily Brown': 'tech4'
    };
    return map[techName] || 'tech1';
}

function formatDate(dateStr) {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function getNotificationIcon(type) {
    const icons = {
        'urgent': '🚨',
        'warning': '⚠️',
        'info': 'ℹ️',
        'success': '✅'
    };
    return icons[type] || 'ℹ️';
}

function viewJob(jobId) {
    showToast(`Opening job ${jobId}...`, 'info');
}

function markAllAsRead() {
    document.querySelectorAll('.notification-item.unread').forEach(item => {
        item.classList.remove('unread');
        const badge = item.querySelector('.notification-badge');
        if (badge) badge.remove();
    });
    showToast('All notifications marked as read', 'success');
}

console.log('Dashboard KPI Enhancement loaded');