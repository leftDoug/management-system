import { Component, OnInit } from '@angular/core';
import { WorkerX } from '../../interfaces/worker.interface';
import { WorkersService } from '../../services/workers.service';
import { ConfirmationService, MessageService } from 'primeng/api';

@Component({
  selector: 'app-workers-table',
  templateUrl: './workers-table.component.html',
  styleUrls: ['./workers-table.component.css'],
  providers: [MessageService, ConfirmationService],
})
export class WorkersTableComponent implements OnInit {
  workers: WorkerX[] = [];

  constructor(private workersService: WorkersService) {}

  ngOnInit(): void {
    this.workersService.xgetAll().subscribe((w) => (this.workers = w));
  }
}
