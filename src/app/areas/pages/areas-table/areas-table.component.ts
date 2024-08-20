import { Component } from '@angular/core';
import { Area } from '../../interfaces/area.interface';
import { AreasService } from '../../services/areas.service';
import { ConfirmationService, MessageService } from 'primeng/api';

@Component({
  selector: 'app-areas-table',
  templateUrl: './areas-table.component.html',
  styleUrls: ['./areas-table.component.css'],
  providers: [ConfirmationService, MessageService],
})
export class AreasTableComponent {
  areas: Area[] = [];

  constructor(
    private areasService: AreasService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.areasService.getAll().subscribe((resp) => (this.areas = resp));
  }

  remove(event: Event, id: string): void {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Está seguro de que desea eliminar esta área?',
      header: 'Eliminar Área',
      icon: 'pi pi-exclamation-triangle',
      acceptButtonStyleClass: 'p-button-danger p-button-text',
      acceptLabel: 'Sí',
      rejectButtonStyleClass: 'p-button-text p-button-text',
      accept: () => {
        this.messageService.add({
          severity: 'info',
          detail: 'El área ha sido eliminada',
          summary: 'Área Eliminada',
        });
        this.areasService.remove(id).subscribe(console.log);
        this.areas = this.areas.filter((area) => area.id !== id);
      },
      reject: () => {},
    });
    // this.areasService.remove(id).subscribe(console.log);
  }

  hello(id: string): void {
    console.log(id);
  }
}
