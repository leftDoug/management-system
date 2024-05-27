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

  deleteAgreement(agreement: Agreement): void {
    this.agreementsSrevice.remove(agreement.number);
  }

  get agreements(): Agreement[] {
    return this.agreementsSrevice.agreements;
  }

  constructor(private agreementsSrevice: AgreementsService) {}

  getSeverity(status: string): string {
    switch (status) {
      case 'CUMPLIDO':
        return 'success';
      case 'EN PROCESO':
        return 'warning';
      default:
        return 'danger';
    }
  }

  getStatus(completed: boolean, date: Date): string {
    if (completed) {
      return 'CUMPLIDO';
    } else if (date.getTime() - new Date().getTime() >= 0) {
      return 'EN PROCESO';
    } else {
      return 'INCUMPLIDO';
    }
  }

  search(event: any) {
    const value = event.target.value;
    console.log(value);
  }
}
