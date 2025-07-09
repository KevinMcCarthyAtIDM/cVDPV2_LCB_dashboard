// Global variables
let allData = [];
let filteredData = [];
let chart = null;

// Load and initialize the dashboard
document.addEventListener('DOMContentLoaded', function() {
    loadData();
    setupEventListeners();
});

// Embedded CSV data to avoid CORS issues
const csvData = `NAME,CASES_LO,CASES_MU,CASES_HI,SIA_DOSES_LO,SIA_DOSES_MU,SIA_DOSES_HI,RI,OBR,SIA-NGA,SIA-NGAN,SIA-LKCHAD,SIA-U2,SIA-1Y,SIA-2Y,COST
experiment_cVDPV2_100km_base,8137,9368,10806,2,2,2,0,0,0,0,0,0,0,0,2
experiment_cVDPV2_100km_base_ri2027,581,2071,2851,18,18,18,1,0,0,0,0,0,0,0,70.5
experiment_cVDPV2_100km_base_obr2026,139,712,1835,37,93,146,0,1,0,0,0,0,0,0,93
experiment_cVDPV2_100km_base_obr2026_ri2027,170,301,649,59,83,106,1,1,0,0,0,0,0,0,135.5
experiment_cVDPV2_100km_base_sia01-NGA,133,1487,2347,162,162,163,0,0,1,0,0,0,1,0,162
experiment_cVDPV2_100km_base_sia01-NGA_ri2027,94,447,752,178,179,179,1,0,1,0,0,0,1,0,231.5
experiment_cVDPV2_100km_base_sia01u2-NGA,163,2868,3774,64,64,64,0,0,1,0,0,1,1,0,64
experiment_cVDPV2_100km_base_sia01u2-NGA_ri2027,135,722,1080,80,80,80,1,0,1,0,0,1,1,0,132.5
experiment_cVDPV2_100km_base_sia02-NGA,1292,3496,4545,98,98,98,0,0,1,0,0,0,0,1,98
experiment_cVDPV2_100km_base_sia02-NGA_ri2027,167,849,1201,114,114,115,1,0,1,0,0,0,0,1,166.5
experiment_cVDPV2_100km_base_sia02u2-NGA,3896,5199,6302,39,39,39,0,0,1,0,0,1,0,1,39
experiment_cVDPV2_100km_base_sia02u2-NGA_ri2027,194,1115,1567,55,56,56,1,0,1,0,0,1,0,1,108.5
experiment_cVDPV2_100km_base_sia01-NGAN,139,2373,4626,100,100,100,0,0,0,1,0,0,1,0,100
experiment_cVDPV2_100km_base_sia01-NGAN_ri2027,91,492,897,116,116,117,1,0,0,1,0,0,1,0,168.5
experiment_cVDPV2_100km_base_sia01u2-NGAN,1193,4289,6036,40,40,40,0,0,0,1,0,1,1,0,40
experiment_cVDPV2_100km_base_sia01u2-NGAN_ri2027,141,770,1288,56,56,56,1,0,0,1,0,1,1,0,108.5
experiment_cVDPV2_100km_base_sia02-NGAN,2698,5156,6566,61,61,61,0,0,0,1,0,0,0,1,61
experiment_cVDPV2_100km_base_sia02-NGAN_ri2027,173,949,1461,77,77,77,1,0,0,1,0,0,0,1,129.5
experiment_cVDPV2_100km_base_sia02u2-NGAN,4541,6531,7678,25,25,25,0,0,0,1,0,1,0,1,25
experiment_cVDPV2_100km_base_sia02u2-NGAN_ri2027,177,1245,1955,41,41,41,1,0,0,1,0,1,0,1,93.5
experiment_cVDPV2_100km_base_sia01-LKCHAD,113,853,1231,228,228,229,0,0,0,0,1,0,1,0,228
experiment_cVDPV2_100km_base_sia01-LKCHAD_ri2027,101,398,597,244,244,245,1,0,0,0,1,0,1,0,296.5
experiment_cVDPV2_100km_base_sia01u2-LKCHAD,199,1978,2811,89,90,90,0,0,0,0,1,1,1,0,90
experiment_cVDPV2_100km_base_sia01u2-LKCHAD_ri2027,132,637,955,106,106,106,1,0,0,0,1,1,1,0,158.5
experiment_cVDPV2_100km_base_sia02-LKCHAD,1319,2529,3391,137,138,138,0,0,0,0,1,0,0,1,138
experiment_cVDPV2_100km_base_sia02-LKCHAD_ri2027,130,761,1110,154,154,154,1,0,0,0,1,0,0,1,206.5
experiment_cVDPV2_100km_base_sia02u2-LKCHAD,3148,4382,5461,55,55,55,0,0,0,0,1,1,0,1,55
experiment_cVDPV2_100km_base_sia02u2-LKCHAD_ri2027,200,1088,1526,71,71,71,1,0,0,0,1,1,0,1,123.5`;

