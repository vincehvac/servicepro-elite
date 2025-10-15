// Mobile Tech App Complete Enhancement - Tasks 5.1 to 5.10
// Comprehensive mobile-first implementation

document.addEventListener('DOMContentLoaded', function() {
    // Task 5.1: Mobile-first redesign (handled by CSS)
    ensureMobileOptimization();
    
    // Task 5.2: Voice-to-text for job updates
    enhanceVoiceToText();
    
    // Task 5.3: Offline/online status icon
    addOnlineStatusIndicator();
    
    // Task 5.4: Offline mode banner
    addOfflineBanner();
    
    // Task 5.5: Auto-sync retry
    setupAutoSync();
    
    // Task 5.6: Camera integration
    enhanceCameraFeatures();
    
    // Task 5.7: Interactive checklists
    createInteractiveChecklists();
    
    // Task 5.8: Job progress bar
    addJobProgressBar();
    
    // Task 5.9: GPS location tracking
    setupGPSTracking();
    
    // Task 5.10: Push notifications
    setupPushNotifications();
});

// Task 5.1: Ensure Mobile Optimization
function ensureMobileOptimization() {
    // Ensure all touch targets are at least 44x44px
    document.querySelectorAll('button, a, input[type="checkbox"], input[type="radio"]').forEach(el => {
        const rect = el.getBoundingClientRect();
        if (rect.width < 44 || rect.height < 44) {
            el.style.minWidth = '44px';
            el.style.minHeight = '44px';
        }
    });
    
    // Add touch feedback
    document.querySelectorAll('button, a, [role="button"]').forEach(el => {
        el.addEventListener('touchstart', function() {
            this.style.opacity = '0.7';
        });
        el.addEventListener('touchend', function() {
            this.style.opacity = '1';
        });
    });
}

// Task 5.2: Enhanced Voice-to-Text
function enhanceVoiceToText() {
    // Check if Web Speech API is available
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
        console.log('Speech recognition not supported');
        return;
    }
    
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';
    
    window.startVoiceInput = function(targetInputId) {
        const targetInput = document.getElementById(targetInputId);
        if (!targetInput) return;
        
        // Show recording indicator
        showToast('🎤 Listening... Speak now', 'info');
        
        recognition.start();
        
        recognition.onresult = function(event) {
            const transcript = event.results[0][0].transcript;
            targetInput.value = transcript;
            showToast('✓ Voice input captured', 'success');
        };
        
        recognition.onerror = function(event) {
            showToast('Voice input failed. Please try again.', 'error');
        };
        
        recognition.onend = function() {
            console.log('Voice recognition ended');
        };
    };
    
    // Add voice buttons to text inputs
    document.querySelectorAll('textarea, input[type="text"]').forEach(input => {
        if (!input.id) {
            input.id = 'input-' + Math.random().toString(36).substr(2, 9);
        }
        
        const parent = input.parentElement;
        if (!parent.querySelector('.voice-btn')) {
            const voiceBtn = document.createElement('button');
            voiceBtn.className = 'btn btn-sm btn-secondary voice-btn';
            voiceBtn.innerHTML = '🎤';
            voiceBtn.type = 'button';
            voiceBtn.onclick = function() {
                startVoiceInput(input.id);
            };
            voiceBtn.setAttribute('aria-label', 'Voice input');
            parent.style.position = 'relative';
            parent.appendChild(voiceBtn);
        }
    });
}

// Task 5.3: Online Status Indicator
function addOnlineStatusIndicator() {
    const indicator = document.createElement('div');
    indicator.id = 'online-status';
    indicator.className = 'online-status';
    indicator.innerHTML = `
        <span class="status-dot ${navigator.onLine ? 'online' : 'offline'}"></span>
        <span class="status-text">${navigator.onLine ? 'Online' : 'Offline'}</span>
    `;
    
    document.body.appendChild(indicator);
    
    // Update on connection change
    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);
}

function updateOnlineStatus() {
    const indicator = document.getElementById('online-status');
    if (!indicator) return;
    
    const isOnline = navigator.onLine;
    const dot = indicator.querySelector('.status-dot');
    const text = indicator.querySelector('.status-text');
    
    dot.className = `status-dot ${isOnline ? 'online' : 'offline'}`;
    text.textContent = isOnline ? 'Online' : 'Offline';
    
    if (isOnline) {
        showToast('✓ Back online - syncing data...', 'success');
        triggerSync();
    } else {
        showToast('⚠ Offline mode - changes saved locally', 'warning');
    }
}

