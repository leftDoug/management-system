import { Component, OnInit } from '@angular/core';
import { WorkerX } from '../../interfaces/worker.interface';
import { Area } from 'src/app/areas/interfaces/area.interface';
import { WorkersService } from '../../services/workers.service';
import { AreasService } from 'src/app/areas/services/areas.service';
import { ActivatedRoute } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { WorkersAreasService } from 'src/app/shared/services/workers-areas.service';
import { WorkerArea } from 'src/app/shared/navbar/worker-area.interface';
import { switchMap, tap } from 'rxjs';

@Component({
  selector: 'app-worker-info',
  templateUrl: './worker-info.component.html',
  styleUrls: ['./worker-info.component.css'],
  providers: [ConfirmationService, MessageService],
})
export class WorkerInfoComponent implements OnInit {
  worker: WorkerX = {
    id: '',
    name: '',
    occupation: '',
    email: '',
    secretary: false,
  };
  workersAreas: WorkerArea[] = [];
  areas: Area[] = [];
  wAreas: Area[] = [];

  constructor(
    private workersService: WorkersService,
    private areasService: AreasService,
    private activatedRoute: ActivatedRoute,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private workersAreasService: WorkersAreasService
  ) {}

  ngOnInit(): void {
    this.activatedRoute.params
      .pipe(
        tap(({ id }) =>
          this.workersAreasService
            .getByIdWorker(id)
            .subscribe((wa) => (this.workersAreas = wa))
        ),
        switchMap(({ id }) => this.workersService.xgetById(id))
      )
      .subscribe((w) => (this.worker = w));

    this.areasService.getAll().subscribe((a) => {
      a.forEach((area) => {
        if (this.workersAreas.find((wa) => area.id === wa.FK_idWorkArea)) {
          this.areas.push(area);
        }
      });

      this.areas.sort((a, b) => a.name.localeCompare(b.name));
    });
  }

  remove(event: Event): void {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Está seguro de que desea eliminar este trabajador?',
      header: 'Eliminar Trabajador',
      icon: 'pi pi-exclamation-triangle',
      acceptButtonStyleClass: 'p-button-danger p-button-text',
      acceptLabel: 'Sí',
      rejectButtonStyleClass: 'p-button-text p-button-text',
      accept: () => {
        this.messageService.add({
          severity: 'info',
          detail: 'El trabajador ha sido eliminado',
          summary: 'Trabajador Eliminado',
        });
        this.workersService.remove(this.worker).subscribe(console.log);
      },
      reject: () => {},
    });
  }
}