// Load CSV data
function loadData() {
    try {
        const results = Papa.parse(csvData, {
            header: true,
            skipEmptyLines: true
        });
        
        allData = results.data.filter(row => row.NAME && row.NAME.trim() !== '');
        
        // Convert numeric fields
        allData.forEach(row => {
            row.CASES_LO = parseFloat(row.CASES_LO) || 0;
            row.CASES_MU = parseFloat(row.CASES_MU) || 0;
            row.CASES_HI = parseFloat(row.CASES_HI) || 0;
            row.COST = parseFloat(row.COST) || 0;
            row.RI = parseInt(row.RI) || 0;
            row.OBR = parseInt(row.OBR) || 0;
            
            // Handle SIA columns with different naming conventions
            row['SIA.NGA'] = parseInt(row['SIA.NGA'] || row['SIA-NGA']) || 0;
            row['SIA.NGAN'] = parseInt(row['SIA.NGAN'] || row['SIA-NGAN']) || 0;
            row['SIA.LKCHAD'] = parseInt(row['SIA.LKCHAD'] || row['SIA-LKCHAD']) || 0;
            row['SIA.U2'] = parseInt(row['SIA.U2'] || row['SIA-U2']) || 0;
            row['SIA.1Y'] = parseInt(row['SIA.1Y'] || row['SIA-1Y']) || 0;
            row['SIA.2Y'] = parseInt(row['SIA.2Y'] || row['SIA-2Y']) || 0;
        });
        
        updateDashboard();
        
    } catch (error) {
        console.error('Error parsing CSV data:', error);
        showNoDataMessage('Error loading data. Please check the console for details.');
    }
}

// Setup event listeners for filters
function setupEventListeners() {
    // Filter change listeners
    document.querySelectorAll('#ri-filter input, #obr-filter input').forEach(input => {
        input.addEventListener('change', updateDashboard);
    });
    
    document.getElementById('sia-enabled').addEventListener('change', function() {
        const siaOptions = document.getElementById('sia-options');
        siaOptions.style.display = this.checked ? 'block' : 'none';
        updateDashboard();
    });
    
    document.querySelectorAll('#sia-frequency input, #sia-extent input, #sia-age input').forEach(input => {
        input.addEventListener('change', updateDashboard);
    });
    
    document.getElementById('highlight-var').addEventListener('change', updateDashboard);
    document.getElementById('show-error-bars').addEventListener('change', updateDashboard);
}

// Filter data based on current selections
function filterData() {
    if (allData.length === 0) return [];
    
    let filtered = allData.filter(row => {
        // RI filter
        const riChecked = Array.from(document.querySelectorAll('#ri-filter input:checked')).map(cb => parseInt(cb.value));
        if (riChecked.length === 0 || !riChecked.includes(row.RI)) return false;
        
        // OBR filter
        const obrChecked = Array.from(document.querySelectorAll('#obr-filter input:checked')).map(cb => parseInt(cb.value));
        if (obrChecked.length === 0 || !obrChecked.includes(row.OBR)) return false;
        
        // SIA filter
        const siaEnabled = document.getElementById('sia-enabled').checked;
        if (!siaEnabled) {
            // Only show rows with no SIA
            return row['SIA.NGA'] === 0 && row['SIA.NGAN'] === 0 && row['SIA.LKCHAD'] === 0;
        } else {
            // Complex SIA filtering logic
            const siaFreq = Array.from(document.querySelectorAll('#sia-frequency input:checked')).map(cb => cb.value);
            const siaExtent = Array.from(document.querySelectorAll('#sia-extent input:checked')).map(cb => cb.value);
            const siaAge = Array.from(document.querySelectorAll('#sia-age input:checked')).map(cb => cb.value);
            
            // Check if row has no SIA (always include)
            const hasNoSIA = row['SIA.NGA'] === 0 && row['SIA.NGAN'] === 0 && row['SIA.LKCHAD'] === 0;
            if (hasNoSIA) return true;
            
            // Check SIA combinations
            let matchesSIA = false;
            for (const freq of siaFreq) {
                for (const extent of siaExtent) {
                    for (const age of siaAge) {
                        if (checkSIAMatch(row, freq, extent, age)) {
                            matchesSIA = true;
                            break;
                        }
                    }
                    if (matchesSIA) break;
                }
                if (matchesSIA) break;
            }
            
            return matchesSIA;
        }
    });
    
    return filtered;
}

