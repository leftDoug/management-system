import { Component, OnInit } from '@angular/core';
import { Agreement, Status } from '../../interfaces/agreement.interface';
import { ActivatedRoute } from '@angular/router';
import { AgreementsService } from '../../services/agreements.service';
import { switchMap, tap } from 'rxjs';
import {
  ConfirmEventType,
  ConfirmationService,
  Message,
  MessageService,
} from 'primeng/api';
import { AreasService } from 'src/app/areas/services/areas.service';
import { WorkersService } from 'src/app/workers/services/workers.service';
import { MeetingsService } from 'src/app/meetings/services/meetings.service';
import { SessionsService } from 'src/app/sessions/services/sessions.service';
import { getSeverity, getStatus } from 'src/app/shared/severity-status';

@Component({
  selector: 'app-agreement',
  templateUrl: './agreement-info.component.html',
  styleUrls: ['./agreement-info.component.css'],
  providers: [ConfirmationService, MessageService],
})
export class AgreementInfoComponent implements OnInit {
  agreement: Agreement = {
    id: '',
    FK_idArea: '',
    FK_idCreatedBy: '',
    FK_idMeeting: '',
    FK_idResponsible: '',
    FK_idSession: '',
    answer: '',
    canceled: false,
    compilanceDate: new Date(),
    completed: false,
    content: '',
    meetingDate: new Date(),
    meetingEndTime: new Date(),
    meetingStartTime: new Date(),
    number: 0,
  };
  area: string = '';
  createdBy: string = '';
  meeting: string = '';
  messages: Message[] = [];
  responsible: string = '';
  session: string = '';
  // canceled: boolean = false;

  // TODO: poner un delay para k no se vea el estado inicial al abrir la pagina

  constructor(
    private activatedRoute: ActivatedRoute,
    private agreementsService: AgreementsService,
    private areasService: AreasService,
    private workersService: WorkersService,
    private meetingsService: MeetingsService,
    private sessionsService: SessionsService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.activatedRoute.params
      .pipe(
        switchMap(({ id }) => this.agreementsService.getById(id)),
        tap((resp) => {
          this.areasService
            .getById(resp.FK_idArea)
            .subscribe((resp) => (this.area = resp.name));
        }),
        tap((resp) => {
          this.workersService
            .getById(resp.FK_idCreatedBy)
            .subscribe((resp) => (this.createdBy = resp.name));
        }),
        tap((resp) => {
          this.meetingsService
            .getById(resp.FK_idMeeting)
            .subscribe((resp) => (this.meeting = resp.name));
        }),
        tap((resp) => {
          this.workersService
            .getById(resp.FK_idResponsible)
            .subscribe((resp) => (this.responsible = resp.name));
        }),
        tap((resp) => {
          this.sessionsService
            .getById(resp.FK_idSession)
            .subscribe((resp) => (this.session = resp.name));
        })
      )
      .subscribe((resp) => (this.agreement = resp));
    // this.messages = [
    //   {
    //     severity: 'info',
    //     detail: `El acuerdo ${this.agreement!.number} fue anulado`,
    //   },
    // ];
  }

  get severity(): string {
    return getSeverity(this.agreement, null);
  }

  get status(): Status {
    return getStatus(this.agreement);
  }

  cancel(): void {
    this.confirmationService.confirm({
      message: 'Está seguro de que desea anular este acuerdo?',
      header: 'Anular Acuerdo',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sí',
      accept: () => {
        this.messageService.add({
          severity: 'info',
          detail: 'El acuerdo ha sido anulado',
          summary: 'Acuerdo Anulado',
        });
        this.agreementsService
          .cancel(this.agreement)
          .subscribe((resp) => (this.agreement = resp));
        // this.canceled = true;
      },
      reject: () => {},
      rejectButtonStyleClass: 'mx-3',
    });
  }
}
