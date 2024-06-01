import { Component } from '@angular/core';
import { Agreement } from '../../interfaces/agreements.interface';
import { AgreementsService } from '../../services/agreements.service';

interface Status {
  label: string;
  value: boolean;
}

@Component({
  selector: 'app-agreements-table',
  templateUrl: './agreements-table.component.html',
  styleUrls: ['./agreements-table.component.css'],
})
export class AgreementsTableComponent {
  removedAgreement: Agreement | undefined;
  statuses: Status[] = [
    { label: 'CUMPLIDO', value: true },
    { label: 'INCUMPLIDO', value: false },
  ];
  sessions: string[] = ['Ordinaria', 'Extraordinaria'];
  meetings: string[] = ['Reunion 1', 'Reunion 2', 'Reunion 3'];
  areas: string[] = ['RRHH', 'Transporte', 'Contabilidad'];
  searchText: string = '';

  get agreements(): Agreement[] {
    return this.agreementsSrevice.agreements;
  }

  constructor(private agreementsSrevice: AgreementsService) {}

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

  // FIXME: implementar este metodo
  search(event: any) {
    const value = event.target.value;
    console.log(value);
  }
}
