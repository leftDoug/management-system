import { Component, OnInit } from '@angular/core';
import { Agreement } from '../../interfaces/agreements.interface';
import { ActivatedRoute } from '@angular/router';
import { AgreementsService } from '../../services/agreements.service';
import { Message } from 'primeng/api';

@Component({
  selector: 'app-agreement',
  templateUrl: './agreement.component.html',
  styleUrls: ['./agreement.component.css'],
})
export class AgreementComponent implements OnInit {
  agreement: Agreement | undefined;
  messages: Message[] = [];
  canceled: boolean = false;

  constructor(
    private activatedRoute: ActivatedRoute,
    private agreementsService: AgreementsService
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
      case 'CUMPLIDO':
        return 'success';
      case 'EN PROCESO':
        return 'warning';
      case 'ANULADO':
        return 'info';
      default:
        return 'danger';
    }
  }

  // BUG: getStatus esta implementado 2 veces
  getStatus(completed: boolean, date: Date, status: boolean): string {
    if (!status) return 'ANULADO';
    if (completed) {
      return 'CUMPLIDO';
    } else if (date.getTime() - new Date().getTime() >= 0) {
      return 'EN PROCESO';
    } else {
      return 'INCUMPLIDO';
    }
  }

  remove(): void {
    this.agreementsService.remove(this.agreement!.id);
    this.canceled = true;
  }
}
