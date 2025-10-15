// Additional enhancements for Admin Dashboard (admin-dashboard.html)
// Implements ADMIN-501 to ADMIN-505

document.addEventListener('DOMContentLoaded', function() {
    // ADMIN-501: Add chart filters
    addChartFilters();
    
    // ADMIN-502: Implement audit log
    setupAuditLog();
    
    // ADMIN-503: Highlight low inventory alerts
    highlightInventoryAlerts();
    
    // ADMIN-504: Add bulk actions
    addBulkActions();
    
    // ADMIN-505: Route protection
    implementRouteProtection();
});

function addChartFilters() {
    // Find all chart containers
    const charts = document.querySelectorAll('[data-chart="true"], .chart-container');
    
    charts.forEach(chart => {
        if (!chart.querySelector('.chart-filters')) {
            const filtersDiv = document.createElement('div');
            filtersDiv.className = 'chart-filters';
            filtersDiv.style.cssText = 'display: flex; gap: 0.5rem; margin-bottom: 1rem; flex-wrap: wrap;';
            
            // Date range filter
            const dateFilter = document.createElement('select');
            dateFilter.className = 'form-select';
            dateFilter.style.cssText = 'max-width: 150px;';
            dateFilter.innerHTML = `
                <option value="today">Today</option>
                <option value="week" selected>This Week</option>
                <option value="month">This Month</option>
                <option value="quarter">This Quarter</option>
                <option value="year">This Year</option>
                <option value="custom">Custom Range</option>
            `;
            
            // Job type filter
            const typeFilter = document.createElement('select');
            typeFilter.className = 'form-select';
            typeFilter.style.cssText = 'max-width: 150px;';
            typeFilter.innerHTML = `
                <option value="all">All Job Types</option>
                <option value="maintenance">Maintenance</option>
                <option value="repair">Repair</option>
                <option value="installation">Installation</option>
                <option value="diagnostic">Diagnostic</option>
            `;
            
            // Technician filter
            const techFilter = document.createElement('select');
            techFilter.className = 'form-select';
            techFilter.style.cssText = 'max-width: 150px;';
            techFilter.innerHTML = `
                <option value="all">All Technicians</option>
                <option value="team-a">Team A</option>
                <option value="team-b">Team B</option>
                <option value="team-c">Team C</option>
            `;
            
            // Apply button
            const applyBtn = document.createElement('button');
            applyBtn.className = 'btn btn-sm btn-primary';
            applyBtn.textContent = 'Apply Filters';
            applyBtn.onclick = function() {
                const filters = {
                    dateRange: dateFilter.value,
                    jobType: typeFilter.value,
                    technician: techFilter.value
                };
                applyChartFilters(chart, filters);
            };
            
            filtersDiv.appendChild(dateFilter);
            filtersDiv.appendChild(typeFilter);
            filtersDiv.appendChild(techFilter);
            filtersDiv.appendChild(applyBtn);
            
            chart.insertBefore(filtersDiv, chart.firstChild);
        }
    });
}

function applyChartFilters(chart, filters) {
    console.log('Applying filters:', filters);
    showToast('Filters applied - chart updated', 'success');
    
    // In production, this would fetch filtered data from API
    // and update the chart
}

function setupAuditLog() {
    // Create audit log storage
    if (!localStorage.getItem('servicepro_audit_log')) {
        localStorage.setItem('servicepro_audit_log', JSON.stringify([]));
    }
    
    // Log function
    window.logAuditEvent = function(action, details) {
        const log = JSON.parse(localStorage.getItem('servicepro_audit_log') || '[]');
        
        const event = {
            id: Date.now(),
            timestamp: new Date().toISOString(),
            user: localStorage.getItem('servicepro_user_email') || 'admin@servicepro.com',
            action: action,
            details: details,
            ipAddress: 'N/A' // In production, get from server
        };
        
        log.unshift(event);
        
        // Keep last 1000 events
        if (log.length > 1000) {
            log.splice(1000);
        }
        
        localStorage.setItem('servicepro_audit_log', JSON.stringify(log));
        console.log('Audit event logged:', event);
    };
    
    // Add audit log viewer button
    const auditBtn = document.createElement('button');
    auditBtn.className = 'btn btn-secondary';
    auditBtn.style.cssText = 'position: fixed; bottom: 5rem; right: 1rem; z-index: 998;';
    auditBtn.innerHTML = '📋 Audit Log';
    auditBtn.onclick = showAuditLog;
    document.body.appendChild(auditBtn);
    
    // Intercept form submissions and data changes
    document.addEventListener('submit', function(e) {
        const form = e.target;
        if (form.tagName === 'FORM') {
            logAuditEvent('Form Submitted', `Form: ${form.id || 'unnamed'}`);
        }
    });
}