// Task 5.4: Offline Mode Banner
function addOfflineBanner() {
    if (!navigator.onLine) {
        const banner = document.createElement('div');
        banner.id = 'offline-banner';
        banner.className = 'offline-banner';
        banner.innerHTML = `
            <span>📡</span>
            <div>
                <strong>Offline mode active</strong>
                <p>Changes will sync when online</p>
            </div>
            <button class="btn btn-sm btn-secondary" onclick="this.parentElement.remove()">✕</button>
        `;
        
        document.body.appendChild(banner);
    }
    
    window.addEventListener('offline', () => {
        if (!document.getElementById('offline-banner')) {
            addOfflineBanner();
        }
    });
    
    window.addEventListener('online', () => {
        const banner = document.getElementById('offline-banner');
        if (banner) banner.remove();
    });
}

// Task 5.5: Auto-sync Retry
function setupAutoSync() {
    let syncInterval = null;
    
    function startAutoSync() {
        if (syncInterval) clearInterval(syncInterval);
        
        syncInterval = setInterval(() => {
            if (navigator.onLine) {
                triggerSync();
            }
        }, 30000); // 30 seconds
    }
    
    function stopAutoSync() {
        if (syncInterval) {
            clearInterval(syncInterval);
            syncInterval = null;
        }
    }
    
    window.addEventListener('online', startAutoSync);
    window.addEventListener('offline', stopAutoSync);
    
    if (navigator.onLine) {
        startAutoSync();
    }
}

async function triggerSync() {
    try {
        if (!navigator.onLine) return;
        
        const syncQueue = await OfflineStorage.getAll('sync_queue');
        
        if (syncQueue && syncQueue.length > 0) {
            console.log(`Syncing ${syncQueue.length} items...`);
            
            // Simulate API sync
            for (const item of syncQueue) {
                await new Promise(resolve => setTimeout(resolve, 200));
                await OfflineStorage.delete('sync_queue', item.id);
            }
            
            console.log('Sync complete');
        }
    } catch (error) {
        console.error('Sync error:', error);
    }
}

// Task 5.6: Camera Integration
function enhanceCameraFeatures() {
    window.capturePhoto = async function() {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
            showToast('Camera not available on this device', 'error');
            return;
        }
        
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ 
                video: { facingMode: 'environment' } 
            });
            
            // Create camera modal
            const modal = document.createElement('div');
            modal.className = 'camera-modal';
            modal.innerHTML = `
                <div class="camera-container">
                    <video id="cameraVideo" autoplay playsinline></video>
                    <div class="camera-controls">
                        <button class="btn btn-lg btn-danger" onclick="cancelCamera()">Cancel</button>
                        <button class="btn btn-lg btn-success" onclick="takePicture()">📸 Capture</button>
                    </div>
                </div>
            `;
            
            document.body.appendChild(modal);
            
            const video = document.getElementById('cameraVideo');
            video.srcObject = stream;
            
            window.currentCameraStream = stream;
            
        } catch (error) {
            showToast('Camera access denied', 'error');
        }
    };
    
    window.takePicture = function() {
        const video = document.getElementById('cameraVideo');
        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        canvas.getContext('2d').drawImage(video, 0, 0);
        
        const imageData = canvas.toDataURL('image/jpeg');
        
        // Save photo
        savePhoto(imageData);
        
        // Stop camera
        cancelCamera();
        
        showToast('Photo captured successfully', 'success');
    };
    
    window.cancelCamera = function() {
        if (window.currentCameraStream) {
            window.currentCameraStream.getTracks().forEach(track => track.stop());
        }
        const modal = document.querySelector('.camera-modal');
        if (modal) modal.remove();
    };
}

function savePhoto(imageData) {
    let photos = JSON.parse(localStorage.getItem('servicepro_photos') || '[]');
    photos.push({
        id: Date.now(),
        data: imageData,
        timestamp: new Date().toISOString()
    });
    
    // Keep last 50 photos
    if (photos.length > 50) {
        photos = photos.slice(0, 50);
    }
    
    localStorage.setItem('servicepro_photos', JSON.stringify(photos));
}

// Task 5.7: Interactive Checklists
function createInteractiveChecklists() {
    const container = document.getElementById('main-content') || document.querySelector('.container');
    if (!container || document.getElementById('job-checklist')) return;
    
    const checklist = document.createElement('div');
    checklist.id = 'job-checklist';
    checklist.className = 'job-checklist';
    checklist.innerHTML = `
        <h3>✓ Job Checklist</h3>
        <div class="checklist-items">
            <label class="checklist-item">
                <input type="checkbox" onchange="updateProgress()">
                <span>Arrive at job site</span>
            </label>
            <label class="checklist-item">
                <input type="checkbox" onchange="updateProgress()">
                <span>Inspect equipment</span>
            </label>
            <label class="checklist-item">
                <input type="checkbox" onchange="updateProgress()">
                <span>Perform diagnostics</span>
            </label>
            <label class="checklist-item">
                <input type="checkbox" onchange="updateProgress()">
                <span>Complete repairs</span>
            </label>
            <label class="checklist-item">
                <input type="checkbox" onchange="updateProgress()">
                <span>Test system operation</span>
            </label>
            <label class="checklist-item">
                <input type="checkbox" onchange="updateProgress()">
                <span>Customer sign-off</span>
            </label>
        </div>
    `;
    
    container.appendChild(checklist);
}

