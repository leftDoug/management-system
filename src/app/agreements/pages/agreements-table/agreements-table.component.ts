import { Component, OnInit } from '@angular/core';
import {
  Agreement,
  AgreementWithStatus,
  Status,
} from '../../interfaces/agreement.interface';
import { AgreementsService } from '../../services/agreements.service';
import { AreasService } from 'src/app/areas/services/areas.service';
import { MeetingsService } from 'src/app/meetings/services/meetings.service';
import { SessionsService } from 'src/app/sessions/services/sessions.service';
import { WorkersService } from 'src/app/workers/services/workers.service';
import { Area } from 'src/app/areas/interfaces/area.interface';
import { Meeting } from 'src/app/meetings/interfaces/meeting.interface';
import { Session } from 'src/app/sessions/interfaces/session.interface';
import { Worker } from 'src/app/workers/interfaces/worker.interface';
import { getSeverity } from 'src/app/shared/severity-status';
import { MessageService } from 'primeng/api';
import { AuthService } from 'src/app/auth/services/auth.service';

@Component({
  selector: 'app-agreements-table',
  templateUrl: './agreements-table.component.html',
  styleUrls: ['./agreements-table.component.css'],
})
export class AgreementsTableComponent implements OnInit {
  agreements: AgreementWithStatus[] = [];
  meetings: Meeting[] = [];
  status: Status[] = [
    Status.canceled,
    Status.fulfilled,
    Status.inProcess,
    Status.unfulfilled,
  ];
  today: Date = new Date();
  workers: Worker[] = [];

  constructor(
    private agreementsService: AgreementsService,
    private workersService: WorkersService,
    private meetingsService: MeetingsService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.workersService.getAll().subscribe((resp) => {
      this.workers = resp;
      this.workers.sort((a, b) => a.name.localeCompare(b.name));
    });
    this.meetingsService.getAll().subscribe((resp) => {
      this.meetings = resp;
      this.meetings.sort((a, b) => a.name.localeCompare(b.name));
    });

    this.agreementsService.getAll().subscribe((resp) => {
      let a: AgreementWithStatus[] = [];

      resp.forEach((value) => {
        const agreement: AgreementWithStatus = {
          id: value.id,
          number: value.number,
          content: value.content,
          responsible: this.workers.find(
            (worker) => worker.id === value.FK_idResponsible
          )?.name!,
          meeting: this.meetings.find(
            (meeting) => meeting.id === value.FK_idMeeting
          )?.name!,
          status: this.getStatus(value),
        };

        a.push(agreement);
      });

      this.agreements = a;
    });
  }

  get user() {
    return this.authService.user;
  }

  get fulfilledAgreements(): number {
    let amount = 0;

    this.agreements.forEach((agreement) => {
      if (agreement.status === Status.fulfilled) amount++;
    });

    return amount;
  }

  get unfulfilledAgreements(): number {
    let amount = 0;

    this.agreements.forEach((agreement) => {
      if (agreement.status === Status.unfulfilled) amount++;
    });

    return amount;
  }

  get inProcessAgreements(): number {
    let amount = 0;

    this.agreements.forEach((agreement) => {
      if (agreement.status === Status.inProcess) amount++;
    });

    return amount;
  }

  get canceledAgreements(): number {
    let amount = 0;

    this.agreements.forEach((agreement) => {
      if (agreement.status === Status.canceled) amount++;
    });

    return amount;
  }

  getStatus(agreement: Agreement): Status {
    const date: Date = new Date(agreement.compilanceDate);

    if (agreement.completed) {
      return Status.fulfilled;
    } else if (agreement.canceled) {
      return Status.canceled;
    } else if (this.today.getTime() < date.getTime()) {
      return Status.inProcess;
    } else {
      return Status.unfulfilled;
    }
  }

  setSeverity(status: Status) {
    return getSeverity(null, status);
  }
}