function showAuditLog() {
    const log = JSON.parse(localStorage.getItem('servicepro_audit_log') || '[]');
    
    const modal = document.createElement('div');
    modal.className = 'audit-log-modal';
    modal.style.cssText = 'position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0, 0, 0, 0.5); display: flex; align-items: center; justify-content: center; z-index: 10000; padding: 1rem;';
    
    const content = document.createElement('div');
    content.style.cssText = 'background: var(--bg-primary); padding: 2rem; border-radius: 1rem; max-width: 800px; width: 100%; max-height: 80vh; overflow-y: auto;';
    
    let html = `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
            <h2 style="color: var(--text-primary);">Audit Log</h2>
            <button class="btn btn-sm btn-secondary" onclick="this.closest('.audit-log-modal').remove()">Close</button>
        </div>
        <div style="margin-bottom: 1rem;">
            <button class="btn btn-sm btn-secondary" onclick="exportAuditLog()">📊 Export CSV</button>
        </div>
        <div class="table-container">
            <table class="table">
                <thead>
                    <tr>
                        <th>Timestamp</th>
                        <th>User</th>
                        <th>Action</th>
                        <th>Details</th>
                    </tr>
                </thead>
                <tbody>
    `;
    
    log.slice(0, 100).forEach(event => {
        const date = new Date(event.timestamp).toLocaleString();
        html += `
            <tr>
                <td>${date}</td>
                <td>${event.user}</td>
                <td><span class="badge badge-primary">${event.action}</span></td>
                <td>${event.details}</td>
            </tr>
        `;
    });
    
    html += `
                </tbody>
            </table>
        </div>
        ${log.length > 100 ? `<p style="text-align: center; margin-top: 1rem; color: var(--text-secondary);">Showing 100 of ${log.length} events</p>` : ''}
    `;
    
    content.innerHTML = html;
    modal.appendChild(content);
    document.body.appendChild(modal);
}

window.exportAuditLog = function() {
    const log = JSON.parse(localStorage.getItem('servicepro_audit_log') || '[]');
    const data = log.map(event => ({
        Timestamp: new Date(event.timestamp).toLocaleString(),
        User: event.user,
        Action: event.action,
        Details: event.details
    }));
    
    exportToCSV(data, `audit-log-${new Date().toISOString().split('T')[0]}.csv`);
    showToast('Audit log exported', 'success');
};

function highlightInventoryAlerts() {
    // Find inventory items
    const inventoryItems = document.querySelectorAll('[data-inventory="true"], .inventory-item');
    
    inventoryItems.forEach(item => {
        const quantityEl = item.querySelector('[data-quantity]');
        if (quantityEl) {
            const quantity = parseInt(quantityEl.dataset.quantity || quantityEl.textContent);
            const minQuantity = parseInt(quantityEl.dataset.min || 10);
            
            if (quantity <= minQuantity) {
                // Add alert styling
                item.style.cssText = 'border-left: 4px solid var(--danger-color); background: rgba(239, 68, 68, 0.1);';
                
                // Add badge
                if (!item.querySelector('.alert-badge')) {
                    const badge = document.createElement('span');
                    badge.className = 'badge badge-danger alert-badge';
                    badge.textContent = '⚠️ Low Stock';
                    badge.style.cssText = 'position: absolute; top: 0.5rem; right: 0.5rem;';
                    item.style.position = 'relative';
                    item.appendChild(badge);
                }
                
                // Add to notification count
                updateNotificationBadge();
            }
        }
    });
}

