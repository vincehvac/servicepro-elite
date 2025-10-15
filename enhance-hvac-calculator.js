// Additional enhancements for HVAC Calculator
// This script adds the missing features from the task list

document.addEventListener('DOMContentLoaded', function() {
    // CALC-204: Add Reset All button to each calculator
    addResetButtons();
    
    // CALC-205: Add Export functionality
    addExportButtons();
    
    // CALC-202: Ensure unit labels are visible
    enhanceUnitLabels();
    
    // CALC-201: Enhanced validation is already in global-components.js
    
    // CALC-203: Tooltips are already implemented
});

function addResetButtons() {
    const calculators = document.querySelectorAll('.calculator');
    
    calculators.forEach(calc => {
        const btnGroup = calc.querySelector('.btn-group');
        if (btnGroup && !btnGroup.querySelector('.btn-reset')) {
            const resetBtn = document.createElement('button');
            resetBtn.className = 'btn btn-secondary btn-reset';
            resetBtn.textContent = '🔄 Reset All';
            resetBtn.onclick = function() {
                // Clear all inputs in this calculator
                calc.querySelectorAll('input, select, textarea').forEach(input => {
                    if (input.type === 'checkbox' || input.type === 'radio') {
                        input.checked = false;
                    } else {
                        input.value = '';
                    }
                    input.classList.remove('error');
                });
                
                // Hide all results
                const results = calc.querySelectorAll('.result');
                results.forEach(r => r.style.display = 'none');
                
                // Hide error messages
                calc.querySelectorAll('.error-message').forEach(e => e.style.display = 'none');
                
                showToast('Calculator reset', 'info');
            };
            btnGroup.appendChild(resetBtn);
        }
    });
}

function addExportButtons() {
    const resultDivs = document.querySelectorAll('.result');
    
    resultDivs.forEach(resultDiv => {
        if (!resultDiv.querySelector('.export-buttons')) {
            const exportDiv = document.createElement('div');
            exportDiv.className = 'export-buttons';
            exportDiv.style.cssText = 'margin-top: 20px; display: flex; gap: 10px; justify-content: center;';
            
            const pdfBtn = document.createElement('button');
            pdfBtn.className = 'btn btn-sm btn-secondary';
            pdfBtn.innerHTML = '📄 Print/PDF';
            pdfBtn.onclick = function() {
                window.print();
            };
            
            const csvBtn = document.createElement('button');
            csvBtn.className = 'btn btn-sm btn-secondary';
            csvBtn.innerHTML = '📊 Export CSV';
            csvBtn.onclick = function() {
                exportResultsToCSV(resultDiv);
            };
            
            exportDiv.appendChild(pdfBtn);
            exportDiv.appendChild(csvBtn);
            resultDiv.appendChild(exportDiv);
        }
    });
}

function exportResultsToCSV(resultDiv) {
    const items = resultDiv.querySelectorAll('.result-item');
    const data = [];
    
    items.forEach(item => {
        const spans = item.querySelectorAll('span');
        if (spans.length >= 2) {
            data.push({
                Parameter: spans[0].textContent.trim(),
                Value: spans[1].textContent.trim()
            });
        }
    });
    
    if (data.length > 0) {
        const timestamp = new Date().toISOString().split('T')[0];
        exportToCSV(data, `hvac-calculation-${timestamp}.csv`);
        showToast('Results exported to CSV', 'success');
    }
}

function enhanceUnitLabels() {
    // Add unit labels to inputs that don't have them
    const inputGroups = document.querySelectorAll('.input-group');
    
    inputGroups.forEach(group => {
        const input = group.querySelector('input[type="number"]');
        const label = group.querySelector('label');
        
        if (input && label) {
            const labelText = label.textContent;
            
            // Add common unit labels if not present
            if (labelText.includes('Temperature') && !labelText.includes('°F') && !labelText.includes('°C')) {
                label.innerHTML = label.innerHTML.replace('Temperature', 'Temperature (°F)');
            }
            if (labelText.includes('Pressure') && !labelText.includes('PSIG') && !labelText.includes('Pa')) {
                label.innerHTML = label.innerHTML.replace('Pressure', 'Pressure (PSIG)');
            }
            if (labelText.includes('CFM') && !input.placeholder.includes('CFM')) {
                input.placeholder = 'Enter CFM';
            }
            if (labelText.includes('Voltage') && !labelText.includes('V')) {
                label.innerHTML = label.innerHTML.replace('Voltage', 'Voltage (V)');
            }
            if (labelText.includes('Current') && !labelText.includes('A')) {
                label.innerHTML = label.innerHTML.replace('Current', 'Current (A)');
            }
        }
    });
}

console.log('HVAC Calculator enhancements loaded');