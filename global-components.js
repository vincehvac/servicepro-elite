// ServicePro Elite - Global Components and Utilities
// This file provides shared functionality across all applications

// ============================================
// GLOBAL NAVIGATION BAR - Task 1.4
// ============================================
function createGlobalNavigation() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const userName = localStorage.getItem('servicepro_user_name') || 'User';
    const userEmail = localStorage.getItem('servicepro_user_email') || 'user@servicepro.com';
    const userInitials = userName.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
    
    // Get page title
    const pageTitles = {
        'index.html': 'Main Dashboard',
        'hvac-calculator.html': 'HVAC Calculator',
        'app.html': 'Desktop Dashboard',
        'mobile-tech.html': 'Mobile Tech App',
        'admin-dashboard.html': 'Admin Dashboard'
    };
    const pageTitle = pageTitles[currentPage] || 'ServicePro Elite';
    
    const nav = document.createElement('nav');
    nav.className = 'global-nav';
    nav.innerHTML = `
        <div class="nav-container">
            <div class="nav-brand">
                <span class="nav-logo">⚡</span>
                <span>ServicePro Elite</span>
            </div>
            
            <div class="nav-title">${pageTitle}</div>
            
            <div class="nav-actions">
                <button class="theme-toggle" onclick="toggleDarkMode()" aria-label="Toggle dark mode">
                    <span class="theme-icon">🌙</span>
                </button>
                <div class="user-profile" onclick="toggleUserDropdown()" role="button" tabindex="0" aria-label="User menu">
                    <div class="user-avatar">${userInitials}</div>
                    <span class="user-name">${userName}</span>
                    <span class="user-dropdown-icon">▼</span>
                </div>
            </div>
            
            <button class="nav-toggle" onclick="toggleMobileNav()" aria-label="Toggle navigation">
                <span></span>
                <span></span>
                <span></span>
            </button>
        </div>
        
        <div class="user-dropdown" id="userDropdown">
            <a href="index.html">🏠 Main Dashboard</a>
            <a href="hvac-calculator.html">🔧 HVAC Calculator</a>
            <a href="app.html">🖥️ Desktop Dashboard</a>
            <a href="mobile-tech.html">📱 Mobile Tech App</a>
            <a href="admin-dashboard.html">🛠️ Admin Dashboard</a>
            <hr>
            <a href="#" onclick="showProfileSettings(); return false;">⚙️ Settings</a>
            <a href="#" onclick="showHelpCenter(); return false;">❓ Help Center</a>
            <hr>
            <button onclick="handleLogout()">🚪 Logout</button>
        </div>
    `;
    
    // Insert at the beginning of body
    if (document.body.firstChild) {
        document.body.insertBefore(nav, document.body.firstChild);
    } else {
        document.body.appendChild(nav);
    }
    
    // Close dropdown when clicking outside
    document.addEventListener('click', function(e) {
        const dropdown = document.getElementById('userDropdown');
        const profile = document.querySelector('.user-profile');
        if (dropdown && !profile.contains(e.target) && !dropdown.contains(e.target)) {
            dropdown.classList.remove('show');
        }
    });
}

function toggleUserDropdown() {
    const dropdown = document.getElementById('userDropdown');
    if (dropdown) {
        dropdown.classList.toggle('show');
    }
}

function showProfileSettings() {
    showToast('Profile settings coming soon!', 'info');
}

function showHelpCenter() {
    showToast('Help center coming soon!', 'info');
}