function updateNotificationBadge() {
    const lowStockItems = document.querySelectorAll('.alert-badge').length;
    
    if (lowStockItems > 0) {
        let badge = document.querySelector('.notification-badge');
        if (!badge) {
            badge = document.createElement('div');
            badge.className = 'notification-badge';
            badge.style.cssText = 'position: fixed; top: 1rem; right: 1rem; background: var(--danger-color); color: white; width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; z-index: 999; cursor: pointer;';
            badge.onclick = () => {
                showToast(`${lowStockItems} items need attention`, 'warning');
            };
            document.body.appendChild(badge);
        }
        badge.textContent = lowStockItems;
    }
}

function addBulkActions() {
    // Find tables with selectable rows
    const tables = document.querySelectorAll('table');
    
    tables.forEach(table => {
        const tbody = table.querySelector('tbody');
        if (!tbody) return;
        
        // Add checkboxes to rows
        const rows = tbody.querySelectorAll('tr');
        rows.forEach(row => {
            if (!row.querySelector('.row-checkbox')) {
                const checkboxCell = document.createElement('td');
                checkboxCell.innerHTML = '<input type="checkbox" class="row-checkbox" style="cursor: pointer;">';
                row.insertBefore(checkboxCell, row.firstChild);
            }
        });
        
        // Add checkbox to header
        const thead = table.querySelector('thead tr');
        if (thead && !thead.querySelector('.header-checkbox')) {
            const headerCheckbox = document.createElement('th');
            headerCheckbox.innerHTML = '<input type="checkbox" class="header-checkbox" style="cursor: pointer;">';
            thead.insertBefore(headerCheckbox, thead.firstChild);
            
            // Select all functionality
            headerCheckbox.querySelector('input').onchange = function() {
                const checkboxes = tbody.querySelectorAll('.row-checkbox');
                checkboxes.forEach(cb => cb.checked = this.checked);
                updateBulkActions(table);
            };
        }
        
        // Add bulk actions toolbar
        if (!table.previousElementSibling || !table.previousElementSibling.classList.contains('bulk-actions')) {
            const bulkActionsDiv = document.createElement('div');
            bulkActionsDiv.className = 'bulk-actions';
            bulkActionsDiv.style.cssText = 'display: none; margin-bottom: 1rem; padding: 1rem; background: var(--bg-secondary); border-radius: var(--radius-md); gap: 0.5rem;';
            
            bulkActionsDiv.innerHTML = `
                <span class="selected-count" style="margin-right: 1rem; font-weight: 600;">0 selected</span>
                <button class="btn btn-sm btn-primary" onclick="bulkReassign()">📋 Reassign</button>
                <button class="btn btn-sm btn-secondary" onclick="bulkSchedule()">📅 Schedule</button>
                <button class="btn btn-sm btn-warning" onclick="bulkArchive()">📦 Archive</button>
                <button class="btn btn-sm btn-danger" onclick="bulkDelete()">🗑️ Delete</button>
            `;
            
            table.parentNode.insertBefore(bulkActionsDiv, table);
        }
        
        // Update bulk actions on checkbox change
        tbody.addEventListener('change', function(e) {
            if (e.target.classList.contains('row-checkbox')) {
                updateBulkActions(table);
            }
        });
    });
}

function updateBulkActions(table) {
    const bulkActionsDiv = table.previousElementSibling;
    if (!bulkActionsDiv || !bulkActionsDiv.classList.contains('bulk-actions')) return;
    
    const checkedBoxes = table.querySelectorAll('.row-checkbox:checked');
    const count = checkedBoxes.length;
    
    if (count > 0) {
        bulkActionsDiv.style.display = 'flex';
        bulkActionsDiv.querySelector('.selected-count').textContent = `${count} selected`;
    } else {
        bulkActionsDiv.style.display = 'none';
    }
}

window.bulkReassign = function() {
    const count = document.querySelectorAll('.row-checkbox:checked').length;
    showToast(`Reassigning ${count} items...`, 'info');
    logAuditEvent('Bulk Reassign', `${count} items reassigned`);
};

