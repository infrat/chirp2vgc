import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CsvViewerComponent } from './csv-viewer/csv-viewer.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CsvViewerComponent, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'CSV Viewer & Editor Application';
  currentYear = new Date().getFullYear();
}
