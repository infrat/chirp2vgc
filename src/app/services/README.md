# CSV Mapper Service

This service allows you to create flexible mappings between different CSV formats. Instead of writing custom code for each mapping, you can define reusable mapping configurations.

## Key Features

- Map between different CSV formats using declarative configurations
- Transform field values with custom functions
- Filter rows based on conditions
- Expand one row into multiple rows
- Handle default values for missing fields
- Parse and generate CSV files

## How to Use

### 1. Import the Service

```typescript
import { CsvMapperService, CsvData, MappingConfig } from './services/csv-mapper.service';
import { CSV_MAPPINGS } from './services/csv-mapping-definitions';

constructor(private csvMapperService: CsvMapperService) { }
```

### 2. Parse CSV Files

```typescript
// Parse a CSV file
this.csvMapperService.parseCSV(file)
  .then(data => {
    // Work with the parsed data (array of objects)
    console.log(`Parsed ${data.length} rows`);
  })
  .catch(error => {
    console.error('Error parsing CSV:', error.message);
  });
```

### 3. Define a Mapping Configuration

```typescript
const myMapping: MappingConfig = {
  name: 'My Custom Mapping',
  description: 'Maps data from format A to format B',
  rules: [
    // Direct field mapping (no transformation)
    { sourceField: 'Name', targetField: 'FullName' },
    
    // Field with transformation
    { 
      sourceField: 'BirthDate', 
      targetField: 'Age',
      transform: (value) => {
        const birthDate = new Date(value);
        const today = new Date();
        return (today.getFullYear() - birthDate.getFullYear()).toString();
      }
    },
    
    // Combining multiple fields
    {
      sourceField: 'FirstName',
      targetField: 'FullName',
      transform: (value, row) => `${value} ${row['LastName']}`
    }
  ],
  
  // Optional: Filter rows based on a condition
  filterRow: (row) => row['Status'] === 'Active',
  
  // Optional: Default value for missing fields
  defaultValue: 'N/A'
};
```

### 4. Apply the Mapping

```typescript
// Apply a mapping to transform data
const mappedData = this.csvMapperService.mapData(sourceData, myMapping);
console.log(`Transformed to ${mappedData.length} rows`);
```

### 5. Generate and Download CSV

```typescript
// Generate and download the mapped data as CSV
this.csvMapperService.generateAndDownloadCSV(mappedData, 'transformed_data.csv');
```

### 6. Using Predefined Mappings

The service comes with predefined mappings in `csv-mapping-definitions.ts`:

```typescript
// Use a predefined mapping
const standardToVGC = CSV_MAPPINGS.standardToVGC;
const mappedData = this.csvMapperService.mapData(sourceData, standardToVGC);
```

## Advanced Features

### Row Expansion (One-to-Many)

You can expand one row into multiple rows using the `expandRow` function:

```typescript
const orderToLineItems: MappingConfig = {
  name: 'Order to Line Items',
  rules: [
    { sourceField: 'OrderID', targetField: 'OrderID' },
    { sourceField: 'CustomerID', targetField: 'CustomerID' }
  ],
  // Create multiple rows from one
  expandRow: (row) => {
    const items = JSON.parse(row['Items'] || '[]');
    return items.map(item => ({
      ItemID: item.id,
      ItemName: item.name,
      Quantity: item.quantity,
      Price: item.price
    }));
  }
};
```

### Auto-generating Mappings

You can automatically generate mappings based on source and target samples:

```typescript
import { createBasicMapping } from './services/csv-mapping-definitions';

// Auto-generate mapping based on field names
const autoMapping = createBasicMapping(sourceSample, targetSample);
```

## Example Component

See `csv-mapper-example.ts` for a complete example component that demonstrates how to use the CSV Mapper service with a user interface.

## Adding New Mappings

To add new mapping configurations, edit `csv-mapping-definitions.ts` and add your mapping to the `CSV_MAPPINGS` object. 