// Check if row matches SIA criteria
function checkSIAMatch(row, freq, extent, age) {
    const freqMatch = (freq === '1Y' && row['SIA.1Y'] === 1) || (freq === '2Y' && row['SIA.2Y'] === 1);
    const extentMatch = row[`SIA.${extent}`] === 1;
    const ageMatch = (age === 'U2' && row['SIA.U2'] === 1) || (age === 'U5' && row['SIA.U2'] === 0);
    
    return freqMatch && extentMatch && ageMatch;
}

// Update dashboard with filtered data
function updateDashboard() {
    filteredData = filterData();
    
    if (filteredData.length === 0) {
        showNoDataMessage('No data matches the current filter criteria. Please adjust your selections.');
        return;
    }
    
    updateChart();
    updateTable();
    updateSummary();
}

// Show no data message
function showNoDataMessage(message) {
    const plotTab = document.getElementById('plot-tab');
    const tableTab = document.getElementById('table-tab');
    const summaryTab = document.getElementById('summary-tab');
    
    plotTab.innerHTML = `<div class="no-data">${message}</div>`;
    tableTab.innerHTML = `<div class="no-data">${message}</div>`;
    summaryTab.innerHTML = `<div class="no-data">${message}</div>`;
}

// Update scatter plot
function updateChart() {
    const ctx = document.getElementById('scatter-chart').getContext('2d');
    
    if (chart) {
        chart.destroy();
    }
    
    const highlightVar = document.getElementById('highlight-var').value;
    const showErrorBars = document.getElementById('show-error-bars').checked;
    
    // Prepare data points
    const dataPoints = filteredData.map(row => ({
        x: row.COST,
        y: row.CASES_MU,
        errorY: showErrorBars ? {
            plus: row.CASES_HI - row.CASES_MU,
            minus: row.CASES_MU - row.CASES_LO
        } : null,
        label: row.NAME.replace('experiment_cVDPV2_100km_base_', '').replace('experiment_cVDPV2_100km_base', 'base'),
        originalData: row,
        color: getPointColor(row, highlightVar)
    }));
    
    chart = new Chart(ctx, {
        type: 'scatter',
        data: {
            datasets: [{
                label: 'Simulations',
                data: dataPoints,
                backgroundColor: dataPoints.map(p => p.color),
                borderColor: dataPoints.map(p => p.color),
                pointRadius: 6,
                pointHoverRadius: 8,
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Cost',
                        font: {
                            size: 14,
                            weight: 'bold'
                        }
                    },
                    grid: {
                        color: 'rgba(0,0,0,0.1)'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Cases (Mean)',
                        font: {
                            size: 14,
                            weight: 'bold'
                        }
                    },
                    grid: {
                        color: 'rgba(0,0,0,0.1)'
                    }
                }
            },
            plugins: {
                title: {
                    display: true,
                    text: 'Cost vs Cases Analysis',
                    font: {
                        size: 16,
                        weight: 'bold'
                    }
                },
                legend: {
                    display: highlightVar !== 'none'
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const point = context.raw;
                            const data = point.originalData;
                            return [
                                `${point.label}`,
                                `Cases (Mean): ${data.CASES_MU}`,
                                `Cases (Range): ${data.CASES_LO} - ${data.CASES_HI}`,
                                `Cost: ${data.COST}`,
                                `RI: ${data.RI === 1 ? 'Yes' : 'No'}`,
                                `OBR: ${data.OBR === 1 ? 'Yes' : 'No'}`,
                                `SIA-NGA: ${data['SIA.NGA'] === 1 ? 'Yes' : 'No'}`,
                                `SIA-NGAN: ${data['SIA.NGAN'] === 1 ? 'Yes' : 'No'}`,
                                `SIA-LKCHAD: ${data['SIA.LKCHAD'] === 1 ? 'Yes' : 'No'}`
                            ];
                        }
                    }
                }
            }
        }
    });
}