// Task 5.8: Job Progress Bar
function addJobProgressBar() {
    const container = document.getElementById('main-content') || document.querySelector('.container');
    if (!container || document.getElementById('job-progress')) return;
    
    const progressBar = document.createElement('div');
    progressBar.id = 'job-progress';
    progressBar.className = 'job-progress';
    progressBar.innerHTML = `
        <div class="progress-header">
            <span>Job Progress</span>
            <span id="progressPercentage">0%</span>
        </div>
        <div class="progress-bar-container">
            <div class="progress-bar-fill" id="progressBarFill" style="width: 0%"></div>
        </div>
    `;
    
    container.insertBefore(progressBar, container.firstChild);
}

window.updateProgress = function() {
    const checkboxes = document.querySelectorAll('.checklist-item input[type="checkbox"]');
    const checked = document.querySelectorAll('.checklist-item input[type="checkbox"]:checked').length;
    const total = checkboxes.length;
    const percentage = total > 0 ? Math.round((checked / total) * 100) : 0;
    
    const progressFill = document.getElementById('progressBarFill');
    const progressText = document.getElementById('progressPercentage');
    
    if (progressFill) {
        progressFill.style.width = percentage + '%';
    }
    
    if (progressText) {
        progressText.textContent = percentage + '%';
    }
    
    if (percentage === 100) {
        showToast('🎉 Job completed! Great work!', 'success');
    }
};

// Task 5.9: GPS Location Tracking
function setupGPSTracking() {
    if (!navigator.geolocation) {
        console.log('Geolocation not supported');
        return;
    }
    
    window.trackLocation = function() {
        showToast('Getting your location...', 'info');
        
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const lat = position.coords.latitude;
                const lon = position.coords.longitude;
                
                // Save location
                const location = {
                    latitude: lat,
                    longitude: lon,
                    timestamp: new Date().toISOString(),
                    accuracy: position.coords.accuracy
                };
                
                localStorage.setItem('servicepro_current_location', JSON.stringify(location));
                
                showToast('✓ Location updated', 'success');
                
                // Update ETA if job is active
                updateETA(lat, lon);
            },
            (error) => {
                showToast('Location access denied', 'error');
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 0
            }
        );
    };
    
    // Auto-track location every 5 minutes when job is active
    setInterval(() => {
        const activeJob = localStorage.getItem('servicepro_active_job');
        if (activeJob && navigator.onLine) {
            trackLocation();
        }
    }, 300000); // 5 minutes
}

function updateETA(lat, lon) {
    // In production, calculate ETA to job location
    console.log('Location updated:', lat, lon);
    
    // Simulate ETA update
    const etaElement = document.getElementById('job-eta');
    if (etaElement) {
        etaElement.textContent = '15 min';
    }
}

// Task 5.10: Push Notifications
function setupPushNotifications() {
    if (!('Notification' in window)) {
        console.log('Notifications not supported');
        return;
    }
    
    // Request permission
    if (Notification.permission === 'default') {
        Notification.requestPermission().then(permission => {
            if (permission === 'granted') {
                showToast('✓ Notifications enabled', 'success');
            }
        });
    }
    
    // Function to show notification
    window.showJobNotification = function(title, body, data = {}) {
        if (Notification.permission === 'granted') {
            const notification = new Notification(title, {
                body: body,
                icon: '/servicepro-elite/icon-192.png',
                badge: '/servicepro-elite/icon-192.png',
                tag: data.jobId || 'job-notification',
                requireInteraction: data.urgent || false,
                data: data
            });
            
            notification.onclick = function() {
                window.focus();
                if (data.jobId) {
                    // Navigate to job details
                    console.log('Opening job:', data.jobId);
                }
                notification.close();
            };
        }
    };
    
    // Simulate incoming notifications
    setTimeout(() => {
        if (Notification.permission === 'granted') {
            showJobNotification(
                'New Job Assigned',
                'J-3001: AC Repair at 123 Main St',
                { jobId: 'J-3001', urgent: false }
            );
        }
    }, 5000);
}

// Helper functions
window.addChecklistItem = function() {
    const container = document.querySelector('.checklist-items');
    if (!container) return;
    
    const item = document.createElement('label');
    item.className = 'checklist-item';
    item.innerHTML = `
        <input type="checkbox" onchange="updateProgress()">
        <input type="text" class="form-input" placeholder="New checklist item" style="flex: 1; margin: 0 0.5rem;">
        <button class="btn btn-sm btn-danger" onclick="this.parentElement.remove(); updateProgress();">✕</button>
    `;
    
    container.appendChild(item);
};

console.log('Mobile Tech App Complete Enhancement loaded');