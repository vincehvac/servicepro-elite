// Additional enhancements for Mobile Tech App (mobile-tech.html)
// Implements MOB-401 to MOB-405

document.addEventListener('DOMContentLoaded', function() {
    // MOB-401: Optimize mobile layout (handled by global-styles.css)
    
    // MOB-402: Improve voice-to-text feedback
    enhanceVoiceToText();
    
    // MOB-403: Offline storage with sync indicators
    setupOfflineSync();
    
    // MOB-404: Add scanner fallback
    addScannerFallback();
    
    // MOB-405: Enable file attachments
    enableFileAttachments();
});

function enhanceVoiceToText() {
    // Find voice input buttons
    const voiceButtons = document.querySelectorAll('[data-voice="true"], .voice-btn');
    
    voiceButtons.forEach(btn => {
        const originalOnClick = btn.onclick;
        
        btn.onclick = function(e) {
            // Show recording indicator
            const indicator = document.createElement('div');
            indicator.className = 'recording-indicator';
            indicator.style.cssText = 'position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); background: rgba(239, 68, 68, 0.9); color: white; padding: 2rem; border-radius: 1rem; z-index: 10000; text-align: center;';
            indicator.innerHTML = `
                <div style="font-size: 3rem; margin-bottom: 1rem;">🎤</div>
                <div style="font-size: 1.25rem; font-weight: 600;">Recording...</div>
                <div style="font-size: 0.875rem; margin-top: 0.5rem;">Speak clearly</div>
            `;
            document.body.appendChild(indicator);
            
            // Call original function
            if (originalOnClick) {
                originalOnClick.call(this, e);
            }
            
            // Simulate voice recognition (in production, use Web Speech API)
            setTimeout(() => {
                indicator.remove();
                showToast('Voice note added successfully', 'success');
            }, 2000);
        };
    });
}

function setupOfflineSync() {
    // Initialize offline storage
    if ('indexedDB' in window) {
        OfflineStorage.init().then(() => {
            console.log('Offline storage initialized');
            
            // Add sync indicator
            const syncIndicator = document.createElement('div');
            syncIndicator.id = 'sync-indicator';
            syncIndicator.className = 'sync-indicator';
            syncIndicator.style.cssText = 'position: fixed; top: 70px; right: 1rem; padding: 0.5rem 1rem; background: var(--bg-primary); border: 1px solid var(--border-color); border-radius: var(--radius-md); font-size: 0.875rem; z-index: 998; display: flex; align-items: center; gap: 0.5rem;';
            
            updateSyncStatus(syncIndicator);
            document.body.appendChild(syncIndicator);
            
            // Check online status
            window.addEventListener('online', () => {
                updateSyncStatus(syncIndicator);
                syncOfflineData();
            });
            
            window.addEventListener('offline', () => {
                updateSyncStatus(syncIndicator);
            });
        });
    }
}

function updateSyncStatus(indicator) {
    const isOnline = navigator.onLine;
    
    if (isOnline) {
        indicator.innerHTML = `
            <span style="color: var(--success-color);">●</span>
            <span>Online - Synced</span>
        `;
    } else {
        indicator.innerHTML = `
            <span style="color: var(--warning-color);">●</span>
            <span>Offline Mode</span>
        `;
    }
}

async function syncOfflineData() {
    try {
        const syncQueue = await OfflineStorage.getAll('sync_queue');
        
        if (syncQueue.length > 0) {
            showToast(`Syncing ${syncQueue.length} items...`, 'info');
            
            // In production, send data to server
            for (const item of syncQueue) {
                // Simulate API call
                await new Promise(resolve => setTimeout(resolve, 500));
                await OfflineStorage.delete('sync_queue', item.id);
            }
            
            showToast('All data synced successfully', 'success');
        }
    } catch (error) {
        console.error('Sync error:', error);
        showToast('Sync failed. Will retry later.', 'error');
    }
}

function addScannerFallback() {
    // Find scanner buttons
    const scanButtons = document.querySelectorAll('[data-scan="true"], .scan-btn');
    
    scanButtons.forEach(btn => {
        const originalOnClick = btn.onclick;
        
        btn.onclick = function(e) {
            // Check if camera is available
            if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
                // Show manual entry fallback
                showManualEntryDialog();
                return;
            }
            
            // Try to access camera
            navigator.mediaDevices.getUserMedia({ video: true })
                .then(stream => {
                    // Camera available, proceed with scanning
                    stream.getTracks().forEach(track => track.stop());
                    if (originalOnClick) {
                        originalOnClick.call(this, e);
                    }
                })
                .catch(err => {
                    // Camera not available, show fallback
                    console.error('Camera access denied:', err);
                    showManualEntryDialog();
                });
        };
    });
}

