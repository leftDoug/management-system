import { Component, OnInit } from '@angular/core';
import { Agreement } from '../../interfaces/agreements.interface';
import { AgreementsService } from '../../services/agreements.service';

interface Status {
  label: string;
  value: string;
}

@Component({
  selector: 'app-agreements-table',
  templateUrl: './agreements-table.component.html',
  styleUrls: ['./agreements-table.component.css'],
})
export class AgreementsTableComponent implements OnInit {
  removedAgreement: Agreement | undefined;
  // statuses: Status[] = [
  //   { label: 'CUMPLIDO', value: true },
  //   { label: 'INCUMPLIDO', value: false },
  // ];
  statuses2: Status[] = [
    { label: 'CUMPLIDO', value: 'CUMPLIDO' },
    { label: 'INCUMPLIDO', value: 'INCUMPLIDO' },
    { label: 'ANULADO', value: 'ANULADO' },
    { label: 'EN PROCESO', value: 'EN PROCESO' },
  ];
  sessions: string[] = ['Ordinaria', 'Extraordinaria'];
  meetings: string[] = ['Reunion 1', 'Reunion 2', 'Reunion 3'];
  areas: string[] = ['RRHH', 'Transporte', 'Contabilidad'];
  searchText: string = '';
  agreements: Agreement[] = [];

  // get agreements(): Agreement[] {
  //   this._agreements = this.agreementsService.agreements;
  //   return this._agreements;
  // }

  get fulfilledAgreements(): number {
    let amount = 0;
    this.agreements.forEach((agreement) => {
      if (agreement.fulfilled) amount++;
    });
    return amount;
  }

  get unfulfilledAgreements(): number {
    let amount = 0;
    this.agreements.forEach((agreement) => {
      if (this.getStatus(agreement) === 'INCUMPLIDO') amount++;
    });
    return amount;
  }

  get inProcessAgreements(): number {
    let amount = 0;
    this.agreements.forEach((agreement) => {
      if (this.getStatus(agreement) === 'EN PROCESO') amount++;
    });
    return amount;
  }

  get canceledAgreements(): number {
    let amount = 0;
    this.agreements.forEach((agreement) => {
      if (!agreement.status) amount++;
    });
    return amount;
  }

  constructor(private agreementsService: AgreementsService) {}
  ngOnInit(): void {
    this.agreements = this.agreementsService.agreements;
  }

  // BUG: getSeverity esta implementado 2 veces
  getSeverity(compilanceStatus: string): string {
    switch (compilanceStatus) {
      case 'CUMPLIDO':
        return 'text-bg-success';
      case 'EN PROCESO':
        return 'text-bg-primary';
      case 'ANULADO':
        return 'text-bg-secondary';
      default:
        return 'text-bg-danger';
    }
  }

  // BUG: getStatus esta implementado 2 veces (se pueden meter en el servicio)
  getStatus(agreement: Agreement): string {
    if (!agreement.status) return 'ANULADO';
    if (agreement.fulfilled) return 'CUMPLIDO';
    if (agreement.agreementCompilanceDate.getTime() - new Date().getTime() >= 0)
      return 'EN PROCESO';
    return 'INCUMPLIDO';
  }

  // FIXME: implementar este metodo (solo filtra x area)
  search(event: any): void {
    const value = event.target.value;
    this.agreements = [];
    this.agreementsService.agreements.forEach((agreement) => {
      if (agreement.area.toLowerCase().includes(value)) {
        this.agreements.push(agreement);
      }
    });
  }

  setRowColor(agreement: Agreement): string {
    if (agreement.fulfilled) return 'completed';
    if (this.getStatus(agreement) === 'ANULADO') return 'removed';
    if (this.getStatus(agreement) === 'INCUMPLIDO') return 'incomplete';
    return '';
  }

  print(event: any): void {
    console.log(event);
  }
}
