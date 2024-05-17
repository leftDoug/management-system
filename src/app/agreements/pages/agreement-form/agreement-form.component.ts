import { Component } from '@angular/core';
import { Agreement } from '../../interfaces/agreements.interface';
import { AgreementsService } from '../../services/agreements.service';

@Component({
  selector: 'app-agreement-form',
  templateUrl: './agreement-form.component.html',
  styleUrls: ['./agreement-form.component.css'],
})
export class AgreementFormComponent {
  newAgreement: Agreement = {
    number: 0,
    area: '',
    createdBy: '',
    date: '',
    description: '',
    completed: false,
  };

  constructor(private agreementsService: AgreementsService) {}

  create(): void {
    this.agreementsService.insert(this.newAgreement);
    console.log(this.newAgreement);
    this.clear();
  }

  clear(): void {
    this.newAgreement = {
      number: 0,
      area: '',
      createdBy: '',
      date: '',
      description: '',
      completed: false,
    };
  }
}
