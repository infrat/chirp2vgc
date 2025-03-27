# CSV Viewer Application

A web application for uploading and viewing CSV files in a data table format.

## Features

- Upload CSV files (up to 1MB)
- View CSV data in an interactive table
- Sort data by columns
- Paginate through large datasets
- Responsive design for all screen sizes

## Getting Started

### Prerequisites

- Node.js (v16.x or higher)
- NPM (v8.x or higher)

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/csv-viewer-app.git
   cd csv-viewer-app
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the development server:
   ```
   npm start
   ```

4. Open your browser and navigate to:
   ```
   http://localhost:4200
   ```

## Usage

1. Click the "Select CSV" button to select a CSV file from your computer.
2. The application will automatically parse the file and display its contents in a table.
3. You can sort the data by clicking on column headers.
4. Use the pagination controls to navigate through large datasets.

## Testing

Sample CSV files are included in the `test-data` directory:

- `sample.csv` - A simple CSV file with basic user data
- `complex_data.csv` - A more complex CSV file with multiple columns

## Technologies Used

- Angular 19
- PrimeNG for UI components
- PapaParse for CSV parsing
- Angular Material for additional UI elements
- PrimeFlex for CSS utilities

## Troubleshooting

If the CSV data is not displayed after upload:

1. Make sure your CSV file has headers (first row with column names)
2. Check that the CSV is properly formatted (comma-separated values)
3. Try uploading one of the sample CSV files in the `test-data` directory

## License

This project is licensed under the MIT License - see the LICENSE file for details.