window.bulkSchedule = function() {
    const count = document.querySelectorAll('.row-checkbox:checked').length;
    showToast(`Scheduling ${count} items...`, 'info');
    logAuditEvent('Bulk Schedule', `${count} items scheduled`);
};

window.bulkArchive = function() {
    const count = document.querySelectorAll('.row-checkbox:checked').length;
    if (confirm(`Archive ${count} items?`)) {
        showToast(`${count} items archived`, 'success');
        logAuditEvent('Bulk Archive', `${count} items archived`);
    }
};

window.bulkDelete = function() {
    const count = document.querySelectorAll('.row-checkbox:checked').length;
    if (confirm(`Delete ${count} items? This cannot be undone.`)) {
        showToast(`${count} items deleted`, 'success');
        logAuditEvent('Bulk Delete', `${count} items deleted`);
    }
};

function implementRouteProtection() {
    // Check if user is authenticated
    const isAuthenticated = localStorage.getItem('servicepro_authenticated') === 'true';
    const userRole = localStorage.getItem('servicepro_user_role') || 'user';
    
    if (!isAuthenticated) {
        // Show login prompt
        showLoginPrompt();
    } else if (userRole !== 'admin') {
        // Show access denied for non-admin users
        showAccessDenied();
    } else {
        // User is authenticated and authorized
        console.log('Admin access granted');
        logAuditEvent('Admin Dashboard Access', 'User accessed admin dashboard');
    }
}

function showLoginPrompt() {
    const modal = document.createElement('div');
    modal.style.cssText = 'position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0, 0, 0, 0.8); display: flex; align-items: center; justify-content: center; z-index: 10001;';
    
    modal.innerHTML = `
        <div style="background: var(--bg-primary); padding: 2rem; border-radius: 1rem; max-width: 400px; width: 100%; margin: 1rem;">
            <h2 style="margin-bottom: 1rem; color: var(--text-primary);">🔒 Admin Login Required</h2>
            <p style="margin-bottom: 1.5rem; color: var(--text-secondary);">Please log in to access the admin dashboard.</p>
            <div class="form-group">
                <label class="form-label">Email</label>
                <input type="email" id="login-email" class="form-input" placeholder="admin@servicepro.com">
            </div>
            <div class="form-group">
                <label class="form-label">Password</label>
                <input type="password" id="login-password" class="form-input" placeholder="Enter password">
            </div>
            <div style="display: flex; gap: 0.5rem; justify-content: flex-end;">
                <button class="btn btn-secondary" onclick="window.location.href='index.html'">Cancel</button>
                <button class="btn btn-primary" onclick="handleAdminLogin()">Login</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
}

window.handleAdminLogin = function() {
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    
    // In production, validate against server
    // For demo, accept any credentials
    if (email && password) {
        localStorage.setItem('servicepro_authenticated', 'true');
        localStorage.setItem('servicepro_user_role', 'admin');
        localStorage.setItem('servicepro_user_email', email);
        
        showToast('Login successful', 'success');
        logAuditEvent('Admin Login', `User ${email} logged in`);
        
        // Remove modal
        document.querySelector('[style*="z-index: 10001"]').remove();
    } else {
        showToast('Please enter email and password', 'error');
    }
};

function showAccessDenied() {
    const modal = document.createElement('div');
    modal.style.cssText = 'position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0, 0, 0, 0.8); display: flex; align-items: center; justify-content: center; z-index: 10001;';
    
    modal.innerHTML = `
        <div style="background: var(--bg-primary); padding: 2rem; border-radius: 1rem; max-width: 400px; width: 100%; margin: 1rem; text-align: center;">
            <div style="font-size: 4rem; margin-bottom: 1rem;">🚫</div>
            <h2 style="margin-bottom: 1rem; color: var(--text-primary);">Access Denied</h2>
            <p style="margin-bottom: 1.5rem; color: var(--text-secondary);">You don't have permission to access the admin dashboard.</p>
            <button class="btn btn-primary" onclick="window.location.href='index.html'">Return to Dashboard</button>
        </div>
    `;
    
    document.body.appendChild(modal);
}

console.log('Admin Dashboard enhancements loaded');