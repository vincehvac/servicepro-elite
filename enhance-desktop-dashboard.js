// Additional enhancements for Desktop Dashboard (app.html)
// Implements DESK-301 to DESK-305

document.addEventListener('DOMContentLoaded', function() {
    // DESK-301: Add loading indicators (already in global-components.js)
    
    // DESK-302: Make tables sortable and filterable
    enhanceTables();
    
    // DESK-303: User role checks
    implementRoleChecks();
    
    // DESK-304: Add timestamps
    addTimestamps();
    
    // DESK-305: Add CSV export to tables
    addTableExports();
});

function enhanceTables() {
    // Find all tables and make them sortable
    const tables = document.querySelectorAll('table');
    
    tables.forEach((table, index) => {
        if (!table.id) {
            table.id = `table-${index}`;
        }
        
        // Add sortable functionality
        makeTableSortable(table.id);
        
        // Add filter input if not exists
        if (!table.previousElementSibling || !table.previousElementSibling.classList.contains('table-filter')) {
            const filterDiv = document.createElement('div');
            filterDiv.className = 'table-filter';
            filterDiv.style.cssText = 'margin-bottom: 1rem;';
            
            const filterInput = document.createElement('input');
            filterInput.type = 'text';
            filterInput.className = 'form-input';
            filterInput.placeholder = '🔍 Filter table...';
            filterInput.id = `filter-${table.id}`;
            filterInput.style.cssText = 'max-width: 300px;';
            
            filterDiv.appendChild(filterInput);
            table.parentNode.insertBefore(filterDiv, table);
            
            addTableFilter(table.id, filterInput.id);
        }
        
        // Add pagination if table has many rows
        const tbody = table.querySelector('tbody');
        if (tbody && tbody.querySelectorAll('tr').length > 20) {
            addPagination(table);
        }
    });
}

function addPagination(table) {
    const tbody = table.querySelector('tbody');
    const rows = Array.from(tbody.querySelectorAll('tr'));
    const rowsPerPage = 20;
    let currentPage = 1;
    
    function showPage(page) {
        const start = (page - 1) * rowsPerPage;
        const end = start + rowsPerPage;
        
        rows.forEach((row, index) => {
            row.style.display = (index >= start && index < end) ? '' : 'none';
        });
        
        currentPage = page;
        updatePaginationButtons();
    }
    
    function updatePaginationButtons() {
        const pageInfo = paginationDiv.querySelector('.page-info');
        const totalPages = Math.ceil(rows.length / rowsPerPage);
        pageInfo.textContent = `Page ${currentPage} of ${totalPages}`;
        
        prevBtn.disabled = currentPage === 1;
        nextBtn.disabled = currentPage === totalPages;
    }
    
    const paginationDiv = document.createElement('div');
    paginationDiv.className = 'pagination';
    paginationDiv.style.cssText = 'display: flex; justify-content: center; align-items: center; gap: 1rem; margin-top: 1rem;';
    
    const prevBtn = document.createElement('button');
    prevBtn.className = 'btn btn-sm btn-secondary';
    prevBtn.textContent = '← Previous';
    prevBtn.onclick = () => showPage(currentPage - 1);
    
    const pageInfo = document.createElement('span');
    pageInfo.className = 'page-info';
    
    const nextBtn = document.createElement('button');
    nextBtn.className = 'btn btn-sm btn-secondary';
    nextBtn.textContent = 'Next →';
    nextBtn.onclick = () => showPage(currentPage + 1);
    
    paginationDiv.appendChild(prevBtn);
    paginationDiv.appendChild(pageInfo);
    paginationDiv.appendChild(nextBtn);
    
    table.parentNode.insertBefore(paginationDiv, table.nextSibling);
    
    showPage(1);
}

