import { Component, OnInit } from '@angular/core';
import { Worker } from '../../interfaces/worker.interface';
import { WorkersService } from '../../services/workers.service';
import { ConfirmationService, MessageService } from 'primeng/api';

@Component({
  selector: 'app-workers-table',
  templateUrl: './workers-table.component.html',
  styleUrls: ['./workers-table.component.css'],
  providers: [MessageService, ConfirmationService],
})
export class WorkersTableComponent implements OnInit {
  workers: Worker[] = [];

  constructor(private workersService: WorkersService) {}

  ngOnInit(): void {
    this.workersService.getAll().subscribe((w) => (this.workers = w));
  }
}
