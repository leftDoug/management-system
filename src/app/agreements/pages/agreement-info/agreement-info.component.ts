import { Component, OnInit } from '@angular/core';
import { Agreement, Status } from '../../interfaces/agreement.interface';
import { ActivatedRoute } from '@angular/router';
import { AgreementsService } from '../../services/agreements.service';
import { switchMap } from 'rxjs';
import {
  ConfirmEventType,
  ConfirmationService,
  Message,
  MessageService,
} from 'primeng/api';

@Component({
  selector: 'app-agreement',
  templateUrl: './agreement-info.component.html',
  styleUrls: ['./agreement-info.component.css'],
  providers: [ConfirmationService, MessageService],
})
export class AgreementInfoComponent implements OnInit {
  agreement: Agreement = {
    id: '',
    number: 0,
    content: '',
    workArea: '',
    meeting: '',
    meetingDate: new Date(),
    meetingStartTime: new Date(),
    meetingEndTime: new Date(),
    session: '',
    createdBy: '',
    responsible: '',
    answer: '',
    agreementCompilanceDate: new Date(),
    status: Status.incumplido,
  };
  messages: Message[] = [];
  canceled: boolean = false;

  constructor(
    private activatedRoute: ActivatedRoute,
    private agreementsService: AgreementsService,
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
  }

  // BUG: getSeverity esta implementado 2 veces
  getSeverity(compilanceStatus: string): string {
    switch (compilanceStatus) {
      case 'cumplido':
        return 'text-bg-success';
      case 'en proceso':
        return 'text-bg-primary';
      case 'anulado':
        return 'text-bg-secondary';
      default:
        return 'text-bg-danger';
    }
  }

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
        this.agreementsService.remove(this.agreement!.id!);
        this.canceled = true;
      },
      reject: () => {},
      rejectButtonStyleClass: 'mx-3',
    });
  }
}
