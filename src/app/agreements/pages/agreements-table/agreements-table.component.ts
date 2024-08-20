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

@Component({
  selector: 'app-agreements-table',
  templateUrl: './agreements-table.component.html',
  styleUrls: ['./agreements-table.component.css'],
})
export class AgreementsTableComponent implements OnInit {
  agreements: AgreementWithStatus[] = [];
  areas: Area[] = [];
  meetings: Meeting[] = [];
  sessions: Session[] = [];
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
    private areasService: AreasService,
    private workersService: WorkersService,
    private meetingsService: MeetingsService,
    private sessionsService: SessionsService
  ) {}

  ngOnInit(): void {
    this.areasService.getAll().subscribe((resp) => {
      this.areas = resp;
      this.areas.sort((a, b) => a.name.localeCompare(b.name));
    });
    this.workersService.getAll().subscribe((resp) => {
      this.workers = resp;
      this.workers.sort((a, b) => a.name.localeCompare(b.name));
    });
    this.meetingsService.getAll().subscribe((resp) => {
      this.meetings = resp;
      this.meetings.sort((a, b) => a.name.localeCompare(b.name));
    });
    this.sessionsService.getAll().subscribe((resp) => {
      this.sessions = resp;
      this.sessions.sort((a, b) => a.name.localeCompare(b.name));
    });

    this.agreementsService.getAll().subscribe((resp) => {
      resp.forEach((value) => {
        const agreement: AgreementWithStatus = {
          id: value.id,
          number: value.number,
          content: value.content,
          area: this.areas.find((area) => area.id === value.FK_idArea)?.name!,
          responsible: this.workers.find(
            (worker) => worker.id === value.FK_idResponsible
          )?.name!,
          meeting: this.meetings.find(
            (meeting) => meeting.id === value.FK_idMeeting
          )?.name!,
          session: this.sessions.find(
            (session) => session.id === value.FK_idSession
          )?.name!,
          meetingDate: value.meetingDate,
          status: this.getStatus(value),
        };

        this.agreements.push(agreement);
      });
    });
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
