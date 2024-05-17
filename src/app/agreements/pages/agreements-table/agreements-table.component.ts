import { Component } from '@angular/core';
import { Agreement } from '../../interfaces/agreements.interface';
import { AgreementsService } from '../../services/agreements.service';

@Component({
  selector: 'app-agreements-table',
  templateUrl: './agreements-table.component.html',
  styleUrls: ['./agreements-table.component.css'],
})
export class AgreementsTableComponent {
  removedAgreement: Agreement | undefined;

  deleteAgreement(agreement: Agreement): void {
    this.agreementsSrevice.remove(agreement.number);
  }

  get agreements(): Agreement[] {
    return this.agreementsSrevice.agreements;
  }

  constructor(private agreementsSrevice: AgreementsService) {}
}
