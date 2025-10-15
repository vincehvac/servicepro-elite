// ServicePro Elite - Global Components and Utilities
// This file provides shared functionality across all applications

// ============================================
// GLOBAL NAVIGATION BAR (G-001)
// ============================================
function createGlobalNavigation() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    
    const nav = document.createElement('nav');
    nav.className = 'global-nav';
    nav.innerHTML = `
        <div class="nav-container">
            <div class="nav-brand">
                <span class="nav-logo">⚡</span>
                <span class="nav-title">ServicePro Elite</span>
            </div>
            <button class="nav-toggle" onclick="toggleMobileNav()" aria-label="Toggle navigation">
                <span></span>
                <span></span>
                <span></span>
            </button>
            <ul class="nav-links">
                <li><a href="index.html" class="${currentPage === 'index.html' || currentPage === '' ? 'active' : ''}">🏠 Dashboard</a></li>
                <li><a href="hvac-calculator.html" class="${currentPage === 'hvac-calculator.html' ? 'active' : ''}">🔧 Calculator</a></li>
                <li><a href="app.html" class="${currentPage === 'app.html' ? 'active' : ''}">🖥️ Desktop</a></li>
                <li><a href="mobile-tech.html" class="${currentPage === 'mobile-tech.html' ? 'active' : ''}">📱 Mobile</a></li>
                <li><a href="admin-dashboard.html" class="${currentPage === 'admin-dashboard.html' ? 'active' : ''}">🛠️ Admin</a></li>
            </ul>
            <div class="nav-actions">
                <button class="theme-toggle" onclick="toggleDarkMode()" aria-label="Toggle dark mode">
                    <span class="theme-icon">🌙</span>
                </button>
            </div>
        </div>
    `;
    
    // Insert at the beginning of body
    if (document.body.firstChild) {
        document.body.insertBefore(nav, document.body.firstChild);
    } else {
        document.body.appendChild(nav);
    }
}

function toggleMobileNav() {
    const nav = document.querySelector('.global-nav');
    nav.classList.toggle('mobile-open');
}

// ============================================
// DARK MODE TOGGLE (G-002)
// ============================================
function initDarkMode() {
    // Check for saved preference or default to light mode
    const savedTheme = localStorage.getItem('servicepro_theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);
}

function toggleDarkMode() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('servicepro_theme', newTheme);
    updateThemeIcon(newTheme);
}

function updateThemeIcon(theme) {
    const icon = document.querySelector('.theme-icon');
    if (icon) {
        icon.textContent = theme === 'dark' ? '☀️' : '🌙';
    }
}

// ============================================
// SCROLL TO TOP BUTTON (MD-103)
// ============================================
function createScrollToTop() {
    const button = document.createElement('button');
    button.className = 'scroll-to-top';
    button.innerHTML = '↑';
    button.setAttribute('aria-label', 'Scroll to top');
    button.onclick = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };
    document.body.appendChild(button);
    
    // Show/hide based on scroll position
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            button.classList.add('visible');
        } else {
            button.classList.remove('visible');
        }
    });
}

// ============================================
// LOADING SPINNER (DESK-301)
// ============================================
function showLoading(message = 'Loading...') {
    const loader = document.createElement('div');
    loader.className = 'global-loader';
    loader.innerHTML = `
        <div class="loader-content">
            <div class="spinner"></div>
            <p>${message}</p>
        </div>
    `;
    document.body.appendChild(loader);
    return loader;
}

function hideLoading(loader) {
    if (loader && loader.parentNode) {
        loader.parentNode.removeChild(loader);
    }
}

