import { Component, OnInit } from '@angular/core';
import { Agreement } from '../../interfaces/agreements.interface';
import { ActivatedRoute } from '@angular/router';
import { AgreementsService } from '../../services/agreements.service';
import {
  ConfirmEventType,
  ConfirmationService,
  Message,
  MessageService,
} from 'primeng/api';

@Component({
  selector: 'app-agreement',
  templateUrl: './agreement.component.html',
  styleUrls: ['./agreement.component.css'],
  providers: [ConfirmationService, MessageService],
})
export class AgreementComponent implements OnInit {
  agreement: Agreement | undefined;
  messages: Message[] = [];
  canceled: boolean = false;

  constructor(
    private activatedRoute: ActivatedRoute,
    private agreementsService: AgreementsService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(({ id }) => {
      this.agreement = this.agreementsService.getById(id);
    });
    this.messages = [
      {
        severity: 'info',
        detail: `El acuerdo ${this.agreement?.number} fue anulado`,
      },
    ];
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
        this.agreementsService.remove(this.agreement!.id);
        this.canceled = true;
      },
      reject: () => {},
      rejectButtonStyleClass: 'mx-3',
    });
  }
}