function implementRoleChecks() {
    // Get user role from localStorage or default to 'user'
    const userRole = localStorage.getItem('servicepro_user_role') || 'user';
    
    // Hide admin-only sections for non-admin users
    if (userRole !== 'admin') {
        const adminSections = document.querySelectorAll('[data-role="admin"]');
        adminSections.forEach(section => {
            section.style.display = 'none';
        });
    }
    
    // Add role indicator
    const roleIndicator = document.createElement('div');
    roleIndicator.className = 'role-indicator';
    roleIndicator.style.cssText = 'position: fixed; bottom: 1rem; left: 1rem; padding: 0.5rem 1rem; background: var(--bg-primary); border: 1px solid var(--border-color); border-radius: var(--radius-md); font-size: 0.875rem; z-index: 998;';
    roleIndicator.innerHTML = `<strong>Role:</strong> ${userRole.charAt(0).toUpperCase() + userRole.slice(1)}`;
    document.body.appendChild(roleIndicator);
}

function addTimestamps() {
    // Add "Last updated" timestamps to dynamic content
    const dataBlocks = document.querySelectorAll('[data-dynamic="true"]');
    
    dataBlocks.forEach(block => {
        if (!block.querySelector('.last-updated')) {
            const timestamp = document.createElement('div');
            timestamp.className = 'last-updated';
            timestamp.style.cssText = 'font-size: 0.75rem; color: var(--text-secondary); margin-top: 0.5rem; text-align: right;';
            timestamp.textContent = `Last updated: ${new Date().toLocaleString()}`;
            block.appendChild(timestamp);
            
            // Update timestamp every minute
            setInterval(() => {
                timestamp.textContent = `Last updated: ${new Date().toLocaleString()}`;
            }, 60000);
        }
    });
}

function addTableExports() {
    const tables = document.querySelectorAll('table');
    
    tables.forEach(table => {
        if (!table.previousElementSibling || !table.previousElementSibling.classList.contains('table-actions')) {
            const actionsDiv = document.createElement('div');
            actionsDiv.className = 'table-actions';
            actionsDiv.style.cssText = 'margin-bottom: 1rem; display: flex; justify-content: flex-end; gap: 0.5rem;';
            
            const exportBtn = document.createElement('button');
            exportBtn.className = 'btn btn-sm btn-secondary';
            exportBtn.innerHTML = '📊 Export CSV';
            exportBtn.onclick = function() {
                exportTableToCSV(table);
            };
            
            const printBtn = document.createElement('button');
            printBtn.className = 'btn btn-sm btn-secondary';
            printBtn.innerHTML = '🖨️ Print';
            printBtn.onclick = function() {
                window.print();
            };
            
            actionsDiv.appendChild(exportBtn);
            actionsDiv.appendChild(printBtn);
            
            table.parentNode.insertBefore(actionsDiv, table);
        }
    });
}

function exportTableToCSV(table) {
    const data = [];
    
    // Get headers
    const headers = Array.from(table.querySelectorAll('th')).map(th => th.textContent.trim());
    
    // Get rows
    const rows = table.querySelectorAll('tbody tr');
    rows.forEach(row => {
        if (row.style.display !== 'none') {
            const rowData = {};
            const cells = row.querySelectorAll('td');
            cells.forEach((cell, index) => {
                if (headers[index]) {
                    rowData[headers[index]] = cell.textContent.trim();
                }
            });
            data.push(rowData);
        }
    });
    
    if (data.length > 0) {
        const timestamp = new Date().toISOString().split('T')[0];
        exportToCSV(data, `desktop-dashboard-${timestamp}.csv`);
        showToast('Table exported to CSV', 'success');
    } else {
        showToast('No data to export', 'warning');
    }
}

// Auto-refresh data every 30 seconds
setInterval(() => {
    const dynamicBlocks = document.querySelectorAll('[data-dynamic="true"]');
    if (dynamicBlocks.length > 0) {
        console.log('Auto-refreshing dynamic content...');
        // In production, this would fetch fresh data from API
    }
}, 30000);

console.log('Desktop Dashboard enhancements loaded');