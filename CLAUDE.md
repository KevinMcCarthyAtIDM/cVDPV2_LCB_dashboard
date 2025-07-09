# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Shiny dashboard for visualizing Type 2 Poliovirus (cVDPV2) simulation results in the Lake Chad Basin. The dashboard analyzes different intervention scenarios including Routine Immunization (RI), Outbreak Response (OBR), and Supplementary Immunization Activities (SIA) with various parameters.

## Architecture

### HTML/JavaScript Version (Primary)
- **Static HTML**: `index.html` with embedded CSS and Chart.js for visualization
- **Client-side JavaScript**: `dashboard.js` handles data loading, filtering, and visualization
- **No server required**: Runs entirely in the browser using PapaParse for CSV loading
- **Modern UI**: Clean, responsive design with Bootstrap-inspired styling
- **Interactive visualization**: Chart.js scatter plot with hover tooltips and error bars

### R Shiny Version (Legacy)
- **Single-file R Shiny application** (`app.R`) containing both UI and server logic
- **Server-side processing**: R handles all data manipulation and filtering
- **Plotly visualization**: Interactive scatter plots with Plotly.js

### Common Features
- **Data source**: CSV file (`2025_06_05_summary.csv`) containing simulation results
- **Interactive filtering**: Multi-dimensional filtering by intervention types, SIA parameters (frequency, geographic extent, age targets)
- **Visualization**: Cost vs. cases scatter plot with error bars and highlighting options
- **Data exploration**: Tabular view and summary statistics

## Key Components

### Data Structure
The CSV contains simulation results with columns:
- `NAME`: Experiment identifier
- `CASES_MU/LO/HI`: Case counts (mean, low, high)
- `COST`: Economic cost
- `RI/OBR`: Binary flags for interventions
- `SIA.NGA/NGAN/LKCHAD`: Geographic extent flags
- `SIA.U2/1Y/2Y`: Age targeting and frequency flags

### UI Features
- **Sidebar filters**: Checkbox groups for RI, OBR, and SIA parameters
- **Conditional panels**: SIA options appear only when enabled
- **Highlighting system**: Color-code points by intervention type
- **Three-tab layout**: Plot, Data Table, Summary

### Server Logic
- **Reactive filtering**: Complex SIA filtering logic based on parameter combinations (lines 123-157)
- **Dynamic highlighting**: Conditional coloring based on selected criteria
- **Error bars**: Optional display of uncertainty ranges
- **Summary statistics**: Real-time calculation of filtered data metrics

## Running the Application

### HTML/JavaScript Version (Recommended)
Simply open `index.html` in a web browser. No server required.

**Option 1: Direct file access (recommended)**
- Open `index.html` directly in your browser
- Data is embedded in the JavaScript file to avoid CORS issues

**Option 2: Local server (alternative)**
```bash
# Using the included Python server
python serve.py

# Or use built-in Python server
python -m http.server 8000

# Or use Node.js
npx http-server .
```

### R Shiny Version (Legacy)
```r
# Install required packages if not already installed
install.packages(c("shiny", "plotly", "DT", "dplyr"))

# Run the application
shiny::runApp()
```

## Development Commands

### Static HTML Version
- **Run locally**: Open `index.html` in browser or use local server
- **Test filtering**: Open `test.html` in browser to run test suite
- **No build process**: Direct HTML/CSS/JavaScript - edit and refresh

### R Shiny Version
- **Run**: `shiny::runApp()` in R/RStudio
- **No build scripts**: Simple single-file application

## Data Dependencies

Both versions expect `2025_06_05_summary.csv` to be in the same directory as the application files. This file contains the simulation results and is essential for the dashboard to function.

## File Structure

```
cVDPV2_LCB_dashboard/
├── index.html          # Main HTML dashboard (recommended)
├── dashboard.js        # JavaScript logic for HTML version
├── test.html          # Test suite for filter validation
├── serve.py           # Python server for local development
├── app.R              # Legacy R Shiny application
├── 2025_06_05_summary.csv  # Data file
└── CLAUDE.md          # This file
```

## Development Goals

When working on this dashboard, prioritize the following objectives:

### UI/UX Improvements
- **Clean, visually attractive interface**: Implement modern styling with consistent spacing, typography, and color schemes
- **Nice-looking figure**: Create publication-quality visualizations with proper labels, legends, and aesthetic formatting
- **Responsive design**: Ensure the dashboard works well across different screen sizes

### User Experience & Logic
- **Prevent empty plots**: Test and validate filtering logic to ensure users don't encounter empty visualizations due to unclear filter interactions
- **Clear feedback**: Provide informative messages when filters result in no data or invalid combinations
- **Intuitive navigation**: Make filter relationships and dependencies clear to users

### Code Quality
- **Robust filtering logic**: Review and test the complex SIA filtering logic (lines 123-157 in app.R) to prevent logical errors
- **Error handling**: Add graceful error handling for edge cases and invalid filter combinations
- **Performance optimization**: Ensure reactive filtering performs well with larger datasets

### Testing Priorities
- Test all filter combinations to identify scenarios that produce empty results
- Validate that SIA parameter combinations work as expected
- Ensure highlighting functionality works correctly across all scenarios
- Test data table and summary statistics with various filter states