// ============================================
// TOAST NOTIFICATIONS
// ============================================
function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
        <span class="toast-icon">${getToastIcon(type)}</span>
        <span class="toast-message">${message}</span>
        <button class="toast-close" onclick="this.parentElement.remove()">×</button>
    `;
    
    document.body.appendChild(toast);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (toast.parentNode) {
            toast.classList.add('fade-out');
            setTimeout(() => toast.remove(), 300);
        }
    }, 5000);
}

function getToastIcon(type) {
    const icons = {
        success: '✓',
        error: '✗',
        warning: '⚠',
        info: 'ℹ'
    };
    return icons[type] || icons.info;
}

// ============================================
// FORM VALIDATION (CALC-201)
// ============================================
function validateInput(input, options = {}) {
    const value = input.value.trim();
    const {
        required = false,
        min = null,
        max = null,
        type = 'number',
        pattern = null
    } = options;
    
    let isValid = true;
    let errorMessage = '';
    
    // Required check
    if (required && !value) {
        isValid = false;
        errorMessage = 'This field is required';
    }
    
    // Type validation
    if (value && type === 'number') {
        const numValue = parseFloat(value);
        if (isNaN(numValue)) {
            isValid = false;
            errorMessage = 'Please enter a valid number';
        } else {
            // Min/Max validation
            if (min !== null && numValue < min) {
                isValid = false;
                errorMessage = `Value must be at least ${min}`;
            }
            if (max !== null && numValue > max) {
                isValid = false;
                errorMessage = `Value must be at most ${max}`;
            }
        }
    }
    
    // Pattern validation
    if (value && pattern && !pattern.test(value)) {
        isValid = false;
        errorMessage = 'Invalid format';
    }
    
    // Update UI
    if (isValid) {
        input.classList.remove('error');
        const errorEl = input.parentElement.querySelector('.error-message');
        if (errorEl) errorEl.style.display = 'none';
    } else {
        input.classList.add('error');
        let errorEl = input.parentElement.querySelector('.error-message');
        if (!errorEl) {
            errorEl = document.createElement('div');
            errorEl.className = 'error-message';
            input.parentElement.appendChild(errorEl);
        }
        errorEl.textContent = errorMessage;
        errorEl.style.display = 'block';
    }
    
    return isValid;
}

// ============================================
// CSV EXPORT (DESK-305, CALC-205)
// ============================================
function exportToCSV(data, filename) {
    if (!data || data.length === 0) {
        showToast('No data to export', 'warning');
        return;
    }
    
    // Get headers from first object
    const headers = Object.keys(data[0]);
    
    // Create CSV content
    let csv = headers.join(',') + '\n';
    data.forEach(row => {
        const values = headers.map(header => {
            const value = row[header];
            // Escape commas and quotes
            return typeof value === 'string' && (value.includes(',') || value.includes('"'))
                ? `"${value.replace(/"/g, '""')}"`
                : value;
        });
        csv += values.join(',') + '\n';
    });
    
    // Download
    downloadFile(csv, filename, 'text/csv');
}

function exportToPDF(elementId, filename) {
    const element = document.getElementById(elementId);
    if (!element) {
        showToast('Element not found', 'error');
        return;
    }
    
    // Create print-friendly version
    const printWindow = window.open('', '', 'width=800,height=600');
    printWindow.document.write(`
        <html>
        <head>
            <title>${filename}</title>
            <style>
                body { font-family: Arial, sans-serif; padding: 20px; }
                table { border-collapse: collapse; width: 100%; }
                th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                th { background-color: #f2f2f2; }
            </style>
        </head>
        <body>
            ${element.innerHTML}
        </body>
        </html>
    `);
    printWindow.document.close();
    printWindow.print();
}

