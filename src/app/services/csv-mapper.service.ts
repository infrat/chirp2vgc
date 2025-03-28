import { Injectable } from '@angular/core';
import { ColDef } from 'ag-grid-community';
import * as Papa from 'papaparse';

/**
 * Interface for CSV data structure
 */
export interface CsvData {
  [key: string]: string;
}

/**
 * Mapping rule for transforming data from one format to another
 */
export interface MappingRule {
  /**
   * The source field name from the input CSV
   */
  sourceField: string;

  /**
   * The target field name for the output CSV
   */
  targetField: string;

  /**
   * Optional transformation function to apply to the field value
   * If not provided, the value will be used as-is
   */
  transform?: (value: string, row: CsvData) => string | null;
}

export interface LocalColDef extends ColDef {
  defaultValue: string;
}

/**
 * Full mapping configuration between source and target CSV formats
 */
export interface MappingConfig {
  /**
   * Description of what this mapping does
   */
  columnDefinitions: LocalColDef[];

  /**
   * Array of mapping rules to apply when transforming data
   */
  rules: MappingRule[];

  /**
   * Optional function to filter which rows get included in the output
   * Return true to include the row, false to exclude it
   */
  filterRow?: (row: CsvData) => boolean;

  /**
   * Optional function to create additional rows based on an input row
   * Return an array of rows to add to the output
   */
  expandRow?: (row: CsvData) => CsvData[];

  /**
   * Optional default value to use when a source field is not found
   * If not specified, an empty string will be used
   */
  defaultValue?: string;
}

@Injectable({
  providedIn: 'root',
})
export class CsvMapperService {
  constructor() {}

  /**
   * Map CSV data from one format to another using the provided mapping configuration
   * @param inputData The source CSV data to transform
   * @param mappingConfig The configuration that defines how to map between formats
   * @returns Transformed CSV data in the target format
   */
  mapData(inputData: CsvData[], mappingConfig: MappingConfig): CsvData[] {
    // Array to collect the mapped output rows
    const outputData: CsvData[] = [];

    // Process each input row
    for (const inputRow of inputData) {
      // Check if we should filter out this row
      if (mappingConfig.filterRow && !mappingConfig.filterRow(inputRow)) {
        continue; // Skip this row
      }

      // Map the row according to the rules
      const mappedRows = this.mapRow(inputRow, mappingConfig);

      // Add the mapped row(s) to the output
      outputData.push(...mappedRows);
    }

    console.log(
      `Mapping complete. Transformed ${inputData.length} rows into ${outputData.length} rows.`
    );
    return outputData;
  }

  /**
   * Map a single row according to the mapping rules
   * @param inputRow The source row to transform
   * @param mappingConfig The mapping configuration to apply
   * @returns Array of transformed rows (may be multiple if expandRow is used)
   */
  private mapRow(inputRow: CsvData, mappingConfig: MappingConfig): CsvData[] {
    const mappedRow: CsvData = {};
    for (const column of mappingConfig.columnDefinitions) {
      if (!column.field) {
        continue;
      }
      const ruleList = mappingConfig.rules.filter(
        (rule) => rule.targetField === column.field
      );
      mappedRow[column.field] = column.defaultValue;
      for (const rule of ruleList) {
        if (!rule) {
          continue;
        }
        let value: string | null = inputRow[rule.sourceField] ?? '';

        if (rule.transform) {
          value = rule.transform(value, inputRow);
        }

        if (value) {
          mappedRow[column.field] = value;
        }
      }
    }

    // Check if we need to expand this row into multiple rows
    if (mappingConfig.expandRow) {
      const expandedRows = mappingConfig.expandRow(inputRow);

      // Merge the mapped values into each expanded row
      return expandedRows.map((expandedRow) => ({
        ...mappedRow,
        ...expandedRow,
      }));
    }
    // Return the single mapped row
    return [mappedRow];
  }

  /**
   * Parse a CSV file into structured data
   * @param file The CSV file to parse
   * @returns Promise that resolves to the parsed data
   */
  parseCSV(file: File): Promise<CsvData[]> {
    return new Promise((resolve, reject) => {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (result) => {
          if (result.errors.length > 0) {
            reject(new Error(`Error parsing CSV: ${result.errors[0].message}`));
            return;
          }

          // Convert results to CsvData type and resolve
          const typedData: CsvData[] = result.data as CsvData[];
          resolve(typedData);
        },
        error: (error) => {
          reject(new Error(`Error parsing CSV: ${error.message}`));
        },
      });
    });
  }

  /**
   * Generate a CSV file from the data and trigger download
   * @param data The data to convert to CSV
   * @param filename The name to give the downloaded file
   */
  generateAndDownloadCSV(data: CsvData[], filename: string): void {
    if (!data.length) {
      console.warn('No data to download');
      return;
    }

    // Generate CSV content
    const csv = Papa.unparse(data);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });

    // Create download link
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);

    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    console.log(`CSV file downloaded as ${filename}`);
  }
}
