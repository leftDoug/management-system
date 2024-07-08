import { Component, OnInit } from '@angular/core';
import { Agreement } from '../../interfaces/agreement.interface';
import { ActivatedRoute } from '@angular/router';
import { AgreementsService } from '../../services/agreements.service';
import { switchMap } from 'rxjs';
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

@Component({
  selector: 'app-agreement',
  templateUrl: './agreement-info.component.html',
  styleUrls: ['./agreement-info.component.css'],
  providers: [ConfirmationService, MessageService],
})
export class AgreementInfoComponent implements OnInit {
  // agreement: Agreement = {
  //   id: '',
  //   number: 0,
  //   content: '',
  //   workArea: '',
  //   meeting: '',
  //   meetingDate: new Date(),
  //   meetingStartTime: new Date(),
  //   meetingEndTime: new Date(),
  //   session: '',
  //   createdBy: '',
  //   responsible: '',
  //   answer: '',
  //   agreementCompilanceDate: new Date(),
  //   status: Status.incumplido,
  // };
  agreement!: Agreement;
  area!: string;
  responsible!: string;
  createdBy!: string;
  meeting!: string;
  session!: string;
  messages: Message[] = [];
  // canceled: boolean = false;

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
      .pipe(switchMap(({ id }) => this.agreementsService.getById(id)))
      .subscribe((resp) => {
        this.agreement = resp;
      });
    // this.activatedRoute.params.subscribe(({ id }) => {
    //   this.agreementsService
    //     .getById(id)
    //     .subscribe((resp) => (this.agreement = resp));
    // });
    // this.activatedRoute.params.subscribe(({ id }) => {
    //   if (id)
    //     if (this.agreementsService.getById(id))
    //       this.agreement = this.agreementsService.getById(id);
    // });
    // this.messages = [
    //   {
    //     severity: 'info',
    //     detail: `El acuerdo ${this.agreement!.number} fue anulado`,
    //   },
    // ];
    this.areasService
      .getById(this.agreement.FK_idArea)
      .subscribe((resp) => (this.area = resp.name));
    this.workersService
      .getById(this.agreement.FK_idResponsible)
      .subscribe((resp) => (this.responsible = resp.name));
    this.workersService
      .getById(this.agreement.FK_idCreatedBy)
      .subscribe((resp) => (this.createdBy = resp.name));
    this.meetingsService
      .getById(this.agreement.FK_idMeeting)
      .subscribe((resp) => (this.meeting = resp.name));
    this.sessionsService
      .getById(this.agreement.FK_idSession)
      .subscribe((resp) => (this.session = resp.name));
  }

  // BUG: getSeverity esta implementado 2 veces
  // getSeverity(compilanceStatus: string): string {
  //   switch (compilanceStatus) {
  //     case 'cumplido':
  //       return 'text-bg-success';
  //     case 'en proceso':
  //       return 'text-bg-primary';
  //     case 'anulado':
  //       return 'text-bg-secondary';
  //     default:
  //       return 'text-bg-danger';
  //   }
  // }

  remove(): void {
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
