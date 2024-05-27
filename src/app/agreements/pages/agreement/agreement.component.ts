import { Component, OnInit } from '@angular/core';
import { Agreement } from '../../interfaces/agreements.interface';
import { ActivatedRoute } from '@angular/router';
import { AgreementsService } from '../../services/agreements.service';

@Component({
  selector: 'app-agreement',
  templateUrl: './agreement.component.html',
  styleUrls: ['./agreement.component.css'],
})
export class AgreementComponent implements OnInit {
  agreement: Agreement | undefined;

  constructor(
    private activatedRoute: ActivatedRoute,
    private agreementsService: AgreementsService
  ) {}

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(({ id }) => {
      this.agreement = this.agreementsService.agreements.find(
        (x) => x.number === parseInt(id)
      );
    });
  }

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
}