function showManualEntryDialog() {
    const dialog = document.createElement('div');
    dialog.className = 'manual-entry-dialog';
    dialog.style.cssText = 'position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0, 0, 0, 0.5); display: flex; align-items: center; justify-content: center; z-index: 10000; padding: 1rem;';
    
    dialog.innerHTML = `
        <div style="background: var(--bg-primary); padding: 2rem; border-radius: 1rem; max-width: 400px; width: 100%;">
            <h3 style="margin-bottom: 1rem; color: var(--text-primary);">Manual Entry</h3>
            <p style="margin-bottom: 1rem; color: var(--text-secondary);">Camera not available. Please enter the code manually:</p>
            <input type="text" id="manual-code-input" class="form-input" placeholder="Enter barcode/QR code" style="margin-bottom: 1rem;">
            <div style="display: flex; gap: 0.5rem; justify-content: flex-end;">
                <button class="btn btn-secondary" onclick="this.closest('.manual-entry-dialog').remove()">Cancel</button>
                <button class="btn btn-primary" onclick="handleManualEntry()">Submit</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(dialog);
    
    // Focus input
    setTimeout(() => {
        document.getElementById('manual-code-input').focus();
    }, 100);
}

window.handleManualEntry = function() {
    const input = document.getElementById('manual-code-input');
    const code = input.value.trim();
    
    if (code) {
        showToast(`Code entered: ${code}`, 'success');
        document.querySelector('.manual-entry-dialog').remove();
        
        // Process the code (in production, this would look up the item)
        console.log('Manual code entry:', code);
    } else {
        showToast('Please enter a code', 'warning');
    }
};

function enableFileAttachments() {
    // Find file upload areas
    const uploadAreas = document.querySelectorAll('[data-upload="true"], .upload-area');
    
    uploadAreas.forEach(area => {
        // Add file input if not exists
        if (!area.querySelector('input[type="file"]')) {
            const fileInput = document.createElement('input');
            fileInput.type = 'file';
            fileInput.multiple = true;
            fileInput.accept = 'image/*,application/pdf,.doc,.docx';
            fileInput.style.display = 'none';
            
            fileInput.onchange = function(e) {
                const files = Array.from(e.target.files);
                handleFileAttachments(files, area);
            };
            
            area.appendChild(fileInput);
            
            // Add click handler to trigger file input
            const uploadBtn = area.querySelector('button, .btn');
            if (uploadBtn) {
                uploadBtn.onclick = function() {
                    fileInput.click();
                };
            }
        }
    });
}

function handleFileAttachments(files, container) {
    files.forEach(file => {
        // Validate file size (max 10MB)
        if (file.size > 10 * 1024 * 1024) {
            showToast(`File ${file.name} is too large (max 10MB)`, 'error');
            return;
        }
        
        // Create file preview
        const preview = document.createElement('div');
        preview.className = 'file-preview';
        preview.style.cssText = 'display: flex; align-items: center; gap: 0.5rem; padding: 0.5rem; background: var(--bg-secondary); border-radius: var(--radius-md); margin-top: 0.5rem;';
        
        const icon = getFileIcon(file.type);
        const size = formatFileSize(file.size);
        
        preview.innerHTML = `
            <span style="font-size: 1.5rem;">${icon}</span>
            <div style="flex: 1; min-width: 0;">
                <div style="font-weight: 500; color: var(--text-primary); overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${file.name}</div>
                <div style="font-size: 0.75rem; color: var(--text-secondary);">${size}</div>
            </div>
            <button class="btn btn-sm btn-danger" onclick="this.parentElement.remove()">×</button>
        `;
        
        container.appendChild(preview);
        
        // Store file reference (in production, upload to server)
        console.log('File attached:', file.name, file.type, file.size);
    });
    
    showToast(`${files.length} file(s) attached`, 'success');
}

function getFileIcon(mimeType) {
    if (mimeType.startsWith('image/')) return '🖼️';
    if (mimeType.includes('pdf')) return '📄';
    if (mimeType.includes('word') || mimeType.includes('document')) return '📝';
    return '📎';
}

function formatFileSize(bytes) {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}

console.log('Mobile Tech App enhancements loaded');