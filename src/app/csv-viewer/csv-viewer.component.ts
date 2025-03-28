import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MessageService, ConfirmationService } from 'primeng/api';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { ToolbarModule } from 'primeng/toolbar';
import { FileUploadModule } from 'primeng/fileupload';

// Angular Material imports
import { MatCardModule } from '@angular/material/card';

// AG Grid imports
import { AgGridModule } from 'ag-grid-angular';
import {
  ColDef,
  CellValueChangedEvent,
  ModuleRegistry,
  ClientSideRowModelModule,
  ColumnAutoSizeModule,
  ValidationModule,
  PaginationModule,
  RowSelectionModule,
  TextFilterModule,
  NumberFilterModule,
  DateFilterModule,
  CustomFilterModule,
  TextEditorModule,
} from 'ag-grid-community';
import * as Papa from 'papaparse';
import { CsvMapperService } from '../services/csv-mapper.service';
import { CSV_MAPPINGS } from '../services/csv-mapping-definitions';

// Register required AG Grid modules
ModuleRegistry.registerModules([
  ClientSideRowModelModule,
  ColumnAutoSizeModule,
  ValidationModule,
  PaginationModule,
  RowSelectionModule,
  TextFilterModule,
  NumberFilterModule,
  DateFilterModule,
  CustomFilterModule,
  TextEditorModule,
]);

/**
 * Interface for CSV data structure
 */
interface CsvData {
  [key: string]: string;
}

@Component({
  selector: 'app-csv-viewer',
  standalone: true,
  imports: [
    CommonModule,
    CardModule,
    ButtonModule,
    InputTextModule,
    ToastModule,
    ConfirmDialogModule,
    DialogModule,
    ToolbarModule,
    FileUploadModule,
    MatCardModule,
    AgGridModule,
    ProgressSpinnerModule,
  ],
  templateUrl: './csv-viewer.component.html',
  styleUrls: ['./csv-viewer.component.scss'],
  providers: [MessageService, ConfirmationService],
})
export class CsvViewerComponent implements OnInit {
  csvData: CsvData[] = [];

  columns: string[] = [];
  columnDefs: ColDef[] = [];

  // AG Grid properties
  defaultColDef: ColDef = {
    sortable: true,
    filter: true,
    resizable: true,
    minWidth: 150,
    flex: 1,
    autoHeight: false,
    wrapText: false,
  };

  loading = false;
  fileName = '';
  dataModified = false;
  mappingName = 'standardToVGC';

  constructor(
    private readonly messageService: MessageService,
    private readonly csvMapper: CsvMapperService
  ) {}

  ngOnInit(): void {
    console.log('CSV Viewer Component initialized');
  }

  onFileSelect(event: any): void {
    this.loading = true;
    console.log('File selected:', event);

    const file = event.files[0];
    if (!file) {
      this.loading = false;
      this.showError('No file selected');
      return;
    }

    this.fileName = file.name;

    console.log('Processing file:', file.name);

    this.parseCSV(file);
  }

  parseCSV(file: File): void {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (result) => {
        console.log('Parsing complete', result);

        if (result.errors.length > 0) {
          console.error('Parsing errors:', result.errors);
          this.showError('Error parsing CSV: ' + result.errors[0].message);
          this.loading = false;
          return;
        }
        const mapping = CSV_MAPPINGS[this.mappingName];
        const mappedData = this.csvMapper.mapData(
          result.data as CsvData[],
          mapping
        );

        this.csvData = [...mappedData];
        // Generate column definitions for AG Grid - always editable
        this.columnDefs = mapping.columnDefinitions;

        console.log(
          'CSV data loaded:',
          this.csvData.length,
          'rows and',
          this.columnDefs.length,
          'columns'
        );

        this.loading = false;
        this.dataModified = false;
        // No need to set edit mode since we're always in edit mode

        if (this.csvData.length > 0) {
          this.showSuccess(
            `CSV loaded with ${this.csvData.length} rows and ${this.columns.length} columns. Cells are editable.`
          );
        } else {
          this.showWarn('The CSV file appears to be empty or malformed');
        }
      },
      error: (error) => {
        console.error('Parse error:', error);
        this.showError('Error parsing CSV: ' + error.message);
        this.loading = false;
      },
    });
  }

  onCellValueChanged(event: CellValueChangedEvent): void {
    // Mark data as modified when cell content changes
    this.dataModified = true;
    console.log('Cell changed:', event);
  }

  downloadCsv(): void {
    if (!this.csvData.length) {
      this.showWarn('No data to download');
      return;
    }

    // Generate CSV content
    const csv = Papa.unparse(this.csvData);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });

    // Generate download filename
    let downloadName = 'download.csv';
    if (this.fileName) {
      const nameWithoutExt = this.fileName.replace(/\.csv$/i, '');
      downloadName = this.dataModified
        ? `${nameWithoutExt}_edited.csv`
        : `${nameWithoutExt}_copy.csv`;
    }

    // Create download link
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);

    link.setAttribute('href', url);
    link.setAttribute('download', downloadName);
    link.style.visibility = 'hidden';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    this.showSuccess(`File downloaded as ${downloadName}`);
  }

  hasChanges(): boolean {
    return this.dataModified;
  }

  showSuccess(message: string): void {
    this.messageService.add({
      severity: 'success',
      summary: 'Success',
      detail: message,
    });
  }

  showInfo(message: string): void {
    this.messageService.add({
      severity: 'info',
      summary: 'Info',
      detail: message,
    });
  }

  showWarn(message: string): void {
    this.messageService.add({
      severity: 'warn',
      summary: 'Warning',
      detail: message,
    });
  }

  showError(message: string): void {
    this.messageService.add({
      severity: 'error',
      summary: 'Error',
      detail: message,
    });
  }
}