function handleLogout() {
    if (confirm('Are you sure you want to logout?')) {
        localStorage.removeItem('servicepro_authenticated');
        localStorage.removeItem('servicepro_user_role');
        showToast('Logged out successfully', 'success');
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1000);
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
// ACCESSIBILITY HELPERS - Tasks 1.6 & 1.7
// ============================================
function enhanceAccessibility() {
    // Add skip to main content link
    const skipLink = document.createElement('a');
    skipLink.href = '#main-content';
    skipLink.className = 'skip-link';
    skipLink.textContent = 'Skip to main content';
    skipLink.setAttribute('tabindex', '0');
    document.body.insertBefore(skipLink, document.body.firstChild);
    
    // Ensure all images have alt text
    document.querySelectorAll('img:not([alt])').forEach(img => {
        img.setAttribute('alt', img.title || 'Image');
    });
    
    // Add aria-labels to buttons without text or with icons only
    document.querySelectorAll('button:not([aria-label])').forEach(btn => {
        if (!btn.textContent.trim() || btn.textContent.trim().match(/^[^\w\s]+$/)) {
            const title = btn.getAttribute('title') || btn.getAttribute('data-tooltip') || 'Button';
            btn.setAttribute('aria-label', title);
        }
    });
    
    // Add aria-labels to links without text
    document.querySelectorAll('a:not([aria-label])').forEach(link => {
        if (!link.textContent.trim() || link.textContent.trim().match(/^[^\w\s]+$/)) {
            const title = link.getAttribute('title') || link.getAttribute('href') || 'Link';
            link.setAttribute('aria-label', title);
        }
    });
    
    // Ensure form inputs have proper labels and aria attributes
    document.querySelectorAll('input, select, textarea').forEach(input => {
        if (!input.id) {
            input.id = 'input-' + Math.random().toString(36).substr(2, 9);
        }
        const label = document.querySelector(`label[for="${input.id}"]`);
        if (!label && !input.getAttribute('aria-label')) {
            const ariaLabel = input.placeholder || input.name || input.type || 'Input field';
            input.setAttribute('aria-label', ariaLabel);
        }
        
        // Add aria-required for required fields
        if (input.hasAttribute('required') && !input.hasAttribute('aria-required')) {
            input.setAttribute('aria-required', 'true');
        }
        
        // Add aria-invalid for fields with errors
        if (input.classList.contains('error')) {
            input.setAttribute('aria-invalid', 'true');
        }
    });
    
    // Add role attributes to interactive elements
    document.querySelectorAll('[onclick]:not([role])').forEach(el => {
        if (el.tagName !== 'BUTTON' && el.tagName !== 'A') {
            el.setAttribute('role', 'button');
            if (!el.hasAttribute('tabindex')) {
                el.setAttribute('tabindex', '0');
            }
        }
    });
    
    // Ensure proper heading hierarchy
    const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
    headings.forEach(heading => {
        if (!heading.id) {
            const text = heading.textContent.trim().toLowerCase().replace(/\s+/g, '-');
            heading.id = 'heading-' + text.substring(0, 30);
        }
    });
    
    // Add keyboard navigation support - Task 1.7
    setupKeyboardNavigation();
}

// Task 1.7: Keyboard Navigation
function setupKeyboardNavigation() {
    // Handle Enter and Space on role="button" elements
    document.querySelectorAll('[role="button"]').forEach(el => {
        el.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });
    });
    
    // Trap focus in modals
    document.addEventListener('keydown', function(e) {
        const modal = document.querySelector('.modal:not([style*="display: none"]), [role="dialog"]:not([style*="display: none"])');
        if (modal && e.key === 'Tab') {
            const focusableElements = modal.querySelectorAll(
                'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
            );
            const firstElement = focusableElements[0];
            const lastElement = focusableElements[focusableElements.length - 1];
            
            if (e.shiftKey && document.activeElement === firstElement) {
                e.preventDefault();
                lastElement.focus();
            } else if (!e.shiftKey && document.activeElement === lastElement) {
                e.preventDefault();
                firstElement.focus();
            }
        }
    });
    
    // Escape key to close modals and dropdowns
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            // Close user dropdown
            const dropdown = document.getElementById('userDropdown');
            if (dropdown && dropdown.classList.contains('show')) {
                dropdown.classList.remove('show');
            }
            
            // Close any open modals
            document.querySelectorAll('.modal, [role="dialog"]').forEach(modal => {
                if (modal.style.display !== 'none') {
                    modal.style.display = 'none';
                }
            });
        }
    });
    
    // Add visible focus indicators
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Tab') {
            document.body.classList.add('keyboard-nav');
        }
    });
    
    document.addEventListener('mousedown', function() {
        document.body.classList.remove('keyboard-nav');
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
// LAZY LOADING - Task 1.9
// ============================================
function setupLazyLoading() {
    // Use Intersection Observer for lazy loading images
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                    }
                    if (img.dataset.srcset) {
                        img.srcset = img.dataset.srcset;
                        img.removeAttribute('data-srcset');
                    }
                    img.classList.remove('lazy');
                    img.classList.add('loaded');
                    observer.unobserve(img);
                }
            });
        }, {
            rootMargin: '50px 0px',
            threshold: 0.01
        });
        
        // Observe all images with lazy class or data-src
        document.querySelectorAll('img.lazy, img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    } else {
        // Fallback for browsers without Intersection Observer
        document.querySelectorAll('img[data-src]').forEach(img => {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
        });
    }
}

// ============================================
// LOADING SPINNER - Task 1.10
// ============================================
function createLoadingSpinner(container, message = 'Loading...') {
    const spinner = document.createElement('div');
    spinner.className = 'component-loader';
    spinner.innerHTML = `
        <div class="spinner-wrapper">
            <div class="spinner"></div>
            <p class="spinner-message">${message}</p>
        </div>
    `;
    
    if (container) {
        container.appendChild(spinner);
    }
    
    return spinner;
}

function removeLoadingSpinner(spinner) {
    if (spinner && spinner.parentNode) {
        spinner.parentNode.removeChild(spinner);
    }
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
    
    // Setup lazy loading for images
    setupLazyLoading();
    
    // Initialize offline storage
    if ('indexedDB' in window) {
        OfflineStorage.init().catch(console.error);
    }
    
    // Register service worker for PWA
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/servicepro-elite/sw.js')
            .catch(err => console.log('Service worker registration failed:', err));
    }
    
    // Set default user if not exists
    if (!localStorage.getItem('servicepro_user_name')) {
        localStorage.setItem('servicepro_user_name', 'Admin User');
        localStorage.setItem('servicepro_user_email', 'admin@servicepro.com');
        localStorage.setItem('servicepro_authenticated', 'true');
        localStorage.setItem('servicepro_user_role', 'admin');
    }
}

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initGlobalComponents);
} else {
    initGlobalComponents();
}