function downloadFile(content, filename, mimeType) {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

// ============================================
// OFFLINE STORAGE (MOB-403)
// ============================================
const OfflineStorage = {
    db: null,
    
    async init() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open('ServiceProElite', 1);
            
            request.onerror = () => reject(request.error);
            request.onsuccess = () => {
                this.db = request.result;
                resolve();
            };
            
            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                
                // Create object stores
                if (!db.objectStoreNames.contains('jobs')) {
                    db.createObjectStore('jobs', { keyPath: 'id', autoIncrement: true });
                }
                if (!db.objectStoreNames.contains('calculations')) {
                    db.createObjectStore('calculations', { keyPath: 'id', autoIncrement: true });
                }
                if (!db.objectStoreNames.contains('sync_queue')) {
                    db.createObjectStore('sync_queue', { keyPath: 'id', autoIncrement: true });
                }
            };
        });
    },
    
    async save(storeName, data) {
        const transaction = this.db.transaction([storeName], 'readwrite');
        const store = transaction.objectStore(storeName);
        return store.add(data);
    },
    
    async getAll(storeName) {
        const transaction = this.db.transaction([storeName], 'readonly');
        const store = transaction.objectStore(storeName);
        return new Promise((resolve, reject) => {
            const request = store.getAll();
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    },
    
    async update(storeName, data) {
        const transaction = this.db.transaction([storeName], 'readwrite');
        const store = transaction.objectStore(storeName);
        return store.put(data);
    },
    
    async delete(storeName, id) {
        const transaction = this.db.transaction([storeName], 'readwrite');
        const store = transaction.objectStore(storeName);
        return store.delete(id);
    }
};

// ============================================
// ACCESSIBILITY HELPERS (G-005)
// ============================================
function enhanceAccessibility() {
    // Add skip to main content link
    const skipLink = document.createElement('a');
    skipLink.href = '#main-content';
    skipLink.className = 'skip-link';
    skipLink.textContent = 'Skip to main content';
    document.body.insertBefore(skipLink, document.body.firstChild);
    
    // Ensure all images have alt text
    document.querySelectorAll('img:not([alt])').forEach(img => {
        img.setAttribute('alt', 'Image');
    });
    
    // Add aria-labels to buttons without text
    document.querySelectorAll('button:not([aria-label])').forEach(btn => {
        if (!btn.textContent.trim()) {
            btn.setAttribute('aria-label', 'Button');
        }
    });
    
    // Ensure form inputs have labels
    document.querySelectorAll('input, select, textarea').forEach(input => {
        if (!input.id) {
            input.id = 'input-' + Math.random().toString(36).substr(2, 9);
        }
        const label = document.querySelector(`label[for="${input.id}"]`);
        if (!label && !input.getAttribute('aria-label')) {
            input.setAttribute('aria-label', input.placeholder || input.name || 'Input field');
        }
    });
}

// ============================================
// TABLE UTILITIES (DESK-302)
// ============================================
function makeTableSortable(tableId) {
    const table = document.getElementById(tableId);
    if (!table) return;
    
    const headers = table.querySelectorAll('th');
    headers.forEach((header, index) => {
        header.style.cursor = 'pointer';
        header.setAttribute('role', 'button');
        header.setAttribute('aria-label', `Sort by ${header.textContent}`);
        
        header.addEventListener('click', () => {
            sortTable(table, index);
        });
    });
}

function sortTable(table, columnIndex) {
    const tbody = table.querySelector('tbody');
    const rows = Array.from(tbody.querySelectorAll('tr'));
    
    const isAscending = table.dataset.sortOrder !== 'asc';
    table.dataset.sortOrder = isAscending ? 'asc' : 'desc';
    
    rows.sort((a, b) => {
        const aValue = a.cells[columnIndex].textContent.trim();
        const bValue = b.cells[columnIndex].textContent.trim();
        
        // Try numeric comparison first
        const aNum = parseFloat(aValue);
        const bNum = parseFloat(bValue);
        
        if (!isNaN(aNum) && !isNaN(bNum)) {
            return isAscending ? aNum - bNum : bNum - aNum;
        }
        
        // String comparison
        return isAscending 
            ? aValue.localeCompare(bValue)
            : bValue.localeCompare(aValue);
    });
    
    rows.forEach(row => tbody.appendChild(row));
}

function addTableFilter(tableId, filterInputId) {
    const table = document.getElementById(tableId);
    const filterInput = document.getElementById(filterInputId);
    
    if (!table || !filterInput) return;
    
    filterInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        const rows = table.querySelectorAll('tbody tr');
        
        rows.forEach(row => {
            const text = row.textContent.toLowerCase();
            row.style.display = text.includes(searchTerm) ? '' : 'none';
        });
    });
}

// ============================================
// INITIALIZATION
// ============================================
function initGlobalComponents() {
    // Initialize dark mode
    initDarkMode();
    
    // Create global navigation
    createGlobalNavigation();
    
    // Create scroll to top button
    createScrollToTop();
    
    // Enhance accessibility
    enhanceAccessibility();
    
    // Initialize offline storage
    if ('indexedDB' in window) {
        OfflineStorage.init().catch(console.error);
    }
    
    // Register service worker for PWA
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/servicepro-elite/sw.js')
            .catch(err => console.log('Service worker registration failed:', err));
    }
}

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initGlobalComponents);
} else {
    initGlobalComponents();
}