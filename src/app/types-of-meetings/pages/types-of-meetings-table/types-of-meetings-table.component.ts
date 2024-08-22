import { Component, OnInit } from '@angular/core';
import {
  Frequency,
  TypeOfMeeting,
} from '../../interfaces/type-of-meeting.interface';
import { TypesOfMeetingsService } from '../../services/types-of-meetings.service';
import { Area } from 'src/app/areas/interfaces/area.interface';
import { AreasService } from 'src/app/areas/services/areas.service';
import { ConfirmationService, MessageService } from 'primeng/api';

@Component({
  selector: 'app-types-of-meetings-table',
  templateUrl: './types-of-meetings-table.component.html',
  styleUrls: ['./types-of-meetings-table.component.css'],
  providers: [ConfirmationService, MessageService],
})
export class TypesOfMeetingsTableComponent implements OnInit {
  areas: Area[] = [];
  frequencies: Frequency[] = [
    Frequency.daily,
    Frequency.weekly,
    Frequency.fortnightly,
    Frequency.monthly,
    Frequency.yearly,
  ];
  typesOfMeetings: TypeOfMeeting[] = [];

  constructor(
    private typesOfMeetingsService: TypesOfMeetingsService,
    private areasService: AreasService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.areasService.getAll().subscribe((resp) => {
      this.areas = resp;
      this.areas.sort((a, b) => a.name.localeCompare(b.name));
    });

    this.typesOfMeetingsService.getAll().subscribe((resp) => {
      resp.forEach((value) => {
        const typeOfMeeting: TypeOfMeeting = {
          id: value.id,
          name: value.name,
          FK_idWorkArea: this.areas.find(
            (area) => area.id === value.FK_idWorkArea
          )?.name!,
          frequency: value.frequency,
        };

        this.typesOfMeetings.push(typeOfMeeting);
      });
    });
  }

  remove(event: Event, id: string): void {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Está seguro de que desea eliminar este tipo de reunión?',
      header: 'Eliminar Tipo de Reunión',
      icon: 'pi pi-exclamation-triangle',
      acceptButtonStyleClass: 'p-button-danger p-button-text',
      acceptLabel: 'Sí',
      rejectButtonStyleClass: 'p-button-text p-button-text',
      accept: () => {
        this.messageService.add({
          severity: 'info',
          detail: 'El tipo de reunión ha sido eliminado',
          summary: 'Tipo de Reunión Eliminado',
        });
        this.typesOfMeetingsService.remove(id).subscribe(console.log);
        this.typesOfMeetings = this.typesOfMeetings.filter(
          (typeOfMeeting) => typeOfMeeting.id !== id
        );
      },
      reject: () => {},
    });
    // this.areasService.remove(id).subscribe(console.log);
  }
}
