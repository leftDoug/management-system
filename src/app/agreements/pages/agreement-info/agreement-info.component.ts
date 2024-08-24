import { Component, OnInit } from '@angular/core';
import { Agreement, Status } from '../../interfaces/agreement.interface';
import { ActivatedRoute } from '@angular/router';
import { AgreementsService } from '../../services/agreements.service';
import { switchMap, tap } from 'rxjs';
import { ConfirmationService, Message, MessageService } from 'primeng/api';
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
    FK_idCreatedBy: '',
    FK_idMeeting: '',
    FK_idResponsible: '',
    answer: '',
    canceled: false,
    compilanceDate: new Date(),
    completed: false,
    content: '',
    number: 0,
  };
  createdBy: string = '';
  meeting: string = '';
  responsible: string = '';

  // TODO: poner un delay para k no se vea el estado inicial al abrir la pagina

  constructor(
    private activatedRoute: ActivatedRoute,
    private agreementsService: AgreementsService,
    private confirmationService: ConfirmationService,
    private meetingsService: MeetingsService,
    private messageService: MessageService,
    private workersService: WorkersService
  ) {}

  ngOnInit(): void {
    this.activatedRoute.params
      .pipe(
        switchMap(({ id }) => this.agreementsService.getById(id)),
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
        })
      )
      .subscribe((resp) => (this.agreement = resp));
  }

  get severity(): string {
    return getSeverity(this.agreement, null);
  }

  setSeverity(status: Status) {
    return getSeverity(null, status);
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
      },
      reject: () => {},
      rejectButtonStyleClass: 'mx-3',
    });
  }
}
