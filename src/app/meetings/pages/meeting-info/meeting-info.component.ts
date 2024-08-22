import { Component, OnInit } from '@angular/core';
import { Meeting, Session } from '../../interfaces/meeting.interface';
import { MeetingsService } from '../../services/meetings.service';
import { WorkersService } from 'src/app/workers/services/workers.service';
import { TypesOfMeetingsService } from 'src/app/types-of-meetings/services/types-of-meetings.service';
import { ActivatedRoute } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { switchMap, tap } from 'rxjs';

@Component({
  selector: 'app-meeting-info',
  templateUrl: './meeting-info.component.html',
  styleUrls: ['./meeting-info.component.css'],
  providers: [ConfirmationService, MessageService],
})
export class MeetingInfoComponent implements OnInit {
  meeting: Meeting = {
    id: '',
    FK_idResponsible: '',
    FK_idTypeOfMeeting: '',
    name: '',
    date: new Date(),
    endTime: new Date(),
    startTime: new Date(),
    session: Session.ordinary,
  };
  responsible: string = '';
  typeOfMeeting: string = '';

  constructor(
    private meetingsService: MeetingsService,
    private workersService: WorkersService,
    private typesOfMeetingsService: TypesOfMeetingsService,
    private activatedRoute: ActivatedRoute,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit(): void {
    this.activatedRoute.params
      .pipe(
        switchMap(({ id }) => this.meetingsService.getById(id)),
        tap((m) => {
          this.workersService
            .getById(m.FK_idResponsible)
            .subscribe((w) => (this.responsible = w.name));
        }),
        tap((m) => {
          this.typesOfMeetingsService
            .getById(m.FK_idTypeOfMeeting)
            .subscribe((t) => (this.typeOfMeeting = t.name));
        })
      )
      .subscribe((m) => (this.meeting = m));
  }

  remove(event: Event): void {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Está seguro de que desea eliminar esta reunión?',
      header: 'Eliminar Reunión',
      icon: 'pi pi-exclamation-triangle',
      acceptButtonStyleClass: 'p-button-danger p-button-text',
      acceptLabel: 'Sí',
      rejectButtonStyleClass: 'p-button-text p-button-text',
      accept: () => {
        this.messageService.add({
          severity: 'info',
          detail: 'La reunión ha sido eliminada',
          summary: 'Reunión Eliminada',
        });
        this.meetingsService.remove(this.meeting.id).subscribe(console.log);
      },
      reject: () => {},
    });
    // this.areasService.remove(id).subscribe(console.log);
  }
}