// Get point color based on highlight variable
function getPointColor(row, highlightVar) {
    if (highlightVar === 'none') return 'rgba(70, 130, 180, 0.7)';
    
    const highlightColor = 'rgba(220, 20, 60, 0.8)';
    const normalColor = 'rgba(173, 216, 230, 0.7)';
    
    switch (highlightVar) {
        case 'RI':
            return row.RI === 1 ? highlightColor : normalColor;
        case 'OBR':
            return row.OBR === 1 ? highlightColor : normalColor;
        case 'SIA_FREQ':
            return row['SIA.1Y'] === 1 ? highlightColor : normalColor;
        case 'SIA_EXTENT':
            return row['SIA.NGA'] === 1 ? highlightColor : normalColor;
        case 'SIA_AGE':
            return row['SIA.U2'] === 1 ? highlightColor : normalColor;
        default:
            return normalColor;
    }
}

// Update data table
function updateTable() {
    const tableBody = document.getElementById('table-body');
    tableBody.innerHTML = '';
    
    filteredData.forEach(row => {
        const tr = document.createElement('tr');
        
        const siaDetails = [];
        if (row['SIA.NGA'] === 1) siaDetails.push('NGA');
        if (row['SIA.NGAN'] === 1) siaDetails.push('NGAN');
        if (row['SIA.LKCHAD'] === 1) siaDetails.push('LKCHAD');
        if (row['SIA.U2'] === 1) siaDetails.push('U2');
        if (row['SIA.1Y'] === 1) siaDetails.push('1Y');
        if (row['SIA.2Y'] === 1) siaDetails.push('2Y');
        
        tr.innerHTML = `
            <td>${row.NAME.replace('experiment_cVDPV2_100km_base_', '').replace('experiment_cVDPV2_100km_base', 'base')}</td>
            <td>${row.CASES_MU.toFixed(1)}</td>
            <td>${row.CASES_LO.toFixed(1)} - ${row.CASES_HI.toFixed(1)}</td>
            <td>${row.COST.toFixed(1)}</td>
            <td>${row.RI === 1 ? 'Yes' : 'No'}</td>
            <td>${row.OBR === 1 ? 'Yes' : 'No'}</td>
            <td>${siaDetails.join(', ') || 'None'}</td>
        `;
        
        tableBody.appendChild(tr);
    });
}

// Update summary statistics
function updateSummary() {
    const count = filteredData.length;
    const cases = filteredData.map(row => row.CASES_MU);
    const costs = filteredData.map(row => row.COST);
    
    const avgCases = cases.reduce((a, b) => a + b, 0) / count;
    const avgCost = costs.reduce((a, b) => a + b, 0) / count;
    const minCases = Math.min(...cases);
    const maxCases = Math.max(...cases);
    const minCost = Math.min(...costs);
    const maxCost = Math.max(...costs);
    
    document.getElementById('stat-count').textContent = count;
    document.getElementById('stat-avg-cases').textContent = avgCases.toFixed(1);
    document.getElementById('stat-avg-cost').textContent = avgCost.toFixed(1);
    document.getElementById('stat-min-cases').textContent = minCases.toFixed(1);
    document.getElementById('stat-max-cases').textContent = maxCases.toFixed(1);
    document.getElementById('stat-cost-range').textContent = `${minCost.toFixed(1)} - ${maxCost.toFixed(1)}`;
    
    // Update summary text
    const summaryText = document.getElementById('summary-text');
    summaryText.innerHTML = `
        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin-top: 20px;">
            <h3 style="margin-bottom: 15px; color: #495057;">Detailed Summary</h3>
            <p><strong>Data Overview:</strong> ${count} simulations match the current filter criteria.</p>
            <p><strong>Case Statistics:</strong> Mean cases range from ${minCases.toFixed(1)} to ${maxCases.toFixed(1)}, with an average of ${avgCases.toFixed(1)} cases.</p>
            <p><strong>Cost Analysis:</strong> Costs range from ${minCost.toFixed(1)} to ${maxCost.toFixed(1)}, with an average cost of ${avgCost.toFixed(1)}.</p>
            <p><strong>Interventions:</strong> ${filteredData.filter(row => row.RI === 1).length} simulations include RI, ${filteredData.filter(row => row.OBR === 1).length} include OBR, and ${filteredData.filter(row => row['SIA.NGA'] === 1 || row['SIA.NGAN'] === 1 || row['SIA.LKCHAD'] === 1).length} include SIA interventions.</p>
        </div>
    `;
}

// Tab switching
function showTab(tabName) {
    // Hide all tabs
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Remove active class from all tab buttons
    document.querySelectorAll('.tab').forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Show selected tab
    document.getElementById(`${tabName}-tab`).classList.add('active');
    event.target.classList.add('active');
    
    // Resize chart if plot tab is selected
    if (tabName === 'plot' && chart) {
        setTimeout(() => chart.resize(), 100);
    }
}