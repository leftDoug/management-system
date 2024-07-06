import { Component, OnInit } from '@angular/core';
import { Agreement } from '../../interfaces/agreement.interface';
import { AgreementsService } from '../../services/agreements.service';
import { Router } from '@angular/router';

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
  statuses2: string[] = ['cumplido', 'incumplido', 'anulado', 'en proceso'];
  sessions: string[] = ['Ordinaria', 'Extraordinaria'];
  meetings: string[] = ['Reunion 1', 'Reunion 2', 'Reunion 3'];
  areas: string[] = ['RRHH', 'Transporte', 'Contabilidad'];
  responsibles: string[] = ['Doug Left', 'Douglas Izquierdo', 'Otros'];
  searchText: string = '';
  agreements: Agreement[] = [];
  loading: boolean = true;

  // get agreements(): Agreement[] {
  //   this._agreements = this.agreementsService.agreements;
  //   return this._agreements;
  // }

  get fulfilledAgreements(): number {
    let amount = 0;
    this.agreements.forEach((agreement) => {
      if (agreement.status === 'cumplido') amount++;
    });
    return amount;
  }

  get unfulfilledAgreements(): number {
    let amount = 0;
    this.agreements.forEach((agreement) => {
      if (agreement.status === 'incumplido') amount++;
    });
    return amount;
  }

  get inProcessAgreements(): number {
    let amount = 0;
    this.agreements.forEach((agreement) => {
      if (agreement.status === 'en proceso') amount++;
    });
    return amount;
  }

  get canceledAgreements(): number {
    let amount = 0;
    this.agreements.forEach((agreement) => {
      if (agreement.status === 'anulado') amount++;
    });
    return amount;
  }

  constructor(
    private agreementsService: AgreementsService,
    private router: Router
  ) {}
  ngOnInit(): void {
    // this.agreements = this.agreementsService.agreements;
    this.agreementsService
      .getAll()
      .subscribe((resp) => (this.agreements = resp));
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

  // BUG: getStatus esta implementado 2 veces (se pueden meter en el servicio)
  // FIXME: actualizar el estado de cada acuerdo cada vez k se muestre la tabla
  getStatus(agreement: Agreement): string {
    if (agreement.agreementCompilanceDate.getTime() - new Date().getTime() >= 0)
      return 'en proceso';
    return 'incumplido';
  }

  // BUG: la tabla se recarga cadavez k escribe
  search(event: any): void {
    const value = event.target.value;
    this.agreements = [];
    this.agreementsService.getAll().subscribe((resp) =>
      resp.forEach((agreement) => {
        if (agreement.workArea.toLowerCase().includes(value)) {
          this.agreements.push(agreement);
        }
      })
    );
    // this.agreementsService.agreements.forEach((agreement) => {
    //   if (agreement.workArea.toLocaleLowerCase().includes(value))
    //     this.agreements.push(agreement);
    // });
  }

  navigate(): void {
    this.router.navigate(['./agregar']);
  }

  setRowColor(agreement: Agreement): string {
    if (agreement.status === 'cumplido') return 'completed';
    if (agreement.status === 'anulado') return 'removed';
    if (agreement.status === 'incumplido') return 'incomplete';
    return '';
  }

  print(event: any): void {
    console.log(event);
  }
}
